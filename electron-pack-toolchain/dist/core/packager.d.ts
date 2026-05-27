import { PackConfig, Platform } from './types';
import { CompileResult } from './compiler';
export interface PackageResult {
    platform: Platform;
    arch: string;
    outputDir: string;
    size: string;
    duration: number;
}
export declare class Packager {
    private config;
    private asarPacker;
    constructor(config: PackConfig);
    packageApp(compileResult: CompileResult, platform: Platform, arch: string): Promise<PackageResult>;
    private ensureElectronBinary;
    private copyElectronTemplate;
    private getResourcesDir;
    private createAsarArchive;
    private copyAppFiles;
    private copyExtraResources;
    private updateAppMetadata;
    private updateMacInfoPlist;
    private customizeExecutable;
    private customizeWindowsExe;
    private customizeLinuxDesktop;
    private getAppOutputDir;
}
//# sourceMappingURL=packager.d.ts.map