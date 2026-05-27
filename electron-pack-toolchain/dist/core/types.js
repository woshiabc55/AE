"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_CONFIG = void 0;
exports.DEFAULT_CONFIG = {
    asar: {
        enabled: true,
    },
    compiler: {
        entry: './src/main/index.ts',
        outDir: './dist/compiled',
        target: 'esbuild',
        minify: true,
        sourcemap: false,
    },
    directories: {
        app: './',
        buildResources: './build',
        output: './release',
    },
    files: ['**/*'],
    electron: {
        version: '28.0.0',
        mirror: 'https://github.com/electron/electron/releases/download/',
    },
    platforms: [
        { platform: process.platform, arch: process.arch },
    ],
};
//# sourceMappingURL=types.js.map