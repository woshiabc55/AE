"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AsarPacker = void 0;
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const crypto_1 = __importDefault(require("crypto"));
const logger_1 = require("../utils/logger");
const fs_1 = require("../utils/fs");
class AsarPacker {
    alignSize = 4;
    async pack(sourceDir, outputPath, options) {
        logger_1.logger.step('ASAR', `Creating archive from ${sourceDir}`);
        await (0, fs_1.ensureDir)(path_1.default.dirname(outputPath));
        const unpackPatterns = options?.unpack
            ? options.unpack.split(',').map((p) => p.trim())
            : [];
        const unpackDirPatterns = options?.unpackDir
            ? options.unpackDir.split(',').map((p) => p.trim())
            : [];
        const header = { files: {} };
        const fileDataList = [];
        let currentOffset = 0;
        const buildHeader = async (dir, headerFiles) => {
            const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path_1.default.join(dir, entry.name);
                const relativePath = path_1.default.relative(sourceDir, fullPath);
                if (entry.isDirectory()) {
                    const shouldUnpack = unpackDirPatterns.some((pattern) => relativePath.startsWith(pattern) || entry.name === pattern);
                    if (shouldUnpack) {
                        const unpackDir = outputPath.replace('.asar', '.asar.unpacked');
                        const destDir = path_1.default.join(unpackDir, relativePath);
                        await fs_extra_1.default.copy(fullPath, destDir);
                        continue;
                    }
                    const subHeader = { files: {} };
                    headerFiles[entry.name] = subHeader;
                    await buildHeader(fullPath, subHeader.files);
                }
                else if (entry.isFile()) {
                    const shouldUnpack = unpackPatterns.some((pattern) => fullPath.endsWith(pattern) || new RegExp(pattern).test(entry.name));
                    if (shouldUnpack) {
                        const unpackDir = outputPath.replace('.asar', '.asar.unpacked');
                        const destPath = path_1.default.join(unpackDir, relativePath);
                        await fs_extra_1.default.copy(fullPath, destPath);
                        continue;
                    }
                    const fileBuffer = await fs_extra_1.default.readFile(fullPath);
                    const hash = crypto_1.default.createHash('sha256').update(fileBuffer).digest('hex');
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
        const parts = [
            sizeBuf,
            headerBuf,
            ...fileDataList,
        ];
        const finalBuffer = Buffer.concat(parts);
        await fs_extra_1.default.writeFile(outputPath, finalBuffer);
        const sizeMB = (finalBuffer.length / 1024 / 1024).toFixed(2);
        logger_1.logger.success(`ASAR archive created: ${outputPath} (${sizeMB} MB)`);
    }
    async list(archivePath) {
        const fd = await fs_extra_1.default.open(archivePath, 'r');
        try {
            const sizeBuf = Buffer.alloc(8);
            await fs_extra_1.default.read(fd, sizeBuf, 0, 8, 0);
            const sizePickleCapacity = sizeBuf.readUInt32LE(0);
            const headerPickleBufLength = sizeBuf.readUInt32LE(4);
            const headerPickleBuf = Buffer.alloc(headerPickleBufLength);
            await fs_extra_1.default.read(fd, headerPickleBuf, 0, headerPickleBufLength, 8);
            const headerStringLength = headerPickleBuf.readUInt32LE(4);
            const headerString = headerPickleBuf.toString('utf-8', 8, 8 + headerStringLength);
            return JSON.parse(headerString);
        }
        finally {
            await fs_extra_1.default.close(fd);
        }
    }
    async extract(archivePath, outputDir) {
        logger_1.logger.step('ASAR', `Extracting ${archivePath} to ${outputDir}`);
        const fd = await fs_extra_1.default.open(archivePath, 'r');
        try {
            const sizeBuf = Buffer.alloc(8);
            await fs_extra_1.default.read(fd, sizeBuf, 0, 8, 0);
            const headerPickleBufLength = sizeBuf.readUInt32LE(4);
            const headerPickleBuf = Buffer.alloc(headerPickleBufLength);
            await fs_extra_1.default.read(fd, headerPickleBuf, 0, headerPickleBufLength, 8);
            const headerStringLength = headerPickleBuf.readUInt32LE(4);
            const headerString = headerPickleBuf.toString('utf-8', 8, 8 + headerStringLength);
            const header = JSON.parse(headerString);
            const dataOffset = 8 + headerPickleBufLength;
            await this.extractFiles(fd, header, outputDir, '', dataOffset);
        }
        finally {
            await fs_extra_1.default.close(fd);
        }
        logger_1.logger.success(`ASAR archive extracted to ${outputDir}`);
    }
    async extractFiles(fd, header, outputDir, currentDir, dataOffset) {
        for (const [name, entry] of Object.entries(header.files)) {
            const fullPath = path_1.default.join(outputDir, currentDir, name);
            if ('files' in entry) {
                await (0, fs_1.ensureDir)(fullPath);
                await this.extractFiles(fd, entry, outputDir, path_1.default.join(currentDir, name), dataOffset);
            }
            else {
                await (0, fs_1.ensureDir)(path_1.default.dirname(fullPath));
                const fileEntry = entry;
                const offset = parseInt(fileEntry.offset, 10);
                const size = fileEntry.size;
                const buffer = Buffer.alloc(size);
                await fs_extra_1.default.read(fd, buffer, 0, size, dataOffset + offset);
                await fs_extra_1.default.writeFile(fullPath, buffer);
            }
        }
    }
    createPickleUInt32(value) {
        const buf = Buffer.alloc(8);
        buf.writeUInt32LE(8, 0);
        buf.writeUInt32LE(value, 4);
        return buf;
    }
    createPickleString(str) {
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
    align(size) {
        return Math.ceil(size / this.alignSize) * this.alignSize;
    }
}
exports.AsarPacker = AsarPacker;
//# sourceMappingURL=asar.js.map