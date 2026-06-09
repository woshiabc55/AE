// lib/utils.ts - 通用工具
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 模拟网络延迟
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// 生成简短 ID
export const uid = (prefix = 'id') =>
  `${prefix}_${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`;

// 格式化日期
export function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return '刚刚';
  if (min < 60) return `${min} 分钟前`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h} 小时前`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d} 天前`;
  if (d < 30) return `${Math.floor(d / 7)} 周前`;
  return formatDate(iso);
}

// 数字紧凑显示
export function compactNumber(n: number) {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}w`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

// 数字滚动入场（用于首页统计）
export function useNumberRoll() {
  // 简单实现：组件内手动处理
}

// 程序化封面：根据 id 和 category 生成确定的渐变
export function makeCoverGradient(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const a = (h % 360);
  const b = (a + 40) % 360;
  const c = (a + 80) % 360;
  return {
    background: `
      radial-gradient(at 20% 20%, hsla(${a}, 60%, 55%, 0.5), transparent 50%),
      radial-gradient(at 80% 30%, hsla(${b}, 60%, 50%, 0.45), transparent 55%),
      radial-gradient(at 50% 90%, hsla(${c}, 55%, 45%, 0.5), transparent 55%),
      linear-gradient(135deg, #0B0B0F 0%, #181820 100%)
    `,
    accentHue: a,
  };
}

// 提取文本中所有 {{variable}} 键
export function extractVariableKeys(text: string): string[] {
  const re = /\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g;
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) set.add(m[1]);
  return [...set];
}

// 估算 token 数（粗略：英文 ~4 字符/token，中文 ~1.5 字符/token）
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const en = (text.match(/[a-zA-Z0-9\s.,!?;:'"()\-]+/g) || []).join('').length;
  const zh = text.length - en;
  return Math.max(1, Math.round(en / 4 + zh / 1.5));
}

// 渲染：把 {{var}} 替换为 values[var]
export function renderTemplate(body: string, values: Record<string, string>): string {
  return body.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g, (_, key) => {
    const v = values[key];
    if (!v || !v.trim()) return `{{${key}}}`;
    return v;
  });
}
