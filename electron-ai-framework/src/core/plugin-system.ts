import { globalEventBus } from "./event-bus";
import { globalLogger } from "./logger";
import { v4 as uuidv4 } from "uuid";

type PluginState = "installed" | "activated" | "deactivated" | "uninstalled";

interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  main: string;
  dependencies: string[];
  permissions: string[];
}

interface PluginInstance {
  manifest: PluginManifest;
  state: PluginState;
  context: PluginContext;
  module: PluginModule | null;
}

interface PluginContext {
  eventBus: typeof globalEventBus;
  logger: typeof globalLogger;
  storage: Map<string, unknown>;
  api: PluginAPI;
}

interface PluginAPI {
  emit(eventId: string, payload: unknown): void;
  on(eventId: string, handler: (payload: unknown) => void): () => void;
  requestPermission(permission: string): boolean;
  getPlugin(id: string): PluginManifest | null;
}

interface PluginModule {
  install?: (context: PluginContext) => void | Promise<void>;
  activate?: (context: PluginContext) => void | Promise<void>;
  deactivate?: (context: PluginContext) => void | Promise<void>;
  uninstall?: (context: PluginContext) => void | Promise<void>;
}

interface PluginSandbox {
  allowedApis: Set<string>;
  resourceLimits: {
    maxMemory: number;
    maxCpuTime: number;
  };
}

class PluginSystem {
  private plugins: Map<string, PluginInstance>;
  private sandboxes: Map<string, PluginSandbox>;
  private dependencyGraph: Map<string, Set<string>>;
  private communicationChannels: Map<string, Map<string, (message: unknown) => void>>;

  constructor() {
    this.plugins = new Map();
    this.sandboxes = new Map();
    this.dependencyGraph = new Map();
    this.communicationChannels = new Map();
  }

  async register(manifest: PluginManifest, module: PluginModule): Promise<void> {
    if (this.plugins.has(manifest.id)) {
      throw new Error(`Plugin "${manifest.id}" is already registered`);
    }

    this.validateManifest(manifest);
    this.resolveDependencies(manifest);

    const sandbox: PluginSandbox = {
      allowedApis: new Set(manifest.permissions),
      resourceLimits: {
        maxMemory: 128 * 1024 * 1024,
        maxCpuTime: 30000,
      },
    };

    const context = this.createPluginContext(manifest, sandbox);

    const instance: PluginInstance = {
      manifest,
      state: "installed",
      context,
      module,
    };

    this.plugins.set(manifest.id, instance);
    this.sandboxes.set(manifest.id, sandbox);
    this.updateDependencyGraph(manifest);

    if (module.install) {
      await module.install(context);
    }

    globalEventBus.emit("plugin:registered", { id: manifest.id, name: manifest.name });
    globalLogger.info(`Plugin registered: ${manifest.id}`, { version: manifest.version });
  }

  async activate(pluginId: string): Promise<void> {
    const instance = this.getPluginInstance(pluginId);
    if (instance.state === "activated") {
      globalLogger.warn(`Plugin "${pluginId}" is already activated`);
      return;
    }

    for (const depId of instance.manifest.dependencies) {
      const dep = this.plugins.get(depId);
      if (!dep || dep.state !== "activated") {
        throw new Error(
          `Plugin "${pluginId}" requires dependency "${depId}" to be activated`
        );
      }
    }

    if (instance.module?.activate) {
      await instance.module.activate(instance.context);
    }

    instance.state = "activated";
    globalEventBus.emit("plugin:activated", { id: pluginId });
    globalLogger.info(`Plugin activated: ${pluginId}`);
  }

  async deactivate(pluginId: string): Promise<void> {
    const instance = this.getPluginInstance(pluginId);
    if (instance.state !== "activated") {
      globalLogger.warn(`Plugin "${pluginId}" is not activated`);
      return;
    }

    const dependents = this.getDependents(pluginId);
    if (dependents.length > 0) {
      for (const depId of dependents) {
        await this.deactivate(depId);
      }
    }

    if (instance.module?.deactivate) {
      await instance.module.deactivate(instance.context);
    }

    instance.state = "deactivated";
    globalEventBus.emit("plugin:deactivated", { id: pluginId });
    globalLogger.info(`Plugin deactivated: ${pluginId}`);
  }

  async unregister(pluginId: string): Promise<void> {
    const instance = this.getPluginInstance(pluginId);

    if (instance.state === "activated") {
      await this.deactivate(pluginId);
    }

    if (instance.module?.uninstall) {
      await instance.module.uninstall(instance.context);
    }

    instance.state = "uninstalled";
    this.plugins.delete(pluginId);
    this.sandboxes.delete(pluginId);
    this.communicationChannels.delete(pluginId);
    this.removeFromDependencyGraph(pluginId);

    globalEventBus.emit("plugin:unregistered", { id: pluginId });
    globalLogger.info(`Plugin unregistered: ${pluginId}`);
  }

  getPlugin(pluginId: string): PluginManifest | null {
    return this.plugins.get(pluginId)?.manifest ?? null;
  }

  getPluginState(pluginId: string): PluginState | null {
    return this.plugins.get(pluginId)?.state ?? null;
  }

  listPlugins(): Array<{ manifest: PluginManifest; state: PluginState }> {
    return Array.from(this.plugins.values()).map((instance) => ({
      manifest: instance.manifest,
      state: instance.state,
    }));
  }

  sendMessage(fromId: string, toId: string, message: unknown): void {
    const fromInstance = this.getPluginInstance(fromId);
    const toInstance = this.getPluginInstance(toId);

    if (fromInstance.state !== "activated" || toInstance.state !== "activated") {
      throw new Error("Both plugins must be activated to communicate");
    }

    const channel = this.communicationChannels.get(toId);
    if (channel && channel.has(fromId)) {
      channel.get(fromId)!(message);
    }

    globalEventBus.emit("plugin:message", { from: fromId, to: toId });
  }

  registerMessageHandler(
    pluginId: string,
    fromId: string,
    handler: (message: unknown) => void
  ): () => void {
    if (!this.communicationChannels.has(pluginId)) {
      this.communicationChannels.set(pluginId, new Map());
    }
    this.communicationChannels.get(pluginId)!.set(fromId, handler);
    return () => {
      this.communicationChannels.get(pluginId)?.delete(fromId);
    };
  }

  private getPluginInstance(pluginId: string): PluginInstance {
    const instance = this.plugins.get(pluginId);
    if (!instance) {
      throw new Error(`Plugin "${pluginId}" not found`);
    }
    return instance;
  }

  private validateManifest(manifest: PluginManifest): void {
    if (!manifest.id || !manifest.name || !manifest.version) {
      throw new Error("Plugin manifest must include id, name, and version");
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(manifest.id)) {
      throw new Error(`Plugin id "${manifest.id}" contains invalid characters`);
    }
  }

  private resolveDependencies(manifest: PluginManifest): void {
    for (const depId of manifest.dependencies) {
      if (!this.plugins.has(depId)) {
        throw new Error(
          `Plugin "${manifest.id}" depends on "${depId}" which is not registered`
        );
      }
    }
  }

  private updateDependencyGraph(manifest: PluginManifest): void {
    if (!this.dependencyGraph.has(manifest.id)) {
      this.dependencyGraph.set(manifest.id, new Set());
    }
    for (const depId of manifest.dependencies) {
      this.dependencyGraph.get(manifest.id)!.add(depId);
    }
  }

  private removeFromDependencyGraph(pluginId: string): void {
    this.dependencyGraph.delete(pluginId);
    for (const deps of this.dependencyGraph.values()) {
      deps.delete(pluginId);
    }
  }

  private getDependents(pluginId: string): string[] {
    const dependents: string[] = [];
    for (const [id, deps] of this.dependencyGraph.entries()) {
      if (deps.has(pluginId)) {
        dependents.push(id);
      }
    }
    return dependents;
  }

  private createPluginContext(manifest: PluginManifest, sandbox: PluginSandbox): PluginContext {
    const pluginLogger = globalLogger.child(`plugin:${manifest.id}`);
    const storage = new Map<string, unknown>();

    const api: PluginAPI = {
      emit: (eventId: string, payload: unknown) => {
        if (!sandbox.allowedApis.has("event:emit")) {
          throw new Error(`Plugin "${manifest.id}" does not have permission to emit events`);
        }
        globalEventBus.emit(`plugin:${manifest.id}:${eventId}`, payload);
      },
      on: (eventId: string, handler: (payload: unknown) => void) => {
        if (!sandbox.allowedApis.has("event:listen")) {
          throw new Error(`Plugin "${manifest.id}" does not have permission to listen to events`);
        }
        return globalEventBus.on(eventId, handler);
      },
      requestPermission: (permission: string) => {
        return sandbox.allowedApis.has(permission);
      },
      getPlugin: (id: string) => {
        return this.getPlugin(id);
      },
    };

    return {
      eventBus: globalEventBus,
      logger: pluginLogger,
      storage,
      api,
    };
  }
}

export { PluginSystem };
export type {
  PluginManifest,
  PluginInstance,
  PluginContext,
  PluginAPI,
  PluginModule,
  PluginState,
  PluginSandbox,
};
