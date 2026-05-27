import fs from 'fs-extra';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import archiver from 'archiver';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/fs';
import { PackConfig, AppImageConfig } from '../core/types';

const execFileAsync = promisify(execFile);

export interface AppImageResult {
  appImagePath: string;
  size: string;
}

export class AppImageBuilder {
  private config: PackConfig;

  constructor(config: PackConfig) {
    this.config = config;
  }

  async build(appDir: string, outputDir: string): Promise<AppImageResult> {
    logger.step('AppImage', 'Building Linux AppImage...');

    const appImageDir = path.join(outputDir, 'appimage');
    await ensureDir(appImageDir);

    const appDirStructure = await this.createAppDirStructure(appDir, appImageDir);
    await this.createDesktopEntry(appDirStructure);
    await this.copyIcons(appDirStructure);

    const appImageName = `${this.config.productName}-${this.config.version}-x86_64.AppImage`;
    const appImagePath = path.join(appImageDir, appImageName);

    const appimagetoolPath = await this.findAppimagetool();
    if (!appimagetoolPath) {
      logger.warn('appimagetool not found. Creating AppDir structure only.');
      logger.info(`AppDir created at: ${appDirStructure}`);
      logger.info('Install appimagetool (https://github.com/AppImage/AppImageKit) to build the AppImage.');
      return { appImagePath: appDirStructure, size: '0 B' };
    }

    try {
      await execFileAsync(appimagetoolPath, [appDirStructure, appImagePath], {
        timeout: 300000,
        env: { ...process.env, ARCH: 'x86_64' },
      });

      if (await fs.pathExists(appImagePath)) {
        const stat = await fs.stat(appImagePath);
        const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
        logger.success(`AppImage created: ${appImagePath} (${sizeMB} MB)`);
        return { appImagePath, size: `${sizeMB} MB` };
      }

      throw new Error('AppImage file not found after build');
    } catch (err) {
      logger.error(`AppImage build failed: ${(err as Error).message}`);
      logger.info('Falling back to tar.gz archive...');

      const tarPath = await this.createTarGz(appDir, appImageDir);
      return { appImagePath: tarPath, size: await this.getFileSize(tarPath) };
    }
  }

  private async createAppDirStructure(appDir: string, outputDir: string): Promise<string> {
    const appDirName = `${this.config.productName}.AppDir`;
    const appDirPath = path.join(outputDir, appDirName);

    await ensureDir(appDirPath);
    await ensureDir(path.join(appDirPath, 'usr', 'bin'));
    await ensureDir(path.join(appDirPath, 'usr', 'lib'));
    await ensureDir(path.join(appDirPath, 'usr', 'share', 'applications'));
    await ensureDir(path.join(appDirPath, 'usr', 'share', 'icons', 'hicolor'));

    await fs.copy(appDir, path.join(appDirPath, 'usr'), {
      filter: (src) => {
        const basename = path.basename(src);
        return !basename.startsWith('.');
      },
    });

    const executableName =
      this.config.linux?.executableName ||
      this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    const electronExe = path.join(appDir, 'electron');
    if (await fs.pathExists(electronExe)) {
      await fs.copy(electronExe, path.join(appDirPath, executableName));
      await fs.chmod(path.join(appDirPath, executableName), 0o755);
    }

    const appRunScript = `#!/bin/bash
SELF=\$(readlink -f "\$0")
HERE=\$(dirname "\$SELF")
export PATH="\${HERE}/usr/bin:\${PATH}"
export LD_LIBRARY_PATH="\${HERE}/usr/lib:\${LD_LIBRARY_PATH}"
exec "\${HERE}/${executableName}" "\$@"
`;
    await fs.writeFile(path.join(appDirPath, 'AppRun'), appRunScript);
    await fs.chmod(path.join(appDirPath, 'AppRun'), 0o755);

    return appDirPath;
  }

  private async createDesktopEntry(appDirPath: string): Promise<void> {
    const executableName =
      this.config.linux?.executableName ||
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

    await fs.writeFile(
      path.join(appDirPath, `${executableName}.desktop`),
      desktopEntry
    );

    logger.debug('Created desktop entry for AppImage');
  }

  private async copyIcons(appDirPath: string): Promise<void> {
    const executableName =
      this.config.linux?.executableName ||
      this.config.productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const buildResourcesDir = this.config.directories.buildResources;

    const iconSizes = [16, 24, 32, 48, 64, 128, 256, 512];
    let iconCopied = false;

    for (const size of iconSizes) {
      const iconPath = path.join(buildResourcesDir, 'icons', `${size}x${size}.png`);
      if (await fs.pathExists(iconPath)) {
        const destDir = path.join(
          appDirPath,
          'usr',
          'share',
          'icons',
          'hicolor',
          `${size}x${size}`,
          'apps'
        );
        await ensureDir(destDir);
        await fs.copy(iconPath, path.join(destDir, `${executableName}.png`));
        iconCopied = true;
      }
    }

    if (!iconCopied) {
      const defaultIcon = path.join(buildResourcesDir, 'icon.png');
      if (await fs.pathExists(defaultIcon)) {
        await fs.copy(defaultIcon, path.join(appDirPath, `${executableName}.png`));
      }
    }
  }

  private async createTarGz(appDir: string, outputDir: string): Promise<string> {
    const tarName = `${this.config.productName}-${this.config.version}-linux-x64.tar.gz`;
    const tarPath = path.join(outputDir, tarName);

    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(tarPath);
      const archive = archiver('tar', { gzip: true, gzipOptions: { level: 9 } });

      output.on('close', () => {
        logger.success(`Tarball created: ${tarPath}`);
        resolve(tarPath);
      });

      archive.on('error', (err) => reject(err));
      archive.pipe(output);
      archive.directory(appDir, this.config.productName);
      archive.finalize();
    });
  }

  private async findAppimagetool(): Promise<string | null> {
    const candidates = [
      'appimagetool',
      '/usr/bin/appimagetool',
      '/usr/local/bin/appimagetool',
    ];

    for (const candidate of candidates) {
      try {
        await execFileAsync(candidate, ['--version'], { timeout: 5000 });
        return candidate;
      } catch {
        continue;
      }
    }

    return null;
  }

  private async getFileSize(filePath: string): Promise<string> {
    const stat = await fs.stat(filePath);
    return `${(stat.size / 1024 / 1024).toFixed(2)} MB`;
  }
}
