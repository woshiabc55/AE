import { useInView } from '@/hooks/useScrollProgress'

export default function EpilogueSection() {
  const { ref, isInView } = useInView(0.2)

  return (
    <section
      ref={ref}
      className="section-container flex items-center justify-center bg-iron-950"
    >
      <div
        className={`relative z-10 text-center px-6 max-w-2xl transition-all duration-[2000ms] ${
          isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="mb-16">
          <div className="inline-block relative">
            <svg
              width="120"
              height="120"
              viewBox="0 0 120 120"
              className="mx-auto mb-8 opacity-40"
            >
              <defs>
                <radialGradient id="shardGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#B0C4B1" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#4A7C59" stopOpacity="0.2" />
                </radialGradient>
              </defs>
              <path
                d="M60 10 L85 40 L95 75 L70 100 L45 95 L25 65 L35 30 Z"
                fill="url(#shardGrad)"
                stroke="#B0C4B1"
                strokeWidth="0.5"
                opacity="0.6"
              />
              <path
                d="M55 25 L65 35 L60 55 L45 45 Z"
                fill="none"
                stroke="#C9A84C"
                strokeWidth="0.3"
                opacity="0.4"
              />
              <path
                d="M70 50 L80 60 L75 80 L60 70 Z"
                fill="none"
                stroke="#5C3A21"
                strokeWidth="0.3"
                opacity="0.4"
              />
            </svg>
          </div>
        </div>

        <p className="story-subtitle text-glaze-50/40 text-lg tracking-[0.5em] mb-6">
          尾声
        </p>

        <h2 className="story-title text-4xl md:text-5xl text-glaze-50/80 mb-8">
          窑火不灭
        </h2>

        <div className="space-y-6">
          <p className="story-body text-glaze-50/50 text-base leading-loose">
            章氏窑火经元外销四海、明奉旨烧造，至清渐熄沉埋，唯残片犹在。
          </p>
          <p className="story-body text-glaze-50/50 text-base leading-loose">
            古人以合烧和解，今人以合烧致敬——同一炉火，跨越千年，烧的是瓷，传的是人。
          </p>
        </div>

        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px w-20 bg-gradient-to-r from-transparent to-celadon-500/40" />
          <span className="text-celadon-400/40 text-xs tracking-[0.5em] font-serif">
            残片犹在
          </span>
          <div className="h-px w-20 bg-gradient-to-l from-transparent to-celadon-500/40" />
        </div>

        <div className="mt-20">
          <p className="story-quote text-2xl md:text-3xl text-gold-400/50 gold-glow tracking-[0.2em]">
            裂痕生光，慢火传灯
          </p>
        </div>

        <div className="mt-24 text-glaze-50/20 text-xs tracking-widest">
          龙泉青瓷 · 双线故事面板
        </div>
      </div>
    </section>
  )
}
