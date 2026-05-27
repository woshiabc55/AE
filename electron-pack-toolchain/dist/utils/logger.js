"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
exports.setLogLevel = setLogLevel;
const chalk_1 = __importDefault(require("chalk"));
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
    LogLevel[LogLevel["SILENT"] = 4] = "SILENT";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
let currentLevel = LogLevel.INFO;
function setLogLevel(level) {
    currentLevel = level;
}
function timestamp() {
    return new Date().toLocaleTimeString('zh-CN', { hour12: false });
}
exports.logger = {
    debug(message, ...args) {
        if (currentLevel <= LogLevel.DEBUG) {
            console.log(chalk_1.default.gray(`[${timestamp()}] DEBUG:`), message, ...args);
        }
    },
    info(message, ...args) {
        if (currentLevel <= LogLevel.INFO) {
            console.log(chalk_1.default.cyan(`[${timestamp()}] INFO:`), message, ...args);
        }
    },
    success(message, ...args) {
        if (currentLevel <= LogLevel.INFO) {
            console.log(chalk_1.default.green(`[${timestamp()}] ✓`), message, ...args);
        }
    },
    warn(message, ...args) {
        if (currentLevel <= LogLevel.WARN) {
            console.log(chalk_1.default.yellow(`[${timestamp()}] ⚠`), message, ...args);
        }
    },
    error(message, ...args) {
        if (currentLevel <= LogLevel.ERROR) {
            console.log(chalk_1.default.red(`[${timestamp()}] ✗`), message, ...args);
        }
    },
    step(stepName, message) {
        if (currentLevel <= LogLevel.INFO) {
            console.log(chalk_1.default.magenta(`[${timestamp()}] ▶ ${stepName}:`), message);
        }
    },
};
//# sourceMappingURL=logger.js.map