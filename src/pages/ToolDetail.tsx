import { Link, useParams } from 'react-router-dom';
import { findTool, CATEGORIES, tools } from '../data/tools';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { highlight } from '../lib/highlight';

export default function ToolDetail() {
  const { slug } = useParams();
  const tool = slug ? findTool(slug) : undefined;
  const [copied, setCopied] = useState(false);

  if (!tool) {
    return (
      <div className="max-w-[1400px] mx-auto px-6 py-32 text-center">
        <div className="font-display text-6xl font-black mb-4">404</div>
        <div className="font-mono text-bone/60">工具不存在 / TOOL NOT FOUND</div>
        <Link to="/" className="inline-block mt-6 px-4 py-2 bg-volt text-ink font-mono font-bold">← 返回首页</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === tool.category)!;
  const copy = async () => {
    await navigator.clipboard.writeText(tool.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <Link to="/" className="inline-flex items-center gap-2 text-sm font-mono text-bone/60 hover:text-volt mb-6">
        <ArrowLeft size={16} /> 返回 / BACK TO GRID
      </Link>

      <div className="grid lg:grid-cols-[1fr_400px] gap-8">
        {/* PREVIEW */}
        <div>
          <div className="flex items-start justify-between mb-3 flex-wrap gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 bg-volt text-ink text-[10px] font-mono uppercase font-bold">{cat.cn}</span>
                {tool.tags.map(t => (
                  <span key={t} className="text-[10px] font-mono px-1.5 py-0.5 border border-bone/30 text-bone/60">#{t}</span>
                ))}
              </div>
              <h1 className="font-display text-4xl md:text-5xl font-black leading-none">{tool.name}</h1>
              <p className="text-bone/70 mt-3 max-w-2xl">{tool.description}</p>
            </div>
            <div className="font-mono text-[10px] text-bone/40 text-right">
              <div>SLUG: {tool.slug}</div>
              <div>DATE: {tool.createdAt}</div>
            </div>
          </div>
          <div className="aspect-[16/10] border-2 border-bone/30 relative overflow-hidden">
            <tool.Preview />
          </div>
        </div>

        {/* CODE */}
        <div className="border-2 border-bone/30 flex flex-col">
          <div className="flex items-center justify-between p-3 border-b-2 border-bone/30 bg-ink">
            <span className="font-mono text-xs text-bone/60">SOURCE.HTML</span>
            <button
              onClick={copy}
              className="flex items-center gap-2 px-3 py-1.5 bg-bone text-ink font-mono text-xs font-bold hover:bg-volt transition-colors"
            >
              {copied ? <><Check size={14}/> 已复制</> : <><Copy size={14}/> 复制代码</>}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-auto max-h-[60vh] leading-relaxed">
            <code dangerouslySetInnerHTML={{ __html: highlight(tool.code) }} />
          </pre>
        </div>
      </div>

      <RelatedTools current={tool.slug} />
    </div>
  );
}

function RelatedTools({ current }: { current: string }) {
  const related = tools.filter(t => t.slug !== current).slice(0, 4);
  return (
    <div className="mt-16 border-t-2 border-bone/20 pt-8">
      <div className="font-mono text-xs text-bone/60 mb-4">更多工具 / MORE TOOLS</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((t) => (
          <Link key={t.slug} to={`/tool/${t.slug}`} className="border-2 border-bone/20 hover:border-volt group">
            <div className="aspect-[4/3] overflow-hidden border-b-2 border-bone/20">
              <t.Preview />
            </div>
            <div className="p-2 font-mono text-xs">{t.name}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
