import { PackConfig, Platform } from './types';
import { CompileResult } from './compiler';
import { PackageResult } from './packager';
import { InstallerResult } from './installer';
export interface BuildOptions {
    config?: string;
    platform?: Platform;
    arch?: string;
    installerType?: string;
    verbose?: boolean;
    skipCompile?: boolean;
    skipInstaller?: boolean;
    clean?: boolean;
}
export interface BuildResult {
    config: PackConfig;
    compileResult?: CompileResult;
    packageResults: PackageResult[];
    installerResults: InstallerResult[];
    totalDuration: number;
}
export declare class Builder {
    private options;
    constructor(options: BuildOptions);
    build(projectRoot?: string): Promise<BuildResult>;
    private loadConfig;
    private resolveTargets;
    private cleanBuildArtifacts;
    private printSummary;
}
//# sourceMappingURL=builder.d.ts.map