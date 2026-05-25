import { EventEmitter } from "events";
import yaml from "js-yaml";
import fs from "fs";
import path from "path";
import { globalEventBus } from "./event-bus";
import { globalLogger } from "./logger";

type ConfigValue = string | number | boolean | null | ConfigObject | ConfigValue[];
interface ConfigObject {
  [key: string]: ConfigValue;
}

type ConfigChangeListener = (key: string, newValue: ConfigValue, oldValue: ConfigValue) => void;

interface ConfigSchema {
  [key: string]: {
    type: "string" | "number" | "boolean" | "object" | "array";
    required: boolean;
    defaultValue: ConfigValue;
    validator?: (value: ConfigValue) => boolean;
  };
}

interface ConfigLayer {
  name: string;
  priority: number;
  data: ConfigObject;
}

interface ConfigManagerOptions {
  configDir: string;
  schema?: ConfigSchema;
  watchForChanges: boolean;
}

const CONFIG_CHANGE_EVENT = "config:change";

class ConfigManager {
  private layers: ConfigLayer[];
  private schema: ConfigSchema;
  private configDir: string;
  private changeListeners: Map<string, Set<ConfigChangeListener>>;
  private emitter: EventEmitter;
  private watchers: Map<string, fs.FSWatcher>;
  private mergedCache: ConfigObject | null;

  constructor(options: ConfigManagerOptions) {
    this.layers = [];
    this.schema = options.schema ?? {};
    this.configDir = options.configDir;
    this.changeListeners = new Map();
    this.emitter = new EventEmitter();
    this.watchers = new Map();
    this.mergedCache = null;
  }

  async initialize(): Promise<void> {
    await this.loadDefaultLayer();
    await this.loadUserLayer();
    await this.loadProjectLayer();
    this.invalidateCache();
    globalLogger.info("ConfigManager initialized", {
      layers: this.layers.map((l) => l.name),
    });
  }

  get<T extends ConfigValue>(key: string, defaultValue?: T): T {
    const merged = this.getMerged();
    const keys = key.split(".");
    let current: ConfigValue = merged;

    for (const k of keys) {
      if (current === null || current === undefined || typeof current !== "object") {
        return defaultValue as T;
      }
      current = (current as ConfigObject)[k];
    }

    if (current === undefined) {
      return defaultValue as T;
    }
    return current as T;
  }

  set(key: string, value: ConfigValue, layerName: string = "user"): void {
    const oldValue = this.get(key);
    const layer = this.layers.find((l) => l.name === layerName);
    if (!layer) {
      throw new Error(`Config layer "${layerName}" not found`);
    }

    this.validateValue(key, value);

    const keys = key.split(".");
    let current = layer.data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined) {
        current[keys[i]] = {} as ConfigObject;
      }
      current = current[keys[i]] as ConfigObject;
    }
    current[keys[keys.length - 1]] = value;

    this.invalidateCache();

    if (oldValue !== value) {
      this.notifyChange(key, value, oldValue);
    }
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }

  delete(key: string, layerName: string = "user"): boolean {
    const layer = this.layers.find((l) => l.name === layerName);
    if (!layer) return false;

    const keys = key.split(".");
    let current = layer.data;
    for (let i = 0; i < keys.length - 1; i++) {
      if (current[keys[i]] === undefined || typeof current[keys[i]] !== "object") {
        return false;
      }
      current = current[keys[i]] as ConfigObject;
    }

    const oldValue = current[keys[keys.length - 1]];
    if (oldValue === undefined) return false;

    delete current[keys[keys.length - 1]];
    this.invalidateCache();
    this.notifyChange(key, undefined, oldValue);
    return true;
  }

  onChange(key: string, listener: ConfigChangeListener): () => void {
    if (!this.changeListeners.has(key)) {
      this.changeListeners.set(key, new Set());
    }
    this.changeListeners.get(key)!.add(listener);
    return () => {
      this.changeListeners.get(key)?.delete(listener);
    };
  }

  addLayer(layer: ConfigLayer): void {
    this.layers.push(layer);
    this.layers.sort((a, b) => a.priority - b.priority);
    this.invalidateCache();
  }

  removeLayer(name: string): boolean {
    const index = this.layers.findIndex((l) => l.name === name);
    if (index === -1) return false;
    this.layers.splice(index, 1);
    this.invalidateCache();
    return true;
  }

  getLayerNames(): string[] {
    return this.layers.map((l) => l.name);
  }

  getAll(): ConfigObject {
    return { ...this.getMerged() };
  }

  async saveLayer(name: string): Promise<void> {
    const layer = this.layers.find((l) => l.name === name);
    if (!layer) {
      throw new Error(`Config layer "${name}" not found`);
    }

    const filePath = this.getLayerFilePath(name);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content = yaml.dump(layer.data);
    fs.writeFileSync(filePath, content, "utf-8");
    globalLogger.info(`Config layer "${name}" saved`, { path: filePath });
  }

  async reload(): Promise<void> {
    this.layers = [];
    await this.initialize();
    globalEventBus.emit(CONFIG_CHANGE_EVENT, { source: "reload" });
  }

  validateAll(): { valid: boolean; errors: Array<{ key: string; message: string }> } {
    const errors: Array<{ key: string; message: string }> = [];
    const merged = this.getMerged();

    for (const [key, schema] of Object.entries(this.schema)) {
      const value = merged[key];
      if (schema.required && value === undefined) {
        errors.push({ key, message: `Required config "${key}" is missing` });
        continue;
      }
      if (value !== undefined && schema.validator && !schema.validator(value)) {
        errors.push({ key, message: `Config "${key}" failed validation` });
      }
    }

    return { valid: errors.length === 0, errors };
  }

  private getMerged(): ConfigObject {
    if (this.mergedCache) return this.mergedCache;

    const result: ConfigObject = {};
    for (const layer of this.layers) {
      this.deepMerge(result, layer.data);
    }
    this.mergedCache = result;
    return result;
  }

  private deepMerge(target: ConfigObject, source: ConfigObject): ConfigObject {
    for (const key of Object.keys(source)) {
      if (
        source[key] !== null &&
        typeof source[key] === "object" &&
        !Array.isArray(source[key]) &&
        target[key] !== null &&
        typeof target[key] === "object" &&
        !Array.isArray(target[key])
      ) {
        this.deepMerge(target[key] as ConfigObject, source[key] as ConfigObject);
      } else {
        target[key] = source[key];
      }
    }
    return target;
  }

  private invalidateCache(): void {
    this.mergedCache = null;
  }

  private notifyChange(key: string, newValue: ConfigValue, oldValue: ConfigValue): void {
    const listeners = this.changeListeners.get(key);
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(key, newValue, oldValue);
        } catch (err) {
          globalLogger.error("Config change listener error", {
            key,
            error: String(err),
          });
        }
      }
    }
    globalEventBus.emit(CONFIG_CHANGE_EVENT, { key, newValue, oldValue });
  }

  private validateValue(key: string, value: ConfigValue): void {
    const schemaEntry = this.schema[key];
    if (!schemaEntry) return;

    const actualType = Array.isArray(value)
      ? "array"
      : value === null
        ? "object"
        : typeof value;
    if (actualType !== schemaEntry.type && value !== null) {
      throw new Error(
        `Config "${key}" expected type "${schemaEntry.type}" but got "${actualType}"`
      );
    }
    if (schemaEntry.validator && !schemaEntry.validator(value)) {
      throw new Error(`Config "${key}" failed custom validation`);
    }
  }

  private async loadDefaultLayer(): Promise<void> {
    const defaultPath = path.join(this.configDir, "default.yml");
    if (fs.existsSync(defaultPath)) {
      const content = fs.readFileSync(defaultPath, "utf-8");
      const data = yaml.load(content) as ConfigObject;
      this.addLayer({ name: "default", priority: 0, data: data ?? {} });
    } else {
      this.addLayer({ name: "default", priority: 0, data: {} });
    }
  }

  private async loadUserLayer(): Promise<void> {
    const userPath = path.join(this.configDir, "user.yml");
    if (fs.existsSync(userPath)) {
      const content = fs.readFileSync(userPath, "utf-8");
      const data = yaml.load(content) as ConfigObject;
      this.addLayer({ name: "user", priority: 10, data: data ?? {} });
    } else {
      this.addLayer({ name: "user", priority: 10, data: {} });
    }
  }

  private async loadProjectLayer(): Promise<void> {
    const projectPath = path.join(this.configDir, "project.yml");
    if (fs.existsSync(projectPath)) {
      const content = fs.readFileSync(projectPath, "utf-8");
      const data = yaml.load(content) as ConfigObject;
      this.addLayer({ name: "project", priority: 20, data: data ?? {} });
    } else {
      this.addLayer({ name: "project", priority: 20, data: {} });
    }
  }

  private getLayerFilePath(name: string): string {
    return path.join(this.configDir, `${name}.yml`);
  }
}

export { ConfigManager };
export type {
  ConfigValue,
  ConfigObject,
  ConfigChangeListener,
  ConfigSchema,
  ConfigLayer,
  ConfigManagerOptions,
};
