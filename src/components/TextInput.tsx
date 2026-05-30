import { useState, useCallback } from 'react'
import { useConceptArtStore, parseTextToParams } from '@/store/conceptArtStore'

export default function TextInput() {
  const [input, setInput] = useState('')
  const setScene = useConceptArtStore((s) => s.setScene)

  const handleApply = useCallback(() => {
    const params = parseTextToParams(input)
    if (Object.keys(params).length > 0) {
      setScene({ ...params, text: input })
    }
  }, [input, setScene])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleApply()
    }
  }, [handleApply])

  return (
    <div className="w-full">
      <label
        className="block mb-1.5 font-medium tracking-wide"
        style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}
      >
        场景描述 / SCENE DESCRIPTION
      </label>
      <div className="flex gap-2">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入关键词：城市、赛博、霓虹、森林、雾、雨、日落..."
          className="flex-1 bg-white/90 border border-gray-200 px-3 py-2 text-gray-800 placeholder-gray-400 resize-none focus:outline-none focus:border-gray-400 transition-colors"
          rows={2}
          style={{ fontSize: '11px', fontFamily: "'Noto Serif SC', serif" }}
        />
        <button
          onClick={handleApply}
          className="px-4 py-2 bg-gray-900 text-white hover:bg-gray-700 transition-colors self-stretch"
          style={{ fontSize: '10px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}
        >
          生成
        </button>
      </div>
      <div
        className="mt-1"
        style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa' }}
      >
        支持：城市/赛博/奇幻/废土/海洋/森林/太空/遗迹 + 氛围/光照/天气关键词 · 回车生成
      </div>
    </div>
  )
}
