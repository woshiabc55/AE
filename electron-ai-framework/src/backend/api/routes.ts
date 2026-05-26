import { AIService } from "../ai-service";
import { RequestHandlerContext } from "../index";

interface RouteResult {
  statusCode: number;
  body: unknown;
}

interface Route {
  method: string;
  pattern: string;
  handler: (context: RequestHandlerContext) => RouteResult | Promise<RouteResult>;
}

class APIRouter {
  private routes: Route[];

  constructor() {
    this.routes = [];
  }

  get(pattern: string, handler: Route["handler"]): void {
    this.routes.push({ method: "GET", pattern, handler });
  }

  post(pattern: string, handler: Route["handler"]): void {
    this.routes.push({ method: "POST", pattern, handler });
  }

  put(pattern: string, handler: Route["handler"]): void {
    this.routes.push({ method: "PUT", pattern, handler });
  }

  delete(pattern: string, handler: Route["handler"]): void {
    this.routes.push({ method: "DELETE", pattern, handler });
  }

  match(method: string, pathname: string): Route | null {
    for (const route of this.routes) {
      if (route.method !== method) continue;
      if (this.matchPattern(route.pattern, pathname)) {
        return route;
      }
    }
    return null;
  }

  private matchPattern(pattern: string, pathname: string): boolean {
    const patternParts = pattern.split("/");
    const pathParts = pathname.split("/");
    if (patternParts.length !== pathParts.length) return false;
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) continue;
      if (patternParts[i] !== pathParts[i]) return false;
    }
    return true;
  }
}

function createRouter(aiService: AIService): APIRouter {
  const router = new APIRouter();

  router.get("/api/health", (_ctx: RequestHandlerContext): RouteResult => {
    return {
      statusCode: 200,
      body: { status: "ok", timestamp: Date.now() },
    };
  });

  router.get("/api/models", (_ctx: RequestHandlerContext): RouteResult => {
    const models = aiService.listModels();
    return {
      statusCode: 200,
      body: { models },
    };
  });

  router.get("/api/models/:id", (ctx: RequestHandlerContext): RouteResult => {
    try {
      const modelId = extractParam(ctx.path, 3);
      const info = aiService.getModelInfo(modelId);
      return { statusCode: 200, body: { model: info } };
    } catch (err) {
      return { statusCode: 404, body: { error: (err as Error).message } };
    }
  });

  router.post("/api/models/:id/load", (ctx: RequestHandlerContext): Promise<RouteResult> => {
    const modelId = extractParam(ctx.path, 3);
    return aiService
      .loadModel(modelId)
      .then(() => ({ statusCode: 200, body: { success: true } }))
      .catch((err: Error) => ({ statusCode: 500, body: { error: err.message } }));
  });

  router.post("/api/models/:id/unload", (ctx: RequestHandlerContext): Promise<RouteResult> => {
    const modelId = extractParam(ctx.path, 3);
    return aiService
      .unloadModel(modelId)
      .then(() => ({ statusCode: 200, body: { success: true } }))
      .catch((err: Error) => ({ statusCode: 500, body: { error: err.message } }));
  });

  router.post("/api/models/:id/inference", (ctx: RequestHandlerContext): Promise<RouteResult> => {
    const modelId = extractParam(ctx.path, 3);
    const body = ctx.body as { input: unknown; options?: Record<string, unknown> };
    return aiService
      .inference(modelId, body.input, body.options ?? {})
      .then((result) => ({ statusCode: 200, body: { result } }))
      .catch((err: Error) => ({ statusCode: 500, body: { error: err.message } }));
  });

  router.post("/api/models/register", (ctx: RequestHandlerContext): RouteResult => {
    try {
      const body = ctx.body as {
        id: string;
        name: string;
        version: string;
        description: string;
        framework: string;
        inputShape: number[];
        outputShape: number[];
        tags: string[];
      };
      const metadata = aiService.registerModel(body);
      return { statusCode: 201, body: { model: metadata } };
    } catch (err) {
      return { statusCode: 400, body: { error: (err as Error).message } };
    }
  });

  router.get("/api/training/jobs", (_ctx: RequestHandlerContext): RouteResult => {
    const jobs = aiService.getTrainer().listJobs();
    return {
      statusCode: 200,
      body: {
        jobs: jobs.map((job) => ({
          id: job.id,
          modelId: job.modelId,
          datasetId: job.datasetId,
          status: job.status,
          currentEpoch: job.currentEpoch,
          loss: job.loss,
          accuracy: job.accuracy,
        })),
      },
    };
  });

  router.post("/api/training/start", (ctx: RequestHandlerContext): Promise<RouteResult> => {
    const body = ctx.body as {
      modelId: string;
      datasetId: string;
      hyperparameters?: Record<string, unknown>;
    };
    return aiService
      .startTraining(body.modelId, body.datasetId, body.hyperparameters ?? {})
      .then((trainingId) => ({ statusCode: 202, body: { trainingId } }))
      .catch((err: Error) => ({ statusCode: 500, body: { error: err.message } }));
  });

  router.post("/api/training/:id/stop", (ctx: RequestHandlerContext): Promise<RouteResult> => {
    const trainingId = extractParam(ctx.path, 3);
    return aiService
      .stopTraining(trainingId)
      .then(() => ({ statusCode: 200, body: { success: true } }))
      .catch((err: Error) => ({ statusCode: 500, body: { error: err.message } }));
  });

  router.get("/api/training/:id/status", (ctx: RequestHandlerContext): RouteResult => {
    try {
      const trainingId = extractParam(ctx.path, 3);
      const job = aiService.getTrainingStatus(trainingId);
      return {
        statusCode: 200,
        body: {
          id: job.id,
          modelId: job.modelId,
          status: job.status,
          currentEpoch: job.currentEpoch,
          totalEpochs: job.hyperparameters.epochs,
          loss: job.loss,
          accuracy: job.accuracy,
          startTime: job.startTime,
          endTime: job.endTime,
        },
      };
    } catch (err) {
      return { statusCode: 404, body: { error: (err as Error).message } };
    }
  });

  router.get("/api/datasets", (_ctx: RequestHandlerContext): RouteResult => {
    const datasets = aiService.listDatasets();
    return { statusCode: 200, body: { datasets } };
  });

  router.post("/api/datasets/register", (ctx: RequestHandlerContext): RouteResult => {
    try {
      const body = ctx.body as {
        filePath: string;
        format: "json" | "csv" | "parquet" | "image" | "text";
        name?: string;
      };
      const metadata = aiService.registerDataset(body.filePath, body.format, body.name);
      return { statusCode: 201, body: { dataset: metadata } };
    } catch (err) {
      return { statusCode: 400, body: { error: (err as Error).message } };
    }
  });

  return router;
}

function extractParam(pathname: string, segmentIndex: number): string {
  const parts = pathname.split("/");
  return parts[segmentIndex] ?? "";
}

export { APIRouter, createRouter };
export type { Route, RouteResult };
