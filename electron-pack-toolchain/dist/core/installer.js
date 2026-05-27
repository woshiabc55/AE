"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstallerBuilder = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const nsis_1 = require("../plugins/nsis");
const dmg_1 = require("../plugins/dmg");
const appimage_1 = require("../plugins/appimage");
class InstallerBuilder {
    config;
    constructor(config) {
        this.config = config;
    }
    async build(packageResult, installerType) {
        const { platform, arch, outputDir } = packageResult;
        const resolvedType = installerType || this.getDefaultInstallerType(platform);
        logger_1.logger.step('Installer', `Building ${resolvedType} installer for ${platform}-${arch}`);
        const installerOutputDir = path_1.default.join(this.config.directories.output, 'installers');
        await (0, fs_1.ensureDir)(installerOutputDir);
        let result;
        switch (resolvedType) {
            case 'nsis':
                result = await this.buildNsis(outputDir, installerOutputDir);
                break;
            case 'dmg':
                result = await this.buildDmg(outputDir, installerOutputDir);
                break;
            case 'appimage':
                result = await this.buildAppImage(outputDir, installerOutputDir);
                break;
            case 'deb':
                result = await this.buildDeb(outputDir, installerOutputDir, arch);
                break;
            case 'rpm':
                result = await this.buildRpm(outputDir, installerOutputDir, arch);
                break;
            default:
                logger_1.logger.warn(`Unsupported installer type: ${resolvedType}, creating archive instead`);
                result = await this.buildArchive(outputDir, installerOutputDir, platform, arch);
        }
        logger_1.logger.success(`${resolvedType} installer created: ${result.outputPath} (${result.size})`);
        return {
            platform,
            arch,
            installerType: resolvedType,
            outputPath: result.outputPath,
            size: result.size,
        };
    }
    getDefaultInstallerType(platform) {
        switch (platform) {
            case 'win32':
                return 'nsis';
            case 'darwin':
                return 'dmg';
            case 'linux':
                return 'appimage';
        }
    }
    async buildNsis(appDir, outputDir) {
        const builder = new nsis_1.NsisBuilder(this.config);
        const result = await builder.build(appDir, outputDir);
        return { outputPath: result.installerPath, size: result.size };
    }
    async buildDmg(appDir, outputDir) {
        const builder = new dmg_1.DmgBuilder(this.config);
        const result = await builder.build(appDir, outputDir);
        return { outputPath: result.dmgPath, size: result.size };
    }
    async buildAppImage(appDir, outputDir) {
        const builder = new appimage_1.AppImageBuilder(this.config);
        const result = await builder.build(appDir, outputDir);
        return { outputPath: result.appImagePath, size: result.size };
    }
    async buildDeb(appDir, outputDir, arch) {
        logger_1.logger.step('DEB', 'Building Debian package...');
        const debDir = path_1.default.join(outputDir, 'deb');
        await (0, fs_1.ensureDir)(debDir);
        const packageName = this.config.linux?.executableName ||
            this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const debArch = arch === 'x64' ? 'amd64' : arch === 'arm64' ? 'arm64' : 'i386';
        const debName = `${packageName}_${this.config.version}_${debArch}.deb`;
        const debPath = path_1.default.join(debDir, debName);
        const stagingDir = path_1.default.join(debDir, 'staging');
        await fs_extra_1.default.emptyDir(stagingDir);
        const installDir = `/opt/${packageName}`;
        const dataDir = path_1.default.join(stagingDir, installDir.slice(1));
        await (0, fs_1.ensureDir)(dataDir);
        await fs_extra_1.default.copy(appDir, dataDir);
        const debianDir = path_1.default.join(stagingDir, 'DEBIAN');
        await (0, fs_1.ensureDir)(debianDir);
        const controlContent = `Package: ${packageName}
Version: ${this.config.version}
Section: utils
Priority: optional
Architecture: ${debArch}
Installed-Size: ${await this.estimateInstalledSize(dataDir)}
Maintainer: ${this.config.copyright || 'Unknown'}
Description: ${this.config.description || this.config.productName}
`;
        await fs_extra_1.default.writeFile(path_1.default.join(debianDir, 'control'), controlContent);
        const postinstContent = `#!/bin/bash
chmod +x ${installDir}/${packageName}
ln -sf ${installDir}/${packageName} /usr/local/bin/${packageName}
`;
        await fs_extra_1.default.writeFile(path_1.default.join(debianDir, 'postinst'), postinstContent);
        await fs_extra_1.default.chmod(path_1.default.join(debianDir, 'postinst'), 0o755);
        const prermContent = `#!/bin/bash
rm -f /usr/local/bin/${packageName}
`;
        await fs_extra_1.default.writeFile(path_1.default.join(debianDir, 'prerm'), prermContent);
        await fs_extra_1.default.chmod(path_1.default.join(debianDir, 'prerm'), 0o755);
        try {
            const { execFile } = await Promise.resolve().then(() => __importStar(require('child_process')));
            const { promisify } = await Promise.resolve().then(() => __importStar(require('util')));
            const execFileAsync = promisify(execFile);
            await execFileAsync('dpkg-deb', ['--build', stagingDir, debPath], {
                timeout: 300000,
            });
            await fs_extra_1.default.remove(stagingDir);
            if (await fs_extra_1.default.pathExists(debPath)) {
                const stat = await fs_extra_1.default.stat(debPath);
                const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
                logger_1.logger.success(`Debian package created: ${debPath} (${sizeMB} MB)`);
                return { outputPath: debPath, size: `${sizeMB} MB` };
            }
        }
        catch (err) {
            logger_1.logger.warn(`dpkg-deb not available: ${err.message}`);
            logger_1.logger.info('Install dpkg-dev to build .deb packages on this system.');
        }
        return { outputPath: stagingDir, size: '0 B' };
    }
    async buildRpm(appDir, outputDir, arch) {
        logger_1.logger.step('RPM', 'Building RPM package...');
        logger_1.logger.warn('RPM building is not yet fully implemented. Creating archive instead.');
        return this.buildArchive(appDir, outputDir, 'linux', arch);
    }
    async buildArchive(appDir, outputDir, platform, arch) {
        const archiver = await Promise.resolve().then(() => __importStar(require('archiver')));
        const archiveName = `${this.config.productName}-${this.config.version}-${platform}-${arch}.tar.gz`;
        const archivePath = path_1.default.join(outputDir, archiveName);
        await (0, fs_1.ensureDir)(outputDir);
        return new Promise((resolve, reject) => {
            const output = fs_extra_1.default.createWriteStream(archivePath);
            const archive = archiver.default('tar', { gzip: true, gzipOptions: { level: 9 } });
            output.on('close', async () => {
                const stat = await fs_extra_1.default.stat(archivePath);
                const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
                logger_1.logger.success(`Archive created: ${archivePath} (${sizeMB} MB)`);
                resolve({ outputPath: archivePath, size: `${sizeMB} MB` });
            });
            archive.on('error', (err) => reject(err));
            archive.pipe(output);
            archive.directory(appDir, this.config.productName);
            archive.finalize();
        });
    }
    async estimateInstalledSize(dirPath) {
        const { getDirectorySize } = await Promise.resolve().then(() => __importStar(require('../utils/fs')));
        const bytes = await getDirectorySize(dirPath);
        return Math.ceil(bytes / 1024);
    }
}
exports.InstallerBuilder = InstallerBuilder;
//# sourceMappingURL=installer.js.map