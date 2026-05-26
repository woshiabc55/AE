import { ipcMain, IpcMainInvokeEvent } from "electron";
import { BackendService } from "../backend/index";
import { ConfigManager } from "../core/config-manager";
import { PluginSystem } from "../core/plugin-system";
import { ModuleLoader } from "../core/module-loader";
import { globalLogger } from "../core/logger";

interface AIInferenceRequest {
  modelId: string;
  input: unknown;
  options: Record<string, unknown>;
}

interface AITrainingRequest {
  modelId: string;
  datasetId: string;
  hyperparameters: Record<string, unknown>;
}

interface PluginRegisterRequest {
  manifest: {
    id: string;
    name: string;
    version: string;
    description: string;
    main: string;
    dependencies: string[];
    permissions: string[];
  };
  modulePath: string;
}

type ConfigGetRequest = { key: string; defaultValue?: unknown };
type ConfigSetRequest = { key: string; value: unknown; layer?: string };

class IPCHandlers {
  private backendService: BackendService | null;
  private configManager: ConfigManager | null;
  private pluginSystem: PluginSystem | null;
  private moduleLoader: ModuleLoader | null;

  constructor() {
    this.backendService = null;
    this.configManager = null;
    this.pluginSystem = null;
    this.moduleLoader = null;
  }

  register(
    backendService: BackendService,
    configManager: ConfigManager,
    pluginSystem: PluginSystem,
    moduleLoader: ModuleLoader
  ): void {
    this.backendService = backendService;
    this.configManager = configManager;
    this.pluginSystem = pluginSystem;
    this.moduleLoader = moduleLoader;

    this.registerAIChannels();
    this.registerPluginChannels();
    this.registerConfigChannels();
    this.registerModuleChannels();

    globalLogger.info("IPC handlers registered");
  }

  private registerAIChannels(): void {
    ipcMain.handle("ai:load-model", async (_event: IpcMainInvokeEvent, modelId: string) => {
      this.ensureBackend();
      return this.backendService!.getAIService().loadModel(modelId);
    });

    ipcMain.handle("ai:unload-model", async (_event: IpcMainInvokeEvent, modelId: string) => {
      this.ensureBackend();
      return this.backendService!.getAIService().unloadModel(modelId);
    });

    ipcMain.handle(
      "ai:inference",
      async (_event: IpcMainInvokeEvent, request: AIInferenceRequest) => {
        this.ensureBackend();
        return this.backendService!.getAIService().inference(
          request.modelId,
          request.input,
          request.options
        );
      }
    );

    ipcMain.handle(
      "ai:start-training",
      async (_event: IpcMainInvokeEvent, request: AITrainingRequest) => {
        this.ensureBackend();
        return this.backendService!.getAIService().startTraining(
          request.modelId,
          request.datasetId,
          request.hyperparameters
        );
      }
    );

    ipcMain.handle(
      "ai:stop-training",
      async (_event: IpcMainInvokeEvent, trainingId: string) => {
        this.ensureBackend();
        return this.backendService!.getAIService().stopTraining(trainingId);
      }
    );

    ipcMain.handle(
      "ai:get-training-status",
      async (_event: IpcMainInvokeEvent, trainingId: string) => {
        this.ensureBackend();
        return this.backendService!.getAIService().getTrainingStatus(trainingId);
      }
    );

    ipcMain.handle("ai:list-models", async () => {
      this.ensureBackend();
      return this.backendService!.getAIService().listModels();
    });

    ipcMain.handle("ai:get-model-info", async (_event: IpcMainInvokeEvent, modelId: string) => {
      this.ensureBackend();
      return this.backendService!.getAIService().getModelInfo(modelId);
    });
  }

  private registerPluginChannels(): void {
    ipcMain.handle(
      "plugin:register",
      async (_event: IpcMainInvokeEvent, request: PluginRegisterRequest) => {
        this.ensurePluginSystem();
        const module = await this.loadPluginModule(request.modulePath);
        return this.pluginSystem!.register(request.manifest, module);
      }
    );

    ipcMain.handle(
      "plugin:activate",
      async (_event: IpcMainInvokeEvent, pluginId: string) => {
        this.ensurePluginSystem();
        return this.pluginSystem!.activate(pluginId);
      }
    );

    ipcMain.handle(
      "plugin:deactivate",
      async (_event: IpcMainInvokeEvent, pluginId: string) => {
        this.ensurePluginSystem();
        return this.pluginSystem!.deactivate(pluginId);
      }
    );

    ipcMain.handle(
      "plugin:unregister",
      async (_event: IpcMainInvokeEvent, pluginId: string) => {
        this.ensurePluginSystem();
        return this.pluginSystem!.unregister(pluginId);
      }
    );

    ipcMain.handle("plugin:list", async () => {
      this.ensurePluginSystem();
      return this.pluginSystem!.listPlugins();
    });

    ipcMain.handle("plugin:get", async (_event: IpcMainInvokeEvent, pluginId: string) => {
      this.ensurePluginSystem();
      return this.pluginSystem!.getPlugin(pluginId);
    });
  }

  private registerConfigChannels(): void {
    ipcMain.handle(
      "config:get",
      async (_event: IpcMainInvokeEvent, request: ConfigGetRequest) => {
        this.ensureConfigManager();
        return this.configManager!.get(request.key, request.defaultValue);
      }
    );

    ipcMain.handle(
      "config:set",
      async (_event: IpcMainInvokeEvent, request: ConfigSetRequest) => {
        this.ensureConfigManager();
        this.configManager!.set(request.key, request.value, request.layer);
        return { success: true };
      }
    );

    ipcMain.handle("config:get-all", async () => {
      this.ensureConfigManager();
      return this.configManager!.getAll();
    });

    ipcMain.handle("config:validate", async () => {
      this.ensureConfigManager();
      return this.configManager!.validateAll();
    });

    ipcMain.handle("config:save", async (_event: IpcMainInvokeEvent, layerName: string) => {
      this.ensureConfigManager();
      return this.configManager!.saveLayer(layerName);
    });

    ipcMain.handle("config:reload", async () => {
      this.ensureConfigManager();
      return this.configManager!.reload();
    });
  }

  private registerModuleChannels(): void {
    ipcMain.handle("module:list", async () => {
      this.ensureModuleLoader();
      return this.moduleLoader!.listModules();
    });

    ipcMain.handle("module:load", async (_event: IpcMainInvokeEvent, moduleId: string) => {
      this.ensureModuleLoader();
      return this.moduleLoader!.load(moduleId);
    });

    ipcMain.handle("module:unload", async (_event: IpcMainInvokeEvent, moduleId: string) => {
      this.ensureModuleLoader();
      return this.moduleLoader!.unload(moduleId);
    });

    ipcMain.handle("module:state", async (_event: IpcMainInvokeEvent, moduleId: string) => {
      this.ensureModuleLoader();
      return this.moduleLoader!.getModuleState(moduleId);
    });
  }

  private ensureBackend(): void {
    if (!this.backendService) {
      throw new Error("Backend service not initialized");
    }
  }

  private ensurePluginSystem(): void {
    if (!this.pluginSystem) {
      throw new Error("Plugin system not initialized");
    }
  }

  private ensureConfigManager(): void {
    if (!this.configManager) {
      throw new Error("Config manager not initialized");
    }
  }

  private ensureModuleLoader(): void {
    if (!this.moduleLoader) {
      throw new Error("Module loader not initialized");
    }
  }

  private async loadPluginModule(
    modulePath: string
  ): Promise<import("../core/plugin-system").PluginModule> {
    const module = await import(modulePath);
    return module.default ?? module;
  }
}

export { IPCHandlers };
