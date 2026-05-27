import { PackConfig } from '../core/types';
export interface DmgResult {
    dmgPath: string;
    size: string;
}
export declare class DmgBuilder {
    private config;
    constructor(config: PackConfig);
    build(appDir: string, outputDir: string): Promise<DmgResult>;
    private createDmg;
    private createDmgWithScript;
    private findAppBundle;
}
//# sourceMappingURL=dmg.d.ts.map