import { usePresentationStore } from '@/store/presentation'
import SlideToolbar from '@/components/slide/SlideToolbar'
import SlidePreview from '@/components/slide/SlidePreview'
import SlideCanvas from '@/components/slide/SlideCanvas'

export default function SlideApp() {
  const { presentation } = usePresentationStore()

  return (
    <div className="flex flex-col h-full">
      <SlideToolbar />
      <div className="flex flex-1 overflow-hidden">
        <SlidePreview />
        <SlideCanvas />
      </div>
      <div className="bg-[#9F1239] text-[#fecdd3] text-xs py-1.5 px-4 flex justify-end gap-4">
        <span>幻灯片: <strong className="text-white">{presentation.slides.length}</strong></span>
        <span>当前: <strong className="text-white">{presentation.activeSlideIndex + 1}</strong></span>
      </div>
    </div>
  )
}
