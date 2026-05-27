"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppImageBuilder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const archiver_1 = __importDefault(require("archiver"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class AppImageBuilder {
    config;
    constructor(config) {
        this.config = config;
    }
    async build(appDir, outputDir) {
        logger_1.logger.step('AppImage', 'Building Linux AppImage...');
        const appImageDir = path_1.default.join(outputDir, 'appimage');
        await (0, fs_1.ensureDir)(appImageDir);
        const appDirStructure = await this.createAppDirStructure(appDir, appImageDir);
        await this.createDesktopEntry(appDirStructure);
        await this.copyIcons(appDirStructure);
        const appImageName = `${this.config.productName}-${this.config.version}-x86_64.AppImage`;
        const appImagePath = path_1.default.join(appImageDir, appImageName);
        const appimagetoolPath = await this.findAppimagetool();
        if (!appimagetoolPath) {
            logger_1.logger.warn('appimagetool not found. Creating AppDir structure only.');
            logger_1.logger.info(`AppDir created at: ${appDirStructure}`);
            logger_1.logger.info('Install appimagetool (https://github.com/AppImage/AppImageKit) to build the AppImage.');
            return { appImagePath: appDirStructure, size: '0 B' };
        }
        try {
            await execFileAsync(appimagetoolPath, [appDirStructure, appImagePath], {
                timeout: 300000,
                env: { ...process.env, ARCH: 'x86_64' },
            });
            if (await fs_extra_1.default.pathExists(appImagePath)) {
                const stat = await fs_extra_1.default.stat(appImagePath);
                const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
                logger_1.logger.success(`AppImage created: ${appImagePath} (${sizeMB} MB)`);
                return { appImagePath, size: `${sizeMB} MB` };
            }
            throw new Error('AppImage file not found after build');
        }
        catch (err) {
            logger_1.logger.error(`AppImage build failed: ${err.message}`);
            logger_1.logger.info('Falling back to tar.gz archive...');
            const tarPath = await this.createTarGz(appDir, appImageDir);
            return { appImagePath: tarPath, size: await this.getFileSize(tarPath) };
        }
    }
    async createAppDirStructure(appDir, outputDir) {
        const appDirName = `${this.config.productName}.AppDir`;
        const appDirPath = path_1.default.join(outputDir, appDirName);
        await (0, fs_1.ensureDir)(appDirPath);
        await (0, fs_1.ensureDir)(path_1.default.join(appDirPath, 'usr', 'bin'));
        await (0, fs_1.ensureDir)(path_1.default.join(appDirPath, 'usr', 'lib'));
        await (0, fs_1.ensureDir)(path_1.default.join(appDirPath, 'usr', 'share', 'applications'));
        await (0, fs_1.ensureDir)(path_1.default.join(appDirPath, 'usr', 'share', 'icons', 'hicolor'));
        await fs_extra_1.default.copy(appDir, path_1.default.join(appDirPath, 'usr'), {
            filter: (src) => {
                const basename = path_1.default.basename(src);
                return !basename.startsWith('.');
            },
        });
        const executableName = this.config.linux?.executableName ||
            this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const electronExe = path_1.default.join(appDir, 'electron');
        if (await fs_extra_1.default.pathExists(electronExe)) {
            await fs_extra_1.default.copy(electronExe, path_1.default.join(appDirPath, executableName));
            await fs_extra_1.default.chmod(path_1.default.join(appDirPath, executableName), 0o755);
        }
        const appRunScript = `#!/bin/bash
SELF=\$(readlink -f "\$0")
HERE=\$(dirname "\$SELF")
export PATH="\${HERE}/usr/bin:\${PATH}"
export LD_LIBRARY_PATH="\${HERE}/usr/lib:\${LD_LIBRARY_PATH}"
exec "\${HERE}/${executableName}" "\$@"
`;
        await fs_extra_1.default.writeFile(path_1.default.join(appDirPath, 'AppRun'), appRunScript);
        await fs_extra_1.default.chmod(path_1.default.join(appDirPath, 'AppRun'), 0o755);
        return appDirPath;
    }
    async createDesktopEntry(appDirPath) {
        const executableName = this.config.linux?.executableName ||
            this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const appImageConfig = this.config.appImage || {};
        const desktopEntry = `[Desktop Entry]
Type=Application
Name=${this.config.productName}
Exec=${executableName}
Icon=${executableName}
Categories=${this.config.linux?.category || appImageConfig.category || 'Utility'}
${this.config.description ? `Comment=${this.config.description}` : ''}
Terminal=false
StartupNotify=true
${appImageConfig.desktop ? Object.entries(appImageConfig.desktop).map(([k, v]) => `${k}=${v}`).join('\n') : ''}`;
        await fs_extra_1.default.writeFile(path_1.default.join(appDirPath, `${executableName}.desktop`), desktopEntry);
        logger_1.logger.debug('Created desktop entry for AppImage');
    }
    async copyIcons(appDirPath) {
        const executableName = this.config.linux?.executableName ||
            this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const buildResourcesDir = this.config.directories.buildResources;
        const iconSizes = [16, 24, 32, 48, 64, 128, 256, 512];
        let iconCopied = false;
        for (const size of iconSizes) {
            const iconPath = path_1.default.join(buildResourcesDir, 'icons', `${size}x${size}.png`);
            if (await fs_extra_1.default.pathExists(iconPath)) {
                const destDir = path_1.default.join(appDirPath, 'usr', 'share', 'icons', 'hicolor', `${size}x${size}`, 'apps');
                await (0, fs_1.ensureDir)(destDir);
                await fs_extra_1.default.copy(iconPath, path_1.default.join(destDir, `${executableName}.png`));
                iconCopied = true;
            }
        }
        if (!iconCopied) {
            const defaultIcon = path_1.default.join(buildResourcesDir, 'icon.png');
            if (await fs_extra_1.default.pathExists(defaultIcon)) {
                await fs_extra_1.default.copy(defaultIcon, path_1.default.join(appDirPath, `${executableName}.png`));
            }
        }
    }
    async createTarGz(appDir, outputDir) {
        const tarName = `${this.config.productName}-${this.config.version}-linux-x64.tar.gz`;
        const tarPath = path_1.default.join(outputDir, tarName);
        return new Promise((resolve, reject) => {
            const output = fs_extra_1.default.createWriteStream(tarPath);
            const archive = (0, archiver_1.default)('tar', { gzip: true, gzipOptions: { level: 9 } });
            output.on('close', () => {
                logger_1.logger.success(`Tarball created: ${tarPath}`);
                resolve(tarPath);
            });
            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            archive.directory(appDir, this.config.productName);
            archive.finalize();
        });
    }
    async findAppimagetool() {
        const candidates = [
            'appimagetool',
            '/usr/bin/appimagetool',
            '/usr/local/bin/appimagetool',
        ];
        for (const candidate of candidates) {
            try {
                await execFileAsync(candidate, ['--version'], { timeout: 5000 });
                return candidate;
            }
            catch {
                continue;
            }
        }
        return null;
    }
    async getFileSize(filePath) {
        const stat = await fs_extra_1.default.stat(filePath);
        return `${(stat.size / 1024 / 1024).toFixed(2)} MB`;
    }
}
exports.AppImageBuilder = AppImageBuilder;
//# sourceMappingURL=appimage.js.map