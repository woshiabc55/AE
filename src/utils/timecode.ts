// 时间码工具：把秒数格式化为 mm:ss.mmm
export function formatTimecode(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.round((sec - Math.floor(sec)) * 1000);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
}

// 把秒数格式化为 mm:ss（精简版）
export function formatShort(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

// 从一段文本中提取时间码 00:00:00 / 00:00
const TC_RE = /\b(\d{1,2}):(\d{2})(?::(\d{2}))?(?:\.(\d{1,3}))?\b/g;
export function extractTimecodes(text: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  TC_RE.lastIndex = 0;
  while ((m = TC_RE.exec(text))) out.push(m[0]);
  return Array.from(new Set(out));
}
