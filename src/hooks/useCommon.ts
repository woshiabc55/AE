// 通用 React 工具 hooks
import { useEffect, useState, useCallback, useRef } from "react";

/**
 * 防抖值：value 在 delay 内不再变化才更新
 * 用法：const debounced = useDebouncedValue(text, 300);
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

/**
 * 跟踪组件是否已挂载（避免在 unmount 后调用 setState）
 */
export function useIsMounted(): () => boolean {
  const ref = useRef(false);
  useEffect(() => {
    ref.current = true;
    return () => {
      ref.current = false;
    };
  }, []);
  return useCallback(() => ref.current, []);
}

/**
 * 异步操作包装器：跟踪 loading / error 状态
 */
export interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

export function useAsync<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>
): [(...args: Args) => Promise<T | null>, AsyncState<T>] {
  const [state, setState] = useState<AsyncState<T>>({
    loading: false,
    error: null,
    data: null,
  });
  const isMounted = useIsMounted();

  const run = useCallback(
    async (...args: Args) => {
      setState({ loading: true, error: null, data: null });
      try {
        const data = await fn(...args);
        if (isMounted()) setState({ loading: false, error: null, data });
        return data;
      } catch (e) {
        const err = e instanceof Error ? e : new Error(String(e));
        if (isMounted()) setState({ loading: false, error: err, data: null });
        return null;
      }
    },
    [fn, isMounted]
  );

  return [run, state];
}

/**
 * 媒体查询：响应式
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  });
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/**
 * localStorage 安全读取/写入（带 JSON 序列化、容错）
 */
export function useLocalStorage<T>(
  key: string,
  initial: T
): [T, (v: T | ((p: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  const setStored = useCallback(
    (v: T | ((p: T) => T)) => {
      setValue((prev) => {
        const next = typeof v === "function" ? (v as (p: T) => T)(prev) : v;
        try {
          window.localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // quota exceeded or serializable error — silent
        }
        return next;
      });
    },
    [key]
  );
  return [value, setStored];
}

/**
 * 把外部 store 的某个值同步到 state（避免渲染竞态）
 */
export function useSyncedExternal<T>(get: () => T, deps: any[]): T {
  const [value, setValue] = useState<T>(get);
  useEffect(() => {
    setValue(get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return value;
}
