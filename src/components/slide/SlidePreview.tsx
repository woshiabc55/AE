import { usePresentationStore } from '@/store/presentation'
import { Plus, X } from 'lucide-react'

export default function SlidePreview() {
  const { presentation, setActiveSlide, addSlide, deleteSlide } =
    usePresentationStore()

  return (
    <div
      className="w-48 flex flex-col shrink-0"
      style={{
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-subtle)',
      }}
    >
      <div
        className="p-2 flex items-center justify-between"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>幻灯片</span>
        <button
          onClick={addSlide}
          className="p-1 rounded transition-colors"
          style={{ color: 'var(--accent-slide)' }}
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
              className={`w-full relative rounded-lg overflow-hidden border-2 transition-all`}
              style={{
                borderColor: isActive
                  ? 'var(--accent-slide)'
                  : 'var(--border-subtle)',
                boxShadow: isActive
                  ? '0 0 12px var(--glow-slide), 0 0 4px var(--glow-slide)'
                  : 'none',
              }}
            >
              <div
                className="font-mono absolute top-1 left-1 text-[10px] px-1 rounded"
                style={{
                  background: 'var(--bg-overlay)',
                  color: 'var(--text-muted)',
                }}
              >
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
                  className="absolute top-1 right-1 p-0.5 rounded transition-colors"
                  style={{
                    background: 'var(--bg-overlay)',
                    color: '#ff6b6b',
                  }}
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
