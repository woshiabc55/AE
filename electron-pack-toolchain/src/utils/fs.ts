import fs from 'fs-extra';
import path from 'path';
import glob from 'glob';
import { logger } from './logger';

export async function ensureDir(dirPath: string): Promise<void> {
  await fs.ensureDir(dirPath);
}

export async function copyFiles(
  source: string,
  target: string,
  patterns: string[],
  excludePatterns: string[] = []
): Promise<string[]> {
  const copiedFiles: string[] = [];

  for (const pattern of patterns) {
    const files = glob.sync(pattern, {
      cwd: source,
      nodir: true,
      ignore: [
        'node_modules/**',
        '.git/**',
        'dist/**',
        'release/**',
        ...excludePatterns,
      ],
    });

    for (const file of files) {
      const srcPath = path.join(source, file);
      const destPath = path.join(target, file);

      await fs.ensureDir(path.dirname(destPath));
      await fs.copy(srcPath, destPath);
      copiedFiles.push(file);
    }
  }

  return copiedFiles;
}

export async function cleanDir(dirPath: string): Promise<void> {
  if (await fs.pathExists(dirPath)) {
    await fs.emptyDir(dirPath);
    logger.debug(`Cleaned directory: ${dirPath}`);
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  return fs.pathExists(filePath);
}

export async function readFile(filePath: string): Promise<string> {
  return fs.readFile(filePath, 'utf-8');
}

export async function writeFile(filePath: string, content: string): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, content, 'utf-8');
}

export async function readJson<T = unknown>(filePath: string): Promise<T> {
  return fs.readJson(filePath);
}

export async function writeJson(filePath: string, data: unknown, pretty = true): Promise<void> {
  await fs.ensureDir(path.dirname(filePath));
  await fs.writeJson(filePath, data, { spaces: pretty ? 2 : 0 });
}

export function resolvePath(basePath: string, targetPath: string): string {
  return path.isAbsolute(targetPath) ? targetPath : path.resolve(basePath, targetPath);
}

export async function getDirectorySize(dirPath: string): Promise<number> {
  let totalSize = 0;
  const entries = await fs.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      totalSize += await getDirectorySize(fullPath);
    } else {
      const stat = await fs.stat(fullPath);
      totalSize += stat.size;
    }
  }

  return totalSize;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
