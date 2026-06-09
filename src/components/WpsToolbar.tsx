import { useState } from 'react';
import {
  Type,
  Eraser,
  ArrowLeftRight,
  Sparkles,
  FileText,
  Hash,
  Copy,
  Check,
} from 'lucide-react';
import type { CountMeta } from '../utils/wpsTools';
import {
  countStats,
  cleanText,
  toHalfWidth,
  toFullWidth,
  mdToPlain,
  plainToMd,
  toTraditional,
  toSimplified,
  splitParagraphs,
} from '../utils/wpsTools';
import { extractTimecodes } from '../utils/timecode';

interface Props {
  text: string;
  onChange: (v: string) => void;
  onToast: (msg: string) => void;
}

interface Tool {
  key: string;
  label: string;
  icon: React.ReactNode;
  hint: string;
  run: (t: string) => { result: string; meta?: string };
}

export function WpsToolbar({ text, onChange, onToast }: Props) {
  const [stats, setStats] = useState<CountMeta>(() => countStats(text));
  const [showStats, setShowStats] = useState(false);

  const tools: Tool[] = [
    {
      key: 'count',
      label: '字数',
      icon: <Hash size={12} />,
      hint: '字数 / 段落统计',
      run: (t) => {
        const s = countStats(t);
        setStats(s);
        setShowStats(true);
        return { result: t, meta: `共 ${s.total} 字 · ${s.chinese} 中 · ${s.english} 英 · ${s.lines} 行 · ${s.paragraphs} 段` };
      },
    },
    {
      key: 'clean',
      label: '清洗',
      icon: <Eraser size={12} />,
      hint: '合并空行 / 去除行尾空白 / 统一换行',
      run: (t) => ({ result: cleanText(t), meta: '已清洗' }),
    },
    {
      key: 'half',
      label: '半角',
      icon: <ArrowLeftRight size={12} />,
      hint: '全角 → 半角',
      run: (t) => ({ result: toHalfWidth(t), meta: '已转半角' }),
    },
    {
      key: 'full',
      label: '全角',
      icon: <ArrowLeftRight size={12} />,
      hint: '半角 → 全角',
      run: (t) => ({ result: toFullWidth(t), meta: '已转全角' }),
    },
    {
      key: 't2s',
      label: '简体',
      icon: <Type size={12} />,
      hint: '繁体 → 简体',
      run: (t) => ({ result: toSimplified(t), meta: '已转简体' }),
    },
    {
      key: 's2t',
      label: '繁體',
      icon: <Type size={12} />,
      hint: '简体 → 繁體',
      run: (t) => ({ result: toTraditional(t), meta: '已转繁体' }),
    },
    {
      key: 'md2t',
      label: 'MD→纯',
      icon: <FileText size={12} />,
      hint: 'Markdown → 纯文本',
      run: (t) => ({ result: mdToPlain(t), meta: '已去除标记' }),
    },
    {
      key: 't2md',
      label: '纯→MD',
      icon: <FileText size={12} />,
      hint: '纯文本 → Markdown',
      run: (t) => ({ result: plainToMd(t), meta: '已分段' }),
    },
    {
      key: 'tc',
      label: '时间码',
      icon: <Sparkles size={12} />,
      hint: '提取 00:00:00 时间码',
      run: (t) => {
        const tcs = extractTimecodes(t);
        return { result: tcs.join('\n') || t, meta: `找到 ${tcs.length} 处` };
      },
    },
    {
      key: 'split',
      label: '拆句',
      icon: <Sparkles size={12} />,
      hint: '按句号 / 换行拆分',
      run: (t) => {
        const arr = splitParagraphs(t);
        return { result: arr.join('\n'), meta: `拆为 ${arr.length} 句` };
      },
    },
  ];

  const runTool = (tool: Tool) => {
    const out = tool.run(text);
    if (out.result !== text) onChange(out.result);
    onToast(`${tool.label} · ${out.meta || 'OK'}`);
  };

  const [copied, setCopied] = useState(false);
  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      onToast('已复制到剪贴板');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      onToast('复制失败');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tools.map((t) => (
          <button
            key={t.key}
            onClick={() => runTool(t)}
            title={t.hint}
            className="pill"
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
        <button onClick={copyAll} className="pill ml-auto">
          {copied ? <Check size={12} /> : <Copy size={12} />}
          <span>{copied ? '已复制' : '复制全文'}</span>
        </button>
      </div>
      {showStats && (
        <div className="text-[11px] font-mono text-bone-300/70 px-1 leading-relaxed">
          <span className="text-amber-glow/80">▍</span> {stats.chinese} 中 · {stats.english} 英 · {stats.digits} 数 · {stats.spaces} 空 · {stats.lines} 行 / {stats.paragraphs} 段
        </div>
      )}
    </div>
  );
}
