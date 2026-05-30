import { useCallback } from 'react'
import { useConceptArtStore } from '@/store/conceptArtStore'

export default function ExportPanel() {
  const scene = useConceptArtStore((s) => s.scene)

  const handleExportPNG = useCallback(() => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const link = document.createElement('a')
    link.download = `concept-${scene.style}-${Date.now()}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }, [scene.style])

  const handleExportParams = useCallback(() => {
    const params = JSON.stringify(scene, null, 2)
    const blob = new Blob([params], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = `concept-${scene.style}-params.json`
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
  }, [scene])

  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={handleExportPNG}
        className="flex-1 px-3 py-2 bg-gray-900 text-white hover:bg-gray-700 transition-colors"
        style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.05em' }}
      >
        导出 PNG
      </button>
      <button
        onClick={handleExportParams}
        className="flex-1 px-3 py-2 border border-gray-300 hover:border-gray-500 transition-colors"
        style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#555' }}
      >
        导出参数
      </button>
    </div>
  )
}
