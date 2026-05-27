import { PackConfig } from './types';
export interface CompileResult {
    mainEntry: string;
    preloadEntries: string[];
    rendererOutDir: string;
    duration: number;
}
export declare class Compiler {
    private config;
    constructor(config: PackConfig);
    compile(): Promise<CompileResult>;
    private compileMainProcess;
    private compilePreloadScripts;
    private compileRendererProcess;
    private compileWithTsc;
}
//# sourceMappingURL=compiler.d.ts.map