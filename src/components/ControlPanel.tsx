import { useConceptArtStore, PRESETS } from '@/store/conceptArtStore'
import type { CinematicStyle, MoodType, LightingType } from '@/store/conceptArtStore'

const STYLES: { value: CinematicStyle; label: string }[] = [
  { value: 'noir', label: '黑色电影' },
  { value: 'cyberpunk', label: '赛博朋克' },
  { value: 'fantasy', label: '奇幻' },
  { value: 'wasteland', label: '废土' },
  { value: 'ocean', label: '深海' },
  { value: 'forest', label: '暗夜森林' },
  { value: 'space', label: '宇宙' },
  { value: 'ancient', label: '远古遗迹' },
]

const MOODS: { value: MoodType; label: string }[] = [
  { value: 'dramatic', label: '戏剧' },
  { value: 'serene', label: '宁静' },
  { value: 'mysterious', label: '神秘' },
  { value: 'melancholic', label: '忧郁' },
  { value: 'epic', label: '史诗' },
  { value: 'eerie', label: '诡异' },
]

const LIGHTINGS: { value: LightingType; label: string }[] = [
  { value: 'golden', label: '金色' },
  { value: 'cold', label: '冷光' },
  { value: 'volumetric', label: '体积光' },
  { value: 'backlit', label: '逆光' },
  { value: 'neon', label: '霓虹' },
  { value: 'moonlight', label: '月光' },
]

function Slider({ label, value, onChange, min = 0, max = 1, step = 0.01 }: {
  label: string; value: number; onChange: (v: number) => void
  min?: number; max?: number; step?: number
}) {
  return (
    <div className="mb-2.5">
      <div className="flex justify-between items-center mb-0.5">
        <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}>
          {label}
        </span>
        <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa' }}>
          {value.toFixed(2)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none bg-gray-200 cursor-pointer accent-gray-800"
      />
    </div>
  )
}

function SelectGroup<T extends string>({ label, options, value, onChange }: {
  label: string; options: { value: T; label: string }[]; value: T; onChange: (v: T) => void
}) {
  return (
    <div className="mb-3">
      <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }} className="mb-1">
        {label}
      </div>
      <div className="flex flex-wrap gap-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-2 py-0.5 border transition-all"
            style={{
              fontSize: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              borderColor: value === opt.value ? '#1a1a1a' : '#ddd',
              backgroundColor: value === opt.value ? '#1a1a1a' : 'transparent',
              color: value === opt.value ? '#fff' : '#666',
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function ControlPanel() {
  const { scene, setScene, activePreset, applyPreset, resetScene, showControls } = useConceptArtStore()

  if (!showControls) return null

  return (
    <div
      className="absolute right-0 top-0 h-full overflow-y-auto"
      style={{
        width: 260,
        zIndex: 20,
        background: 'rgba(245, 243, 240, 0.92)',
        backdropFilter: 'blur(12px)',
        borderLeft: '1px solid rgba(0,0,0,0.08)',
        padding: '16px 14px',
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h3
          className="font-bold tracking-wider"
          style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", color: '#1a1a1a' }}
        >
          参数控制
        </h3>
        <button
          onClick={resetScene}
          className="px-2 py-0.5 border border-gray-300 hover:border-gray-500 transition-colors"
          style={{ fontSize: '7px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}
        >
          重置
        </button>
      </div>

      <div className="mb-4">
        <div style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }} className="mb-1.5">
          预设模板 / PRESETS
        </div>
        <div className="grid grid-cols-2 gap-1">
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key, preset.params)}
              className="px-2 py-1.5 border text-left transition-all"
              style={{
                fontSize: '8px',
                fontFamily: "'JetBrains Mono', monospace",
                borderColor: activePreset === key ? '#1a1a1a' : '#e0e0e0',
                backgroundColor: activePreset === key ? '#1a1a1a' : 'rgba(255,255,255,0.6)',
                color: activePreset === key ? '#fff' : '#555',
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px bg-gray-200 mb-4" />

      <SelectGroup
        label="风格 / STYLE"
        options={STYLES}
        value={scene.style}
        onChange={(v) => setScene({ style: v })}
      />

      <SelectGroup
        label="氛围 / MOOD"
        options={MOODS}
        value={scene.mood}
        onChange={(v) => setScene({ mood: v })}
      />

      <SelectGroup
        label="光照 / LIGHTING"
        options={LIGHTINGS}
        value={scene.lighting}
        onChange={(v) => setScene({ lighting: v })}
      />

      <div className="h-px bg-gray-200 mb-3" />

      <Slider
        label="色彩强度 / COLOR"
        value={scene.colorIntensity}
        onChange={(v) => setScene({ colorIntensity: v })}
      />
      <Slider
        label="雾气密度 / FOG"
        value={scene.fogDensity}
        onChange={(v) => setScene({ fogDensity: v })}
      />
      <Slider
        label="镜头高度 / CAM HEIGHT"
        value={scene.cameraHeight}
        onChange={(v) => setScene({ cameraHeight: v })}
      />
      <Slider
        label="镜头角度 / CAM ANGLE"
        value={scene.cameraAngle}
        onChange={(v) => setScene({ cameraAngle: v })}
      />
      <Slider
        label="时间 / TIME OF DAY"
        value={scene.timeOfDay}
        onChange={(v) => setScene({ timeOfDay: v })}
      />
      <Slider
        label="粒子密度 / PARTICLES"
        value={scene.particleDensity}
        onChange={(v) => setScene({ particleDensity: v })}
      />
      <Slider
        label="胶片颗粒 / GRAIN"
        value={scene.grainAmount}
        onChange={(v) => setScene({ grainAmount: v })}
      />
      <Slider
        label="暗角强度 / VIGNETTE"
        value={scene.vignetteStrength}
        onChange={(v) => setScene({ vignetteStrength: v })}
      />
      <Slider
        label="景深 / DOF"
        value={scene.depthOfField}
        onChange={(v) => setScene({ depthOfField: v })}
      />
    </div>
  )
}
