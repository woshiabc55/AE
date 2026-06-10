import { useEffect } from 'react';
import { useTheme } from '@/store/theme';

/**
 * 将当前主题同步到 <html> 根节点，供 Tailwind 的 dark: 变体使用。
 * 默认使用 dark class（保持暗色为基线，避免 FOUC）。
 */
export function useThemeSync() {
  const mode = useTheme((s) => s.mode);
  useEffect(() => {
    const root = document.documentElement;
    if (mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
  }, [mode]);
}
