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
export declare class AsarPacker {
    private alignSize;
    pack(sourceDir: string, outputPath: string, options?: {
        unpack?: string;
        unpackDir?: string;
        ordering?: string;
    }): Promise<void>;
    list(archivePath: string): Promise<AsarHeader>;
    extract(archivePath: string, outputDir: string): Promise<void>;
    private extractFiles;
    private createPickleUInt32;
    private createPickleString;
    private align;
}
export {};
//# sourceMappingURL=asar.d.ts.map