import { useEffect, useRef, useCallback } from 'react'
import Editor from '@monaco-editor/react'
import { useAppStore } from '@/store/useAppStore'

export default function CodeEditor() {
  const { scriptCode, setScriptCode } = useAppStore()
  const editorRef = useRef<any>(null)

  const handleEditorMount = useCallback((editor: any) => {
    editorRef.current = editor
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  return (
    <div className="h-full flex flex-col rounded-lg overflow-hidden border border-zinc-800 bg-[#0d0d14]">
      <div className="flex items-center gap-2 px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <span className="text-[10px] text-zinc-500 font-mono ml-2">script.pid</span>
      </div>
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language="javascript"
          theme="vs-dark"
          value={scriptCode}
          onChange={(v) => setScriptCode(v || '')}
          onMount={handleEditorMount}
          options={{
            fontSize: 13,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            padding: { top: 8 },
            wordWrap: 'on',
            tabSize: 2,
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  )
}
