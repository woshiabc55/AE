import http from "http";
import { AIService } from "./ai-service";
import { ConfigManager } from "../core/config-manager";
import { PluginSystem } from "../core/plugin-system";
import { globalLogger } from "../core/logger";
import { globalEventBus } from "../core/event-bus";
import { createRouter, APIRouter } from "./api/routes";

interface BackendConfig {
  port: number;
  host: string;
  corsEnabled: boolean;
  maxRequestSize: number;
}

interface BackendState {
  initialized: boolean;
  serverRunning: boolean;
  startTime: number | null;
  requestCount: number;
}

class BackendService {
  private aiService: AIService;
  private router: APIRouter;
  private server: http.Server | null;
  private state: BackendState;
  private config: BackendConfig;

  constructor() {
    this.aiService = new AIService();
    this.router = createRouter(this.aiService);
    this.server = null;
    this.state = {
      initialized: false,
      serverRunning: false,
      startTime: null,
      requestCount: 0,
    };
    this.config = {
      port: 8765,
      host: "localhost",
      corsEnabled: true,
      maxRequestSize: 10 * 1024 * 1024,
    };
  }

  async initialize(
    configManager: ConfigManager,
    pluginSystem: PluginSystem
  ): Promise<void> {
    if (this.state.initialized) {
      globalLogger.warn("Backend service already initialized");
      return;
    }

    const port = configManager.get<number>("backend.port", 8765);
    const host = configManager.get<string>("backend.host", "localhost");
    const corsEnabled = configManager.get<boolean>("backend.corsEnabled", true);

    this.config = { ...this.config, port, host, corsEnabled };

    this.setupEventListeners(pluginSystem);

    await this.startServer();

    this.state.initialized = true;
    this.state.startTime = Date.now();

    globalEventBus.emit("backend:initialized");
    globalLogger.info("Backend service initialized", { port, host });
  }

  async shutdown(): Promise<void> {
    if (this.server) {
      await new Promise<void>((resolve, reject) => {
        this.server!.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
      this.server = null;
      this.state.serverRunning = false;
    }

    this.state.initialized = false;
    globalEventBus.emit("backend:shutdown");
    globalLogger.info("Backend service shut down");
  }

  getAIService(): AIService {
    return this.aiService;
  }

  getState(): BackendState {
    return { ...this.state };
  }

  getConfig(): BackendConfig {
    return { ...this.config };
  }

  private async startServer(): Promise<void> {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    await new Promise<void>((resolve, reject) => {
      this.server!.listen(this.config.port, this.config.host, () => {
        resolve();
      });
      this.server!.on("error", (err) => {
        reject(err);
      });
    });

    this.state.serverRunning = true;
    globalLogger.info(`HTTP server started on ${this.config.host}:${this.config.port}`);
  }

  private handleRequest(req: http.IncomingMessage, res: http.ServerResponse): void {
    this.state.requestCount++;

    if (this.config.corsEnabled) {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    }

    if (req.method === "OPTIONS") {
      res.writeHead(204);
      res.end();
      return;
    }

    const url = new URL(req.url ?? "/", `http://${req.headers.host}`);
    const route = this.router.match(req.method ?? "GET", url.pathname);

    if (!route) {
      this.sendJson(res, 404, { error: "Not Found" });
      return;
    }

    this.readBody(req)
      .then((body) => {
        const context: RequestHandlerContext = {
          method: req.method ?? "GET",
          path: url.pathname,
          query: Object.fromEntries(url.searchParams.entries()),
          body: body ? JSON.parse(body) : null,
          headers: req.headers as Record<string, string>,
        };
        return route.handler(context);
      })
      .then((result) => {
        this.sendJson(res, result.statusCode, result.body);
      })
      .catch((err: Error) => {
        globalLogger.error("Request handler error", { error: err.message });
        this.sendJson(res, 500, { error: "Internal Server Error" });
      });
  }

  private readBody(req: http.IncomingMessage): Promise<string | null> {
    return new Promise((resolve) => {
      let body = "";
      let size = 0;
      req.on("data", (chunk: Buffer) => {
        size += chunk.length;
        if (size > this.config.maxRequestSize) {
          req.destroy();
          resolve(null);
          return;
        }
        body += chunk.toString();
      });
      req.on("end", () => {
        resolve(body || null);
      });
      req.on("error", () => {
        resolve(null);
      });
    });
  }

  private sendJson(res: http.ServerResponse, statusCode: number, body: unknown): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(body));
  }

  private setupEventListeners(_pluginSystem: PluginSystem): void {
    globalEventBus.on("training:epoch-end", (payload: unknown) => {
      const data = payload as { id: string; epoch: number; metrics: { loss: number; accuracy: number } };
      globalLogger.debug(`Training epoch completed`, {
        id: data.id,
        epoch: data.epoch,
      });
    });

    globalEventBus.on("model:loaded", (payload: unknown) => {
      const data = payload as { id: string };
      globalLogger.info(`Model loaded event: ${data.id}`);
    });
  }
}

interface RequestHandlerContext {
  method: string;
  path: string;
  query: Record<string, string>;
  body: unknown;
  headers: Record<string, string>;
}

export { BackendService };
export type { BackendConfig, BackendState, RequestHandlerContext };
