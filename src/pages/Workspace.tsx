import { Link } from 'react-router-dom'
import { Cpu, BookOpen, Layers } from 'lucide-react'
import CodeEditor from '@/components/CodeEditor'
import FileUploader from '@/components/FileUploader'
import ColorPanel from '@/components/ColorPanel'
import ParticleCanvas from '@/components/ParticleCanvas'
import EntryBoard from '@/components/EntryBoard'
import { useAppStore } from '@/store/useAppStore'

export default function Workspace() {
  const { emitCodeDiff, setEmitCodeDiff, emitEntryParticles, setEmitEntryParticles } = useAppStore()

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
            v0.2
          </span>
          <div className="flex items-center gap-2 ml-4">
            <Layers className="w-3 h-3 text-zinc-600" />
            <span className="text-[10px] text-zinc-600 font-mono">二级画板</span>
            <label className="flex items-center gap-1 cursor-pointer">
              <div
                className={`w-6 h-3 rounded-full transition-all duration-300 ${
                  emitCodeDiff ? 'bg-[#00ff88]' : 'bg-zinc-700'
                }`}
                onClick={() => setEmitCodeDiff(!emitCodeDiff)}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 mt-0.5 ${
                    emitCodeDiff ? 'translate-x-3' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-[9px] text-zinc-600 font-mono">代码→粒子</span>
            </label>
            <label className="flex items-center gap-1 cursor-pointer">
              <div
                className={`w-6 h-3 rounded-full transition-all duration-300 ${
                  emitEntryParticles ? 'bg-[#ff0066]' : 'bg-zinc-700'
                }`}
                onClick={() => setEmitEntryParticles(!emitEntryParticles)}
              >
                <div
                  className={`w-2 h-2 rounded-full bg-white transition-transform duration-300 mt-0.5 ${
                    emitEntryParticles ? 'translate-x-3' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-[9px] text-zinc-600 font-mono">词条→粒子</span>
            </label>
          </div>
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

      <main className="flex-1 flex min-h-0 relative">
        <aside className="w-64 border-r border-zinc-800/60 p-3 flex flex-col gap-3 shrink-0">
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">素材</div>
          <div className="flex-1 min-h-0">
            <FileUploader />
          </div>
        </aside>

        <section className="flex-1 min-w-0 p-3 relative">
          <CodeEditor />
          <ParticleCanvas />
        </section>

        <aside className="w-72 border-l border-zinc-800/60 p-3 flex flex-col shrink-0">
          <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2">
            预览
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto space-y-3">
            <ColorPanel />
            <div className="border-t border-zinc-800/40 pt-3">
              <EntryBoard />
            </div>
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
        <span className="text-[10px] text-zinc-700 font-mono">PID Language Runtime · Particle Engine Active</span>
      </footer>
    </div>
  )
}
