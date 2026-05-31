import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TERMINAL_COMMANDS, WARP_COMMAND_SUGGESTIONS } from '@/utils/apps'
import {
  Plus,
  X,
  Search,
  ChevronRight,
  Clock,
  Folder,
  Sparkles,
} from 'lucide-react'

interface CommandBlock {
  id: string
  command: string
  output: string
  timestamp: Date
  duration: number
  status: 'success' | 'error'
}

interface Tab {
  id: string
  title: string
  blocks: CommandBlock[]
  history: string[]
}

export function WarpTerminal() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: 'tab-1',
      title: 'main',
      blocks: [],
      history: [],
    },
  ])
  const [activeTabId, setActiveTabId] = useState('tab-1')
  const [currentInput, setCurrentInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [paletteQuery, setPaletteQuery] = useState('')
  const [showWelcome, setShowWelcome] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [activeTab.blocks])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault()
        setShowCommandPalette(true)
        setPaletteQuery('')
      }
      if (e.key === 'Escape') {
        setShowCommandPalette(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const executeCommand = useCallback(
    (input: string) => {
      const trimmed = input.trim()
      if (!trimmed) return

      const startTime = Date.now()
      const parts = trimmed.split(/\s+/)
      const cmd = parts[0].toLowerCase()
      const args = parts.slice(1)

      let output = ''
      let status: 'success' | 'error' = 'success'

      if (cmd === 'clear') {
        setTabs((prev) =>
          prev.map((t) =>
            t.id === activeTabId ? { ...t, blocks: [] } : t
          )
        )
        setShowWelcome(false)
        return
      }

      const handler = TERMINAL_COMMANDS[cmd]
      if (handler) {
        output = handler(args)
      } else {
        output = `warp: command not found: ${cmd}\n输入 help 查看可用命令`
        status = 'error'
      }

      const block: CommandBlock = {
        id: `block-${Date.now()}`,
        command: trimmed,
        output,
        timestamp: new Date(),
        duration: Date.now() - startTime,
        status,
      }

      setTabs((prev) =>
        prev.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                blocks: [...t.blocks, block],
                history: [trimmed, ...t.history],
              }
            : t
        )
      )
      setShowWelcome(false)
    },
    [activeTabId]
  )

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setHistoryIndex(-1)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < activeTab.history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(activeTab.history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(activeTab.history[newIndex])
      } else {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
      e.preventDefault()
      setShowCommandPalette(true)
      setPaletteQuery('')
    }
  }

  const addTab = () => {
    const newTab: Tab = {
      id: `tab-${Date.now()}`,
      title: `tab ${tabs.length + 1}`,
      blocks: [],
      history: [],
    }
    setTabs([...tabs, newTab])
    setActiveTabId(newTab.id)
    setShowWelcome(true)
  }

  const closeTab = (id: string) => {
    if (tabs.length <= 1) return
    const newTabs = tabs.filter((t) => t.id !== id)
    setTabs(newTabs)
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id)
    }
  }

  const filteredSuggestions = WARP_COMMAND_SUGGESTIONS.filter((s) =>
    s.toLowerCase().includes(paletteQuery.toLowerCase())
  )

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

  return (
    <div className="flex flex-col h-full bg-[#05050b] font-['JetBrains_Mono',monospace]">
      <div className="flex items-center h-9 bg-[#0a0a14] border-b border-[#1a1a2e] px-2 shrink-0">
        <div className="flex items-center gap-0.5 flex-1 overflow-x-auto">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-t-lg text-[11px] cursor-pointer
                transition-colors group max-w-[140px]
                ${tab.id === activeTabId
                  ? 'bg-[#05050b] text-white/80 border-t border-x border-[#1a1a2e]'
                  : 'text-white/30 hover:text-white/50 hover:bg-white/[0.03]'
                }`}
              onClick={() => { setActiveTabId(tab.id); setShowWelcome(tab.blocks.length === 0) }}
            >
              <span className="truncate">{tab.title}</span>
              {tabs.length > 1 && (
                <button
                  className="opacity-0 group-hover:opacity-100 hover:text-white/70 transition-opacity"
                  onClick={(e) => { e.stopPropagation(); closeTab(tab.id) }}
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}
          <button
            className="p-1 rounded hover:bg-white/[0.06] text-white/20 hover:text-white/40 transition-colors"
            onClick={addTab}
          >
            <Plus size={12} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            className="p-1.5 rounded-md hover:bg-white/[0.06] text-white/25 hover:text-white/50 transition-colors"
            onClick={() => { setShowCommandPalette(true); setPaletteQuery('') }}
            title="命令面板 (Ctrl+P)"
          >
            <Search size={13} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 overflow-auto px-4 py-3 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {showWelcome && activeTab.blocks.length === 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#01a4ff] to-[#7b61ff] flex items-center justify-center">
                <Sparkles size={12} className="text-white" />
              </div>
              <span className="text-sm font-medium text-white/70">Warp Terminal</span>
            </div>
            <div className="text-[12px] text-white/25 space-y-1 ml-8">
              <p>ConceptOS 内置 Warp 风格终端</p>
              <p>输入 help 查看可用命令 · Ctrl+P 打开命令面板</p>
            </div>
            <div className="mt-4 ml-8 flex flex-wrap gap-1.5">
              {WARP_COMMAND_SUGGESTIONS.slice(0, 8).map((cmd) => (
                <button
                  key={cmd}
                  className="px-2 py-0.5 rounded-md bg-[#01a4ff]/[0.06] border border-[#01a4ff]/10
                    text-[11px] text-[#01a4ff]/60 hover:bg-[#01a4ff]/[0.1] hover:text-[#01a4ff]/80
                    transition-colors"
                  onClick={() => {
                    setCurrentInput(cmd)
                    inputRef.current?.focus()
                  }}
                >
                  {cmd}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab.blocks.map((block) => (
          <div key={block.id} className="mb-3">
            <div className="flex items-start gap-2 group">
              <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                <ChevronRight
                  size={12}
                  className={block.status === 'success' ? 'text-[#01a4ff]' : 'text-red-400'}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] text-white/90 font-medium">{block.command}</span>
                  <span className="text-[10px] text-white/15 opacity-0 group-hover:opacity-100 transition-opacity">
                    {formatTime(block.timestamp)} · {block.duration}ms
                  </span>
                </div>
                {block.output && (
                  <div className="mt-1 text-[12px] text-white/40 whitespace-pre-wrap leading-relaxed">
                    {block.output}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <ChevronRight size={12} className="text-[#01a4ff]" />
            <Folder size={11} className="text-[#01a4ff]/50" />
            <span className="text-[11px] text-[#01a4ff]/50">~</span>
          </div>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-[13px] text-white/90 outline-none caret-[#01a4ff]"
              autoFocus
              spellCheck={false}
              placeholder="输入命令..."
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between h-7 px-3 bg-[#0a0a14] border-t border-[#1a1a2e] text-[10px] text-white/20 shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            已连接
          </span>
          <span>user@concept</span>
          <span>~</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Clock size={9} />
            {new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>Warp v1.0</span>
        </div>
      </div>

      <AnimatePresence>
        {showCommandPalette && (
          <motion.div
            className="absolute inset-0 z-50 flex items-start justify-center pt-[15%]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
          >
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCommandPalette(false)}
            />
            <motion.div
              className="relative w-full max-w-lg bg-[#0f0f1a] border border-[#1a1a2e] rounded-xl
                shadow-2xl shadow-black/50 overflow-hidden"
              initial={{ y: -20, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: -20, scale: 0.96 }}
              transition={{ duration: 0.15, ease: [0.32, 0.72, 0, 1] }}
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1a1a2e]">
                <Search size={14} className="text-[#01a4ff]/50" />
                <input
                  type="text"
                  value={paletteQuery}
                  onChange={(e) => setPaletteQuery(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-white/80 outline-none placeholder:text-white/20"
                  placeholder="搜索命令..."
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setShowCommandPalette(false)
                    if (e.key === 'Enter' && filteredSuggestions.length > 0) {
                      executeCommand(filteredSuggestions[0])
                      setShowCommandPalette(false)
                      setCurrentInput('')
                    }
                  }}
                />
                <kbd className="px-1.5 py-0.5 rounded bg-white/[0.04] text-[10px] text-white/20 border border-white/[0.06]">
                  ESC
                </kbd>
              </div>

              <div className="max-h-[300px] overflow-auto py-1">
                {filteredSuggestions.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-white/20">
                    未找到匹配命令
                  </div>
                ) : (
                  filteredSuggestions.map((cmd, i) => (
                    <button
                      key={cmd}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-left transition-colors
                        ${i === 0 ? 'bg-[#01a4ff]/[0.06] text-white/80' : 'text-white/40 hover:bg-white/[0.03] hover:text-white/60'}`}
                      onClick={() => {
                        executeCommand(cmd)
                        setShowCommandPalette(false)
                        setCurrentInput('')
                      }}
                    >
                      <ChevronRight size={11} className={i === 0 ? 'text-[#01a4ff]' : 'text-white/15'} />
                      <span className="text-[12px] font-mono">{cmd}</span>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
