import { useEffect, useCallback, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Download, RotateCcw, Eye, Edit3, Clock } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { findNodeById } from '@/data/weiyang';
import { useAppStore, saveContent, getSavedContent } from '@/store/useAppStore';

export default function DocEditor() {
  const { nodeId } = useParams<{ nodeId: string }>();
  const navigate = useNavigate();
  const { editContent, isDirty, lastSaved, setEditContent, markSaved, resetEdit } = useAppStore();
  const [showPreview, setShowPreview] = useState(true);
  const [saveNotice, setSaveNotice] = useState(false);

  const nodeData = nodeId ? findNodeById(nodeId) : null;

  useEffect(() => {
    if (!nodeId) return;
    resetEdit();
    const saved = getSavedContent(nodeId);
    if (saved !== null) {
      setEditContent(saved);
    } else if (nodeData) {
      setEditContent(nodeData.section.content);
    }
  }, [nodeId]);

  useEffect(() => {
    if (!isDirty || !nodeId) return;
    const timer = setTimeout(() => {
      saveContent(nodeId, editContent);
      markSaved();
      setSaveNotice(true);
      setTimeout(() => setSaveNotice(false), 2000);
    }, 1500);
    return () => clearTimeout(timer);
  }, [editContent, isDirty, nodeId]);

  const handleExport = useCallback(() => {
    if (!nodeData || !nodeId) return;
    const blob = new Blob([editContent], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${nodeData.section.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }, [editContent, nodeData, nodeId]);

  const handleReset = useCallback(() => {
    if (!nodeData) return;
    setEditContent(nodeData.section.content);
  }, [nodeData]);

  if (!nodeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-loess-400 font-serif text-lg">节点未找到</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-vermilion-400 hover:text-vermilion-300 text-sm"
          >
            返回框架图
          </button>
        </div>
      </div>
    );
  }

  const { dimension, section } = nodeData;

  return (
    <div className="min-h-screen relative noise-overlay paper-texture">
      <div className="relative z-10 flex flex-col h-screen">
        <EditorToolbar
          dimension={dimension}
          section={section}
          isDirty={isDirty}
          lastSaved={lastSaved}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onBack={() => navigate('/')}
          onSave={() => {
            if (nodeId) {
              saveContent(nodeId, editContent);
              markSaved();
              setSaveNotice(true);
              setTimeout(() => setSaveNotice(false), 2000);
            }
          }}
          onExport={handleExport}
          onReset={handleReset}
        />

        <div className="flex-1 flex overflow-hidden">
          <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col border-r border-loess-800/20`}>
            <div className="px-4 py-2 border-b border-loess-800/20 flex items-center justify-between">
              <span className="text-loess-500 text-xs font-serif flex items-center gap-1.5">
                <Edit3 size={12} />
                编辑
              </span>
              <span className="text-loess-600 text-[10px]">
                {editContent.length} 字
              </span>
            </div>
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="flex-1 w-full bg-transparent text-loess-200 font-mono text-sm leading-relaxed p-4 resize-none focus:outline-none placeholder:text-loess-700"
              placeholder="在此输入Markdown内容..."
              spellCheck={false}
            />
          </div>

          {showPreview && (
            <div className="w-1/2 flex flex-col bg-ink-900/40">
              <div className="px-4 py-2 border-b border-loess-800/20 flex items-center gap-1.5">
                <Eye size={12} className="text-loess-500" />
                <span className="text-loess-500 text-xs font-serif">预览</span>
              </div>
              <div className="flex-1 overflow-y-auto p-6 markdown-preview">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {editContent}
                </ReactMarkdown>
              </div>
            </div>
          )}
        </div>

        <MetaDataBar section={section} dimension={dimension} />

        {saveNotice && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-bamboo-600/80 text-loess-50 px-4 py-1.5 rounded-full text-xs font-serif animate-fade-in z-50">
            已自动保存
          </div>
        )}
      </div>
    </div>
  );
}

interface ToolbarProps {
  dimension: { title: string; color: string };
  section: { title: string };
  isDirty: boolean;
  lastSaved: string | null;
  showPreview: boolean;
  onTogglePreview: () => void;
  onBack: () => void;
  onSave: () => void;
  onExport: () => void;
  onReset: () => void;
}

function EditorToolbar({
  dimension, section, isDirty, lastSaved, showPreview,
  onTogglePreview, onBack, onSave, onExport, onReset,
}: ToolbarProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-b border-loess-800/30 bg-ink-800/60">
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-loess-400 hover:text-loess-200 transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          <span className="font-serif text-xs">框架图</span>
        </button>
        <div className="w-px h-4 bg-loess-800/40" />
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: dimension.color }}
          />
          <span className="text-loess-500 text-[10px] font-serif">{dimension.title}</span>
        </div>
        <div className="w-px h-4 bg-loess-800/40" />
        <h2 className="font-serif text-sm text-loess-200">{section.title}</h2>
        {isDirty && (
          <span className="w-1.5 h-1.5 rounded-full bg-vermilion-500 animate-pulse" />
        )}
      </div>

      <div className="flex items-center gap-1">
        {lastSaved && (
          <span className="text-loess-600 text-[10px] mr-2 flex items-center gap-1">
            <Clock size={10} />
            {new Date(lastSaved).toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
        <ToolbarButton onClick={onTogglePreview} title={showPreview ? '隐藏预览' : '显示预览'}>
          <Eye size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={onReset} title="重置为原始内容">
          <RotateCcw size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={onSave} title="保存">
          <Save size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={onExport} title="导出MD文件">
          <Download size={14} />
        </ToolbarButton>
      </div>
    </div>
  );
}

function ToolbarButton({ onClick, title, children }: { onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-md flex items-center justify-center text-loess-400 hover:text-loess-200 hover:bg-ink-700/60 transition-all duration-200"
    >
      {children}
    </button>
  );
}

interface MetaBarProps {
  section: { timeMarker?: string; spaceScene?: string; coreFigure?: string; materialImagery?: string };
  dimension: { title: string; color: string };
}

function MetaDataBar({ section, dimension }: MetaBarProps) {
  const tags: { label: string; value: string }[] = [];
  if (section.timeMarker) tags.push({ label: '时间', value: section.timeMarker });
  if (section.spaceScene) tags.push({ label: '空间', value: section.spaceScene });
  if (section.coreFigure) tags.push({ label: '人物', value: section.coreFigure });
  if (section.materialImagery) tags.push({ label: '物性', value: section.materialImagery });

  if (tags.length === 0) return null;

  return (
    <div className="px-4 py-2 border-t border-loess-800/20 bg-ink-800/40 flex items-center gap-3 overflow-x-auto">
      <span className="text-loess-600 text-[10px] font-serif shrink-0">元数据</span>
      <div className="w-px h-3 bg-loess-800/30 shrink-0" />
      {tags.map((tag) => (
        <div key={tag.label} className="flex items-center gap-1.5 shrink-0">
          <span className="text-loess-600 text-[10px]">{tag.label}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-serif"
            style={{
              backgroundColor: dimension.color + '15',
              color: dimension.color,
              border: `1px solid ${dimension.color}25`,
            }}
          >
            {tag.value}
          </span>
        </div>
      ))}
    </div>
  );
}
