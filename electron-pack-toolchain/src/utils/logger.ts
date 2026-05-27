import chalk from 'chalk';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SILENT = 4,
}

let currentLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function timestamp(): string {
  return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}

export const logger = {
  debug(message: string, ...args: unknown[]): void {
    if (currentLevel <= LogLevel.DEBUG) {
      console.log(chalk.gray(`[${timestamp()}] DEBUG:`), message, ...args);
    }
  },

  info(message: string, ...args: unknown[]): void {
    if (currentLevel <= LogLevel.INFO) {
      console.log(chalk.cyan(`[${timestamp()}] INFO:`), message, ...args);
    }
  },

  success(message: string, ...args: unknown[]): void {
    if (currentLevel <= LogLevel.INFO) {
      console.log(chalk.green(`[${timestamp()}] ✓`), message, ...args);
    }
  },

  warn(message: string, ...args: unknown[]): void {
    if (currentLevel <= LogLevel.WARN) {
      console.log(chalk.yellow(`[${timestamp()}] ⚠`), message, ...args);
    }
  },

  error(message: string, ...args: unknown[]): void {
    if (currentLevel <= LogLevel.ERROR) {
      console.log(chalk.red(`[${timestamp()}] ✗`), message, ...args);
    }
  },

  step(stepName: string, message: string): void {
    if (currentLevel <= LogLevel.INFO) {
      console.log(chalk.magenta(`[${timestamp()}] ▶ ${stepName}:`), message);
    }
  },
};
