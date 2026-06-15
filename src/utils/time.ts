export function formatTime(t: number, withMs = false): string {
  if (!Number.isFinite(t) || t < 0) t = 0;
  const total = Math.floor(t * 1000);
  const ms = total % 1000;
  const totalSec = Math.floor(total / 1000);
  const s = totalSec % 60;
  const m = Math.floor(totalSec / 60) % 60;
  const h = Math.floor(totalSec / 3600);

  const pad = (n: number, len = 2) => n.toString().padStart(len, "0");
  const base = h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
  if (!withMs) return base;
  return `${base}.${pad(ms, 3).slice(0, 2)}`;
}

export function formatTimeShort(t: number): string {
  const total = Math.floor(t);
  const s = total % 60;
  const m = Math.floor(total / 60) % 60;
  const h = Math.floor(total / 3600);
  const pad = (n: number) => n.toString().padStart(2, "0");
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

export function clampTime(t: number, duration: number): number {
  if (!Number.isFinite(t)) return 0;
  return Math.max(0, Math.min(duration || 0, t));
}
