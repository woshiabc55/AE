import crypto from 'crypto';
import fs from 'fs-extra';
import path from 'path';
import { pipeline } from 'stream/promises';
import { createWriteStream } from 'fs';
import https from 'https';
import http from 'http';
import { URL } from 'url';
import { logger } from './logger';
import { ensureDir } from './fs';

export interface DownloadProgress {
  percent: number;
  transferred: number;
  total: number;
}

export async function downloadFile(
  url: string,
  destPath: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<void> {
  await ensureDir(path.dirname(destPath));

  const tempPath = destPath + '.download';

  try {
    await downloadWithRedirects(url, tempPath, onProgress, 5);
    await fs.move(tempPath, destPath, { overwrite: true });
    logger.debug(`Downloaded: ${url} → ${destPath}`);
  } catch (err) {
    await fs.remove(tempPath).catch(() => {});
    throw new Error(`Failed to download ${url}: ${(err as Error).message}`);
  }
}

function downloadWithRedirects(
  url: string,
  destPath: string,
  onProgress?: (progress: DownloadProgress) => void,
  maxRedirects = 5
): Promise<void> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;

    const request = protocol.get(
      url,
      {
        headers: {
          'User-Agent': 'electron-pack-toolchain/1.0.0',
        },
      },
      (response) => {
        if (
          response.statusCode &&
          response.statusCode >= 300 &&
          response.statusCode < 400 &&
          response.headers.location
        ) {
          if (maxRedirects <= 0) {
            reject(new Error('Too many redirects'));
            return;
          }
          const redirectUrl = new URL(response.headers.location, url).toString();
          downloadWithRedirects(redirectUrl, destPath, onProgress, maxRedirects - 1)
            .then(resolve)
            .catch(reject);
          return;
        }

        if (response.statusCode && response.statusCode >= 400) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        const total = parseInt(response.headers['content-length'] || '0', 10);
        let transferred = 0;

        const fileStream = createWriteStream(destPath);

        response.on('data', (chunk: Buffer) => {
          transferred += chunk.length;
          if (onProgress && total > 0) {
            onProgress({
              percent: transferred / total,
              transferred,
              total,
            });
          }
        });

        response.on('error', (err) => {
          fileStream.destroy();
          reject(err);
        });

        fileStream.on('error', (err) => {
          response.destroy();
          reject(err);
        });

        fileStream.on('finish', () => {
          fileStream.close();
          resolve();
        });

        response.pipe(fileStream);
      }
    );

    request.on('error', reject);
    request.setTimeout(60000, () => {
      request.destroy();
      reject(new Error('Download timeout'));
    });
  });
}

export async function verifyFileHash(
  filePath: string,
  expectedHash: string,
  algorithm: 'sha256' | 'sha512' | 'md5' = 'sha256'
): Promise<boolean> {
  const fileBuffer = await fs.readFile(filePath);
  const hash = crypto.createHash(algorithm).update(fileBuffer).digest('hex');
  const matches = hash === expectedHash;
  if (!matches) {
    logger.warn(`Hash mismatch for ${filePath}: expected ${expectedHash}, got ${hash}`);
  }
  return matches;
}

export function getElectronDownloadUrl(
  version: string,
  platform: string,
  arch: string,
  mirror?: string
): string {
  const baseMirror = mirror || 'https://github.com/electron/electron/releases/download/';
  const platformArch = getPlatformArchName(platform, arch);
  const filename = `electron-v${version}-${platformArch}.zip`;
  return `${baseMirror}v${version}/${filename}`;
}

function getPlatformArchName(platform: string, arch: string): string {
  const platformMap: Record<string, Record<string, string>> = {
    win32: { x64: 'win32-x64', ia32: 'win32-ia32', arm64: 'win32-arm64' },
    darwin: { x64: 'darwin-x64', arm64: 'darwin-arm64' },
    linux: { x64: 'linux-x64', ia32: 'linux-ia32', arm64: 'linux-arm64' },
  };
  return platformMap[platform]?.[arch] || `${platform}-${arch}`;
}

export function getElectronCacheDir(): string {
  const homeDir = process.env.HOME || process.env.USERPROFILE || '/tmp';
  return path.join(homeDir, '.cache', 'electron-pack-toolchain');
}
