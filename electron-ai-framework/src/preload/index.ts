import { contextBridge, ipcRenderer } from "electron";

interface AIAPI {
  loadModel: (modelId: string) => Promise<void>;
  unloadModel: (modelId: string) => Promise<void>;
  inference: (
    modelId: string,
    input: unknown,
    options?: Record<string, unknown>
  ) => Promise<unknown>;
  startTraining: (
    modelId: string,
    datasetId: string,
    hyperparameters: Record<string, unknown>
  ) => Promise<string>;
  stopTraining: (trainingId: string) => Promise<void>;
  getTrainingStatus: (trainingId: string) => Promise<unknown>;
  listModels: () => Promise<unknown[]>;
  getModelInfo: (modelId: string) => Promise<unknown>;
}

interface PluginAPI {
  register: (manifest: unknown, modulePath: string) => Promise<void>;
  activate: (pluginId: string) => Promise<void>;
  deactivate: (pluginId: string) => Promise<void>;
  unregister: (pluginId: string) => Promise<void>;
  list: () => Promise<unknown[]>;
  get: (pluginId: string) => Promise<unknown | null>;
}

interface ConfigAPI {
  get: (key: string, defaultValue?: unknown) => Promise<unknown>;
  set: (key: string, value: unknown, layer?: string) => Promise<{ success: boolean }>;
  getAll: () => Promise<Record<string, unknown>>;
  validate: () => Promise<{ valid: boolean; errors: Array<{ key: string; message: string }> }>;
  save: (layerName: string) => Promise<void>;
  reload: () => Promise<void>;
}

interface ModuleAPI {
  list: () => Promise<unknown[]>;
  load: (moduleId: string) => Promise<unknown>;
  unload: (moduleId: string) => Promise<void>;
  state: (moduleId: string) => Promise<string | null>;
}

interface SystemAPI {
  onEvent: (channel: string, callback: (...args: unknown[]) => void) => () => void;
  getPlatform: () => string;
  getVersion: () => string;
}

const aiAPI: AIAPI = {
  loadModel: (modelId: string) => ipcRenderer.invoke("ai:load-model", modelId),
  unloadModel: (modelId: string) => ipcRenderer.invoke("ai:unload-model", modelId),
  inference: (modelId, input, options = {}) =>
    ipcRenderer.invoke("ai:inference", { modelId, input, options }),
  startTraining: (modelId, datasetId, hyperparameters) =>
    ipcRenderer.invoke("ai:start-training", { modelId, datasetId, hyperparameters }),
  stopTraining: (trainingId) => ipcRenderer.invoke("ai:stop-training", trainingId),
  getTrainingStatus: (trainingId) =>
    ipcRenderer.invoke("ai:get-training-status", trainingId),
  listModels: () => ipcRenderer.invoke("ai:list-models"),
  getModelInfo: (modelId) => ipcRenderer.invoke("ai:get-model-info", modelId),
};

const pluginAPI: PluginAPI = {
  register: (manifest, modulePath) =>
    ipcRenderer.invoke("plugin:register", { manifest, modulePath }),
  activate: (pluginId) => ipcRenderer.invoke("plugin:activate", pluginId),
  deactivate: (pluginId) => ipcRenderer.invoke("plugin:deactivate", pluginId),
  unregister: (pluginId) => ipcRenderer.invoke("plugin:unregister", pluginId),
  list: () => ipcRenderer.invoke("plugin:list"),
  get: (pluginId) => ipcRenderer.invoke("plugin:get", pluginId),
};

const configAPI: ConfigAPI = {
  get: (key, defaultValue) =>
    ipcRenderer.invoke("config:get", { key, defaultValue }),
  set: (key, value, layer) =>
    ipcRenderer.invoke("config:set", { key, value, layer }),
  getAll: () => ipcRenderer.invoke("config:get-all"),
  validate: () => ipcRenderer.invoke("config:validate"),
  save: (layerName) => ipcRenderer.invoke("config:save", layerName),
  reload: () => ipcRenderer.invoke("config:reload"),
};

const moduleAPI: ModuleAPI = {
  list: () => ipcRenderer.invoke("module:list"),
  load: (moduleId) => ipcRenderer.invoke("module:load", moduleId),
  unload: (moduleId) => ipcRenderer.invoke("module:unload", moduleId),
  state: (moduleId) => ipcRenderer.invoke("module:state", moduleId),
};

const systemAPI: SystemAPI = {
  onEvent: (channel, callback) => {
    const subscription = (_event: Electron.IpcRendererEvent, ...args: unknown[]) => {
      callback(...args);
    };
    ipcRenderer.on(channel, subscription);
    return () => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
  getPlatform: () => process.platform,
  getVersion: () => process.versions.electron ?? "0.0.0",
};

contextBridge.exposeInMainWorld("electronAPI", {
  ai: aiAPI,
  plugin: pluginAPI,
  config: configAPI,
  module: moduleAPI,
  system: systemAPI,
});

export type { AIAPI, PluginAPI, ConfigAPI, ModuleAPI, SystemAPI };
