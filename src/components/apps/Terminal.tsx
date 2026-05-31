import { useState, useRef, useEffect, useCallback } from 'react'
import { TERMINAL_COMMANDS } from '@/utils/apps'

interface TerminalLine {
  type: 'input' | 'output'
  content: string
}

export function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: 'ConceptOS Terminal v1.0.0' },
    { type: 'output', content: '输入 help 查看可用命令\n' },
  ])
  const [currentInput, setCurrentInput] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const executeCommand = useCallback((input: string) => {
    const trimmed = input.trim()
    if (!trimmed) return

    const parts = trimmed.split(/\s+/)
    const cmd = parts[0].toLowerCase()
    const args = parts.slice(1)

    const newLines: TerminalLine[] = [
      { type: 'input', content: trimmed },
    ]

    if (cmd === 'clear') {
      setLines([])
      return
    }

    const handler = TERMINAL_COMMANDS[cmd]
    if (handler) {
      const output = handler(args)
      if (output) {
        newLines.push({ type: 'output', content: output })
      }
    } else {
      newLines.push({
        type: 'output',
        content: `command not found: ${cmd}. 输入 help 查看可用命令`,
      })
    }

    setLines((prev) => [...prev, ...newLines])
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput)
      setHistory((prev) => [currentInput, ...prev])
      setHistoryIndex(-1)
      setCurrentInput('')
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(history[newIndex])
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(history[newIndex])
      } else {
        setHistoryIndex(-1)
        setCurrentInput('')
      }
    }
  }

  return (
    <div
      className="h-full bg-[#0a0a0f] font-mono text-[13px] flex flex-col cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      <div ref={scrollRef} className="flex-1 overflow-auto p-3 space-y-0.5">
        {lines.map((line, i) => (
          <div key={i} className="leading-relaxed">
            {line.type === 'input' ? (
              <div className="flex items-start gap-2">
                <span className="text-emerald-400 shrink-0">user@concept:~$</span>
                <span className="text-white/80">{line.content}</span>
              </div>
            ) : (
              <div className="text-white/50 whitespace-pre-wrap">{line.content}</div>
            )}
          </div>
        ))}

        <div className="flex items-start gap-2">
          <span className="text-emerald-400 shrink-0">user@concept:~$</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full bg-transparent text-white/80 outline-none caret-emerald-400"
              autoFocus
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
