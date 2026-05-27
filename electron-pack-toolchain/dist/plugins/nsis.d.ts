import { PackConfig } from '../core/types';
export interface NsisResult {
    installerPath: string;
    size: string;
}
export declare class NsisBuilder {
    private config;
    constructor(config: PackConfig);
    build(appDir: string, outputDir: string): Promise<NsisResult>;
    private generateNsisScript;
    private getInstallerName;
    private findMakensis;
}
//# sourceMappingURL=nsis.d.ts.map