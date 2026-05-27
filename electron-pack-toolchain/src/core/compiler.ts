import path from 'path';
import fs from 'fs-extra';
import esbuild from 'esbuild';
import { logger } from '../utils/logger';
import { ensureDir, cleanDir } from '../utils/fs';
import { PackConfig } from './types';

export interface CompileResult {
  mainEntry: string;
  preloadEntries: string[];
  rendererOutDir: string;
  duration: number;
}

export class Compiler {
  private config: PackConfig;

  constructor(config: PackConfig) {
    this.config = config;
  }

  async compile(): Promise<CompileResult> {
    const startTime = Date.now();
    logger.step('Compiler', 'Starting source code compilation...');

    await ensureDir(this.config.compiler.outDir);
    await cleanDir(this.config.compiler.outDir);

    const mainEntry = await this.compileMainProcess();
    const preloadEntries = await this.compilePreloadScripts();
    const rendererOutDir = await this.compileRendererProcess();

    const duration = Date.now() - startTime;
    logger.success(`Compilation completed in ${(duration / 1000).toFixed(2)}s`);

    return { mainEntry, preloadEntries, rendererOutDir, duration };
  }

  private async compileMainProcess(): Promise<string> {
    const entry = this.config.compiler.entry;
    const outDir = this.config.compiler.outDir;
    const outfile = path.join(outDir, 'main', 'index.js');

    logger.info(`Compiling main process: ${entry}`);

    if (this.config.compiler.target === 'esbuild') {
      await esbuild.build({
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
    } else {
      await this.compileWithTsc(entry, outDir, 'main');
    }

    logger.success(`Main process compiled → ${outfile}`);
    return outfile;
  }

  private async compilePreloadScripts(): Promise<string[]> {
    const appDir = this.config.directories.app;
    const outDir = this.config.compiler.outDir;
    const preloadDir = path.join(appDir, 'src', 'preload');

    if (!(await fs.pathExists(preloadDir))) {
      logger.debug('No preload scripts found, skipping');
      return [];
    }

    const entries = (await fs.readdir(preloadDir))
      .filter((f) => f.endsWith('.ts') || f.endsWith('.js'))
      .map((f) => path.join(preloadDir, f));

    if (entries.length === 0) {
      return [];
    }

    logger.info(`Compiling ${entries.length} preload script(s)`);

    const preloadOutDir = path.join(outDir, 'preload');
    await ensureDir(preloadOutDir);

    if (this.config.compiler.target === 'esbuild') {
      await esbuild.build({
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
      const basename = path.basename(e, path.extname(e));
      return path.join(preloadOutDir, `${basename}.js`);
    });

    logger.success(`Preload scripts compiled → ${preloadOutDir}`);
    return result;
  }

  private async compileRendererProcess(): Promise<string> {
    const appDir = this.config.directories.app;
    const outDir = this.config.compiler.outDir;
    const rendererDir = path.join(appDir, 'src', 'renderer');

    if (!(await fs.pathExists(rendererDir))) {
      logger.debug('No renderer source found, copying as-is');
      const rendererOutDir = path.join(outDir, 'renderer');
      await ensureDir(rendererOutDir);
      return rendererOutDir;
    }

    const rendererOutDir = path.join(outDir, 'renderer');
    await ensureDir(rendererOutDir);

    logger.info('Processing renderer process files');

    const htmlFiles = (await fs.readdir(rendererDir)).filter((f) =>
      f.endsWith('.html')
    );

    if (htmlFiles.length === 0) {
      logger.warn('No HTML entry point found in renderer directory');
    }

    const tsEntries = (await fs.readdir(rendererDir)).filter((f) =>
      f.endsWith('.ts') || f.endsWith('.tsx')
    );

    if (tsEntries.length > 0 && this.config.compiler.target === 'esbuild') {
      await esbuild.build({
        entryPoints: tsEntries.map((f) => path.join(rendererDir, f)),
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
      const srcPath = path.join(rendererDir, htmlFile);
      const destPath = path.join(rendererOutDir, htmlFile);
      await fs.copy(srcPath, destPath);
    }

    const cssFiles = (await fs.readdir(rendererDir)).filter((f) =>
      f.endsWith('.css')
    );
    for (const cssFile of cssFiles) {
      const srcPath = path.join(rendererDir, cssFile);
      const destPath = path.join(rendererOutDir, cssFile);
      await fs.copy(srcPath, destPath);
    }

    logger.success(`Renderer process compiled → ${rendererOutDir}`);
    return rendererOutDir;
  }

  private async compileWithTsc(
    entry: string,
    outDir: string,
    namespace: string
  ): Promise<void> {
    const { execFile } = await import('child_process');
    const projectRoot = this.config.directories.app;

    return new Promise((resolve, reject) => {
      const tscPath = path.join(projectRoot, 'node_modules', '.bin', 'tsc');
      const args = [
        '--outDir', path.join(outDir, namespace),
        '--rootDir', path.dirname(entry),
        '--esModuleInterop',
        '--module', 'commonjs',
        '--target', 'ES2022',
      ];

      execFile(tscPath, args, { cwd: projectRoot }, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`TypeScript compilation failed: ${stderr || stdout}`));
        } else {
          resolve();
        }
      });
    });
  }
}
