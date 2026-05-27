#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const builder_1 = require("../core/builder");
const config_1 = require("../core/config");
const asar_1 = require("../plugins/asar");
const logger_1 = require("../utils/logger");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const program = new commander_1.Command();
program
    .name('epack')
    .description('Electron Pack Toolchain - A from-source packaging toolchain for Electron apps')
    .version('1.0.0');
program
    .command('build')
    .description('Build and package the Electron application')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-p, --platform <platform>', 'Target platform (win32, darwin, linux)')
    .option('-a, --arch <arch>', 'Target architecture (x64, arm64, ia32)')
    .option('-i, --installer <type>', 'Installer type (nsis, dmg, appimage, deb, rpm)')
    .option('-v, --verbose', 'Enable verbose output')
    .option('--skip-compile', 'Skip the compilation step')
    .option('--skip-installer', 'Skip installer generation')
    .option('--clean', 'Clean build artifacts before building')
    .action(async (options) => {
    try {
        const buildOptions = {
            config: options.config,
            platform: options.platform,
            arch: options.arch,
            installerType: options.installer,
            verbose: options.verbose,
            skipCompile: options.skipCompile,
            skipInstaller: options.skipInstaller,
            clean: options.clean,
        };
        const builder = new builder_1.Builder(buildOptions);
        const result = await builder.build();
        process.exit(0);
    }
    catch (err) {
        logger_1.logger.error(`Build failed: ${err.message}`);
        if (options.verbose) {
            console.error(err.stack);
        }
        process.exit(1);
    }
});
program
    .command('init')
    .description('Initialize a new Electron project with epack configuration')
    .option('-n, --name <name>', 'Project name')
    .option('-a, --appId <appId>', 'Application ID')
    .option('-e, --electron-version <version>', 'Electron version')
    .action(async (options) => {
    try {
        await initProject(options);
    }
    catch (err) {
        logger_1.logger.error(`Init failed: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('compile')
    .description('Compile the application source code only')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
    try {
        const buildOptions = {
            config: options.config,
            verbose: options.verbose,
            skipInstaller: true,
        };
        const builder = new builder_1.Builder(buildOptions);
        const result = await builder.build();
        logger_1.logger.success('Compilation completed');
    }
    catch (err) {
        logger_1.logger.error(`Compilation failed: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('package')
    .description('Package the compiled application (skip installer generation)')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-p, --platform <platform>', 'Target platform')
    .option('-a, --arch <arch>', 'Target architecture')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
    try {
        const buildOptions = {
            config: options.config,
            platform: options.platform,
            arch: options.arch,
            verbose: options.verbose,
            skipInstaller: true,
        };
        const builder = new builder_1.Builder(buildOptions);
        const result = await builder.build();
        logger_1.logger.success('Packaging completed');
    }
    catch (err) {
        logger_1.logger.error(`Packaging failed: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('installer')
    .description('Generate installer from an already packaged application')
    .option('-c, --config <path>', 'Path to configuration file')
    .option('-p, --platform <platform>', 'Target platform')
    .option('-a, --arch <arch>', 'Target architecture')
    .option('-i, --installer <type>', 'Installer type')
    .option('-v, --verbose', 'Enable verbose output')
    .action(async (options) => {
    try {
        const buildOptions = {
            config: options.config,
            platform: options.platform,
            arch: options.arch,
            installerType: options.installer,
            verbose: options.verbose,
            skipCompile: true,
        };
        const builder = new builder_1.Builder(buildOptions);
        const result = await builder.build();
        logger_1.logger.success('Installer generation completed');
    }
    catch (err) {
        logger_1.logger.error(`Installer generation failed: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('asar')
    .description('ASAR archive utilities')
    .addCommand(new commander_1.Command('pack')
    .description('Create an ASAR archive')
    .argument('<source>', 'Source directory')
    .argument('<output>', 'Output .asar file path')
    .option('-u, --unpack <pattern>', 'Unpack files matching pattern')
    .option('--unpack-dir <pattern>', 'Unpack directories matching pattern')
    .action(async (source, output, options) => {
    try {
        const packer = new asar_1.AsarPacker();
        await packer.pack(source, output, {
            unpack: options.unpack,
            unpackDir: options.unpackDir,
        });
    }
    catch (err) {
        logger_1.logger.error(`ASAR pack failed: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('list')
    .description('List contents of an ASAR archive')
    .argument('<archive>', 'Path to .asar file')
    .action(async (archive) => {
    try {
        const packer = new asar_1.AsarPacker();
        const header = await packer.list(archive);
        console.log(JSON.stringify(header, null, 2));
    }
    catch (err) {
        logger_1.logger.error(`ASAR list failed: ${err.message}`);
        process.exit(1);
    }
}))
    .addCommand(new commander_1.Command('extract')
    .description('Extract an ASAR archive')
    .argument('<archive>', 'Path to .asar file')
    .argument('<dest>', 'Destination directory')
    .action(async (archive, dest) => {
    try {
        const packer = new asar_1.AsarPacker();
        await packer.extract(archive, dest);
    }
    catch (err) {
        logger_1.logger.error(`ASAR extract failed: ${err.message}`);
        process.exit(1);
    }
}));
program
    .command('info')
    .description('Show project configuration and build info')
    .option('-c, --config <path>', 'Path to configuration file')
    .action(async (options) => {
    try {
        const loader = new config_1.ConfigLoader(process.cwd());
        const config = await loader.load(options.config);
        console.log(chalk_1.default.cyan('\nProject Configuration:'));
        console.log(chalk_1.default.dim('─'.repeat(40)));
        console.log(`  App ID:        ${config.appId}`);
        console.log(`  Product Name:  ${config.productName}`);
        console.log(`  Version:       ${config.version}`);
        console.log(`  Electron:      v${config.electron.version}`);
        console.log(`  Compiler:      ${config.compiler.target}`);
        console.log(`  ASAR:          ${config.asar.enabled ? 'Enabled' : 'Disabled'}`);
        console.log(chalk_1.default.dim('─'.repeat(40)));
        console.log('  Build Targets:');
        for (const target of config.platforms) {
            const installer = target.installerType ? ` (${target.installerType})` : '';
            console.log(`    - ${target.platform}-${target.arch}${installer}`);
        }
        console.log(chalk_1.default.dim('─'.repeat(40)));
        console.log(`  App Dir:       ${config.directories.app}`);
        console.log(`  Output Dir:    ${config.directories.output}`);
        console.log(`  Build Res:     ${config.directories.buildResources}`);
    }
    catch (err) {
        logger_1.logger.error(`Failed to load config: ${err.message}`);
        process.exit(1);
    }
});
async function initProject(options) {
    const projectDir = process.cwd();
    const projectName = options.name || path_1.default.basename(projectDir);
    const appId = options.appId || `com.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`;
    const electronVersion = options.electronVersion || '28.0.0';
    logger_1.logger.step('Init', `Initializing project: ${projectName}`);
    const config = {
        appId,
        productName: projectName,
        version: '1.0.0',
        description: `${projectName} - Electron Application`,
        copyright: `Copyright © ${new Date().getFullYear()}`,
        directories: {
            app: './',
            buildResources: './build',
            output: './release',
        },
        electron: {
            version: electronVersion,
        },
        compiler: {
            entry: './src/main/index.ts',
            outDir: './dist/compiled',
            target: 'esbuild',
            minify: true,
            sourcemap: false,
        },
        asar: {
            enabled: true,
        },
        files: ['dist/compiled/**/*', 'package.json'],
        platforms: [
            { platform: 'win32', arch: 'x64', installerType: 'nsis' },
            { platform: 'darwin', arch: 'x64', installerType: 'dmg' },
            { platform: 'linux', arch: 'x64', installerType: 'appimage' },
        ],
    };
    const configPath = path_1.default.join(projectDir, 'pack.config.json');
    if (await fs_extra_1.default.pathExists(configPath)) {
        logger_1.logger.warn('pack.config.json already exists, skipping');
    }
    else {
        await fs_extra_1.default.writeJson(configPath, config, { spaces: 2 });
        logger_1.logger.success(`Created pack.config.json`);
    }
    const srcDir = path_1.default.join(projectDir, 'src', 'main');
    await fs_extra_1.default.ensureDir(srcDir);
    const mainTsPath = path_1.default.join(srcDir, 'index.ts');
    if (!(await fs_extra_1.default.pathExists(mainTsPath))) {
        const mainTsContent = `import { app, BrowserWindow } from 'electron';
import path from 'path';

let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
`;
        await fs_extra_1.default.writeFile(mainTsPath, mainTsContent);
        logger_1.logger.success('Created src/main/index.ts');
    }
    const preloadDir = path_1.default.join(projectDir, 'src', 'preload');
    await fs_extra_1.default.ensureDir(preloadDir);
    const preloadTsPath = path_1.default.join(preloadDir, 'index.ts');
    if (!(await fs_extra_1.default.pathExists(preloadTsPath))) {
        const preloadTsContent = `import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  send: (channel: string, data: unknown) => {
    const validChannels = ['toMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, data);
    }
  },
  receive: (channel: string, func: Function) => {
    const validChannels = ['fromMain'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (_event, ...args) => func(...args));
    }
  },
});
`;
        await fs_extra_1.default.writeFile(preloadTsPath, preloadTsContent);
        logger_1.logger.success('Created src/preload/index.ts');
    }
    const rendererDir = path_1.default.join(projectDir, 'src', 'renderer');
    await fs_extra_1.default.ensureDir(rendererDir);
    const htmlPath = path_1.default.join(rendererDir, 'index.html');
    if (!(await fs_extra_1.default.pathExists(htmlPath))) {
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <style>
    body {
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #1a1a2e;
      color: #e0e0e0;
    }
    h1 { color: #00d4ff; }
  </style>
</head>
<body>
  <h1>Welcome to ${projectName}</h1>
  <p>This is the renderer process of your Electron application.</p>
</body>
</html>
`;
        await fs_extra_1.default.writeFile(htmlPath, htmlContent);
        logger_1.logger.success('Created src/renderer/index.html');
    }
    const buildDir = path_1.default.join(projectDir, 'build');
    await fs_extra_1.default.ensureDir(buildDir);
    const gitignorePath = path_1.default.join(projectDir, '.gitignore');
    if (!(await fs_extra_1.default.pathExists(gitignorePath))) {
        const gitignoreContent = `node_modules/
dist/
release/
*.asar
*.asar.unpacked/
.cache/
.DS_Store
Thumbs.db
`;
        await fs_extra_1.default.writeFile(gitignorePath, gitignoreContent);
        logger_1.logger.success('Created .gitignore');
    }
    logger_1.logger.success(`\nProject "${projectName}" initialized successfully!`);
    logger_1.logger.info('\nNext steps:');
    logger_1.logger.info('  1. npm install');
    logger_1.logger.info('  2. epack build');
}
program.parse();
//# sourceMappingURL=index.js.map