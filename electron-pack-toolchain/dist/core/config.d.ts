import { PackConfig } from './types';
export declare class ConfigLoader {
    private projectRoot;
    constructor(projectRoot: string);
    load(configPath?: string): Promise<PackConfig>;
    private findConfigFile;
    private mergeWithDefaults;
    private validate;
    private validatePlatformConfig;
    private resolvePaths;
}
//# sourceMappingURL=config.d.ts.map