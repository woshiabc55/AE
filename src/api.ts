import type { Provider, RunEvent, Workflow } from './types';

const BASE = 'http://127.0.0.1:4317';

export async function fetchProviders(): Promise<Provider[]> {
  const r = await fetch(`${BASE}/api/providers`);
  const j = await r.json();
  return j.providers || [];
}

export async function pingProvider(id: string) {
  const r = await fetch(`${BASE}/api/ping`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ provider: id }),
  });
  return r.json() as Promise<{ ok: boolean; latencyMs: number; message?: string }>;
}

export async function startRun(workflow: Workflow, inputs: Record<string, string> = {}) {
  const r = await fetch(`${BASE}/api/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ workflow, inputs }),
  });
  return (await r.json()) as { runId: string };
}

export async function abortRun(id: string) {
  await fetch(`${BASE}/api/run/${id}/abort`, { method: 'POST' });
}

export function subscribeRun(id: string, onEvent: (e: RunEvent) => void): () => void {
  const es = new EventSource(`${BASE}/api/stream/${id}`);
  es.onmessage = (ev) => {
    try {
      const data = JSON.parse(ev.data) as RunEvent;
      onEvent(data);
      if (data.type === 'end' || data.type === 'error') {
        // 给一个缓冲再关
        setTimeout(() => es.close(), 100);
      }
    } catch (e) {
      console.warn('SSE parse error', e);
    }
  };
  es.onerror = () => {
    es.close();
  };
  return () => es.close();
}

export async function listFrameworks() {
  const r = await fetch(`${BASE}/api/framework/list`);
  return (await r.json()) as { frameworks: { id: string; name: string; category?: string; updated_at: string }[] };
}

export async function getFramework(id: string) {
  const r = await fetch(`${BASE}/api/framework/${id}`);
  return r.json() as Promise<Workflow & { category?: string; name: string; id: string }>;
}

export async function saveFramework(w: Workflow & { category?: string }) {
  const r = await fetch(`${BASE}/api/framework/save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(w),
  });
  return r.json();
}

export async function deleteFramework(id: string) {
  const r = await fetch(`${BASE}/api/framework/${id}`, { method: 'DELETE' });
  return r.json();
}
