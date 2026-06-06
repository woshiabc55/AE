import { ref, watch, onUnmounted, shallowRef, type Ref } from 'vue';
import type { DerivativeWork } from '@/data/types';
import type { WorkerRequest, WorkerResponse, StatsResult } from '@/workers/filter.worker';

interface UseFilterWorkerReturn {
  data: Ref<DerivativeWork[] | null>;
  stats: Ref<StatsResult | null>;
  loading: Ref<boolean>;
  duration: Ref<number>;
}

let workerInstance: Worker | null = null;
let nextId = 1;
const callbacks = new Map<number, (resp: WorkerResponse) => void>();

function getWorker(): Worker {
  if (workerInstance) return workerInstance;
  workerInstance = new Worker(new URL('../workers/filter.worker.ts', import.meta.url), { type: 'module' });
  workerInstance.addEventListener('message', (e: MessageEvent<WorkerResponse>) => {
    const cb = callbacks.get(e.data.id);
    if (cb) {
      cb(e.data);
      callbacks.delete(e.data.id);
    }
  });
  return workerInstance;
}

function post<T>(req: WorkerRequest): Promise<WorkerResponse> {
  return new Promise((resolve) => {
    const w = getWorker();
    callbacks.set(req.id, (resp) => resolve(resp));
    w.postMessage(req);
  });
}

export function useFilterWorker(): UseFilterWorkerReturn {
  const data = shallowRef<DerivativeWork[] | null>(null);
  const stats = shallowRef<StatsResult | null>(null);
  const loading = ref(false);
  const duration = ref(0);
  let currentReqId = 0;

  function run(payload: WorkerRequest['payload'], kind: 'filter' | 'stats') {
    if (currentReqId) callbacks.delete(currentReqId);
    currentReqId = nextId++;
    loading.value = true;
    post({
      type: kind,
      id: currentReqId,
      payload,
    }).then((resp) => {
      if (resp.id !== currentReqId) return; // 过期响应
      duration.value = resp.duration;
      loading.value = false;
      if (resp.error) {
        console.error('[worker]', resp.error);
        return;
      }
      if (kind === 'filter') data.value = resp.result as DerivativeWork[];
      else stats.value = resp.result as StatsResult;
    });
  }

  return { data, stats, loading, duration };
}

export function useWorkerStats(works: Ref<DerivativeWork[]>) {
  const stats = shallowRef<StatsResult | null>(null);
  const duration = ref(0);
  let timer: ReturnType<typeof setTimeout> | null = null;
  let reqId = 0;

  function compute() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      reqId = nextId++;
      post({
        type: 'stats',
        id: reqId,
        payload: { works: works.value },
      }).then((resp) => {
        if (resp.id !== reqId) return;
        duration.value = resp.duration;
        stats.value = resp.result as StatsResult;
      });
    }, 200);
  }

  watch(works, compute, { immediate: true });
  onUnmounted(() => {
    if (timer) clearTimeout(timer);
  });

  return { stats, duration };
}
