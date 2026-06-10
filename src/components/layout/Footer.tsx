import { Link } from 'react-router-dom';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/10 bg-ink-900/60 px-6 py-8">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2 text-cream-200/40">
          <Film size={14} strokeWidth={1.5} />
          <span className="font-mono text-xs tracking-wider">PROMPTSTAGE · © 2026 · 幕境创作工坊</span>
        </div>
        <div className="flex items-center gap-6 font-mono text-xs text-cream-200/40">
          <Link to="/templates" className="hover:text-gold-500">模板广场</Link>
          <Link to="/scripts" className="hover:text-gold-500">我的剧本</Link>
          <Link to="/settings" className="hover:text-gold-500">设置</Link>
        </div>
      </div>
    </footer>
  );
}
