import { useState } from 'react'
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react'

const MIAODA_URL = 'https://app-6p5j8eshleyp.appmiaoda.com/?track_id=promolink-8ps30594vh1c'

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [iframeKey, setIframeKey] = useState(0)

  return (
    <div className="h-full flex flex-col">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-50">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-zinc-500">正在加载秒哒平台...</p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-zinc-100">
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400">当前页面：</span>
          <span className="text-xs font-medium text-zinc-600 truncate max-w-[400px]">{MIAODA_URL}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIframeKey((k) => k + 1)}
            className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
            title="刷新页面"
          >
            <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
          </button>
          <a
            href={MIAODA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-md hover:bg-zinc-100 transition-colors"
            title="在浏览器中打开"
          >
            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
          </a>
        </div>
      </div>

      <div className="flex-1 relative">
        <iframe
          key={iframeKey}
          src={MIAODA_URL}
          className="w-full h-full border-0"
          title="秒哒平台"
          onLoad={() => setLoading(false)}
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms allow-top-navigation"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  )
}
