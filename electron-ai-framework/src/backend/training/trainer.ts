import { globalEventBus } from "../../core/event-bus";
import { globalLogger } from "../../core/logger";

type TrainingStatus = "idle" | "running" | "paused" | "completed" | "failed";

interface Hyperparameters {
  epochs: number;
  learningRate: number;
  batchSize: number;
  optimizer: string;
  lossFunction: string;
  [key: string]: unknown;
}

interface TrainingCheckpoint {
  epoch: number;
  loss: number;
  accuracy: number;
  timestamp: number;
  path: string;
}

interface TrainingCallback {
  onEpochEnd: (epoch: number, metrics: { loss: number; accuracy: number }) => void;
  onBatchEnd: (batch: number, loss: number) => void;
  onTrainingEnd: (status: TrainingStatus) => void;
}

interface TrainingJob {
  id: string;
  modelId: string;
  datasetId: string;
  hyperparameters: Hyperparameters;
  status: TrainingStatus;
  currentEpoch: number;
  currentBatch: number;
  loss: number;
  accuracy: number;
  startTime: number | null;
  endTime: number | null;
  checkpoints: TrainingCheckpoint[];
  callbacks: TrainingCallback[];
  abortController: AbortController | null;
}

interface TrainerOptions {
  checkpointDir: string;
  saveInterval: number;
  maxCheckpoints: number;
  validationInterval: number;
}

const DEFAULT_HYPERPARAMETERS: Hyperparameters = {
  epochs: 10,
  learningRate: 0.001,
  batchSize: 32,
  optimizer: "adam",
  lossFunction: "crossEntropy",
};

class Trainer {
  private jobs: Map<string, TrainingJob>;
  private options: TrainerOptions;
  private checkpointDir: string;

  constructor(options: Partial<TrainerOptions> = {}) {
    this.jobs = new Map();
    this.checkpointDir = options.checkpointDir ?? "./checkpoints";
    this.options = {
      checkpointDir: this.checkpointDir,
      saveInterval: options.saveInterval ?? 1,
      maxCheckpoints: options.maxCheckpoints ?? 5,
      validationInterval: options.validationInterval ?? 1,
    };
  }

  createJob(
    modelId: string,
    datasetId: string,
    hyperparameters: Partial<Hyperparameters> = {},
    callbacks: Partial<TrainingCallback> = {}
  ): TrainingJob {
    const id = `training-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    const mergedHyperparams: Hyperparameters = {
      ...DEFAULT_HYPERPARAMETERS,
      ...hyperparameters,
    };

    const defaultCallbacks: TrainingCallback = {
      onEpochEnd: () => {},
      onBatchEnd: () => {},
      onTrainingEnd: () => {},
      ...callbacks,
    };

    const job: TrainingJob = {
      id,
      modelId,
      datasetId,
      hyperparameters: mergedHyperparams,
      status: "idle",
      currentEpoch: 0,
      currentBatch: 0,
      loss: Infinity,
      accuracy: 0,
      startTime: null,
      endTime: null,
      checkpoints: [],
      callbacks: [defaultCallbacks],
      abortController: null,
    };

    this.jobs.set(id, job);
    globalEventBus.emit("training:job-created", { id, modelId, datasetId });
    globalLogger.info(`Training job created: ${id}`, { modelId, datasetId });

    return job;
  }

  async start(jobId: string): Promise<void> {
    const job = this.getJob(jobId);
    if (job.status === "running") {
      throw new Error(`Training job "${jobId}" is already running`);
    }

    job.status = "running";
    job.startTime = Date.now();
    job.abortController = new AbortController();

    globalEventBus.emit("training:started", { id: jobId });
    globalLogger.info(`Training started: ${jobId}`);

    try {
      await this.runTrainingLoop(job);
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        job.status = "failed";
        job.endTime = Date.now();
        globalEventBus.emit("training:failed", { id: jobId, error: (err as Error).message });
        globalLogger.error(`Training failed: ${jobId}`, { error: (err as Error).message });
        for (const cb of job.callbacks) {
          cb.onTrainingEnd("failed");
        }
      }
    }
  }

  async stop(jobId: string): Promise<void> {
    const job = this.getJob(jobId);
    if (job.status !== "running") {
      throw new Error(`Training job "${jobId}" is not running`);
    }

    job.abortController?.abort();
    job.status = "paused";
    job.endTime = Date.now();

    globalEventBus.emit("training:stopped", { id: jobId });
    globalLogger.info(`Training stopped: ${jobId}`);
  }

  async resume(jobId: string): Promise<void> {
    const job = this.getJob(jobId);
    if (job.status !== "paused") {
      throw new Error(`Training job "${jobId}" is not paused`);
    }

    job.abortController = new AbortController();
    await this.start(jobId);
  }

  getStatus(jobId: string): TrainingJob {
    return this.getJob(jobId);
  }

  listJobs(): TrainingJob[] {
    return Array.from(this.jobs.values());
  }

  getCheckpoints(jobId: string): TrainingCheckpoint[] {
    return this.getJob(jobId).checkpoints;
  }

  async saveCheckpoint(jobId: string): Promise<TrainingCheckpoint> {
    const job = this.getJob(jobId);
    const checkpoint: TrainingCheckpoint = {
      epoch: job.currentEpoch,
      loss: job.loss,
      accuracy: job.accuracy,
      timestamp: Date.now(),
      path: `${this.options.checkpointDir}/${job.modelId}/epoch-${job.currentEpoch}`,
    };

    job.checkpoints.push(checkpoint);

    if (job.checkpoints.length > this.options.maxCheckpoints) {
      job.checkpoints.shift();
    }

    globalEventBus.emit("training:checkpoint-saved", { id: jobId, epoch: job.currentEpoch });
    globalLogger.info(`Checkpoint saved: ${jobId} at epoch ${job.currentEpoch}`);

    return checkpoint;
  }

  private async runTrainingLoop(job: TrainingJob): Promise<void> {
    const { epochs, batchSize } = job.hyperparameters;
    const totalBatches = 100;

    for (let epoch = job.currentEpoch; epoch < epochs; epoch++) {
      if (job.abortController?.signal.aborted) {
        return;
      }

      job.currentEpoch = epoch + 1;

      for (let batch = 0; batch < totalBatches; batch++) {
        if (job.abortController?.signal.aborted) {
          return;
        }

        const batchLoss = this.simulateBatchLoss(epoch, batch, job.hyperparameters.learningRate);
        job.loss = batchLoss;
        job.currentBatch = batch + 1;

        for (const cb of job.callbacks) {
          cb.onBatchEnd(batch + 1, batchLoss);
        }

        await this.sleep(10);
      }

      const epochMetrics = {
        loss: job.loss,
        accuracy: Math.min(0.99, 0.1 + (epoch / epochs) * 0.85),
      };
      job.accuracy = epochMetrics.accuracy;

      for (const cb of job.callbacks) {
        cb.onEpochEnd(epoch + 1, epochMetrics);
      }

      if ((epoch + 1) % this.options.saveInterval === 0) {
        await this.saveCheckpoint(job.id);
      }

      globalEventBus.emit("training:epoch-end", {
        id: job.id,
        epoch: epoch + 1,
        metrics: epochMetrics,
      });
    }

    job.status = "completed";
    job.endTime = Date.now();

    for (const cb of job.callbacks) {
      cb.onTrainingEnd("completed");
    }

    globalEventBus.emit("training:completed", { id: job.id });
    globalLogger.info(`Training completed: ${job.id}`);
  }

  private getJob(jobId: string): TrainingJob {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Training job "${jobId}" not found`);
    }
    return job;
  }

  private simulateBatchLoss(epoch: number, batch: number, learningRate: number): number {
    const baseLoss = 2.0;
    const decay = Math.exp(-learningRate * (epoch * 100 + batch));
    return baseLoss * decay + Math.random() * 0.1;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export { Trainer };
export type {
  TrainingJob,
  TrainingStatus,
  Hyperparameters,
  TrainingCheckpoint,
  TrainingCallback,
  TrainerOptions,
};
