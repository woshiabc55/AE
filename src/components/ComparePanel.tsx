import { PromptScheme } from '@/data/schemes';
import { Hash, Palette, Layout, Layers, Type, Grid3x3 } from 'lucide-react';

const iconMap: Record<string, React.ReactNode> = {
  style: <Palette size={14} />,
  palette: <Hash size={14} />,
  composition: <Layout size={14} />,
  depth: <Layers size={14} />,
  text: <Type size={14} />,
  decoration: <Grid3x3 size={14} />,
};

interface ComparePanelProps {
  schemeA: PromptScheme;
  schemeB: PromptScheme;
}

export default function ComparePanel({ schemeA, schemeB }: ComparePanelProps) {
  const paramKeys: { key: keyof PromptScheme['params']; label: string }[] = [
    { key: 'style', label: '风格' },
    { key: 'palette', label: '色彩' },
    { key: 'composition', label: '构图' },
    { key: 'depth', label: '深度' },
    { key: 'text', label: '文字' },
    { key: 'decoration', label: '装饰' },
  ];

  return (
    <div className="paper-card p-0 overflow-hidden">
      <div className="border-b border-[#1a1a1a] px-4 py-3 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#1a3a6b]" />
        <span className="font-mono-cn text-xs tracking-wider">参数对比 / PARAMETER COMPARISON</span>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[#f0f0f0]">
            <th className="text-left px-4 py-2 font-mono-cn text-xs font-medium text-[#606060] w-16">维度</th>
            <th className="text-left px-4 py-2 font-mono-cn text-xs font-medium text-[#1a3a6b]">方案 A</th>
            <th className="text-left px-4 py-2 font-mono-cn text-xs font-medium text-[#1a3a6b]">方案 B</th>
          </tr>
        </thead>
        <tbody>
          {paramKeys.map(({ key, label }, i) => (
            <tr
              key={key}
              className={i % 2 === 0 ? 'bg-white' : 'bg-[#faf8f5]'}
            >
              <td className="px-4 py-3 font-mono-cn text-xs text-[#606060] align-top">
                <span className="inline-flex items-center gap-1">
                  {iconMap[key]}
                  {label}
                </span>
              </td>
              <td className="px-4 py-3 text-xs leading-relaxed align-top">
                {schemeA.params[key]}
              </td>
              <td className="px-4 py-3 text-xs leading-relaxed align-top">
                {schemeB.params[key]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
