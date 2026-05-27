"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NsisBuilder = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const execFileAsync = (0, util_1.promisify)(child_process_1.execFile);
class NsisBuilder {
    config;
    constructor(config) {
        this.config = config;
    }
    async build(appDir, outputDir) {
        logger_1.logger.step('NSIS', 'Building Windows installer...');
        const nsisConfig = this.config.nsis || {};
        const arch = 'x64';
        const installerDir = path_1.default.join(outputDir, 'nsis');
        await (0, fs_1.ensureDir)(installerDir);
        const scriptContent = this.generateNsisScript(appDir, installerDir, nsisConfig, arch);
        const scriptPath = path_1.default.join(installerDir, 'installer.nsi');
        await fs_extra_1.default.writeFile(scriptPath, scriptContent, 'utf-8');
        const makensisPath = await this.findMakensis();
        if (!makensisPath) {
            logger_1.logger.warn('makensis not found. Generating NSIS script only (no installer build).');
            logger_1.logger.info(`NSIS script saved to: ${scriptPath}`);
            logger_1.logger.info('Install NSIS (https://nsis.sourceforge.io) to build the installer.');
            return { installerPath: scriptPath, size: '0 B' };
        }
        try {
            const { stdout, stderr } = await execFileAsync(makensisPath, [scriptPath], {
                timeout: 300000,
            });
            if (stderr && !stderr.includes('warning')) {
                logger_1.logger.warn(`NSIS warnings: ${stderr}`);
            }
            const installerName = this.getInstallerName(nsisConfig, arch);
            const installerPath = path_1.default.join(installerDir, installerName);
            if (await fs_extra_1.default.pathExists(installerPath)) {
                const stat = await fs_extra_1.default.stat(installerPath);
                const sizeMB = (stat.size / 1024 / 1024).toFixed(2);
                logger_1.logger.success(`Windows installer created: ${installerPath} (${sizeMB} MB)`);
                return { installerPath, size: `${sizeMB} MB` };
            }
            else {
                throw new Error('Installer file not found after NSIS build');
            }
        }
        catch (err) {
            logger_1.logger.error(`NSIS build failed: ${err.message}`);
            throw err;
        }
    }
    generateNsisScript(appDir, outputDir, nsisConfig, arch) {
        const productName = this.config.productName;
        const appId = this.config.appId;
        const version = this.config.version;
        const companyName = this.config.copyright || '';
        const exeName = this.config.win?.executableName ||
            productName.replace(/[^a-zA-Z0-9]/g, '') + '.exe';
        const guid = nsisConfig.guid || appId;
        const oneClick = nsisConfig.oneClick !== false;
        const perMachine = nsisConfig.perMachine || false;
        const allowToChangeInstallationDirectory = nsisConfig.allowToChangeInstallationDirectory !== false && !oneClick;
        const shortcutName = nsisConfig.shortcutName || productName;
        const createDesktopShortcut = nsisConfig.createDesktopShortcut !== false;
        const createStartMenuShortcut = nsisConfig.createStartMenuShortcut !== false;
        const deleteAppDataOnUninstall = nsisConfig.deleteAppDataOnUninstall || false;
        const installerName = this.getInstallerName(nsisConfig, arch);
        return `!include "MUI2.nsh"
!include "FileFunc.nsh"
!include "LogicLib.nsh"

!define PRODUCT_NAME "${productName}"
!define PRODUCT_VERSION "${version}"
!define PRODUCT_PUBLISHER "${companyName}"
!define PRODUCT_GUID "${guid}"
!define PRODUCT_EXE "${exeName}"
!define PRODUCT_ARCH "${arch}"

Name "\${PRODUCT_NAME} \${PRODUCT_VERSION}"
OutFile "${path_1.default.join(outputDir, installerName).replace(/\\/g, '/')}"
InstallDir "${perMachine ? '$PROGRAMFILES64' : '$LOCALAPPDATA'}\\Programs\\\${PRODUCT_NAME}"
InstallDirRegKey HK${perMachine ? 'LM' : 'CU'} "Software\\\${PRODUCT_GUID}" "InstallDir"
RequestExecutionLevel ${nsisConfig.allowElevation !== false ? 'admin' : 'user'}

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "SimpChinese"
!insertmacro MUI_LANGUAGE "English"

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  File /r "${appDir.replace(/\\/g, '/')}\\*.*"

  ${createDesktopShortcut ? `CreateShortCut "$DESKTOP\\\${PRODUCT_NAME}.lnk" "$INSTDIR\\\${PRODUCT_EXE}"` : ''}
  ${createStartMenuShortcut ? `CreateShortCut "$SMPROGRAMS\\\${PRODUCT_NAME}.lnk" "$INSTDIR\\\${PRODUCT_EXE}"` : ''}
SectionEnd

Section -Post
  WriteRegStr HK${perMachine ? 'LM' : 'CU'} "Software\\\${PRODUCT_GUID}" "InstallDir" "$INSTDIR"
  WriteUninstaller "$INSTDIR\\uninstall.exe"
  WriteRegStr HK${perMachine ? 'LM' : 'CU'} "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${PRODUCT_GUID}" \\
    "DisplayName" "\${PRODUCT_NAME}"
  WriteRegStr HK${perMachine ? 'LM' : 'CU'} "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${PRODUCT_GUID}" \\
    "UninstallString" "$INSTDIR\\uninstall.exe"
  WriteRegStr HK${perMachine ? 'LM' : 'CU'} "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${PRODUCT_GUID}" \\
    "DisplayVersion" "\${PRODUCT_VERSION}"
  WriteRegStr HK${perMachine ? 'LM' : 'CU'} "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${PRODUCT_GUID}" \\
    "Publisher" "\${PRODUCT_PUBLISHER}"
SectionEnd

Section Uninstall
  ${deleteAppDataOnUninstall ? 'RMDir /r "$APPDATA\\\${PRODUCT_NAME}"' : ''}
  Delete "$DESKTOP\\\${PRODUCT_NAME}.lnk"
  Delete "$SMPROGRAMS\\\${PRODUCT_NAME}.lnk"
  RMDir /r "$INSTDIR"
  DeleteRegKey HK${perMachine ? 'LM' : 'CU'} "Software\\\${PRODUCT_GUID}"
  DeleteRegKey HK${perMachine ? 'LM' : 'CU'} "Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\\${PRODUCT_GUID}"
SectionEnd
`;
    }
    getInstallerName(nsisConfig, arch) {
        const productName = this.config.productName.replace(/[^a-zA-Z0-9]/g, '');
        return `${productName}-Setup-${this.config.version}-${arch}.exe`;
    }
    async findMakensis() {
        const candidates = ['makensis', '/usr/bin/makensis', '/usr/local/bin/makensis'];
        if (process.platform === 'win32') {
            candidates.push('C:\\Program Files (x86)\\NSIS\\makensis.exe', 'C:\\Program Files\\NSIS\\makensis.exe');
        }
        for (const candidate of candidates) {
            try {
                await execFileAsync(candidate, ['/VERSION'], { timeout: 5000 });
                return candidate;
            }
            catch {
                continue;
            }
        }
        return null;
    }
}
exports.NsisBuilder = NsisBuilder;
//# sourceMappingURL=nsis.js.map