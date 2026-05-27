"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Compiler = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const esbuild_1 = __importDefault(require("esbuild"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
class Compiler {
    config;
    constructor(config) {
        this.config = config;
    }
    async compile() {
        const startTime = Date.now();
        logger_1.logger.step('Compiler', 'Starting source code compilation...');
        await (0, fs_1.ensureDir)(this.config.compiler.outDir);
        await (0, fs_1.cleanDir)(this.config.compiler.outDir);
        const mainEntry = await this.compileMainProcess();
        const preloadEntries = await this.compilePreloadScripts();
        const rendererOutDir = await this.compileRendererProcess();
        const duration = Date.now() - startTime;
        logger_1.logger.success(`Compilation completed in ${(duration / 1000).toFixed(2)}s`);
        return { mainEntry, preloadEntries, rendererOutDir, duration };
    }
    async compileMainProcess() {
        const entry = this.config.compiler.entry;
        const outDir = this.config.compiler.outDir;
        const outfile = path_1.default.join(outDir, 'main', 'index.js');
        logger_1.logger.info(`Compiling main process: ${entry}`);
        if (this.config.compiler.target === 'esbuild') {
            await esbuild_1.default.build({
                entryPoints: [entry],
                bundle: true,
                platform: 'node',
                target: 'node18',
                outfile,
                minify: this.config.compiler.minify,
                sourcemap: this.config.compiler.sourcemap,
                external: [
                    'electron',
                    ...(this.config.compiler.external || []),
                ],
                define: this.config.compiler.define,
                logLevel: 'warning',
            });
        }
        else {
            await this.compileWithTsc(entry, outDir, 'main');
        }
        logger_1.logger.success(`Main process compiled → ${outfile}`);
        return outfile;
    }
    async compilePreloadScripts() {
        const appDir = this.config.directories.app;
        const outDir = this.config.compiler.outDir;
        const preloadDir = path_1.default.join(appDir, 'src', 'preload');
        if (!(await fs_extra_1.default.pathExists(preloadDir))) {
            logger_1.logger.debug('No preload scripts found, skipping');
            return [];
        }
        const entries = (await fs_extra_1.default.readdir(preloadDir))
            .filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
            .map((f) => path_1.default.join(preloadDir, f));
        if (entries.length === 0) {
            return [];
        }
        logger_1.logger.info(`Compiling ${entries.length} preload script(s)`);
        const preloadOutDir = path_1.default.join(outDir, 'preload');
        await (0, fs_1.ensureDir)(preloadOutDir);
        if (this.config.compiler.target === 'esbuild') {
            await esbuild_1.default.build({
                entryPoints: entries,
                bundle: true,
                platform: 'node',
                target: 'node18',
                outdir: preloadOutDir,
                minify: this.config.compiler.minify,
                sourcemap: this.config.compiler.sourcemap,
                external: ['electron'],
                logLevel: 'warning',
            });
        }
        const result = entries.map((e) => {
            const basename = path_1.default.basename(e, path_1.default.extname(e));
            return path_1.default.join(preloadOutDir, `${basename}.js`);
        });
        logger_1.logger.success(`Preload scripts compiled → ${preloadOutDir}`);
        return result;
    }
    async compileRendererProcess() {
        const appDir = this.config.directories.app;
        const outDir = this.config.compiler.outDir;
        const rendererDir = path_1.default.join(appDir, 'src', 'renderer');
        if (!(await fs_extra_1.default.pathExists(rendererDir))) {
            logger_1.logger.debug('No renderer source found, copying as-is');
            const rendererOutDir = path_1.default.join(outDir, 'renderer');
            await (0, fs_1.ensureDir)(rendererOutDir);
            return rendererOutDir;
        }
        const rendererOutDir = path_1.default.join(outDir, 'renderer');
        await (0, fs_1.ensureDir)(rendererOutDir);
        logger_1.logger.info('Processing renderer process files');
        const htmlFiles = (await fs_extra_1.default.readdir(rendererDir)).filter((f) => f.endsWith('.html'));
        if (htmlFiles.length === 0) {
            logger_1.logger.warn('No HTML entry point found in renderer directory');
        }
        const tsEntries = (await fs_extra_1.default.readdir(rendererDir)).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx'));
        if (tsEntries.length > 0 && this.config.compiler.target === 'esbuild') {
            await esbuild_1.default.build({
                entryPoints: tsEntries.map((f) => path_1.default.join(rendererDir, f)),
                bundle: true,
                platform: 'browser',
                target: 'chrome110',
                outdir: rendererOutDir,
                minify: this.config.compiler.minify,
                sourcemap: this.config.compiler.sourcemap,
                logLevel: 'warning',
            });
        }
        for (const htmlFile of htmlFiles) {
            const srcPath = path_1.default.join(rendererDir, htmlFile);
            const destPath = path_1.default.join(rendererOutDir, htmlFile);
            await fs_extra_1.default.copy(srcPath, destPath);
        }
        const cssFiles = (await fs_extra_1.default.readdir(rendererDir)).filter((f) => f.endsWith('.css'));
        for (const cssFile of cssFiles) {
            const srcPath = path_1.default.join(rendererDir, cssFile);
            const destPath = path_1.default.join(rendererOutDir, cssFile);
            await fs_extra_1.default.copy(srcPath, destPath);
        }
        logger_1.logger.success(`Renderer process compiled → ${rendererOutDir}`);
        return rendererOutDir;
    }
    async compileWithTsc(entry, outDir, namespace) {
        const { execFile } = await Promise.resolve().then(() => __importStar(require('child_process')));
        const projectRoot = this.config.directories.app;
        return new Promise((resolve, reject) => {
            const tscPath = path_1.default.join(projectRoot, 'node_modules', '.bin', 'tsc');
            const args = [
                '--outDir', path_1.default.join(outDir, namespace),
                '--rootDir', path_1.default.dirname(entry),
                '--esModuleInterop',
                '--module', 'commonjs',
                '--target', 'ES2022',
            ];
            execFile(tscPath, args, { cwd: projectRoot }, (error, stdout, stderr) => {
                if (error) {
                    reject(new Error(`TypeScript compilation failed: ${stderr || stdout}`));
                }
                else {
                    resolve();
                }
            });
        });
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=compiler.js.map