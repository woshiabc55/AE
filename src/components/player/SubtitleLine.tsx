import { useEffect, useState } from 'react';

interface SubtitleLineProps {
  text: string;
  /** 显示时长（毫秒） */
  duration: number;
  /** 是否启用 */
  enabled: boolean;
}

/**
 * 字幕行：打字机效果，按字符依次出现
 */
export function SubtitleLine({ text, duration, enabled }: SubtitleLineProps) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!enabled) {
      setShown(0);
      return;
    }
    setShown(0);
    const len = text.length;
    if (len === 0) return;
    const interval = Math.max(20, Math.min(80, duration / len));
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= len) {
        setShown(len);
        clearInterval(id);
      } else {
        setShown(i);
      }
    }, interval);
    return () => clearInterval(id);
  }, [text, duration, enabled]);

  if (!enabled) return null;
  return (
    <span className="subtitle text-paper">
      {text.slice(0, shown)}
      {shown < text.length && (
        <span
          className="inline-block w-[2px] h-[1em] align-middle ml-1"
          style={{
            background: '#C9A972',
            animation: 'caret 0.6s steps(2) infinite',
          }}
        />
      )}
      <style>{`@keyframes caret { 50% { opacity: 0; } }`}</style>
    </span>
  );
}
