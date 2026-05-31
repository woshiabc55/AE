import { useState } from 'react'
import { FilePlus, Save, Minus, Plus } from 'lucide-react'

const SAMPLE_CODE = `import React from 'react'

interface Props {
  title: string
  count: number
}

const Counter: React.FC<Props> = ({ title, count }) => {
  return (
    <div className="counter">
      <h2>{title}</h2>
      <p>Count: {count}</p>
    </div>
  )
}

export default Counter`

export function TextEditor() {
  const [content, setContent] = useState(SAMPLE_CODE)
  const [fontSize, setFontSize] = useState(13)

  const lines = content.split('\n')

  return (
    <div className="flex flex-col h-full bg-[#0d1117]">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-white/[0.06]">
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/50
            hover:bg-white/[0.06] hover:text-white/70 transition-colors"
        >
          <FilePlus size={12} />
          新建
        </button>
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-md text-[11px] text-white/50
            hover:bg-white/[0.06] hover:text-white/70 transition-colors"
        >
          <Save size={12} />
          保存
        </button>
        <div className="flex-1" />
        <button
          className="p-1 rounded text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
        >
          <Minus size={12} />
        </button>
        <span className="text-[10px] text-white/30 w-8 text-center">{fontSize}</span>
        <button
          className="p-1 rounded text-white/30 hover:text-white/60 hover:bg-white/[0.06] transition-colors"
          onClick={() => setFontSize(Math.min(20, fontSize + 1))}
        >
          <Plus size={12} />
        </button>
      </div>

      <div className="flex-1 overflow-auto flex">
        <div className="py-3 px-2 text-right select-none border-r border-white/[0.04] shrink-0">
          {lines.map((_, i) => (
            <div
              key={i}
              className="text-[11px] text-white/15 leading-relaxed"
              style={{ fontSize: fontSize - 2 }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 bg-transparent text-white/70 p-3 outline-none resize-none
            font-mono leading-relaxed caret-blue-400"
          style={{ fontSize }}
          spellCheck={false}
        />
      </div>
    </div>
  )
}
