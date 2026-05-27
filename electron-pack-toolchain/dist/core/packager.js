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
exports.Packager = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const extract_zip_1 = __importDefault(require("extract-zip"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const download_1 = require("../utils/download");
const asar_1 = require("../plugins/asar");
class Packager {
    config;
    asarPacker;
    constructor(config) {
        this.config = config;
        this.asarPacker = new asar_1.AsarPacker();
    }
    async packageApp(compileResult, platform, arch) {
        const startTime = Date.now();
        logger_1.logger.step('Packager', `Packaging for ${platform}-${arch}`);
        const electronDir = await this.ensureElectronBinary(platform, arch);
        const appOutputDir = this.getAppOutputDir(platform, arch);
        await (0, fs_1.cleanDir)(appOutputDir);
        await (0, fs_1.ensureDir)(appOutputDir);
        await this.copyElectronTemplate(electronDir, appOutputDir, platform);
        const resourcesDir = this.getResourcesDir(appOutputDir, platform);
        await (0, fs_1.ensureDir)(resourcesDir);
        if (this.config.asar.enabled) {
            await this.createAsarArchive(compileResult, resourcesDir);
        }
        else {
            await this.copyAppFiles(compileResult, resourcesDir);
        }
        await this.copyExtraResources(resourcesDir);
        await this.updateAppMetadata(resourcesDir, platform);
        await this.customizeExecutable(appOutputDir, platform);
        const size = await (0, fs_1.getDirectorySize)(appOutputDir);
        const duration = Date.now() - startTime;
        logger_1.logger.success(`Package created: ${appOutputDir} (${(0, fs_1.formatBytes)(size)}) in ${(duration / 1000).toFixed(2)}s`);
        return { platform, arch, outputDir: appOutputDir, size: (0, fs_1.formatBytes)(size), duration };
    }
    async ensureElectronBinary(platform, arch) {
        const cacheDir = (0, download_1.getElectronCacheDir)();
        const version = this.config.electron.version;
        const cacheKey = `electron-v${version}-${platform}-${arch}`;
        const cachePath = path_1.default.join(cacheDir, cacheKey);
        if (await fs_extra_1.default.pathExists(cachePath)) {
            logger_1.logger.info(`Using cached Electron binary: ${cacheKey}`);
            return cachePath;
        }
        logger_1.logger.info(`Downloading Electron v${version} for ${platform}-${arch}...`);
        const downloadUrl = (0, download_1.getElectronDownloadUrl)(version, platform, arch, this.config.electron.mirror);
        const zipPath = path_1.default.join(cacheDir, `${cacheKey}.zip`);
        await (0, download_1.downloadFile)(downloadUrl, zipPath, (progress) => {
            if (progress.total > 0) {
                const percent = (progress.percent * 100).toFixed(1);
                process.stdout.write(`  Downloading: ${percent}%\r`);
            }
        });
        process.stdout.write('\n');
        logger_1.logger.info('Extracting Electron binary...');
        await (0, extract_zip_1.default)(zipPath, { dir: cachePath });
        await fs_extra_1.default.remove(zipPath);
        logger_1.logger.success(`Electron binary ready: ${cacheKey}`);
        return cachePath;
    }
    async copyElectronTemplate(electronDir, outputDir, platform) {
        logger_1.logger.info('Copying Electron template...');
        const filter = (srcPath) => {
            const basename = path_1.default.basename(srcPath);
            if (platform === 'darwin') {
                return !basename.endsWith('Default.app');
            }
            return true;
        };
        await fs_extra_1.default.copy(electronDir, outputDir, { filter });
    }
    getResourcesDir(appDir, platform) {
        switch (platform) {
            case 'darwin':
                const appName = this.config.productName + '.app';
                return path_1.default.join(appDir, appName, 'Contents', 'Resources');
            case 'win32':
            case 'linux':
                return path_1.default.join(appDir, 'resources');
            default:
                return path_1.default.join(appDir, 'resources');
        }
    }
    async createAsarArchive(compileResult, resourcesDir) {
        const appDir = path_1.default.join(resourcesDir, 'app');
        await (0, fs_1.ensureDir)(appDir);
        await fs_extra_1.default.copy(compileResult.mainEntry, path_1.default.join(appDir, 'index.js'));
        if (compileResult.preloadEntries.length > 0) {
            const preloadDir = path_1.default.join(appDir, 'preload');
            await (0, fs_1.ensureDir)(preloadDir);
            for (const entry of compileResult.preloadEntries) {
                await fs_extra_1.default.copy(entry, path_1.default.join(preloadDir, path_1.default.basename(entry)));
            }
        }
        if (compileResult.rendererOutDir) {
            await fs_extra_1.default.copy(compileResult.rendererOutDir, path_1.default.join(appDir, 'renderer'));
        }
        const packageJsonPath = path_1.default.join(this.config.directories.app, 'package.json');
        if (await fs_extra_1.default.pathExists(packageJsonPath)) {
            const pkg = await fs_extra_1.default.readJson(packageJsonPath);
            pkg.main = 'index.js';
            await fs_extra_1.default.writeJson(path_1.default.join(appDir, 'package.json'), pkg, { spaces: 2 });
        }
        const asarPath = path_1.default.join(resourcesDir, 'app.asar');
        await this.asarPacker.pack(appDir, asarPath, {
            unpack: this.config.asar.unpack,
            unpackDir: this.config.asar.unpackDir,
            ordering: this.config.asar.ordering,
        });
        await fs_extra_1.default.remove(appDir);
    }
    async copyAppFiles(compileResult, resourcesDir) {
        const appDir = path_1.default.join(resourcesDir, 'app');
        await (0, fs_1.ensureDir)(appDir);
        await fs_extra_1.default.copy(compileResult.mainEntry, path_1.default.join(appDir, 'index.js'));
        if (compileResult.preloadEntries.length > 0) {
            const preloadDir = path_1.default.join(appDir, 'preload');
            await (0, fs_1.ensureDir)(preloadDir);
            for (const entry of compileResult.preloadEntries) {
                await fs_extra_1.default.copy(entry, path_1.default.join(preloadDir, path_1.default.basename(entry)));
            }
        }
        if (compileResult.rendererOutDir) {
            await fs_extra_1.default.copy(compileResult.rendererOutDir, path_1.default.join(appDir, 'renderer'));
        }
        const packageJsonPath = path_1.default.join(this.config.directories.app, 'package.json');
        if (await fs_extra_1.default.pathExists(packageJsonPath)) {
            const pkg = await fs_extra_1.default.readJson(packageJsonPath);
            pkg.main = 'index.js';
            await fs_extra_1.default.writeJson(path_1.default.join(appDir, 'package.json'), pkg, { spaces: 2 });
        }
    }
    async copyExtraResources(resourcesDir) {
        if (!this.config.extraResources)
            return;
        for (const resource of this.config.extraResources) {
            const from = path_1.default.resolve(this.config.directories.app, resource.from);
            const to = path_1.default.join(resourcesDir, resource.to || path_1.default.basename(resource.from));
            if (await fs_extra_1.default.pathExists(from)) {
                await fs_extra_1.default.copy(from, to);
                logger_1.logger.debug(`Copied extra resource: ${resource.from} → ${resource.to || path_1.default.basename(resource.from)}`);
            }
            else {
                logger_1.logger.warn(`Extra resource not found: ${resource.from}`);
            }
        }
    }
    async updateAppMetadata(resourcesDir, platform) {
        if (platform === 'darwin') {
            await this.updateMacInfoPlist(resourcesDir);
        }
    }
    async updateMacInfoPlist(resourcesDir) {
        const plistPath = path_1.default.join(path_1.default.dirname(resourcesDir), 'Info.plist');
        if (!(await fs_extra_1.default.pathExists(plistPath)))
            return;
        try {
            const plist = await Promise.resolve().then(() => __importStar(require('plist')));
            let content = await fs_extra_1.default.readFile(plistPath, 'utf-8');
            const data = plist.parse(content);
            data.CFBundleIdentifier = this.config.appId;
            data.CFBundleName = this.config.productName;
            data.CFBundleDisplayName = this.config.productName;
            data.CFBundleVersion = this.config.version;
            data.CFBundleShortVersionString = this.config.version;
            if (this.config.mac?.category) {
                data.LSApplicationCategoryType = this.config.mac.category;
            }
            if (this.config.copyright) {
                data.NSHumanReadableCopyright = this.config.copyright;
            }
            content = plist.build(data);
            await fs_extra_1.default.writeFile(plistPath, content);
            logger_1.logger.debug('Updated macOS Info.plist');
        }
        catch (err) {
            logger_1.logger.warn(`Failed to update Info.plist: ${err.message}`);
        }
    }
    async customizeExecutable(outputDir, platform) {
        if (platform === 'win32') {
            await this.customizeWindowsExe(outputDir);
        }
        else if (platform === 'linux') {
            await this.customizeLinuxDesktop(outputDir);
        }
    }
    async customizeWindowsExe(outputDir) {
        const exeName = this.config.win?.executableName ||
            this.config.productName.replace(/[^a-zA-Z0-9]/g, '') + '.exe';
        const exePath = path_1.default.join(outputDir, exeName);
        if (!(await fs_extra_1.default.pathExists(exePath))) {
            const defaultExe = path_1.default.join(outputDir, 'electron.exe');
            if (await fs_extra_1.default.pathExists(defaultExe)) {
                await fs_extra_1.default.move(defaultExe, exePath);
            }
        }
        try {
            const rcedit = await Promise.resolve().then(() => __importStar(require('rcedit')));
            const rceditOptions = {
                'version-string': {
                    ProductName: this.config.productName,
                    FileDescription: this.config.description || this.config.productName,
                    CompanyName: this.config.copyright || '',
                    LegalCopyright: this.config.copyright || '',
                    OriginalFilename: exeName,
                },
                'file-version': this.config.version,
                'product-version': this.config.version,
            };
            if (this.config.win?.icon) {
                const iconPath = path_1.default.resolve(this.config.directories.buildResources, this.config.win.icon);
                if (await fs_extra_1.default.pathExists(iconPath)) {
                    rceditOptions['icon-path'] = iconPath;
                }
            }
            if (this.config.win?.requestedExecutionLevel) {
                rceditOptions['requested-execution-level'] = this.config.win.requestedExecutionLevel;
            }
            await rcedit.default(exePath, rceditOptions);
            logger_1.logger.debug('Customized Windows executable');
        }
        catch (err) {
            logger_1.logger.warn(`Failed to customize Windows executable: ${err.message}`);
        }
    }
    async customizeLinuxDesktop(outputDir) {
        const executableName = this.config.linux?.executableName ||
            this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
        const desktopEntry = `[Desktop Entry]
Type=Application
Name=${this.config.productName}
Exec=${executableName}
Icon=${executableName}
Categories=${this.config.linux?.category || 'Utility'}
${this.config.description ? `Comment=${this.config.description}` : ''}`;
        const desktopDir = path_1.default.join(outputDir, 'usr', 'share', 'applications');
        await (0, fs_1.ensureDir)(desktopDir);
        await fs_extra_1.default.writeFile(path_1.default.join(desktopDir, `${executableName}.desktop`), desktopEntry);
        logger_1.logger.debug('Created Linux desktop entry');
    }
    getAppOutputDir(platform, arch) {
        const platformArchMap = {
            'win32-x64': 'win-unpacked',
            'win32-ia32': 'win-ia32-unpacked',
            'win32-arm64': 'win-arm64-unpacked',
            'darwin-x64': 'mac',
            'darwin-arm64': 'mac-arm64',
            'linux-x64': 'linux-unpacked',
            'linux-ia32': 'linux-ia32-unpacked',
            'linux-arm64': 'linux-arm64-unpacked',
        };
        const dirName = platformArchMap[`${platform}-${arch}`] || `${platform}-${arch}-unpacked`;
        return path_1.default.join(this.config.directories.output, dirName);
    }
}
exports.Packager = Packager;
//# sourceMappingURL=packager.js.map