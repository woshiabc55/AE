export type Platform = 'win32' | 'darwin' | 'linux';
export type Arch = 'x64' | 'arm64' | 'ia32';
export type InstallerType = 'nsis' | 'dmg' | 'appimage' | 'deb' | 'rpm';
export interface ElectronDownloadConfig {
    version: string;
    mirror?: string;
    customDir?: string;
    customFilename?: string;
}
export interface AsarConfig {
    enabled: boolean;
    unpack?: string;
    unpackDir?: string;
    ordering?: string;
}
export interface CompilerConfig {
    entry: string;
    outDir: string;
    target: 'esbuild' | 'tsc';
    minify: boolean;
    sourcemap: boolean;
    external?: string[];
    define?: Record<string, string>;
}
export interface WinConfig {
    icon?: string;
    executableName?: string;
    requestedExecutionLevel?: 'asInvoker' | 'highestAvailable' | 'requireAdministrator';
}
export interface MacConfig {
    icon?: string;
    category?: string;
    executableName?: string;
    appId?: string;
    entitlements?: string;
    entitlementsInherit?: string;
}
export interface LinuxConfig {
    icon?: string;
    executableName?: string;
    category?: string;
    desktop?: Record<string, string>;
}
export interface NsisConfig {
    oneClick?: boolean;
    perMachine?: boolean;
    allowElevation?: boolean;
    allowToChangeInstallationDirectory?: boolean;
    installerIcon?: string;
    uninstallerIcon?: string;
    installerHeaderIcon?: string;
    installerSidebar?: string;
    deleteAppDataOnUninstall?: boolean;
    shortcutName?: string;
    createDesktopShortcut?: boolean;
    createStartMenuShortcut?: boolean;
    guid?: string;
}
export interface DmgConfig {
    title?: string;
    icon?: string;
    background?: string;
    contents?: Array<{
        x: number;
        y: number;
        type: 'link' | 'file' | 'position';
        path?: string;
    }>;
    windowSize?: {
        width: number;
        height: number;
    };
}
export interface AppImageConfig {
    category?: string;
    desktop?: Record<string, string>;
}
export interface PackConfig {
    appId: string;
    productName: string;
    version: string;
    description?: string;
    copyright?: string;
    directories: {
        app: string;
        buildResources: string;
        output: string;
    };
    electron: ElectronDownloadConfig;
    compiler: CompilerConfig;
    asar: AsarConfig;
    files: string[];
    extraResources?: Array<{
        from: string;
        to: string;
        filter?: string[];
    }>;
    platforms: Array<{
        platform: Platform;
        arch: Arch;
        installerType?: InstallerType;
    }>;
    win?: WinConfig;
    mac?: MacConfig;
    linux?: LinuxConfig;
    nsis?: NsisConfig;
    dmg?: DmgConfig;
    appImage?: AppImageConfig;
}
export declare const DEFAULT_CONFIG: Partial<PackConfig>;
//# sourceMappingURL=types.d.ts.map