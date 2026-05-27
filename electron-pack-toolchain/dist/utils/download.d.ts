export interface DownloadProgress {
    percent: number;
    transferred: number;
    total: number;
}
export declare function downloadFile(url: string, destPath: string, onProgress?: (progress: DownloadProgress) => void): Promise<void>;
export declare function verifyFileHash(filePath: string, expectedHash: string, algorithm?: 'sha256' | 'sha512' | 'md5'): Promise<boolean>;
export declare function getElectronDownloadUrl(version: string, platform: string, arch: string, mirror?: string): string;
export declare function getElectronCacheDir(): string;
//# sourceMappingURL=download.d.ts.map