import fs from "fs";
import path from "path";
import { globalLogger } from "../../core/logger";

type DataFormat = "json" | "csv" | "parquet" | "image" | "text";

interface DatasetMetadata {
  id: string;
  name: string;
  format: DataFormat;
  size: number;
  sampleCount: number;
  featureCount: number;
  labels: string[];
  createdAt: number;
  updatedAt: number;
}

interface PreprocessingStep {
  name: string;
  enabled: boolean;
  params: Record<string, unknown>;
}

interface AugmentationConfig {
  enabled: boolean;
  methods: AugmentationMethod[];
  probability: number;
}

interface AugmentationMethod {
  name: string;
  params: Record<string, unknown>;
}

interface DataSample {
  id: string;
  features: number[];
  label: string;
  metadata: Record<string, unknown>;
}

interface DataBatch {
  samples: DataSample[];
  batchSize: number;
  epoch: number;
  isLast: boolean;
}

interface DataLoaderOptions {
  batchSize: number;
  shuffle: boolean;
  validationSplit: number;
  preprocessing: PreprocessingStep[];
  augmentation: AugmentationConfig;
  numWorkers: number;
}

class DatasetLoader {
  private datasets: Map<string, DatasetMetadata>;
  private dataDir: string;
  private loadedData: Map<string, DataSample[]>;
  private defaultOptions: DataLoaderOptions;

  constructor(dataDir: string = "./datasets") {
    this.datasets = new Map();
    this.dataDir = dataDir;
    this.loadedData = new Map();
    this.defaultOptions = {
      batchSize: 32,
      shuffle: true,
      validationSplit: 0.2,
      preprocessing: [],
      augmentation: { enabled: false, methods: [], probability: 0.5 },
      numWorkers: 1,
    };
  }

  registerDataset(
    filePath: string,
    format: DataFormat,
    name?: string
  ): DatasetMetadata {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Dataset file not found: ${filePath}`);
    }

    const stats = fs.statSync(filePath);
    const id = `dataset-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const datasetName = name ?? path.basename(filePath, path.extname(filePath));

    const rawData = this.readDataFile(filePath, format);
    const sampleCount = rawData.length;
    const featureCount = rawData.length > 0 ? rawData[0].features.length : 0;
    const labels = [...new Set(rawData.map((s) => s.label))];

    const metadata: DatasetMetadata = {
      id,
      name: datasetName,
      format,
      size: stats.size,
      sampleCount,
      featureCount,
      labels,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.datasets.set(id, metadata);
    this.loadedData.set(id, rawData);

    globalLogger.info(`Dataset registered: ${id}`, {
      name: datasetName,
      format,
      sampleCount,
    });

    return metadata;
  }

  unregisterDataset(datasetId: string): void {
    if (!this.datasets.has(datasetId)) {
      throw new Error(`Dataset "${datasetId}" not found`);
    }
    this.datasets.delete(datasetId);
    this.loadedData.delete(datasetId);
    globalLogger.info(`Dataset unregistered: ${datasetId}`);
  }

  getMetadata(datasetId: string): DatasetMetadata {
    const metadata = this.datasets.get(datasetId);
    if (!metadata) {
      throw new Error(`Dataset "${datasetId}" not found`);
    }
    return metadata;
  }

  listDatasets(): DatasetMetadata[] {
    return Array.from(this.datasets.values());
  }

  loadData(datasetId: string, options: Partial<DataLoaderOptions> = {}): DataSample[] {
    const mergedOptions: DataLoaderOptions = { ...this.defaultOptions, ...options };
    const data = this.loadedData.get(datasetId);

    if (!data) {
      throw new Error(`Dataset "${datasetId}" data not loaded`);
    }

    let processed = [...data];

    processed = this.applyPreprocessing(processed, mergedOptions.preprocessing);

    if (mergedOptions.augmentation.enabled) {
      processed = this.applyAugmentation(processed, mergedOptions.augmentation);
    }

    if (mergedOptions.shuffle) {
      processed = this.shuffle(processed);
    }

    return processed;
  }

  getBatches(
    datasetId: string,
    options: Partial<DataLoaderOptions> = {}
  ): DataBatch[] {
    const mergedOptions: DataLoaderOptions = { ...this.defaultOptions, ...options };
    const data = this.loadData(datasetId, options);
    const batchSize = mergedOptions.batchSize;
    const batches: DataBatch[] = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batchSamples = data.slice(i, i + batchSize);
      batches.push({
        samples: batchSamples,
        batchSize: batchSamples.length,
        epoch: 0,
        isLast: i + batchSize >= data.length,
      });
    }

    return batches;
  }

  getTrainValidationSplit(
    datasetId: string,
    options: Partial<DataLoaderOptions> = {}
  ): { train: DataSample[]; validation: DataSample[] } {
    const mergedOptions: DataLoaderOptions = { ...this.defaultOptions, ...options };
    const data = this.loadData(datasetId, options);
    const splitIndex = Math.floor(data.length * (1 - mergedOptions.validationSplit));

    return {
      train: data.slice(0, splitIndex),
      validation: data.slice(splitIndex),
    };
  }

  getSampleCount(datasetId: string): number {
    const data = this.loadedData.get(datasetId);
    return data?.length ?? 0;
  }

  getLabels(datasetId: string): string[] {
    const metadata = this.getMetadata(datasetId);
    return metadata.labels;
  }

  private readDataFile(filePath: string, format: DataFormat): DataSample[] {
    const content = fs.readFileSync(filePath, "utf-8");

    switch (format) {
      case "json":
        return this.parseJSON(content);
      case "csv":
        return this.parseCSV(content);
      case "text":
        return this.parseText(content);
      default:
        throw new Error(`Unsupported data format: ${format}`);
    }
  }

  private parseJSON(content: string): DataSample[] {
    const parsed = JSON.parse(content) as Array<Record<string, unknown>>;
    return parsed.map((item, index) => ({
      id: `sample-${index}`,
      features: (item.features as number[]) ?? [],
      label: String(item.label ?? ""),
      metadata: (item.metadata as Record<string, unknown>) ?? {},
    }));
  }

  private parseCSV(content: string): DataSample[] {
    const lines = content.trim().split("\n");
    if (lines.length < 2) return [];

    const headers = lines[0].split(",").map((h) => h.trim());
    const labelIndex = headers.findIndex((h) => h.toLowerCase() === "label");

    return lines.slice(1).map((line, index) => {
      const values = line.split(",").map((v) => v.trim());
      const features = values
        .filter((_, i) => i !== labelIndex)
        .map((v) => Number(v))
        .filter((v) => !isNaN(v));
      const label = labelIndex >= 0 ? values[labelIndex] : "";

      return {
        id: `sample-${index}`,
        features,
        label,
        metadata: {},
      };
    });
  }

  private parseText(content: string): DataSample[] {
    const lines = content.trim().split("\n");
    return lines.map((line, index) => ({
      id: `sample-${index}`,
      features: [],
      label: "",
      metadata: { text: line.trim() },
    }));
  }

  private applyPreprocessing(
    data: DataSample[],
    steps: PreprocessingStep[]
  ): DataSample[] {
    let processed = [...data];

    for (const step of steps) {
      if (!step.enabled) continue;

      switch (step.name) {
        case "normalize":
          processed = this.normalize(processed, step.params);
          break;
        case "standardize":
          processed = this.standardize(processed, step.params);
          break;
        case "removeOutliers":
          processed = this.removeOutliers(processed, step.params);
          break;
        case "fillMissing":
          processed = this.fillMissing(processed, step.params);
          break;
        default:
          globalLogger.warn(`Unknown preprocessing step: ${step.name}`);
      }
    }

    return processed;
  }

  private normalize(data: DataSample[], params: Record<string, unknown>): DataSample[] {
    const min = (params.min as number) ?? 0;
    const max = (params.max as number) ?? 1;
    return data.map((sample) => ({
      ...sample,
      features: sample.features.map((f) => min + (f - min) / (max - min + 1e-8)),
    }));
  }

  private standardize(data: DataSample[], _params: Record<string, unknown>): DataSample[] {
    if (data.length === 0) return data;
    const featureCount = data[0].features.length;

    const means = Array(featureCount).fill(0);
    const stds = Array(featureCount).fill(0);

    for (const sample of data) {
      for (let i = 0; i < featureCount; i++) {
        means[i] += sample.features[i] / data.length;
      }
    }

    for (const sample of data) {
      for (let i = 0; i < featureCount; i++) {
        stds[i] += Math.pow(sample.features[i] - means[i], 2) / data.length;
      }
    }

    for (let i = 0; i < featureCount; i++) {
      stds[i] = Math.sqrt(stds[i]) || 1;
    }

    return data.map((sample) => ({
      ...sample,
      features: sample.features.map((f, i) => (f - means[i]) / stds[i]),
    }));
  }

  private removeOutliers(data: DataSample[], params: Record<string, unknown>): DataSample[] {
    const threshold = (params.threshold as number) ?? 3;
    return data.filter((sample) => {
      const mean = sample.features.reduce((a, b) => a + b, 0) / sample.features.length;
      const std = Math.sqrt(
        sample.features.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / sample.features.length
      );
      return std < threshold;
    });
  }

  private fillMissing(data: DataSample[], params: Record<string, unknown>): DataSample[] {
    const fillValue = (params.value as number) ?? 0;
    return data.map((sample) => ({
      ...sample,
      features: sample.features.map((f) => (isNaN(f) ? fillValue : f)),
    }));
  }

  private applyAugmentation(data: DataSample[], config: AugmentationConfig): DataSample[] {
    if (!config.enabled || config.methods.length === 0) return data;

    const augmented: DataSample[] = [...data];

    for (const sample of data) {
      if (Math.random() < config.probability) {
        const method = config.methods[Math.floor(Math.random() * config.methods.length)];
        const augmentedSample = this.applyAugmentationMethod(sample, method);
        augmented.push(augmentedSample);
      }
    }

    return augmented;
  }

  private applyAugmentationMethod(sample: DataSample, method: AugmentationMethod): DataSample {
    switch (method.name) {
      case "noise": {
        const scale = (method.params.scale as number) ?? 0.01;
        return {
          ...sample,
          id: `${sample.id}-aug-noise`,
          features: sample.features.map((f) => f + (Math.random() - 0.5) * scale),
        };
      }
      case "scale": {
        const factor = (method.params.factor as number) ?? 1.1;
        return {
          ...sample,
          id: `${sample.id}-aug-scale`,
          features: sample.features.map((f) => f * factor),
        };
      }
      case "flip": {
        return {
          ...sample,
          id: `${sample.id}-aug-flip`,
          features: [...sample.features].reverse(),
        };
      }
      default:
        return { ...sample, id: `${sample.id}-aug` };
    }
  }

  private shuffle(data: DataSample[]): DataSample[] {
    const result = [...data];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
}

export { DatasetLoader };
export type {
  DatasetMetadata,
  PreprocessingStep,
  AugmentationConfig,
  AugmentationMethod,
  DataSample,
  DataBatch,
  DataLoaderOptions,
  DataFormat,
};
