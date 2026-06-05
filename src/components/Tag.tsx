// ====================================================================
// TAG 组件 - 9 类目色板 + 4 尺寸 + 3 形态
// 模块化9的标准原子 — 所有页面共享同一套标签语言
// ====================================================================
import type { ReactNode } from 'react';

export type TagCategory =
  | 'visual'    // 01 视觉
  | 'motion'    // 02 动效
  | 'type'      // 03 字体
  | 'color'     // 04 颜色
  | 'layout'    // 05 布局
  | 'interact'  // 06 交互
  | 'perf'      // 07 性能
  | 'a11y'      // 08 可访问
  | 'compat';   // 09 兼容

export const TAG_META: Record<TagCategory, { id: string; cn: string; en: string; hex: string; ink: string }> = {
  visual:   { id: '01', cn: '视觉',  en: 'VISUAL',  hex: '#f0ff00', ink: '#0a0a0a' },
  motion:   { id: '02', cn: '动效',  en: 'MOTION',  hex: '#ff3da5', ink: '#0a0a0a' },
  type:     { id: '03', cn: '字体',  en: 'TYPE',    hex: '#00e5ff', ink: '#0a0a0a' },
  color:    { id: '04', cn: '颜色',  en: 'COLOR',   hex: '#9b00ff', ink: '#f5f1e8' },
  layout:   { id: '05', cn: '布局',  en: 'LAYOUT',  hex: '#f5f1e8', ink: '#0a0a0a' },
  interact: { id: '06', cn: '交互',  en: 'INTERACT',hex: '#ff8800', ink: '#0a0a0a' },
  perf:     { id: '07', cn: '性能',  en: 'PERF',    hex: '#39ff14', ink: '#0a0a0a' },
  a11y:     { id: '08', cn: '可访',  en: 'A11Y',    hex: '#ff6b6b', ink: '#0a0a0a' },
  compat:   { id: '09', cn: '兼容',  en: 'COMPAT',  hex: '#4d9fff', ink: '#0a0a0a' },
};

export const TAG_KEYS = Object.keys(TAG_META) as TagCategory[];

type Size = 'xs' | 'sm' | 'md' | 'lg';
type Variant = 'solid' | 'outline' | 'dot' | 'ghost';

interface Props {
  cat: TagCategory;
  size?: Size;
  variant?: Variant;
  showId?: boolean;
  showEn?: boolean;
  children?: ReactNode;
  className?: string;
}

const SIZE_CLS: Record<Size, string> = {
  xs: 'text-[9px] px-1.5 py-0.5 gap-1',
  sm: 'text-[10px] px-2 py-1 gap-1.5',
  md: 'text-xs px-2.5 py-1.5 gap-2',
  lg: 'text-sm px-3 py-2 gap-2',
};

export function Tag({ cat, size = 'sm', variant = 'solid', showId = false, showEn = false, children, className = '' }: Props) {
  const m = TAG_META[cat];
  const base = `inline-flex items-center font-mono font-bold uppercase tracking-wider border-2 leading-none transition-transform hover:-translate-y-0.5 ${SIZE_CLS[size]} ${className}`;

  if (variant === 'dot') {
    return (
      <span
        className={`${base} bg-ink`}
        style={{ borderColor: m.hex, color: m.hex }}
        title={`${m.cn} / ${m.en}`}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.hex }} />
        {showId && <span className="opacity-50">{m.id}</span>}
        <span>{children ?? m.cn}</span>
        {showEn && <span className="opacity-50">{m.en}</span>}
      </span>
    );
  }

  if (variant === 'outline') {
    return (
      <span
        className={base}
        style={{ borderColor: m.hex, color: m.hex, backgroundColor: 'transparent' }}
        title={`${m.cn} / ${m.en}`}
      >
        {showId && <span className="opacity-70">{m.id}</span>}
        <span>{children ?? m.cn}</span>
        {showEn && <span className="opacity-50">{m.en}</span>}
      </span>
    );
  }

  if (variant === 'ghost') {
    return (
      <span
        className={`${base} border-transparent`}
        style={{ color: m.hex }}
        title={`${m.cn} / ${m.en}`}
      >
        {showId && <span className="opacity-50">{m.id}</span>}
        <span>{children ?? m.cn}</span>
      </span>
    );
  }

  // solid (default)
  return (
    <span
      className={base}
      style={{ backgroundColor: m.hex, color: m.ink, borderColor: m.hex }}
      title={`${m.cn} / ${m.en}`}
    >
      {showId && <span className="opacity-60">{m.id}</span>}
      <span>{children ?? m.cn}</span>
      {showEn && <span className="opacity-60">{m.en}</span>}
    </span>
  );
}

// 标签条 — 一次显示 9 类目色板概览
export function TagLegend({ size = 'xs' }: { size?: Size }) {
  return (
    <div className="flex flex-wrap gap-1">
      {TAG_KEYS.map(k => (
        <Tag key={k} cat={k} size={size} showId />
      ))}
    </div>
  );
}
