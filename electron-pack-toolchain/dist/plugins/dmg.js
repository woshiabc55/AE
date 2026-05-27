"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DmgBuilder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class DmgBuilder {
    config;
    constructor(config) {
        this.config = config;
    }
    async build(appDir, outputDir) {
        logger_1.logger.step('DMG', 'Building macOS DMG installer...');
        const dmgConfig = this.config.dmg || {};
        const dmgDir = path_1.default.join(outputDir, 'dmg');
        await (0, fs_1.ensureDir)(dmgDir);
        const dmgName = `${this.config.productName}-${this.config.version}.dmg`;
        const dmgPath = path_1.default.join(dmgDir, dmgName);
        const appBundleName = this.findAppBundle(appDir);
        if (!appBundleName) {
            throw new Error(`No .app bundle found in ${appDir}`);
        }
        const stagingDir = path_1.default.join(dmgDir, 'staging');
        await cleanDir(stagingDir);
        await (0, fs_1.ensureDir)(stagingDir);
        await fs_extra_1.default.copy(path_1.default.join(appDir, appBundleName), path_1.default.join(stagingDir, appBundleName));
        const applicationsLink = path_1.default.join(stagingDir, 'Applications');
        if (!(await fs_extra_1.default.pathExists(applicationsLink))) {
            await fs_extra_1.default.symlink('/Applications', applicationsLink);
        }
        await this.createDmg(stagingDir, dmgPath, dmgConfig);
        await fs_extra_1.default.remove(stagingDir);
        if (await fs_extra_1.default.pathExists(dmgPath)) {
            const stat = await fs_extra_1.default.stat(dmgPath);
            const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
            logger_1.logger.success(`macOS DMG created: ${dmgPath} (${sizeMB} MB)`);
            return { dmgPath, size: `${sizeMB} MB` };
        }
        throw new Error('DMG file not found after build');
    }
    async createDmg(stagingDir, dmgPath, dmgConfig) {
        const volumeName = dmgConfig.title || this.config.productName;
        const windowSize = dmgConfig.windowSize || { width: 660, height: 400 };
        if (await fs_extra_1.default.pathExists(dmgPath)) {
            await fs_extra_1.default.remove(dmgPath);
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
            logger_1.logger.debug('DMG created with hdiutil');
        }
        catch (err) {
            logger_1.logger.warn(`hdiutil failed: ${err.message}`);
            logger_1.logger.info('Attempting to create DMG using script-based approach...');
            await this.createDmgWithScript(stagingDir, dmgPath, volumeName, windowSize, dmgConfig);
        }
    }
    async createDmgWithScript(stagingDir, dmgPath, volumeName, windowSize, dmgConfig) {
        const appBundleName = this.findAppBundle(stagingDir);
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
            }
            else if (item.type === 'link') {
                return `set position of item "Applications" of container window to {${item.x}, ${item.y}}`;
            }
            return '';
        })
            .join('\n    ')}
    close
  end tell
end tell`;
        const scriptPath = dmgPath + '.applescript';
        await fs_extra_1.default.writeFile(scriptPath, script, 'utf-8');
        try {
            await execFileAsync('/usr/bin/osascript', [scriptPath], { timeout: 60000 });
        }
        catch (err) {
            logger_1.logger.warn(`AppleScript failed: ${err.message}`);
        }
        finally {
            await fs_extra_1.default.remove(scriptPath);
        }
    }
    findAppBundle(dir) {
        const entries = fs_extra_1.default.readdirSync(dir);
        return entries.find((e) => e.endsWith('.app')) || null;
    }
}
exports.DmgBuilder = DmgBuilder;
async function cleanDir(dirPath) {
    if (await fs_extra_1.default.pathExists(dirPath)) {
        await fs_extra_1.default.emptyDir(dirPath);
    }
}
//# sourceMappingURL=dmg.js.map