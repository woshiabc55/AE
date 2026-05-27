"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
const config_1 = require("./config");
const compiler_1 = require("./compiler");
const packager_1 = require("./packager");
const installer_1 = require("./installer");
class Builder {
    options;
    constructor(options) {
        this.options = options;
    }
    async build(projectRoot) {
        const startTime = Date.now();
        const root = projectRoot || process.cwd();
        if (this.options.verbose) {
            (0, logger_1.setLogLevel)(logger_1.LogLevel.DEBUG);
        }
        logger_1.logger.info('╔══════════════════════════════════════════════╗');
        logger_1.logger.info('║   Electron Pack Toolchain - From Source     ║');
        logger_1.logger.info('╚══════════════════════════════════════════════╝');
        const config = await this.loadConfig(root);
        if (this.options.clean) {
            await this.cleanBuildArtifacts(config);
        }
        await (0, fs_1.ensureDir)(config.directories.output);
        let compileResult;
        if (!this.options.skipCompile) {
            const compiler = new compiler_1.Compiler(config);
            compileResult = await compiler.compile();
        }
        else {
            logger_1.logger.info('Skipping compilation (--skip-compile)');
        }
        const targets = this.resolveTargets(config);
        const packageResults = [];
        const installerResults = [];
        for (const target of targets) {
            logger_1.logger.info(`\n${'═'.repeat(50)}`);
            logger_1.logger.info(`Building for ${target.platform}-${target.arch}`);
            logger_1.logger.info(`${'═'.repeat(50)}`);
            const packager = new packager_1.Packager(config);
            const packageResult = await packager.packageApp(compileResult, target.platform, target.arch);
            packageResults.push(packageResult);
            if (!this.options.skipInstaller && target.installerType) {
                const installerBuilder = new installer_1.InstallerBuilder(config);
                const installerResult = await installerBuilder.build(packageResult, target.installerType);
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
    async loadConfig(projectRoot) {
        const loader = new config_1.ConfigLoader(projectRoot);
        return loader.load(this.options.config);
    }
    resolveTargets(config) {
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
                installerType: this.options.installerType,
            }));
        }
        if (targets.length === 0) {
            throw new Error('No build targets match the specified criteria');
        }
        return targets;
    }
    async cleanBuildArtifacts(config) {
        logger_1.logger.step('Clean', 'Removing build artifacts...');
        await (0, fs_1.cleanDir)(config.compiler.outDir);
        await (0, fs_1.cleanDir)(config.directories.output);
        logger_1.logger.success('Build artifacts cleaned');
    }
    printSummary(config, packageResults, installerResults, totalDuration) {
        logger_1.logger.info('\n' + '═'.repeat(50));
        logger_1.logger.info('Build Summary');
        logger_1.logger.info('═'.repeat(50));
        logger_1.logger.info(`Product: ${config.productName} v${config.version}`);
        logger_1.logger.info(`App ID:  ${config.appId}`);
        logger_1.logger.info('');
        if (packageResults.length > 0) {
            logger_1.logger.info('Packages:');
            for (const result of packageResults) {
                logger_1.logger.info(`  ${result.platform}-${result.arch}: ${result.outputDir} (${result.size})`);
            }
        }
        if (installerResults.length > 0) {
            logger_1.logger.info('\nInstallers:');
            for (const result of installerResults) {
                logger_1.logger.info(`  ${result.installerType} (${result.platform}-${result.arch}): ${result.outputPath} (${result.size})`);
            }
        }
        logger_1.logger.info(`\nTotal build time: ${(totalDuration / 1000).toFixed(2)}s`);
        logger_1.logger.info('═'.repeat(50));
    }
}
exports.Builder = Builder;
//# sourceMappingURL=builder.js.map