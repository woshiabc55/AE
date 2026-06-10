// 自动保存草稿到 sessionStorage / localStorage
import { useEffect, useRef } from "react";
import { useDebounce } from "./useDebounce";

export function useAutoSave<T>(key: string, value: T, enabled = true, delay = 800) {
  const debounced = useDebounce(value, delay);
  const first = useRef(true);
  useEffect(() => {
    if (!enabled) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      localStorage.setItem("lumiere.draft." + key, JSON.stringify(debounced));
    } catch {
      // quota 错误静默处理
    }
  }, [debounced, key, enabled]);
}

export function loadDraft<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem("lumiere.draft." + key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function clearDraft(key: string) {
  try {
    localStorage.removeItem("lumiere.draft." + key);
  } catch {
    // ignore
  }
}
