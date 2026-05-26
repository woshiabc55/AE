import { useState, useRef, useEffect } from 'react'
import { Sparkles, Zap, Circle } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import type { Entry, EntryState } from '@/types'

const STATE_CONFIG: Record<EntryState, { label: string; icon: typeof Circle; color: string; glow: string; border: string }> = {
  idle: {
    label: '静止',
    icon: Circle,
    color: 'text-zinc-500',
    glow: '',
    border: 'border-zinc-700',
  },
  active: {
    label: '激活',
    icon: Zap,
    color: 'text-[#00ff88]',
    glow: 'shadow-[0_0_12px_rgba(0,255,136,0.3)]',
    border: 'border-[#00ff88]/40',
  },
  particle: {
    label: '粒子',
    icon: Sparkles,
    color: 'text-[#ff0066]',
    glow: 'shadow-[0_0_16px_rgba(255,0,102,0.4)]',
    border: 'border-[#ff0066]/40',
  },
}

const ENTRY_COLORS = ['#00ff88', '#ff0066', '#00ccff', '#ffaa00', '#ff44cc', '#44ffcc', '#88ff44', '#ff8844']

interface EntryItemProps {
  entry: Entry
  onStateChange: (id: string, state: EntryState) => void
  onRemove: (id: string) => void
  onPositionChange: (id: string, x: number, y: number) => void
}

function EntryItem({ entry, onStateChange, onRemove, onPositionChange }: EntryItemProps) {
  const config = STATE_CONFIG[entry.state]
  const [isDragging, setIsDragging] = useState(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const entryRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isDragging) return
    const handleMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x
      const dy = e.clientY - dragStart.current.y
      onPositionChange(entry.id, entry.x + dx, entry.y + dy)
      dragStart.current = { x: e.clientX, y: e.clientY }
    }
    const handleUp = () => setIsDragging(false)
    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', handleUp)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', handleUp)
    }
  }, [isDragging, entry.id, entry.x, entry.y, onPositionChange])

  const cycleState = () => {
    const states: EntryState[] = ['idle', 'active', 'particle']
    const nextIdx = (states.indexOf(entry.state) + 1) % states.length
    onStateChange(entry.id, states[nextIdx])
  }

  return (
    <div
      ref={entryRef}
      className={`absolute group cursor-move select-none ${config.glow}`}
      style={{ left: entry.x, top: entry.y }}
      onMouseDown={(e) => {
        setIsDragging(true)
        dragStart.current = { x: e.clientX, y: e.clientY }
        e.stopPropagation()
      }}
    >
      <div
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0d0d14]/90 backdrop-blur-sm border ${config.border} transition-all duration-300`}
      >
        <div
          className="w-2 h-2 rounded-full shrink-0"
          style={{ backgroundColor: entry.color }}
        />
        <span className="text-xs font-mono text-zinc-300 whitespace-nowrap max-w-[120px] truncate">
          {entry.text}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation()
            cycleState()
          }}
          className={`ml-1 p-0.5 rounded transition-colors ${config.color} hover:bg-zinc-800`}
          title={`状态: ${config.label} (点击切换)`}
        >
          <config.icon className="w-3 h-3" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove(entry.id)
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-zinc-600 hover:text-[#ff0066] transition-all"
        >
          ×
        </button>
      </div>
      {entry.state === 'particle' && (
        <div className="absolute -inset-1 rounded-xl border border-[#ff0066]/20 animate-pulse pointer-events-none" />
      )}
      {entry.state === 'active' && (
        <div className="absolute -inset-1 rounded-xl border border-[#00ff88]/20 pointer-events-none" />
      )}
    </div>
  )
}

const DEFAULT_ENTRIES: Omit<Entry, 'id'>[] = [
  { text: 'extractColors', state: 'idle', color: '#00ff88', x: 20, y: 20, particleCount: 30 },
  { text: 'syncVideo', state: 'idle', color: '#ff0066', x: 20, y: 60, particleCount: 25 },
  { text: 'overclock', state: 'idle', color: '#00ccff', x: 20, y: 100, particleCount: 35 },
  { text: 'gradientMesh', state: 'idle', color: '#ffaa00', x: 20, y: 140, particleCount: 20 },
  { text: 'colorPulse', state: 'idle', color: '#ff44cc', x: 20, y: 180, particleCount: 28 },
  { text: 'frameDiff', state: 'idle', color: '#44ffcc', x: 20, y: 220, particleCount: 22 },
]

export default function EntryBoard() {
  const { entries, addEntry, updateEntryState, removeEntry, updateEntryPosition } = useAppStore()

  const handleAdd = () => {
    const colorIdx = entries.length % ENTRY_COLORS.length
    const words = ['transform', 'render', 'compute', 'analyze', 'generate', 'process', 'decode', 'encode', 'stream', 'capture']
    const text = words[Math.floor(Math.random() * words.length)]
    addEntry({
      text,
      state: 'idle',
      color: ENTRY_COLORS[colorIdx],
      x: 20 + Math.random() * 100,
      y: 20 + entries.length * 40,
      particleCount: 15 + Math.floor(Math.random() * 25),
    })
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-zinc-600 font-mono uppercase tracking-widest">词条画板</span>
        <button
          onClick={handleAdd}
          className="text-[10px] text-zinc-500 hover:text-[#00ff88] font-mono transition-colors border border-zinc-800 hover:border-[#00ff88]/30 rounded px-1.5 py-0.5"
        >
          + 词条
        </button>
      </div>

      <div className="flex-1 min-h-0 relative rounded-lg border border-zinc-800/60 bg-[#080810] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(#00ff88 1px, transparent 1px), linear-gradient(90deg, #00ff88 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }} />

        {entries.map((entry) => (
          <EntryItem
            key={entry.id}
            entry={entry}
            onStateChange={updateEntryState}
            onRemove={removeEntry}
            onPositionChange={updateEntryPosition}
          />
        ))}

        {entries.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[10px] text-zinc-700 font-mono">点击 + 词条 添加</p>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-[9px] text-zinc-600 font-mono">
        <span className="flex items-center gap-1">
          <Circle className="w-2 h-2 text-zinc-500" /> 静止
        </span>
        <span className="flex items-center gap-1">
          <Zap className="w-2 h-2 text-[#00ff88]" /> 激活
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-2 h-2 text-[#ff0066]" /> 粒子
        </span>
      </div>
    </div>
  )
}
