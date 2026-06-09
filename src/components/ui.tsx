// 共用 UI 组件库
import { motion } from 'framer-motion';
import {
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  type ReactNode,
  forwardRef,
  useState,
  useEffect,
} from 'react';
import { Search, X, Check, Copy, ChevronDown } from 'lucide-react';
import { cn, compactNumber } from '../lib/utils';
import { useApp } from '../store/useApp';

// ============================================================
// Button
// ============================================================
type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline-amber';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

const variantClass: Record<Variant, string> = {
  primary:
    'bg-[var(--amber-2)] text-[var(--ink-0)] hover:bg-[var(--amber-1)] active:bg-[var(--amber-3)] font-medium',
  secondary:
    'bg-[var(--ink-3)] text-[var(--paper-0)] hover:bg-[var(--ink-4)] active:bg-[var(--ink-5)]',
  ghost: 'bg-transparent text-[var(--paper-1)] hover:bg-[var(--ink-3)]',
  'outline-amber':
    'bg-transparent text-[var(--amber-1)] border border-[var(--amber-2)] hover:bg-[rgba(232,177,74,0.08)]',
  danger: 'bg-[var(--vermilion)] text-white hover:opacity-90',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[15px] gap-2',
};

export function Button({
  variant = 'secondary',
  size = 'md',
  loading,
  icon,
  iconRight,
  className,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-[6px] transition-all press-down whitespace-nowrap select-none',
        'disabled:opacity-50 disabled:pointer-events-none',
        variantClass[variant],
        sizeClass[size],
        className
      )}
    >
      {loading ? (
        <span className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon}
      {children}
      {!loading && iconRight}
    </button>
  );
}

// ============================================================
// IconButton
// ============================================================
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'ghost' | 'amber' | 'vermilion' | 'outline';
  size?: 'sm' | 'md';
  title?: string;
}

export function IconButton({ icon, variant = 'ghost', size = 'md', className, title, ...rest }: IconButtonProps) {
  const colorClass = {
    ghost: 'text-[var(--paper-2)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-3)]',
    amber: 'text-[var(--amber-1)] hover:bg-[rgba(232,177,74,0.1)]',
    vermilion: 'text-[var(--vermilion)] hover:bg-[var(--vermilion-soft)]',
    outline: 'text-[var(--paper-1)] border border-[var(--ink-4)] hover:border-[var(--ink-5)] hover:bg-[var(--ink-3)]',
  }[variant];

  const sizeCls = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  return (
    <button
      title={title}
      {...rest}
      className={cn('inline-flex items-center justify-center rounded-[6px] transition-colors', sizeCls, colorClass, className)}
    >
      {icon}
    </button>
  );
}

// ============================================================
// Input / Textarea
// ============================================================
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  hint?: string;
  prefix?: ReactNode;
  suffix?: ReactNode;
  containerClassName?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, hint, prefix, suffix, className, containerClassName, id, ...rest },
  ref
) {
  const inputId = id ?? `i_${Math.random().toString(36).slice(2, 8)}`;
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="block text-[12px] font-medium text-[var(--paper-2)] tracking-wide">
          {label}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-3)] pointer-events-none">{prefix}</span>
        )}
        <input
          id={inputId}
          ref={ref}
          {...rest}
          className={cn('input-base', prefix && 'pl-9', suffix && 'pr-9', className)}
        />
        {suffix && <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>}
      </div>
      {hint && <p className="text-[11px] text-[var(--paper-3)]">{hint}</p>}
    </div>
  );
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  containerClassName?: string;
  showCount?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, hint, className, containerClassName, showCount, value, maxLength, ...rest },
  ref
) {
  const val = String(value ?? '');
  return (
    <div className={cn('space-y-1.5', containerClassName)}>
      {label && (
        <label className="block text-[12px] font-medium text-[var(--paper-2)] tracking-wide">{label}</label>
      )}
      <textarea
        ref={ref}
        value={value}
        maxLength={maxLength}
        {...rest}
        className={cn('input-base', className)}
      />
      {(hint || showCount) && (
        <div className="flex justify-between text-[11px] text-[var(--paper-3)]">
          <span>{hint}</span>
          {showCount && (
            <span>
              {val.length}
              {maxLength ? ` / ${maxLength}` : ''}
            </span>
          )}
        </div>
      )}
    </div>
  );
});

// ============================================================
// Select
// ============================================================
interface SelectProps {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  label?: string;
}

export function Select({ value, onChange, options, placeholder, className, label }: SelectProps) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {label && <label className="block text-[12px] font-medium text-[var(--paper-2)] tracking-wide">{label}</label>}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-base appearance-none pr-9 cursor-pointer"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-[var(--ink-2)] text-[var(--paper-0)]">
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--paper-3)] pointer-events-none"
        />
      </div>
    </div>
  );
}

// ============================================================
// Badge
// ============================================================
export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: ReactNode;
  variant?: 'default' | 'amber' | 'teal' | 'vermilion';
  className?: string;
}) {
  const map = {
    default: 'tag',
    amber: 'tag tag-amber',
    teal: 'tag tag-teal',
    vermilion: 'tag tag-vermilion',
  };
  return <span className={cn(map[variant], className)}>{children}</span>;
}

// ============================================================
// SearchInput
// ============================================================
export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="relative w-full max-w-md">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--paper-3)]" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? '搜索模板、标签、作者…'}
        className="input-base pl-9 pr-9"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--paper-1)] hover:bg-[var(--ink-3)]"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

// ============================================================
// Card
// ============================================================
export function Card({
  children,
  className,
  hoverable = false,
  padding = 'md',
}: {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}) {
  const p = { none: '', sm: 'p-4', md: 'p-5', lg: 'p-6' }[padding];
  return (
    <div
      className={cn(
        'rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)]',
        hoverable && 'card-hover',
        p,
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================================
// CoverArt - 程序化封面
// ============================================================
export function CoverArt({ seed, category, size = 'md', className }: { seed: string; category: string; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const h = (() => {
    let v = 0;
    for (let i = 0; i < seed.length; i++) v = (v * 31 + seed.charCodeAt(i)) >>> 0;
    return v;
  })();
  const a = h % 360;
  const b = (a + 45) % 360;
  const c = (a + 90) % 360;
  const sizeMap = {
    sm: 'h-24',
    md: 'h-40',
    lg: 'h-56',
    xl: 'aspect-[16/9]',
  };
  const catColor: Record<string, string> = {
    'short-video': '#E8B14A',
    ad: '#C0392B',
    livestream: '#3A8E8E',
    novel: '#A876C8',
    storyboard: '#6FB07F',
    viral: '#FF4D6D',
  };
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-[6px] border border-[var(--ink-4)]', sizeMap[size], className)}
      style={{
        background: `
          radial-gradient(at 18% 20%, hsla(${a}, 60%, 55%, 0.55), transparent 55%),
          radial-gradient(at 82% 30%, hsla(${b}, 60%, 50%, 0.5), transparent 55%),
          radial-gradient(at 50% 95%, hsla(${c}, 55%, 45%, 0.55), transparent 55%),
          linear-gradient(135deg, #0B0B0F 0%, #181820 100%)
        `,
      }}
    >
      {/* 噪点 */}
      <div
        className="absolute inset-0 opacity-30 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.06 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`,
        }}
      />
      {/* 底部装饰：胶片孔 */}
      <div className="absolute bottom-0 left-0 right-0 h-3 flex items-center justify-between px-2 opacity-60">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="w-2.5 h-1.5 rounded-[1px] bg-[var(--ink-0)]" />
        ))}
      </div>
      {/* 类别色条 */}
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ background: catColor[category] ?? '#E8B14A' }}
      />
      {/* 中心字符 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-[60px] display font-bold leading-none" style={{ color: `hsla(${a}, 70%, 70%, 0.25)` }}>
          {seed.slice(0, 1).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FilmStrip - 胶片孔装饰
// ============================================================
export function FilmStrip({ className }: { className?: string }) {
  return (
    <div className={cn('film-strip', className)}>
      {Array.from({ length: 80 }).map((_, i) => (
        <span key={i} className="hole" />
      ))}
    </div>
  );
}

// ============================================================
// Toast
// ============================================================
export function ToastContainer() {
  const { toasts, dismissToast } = useApp();
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => {
        const accent = {
          success: 'var(--amber-2)',
          info: 'var(--teal-2)',
          warn: 'var(--amber-1)',
          error: 'var(--vermilion)',
        }[t.kind];
        return (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40 }}
            className="pointer-events-auto min-w-[280px] max-w-[420px] bg-[var(--ink-3)] border border-[var(--ink-4)] rounded-[8px] pl-3 pr-2 py-2.5 flex items-center gap-3 shadow-[var(--shadow-2)]"
            style={{ borderLeft: `2px solid ${accent}` }}
          >
            <div className="flex-1 text-[13px] text-[var(--paper-0)]">{t.message}</div>
            <button
              onClick={() => dismissToast(t.id)}
              className="w-6 h-6 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-4)]"
            >
              <X size={14} />
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

// ============================================================
// Empty
// ============================================================
export function EmptyState({ title, hint, action, icon }: { title: string; hint?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-full border border-[var(--ink-4)] flex items-center justify-center mb-4 text-[var(--paper-3)]">
          {icon}
        </div>
      )}
      <h3 className="display text-2xl text-[var(--paper-0)] mb-2">{title}</h3>
      {hint && <p className="text-sm text-[var(--paper-2)] max-w-md mb-6">{hint}</p>}
      {action}
    </div>
  );
}

// ============================================================
// 复制到剪贴板按钮
// ============================================================
export function CopyButton({ text, label = '复制', successLabel = '已复制', className }: { text: string; label?: string; successLabel?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch { /* ignore */ }
      }}
      className={cn(
        'inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] text-xs font-medium transition-colors',
        copied
          ? 'bg-[rgba(111,176,127,0.15)] text-[var(--jade)] border border-[rgba(111,176,127,0.3)]'
          : 'bg-[var(--ink-3)] text-[var(--paper-1)] border border-[var(--ink-4)] hover:border-[var(--ink-5)]',
        className
      )}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? successLabel : label}
    </button>
  );
}

// ============================================================
// 类别色条
// ============================================================
export function CategoryTag({ category, withDot = true }: { category: string; withDot?: boolean }) {
  const map: Record<string, string> = {
    'short-video': '短视频',
    ad: '种草广告',
    livestream: '直播口播',
    novel: '小说故事',
    storyboard: '分镜脚本',
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wider uppercase text-[var(--paper-2)]">
      {withDot && <span className={`cat-dot cat-${category}`} />}
      {map[category] ?? category}
    </span>
  );
}

// ============================================================
// 数字紧凑显示
// ============================================================
export function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="space-y-1">
      <div className="mono text-2xl text-[var(--paper-0)] tabular-nums">{compactNumber(value)}</div>
      <div className="eyebrow text-[10px]">{label}</div>
    </div>
  );
}

// ============================================================
// TabBar
// ============================================================
export function TabBar<T extends string>({
  tabs,
  value,
  onChange,
}: {
  tabs: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-[var(--ink-4)]">
      {tabs.map((t) => {
        const active = t.value === value;
        return (
          <button
            key={t.value}
            onClick={() => onChange(t.value)}
            className={cn(
              'relative px-4 h-10 text-[13px] font-medium tracking-wide transition-colors',
              active ? 'text-[var(--paper-0)]' : 'text-[var(--paper-2)] hover:text-[var(--paper-0)]'
            )}
          >
            {t.label}
            {typeof t.count === 'number' && (
              <span className="ml-2 mono text-[10px] text-[var(--paper-3)]">{t.count}</span>
            )}
            {active && (
              <motion.div
                layoutId="tab-underline"
                className="absolute left-2 right-2 -bottom-px h-0.5 bg-[var(--amber-2)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================
// 模态框（轻量）
// ============================================================
export function Modal({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title?: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20 }}
        className="relative w-full max-w-lg bg-[var(--ink-2)] border border-[var(--ink-4)] rounded-[12px] shadow-[var(--shadow-3)] overflow-hidden"
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--ink-4)]">
            <h3 className="display text-lg text-[var(--paper-0)]">{title}</h3>
            <button
              onClick={onClose}
              className="w-7 h-7 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-3)]"
            >
              <X size={16} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </motion.div>
    </div>
  );
}
