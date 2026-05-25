import { globalEventBus } from "./event-bus";
import { globalLogger } from "./logger";

type ModuleState = "unloaded" | "loading" | "loaded" | "error" | "unloading";

interface ModuleDefinition {
  id: string;
  name: string;
  version: string;
  dependencies: string[];
  factory: () => Promise<ModuleExports>;
  lazy: boolean;
}

interface ModuleExports {
  [key: string]: unknown;
  initialize?: () => void | Promise<void>;
  destroy?: () => void | Promise<void>;
}

interface ModuleInstance {
  definition: ModuleDefinition;
  state: ModuleState;
  exports: ModuleExports | null;
  error: Error | null;
  loadTime: number | null;
}

interface ModuleDependencyGraph {
  adjacency: Map<string, Set<string>>;
  reverse: Map<string, Set<string>>;
}

class ModuleLoader {
  private modules: Map<string, ModuleInstance>;
  private graph: ModuleDependencyGraph;
  private loadingPromises: Map<string, Promise<ModuleExports>>;

  constructor() {
    this.modules = new Map();
    this.graph = {
      adjacency: new Map(),
      reverse: new Map(),
    };
    this.loadingPromises = new Map();
  }

  register(definition: ModuleDefinition): void {
    if (this.modules.has(definition.id)) {
      throw new Error(`Module "${definition.id}" is already registered`);
    }

    const instance: ModuleInstance = {
      definition,
      state: "unloaded",
      exports: null,
      error: null,
      loadTime: null,
    };

    this.modules.set(definition.id, instance);
    this.updateGraph(definition);

    globalLogger.info(`Module registered: ${definition.id}`, {
      version: definition.version,
      lazy: definition.lazy,
    });

    globalEventBus.emit("module:registered", { id: definition.id });
  }

  async load(moduleId: string): Promise<ModuleExports> {
    const existingPromise = this.loadingPromises.get(moduleId);
    if (existingPromise) {
      return existingPromise;
    }

    const promise = this.doLoad(moduleId);
    this.loadingPromises.set(moduleId, promise);

    try {
      const result = await promise;
      return result;
    } finally {
      this.loadingPromises.delete(moduleId);
    }
  }

  async unload(moduleId: string): Promise<void> {
    const instance = this.getModuleInstance(moduleId);

    if (instance.state !== "loaded") {
      globalLogger.warn(`Module "${moduleId}" is not loaded`);
      return;
    }

    const dependents = this.getDependents(moduleId);
    if (dependents.length > 0) {
      for (const depId of dependents) {
        await this.unload(depId);
      }
    }

    instance.state = "unloading";
    globalEventBus.emit("module:unloading", { id: moduleId });

    if (instance.exports?.destroy) {
      try {
        await instance.exports.destroy();
      } catch (err) {
        globalLogger.error(`Module "${moduleId}" destroy error`, {
          error: String(err),
        });
      }
    }

    instance.state = "unloaded";
    instance.exports = null;
    instance.loadTime = null;

    globalEventBus.emit("module:unloaded", { id: moduleId });
    globalLogger.info(`Module unloaded: ${moduleId}`);
  }

  async loadAll(): Promise<void> {
    const sorted = this.topologicalSort();
    for (const moduleId of sorted) {
      const instance = this.modules.get(moduleId)!;
      if (!instance.definition.lazy) {
        await this.load(moduleId);
      }
    }
  }

  async unloadAll(): Promise<void> {
    const sorted = this.topologicalSort().reverse();
    for (const moduleId of sorted) {
      const instance = this.modules.get(moduleId)!;
      if (instance.state === "loaded") {
        await this.unload(moduleId);
      }
    }
  }

  getModule(moduleId: string): ModuleExports | null {
    return this.modules.get(moduleId)?.exports ?? null;
  }

  getModuleState(moduleId: string): ModuleState | null {
    return this.modules.get(moduleId)?.state ?? null;
  }

  isLoaded(moduleId: string): boolean {
    return this.modules.get(moduleId)?.state === "loaded";
  }

  listModules(): Array<{ id: string; name: string; version: string; state: ModuleState }> {
    return Array.from(this.modules.values()).map((instance) => ({
      id: instance.definition.id,
      name: instance.definition.name,
      version: instance.definition.version,
      state: instance.state,
    }));
  }

  getDependencyGraph(): Record<string, string[]> {
    const result: Record<string, string[]> = {};
    for (const [id, deps] of this.graph.adjacency.entries()) {
      result[id] = Array.from(deps);
    }
    return result;
  }

  private async doLoad(moduleId: string): Promise<ModuleExports> {
    const instance = this.getModuleInstance(moduleId);

    if (instance.state === "loaded") {
      return instance.exports!;
    }

    if (instance.state === "loading") {
      throw new Error(`Circular dependency detected involving module "${moduleId}"`);
    }

    instance.state = "loading";
    globalEventBus.emit("module:loading", { id: moduleId });

    for (const depId of instance.definition.dependencies) {
      if (!this.isLoaded(depId)) {
        await this.load(depId);
      }
    }

    const startTime = Date.now();
    try {
      instance.exports = await instance.definition.factory();

      if (instance.exports.initialize) {
        await instance.exports.initialize();
      }

      instance.state = "loaded";
      instance.loadTime = Date.now() - startTime;
      instance.error = null;

      globalEventBus.emit("module:loaded", { id: moduleId, loadTime: instance.loadTime });
      globalLogger.info(`Module loaded: ${moduleId}`, { loadTime: instance.loadTime });

      return instance.exports;
    } catch (err) {
      instance.state = "error";
      instance.error = err instanceof Error ? err : new Error(String(err));

      globalEventBus.emit("module:error", { id: moduleId, error: instance.error.message });
      globalLogger.error(`Module load failed: ${moduleId}`, {
        error: instance.error.message,
      });

      throw instance.error;
    }
  }

  private getModuleInstance(moduleId: string): ModuleInstance {
    const instance = this.modules.get(moduleId);
    if (!instance) {
      throw new Error(`Module "${moduleId}" not found`);
    }
    return instance;
  }

  private updateGraph(definition: ModuleDefinition): void {
    if (!this.graph.adjacency.has(definition.id)) {
      this.graph.adjacency.set(definition.id, new Set());
    }
    if (!this.graph.reverse.has(definition.id)) {
      this.graph.reverse.set(definition.id, new Set());
    }

    for (const depId of definition.dependencies) {
      this.graph.adjacency.get(definition.id)!.add(depId);
      if (!this.graph.reverse.has(depId)) {
        this.graph.reverse.set(depId, new Set());
      }
      this.graph.reverse.get(depId)!.add(definition.id);
    }
  }

  private getDependents(moduleId: string): string[] {
    const reverse = this.graph.reverse.get(moduleId);
    return reverse ? Array.from(reverse) : [];
  }

  private topologicalSort(): string[] {
    const visited = new Set<string>();
    const result: string[] = [];
    const visiting = new Set<string>();

    const visit = (id: string): void => {
      if (visited.has(id)) return;
      if (visiting.has(id)) {
        throw new Error(`Circular dependency detected involving module "${id}"`);
      }
      visiting.add(id);

      const deps = this.graph.adjacency.get(id);
      if (deps) {
        for (const depId of deps) {
          visit(depId);
        }
      }

      visiting.delete(id);
      visited.add(id);
      result.push(id);
    };

    for (const id of this.modules.keys()) {
      visit(id);
    }

    return result;
  }
}

export { ModuleLoader };
export type {
  ModuleDefinition,
  ModuleExports,
  ModuleInstance,
  ModuleState,
  ModuleDependencyGraph,
};
