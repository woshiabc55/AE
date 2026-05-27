import path from 'path';
import fs from 'fs-extra';
import { logger, setLogLevel, LogLevel } from '../utils/logger';
import { ensureDir, cleanDir, formatBytes, getDirectorySize } from '../utils/fs';
import { PackConfig, Platform, InstallerType } from './types';
import { ConfigLoader } from './config';
import { Compiler, CompileResult } from './compiler';
import { Packager, PackageResult } from './packager';
import { InstallerBuilder, InstallerResult } from './installer';

export interface BuildOptions {
  config?: string;
  platform?: Platform;
  arch?: string;
  installerType?: string;
  verbose?: boolean;
  skipCompile?: boolean;
  skipInstaller?: boolean;
  clean?: boolean;
}

export interface BuildResult {
  config: PackConfig;
  compileResult?: CompileResult;
  packageResults: PackageResult[];
  installerResults: InstallerResult[];
  totalDuration: number;
}

export class Builder {
  private options: BuildOptions;

  constructor(options: BuildOptions) {
    this.options = options;
  }

  async build(projectRoot?: string): Promise<BuildResult> {
    const startTime = Date.now();
    const root = projectRoot || process.cwd();

    if (this.options.verbose) {
      setLogLevel(LogLevel.DEBUG);
    }

    logger.info('╔══════════════════════════════════════════════╗');
    logger.info('║   Electron Pack Toolchain - From Source     ║');
    logger.info('╚══════════════════════════════════════════════╝');

    const config = await this.loadConfig(root);

    if (this.options.clean) {
      await this.cleanBuildArtifacts(config);
    }

    await ensureDir(config.directories.output);

    let compileResult: CompileResult | undefined;
    if (!this.options.skipCompile) {
      const compiler = new Compiler(config);
      compileResult = await compiler.compile();
    } else {
      logger.info('Skipping compilation (--skip-compile)');
    }

    const targets = this.resolveTargets(config);

    const packageResults: PackageResult[] = [];
    const installerResults: InstallerResult[] = [];

    for (const target of targets) {
      logger.info(`\n${'═'.repeat(50)}`);
      logger.info(`Building for ${target.platform}-${target.arch}`);
      logger.info(`${'═'.repeat(50)}`);

      const packager = new Packager(config);
      const packageResult = await packager.packageApp(
        compileResult!,
        target.platform,
        target.arch
      );
      packageResults.push(packageResult);

      if (!this.options.skipInstaller && target.installerType) {
        const installerBuilder = new InstallerBuilder(config);
        const installerResult = await installerBuilder.build(
          packageResult,
          target.installerType as InstallerType
        );
        installerResults.push(installerResult);
      }
    }

    const totalDuration = Date.now() - startTime;

    this.printSummary(config, packageResults, installerResults, totalDuration);

    return {
      config,
      compileResult,
      packageResults,
      installerResults,
      totalDuration,
    };
  }

  private async loadConfig(projectRoot: string): Promise<PackConfig> {
    const loader = new ConfigLoader(projectRoot);
    return loader.load(this.options.config);
  }

  private resolveTargets(config: PackConfig): Array<{
    platform: Platform;
    arch: string;
    installerType?: string;
  }> {
    let targets = config.platforms;

    if (this.options.platform) {
      targets = targets.filter((t) => t.platform === this.options.platform);
    }

    if (this.options.arch) {
      targets = targets.filter((t) => t.arch === this.options.arch);
    }

    if (this.options.installerType) {
      targets = targets.map((t) => ({
        ...t,
        installerType: this.options.installerType as InstallerType,
      }));
    }

    if (targets.length === 0) {
      throw new Error('No build targets match the specified criteria');
    }

    return targets;
  }

  private async cleanBuildArtifacts(config: PackConfig): Promise<void> {
    logger.step('Clean', 'Removing build artifacts...');
    await cleanDir(config.compiler.outDir);
    await cleanDir(config.directories.output);
    logger.success('Build artifacts cleaned');
  }

  private printSummary(
    config: PackConfig,
    packageResults: PackageResult[],
    installerResults: InstallerResult[],
    totalDuration: number
  ): void {
    logger.info('\n' + '═'.repeat(50));
    logger.info('Build Summary');
    logger.info('═'.repeat(50));
    logger.info(`Product: ${config.productName} v${config.version}`);
    logger.info(`App ID:  ${config.appId}`);
    logger.info('');

    if (packageResults.length > 0) {
      logger.info('Packages:');
      for (const result of packageResults) {
        logger.info(
          `  ${result.platform}-${result.arch}: ${result.outputDir} (${result.size})`
        );
      }
    }

    if (installerResults.length > 0) {
      logger.info('\nInstallers:');
      for (const result of installerResults) {
        logger.info(
          `  ${result.installerType} (${result.platform}-${result.arch}): ${result.outputPath} (${result.size})`
        );
      }
    }

    logger.info(`\nTotal build time: ${(totalDuration / 1000).toFixed(2)}s`);
    logger.info('═'.repeat(50));
  }
}
