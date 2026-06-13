/**
 * 与后端通信的 fetch 封装
 */
import type { Theme, AppState } from '../api/types';

type ThemeResponse = { theme: Theme; available?: string[] };

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  async getTheme(): Promise<ThemeResponse> {
    return json<ThemeResponse>(await fetch('/api/theme'));
  },
  async postTheme(patch: Partial<Theme> & { id?: string }): Promise<{ theme: Theme }> {
    return json<{ theme: Theme }>(
      await fetch('/api/theme', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(patch),
      })
    );
  },
  async getState(): Promise<AppState> {
    return json<AppState>(await fetch('/api/state'));
  },
  async setIntensity(value: number): Promise<AppState> {
    return json<AppState>(
      await fetch('/api/state/intensity', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ value }),
      })
    );
  },
  async health(): Promise<{ ok: boolean; uptime: number; version: string }> {
    return json(await fetch('/api/health'));
  },
};
