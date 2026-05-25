enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: number;
  context: Record<string, unknown>;
  module: string;
}

interface LogTransport {
  name: string;
  log(entry: LogEntry): void | Promise<void>;
  flush?(): void | Promise<void>;
  close?(): void | Promise<void>;
}

interface LoggerOptions {
  level: LogLevel;
  module: string;
  maxFileSize: number;
  maxFiles: number;
  transports: LogTransport[];
}

interface StructuredData {
  [key: string]: unknown;
}

class ConsoleTransport implements LogTransport {
  name = "console";

  log(entry: LogEntry): void {
    const timestamp = new Date(entry.timestamp).toISOString();
    const levelStr = LogLevel[entry.level];
    const contextStr =
      Object.keys(entry.context).length > 0
        ? ` ${JSON.stringify(entry.context)}`
        : "";
    const output = `[${timestamp}] [${levelStr}] [${entry.module}] ${entry.message}${contextStr}`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(output);
        break;
      case LogLevel.INFO:
        console.info(output);
        break;
      case LogLevel.WARN:
        console.warn(output);
        break;
      case LogLevel.ERROR:
        console.error(output);
        break;
    }
  }
}

class FileTransport implements LogTransport {
  name = "file";
  private filePath: string;
  private buffer: LogEntry[] = [];
  private bufferSize: number;
  private currentSize: number = 0;
  private maxFileSize: number;
  private maxFiles: number;
  private fileIndex: number = 0;

  constructor(
    filePath: string,
    maxFileSize: number = 10 * 1024 * 1024,
    maxFiles: number = 5,
    bufferSize: number = 100
  ) {
    this.filePath = filePath;
    this.maxFileSize = maxFileSize;
    this.maxFiles = maxFiles;
    this.bufferSize = bufferSize;
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry);
    this.currentSize += JSON.stringify(entry).length;
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
    if (this.currentSize >= this.maxFileSize) {
      this.rotate();
    }
  }

  flush(): void {
    if (this.buffer.length === 0) return;
    const output = this.buffer
      .map((entry) => {
        const timestamp = new Date(entry.timestamp).toISOString();
        const levelStr = LogLevel[entry.level];
        const contextStr =
          Object.keys(entry.context).length > 0
            ? ` ${JSON.stringify(entry.context)}`
            : "";
        return `[${timestamp}] [${levelStr}] [${entry.module}] ${entry.message}${contextStr}`;
      })
      .join("\n");
    this.buffer = [];
  }

  private rotate(): void {
    this.fileIndex = (this.fileIndex + 1) % this.maxFiles;
    this.currentSize = 0;
    this.buffer = [];
  }

  close(): void {
    this.flush();
  }
}

class RemoteTransport implements LogTransport {
  name = "remote";
  private endpoint: string;
  private buffer: LogEntry[] = [];
  private bufferSize: number;
  private flushInterval: ReturnType<typeof setInterval>;

  constructor(endpoint: string, bufferSize: number = 50, flushIntervalMs: number = 5000) {
    this.endpoint = endpoint;
    this.bufferSize = bufferSize;
    this.flushInterval = setInterval(() => this.flush(), flushIntervalMs);
  }

  log(entry: LogEntry): void {
    this.buffer.push(entry);
    if (this.buffer.length >= this.bufferSize) {
      this.flush();
    }
  }

  async flush(): Promise<void> {
    if (this.buffer.length === 0) return;
    const entries = [...this.buffer];
    this.buffer = [];
    try {
      await fetch(this.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logs: entries }),
      });
    } catch {
      this.buffer.unshift(...entries);
    }
  }

  async close(): Promise<void> {
    clearInterval(this.flushInterval);
    await this.flush();
  }
}

class Logger {
  private options: LoggerOptions;
  private static defaultOptions: Partial<LoggerOptions> = {
    level: LogLevel.INFO,
    maxFileSize: 10 * 1024 * 1024,
    maxFiles: 5,
    transports: [new ConsoleTransport()],
  };

  constructor(options: Partial<LoggerOptions> = {}) {
    this.options = {
      ...Logger.defaultOptions,
      ...options,
      transports: options.transports ?? Logger.defaultOptions.transports!,
    } as LoggerOptions;
  }

  child(module: string): Logger {
    return new Logger({
      ...this.options,
      module: `${this.options.module}:${module}`,
    });
  }

  debug(message: string, context: StructuredData = {}): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context: StructuredData = {}): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context: StructuredData = {}): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context: StructuredData = {}): void {
    this.log(LogLevel.ERROR, message, context);
  }

  private log(level: LogLevel, message: string, context: StructuredData): void {
    if (level < this.options.level) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: Date.now(),
      context,
      module: this.options.module,
    };

    for (const transport of this.options.transports) {
      try {
        transport.log(entry);
      } catch (err) {
        console.error(`Log transport "${transport.name}" failed:`, err);
      }
    }
  }

  async flush(): Promise<void> {
    const flushPromises = this.options.transports.map((transport) =>
      transport.flush ? transport.flush() : Promise.resolve()
    );
    await Promise.all(flushPromises);
  }

  async close(): Promise<void> {
    const closePromises = this.options.transports.map((transport) =>
      transport.close ? transport.close() : Promise.resolve()
    );
    await Promise.all(closePromises);
  }

  setLevel(level: LogLevel): void {
    this.options.level = level;
  }

  getLevel(): LogLevel {
    return this.options.level;
  }

  addTransport(transport: LogTransport): void {
    this.options.transports.push(transport);
  }

  removeTransport(name: string): void {
    this.options.transports = this.options.transports.filter(
      (t) => t.name !== name
    );
  }
}

const globalLogger = new Logger({ module: "app" });

export {
  Logger,
  globalLogger,
  ConsoleTransport,
  FileTransport,
  RemoteTransport,
  LogLevel,
};
export type { LogEntry, LogTransport, LoggerOptions, StructuredData };
