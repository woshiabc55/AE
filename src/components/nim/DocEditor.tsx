import { useState, useCallback } from 'react';
import { FileText, Download, Copy, Check, AlignLeft, Hash } from 'lucide-react';

const TEMPLATES = [
  {
    id: "blank",
    name: "空白文档",
    content: "",
  },
  {
    id: "prompt-structured",
    name: "结构化提示词",
    content: `## 核心主体 / SUBJECT\n\n[描述核心视觉对象及其几何属性]\n\n## 纹饰层 / PATTERN\n\n[描述文化符号系统及其与本体几何的映射关系]\n\n## 风格层 / STYLE\n\n[描述整体美学倾向和色彩体系]\n\n## 构图层 / COMPOSITION\n\n[描述空间布局和信息架构]\n\n## 浮动层 / FLOATING\n\n[描述动态注释元素和UI碎片]\n\n## 文字层 / TYPOGRAPHY\n\n[描述标题、标签和辅助文字的排版规则]\n\n## 装饰层 / DECORATION\n\n[描述角括号、圆点、边框等视觉标点]\n\n## 反向提示词 / NEGATIVE\n\n[排除不期望出现的视觉元素]`,
  },
  {
    id: "prompt-7layer",
    name: "7层递进法模板",
    content: `L1 本体层 / SUBJECT LAYER\n━━━━━━━━━━━━━━━━━━━━\n对象：\n几何：\n投影：\n\nL2 纹饰层 / PATTERN LAYER\n━━━━━━━━━━━━━━━━━━━━\n纹饰类型：\n色彩域：\n映射规则：\n\nL3 风格层 / STYLE LAYER\n━━━━━━━━━━━━━━━━━━━━\n美学倾向：\n色彩体系：\n对比度：\n\nL4 构图层 / COMPOSITION LAYER\n━━━━━━━━━━━━━━━━━━━━\n布局类型：\n网格系统：\n焦点位置：\n\nL5 浮动层 / FLOATING LAYER\n━━━━━━━━━━━━━━━━━━━━\n标签元素：\nUI碎片：\n交互暗示：\n\nL6 文字层 / TYPOGRAPHY LAYER\n━━━━━━━━━━━━━━━━━━━━\n主标题：\n副标题：\n辅助文字：\n\nL7 装饰层 / DECORATION LAYER\n━━━━━━━━━━━━━━━━━━━━\n角括号：\n圆点：\n边框：`,
  },
  {
    id: "concept-note",
    name: "概念设计笔记",
    content: `# 概念设计笔记\n\n## 项目名称\n\n## 设计哲学\n\n## 方法论\n\n## 色彩理论\n\n## 空间逻辑\n\n## 文化编码\n\n## 可扩展性\n\n## 备注`,
  },
];

export default function DocEditor() {
  const [content, setContent] = useState(TEMPLATES[1].content);
  const [copied, setCopied] = useState(false);

  const charCount = content.length;
  const wordCount = content.split(/\s+/).filter(Boolean).length;
  const lineCount = content.split('\n').length;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback */ }
  }, [content]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'prompt-document.txt';
    a.click();
    URL.revokeObjectURL(url);
  }, [content]);

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-[#1a1a1a] bg-white/80 px-4 py-2 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-[#1a3a6b]" />
          <span className="font-mono-cn text-xs tracking-wider">文档编辑器</span>
        </div>
        <div className="flex items-center gap-2">
          <select
            className="text-[10px] font-mono-cn border border-[#d0d0d0] px-2 py-1 bg-white"
            onChange={(e) => {
              const t = TEMPLATES.find((t) => t.id === e.target.value);
              if (t) setContent(t.content);
            }}
            value=""
          >
            <option value="">插入模板...</option>
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#1a1a1a] hover:bg-[#1a3a6b] hover:text-white hover:border-[#1a3a6b] transition-all cursor-pointer"
          >
            {copied ? <Check size={10} /> : <Copy size={10} />}
            {copied ? '已复制' : '复制'}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1 px-2 py-1 text-[10px] font-mono-cn border border-[#1a3a6b] text-[#1a3a6b] hover:bg-[#1a3a6b] hover:text-white transition-all cursor-pointer"
          >
            <Download size={10} />
            导出TXT
          </button>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 font-mono-cn text-[13px] leading-[1.8] bg-[#faf8f5] text-[#1a1a1a] resize-none outline-none border-none"
            placeholder="在此编写提示词文档..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className="border-t border-[#d0d0d0] bg-white px-4 py-2 flex items-center gap-4 font-mono-cn text-[10px] text-[#909090] shrink-0">
        <span className="inline-flex items-center gap-1"><AlignLeft size={10} /> 行: {lineCount}</span>
        <span className="inline-flex items-center gap-1"><Hash size={10} /> 字符: {charCount}</span>
        <span>词: ~{wordCount}</span>
        <span>·</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}
