"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = downloadFile;
exports.verifyFileHash = verifyFileHash;
exports.getElectronDownloadUrl = getElectronDownloadUrl;
exports.getElectronCacheDir = getElectronCacheDir;
const crypto_1 = __importDefault(require("crypto"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const url_1 = require("url");
const logger_1 = require("./logger");
const fs_2 = require("./fs");
async function downloadFile(url, destPath, onProgress) {
    await (0, fs_2.ensureDir)(path_1.default.dirname(destPath));
    const tempPath = destPath + '.download';
    try {
        await downloadWithRedirects(url, tempPath, onProgress, 5);
        await fs_extra_1.default.move(tempPath, destPath, { overwrite: true });
        logger_1.logger.debug(`Downloaded: ${url} → ${destPath}`);
    }
    catch (err) {
        await fs_extra_1.default.remove(tempPath).catch(() => { });
        throw new Error(`Failed to download ${url}: ${err.message}`);
    }
}
function downloadWithRedirects(url, destPath, onProgress, maxRedirects = 5) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https_1.default : http_1.default;
        const request = protocol.get(url, {
            headers: {
                'User-Agent': 'electron-pack-toolchain/1.0.0',
            },
        }, (response) => {
            if (response.statusCode &&
                response.statusCode >= 300 &&
                response.statusCode < 400 &&
                response.headers.location) {
                if (maxRedirects <= 0) {
                    reject(new Error('Too many redirects'));
                    return;
                }
                const redirectUrl = new url_1.URL(response.headers.location, url).toString();
                downloadWithRedirects(redirectUrl, destPath, onProgress, maxRedirects - 1)
                    .then(resolve)
                    .catch(reject);
                return;
            }
            if (response.statusCode && response.statusCode >= 400) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            const total = parseInt(response.headers['content-length'] || '0', 10);
            let transferred = 0;
            const fileStream = (0, fs_1.createWriteStream)(destPath);
            response.on('data', (chunk) => {
                transferred += chunk.length;
                if (onProgress && total > 0) {
                    onProgress({
                        percent: transferred / total,
                        transferred,
                        total,
                    });
                }
            });
            response.on('error', (err) => {
                fileStream.destroy();
                reject(err);
            });
            fileStream.on('error', (err) => {
                response.destroy();
                reject(err);
            });
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
            response.pipe(fileStream);
        });
        request.on('error', reject);
        request.setTimeout(60000, () => {
            request.destroy();
            reject(new Error('Download timeout'));
        });
    });
}
async function verifyFileHash(filePath, expectedHash, algorithm = 'sha256') {
    const fileBuffer = await fs_extra_1.default.readFile(filePath);
    const hash = crypto_1.default.createHash(algorithm).update(fileBuffer).digest('hex');
    const matches = hash === expectedHash;
    if (!matches) {
        logger_1.logger.warn(`Hash mismatch for ${filePath}: expected ${expectedHash}, got ${hash}`);
    }
    return matches;
}
function getElectronDownloadUrl(version, platform, arch, mirror) {
    const baseMirror = mirror || 'https://github.com/electron/electron/releases/download/';
    const platformArch = getPlatformArchName(platform, arch);
    const filename = `electron-v${version}-${platformArch}.zip`;
    return `${baseMirror}v${version}/${filename}`;
}
function getPlatformArchName(platform, arch) {
    const platformMap = {
        win32: { x64: 'win32-x64', ia32: 'win32-ia32', arm64: 'win32-arm64' },
        darwin: { x64: 'darwin-x64', arm64: 'darwin-arm64' },
        linux: { x64: 'linux-x64', ia32: 'linux-ia32', arm64: 'linux-arm64' },
    };
    return platformMap[platform]?.[arch] || `${platform}-${arch}`;
}
function getElectronCacheDir() {
    const homeDir = process.env.HOME || process.env.USERPROFILE || '/tmp';
    return path_1.default.join(homeDir, '.cache', 'electron-pack-toolchain');
}
//# sourceMappingURL=download.js.map