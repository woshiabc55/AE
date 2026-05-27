import { PackConfig, Platform, InstallerType } from './types';
import { PackageResult } from './packager';
export interface InstallerResult {
    platform: Platform;
    arch: string;
    installerType: InstallerType;
    outputPath: string;
    size: string;
}
export declare class InstallerBuilder {
    private config;
    constructor(config: PackConfig);
    build(packageResult: PackageResult, installerType?: InstallerType): Promise<InstallerResult>;
    private getDefaultInstallerType;
    private buildNsis;
    private buildDmg;
    private buildAppImage;
    private buildDeb;
    private buildRpm;
    private buildArchive;
    private estimateInstalledSize;
}
//# sourceMappingURL=installer.d.ts.map