// 包装 async 函数，统一错误处理 + toast
import { toast } from "@/store/toast";

export async function safe<T>(
  fn: () => Promise<T> | T,
  fallback?: string
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (e) {
    const msg = (e as Error)?.message ?? String(e);
    toast.error(fallback ?? "操作失败", msg);
    // eslint-disable-next-line no-console
    console.error("[Lumiere] safe() error:", e);
    return undefined;
  }
}

/**
 * 静默包装：捕获但不报告（用于 fire-and-forget）
 */
export async function silent<T>(
  fn: () => Promise<T> | T
): Promise<T | undefined> {
  try {
    return await fn();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Lumiere] silent() error:", e);
    return undefined;
  }
}

/**
 * 防御性读取：safe JSON parse
 */
export function safeJson<T = unknown>(
  text: string,
  fallback: T
): T {
  try {
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

/**
 * 防御性读取：safe localStorage get
 */
export function safeGet<T>(key: string, fallback: T): T {
  try {
    if (typeof localStorage === "undefined") return fallback;
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * 防御性写入：safe localStorage set（容错 quota）
 */
export function safeSet<T>(key: string, value: T): boolean {
  try {
    if (typeof localStorage === "undefined") return false;
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("[Lumiere] safeSet quota error:", e);
    return false;
  }
}

/**
 * 防御性读取 URL 参数
 */
export function safeReadUrl<T = string>(
  key: string,
  parse?: (raw: string) => T
): T | string | null {
  try {
    if (typeof window === "undefined") return null;
    const p = new URLSearchParams(window.location.search);
    const v = p.get(key);
    if (v == null) return null;
    return parse ? parse(v) : v;
  } catch {
    return null;
  }
}

/**
 * 防御性：保证输入是数组
 */
export function ensureArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

/**
 * 防御性：保证输入是字符串
 */
export function ensureString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

/**
 * 防御性：保证输入是有限正整数
 */
export function ensureInt(v: unknown, fallback = 0): number {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) && Math.floor(n) === n ? n : fallback;
}
