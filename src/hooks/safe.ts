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
