"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigLoader = void 0;
const path_1 = __importDefault(require("path"));
const ajv_1 = __importDefault(require("ajv"));
const types_1 = require("./types");
const fs_1 = require("../utils/fs");
const logger_1 = require("../utils/logger");
const configSchema = {
    type: 'object',
    required: ['appId', 'productName', 'version', 'electron'],
    properties: {
        appId: { type: 'string', minLength: 1 },
        productName: { type: 'string', minLength: 1 },
        version: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        copyright: { type: 'string' },
        directories: {
            type: 'object',
            properties: {
                app: { type: 'string' },
                buildResources: { type: 'string' },
                output: { type: 'string' },
            },
        },
        electron: {
            type: 'object',
            required: ['version'],
            properties: {
                version: { type: 'string' },
                mirror: { type: 'string' },
                customDir: { type: 'string' },
                customFilename: { type: 'string' },
            },
        },
        compiler: {
            type: 'object',
            properties: {
                entry: { type: 'string' },
                outDir: { type: 'string' },
                target: { enum: ['esbuild', 'tsc'] },
                minify: { type: 'boolean' },
                sourcemap: { type: 'boolean' },
                external: { type: 'array', items: { type: 'string' } },
                define: { type: 'object' },
            },
        },
        asar: {
            type: 'object',
            properties: {
                enabled: { type: 'boolean' },
                unpack: { type: 'string' },
                unpackDir: { type: 'string' },
                ordering: { type: 'string' },
            },
        },
        files: {
            type: 'array',
            items: { type: 'string' },
        },
        extraResources: {
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    from: { type: 'string' },
                    to: { type: 'string' },
                    filter: { type: 'array', items: { type: 'string' } },
                },
            },
        },
        platforms: {
            type: 'array',
            items: {
                type: 'object',
                required: ['platform', 'arch'],
                properties: {
                    platform: { enum: ['win32', 'darwin', 'linux'] },
                    arch: { enum: ['x64', 'arm64', 'ia32'] },
                    installerType: { enum: ['nsis', 'dmg', 'appimage', 'deb', 'rpm'] },
                },
            },
        },
        win: { type: 'object' },
        mac: { type: 'object' },
        linux: { type: 'object' },
        nsis: { type: 'object' },
        dmg: { type: 'object' },
        appImage: { type: 'object' },
    },
};
class ConfigLoader {
    projectRoot;
    constructor(projectRoot) {
        this.projectRoot = projectRoot;
    }
    async load(configPath) {
        const resolvedPath = configPath
            ? (0, fs_1.resolvePath)(this.projectRoot, configPath)
            : await this.findConfigFile();
        if (!resolvedPath || !(await (0, fs_1.fileExists)(resolvedPath))) {
            throw new Error(`Configuration file not found. Create a pack.config.json in the project root.`);
        }
        logger_1.logger.step('Config', `Loading configuration from ${resolvedPath}`);
        const rawConfig = await (0, fs_1.readJson)(resolvedPath);
        const config = this.mergeWithDefaults(rawConfig);
        this.validate(config);
        this.resolvePaths(config);
        logger_1.logger.success('Configuration loaded successfully');
        return config;
    }
    async findConfigFile() {
        const candidates = [
            'pack.config.json',
            'pack.config.js',
            '.epackrc',
            '.epackrc.json',
        ];
        for (const candidate of candidates) {
            const fullPath = path_1.default.join(this.projectRoot, candidate);
            if (await (0, fs_1.fileExists)(fullPath)) {
                return fullPath;
            }
        }
        const packageJsonPath = path_1.default.join(this.projectRoot, 'package.json');
        if (await (0, fs_1.fileExists)(packageJsonPath)) {
            const pkg = await (0, fs_1.readJson)(packageJsonPath);
            if (pkg.epack || pkg.electronPack) {
                return packageJsonPath;
            }
        }
        return null;
    }
    mergeWithDefaults(raw) {
        return {
            appId: raw.appId,
            productName: raw.productName,
            version: raw.version,
            description: raw.description || '',
            copyright: raw.copyright || `Copyright © ${new Date().getFullYear()}`,
            directories: {
                ...types_1.DEFAULT_CONFIG.directories,
                ...raw.directories,
            },
            electron: {
                ...types_1.DEFAULT_CONFIG.electron,
                ...raw.electron,
            },
            compiler: {
                ...types_1.DEFAULT_CONFIG.compiler,
                ...raw.compiler,
            },
            asar: {
                ...types_1.DEFAULT_CONFIG.asar,
                ...raw.asar,
            },
            files: raw.files || types_1.DEFAULT_CONFIG.files,
            extraResources: raw.extraResources,
            platforms: raw.platforms || types_1.DEFAULT_CONFIG.platforms,
            win: raw.win,
            mac: raw.mac,
            linux: raw.linux,
            nsis: raw.nsis,
            dmg: raw.dmg,
            appImage: raw.appImage,
        };
    }
    validate(config) {
        const ajv = new ajv_1.default({ allErrors: true });
        const validate = ajv.compile(configSchema);
        if (!validate(config)) {
            const errors = validate.errors
                ?.map((e) => `${e.instancePath} ${e.message}`)
                .join('\n');
            throw new Error(`Configuration validation failed:\n${errors}`);
        }
        this.validatePlatformConfig(config);
    }
    validatePlatformConfig(config) {
        for (const target of config.platforms) {
            if (target.platform === 'win32' && target.installerType === 'dmg') {
                throw new Error(`Invalid installer type "dmg" for platform "win32"`);
            }
            if (target.platform === 'darwin' && target.installerType === 'nsis') {
                throw new Error(`Invalid installer type "nsis" for platform "darwin"`);
            }
            if (target.platform === 'linux' && (target.installerType === 'nsis' || target.installerType === 'dmg')) {
                throw new Error(`Invalid installer type "${target.installerType}" for platform "linux"`);
            }
        }
    }
    resolvePaths(config) {
        config.directories.app = (0, fs_1.resolvePath)(this.projectRoot, config.directories.app);
        config.directories.buildResources = (0, fs_1.resolvePath)(this.projectRoot, config.directories.buildResources);
        config.directories.output = (0, fs_1.resolvePath)(this.projectRoot, config.directories.output);
        config.compiler.outDir = (0, fs_1.resolvePath)(this.projectRoot, config.compiler.outDir);
        config.compiler.entry = (0, fs_1.resolvePath)(this.projectRoot, config.compiler.entry);
    }
}
exports.ConfigLoader = ConfigLoader;
//# sourceMappingURL=config.js.map