import path from 'path';
import fs from 'fs-extra';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/fs';
import { PackConfig, Platform, InstallerType } from './types';
import { PackageResult } from './packager';
import { NsisBuilder, NsisResult } from '../plugins/nsis';
import { DmgBuilder, DmgResult } from '../plugins/dmg';
import { AppImageBuilder, AppImageResult } from '../plugins/appimage';

export interface InstallerResult {
  platform: Platform;
  arch: string;
  installerType: InstallerType;
  outputPath: string;
  size: string;
}

export class InstallerBuilder {
  private config: PackConfig;

  constructor(config: PackConfig) {
    this.config = config;
  }

  async build(
    packageResult: PackageResult,
    installerType?: InstallerType
  ): Promise<InstallerResult> {
    const { platform, arch, outputDir } = packageResult;
    const resolvedType = installerType || this.getDefaultInstallerType(platform);

    logger.step('Installer', `Building ${resolvedType} installer for ${platform}-${arch}`);

    const installerOutputDir = path.join(this.config.directories.output, 'installers');
    await ensureDir(installerOutputDir);

    let result: { outputPath: string; size: string };

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
        logger.warn(`Unsupported installer type: ${resolvedType}, creating archive instead`);
        result = await this.buildArchive(outputDir, installerOutputDir, platform, arch);
    }

    logger.success(`${resolvedType} installer created: ${result.outputPath} (${result.size})`);

    return {
      platform,
      arch,
      installerType: resolvedType,
      outputPath: result.outputPath,
      size: result.size,
    };
  }

  private getDefaultInstallerType(platform: Platform): InstallerType {
    switch (platform) {
      case 'win32':
        return 'nsis';
      case 'darwin':
        return 'dmg';
      case 'linux':
        return 'appimage';
    }
  }

  private async buildNsis(
    appDir: string,
    outputDir: string
  ): Promise<{ outputPath: string; size: string }> {
    const builder = new NsisBuilder(this.config);
    const result: NsisResult = await builder.build(appDir, outputDir);
    return { outputPath: result.installerPath, size: result.size };
  }

  private async buildDmg(
    appDir: string,
    outputDir: string
  ): Promise<{ outputPath: string; size: string }> {
    const builder = new DmgBuilder(this.config);
    const result: DmgResult = await builder.build(appDir, outputDir);
    return { outputPath: result.dmgPath, size: result.size };
  }

  private async buildAppImage(
    appDir: string,
    outputDir: string
  ): Promise<{ outputPath: string; size: string }> {
    const builder = new AppImageBuilder(this.config);
    const result: AppImageResult = await builder.build(appDir, outputDir);
    return { outputPath: result.appImagePath, size: result.size };
  }

  private async buildDeb(
    appDir: string,
    outputDir: string,
    arch: string
  ): Promise<{ outputPath: string; size: string }> {
    logger.step('DEB', 'Building Debian package...');

    const debDir = path.join(outputDir, 'deb');
    await ensureDir(debDir);

    const packageName =
      this.config.linux?.executableName ||
      this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const debArch = arch === 'x64' ? 'amd64' : arch === 'arm64' ? 'arm64' : 'i386';
    const debName = `${packageName}_${this.config.version}_${debArch}.deb`;
    const debPath = path.join(debDir, debName);

    const stagingDir = path.join(debDir, 'staging');
    await fs.emptyDir(stagingDir);

    const installDir = `/opt/${packageName}`;
    const dataDir = path.join(stagingDir, installDir.slice(1));
    await ensureDir(dataDir);
    await fs.copy(appDir, dataDir);

    const debianDir = path.join(stagingDir, 'DEBIAN');
    await ensureDir(debianDir);

    const controlContent = `Package: ${packageName}
Version: ${this.config.version}
Section: utils
Priority: optional
Architecture: ${debArch}
Installed-Size: ${await this.estimateInstalledSize(dataDir)}
Maintainer: ${this.config.copyright || 'Unknown'}
Description: ${this.config.description || this.config.productName}
`;
    await fs.writeFile(path.join(debianDir, 'control'), controlContent);

    const postinstContent = `#!/bin/bash
chmod +x ${installDir}/${packageName}
ln -sf ${installDir}/${packageName} /usr/local/bin/${packageName}
`;
    await fs.writeFile(path.join(debianDir, 'postinst'), postinstContent);
    await fs.chmod(path.join(debianDir, 'postinst'), 0o755);

    const prermContent = `#!/bin/bash
rm -f /usr/local/bin/${packageName}
`;
    await fs.writeFile(path.join(debianDir, 'prerm'), prermContent);
    await fs.chmod(path.join(debianDir, 'prerm'), 0o755);

    try {
      const { execFile } = await import('child_process');
      const { promisify } = await import('util');
      const execFileAsync = promisify(execFile);

      await execFileAsync('dpkg-deb', ['--build', stagingDir, debPath], {
        timeout: 300000,
      });

      await fs.remove(stagingDir);

      if (await fs.pathExists(debPath)) {
        const stat = await fs.stat(debPath);
        const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
        logger.success(`Debian package created: ${debPath} (${sizeMB} MB)`);
        return { outputPath: debPath, size: `${sizeMB} MB` };
      }
    } catch (err) {
      logger.warn(`dpkg-deb not available: ${(err as Error).message}`);
      logger.info('Install dpkg-dev to build .deb packages on this system.');
    }

    return { outputPath: stagingDir, size: '0 B' };
  }

  private async buildRpm(
    appDir: string,
    outputDir: string,
    arch: string
  ): Promise<{ outputPath: string; size: string }> {
    logger.step('RPM', 'Building RPM package...');
    logger.warn('RPM building is not yet fully implemented. Creating archive instead.');

    return this.buildArchive(appDir, outputDir, 'linux', arch);
  }

  private async buildArchive(
    appDir: string,
    outputDir: string,
    platform: Platform,
    arch: string
  ): Promise<{ outputPath: string; size: string }> {
    const archiver = await import('archiver');
    const archiveName = `${this.config.productName}-${this.config.version}-${platform}-${arch}.tar.gz`;
    const archivePath = path.join(outputDir, archiveName);

    await ensureDir(outputDir);

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(archivePath);
      const archive = archiver.default('tar', { gzip: true, gzipOptions: { level: 9 } });

      output.on('close', async () => {
        const stat = await fs.stat(archivePath);
        const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
        logger.success(`Archive created: ${archivePath} (${sizeMB} MB)`);
        resolve({ outputPath: archivePath, size: `${sizeMB} MB` });
      });

      archive.on('error', (err: Error) => reject(err));
      archive.pipe(output);
      archive.directory(appDir, this.config.productName);
      archive.finalize();
    });
  }

  private async estimateInstalledSize(dirPath: string): Promise<number> {
    const { getDirectorySize } = await import('../utils/fs');
    const bytes = await getDirectorySize(dirPath);
    return Math.ceil(bytes / 1024);
  }
}
