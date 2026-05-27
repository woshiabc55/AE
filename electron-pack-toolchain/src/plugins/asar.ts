import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../utils/logger';
import { ensureDir } from '../utils/fs';

interface AsarFileEntry {
  size: number;
  offset: string;
  hash: string;
}

interface AsarHeader {
  files: Record<string, AsarFileEntry | AsarDirectory>;
}

interface AsarDirectory {
  files: Record<string, AsarFileEntry | AsarDirectory>;
}

export class AsarPacker {
  private alignSize = 4;

  async pack(sourceDir: string, outputPath: string, options?: {
    unpack?: string;
    unpackDir?: string;
    ordering?: string;
  }): Promise<void> {
    logger.step('ASAR', `Creating archive from ${sourceDir}`);
    await ensureDir(path.dirname(outputPath));

    const unpackPatterns = options?.unpack
      ? options.unpack.split(',').map((p) => p.trim())
      : [];
    const unpackDirPatterns = options?.unpackDir
      ? options.unpackDir.split(',').map((p) => p.trim())
      : [];

    const header: AsarHeader = { files: {} };
    const fileDataList: Buffer[] = [];
    let currentOffset = 0;

    const buildHeader = async (
      dir: string,
      headerFiles: Record<string, AsarFileEntry | AsarDirectory>
    ): Promise<void> => {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relativePath = path.relative(sourceDir, fullPath);

        if (entry.isDirectory()) {
          const shouldUnpack = unpackDirPatterns.some((pattern) =>
            relativePath.startsWith(pattern) || entry.name === pattern
          );

          if (shouldUnpack) {
            const unpackDir = outputPath.replace('.asar', '.asar.unpacked');
            const destDir = path.join(unpackDir, relativePath);
            await fs.copy(fullPath, destDir);
            continue;
          }

          const subHeader: AsarDirectory = { files: {} };
          headerFiles[entry.name] = subHeader;
          await buildHeader(fullPath, subHeader.files);
        } else if (entry.isFile()) {
          const shouldUnpack = unpackPatterns.some((pattern) =>
            fullPath.endsWith(pattern) || new RegExp(pattern).test(entry.name)
          );

          if (shouldUnpack) {
            const unpackDir = outputPath.replace('.asar', '.asar.unpacked');
            const destPath = path.join(unpackDir, relativePath);
            await fs.copy(fullPath, destPath);
            continue;
          }

          const fileBuffer = await fs.readFile(fullPath);
          const hash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

          headerFiles[entry.name] = {
            size: fileBuffer.length,
            offset: `${currentOffset}`,
            hash,
          };

          fileDataList.push(fileBuffer);
          currentOffset += fileBuffer.length;
        }
      }
    };

    await buildHeader(sourceDir, header.files);

    const headerString = JSON.stringify(header);
    const headerBuf = this.createPickleString(headerString);

    const sizeBuf = this.createPickleUInt32(headerBuf.length);

    const parts: Buffer[] = [
      sizeBuf,
      headerBuf,
      ...fileDataList,
    ];

    const finalBuffer = Buffer.concat(parts);
    await fs.writeFile(outputPath, finalBuffer);

    const sizeMB = (finalBuffer.length / 1024 / 1024).toFixed(2);
    logger.success(`ASAR archive created: ${outputPath} (${sizeMB} MB)`);
  }

  async list(archivePath: string): Promise<AsarHeader> {
    const fd = await fs.open(archivePath, 'r');

    try {
      const sizeBuf = Buffer.alloc(8);
      await fs.read(fd, sizeBuf, 0, 8, 0);

      const sizePickleCapacity = sizeBuf.readUInt32LE(0);
      const headerPickleBufLength = sizeBuf.readUInt32LE(4);

      const headerPickleBuf = Buffer.alloc(headerPickleBufLength);
      await fs.read(fd, headerPickleBuf, 0, headerPickleBufLength, 8);

      const headerStringLength = headerPickleBuf.readUInt32LE(4);
      const headerString = headerPickleBuf.toString('utf-8', 8, 8 + headerStringLength);

      return JSON.parse(headerString);
    } finally {
      await fs.close(fd);
    }
  }

  async extract(archivePath: string, outputDir: string): Promise<void> {
    logger.step('ASAR', `Extracting ${archivePath} to ${outputDir}`);

    const fd = await fs.open(archivePath, 'r');

    try {
      const sizeBuf = Buffer.alloc(8);
      await fs.read(fd, sizeBuf, 0, 8, 0);

      const headerPickleBufLength = sizeBuf.readUInt32LE(4);

      const headerPickleBuf = Buffer.alloc(headerPickleBufLength);
      await fs.read(fd, headerPickleBuf, 0, headerPickleBufLength, 8);

      const headerStringLength = headerPickleBuf.readUInt32LE(4);
      const headerString = headerPickleBuf.toString('utf-8', 8, 8 + headerStringLength);
      const header: AsarHeader = JSON.parse(headerString);

      const dataOffset = 8 + headerPickleBufLength;

      await this.extractFiles(fd, header, outputDir, '', dataOffset);
    } finally {
      await fs.close(fd);
    }

    logger.success(`ASAR archive extracted to ${outputDir}`);
  }

  private async extractFiles(
    fd: number,
    header: AsarHeader | AsarDirectory,
    outputDir: string,
    currentDir: string,
    dataOffset: number
  ): Promise<void> {
    for (const [name, entry] of Object.entries(header.files)) {
      const fullPath = path.join(outputDir, currentDir, name);

      if ('files' in entry) {
        await ensureDir(fullPath);
        await this.extractFiles(fd, entry, outputDir, path.join(currentDir, name), dataOffset);
      } else {
        await ensureDir(path.dirname(fullPath));
        const fileEntry = entry as AsarFileEntry;
        const offset = parseInt(fileEntry.offset, 10);
        const size = fileEntry.size;

        const buffer = Buffer.alloc(size);
        await fs.read(fd, buffer, 0, size, dataOffset + offset);
        await fs.writeFile(fullPath, buffer);
      }
    }
  }

  private createPickleUInt32(value: number): Buffer {
    const buf = Buffer.alloc(8);
    buf.writeUInt32LE(8, 0);
    buf.writeUInt32LE(value, 4);
    return buf;
  }

  private createPickleString(str: string): Buffer {
    const strBuf = Buffer.from(str, 'utf-8');
    const strLen = strBuf.length;
    const pickleDataSize = 4 + strLen;
    const alignedSize = this.align(pickleDataSize);
    const paddingSize = alignedSize - pickleDataSize;

    const buf = Buffer.alloc(4 + alignedSize);
    buf.writeUInt32LE(alignedSize, 0);
    buf.writeUInt32LE(strLen, 4);
    strBuf.copy(buf, 8);

    return buf;
  }

  private align(size: number): number {
    return Math.ceil(size / this.alignSize) * this.alignSize;
  }
}
