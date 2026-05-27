#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { Builder, BuildOptions } from '../core/builder';
import { ConfigLoader } from '../core/config';
import { AsarPacker } from '../plugins/asar';
import { logger, setLogLevel, LogLevel } from '../utils/logger';
import { formatBytes } from '../utils/fs';
import fs from 'fs-extra';
import path from 'path';

const program = new Command();

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
      const buildOptions: BuildOptions = {
        config: options.config,
        platform: options.platform,
        arch: options.arch,
        installerType: options.installer,
        verbose: options.verbose,
        skipCompile: options.skipCompile,
        skipInstaller: options.skipInstaller,
        clean: options.clean,
      };

      const builder = new Builder(buildOptions);
      const result = await builder.build();

      process.exit(0);
    } catch (err) {
      logger.error(`Build failed: ${(err as Error).message}`);
      if (options.verbose) {
        console.error((err as Error).stack);
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
    } catch (err) {
      logger.error(`Init failed: ${(err as Error).message}`);
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
      const buildOptions: BuildOptions = {
        config: options.config,
        verbose: options.verbose,
        skipInstaller: true,
      };

      const builder = new Builder(buildOptions);
      const result = await builder.build();

      logger.success('Compilation completed');
    } catch (err) {
      logger.error(`Compilation failed: ${(err as Error).message}`);
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
      const buildOptions: BuildOptions = {
        config: options.config,
        platform: options.platform,
        arch: options.arch,
        verbose: options.verbose,
        skipInstaller: true,
      };

      const builder = new Builder(buildOptions);
      const result = await builder.build();

      logger.success('Packaging completed');
    } catch (err) {
      logger.error(`Packaging failed: ${(err as Error).message}`);
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
      const buildOptions: BuildOptions = {
        config: options.config,
        platform: options.platform,
        arch: options.arch,
        installerType: options.installer,
        verbose: options.verbose,
        skipCompile: true,
      };

      const builder = new Builder(buildOptions);
      const result = await builder.build();

      logger.success('Installer generation completed');
    } catch (err) {
      logger.error(`Installer generation failed: ${(err as Error).message}`);
      process.exit(1);
    }
  });

program
  .command('asar')
  .description('ASAR archive utilities')
  .addCommand(
    new Command('pack')
      .description('Create an ASAR archive')
      .argument('<source>', 'Source directory')
      .argument('<output>', 'Output .asar file path')
      .option('-u, --unpack <pattern>', 'Unpack files matching pattern')
      .option('--unpack-dir <pattern>', 'Unpack directories matching pattern')
      .action(async (source, output, options) => {
        try {
          const packer = new AsarPacker();
          await packer.pack(source, output, {
            unpack: options.unpack,
            unpackDir: options.unpackDir,
          });
        } catch (err) {
          logger.error(`ASAR pack failed: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('list')
      .description('List contents of an ASAR archive')
      .argument('<archive>', 'Path to .asar file')
      .action(async (archive) => {
        try {
          const packer = new AsarPacker();
          const header = await packer.list(archive);
          console.log(JSON.stringify(header, null, 2));
        } catch (err) {
          logger.error(`ASAR list failed: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command('extract')
      .description('Extract an ASAR archive')
      .argument('<archive>', 'Path to .asar file')
      .argument('<dest>', 'Destination directory')
      .action(async (archive, dest) => {
        try {
          const packer = new AsarPacker();
          await packer.extract(archive, dest);
        } catch (err) {
          logger.error(`ASAR extract failed: ${(err as Error).message}`);
          process.exit(1);
        }
      })
  );

program
  .command('info')
  .description('Show project configuration and build info')
  .option('-c, --config <path>', 'Path to configuration file')
  .action(async (options) => {
    try {
      const loader = new ConfigLoader(process.cwd());
      const config = await loader.load(options.config);

      console.log(chalk.cyan('\nProject Configuration:'));
      console.log(chalk.dim('─'.repeat(40)));
      console.log(`  App ID:        ${config.appId}`);
      console.log(`  Product Name:  ${config.productName}`);
      console.log(`  Version:       ${config.version}`);
      console.log(`  Electron:      v${config.electron.version}`);
      console.log(`  Compiler:      ${config.compiler.target}`);
      console.log(`  ASAR:          ${config.asar.enabled ? 'Enabled' : 'Disabled'}`);
      console.log(chalk.dim('─'.repeat(40)));
      console.log('  Build Targets:');
      for (const target of config.platforms) {
        const installer = target.installerType ? ` (${target.installerType})` : '';
        console.log(`    - ${target.platform}-${target.arch}${installer}`);
      }
      console.log(chalk.dim('─'.repeat(40)));
      console.log(`  App Dir:       ${config.directories.app}`);
      console.log(`  Output Dir:    ${config.directories.output}`);
      console.log(`  Build Res:     ${config.directories.buildResources}`);
    } catch (err) {
      logger.error(`Failed to load config: ${(err as Error).message}`);
      process.exit(1);
    }
  });

async function initProject(options: {
  name?: string;
  appId?: string;
  electronVersion?: string;
}): Promise<void> {
  const projectDir = process.cwd();
  const projectName = options.name || path.basename(projectDir);
  const appId = options.appId || `com.${projectName.toLowerCase().replace(/[^a-z0-9]/g, '')}.app`;
  const electronVersion = options.electronVersion || '28.0.0';

  logger.step('Init', `Initializing project: ${projectName}`);

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

  const configPath = path.join(projectDir, 'pack.config.json');
  if (await fs.pathExists(configPath)) {
    logger.warn('pack.config.json already exists, skipping');
  } else {
    await fs.writeJson(configPath, config, { spaces: 2 });
    logger.success(`Created pack.config.json`);
  }

  const srcDir = path.join(projectDir, 'src', 'main');
  await fs.ensureDir(srcDir);

  const mainTsPath = path.join(srcDir, 'index.ts');
  if (!(await fs.pathExists(mainTsPath))) {
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
    await fs.writeFile(mainTsPath, mainTsContent);
    logger.success('Created src/main/index.ts');
  }

  const preloadDir = path.join(projectDir, 'src', 'preload');
  await fs.ensureDir(preloadDir);

  const preloadTsPath = path.join(preloadDir, 'index.ts');
  if (!(await fs.pathExists(preloadTsPath))) {
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
    await fs.writeFile(preloadTsPath, preloadTsContent);
    logger.success('Created src/preload/index.ts');
  }

  const rendererDir = path.join(projectDir, 'src', 'renderer');
  await fs.ensureDir(rendererDir);

  const htmlPath = path.join(rendererDir, 'index.html');
  if (!(await fs.pathExists(htmlPath))) {
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
    await fs.writeFile(htmlPath, htmlContent);
    logger.success('Created src/renderer/index.html');
  }

  const buildDir = path.join(projectDir, 'build');
  await fs.ensureDir(buildDir);

  const gitignorePath = path.join(projectDir, '.gitignore');
  if (!(await fs.pathExists(gitignorePath))) {
    const gitignoreContent = `node_modules/
dist/
release/
*.asar
*.asar.unpacked/
.cache/
.DS_Store
Thumbs.db
`;
    await fs.writeFile(gitignorePath, gitignoreContent);
    logger.success('Created .gitignore');
  }

  logger.success(`\nProject "${projectName}" initialized successfully!`);
  logger.info('\nNext steps:');
  logger.info('  1. npm install');
  logger.info('  2. epack build');
}

program.parse();
