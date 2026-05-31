import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, LayoutDashboard, BookOpen, Trash2 } from 'lucide-react';
import { usePromptStore } from '@/store/usePromptStore';

export default function Layout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { canvasBlocks, clearCanvas } = usePromptStore();

  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-[#c0c0d0] overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a2e] bg-[#0a0a0f]/90 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#00ffd5]/10 border border-[#00ffd5]/30 flex items-center justify-center shadow-[0_0_10px_rgba(0,255,213,0.15)]">
              <Sparkles size={14} className="text-[#00ffd5]" />
            </div>
            <h1 className="text-sm font-bold tracking-wider text-[#e0e0f0]" style={{ fontFamily: 'Orbitron, sans-serif' }}>
              AI PROMPTER
            </h1>
          </div>

          <div className="flex items-center gap-1 ml-4">
            <button
              onClick={() => navigate('/')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === '/'
                  ? 'bg-[#00ffd5]/10 text-[#00ffd5] border border-[#00ffd5]/20'
                  : 'text-[#6a6a8a] hover:text-[#c0c0d0] hover:bg-[#12121f]'
              }`}
            >
              <LayoutDashboard size={12} /> 工作台
            </button>
            <button
              onClick={() => navigate('/templates')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                location.pathname === '/templates'
                  ? 'bg-[#00ffd5]/10 text-[#00ffd5] border border-[#00ffd5]/20'
                  : 'text-[#6a6a8a] hover:text-[#c0c0d0] hover:bg-[#12121f]'
              }`}
            >
              <BookOpen size={12} /> 模板库
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canvasBlocks.length > 0 && (
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-[#4a4a6a] hover:text-[#f43f5e] hover:bg-[#f43f5e]/10 transition-all"
            >
              <Trash2 size={12} /> 清空画布
            </button>
          )}
          <span className="text-[10px] text-[#3a3a5a]">
            {canvasBlocks.length > 0 ? `${canvasBlocks.length} 个模块` : ''}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  );
}
