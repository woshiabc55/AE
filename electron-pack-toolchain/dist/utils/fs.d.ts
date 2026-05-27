export declare function ensureDir(dirPath: string): Promise<void>;
export declare function copyFiles(source: string, target: string, patterns: string[], excludePatterns?: string[]): Promise<string[]>;
export declare function cleanDir(dirPath: string): Promise<void>;
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function readFile(filePath: string): Promise<string>;
export declare function writeFile(filePath: string, content: string): Promise<void>;
export declare function readJson<T = unknown>(filePath: string): Promise<T>;
export declare function writeJson(filePath: string, data: unknown, pretty?: boolean): Promise<void>;
export declare function resolvePath(basePath: string, targetPath: string): string;
export declare function getDirectorySize(dirPath: string): Promise<number>;
export declare function formatBytes(bytes: number): string;
//# sourceMappingURL=fs.d.ts.map