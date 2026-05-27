import path from 'path';
import Ajv from 'ajv';
import { PackConfig, DEFAULT_CONFIG, Platform, Arch, InstallerType } from './types';
import { readJson, fileExists, resolvePath } from '../utils/fs';
import { logger } from '../utils/logger';

const configSchema = {
  type: 'object',
  required: ['appId', 'productName', 'version', 'electron'],
  properties: {
    appId: { type: 'string', minLength: 1 },
    productName: { type: 'string', minLength: 1 },
    version: { type: 'string', minLength: 1 },
    description: { type: 'string' },
    copyright: { type: 'string' },
    directories: {
      type: 'object',
      properties: {
        app: { type: 'string' },
        buildResources: { type: 'string' },
        output: { type: 'string' },
      },
    },
    electron: {
      type: 'object',
      required: ['version'],
      properties: {
        version: { type: 'string' },
        mirror: { type: 'string' },
        customDir: { type: 'string' },
        customFilename: { type: 'string' },
      },
    },
    compiler: {
      type: 'object',
      properties: {
        entry: { type: 'string' },
        outDir: { type: 'string' },
        target: { enum: ['esbuild', 'tsc'] },
        minify: { type: 'boolean' },
        sourcemap: { type: 'boolean' },
        external: { type: 'array', items: { type: 'string' } },
        define: { type: 'object' },
      },
    },
    asar: {
      type: 'object',
      properties: {
        enabled: { type: 'boolean' },
        unpack: { type: 'string' },
        unpackDir: { type: 'string' },
        ordering: { type: 'string' },
      },
    },
    files: {
      type: 'array',
      items: { type: 'string' },
    },
    extraResources: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          from: { type: 'string' },
          to: { type: 'string' },
          filter: { type: 'array', items: { type: 'string' } },
        },
      },
    },
    platforms: {
      type: 'array',
      items: {
        type: 'object',
        required: ['platform', 'arch'],
        properties: {
          platform: { enum: ['win32', 'darwin', 'linux'] },
          arch: { enum: ['x64', 'arm64', 'ia32'] },
          installerType: { enum: ['nsis', 'dmg', 'appimage', 'deb', 'rpm'] },
        },
      },
    },
    win: { type: 'object' },
    mac: { type: 'object' },
    linux: { type: 'object' },
    nsis: { type: 'object' },
    dmg: { type: 'object' },
    appImage: { type: 'object' },
  },
};

export class ConfigLoader {
  private projectRoot: string;

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot;
  }

  async load(configPath?: string): Promise<PackConfig> {
    const resolvedPath = configPath
      ? resolvePath(this.projectRoot, configPath)
      : await this.findConfigFile();

    if (!resolvedPath || !(await fileExists(resolvedPath))) {
      throw new Error(
        `Configuration file not found. Create a pack.config.json in the project root.`
      );
    }

    logger.step('Config', `Loading configuration from ${resolvedPath}`);

    const rawConfig = await readJson<Record<string, unknown>>(resolvedPath);
    const config = this.mergeWithDefaults(rawConfig as Record<string, unknown>);
    this.validate(config);

    this.resolvePaths(config);

    logger.success('Configuration loaded successfully');
    return config;
  }

  private async findConfigFile(): Promise<string | null> {
    const candidates = [
      'pack.config.json',
      'pack.config.js',
      '.epackrc',
      '.epackrc.json',
    ];

    for (const candidate of candidates) {
      const fullPath = path.join(this.projectRoot, candidate);
      if (await fileExists(fullPath)) {
        return fullPath;
      }
    }

    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    if (await fileExists(packageJsonPath)) {
      const pkg = await readJson<Record<string, unknown>>(packageJsonPath);
      if (pkg.epack || pkg.electronPack) {
        return packageJsonPath;
      }
    }

    return null;
  }

  private mergeWithDefaults(raw: Record<string, unknown>): PackConfig {
    return {
      appId: raw.appId as string,
      productName: raw.productName as string,
      version: raw.version as string,
      description: (raw.description as string) || '',
      copyright: (raw.copyright as string) || `Copyright © ${new Date().getFullYear()}`,
      directories: {
        ...DEFAULT_CONFIG.directories!,
        ...(raw.directories as Record<string, string>),
      },
      electron: {
        ...DEFAULT_CONFIG.electron!,
        ...(raw.electron as Record<string, unknown>),
      },
      compiler: {
        ...DEFAULT_CONFIG.compiler!,
        ...(raw.compiler as Record<string, unknown>),
      },
      asar: {
        ...DEFAULT_CONFIG.asar!,
        ...(raw.asar as Record<string, unknown>),
      },
      files: (raw.files as string[]) || DEFAULT_CONFIG.files!,
      extraResources: raw.extraResources as PackConfig['extraResources'],
      platforms: (raw.platforms as PackConfig['platforms']) || DEFAULT_CONFIG.platforms!,
      win: raw.win as PackConfig['win'],
      mac: raw.mac as PackConfig['mac'],
      linux: raw.linux as PackConfig['linux'],
      nsis: raw.nsis as PackConfig['nsis'],
      dmg: raw.dmg as PackConfig['dmg'],
      appImage: raw.appImage as PackConfig['appImage'],
    };
  }

  private validate(config: PackConfig): void {
    const ajv = new Ajv({ allErrors: true });
    const validate = ajv.compile(configSchema);

    if (!validate(config)) {
      const errors = validate.errors
        ?.map((e) => `${e.instancePath} ${e.message}`)
        .join('\n');
      throw new Error(`Configuration validation failed:\n${errors}`);
    }

    this.validatePlatformConfig(config);
  }

  private validatePlatformConfig(config: PackConfig): void {
    for (const target of config.platforms) {
      if (target.platform === 'win32' && target.installerType === 'dmg') {
        throw new Error(`Invalid installer type "dmg" for platform "win32"`);
      }
      if (target.platform === 'darwin' && target.installerType === 'nsis') {
        throw new Error(`Invalid installer type "nsis" for platform "darwin"`);
      }
      if (target.platform === 'linux' && (target.installerType === 'nsis' || target.installerType === 'dmg')) {
        throw new Error(`Invalid installer type "${target.installerType}" for platform "linux"`);
      }
    }
  }

  private resolvePaths(config: PackConfig): void {
    config.directories.app = resolvePath(this.projectRoot, config.directories.app);
    config.directories.buildResources = resolvePath(this.projectRoot, config.directories.buildResources);
    config.directories.output = resolvePath(this.projectRoot, config.directories.output);
    config.compiler.outDir = resolvePath(this.projectRoot, config.compiler.outDir);
    config.compiler.entry = resolvePath(this.projectRoot, config.compiler.entry);
  }
}
