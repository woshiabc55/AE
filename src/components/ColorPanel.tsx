import { useEffect, useRef, useCallback, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { extractColorsFromImage, loadImageToCanvas, extractFrameFromVideo } from '@/utils/colorExtractor'
import type { ColorBlock, ExtractedFrame } from '@/types'

export default function ColorPanel() {
  const {
    uploadedFiles,
    selectedFileId,
    extractedColors,
    setExtractedColors,
    videoSyncEnabled,
    setVideoSyncEnabled,
    captureFrequency,
    setCaptureFrequency,
    frameTimeline,
    setFrameTimeline,
    addFrame,
  } = useAppStore()

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const captureTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const selectedFile = uploadedFiles.find((f) => f.id === selectedFileId)

  const processImage = useCallback(async (file: File) => {
    try {
      const { imageData } = await loadImageToCanvas(file)
      const colors = extractColorsFromImage(imageData, 12)
      setExtractedColors(colors)
    } catch (err) {
      console.error('Image processing failed:', err)
    }
  }, [setExtractedColors])

  const syncVideo = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = 160
    canvas.height = 90

    const tick = () => {
      if (video.paused || video.ended) return
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractColorsFromImage(imageData, 8)
      setExtractedColors(colors)
      animRef.current = requestAnimationFrame(tick)
    }

    animRef.current = requestAnimationFrame(tick)
  }, [setExtractedColors])

  const startOverclockCapture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = 160
    canvas.height = 90
    const interval = 1000 / captureFrequency

    const capture = () => {
      if (video.paused || video.ended) return
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const thumbnail = canvas.toDataURL('image/jpeg', 0.3)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const colors = extractColorsFromImage(imageData, 5)
      const frame: ExtractedFrame = {
        timestamp: video.currentTime,
        colorBlocks: colors,
        thumbnail,
      }
      addFrame(frame)
    }

    captureTimerRef.current = setInterval(capture, interval)
  }, [captureFrequency, addFrame])

  useEffect(() => {
    if (!selectedFile) {
      setExtractedColors([])
      return
    }

    if (selectedFile.type === 'image') {
      processImage(selectedFile.file)
    }
  }, [selectedFile, processImage, setExtractedColors])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !selectedFile || selectedFile.type !== 'video') return

    const handlePlay = () => {
      setIsPlaying(true)
      if (videoSyncEnabled) syncVideo()
      startOverclockCapture()
    }
    const handlePause = () => {
      setIsPlaying(false)
      cancelAnimationFrame(animRef.current)
      if (captureTimerRef.current) clearInterval(captureTimerRef.current)
    }
    const handleEnded = () => {
      setIsPlaying(false)
      cancelAnimationFrame(animRef.current)
      if (captureTimerRef.current) clearInterval(captureTimerRef.current)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      cancelAnimationFrame(animRef.current)
      if (captureTimerRef.current) clearInterval(captureTimerRef.current)
    }
  }, [selectedFile, videoSyncEnabled, syncVideo, startOverclockCapture])

  const handleVideoLoaded = () => {
    if (videoRef.current && selectedFile?.type === 'video') {
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = 160
        canvas.height = 90
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const colors = extractColorsFromImage(imageData, 8)
        setExtractedColors(colors)
      }
    }
  }

  return (
    <div className="flex flex-col gap-3 h-full">
      {selectedFile?.type === 'video' && (
        <div className="space-y-2">
          <video
            ref={videoRef}
            src={selectedFile.url}
            controls
            className="w-full rounded-lg border border-zinc-800 bg-black"
            onLoadedData={handleVideoLoaded}
          />
          <canvas ref={canvasRef} className="hidden" />

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <div
                className={`w-8 h-4 rounded-full transition-all duration-300 ${
                  videoSyncEnabled ? 'bg-[#00ff88]' : 'bg-zinc-700'
                }`}
                onClick={() => setVideoSyncEnabled(!videoSyncEnabled)}
              >
                <div
                  className={`w-3 h-3 rounded-full bg-white transition-transform duration-300 mt-0.5 ${
                    videoSyncEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </div>
              <span className="text-xs text-zinc-400 font-mono">视频同步</span>
            </label>

            <div className="flex items-center gap-2 ml-auto">
              <span className="text-[10px] text-zinc-600 font-mono">频率</span>
              <input
                type="range"
                min={1}
                max={30}
                value={captureFrequency}
                onChange={(e) => setCaptureFrequency(Number(e.target.value))}
                className="w-16 h-1 accent-[#00ff88]"
              />
              <span className="text-[10px] text-[#00ff88] font-mono w-8">{captureFrequency}fps</span>
            </div>
          </div>
        </div>
      )}

      {selectedFile?.type === 'image' && (
        <div className="rounded-lg border border-zinc-800 overflow-hidden">
          <img
            src={selectedFile.url}
            alt={selectedFile.name}
            className="w-full object-contain max-h-40 bg-black"
          />
        </div>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-500 font-mono">色块提取</span>
          <span className="text-[10px] text-zinc-600 font-mono">{extractedColors.length} colors</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {extractedColors.map((color, i) => (
            <div key={i} className="group relative">
              <div
                className="aspect-square rounded-md transition-all duration-300 hover:scale-110 hover:shadow-[0_0_12px_rgba(0,255,136,0.3)] cursor-pointer"
                style={{ backgroundColor: color.hex }}
              />
              <div className="absolute -bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[8px] text-zinc-500 font-mono">{color.hex}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {extractedColors.length > 0 && (
        <div className="space-y-1">
          <span className="text-xs text-zinc-500 font-mono">色块条</span>
          <div className="flex h-6 rounded-md overflow-hidden border border-zinc-800">
            {extractedColors.map((color, i) => (
              <div
                key={i}
                className="transition-all duration-500 hover:flex-[2] cursor-pointer"
                style={{
                  backgroundColor: color.hex,
                  flex: color.percentage,
                }}
              />
            ))}
          </div>
        </div>
      )}

      {frameTimeline.length > 0 && (
        <div className="space-y-1.5 flex-1 min-h-0">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">超频截图时间线</span>
            <button
              onClick={() => setFrameTimeline([])}
              className="text-[10px] text-zinc-600 hover:text-[#ff0066] font-mono transition-colors"
            >
              清除
            </button>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-2">
            {frameTimeline.map((frame, i) => (
              <div key={i} className="shrink-0 group">
                <div className="w-14 h-10 rounded border border-zinc-800 overflow-hidden mb-1">
                  <img
                    src={frame.thumbnail}
                    alt={`frame ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex gap-0.5">
                  {frame.colorBlocks.slice(0, 4).map((c, j) => (
                    <div
                      key={j}
                      className="w-3 h-3 rounded-sm"
                      style={{ backgroundColor: c.hex }}
                    />
                  ))}
                </div>
                <span className="text-[8px] text-zinc-600 font-mono">
                  {frame.timestamp.toFixed(1)}s
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedFile && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 mx-auto rounded-full border border-zinc-800 flex items-center justify-center">
              <div className="w-4 h-4 rounded-sm bg-[#00ff88]/20 border border-[#00ff88]/30" />
            </div>
            <p className="text-xs text-zinc-600 font-mono">上传素材以提取色块</p>
          </div>
        </div>
      )}
    </div>
  )
}
