import fs from "fs";
import path from "path";
import { globalEventBus } from "../../core/event-bus";
import { globalLogger } from "../../core/logger";
import { v4 as uuidv4 } from "uuid";

type ModelStatus = "registered" | "loaded" | "loading" | "unloaded" | "error";

interface ModelMetadata {
  id: string;
  name: string;
  version: string;
  description: string;
  framework: string;
  inputShape: number[];
  outputShape: number[];
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface ModelVersion {
  version: string;
  path: string;
  checksum: string;
  size: number;
  uploadedAt: number;
  metadata: Record<string, unknown>;
}

interface ModelEntry {
  metadata: ModelMetadata;
  status: ModelStatus;
  currentVersion: string;
  versions: Map<string, ModelVersion>;
  config: Record<string, unknown>;
  loadedAt: number | null;
}

interface ModelRegistry {
  models: Map<string, ModelEntry>;
  modelDir: string;
}

interface ImportExportOptions {
  format: "json" | "binary";
  includeCheckpoints: boolean;
  includeConfig: boolean;
}

class ModelManager {
  private registry: ModelRegistry;

  constructor(modelDir: string = "./models") {
    this.registry = {
      models: new Map(),
      modelDir,
    };
  }

  register(metadata: Omit<ModelMetadata, "createdAt" | "updatedAt">): ModelMetadata {
    if (this.registry.models.has(metadata.id)) {
      throw new Error(`Model "${metadata.id}" is already registered`);
    }

    const now = Date.now();
    const fullMetadata: ModelMetadata = {
      ...metadata,
      createdAt: now,
      updatedAt: now,
    };

    const entry: ModelEntry = {
      metadata: fullMetadata,
      status: "registered",
      currentVersion: metadata.version,
      versions: new Map(),
      config: {},
      loadedAt: null,
    };

    this.registry.models.set(metadata.id, entry);

    globalEventBus.emit("model:registered", { id: metadata.id, name: metadata.name });
    globalLogger.info(`Model registered: ${metadata.id}`, { version: metadata.version });

    return fullMetadata;
  }

  unregister(modelId: string): void {
    const entry = this.getEntry(modelId);
    if (entry.status === "loaded") {
      throw new Error(`Cannot unregister loaded model "${modelId}". Unload it first.`);
    }
    this.registry.models.delete(modelId);
    globalEventBus.emit("model:unregistered", { id: modelId });
    globalLogger.info(`Model unregistered: ${modelId}`);
  }

  addVersion(
    modelId: string,
    version: string,
    modelPath: string,
    metadata: Record<string, unknown> = {}
  ): ModelVersion {
    const entry = this.getEntry(modelId);

    if (entry.versions.has(version)) {
      throw new Error(`Version "${version}" already exists for model "${modelId}"`);
    }

    if (!fs.existsSync(modelPath)) {
      throw new Error(`Model file not found: ${modelPath}`);
    }

    const stats = fs.statSync(modelPath);
    const checksum = this.computeChecksum(modelPath);

    const modelVersion: ModelVersion = {
      version,
      path: modelPath,
      checksum,
      size: stats.size,
      uploadedAt: Date.now(),
      metadata,
    };

    entry.versions.set(version, modelVersion);
    entry.metadata.updatedAt = Date.now();
    entry.currentVersion = version;

    globalEventBus.emit("model:version-added", { id: modelId, version });
    globalLogger.info(`Model version added: ${modelId}@${version}`);

    return modelVersion;
  }

  removeVersion(modelId: string, version: string): void {
    const entry = this.getEntry(modelId);
    if (!entry.versions.has(version)) {
      throw new Error(`Version "${version}" not found for model "${modelId}"`);
    }
    if (entry.currentVersion === version) {
      throw new Error(`Cannot remove current version "${version}" of model "${modelId}"`);
    }
    entry.versions.delete(version);
    entry.metadata.updatedAt = Date.now();

    globalEventBus.emit("model:version-removed", { id: modelId, version });
    globalLogger.info(`Model version removed: ${modelId}@${version}`);
  }

  listVersions(modelId: string): ModelVersion[] {
    const entry = this.getEntry(modelId);
    return Array.from(entry.versions.values());
  }

  getVersion(modelId: string, version: string): ModelVersion | null {
    const entry = this.getEntry(modelId);
    return entry.versions.get(version) ?? null;
  }

  setCurrentVersion(modelId: string, version: string): void {
    const entry = this.getEntry(modelId);
    if (!entry.versions.has(version)) {
      throw new Error(`Version "${version}" not found for model "${modelId}"`);
    }
    entry.currentVersion = version;
    entry.metadata.updatedAt = Date.now();
    globalLogger.info(`Model current version set: ${modelId}@${version}`);
  }

  getStatus(modelId: string): ModelStatus {
    return this.getEntry(modelId).status;
  }

  setStatus(modelId: string, status: ModelStatus): void {
    const entry = this.getEntry(modelId);
    entry.status = status;
    if (status === "loaded") {
      entry.loadedAt = Date.now();
    } else if (status === "unloaded") {
      entry.loadedAt = null;
    }
  }

  getMetadata(modelId: string): ModelMetadata {
    return this.getEntry(modelId).metadata;
  }

  updateMetadata(modelId: string, updates: Partial<Omit<ModelMetadata, "id" | "createdAt">>): ModelMetadata {
    const entry = this.getEntry(modelId);
    entry.metadata = {
      ...entry.metadata,
      ...updates,
      updatedAt: Date.now(),
    };
    return entry.metadata;
  }

  setConfig(modelId: string, config: Record<string, unknown>): void {
    const entry = this.getEntry(modelId);
    entry.config = { ...entry.config, ...config };
  }

  getConfig(modelId: string): Record<string, unknown> {
    return this.getEntry(modelId).config;
  }

  listModels(): Array<{ metadata: ModelMetadata; status: ModelStatus; currentVersion: string }> {
    return Array.from(this.registry.models.values()).map((entry) => ({
      metadata: entry.metadata,
      status: entry.status,
      currentVersion: entry.currentVersion,
    }));
  }

  async exportModel(
    modelId: string,
    outputPath: string,
    options: ImportExportOptions = {
      format: "json",
      includeCheckpoints: false,
      includeConfig: true,
    }
  ): Promise<string> {
    const entry = this.getEntry(modelId);
    const exportData: Record<string, unknown> = {
      metadata: entry.metadata,
      currentVersion: entry.currentVersion,
    };

    if (options.includeConfig) {
      exportData.config = entry.config;
    }

    if (options.includeCheckpoints) {
      exportData.versions = Object.fromEntries(entry.versions);
    }

    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const content =
      options.format === "json"
        ? JSON.stringify(exportData, null, 2)
        : JSON.stringify(exportData);

    fs.writeFileSync(outputPath, content, "utf-8");
    globalLogger.info(`Model exported: ${modelId} to ${outputPath}`);

    return outputPath;
  }

  async importModel(
    inputPath: string,
    options: ImportExportOptions = {
      format: "json",
      includeCheckpoints: false,
      includeConfig: true,
    }
  ): Promise<ModelMetadata> {
    if (!fs.existsSync(inputPath)) {
      throw new Error(`Import file not found: ${inputPath}`);
    }

    const content = fs.readFileSync(inputPath, "utf-8");
    const data = JSON.parse(content) as Record<string, unknown>;
    const metadata = data.metadata as ModelMetadata;

    const existing = this.registry.models.get(metadata.id);
    if (existing) {
      throw new Error(`Model "${metadata.id}" already exists. Use a different ID or update existing.`);
    }

    const entry: ModelEntry = {
      metadata,
      status: "registered",
      currentVersion: (data.currentVersion as string) ?? metadata.version,
      versions: new Map(),
      config: options.includeConfig ? ((data.config as Record<string, unknown>) ?? {}) : {},
      loadedAt: null,
    };

    if (options.includeCheckpoints && data.versions) {
      const versions = data.versions as Record<string, ModelVersion>;
      for (const [ver, verData] of Object.entries(versions)) {
        entry.versions.set(ver, verData);
      }
    }

    this.registry.models.set(metadata.id, entry);

    globalEventBus.emit("model:imported", { id: metadata.id });
    globalLogger.info(`Model imported: ${metadata.id}`);

    return metadata;
  }

  private getEntry(modelId: string): ModelEntry {
    const entry = this.registry.models.get(modelId);
    if (!entry) {
      throw new Error(`Model "${modelId}" not found in registry`);
    }
    return entry;
  }

  private computeChecksum(filePath: string): string {
    const buffer = fs.readFileSync(filePath);
    let hash = 0;
    for (let i = 0; i < buffer.length; i++) {
      hash = ((hash << 5) - hash + buffer[i]) | 0;
    }
    return Math.abs(hash).toString(16).padStart(8, "0");
  }
}

export { ModelManager };
export type {
  ModelMetadata,
  ModelVersion,
  ModelEntry,
  ModelStatus,
  ModelRegistry,
  ImportExportOptions,
};
