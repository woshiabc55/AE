import { PackConfig } from '../core/types';
export interface AppImageResult {
    appImagePath: string;
    size: string;
}
export declare class AppImageBuilder {
    private config;
    constructor(config: PackConfig);
    build(appDir: string, outputDir: string): Promise<AppImageResult>;
    private createAppDirStructure;
    private createDesktopEntry;
    private copyIcons;
    private createTarGz;
    private findAppimagetool;
    private getFileSize;
}
//# sourceMappingURL=appimage.d.ts.map