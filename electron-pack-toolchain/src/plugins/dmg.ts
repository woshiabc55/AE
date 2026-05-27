import fs from 'fs-extra';
import path from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/fs';
import { PackConfig, DmgConfig } from '../core/types';

const execFileAsync = promisify(execFile);

export interface DmgResult {
  dmgPath: string;
  size: string;
}

export class DmgBuilder {
  private config: PackConfig;

  constructor(config: PackConfig) {
    this.config = config;
  }

  async build(appDir: string, outputDir: string): Promise<DmgResult> {
    logger.step('DMG', 'Building macOS DMG installer...');

    const dmgConfig = this.config.dmg || {};
    const dmgDir = path.join(outputDir, 'dmg');
    await ensureDir(dmgDir);

    const dmgName = `${this.config.productName}-${this.config.version}.dmg`;
    const dmgPath = path.join(dmgDir, dmgName);

    const appBundleName = this.findAppBundle(appDir);
    if (!appBundleName) {
      throw new Error(`No .app bundle found in ${appDir}`);
    }

    const stagingDir = path.join(dmgDir, 'staging');
    await cleanDir(stagingDir);
    await ensureDir(stagingDir);

    await fs.copy(
      path.join(appDir, appBundleName),
      path.join(stagingDir, appBundleName)
    );

    const applicationsLink = path.join(stagingDir, 'Applications');
    if (!(await fs.pathExists(applicationsLink))) {
      await fs.symlink('/Applications', applicationsLink);
    }

    await this.createDmg(stagingDir, dmgPath, dmgConfig);

    await fs.remove(stagingDir);

    if (await fs.pathExists(dmgPath)) {
      const stat = await fs.stat(dmgPath);
      const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
      logger.success(`macOS DMG created: ${dmgPath} (${sizeMB} MB)`);
      return { dmgPath, size: `${sizeMB} MB` };
    }

    throw new Error('DMG file not found after build');
  }

  private async createDmg(
    stagingDir: string,
    dmgPath: string,
    dmgConfig: DmgConfig
  ): Promise<void> {
    const volumeName = dmgConfig.title || this.config.productName;
    const windowSize = dmgConfig.windowSize || { width: 660, height: 400 };

    if (await fs.pathExists(dmgPath)) {
      await fs.remove(dmgPath);
    }

    try {
      const hdiutilPath = '/usr/bin/hdiutil';
      const createArgs = [
        'create',
        '-volname', volumeName,
        '-srcfolder', stagingDir,
        '-ov',
        '-format', 'UDZO',
        dmgPath,
      ];

      await execFileAsync(hdiutilPath, createArgs, { timeout: 600000 });
      logger.debug('DMG created with hdiutil');
    } catch (err) {
      logger.warn(`hdiutil failed: ${(err as Error).message}`);
      logger.info('Attempting to create DMG using script-based approach...');

      await this.createDmgWithScript(stagingDir, dmgPath, volumeName, windowSize, dmgConfig);
    }
  }

  private async createDmgWithScript(
    stagingDir: string,
    dmgPath: string,
    volumeName: string,
    windowSize: { width: number; height: number },
    dmgConfig: DmgConfig
  ): Promise<void> {
    const appBundleName = this.findAppBundle(stagingDir)!;
    const contents = dmgConfig.contents || [
      { x: 180, y: 170, type: 'file', path: appBundleName },
      { x: 480, y: 170, type: 'link', path: '/Applications' },
    ];

    const script = `tell application "Finder"
  tell disk "${volumeName}"
    open
    set current view of container window to icon view
    set toolbar visible of container window to false
    set statusbar visible of container window to false
    set the bounds of container window to {0, 0, ${windowSize.width}, ${windowSize.height}}
    set viewOptions to the icon view options of container window
    set arrangement of viewOptions to not arranged
    set icon size of viewOptions to 128
    ${contents
      .map((item) => {
        if (item.type === 'file') {
          return `set position of item "${item.path}" of container window to {${item.x}, ${item.y}}`;
        } else if (item.type === 'link') {
          return `set position of item "Applications" of container window to {${item.x}, ${item.y}}`;
        }
        return '';
      })
      .join('\n    ')}
    close
  end tell
end tell`;

    const scriptPath = dmgPath + '.applescript';
    await fs.writeFile(scriptPath, script, 'utf-8');

    try {
      await execFileAsync('/usr/bin/osascript', [scriptPath], { timeout: 60000 });
    } catch (err) {
      logger.warn(`AppleScript failed: ${(err as Error).message}`);
    } finally {
      await fs.remove(scriptPath);
    }
  }

  private findAppBundle(dir: string): string | null {
    const entries = fs.readdirSync(dir);
    return entries.find((e) => e.endsWith('.app')) || null;
  }
}

async function cleanDir(dirPath: string): Promise<void> {
  if (await fs.pathExists(dirPath)) {
    await fs.emptyDir(dirPath);
  }
}
