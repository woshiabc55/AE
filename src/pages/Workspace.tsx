import { Link } from 'react-router-dom'
import { Cpu, BookOpen } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'
import FileUploader from '@/components/FileUploader'
import ColorPanel from '@/components/ColorPanel'

export default function Workspace() {
  return (
    <div className="h-screen flex flex-col bg-[#0a0a0f] text-zinc-200 overflow-hidden">
      <header className="flex items-center justify-between px-4 py-2 border-b border-zinc-800/80 bg-[#0d0d14]/90 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#00ff88]" />
            <span className="text-lg font-bold tracking-wider font-mono text-[#00ff88]">
              C3<span className="text-[#ff0066]">.</span>studio
            </span>
          </div>
          <span className="text-[10px] text-zinc-600 font-mono border border-zinc-800 rounded px-1.5 py-0.5">
            v0.1
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <span className="text-xs text-zinc-400 font-mono border-b border-[#00ff88] pb-0.5">
            工作台
          </span>
          <Link
            to="/skills"
            className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-[#00ff88] font-mono transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            技能库
          </Link>
        </nav>
      </header>

      <main className="flex-1 flex min-h-0">
        <aside className="w-64 border-r border-zinc-800/60 p-3 flex flex-col gap-3 shrink-0">
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">素材</div>
          <div className="flex-1 min-h-0">
            <FileUploader />
          </div>
        </aside>

        <section className="flex-1 min-w-0 p-3">
          <CodeEditor />
        </section>

        <aside className="w-72 border-l border-zinc-800/60 p-3 flex flex-col shrink-0">
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2">
            预览
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto">
            <ColorPanel />
          </div>
        </aside>
      </main>

      <footer className="flex items-center justify-between px-4 py-1 border-t border-zinc-800/60 bg-[#0d0d14]/90 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff88] animate-pulse" />
            <span className="text-[10px] text-zinc-600 font-mono">READY</span>
          </div>
        </div>
        <span className="text-[10px] text-zinc-700 font-mono">PID Language Runtime</span>
      </footer>
    </div>
  )
}
