"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDir = ensureDir;
exports.copyFiles = copyFiles;
exports.cleanDir = cleanDir;
exports.fileExists = fileExists;
exports.readFile = readFile;
exports.writeFile = writeFile;
exports.readJson = readJson;
exports.writeJson = writeJson;
exports.resolvePath = resolvePath;
exports.getDirectorySize = getDirectorySize;
exports.formatBytes = formatBytes;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const glob_1 = __importDefault(require("glob"));
const logger_1 = require("./logger");
async function ensureDir(dirPath) {
    await fs_extra_1.default.ensureDir(dirPath);
}
async function copyFiles(source, target, patterns, excludePatterns = []) {
    const copiedFiles = [];
    for (const pattern of patterns) {
        const files = glob_1.default.sync(pattern, {
            cwd: source,
            nodir: true,
            ignore: [
                'node_modules/**',
                '.git/**',
                'dist/**',
                'release/**',
                ...excludePatterns,
            ],
        });
        for (const file of files) {
            const srcPath = path_1.default.join(source, file);
            const destPath = path_1.default.join(target, file);
            await fs_extra_1.default.ensureDir(path_1.default.dirname(destPath));
            await fs_extra_1.default.copy(srcPath, destPath);
            copiedFiles.push(file);
        }
    }
    return copiedFiles;
}
async function cleanDir(dirPath) {
    if (await fs_extra_1.default.pathExists(dirPath)) {
        await fs_extra_1.default.emptyDir(dirPath);
        logger_1.logger.debug(`Cleaned directory: ${dirPath}`);
    }
}
async function fileExists(filePath) {
    return fs_extra_1.default.pathExists(filePath);
}
async function readFile(filePath) {
    return fs_extra_1.default.readFile(filePath, 'utf-8');
}
async function writeFile(filePath, content) {
    await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
    await fs_extra_1.default.writeFile(filePath, content, 'utf-8');
}
async function readJson(filePath) {
    return fs_extra_1.default.readJson(filePath);
}
async function writeJson(filePath, data, pretty = true) {
    await fs_extra_1.default.ensureDir(path_1.default.dirname(filePath));
    await fs_extra_1.default.writeJson(filePath, data, { spaces: pretty ? 2 : 0 });
}
function resolvePath(basePath, targetPath) {
    return path_1.default.isAbsolute(targetPath) ? targetPath : path_1.default.resolve(basePath, targetPath);
}
async function getDirectorySize(dirPath) {
    let totalSize = 0;
    const entries = await fs_extra_1.default.readdir(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path_1.default.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            totalSize += await getDirectorySize(fullPath);
        }
        else {
            const stat = await fs_extra_1.default.stat(fullPath);
            totalSize += stat.size;
        }
    }
    return totalSize;
}
function formatBytes(bytes) {
    if (bytes === 0)
        return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
//# sourceMappingURL=fs.js.map