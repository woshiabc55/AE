import { useState, useMemo, useCallback } from 'react';
import { svgTemplates, generateSvg, type SvgTemplate, type SvgParam } from '@/data/svgTemplates';
import { Code, Eye, Download, Palette, SlidersHorizontal } from 'lucide-react';

export default function SvgWorkshop() {
  const [selectedId, setSelectedId] = useState(svgTemplates[0].id);
  const [paramValues, setParamValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    svgTemplates.forEach((t) => t.params.forEach((p) => { init[p.key] = p.default; }));
    return init;
  });
  const [customCode, setCustomCode] = useState('');
  const [mode, setMode] = useState<'template' | 'custom'>('template');

  const selectedTemplate = svgTemplates.find((t) => t.id === selectedId)!;

  const generatedSvg = useMemo(() => {
    if (mode === 'custom') return customCode;
    return generateSvg(selectedTemplate, paramValues);
  }, [mode, customCode, selectedTemplate, paramValues]);

  const handleParamChange = useCallback((key: string, value: number) => {
    setParamValues((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleDownloadSvg = useCallback(() => {
    const blob = new Blob([generatedSvg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.id || 'custom'}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }, [generatedSvg, selectedTemplate.id]);

  const handleTemplateSelect = useCallback((t: SvgTemplate) => {
    setSelectedId(t.id);
    setMode('template');
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#1a1a1a] bg-white/80 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Palette size={14} className="text-[#1a3a6b]" />
          <span className="font-mono-cn text-xs tracking-wider">SVG图形工坊</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('template')}
            className={`px-2 py-1 text-[10px] font-mono-cn border transition-all cursor-pointer ${mode === 'template' ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'border-[#d0d0d0] hover:border-[#1a3a6b]'}`}
          >
            模板模式
          </button>
          <button
            onClick={() => setMode('custom')}
            className={`px-2 py-1 text-[10px] font-mono-cn border transition-all cursor-pointer ${mode === 'custom' ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]' : 'border-[#d0d0d0] hover:border-[#1a3a6b]'}`}
          >
            自定义代码
          </button>
          <button
            onClick={handleDownloadSvg}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all cursor-pointer"
          >
            <Download size={10} />
            导出SVG
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        {mode === 'template' && (
          <div className="w-48 border-r border-[#d0d0d0] bg-[#faf8f5] overflow-y-auto scrollbar-thin shrink-0">
            <div className="p-2">
              <span className="font-mono-cn text-[9px] text-[#909090] px-2">模板库 / TEMPLATES</span>
            </div>
            {svgTemplates.map((t) => (
              <button
                key={t.id}
                onClick={() => handleTemplateSelect(t)}
                className={`w-full text-left px-3 py-2 text-[11px] transition-all cursor-pointer border-b border-[#f0f0f0] ${
                  selectedId === t.id ? 'bg-[#1a3a6b] text-white' : 'text-[#1a1a1a] hover:bg-[#f0f0f0]'
                }`}
              >
                <div className="font-bold">{t.name}</div>
                <div className={`text-[9px] mt-0.5 ${selectedId === t.id ? 'text-[#a8c8e8]' : 'text-[#909090]'}`}>
                  {t.description}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 flex min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            {mode === 'template' && (
              <div className="border-b border-[#d0d0d0] px-4 py-3 bg-white/50 shrink-0">
                <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal size={12} className="text-[#1a3a6b]" />
                  <span className="font-mono-cn text-[10px] text-[#606060]">参数调整 / PARAMETERS</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {selectedTemplate.params.map((p: SvgParam) => (
                    <div key={p.key} className="flex items-center gap-2">
                      <label className="font-mono-cn text-[10px] text-[#606060] w-16">{p.label}</label>
                      <input
                        type="range"
                        min={p.min}
                        max={p.max}
                        step={p.step}
                        value={paramValues[p.key] ?? p.default}
                        onChange={(e) => handleParamChange(p.key, Number(e.target.value))}
                        className="w-24 h-1 accent-[#1a3a6b]"
                      />
                      <span className="font-mono-cn text-[10px] text-[#1a3a6b] w-8 text-right">
                        {paramValues[p.key] ?? p.default}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 flex min-h-0">
              <div className="flex-1 relative min-w-0">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  <Code size={10} className="text-[#909090]" />
                  <span className="font-mono-cn text-[9px] text-[#909090]">SVG代码</span>
                </div>
                <textarea
                  value={generatedSvg}
                  onChange={(e) => {
                    if (mode === 'custom') setCustomCode(e.target.value);
                  }}
                  readOnly={mode === 'template'}
                  className={`w-full h-full p-4 pt-7 font-mono-cn text-[11px] leading-[1.7] bg-[#faf8f5] text-[#1a1a1a] resize-none outline-none border-none ${mode === 'template' ? 'cursor-default' : ''}`}
                  spellCheck={false}
                />
              </div>
              <div className="w-px bg-[#d0d0d0] shrink-0" />
              <div className="flex-1 relative min-w-0 bg-white">
                <div className="absolute top-2 left-2 z-10 flex items-center gap-1">
                  <Eye size={10} className="text-[#909090]" />
                  <span className="font-mono-cn text-[9px] text-[#909090]">实时预览</span>
                </div>
                <div className="w-full h-full p-4 pt-7 overflow-auto flex items-center justify-center">
                  <div
                    className="max-w-full max-h-full"
                    dangerouslySetInnerHTML={{ __html: generatedSvg }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
