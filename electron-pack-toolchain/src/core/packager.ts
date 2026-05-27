import fs from 'fs-extra';
import path from 'path';
import extractZip from 'extract-zip';
import { PackConfig, Platform } from './types';
import { logger } from '../utils/logger';
import { ensureDir, cleanDir, copyFiles, formatBytes, getDirectorySize } from '../utils/fs';
import { downloadFile, getElectronDownloadUrl, getElectronCacheDir } from '../utils/download';
import { AsarPacker } from '../plugins/asar';
import { CompileResult } from './compiler';

export interface PackageResult {
  platform: Platform;
  arch: string;
  outputDir: string;
  size: string;
  duration: number;
}

export class Packager {
  private config: PackConfig;
  private asarPacker: AsarPacker;

  constructor(config: PackConfig) {
    this.config = config;
    this.asarPacker = new AsarPacker();
  }

  async packageApp(
    compileResult: CompileResult,
    platform: Platform,
    arch: string
  ): Promise<PackageResult> {
    const startTime = Date.now();
    logger.step('Packager', `Packaging for ${platform}-${arch}`);

    const electronDir = await this.ensureElectronBinary(platform, arch);
    const appOutputDir = this.getAppOutputDir(platform, arch);

    await cleanDir(appOutputDir);
    await ensureDir(appOutputDir);

    await this.copyElectronTemplate(electronDir, appOutputDir, platform);

    const resourcesDir = this.getResourcesDir(appOutputDir, platform);
    await ensureDir(resourcesDir);

    if (this.config.asar.enabled) {
      await this.createAsarArchive(compileResult, resourcesDir);
    } else {
      await this.copyAppFiles(compileResult, resourcesDir);
    }

    await this.copyExtraResources(resourcesDir);

    await this.updateAppMetadata(resourcesDir, platform);

    await this.customizeExecutable(appOutputDir, platform);

    const size = await getDirectorySize(appOutputDir);
    const duration = Date.now() - startTime;

    logger.success(
      `Package created: ${appOutputDir} (${formatBytes(size)}) in ${(duration / 1000).toFixed(2)}s`
    );

    return { platform, arch, outputDir: appOutputDir, size: formatBytes(size), duration };
  }

  private async ensureElectronBinary(platform: Platform, arch: string): Promise<string> {
    const cacheDir = getElectronCacheDir();
    const version = this.config.electron.version;
    const cacheKey = `electron-v${version}-${platform}-${arch}`;
    const cachePath = path.join(cacheDir, cacheKey);

    if (await fs.pathExists(cachePath)) {
      logger.info(`Using cached Electron binary: ${cacheKey}`);
      return cachePath;
    }

    logger.info(`Downloading Electron v${version} for ${platform}-${arch}...`);
    const downloadUrl = getElectronDownloadUrl(
      version,
      platform,
      arch,
      this.config.electron.mirror
    );

    const zipPath = path.join(cacheDir, `${cacheKey}.zip`);
    await downloadFile(downloadUrl, zipPath, (progress) => {
      if (progress.total > 0) {
        const percent = (progress.percent * 100).toFixed(1);
        process.stdout.write(`  Downloading: ${percent}%\r`);
      }
    });
    process.stdout.write('\n');

    logger.info('Extracting Electron binary...');
    await extractZip(zipPath, { dir: cachePath });
    await fs.remove(zipPath);

    logger.success(`Electron binary ready: ${cacheKey}`);
    return cachePath;
  }

  private async copyElectronTemplate(
    electronDir: string,
    outputDir: string,
    platform: Platform
  ): Promise<void> {
    logger.info('Copying Electron template...');

    const filter = (srcPath: string): boolean => {
      const basename = path.basename(srcPath);
      if (platform === 'darwin') {
        return !basename.endsWith('Default.app');
      }
      return true;
    };

    await fs.copy(electronDir, outputDir, { filter });
  }

  private getResourcesDir(appDir: string, platform: Platform): string {
    switch (platform) {
      case 'darwin':
        const appName = this.config.productName + '.app';
        return path.join(appDir, appName, 'Contents', 'Resources');
      case 'win32':
      case 'linux':
        return path.join(appDir, 'resources');
      default:
        return path.join(appDir, 'resources');
    }
  }

  private async createAsarArchive(
    compileResult: CompileResult,
    resourcesDir: string
  ): Promise<void> {
    const appDir = path.join(resourcesDir, 'app');
    await ensureDir(appDir);

    await fs.copy(compileResult.mainEntry, path.join(appDir, 'index.js'));

    if (compileResult.preloadEntries.length > 0) {
      const preloadDir = path.join(appDir, 'preload');
      await ensureDir(preloadDir);
      for (const entry of compileResult.preloadEntries) {
        await fs.copy(entry, path.join(preloadDir, path.basename(entry)));
      }
    }

    if (compileResult.rendererOutDir) {
      await fs.copy(compileResult.rendererOutDir, path.join(appDir, 'renderer'));
    }

    const packageJsonPath = path.join(this.config.directories.app, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const pkg = await fs.readJson(packageJsonPath);
      pkg.main = 'index.js';
      await fs.writeJson(path.join(appDir, 'package.json'), pkg, { spaces: 2 });
    }

    const asarPath = path.join(resourcesDir, 'app.asar');
    await this.asarPacker.pack(appDir, asarPath, {
      unpack: this.config.asar.unpack,
      unpackDir: this.config.asar.unpackDir,
      ordering: this.config.asar.ordering,
    });

    await fs.remove(appDir);
  }

  private async copyAppFiles(
    compileResult: CompileResult,
    resourcesDir: string
  ): Promise<void> {
    const appDir = path.join(resourcesDir, 'app');
    await ensureDir(appDir);

    await fs.copy(compileResult.mainEntry, path.join(appDir, 'index.js'));

    if (compileResult.preloadEntries.length > 0) {
      const preloadDir = path.join(appDir, 'preload');
      await ensureDir(preloadDir);
      for (const entry of compileResult.preloadEntries) {
        await fs.copy(entry, path.join(preloadDir, path.basename(entry)));
      }
    }

    if (compileResult.rendererOutDir) {
      await fs.copy(compileResult.rendererOutDir, path.join(appDir, 'renderer'));
    }

    const packageJsonPath = path.join(this.config.directories.app, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const pkg = await fs.readJson(packageJsonPath);
      pkg.main = 'index.js';
      await fs.writeJson(path.join(appDir, 'package.json'), pkg, { spaces: 2 });
    }
  }

  private async copyExtraResources(resourcesDir: string): Promise<void> {
    if (!this.config.extraResources) return;

    for (const resource of this.config.extraResources) {
      const from = path.resolve(this.config.directories.app, resource.from);
      const to = path.join(resourcesDir, resource.to || path.basename(resource.from));

      if (await fs.pathExists(from)) {
        await fs.copy(from, to);
        logger.debug(`Copied extra resource: ${resource.from} → ${resource.to || path.basename(resource.from)}`);
      } else {
        logger.warn(`Extra resource not found: ${resource.from}`);
      }
    }
  }

  private async updateAppMetadata(resourcesDir: string, platform: Platform): Promise<void> {
    if (platform === 'darwin') {
      await this.updateMacInfoPlist(resourcesDir);
    }
  }

  private async updateMacInfoPlist(resourcesDir: string): Promise<void> {
    const plistPath = path.join(path.dirname(resourcesDir), 'Info.plist');
    if (!(await fs.pathExists(plistPath))) return;

    try {
      const plist = await import('plist');
      let content = await fs.readFile(plistPath, 'utf-8');
      const data = plist.parse(content) as Record<string, unknown>;

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

      content = plist.build(data as any);
      await fs.writeFile(plistPath, content);
      logger.debug('Updated macOS Info.plist');
    } catch (err) {
      logger.warn(`Failed to update Info.plist: ${(err as Error).message}`);
    }
  }

  private async customizeExecutable(outputDir: string, platform: Platform): Promise<void> {
    if (platform === 'win32') {
      await this.customizeWindowsExe(outputDir);
    } else if (platform === 'linux') {
      await this.customizeLinuxDesktop(outputDir);
    }
  }

  private async customizeWindowsExe(outputDir: string): Promise<void> {
    const exeName =
      this.config.win?.executableName ||
      this.config.productName.replace(/[^a-zA-Z0-9]/g, '') + '.exe';
    const exePath = path.join(outputDir, exeName);

    if (!(await fs.pathExists(exePath))) {
      const defaultExe = path.join(outputDir, 'electron.exe');
      if (await fs.pathExists(defaultExe)) {
        await fs.move(defaultExe, exePath);
      }
    }

    try {
      const rcedit = await import('rcedit');
      const rceditOptions: Record<string, unknown> = {
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
        const iconPath = path.resolve(this.config.directories.buildResources, this.config.win.icon);
        if (await fs.pathExists(iconPath)) {
          rceditOptions['icon-path'] = iconPath;
        }
      }

      if (this.config.win?.requestedExecutionLevel) {
        rceditOptions['requested-execution-level'] = this.config.win.requestedExecutionLevel;
      }

      await rcedit.default(exePath, rceditOptions);
      logger.debug('Customized Windows executable');
    } catch (err) {
      logger.warn(`Failed to customize Windows executable: ${(err as Error).message}`);
    }
  }

  private async customizeLinuxDesktop(outputDir: string): Promise<void> {
    const executableName =
      this.config.linux?.executableName ||
      this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const desktopEntry = `[Desktop Entry]
Type=Application
Name=${this.config.productName}
Exec=${executableName}
Icon=${executableName}
Categories=${this.config.linux?.category || 'Utility'}
${this.config.description ? `Comment=${this.config.description}` : ''}`;

    const desktopDir = path.join(outputDir, 'usr', 'share', 'applications');
    await ensureDir(desktopDir);
    await fs.writeFile(
      path.join(desktopDir, `${executableName}.desktop`),
      desktopEntry
    );

    logger.debug('Created Linux desktop entry');
  }

  private getAppOutputDir(platform: Platform, arch: string): string {
    const platformArchMap: Record<string, string> = {
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
    return path.join(this.config.directories.output, dirName);
  }
}
