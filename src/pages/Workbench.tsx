import { useState, useRef } from 'react';
import { WpsToolbar } from '../components/WpsToolbar';
import { StoryboardTableCard } from '../components/StoryboardTableCard';
import { ChatPanel } from '../components/ChatPanel';
import { SettingsPanel } from '../components/SettingsPanel';
import { useProjectStore, computeCoverage } from '../store/projectStore';
import { tablesToMarkdown, downloadFile, copyToClipboard } from '../utils/markdown';
import { extractTimecodes } from '../utils/timecode';
import { mockGenerate } from '../utils/aiService';
import { Loader2, FileDown, Clipboard, Sparkles, RotateCcw, Film, FileText } from 'lucide-react';

export default function Workbench() {
  const title = useProjectStore((s) => s.title);
  const setTitle = useProjectStore((s) => s.setTitle);
  const totalDuration = useProjectStore((s) => s.totalDuration);
  const rawText = useProjectStore((s) => s.rawText);
  const setRawText = useProjectStore((s) => s.setRawText);
  const tables = useProjectStore((s) => s.tables);
  const updateTick = useProjectStore((s) => s.updateTick);
  const updateTableTitle = useProjectStore((s) => s.updateTableTitle);
  const selectedTableId = useProjectStore((s) => s.selectedTableId);
  const setSelectedTable = useProjectStore((s) => s.setSelectedTable);
  const resetAll = useProjectStore((s) => s.resetAll);
  const loadExample = useProjectStore((s) => s.loadExample);
  const replaceTables = useProjectStore((s) => s.replaceTables);
  const pushChat = useProjectStore((s) => s.pushChat);
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    const id = Date.now();
    setToast({ msg, id });
    setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 2200);
  };

  const coverage = computeCoverage(tables);
  const slice = totalDuration / tables.length;
  const tickSpan = slice / 16;
  const tcs = extractTimecodes(rawText);

  const onExportMd = () => {
    const md = tablesToMarkdown(tables, totalDuration, title);
    downloadFile(`${title || 'storyboard'}.md`, md, 'text/markdown');
    showToast('已下载 Markdown');
  };

  const onExportJson = () => {
    downloadFile(`${title || 'storyboard'}.json`, JSON.stringify({ title, totalDuration, tables, rawText }, null, 2), 'application/json');
    showToast('已下载 JSON 备份');
  };

  const onCopyMd = async () => {
    const md = tablesToMarkdown(tables, totalDuration, title);
    const ok = await copyToClipboard(md);
    showToast(ok ? 'Markdown 已复制' : '复制失败');
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setRawText(text);
    showToast(`已载入 ${f.name}`);
    e.target.value = '';
  };

  const onMock = () => {
    setBusy(true);
    setTimeout(() => {
      const next = mockGenerate({ prompt: rawText, template: 'cameraman', totalDurationSec: totalDuration });
      replaceTables(next);
      if (!selectedTableId) setSelectedTable(next[0].id);
      pushChat({ role: 'assistant', content: `已根据当前文本生成 8 表格（Mock 模式）。` });
      showToast('已生成 8 表格');
      setBusy(false);
    }, 250);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col bg-ink-950">
      {/* 顶部状态栏 */}
      <header className="shrink-0 h-12 border-b border-ink-500/60 bg-ink-900/70 backdrop-blur-sm px-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-amber-glow/15 border border-amber-glow/50 flex items-center justify-center">
            <Film size={14} className="text-amber-glow" />
          </div>
          <div>
            <div className="font-serif text-bone-50 text-sm tracking-wider">STORYBOARD FORGE</div>
            <div className="font-mono text-[9px] text-bone-300/40 -mt-0.5 tracking-[0.25em]">8 TABLES · 16 TICKS</div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3 ml-3 text-[11px] font-mono text-bone-300/60">
          <span>总时长 <span className="text-amber-glow">{totalDuration}s</span></span>
          <span className="text-bone-300/20">·</span>
          <span>每镜 <span className="text-amber-glow">{slice.toFixed(2)}s</span></span>
          <span className="text-bone-300/20">·</span>
          <span>刻度 <span className="text-amber-glow">{tickSpan.toFixed(3)}s</span></span>
          <span className="text-bone-300/20">·</span>
          <span>覆盖 <span className="text-amber-glow">{coverage.filled}/{coverage.total}</span></span>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={onCopyMd} className="pill" title="复制 Markdown"><Clipboard size={12} /> 复制</button>
          <button onClick={onExportMd} className="pill" title="下载 Markdown"><FileDown size={12} /> MD</button>
          <button onClick={onExportJson} className="pill" title="下载 JSON 备份"><FileText size={12} /> JSON</button>
          <span className="w-px h-5 bg-ink-500 mx-1" />
          <SettingsPanel onToast={showToast} />
        </div>
      </header>

      {/* 主体三栏 */}
      <main className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-0">
        {/* 左：输入 + WPS */}
        <section className="border-r border-ink-500/40 p-4 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between">
            <h2 className="panel-title text-sm">脚本 / 创意文本</h2>
            <div className="flex gap-1.5">
              <button onClick={loadExample} className="pill" title="载入示例 · 安史之乱 25s">
                <Sparkles size={12} /> 示例
              </button>
              <button onClick={() => fileRef.current?.click()} className="pill" title="打开 .txt / .md">
                <FileText size={12} /> 打开
              </button>
              <input ref={fileRef} type="file" accept=".txt,.md,.markdown" hidden onChange={onFile} />
              <button
                onClick={resetAll}
                className="pill hover:border-blood/60 hover:text-blood"
                title="重置"
              >
                <RotateCcw size={12} /> 重置
              </button>
            </div>
          </div>

          <textarea
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            placeholder="在此粘贴你的脚本 / 创意描述 / 概念设计文本…  WPS 工具栏支持字数统计、繁简转换、Markdown↔纯文本、时间码提取。"
            className="flex-1 min-h-0 bg-ink-900/60 border border-ink-500/60 rounded-md p-3
                       text-sm leading-relaxed text-bone-100 placeholder:text-bone-300/30
                       focus:outline-none focus:border-amber-glow/50 resize-none
                       scrollbar-stealth"
          />

          <WpsToolbar text={rawText} onChange={setRawText} onToast={showToast} />

          {tcs.length > 0 && (
            <div className="text-[10px] font-mono text-bone-300/60 px-1 leading-relaxed">
              <span className="text-amber-glow/80">▍ 检测到时间码：</span>
              {tcs.slice(0, 12).join(' · ')}
              {tcs.length > 12 ? ` … +${tcs.length - 12}` : ''}
            </div>
          )}

          <button
            onClick={onMock}
            disabled={busy}
            className="mt-1 w-full py-2 rounded border border-amber-glow/50 bg-amber-glow/10
                       text-amber-glow hover:bg-amber-glow/20 text-xs font-mono
                       flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {busy ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
            一键生成 8 表格（Mock）
          </button>
        </section>

        {/* 中：8 表格 */}
        <section className="min-h-0 overflow-y-auto scrollbar-stealth p-4 space-y-3 bg-ink-950/40">
          <div className="flex items-center justify-between sticky top-0 z-10 -mt-4 -mx-4 px-4 py-3 bg-ink-950/80 backdrop-blur-sm border-b border-ink-500/40">
            <div className="flex items-center gap-3">
              <h2 className="panel-title text-sm">分镜时间表</h2>
              <span className="font-mono text-[10px] text-bone-300/40">
                选中：{tables.find((t) => t.id === selectedTableId)?.title || '—'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-40 h-1.5 rounded-full bg-ink-700 overflow-hidden">
                <div
                  className="h-full bg-amber-glow transition-all"
                  style={{ width: `${(coverage.filled / Math.max(coverage.total, 1)) * 100}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-bone-300/50">
                {Math.round((coverage.filled / Math.max(coverage.total, 1)) * 100)}%
              </span>
            </div>
          </div>

          {tables.map((tb, i) => (
            <StoryboardTableCard
              key={tb.id}
              table={tb}
              index={i + 1}
              isSelected={tb.id === selectedTableId}
              onSelect={() => setSelectedTable(tb.id === selectedTableId ? null : tb.id)}
              onUpdateTick={(idx, patch) => updateTick(tb.id, idx, patch)}
              onUpdateTitle={(t) => updateTableTitle(tb.id, t)}
              delayMs={i * 60}
            />
          ))}
        </section>

        {/* 右：AI 对话 */}
        <section className="border-l border-ink-500/40 p-4 min-h-0">
          <ChatPanel onToast={showToast} />
        </section>
      </main>

      {/* Toast */}
      {toast && (
        <div
          key={toast.id}
          className="fixed bottom-6 right-6 z-50 panel px-4 py-2.5 flex items-center gap-2
                     text-sm animate-fade-up shadow-film-grain"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-amber-glow animate-cursor-blink" />
          <span className="text-bone-100">{toast.msg}</span>
        </div>
      )}

      {/* 背景胶片孔装饰 */}
      <div className="pointer-events-none fixed left-0 top-12 bottom-0 w-2 film-strip opacity-30" />
      <div className="pointer-events-none fixed right-0 top-12 bottom-0 w-2 film-strip opacity-30" />
    </div>
  );
}
