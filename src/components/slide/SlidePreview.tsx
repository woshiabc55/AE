import { usePresentationStore } from '@/store/presentation'
import { Plus, X, GripVertical } from 'lucide-react'

export default function SlidePreview() {
  const { presentation, setActiveSlide, addSlide, deleteSlide } =
    usePresentationStore()

  return (
    <div className="w-48 bg-[#f0f4f0] border-r border-[#d4d4d4] flex flex-col shrink-0">
      <div className="p-2 border-b border-[#d4d4d4] flex items-center justify-between">
        <span className="text-xs font-medium text-[#2D3436]">幻灯片</span>
        <button
          onClick={addSlide}
          className="p-1 rounded hover:bg-[#FCE7F3] text-[#9F1239] transition-colors"
          title="新建幻灯片"
        >
          <Plus size={14} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {presentation.slides.map((slide, index) => {
          const isActive = index === presentation.activeSlideIndex
          return (
            <button
              key={slide.id}
              onClick={() => setActiveSlide(index)}
              className={`w-full relative rounded-lg overflow-hidden border-2 transition-all ${
                isActive
                  ? 'border-[#9F1239] shadow-md'
                  : 'border-[#d4d4d4] hover:border-[#bbb]'
              }`}
            >
              <div className="absolute top-1 left-1 text-[10px] text-[#999] font-mono bg-white/80 px-1 rounded">
                {index + 1}
              </div>
              <div
                className="aspect-[16/10] flex items-center justify-center p-2"
                style={{ backgroundColor: slide.background }}
              >
                <div className="w-full space-y-1">
                  {slide.elements.slice(0, 3).map((el) => (
                    <div
                      key={el.id}
                      className="truncate text-[6px] leading-tight"
                      style={{
                        color: el.format.color,
                        fontWeight: el.format.bold ? 'bold' : 'normal',
                        fontStyle: el.format.italic ? 'italic' : 'normal',
                        textAlign: el.format.align,
                      }}
                    >
                      {el.type === 'shape' ? '■' : el.content || '...'}
                    </div>
                  ))}
                </div>
              </div>
              {isActive && presentation.slides.length > 1 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteSlide(slide.id)
                  }}
                  className="absolute top-1 right-1 p-0.5 rounded bg-white/80 hover:bg-[#fde8e8] text-[#c0392b] transition-colors"
                >
                  <X size={10} />
                </button>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
