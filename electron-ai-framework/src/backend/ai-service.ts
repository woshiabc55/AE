import { globalEventBus } from "../core/event-bus";
import { globalLogger } from "../core/logger";
import { Trainer, TrainingJob } from "./training/trainer";
import { ModelManager, ModelMetadata, ModelVersion } from "./training/model-manager";
import { DatasetLoader, DatasetMetadata, DataLoaderOptions } from "./training/dataset-loader";

type ModelLoadStatus = "loaded" | "unloaded" | "loading" | "error";

interface InferenceResult {
  modelId: string;
  output: unknown;
  latency: number;
  timestamp: number;
}

interface ModelInfo {
  id: string;
  name: string;
  version: string;
  status: ModelLoadStatus;
  framework: string;
  inputShape: number[];
  outputShape: number[];
}

class AIService {
  private trainer: Trainer;
  private modelManager: ModelManager;
  private datasetLoader: DatasetLoader;
  private loadedModels: Map<string, { loadTime: number; inferenceCount: number }>;

  constructor() {
    this.trainer = new Trainer();
    this.modelManager = new ModelManager();
    this.datasetLoader = new DatasetLoader();
    this.loadedModels = new Map();
  }

  async loadModel(modelId: string): Promise<void> {
    const metadata = this.modelManager.getMetadata(modelId);
    const status = this.modelManager.getStatus(modelId);

    if (status === "loaded") {
      globalLogger.warn(`Model "${modelId}" is already loaded`);
      return;
    }

    this.modelManager.setStatus(modelId, "loading");
    globalEventBus.emit("model:loading", { id: modelId });

    try {
      this.modelManager.setStatus(modelId, "loaded");
      this.loadedModels.set(modelId, {
        loadTime: Date.now(),
        inferenceCount: 0,
      });

      globalEventBus.emit("model:loaded", { id: modelId });
      globalLogger.info(`Model loaded: ${modelId}`, { name: metadata.name });
    } catch (err) {
      this.modelManager.setStatus(modelId, "error");
      globalEventBus.emit("model:error", { id: modelId, error: (err as Error).message });
      globalLogger.error(`Failed to load model: ${modelId}`, { error: (err as Error).message });
      throw err;
    }
  }

  async unloadModel(modelId: string): Promise<void> {
    const status = this.modelManager.getStatus(modelId);
    if (status !== "loaded") {
      globalLogger.warn(`Model "${modelId}" is not loaded`);
      return;
    }

    this.modelManager.setStatus(modelId, "unloaded");
    this.loadedModels.delete(modelId);

    globalEventBus.emit("model:unloaded", { id: modelId });
    globalLogger.info(`Model unloaded: ${modelId}`);
  }

  async inference(
    modelId: string,
    input: unknown,
    options: Record<string, unknown> = {}
  ): Promise<InferenceResult> {
    const loadInfo = this.loadedModels.get(modelId);
    if (!loadInfo) {
      throw new Error(`Model "${modelId}" is not loaded. Load it first.`);
    }

    const startTime = Date.now();

    const output = this.simulateInference(modelId, input, options);

    const latency = Date.now() - startTime;
    loadInfo.inferenceCount++;

    const result: InferenceResult = {
      modelId,
      output,
      latency,
      timestamp: Date.now(),
    };

    globalEventBus.emit("model:inference", { id: modelId, latency });
    return result;
  }

  async startTraining(
    modelId: string,
    datasetId: string,
    hyperparameters: Record<string, unknown> = {}
  ): Promise<string> {
    this.modelManager.getMetadata(modelId);
    this.datasetLoader.getMetadata(datasetId);

    const job = this.trainer.createJob(modelId, datasetId, hyperparameters, {
      onEpochEnd: (epoch: number, metrics: { loss: number; accuracy: number }) => {
        globalEventBus.emit("training:epoch-update", {
          id: job.id,
          epoch,
          metrics,
        });
      },
      onTrainingEnd: (status: string) => {
        globalEventBus.emit("training:ended", { id: job.id, status });
      },
    });

    this.trainer.start(job.id).catch((err: Error) => {
      globalLogger.error(`Training error for job ${job.id}`, { error: err.message });
    });

    globalLogger.info(`Training started: ${job.id}`, { modelId, datasetId });
    return job.id;
  }

  async stopTraining(trainingId: string): Promise<void> {
    await this.trainer.stop(trainingId);
    globalLogger.info(`Training stopped: ${trainingId}`);
  }

  getTrainingStatus(trainingId: string): TrainingJob {
    return this.trainer.getStatus(trainingId);
  }

  listModels(): ModelInfo[] {
    return this.modelManager.listModels().map((entry) => ({
      id: entry.metadata.id,
      name: entry.metadata.name,
      version: entry.currentVersion,
      status: entry.status as ModelLoadStatus,
      framework: entry.metadata.framework,
      inputShape: entry.metadata.inputShape,
      outputShape: entry.metadata.outputShape,
    }));
  }

  getModelInfo(modelId: string): ModelInfo {
    const metadata = this.modelManager.getMetadata(modelId);
    const status = this.modelManager.getStatus(modelId);
    return {
      id: metadata.id,
      name: metadata.name,
      version: metadata.version,
      status: status as ModelLoadStatus,
      framework: metadata.framework,
      inputShape: metadata.inputShape,
      outputShape: metadata.outputShape,
    };
  }

  registerModel(
    metadata: Omit<ModelMetadata, "createdAt" | "updatedAt">
  ): ModelMetadata {
    return this.modelManager.register(metadata);
  }

  addModelVersion(
    modelId: string,
    version: string,
    modelPath: string,
    metadata: Record<string, unknown> = {}
  ): ModelVersion {
    return this.modelManager.addVersion(modelId, version, modelPath, metadata);
  }

  registerDataset(
    filePath: string,
    format: "json" | "csv" | "parquet" | "image" | "text",
    name?: string
  ): DatasetMetadata {
    return this.datasetLoader.registerDataset(filePath, format, name);
  }

  listDatasets(): DatasetMetadata[] {
    return this.datasetLoader.listDatasets();
  }

  getDatasetBatches(
    datasetId: string,
    options: Partial<DataLoaderOptions> = {}
  ) {
    return this.datasetLoader.getBatches(datasetId, options);
  }

  getTrainer(): Trainer {
    return this.trainer;
  }

  getModelManager(): ModelManager {
    return this.modelManager;
  }

  getDatasetLoader(): DatasetLoader {
    return this.datasetLoader;
  }

  private simulateInference(
    modelId: string,
    input: unknown,
    _options: Record<string, unknown>
  ): unknown {
    globalLogger.debug(`Inference on model: ${modelId}`, { inputType: typeof input });
    return {
      prediction: "simulated",
      confidence: Math.random(),
      modelId,
    };
  }
}

export { AIService };
export type { InferenceResult, ModelInfo, ModelLoadStatus };
