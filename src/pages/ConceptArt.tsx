import ConceptCanvas from '@/components/ConceptCanvas'
import ConceptOverlay from '@/components/ConceptOverlay'
import ControlPanel from '@/components/ControlPanel'
import TextInput from '@/components/TextInput'
import ExportPanel from '@/components/ExportPanel'
import { useConceptArtStore, PRESETS } from '@/store/conceptArtStore'

export default function ConceptArt() {
  const { showControls, toggleControls } = useConceptArtStore()

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-100">
      <ConceptCanvas />
      <ConceptOverlay />

      <div
        className="absolute left-0 top-0 h-full flex flex-col"
        style={{
          width: 280,
          zIndex: 20,
          background: 'rgba(245, 243, 240, 0.92)',
          backdropFilter: 'blur(12px)',
          borderRight: '1px solid rgba(0,0,0,0.08)',
          padding: '20px 16px',
        }}
      >
        <div className="mb-5">
          <h1
            className="tracking-wider mb-0.5"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: '18px',
              fontWeight: 900,
              color: '#1a1a1a',
              letterSpacing: '0.1em',
            }}
          >
            影视化概念图
          </h1>
          <div
            style={{
              fontSize: '8px',
              fontFamily: "'JetBrains Mono', monospace",
              color: '#aaa',
              letterSpacing: '0.15em',
            }}
          >
            CINEMATIC CONCEPT ART TOOL
          </div>
        </div>

        <div className="mb-4">
          <TextInput />
        </div>

        <div className="h-px bg-gray-200 mb-4" />

        <div className="flex-1 overflow-y-auto pr-1">
          <div className="mb-4">
            <div
              style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}
              className="mb-2 tracking-wide"
            >
              快速预设 / QUICK PRESETS
            </div>
            <PresetGrid />
          </div>

          <div className="h-px bg-gray-200 mb-3" />

          <QuickSliders />
        </div>

        <div className="mt-3">
          <ExportPanel />
        </div>
      </div>

      <button
        onClick={toggleControls}
        className="absolute transition-all hover:bg-gray-200"
        style={{
          right: showControls ? 260 : 0,
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 25,
          width: 20,
          height: 48,
          background: 'rgba(245, 243, 240, 0.9)',
          border: '1px solid rgba(0,0,0,0.08)',
          borderRight: 'none',
          fontSize: '8px',
          color: '#888',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        {showControls ? '›' : '‹'}
      </button>

      <ControlPanel />
    </div>
  )
}

function PresetGrid() {
  const { applyPreset, activePreset } = useConceptArtStore()
  const presets = [
    { key: 'noir_city', label: '黑色电影', icon: '◼' },
    { key: 'cyber_neon', label: '赛博霓虹', icon: '◈' },
    { key: 'fantasy_realm', label: '奇幻领域', icon: '◇' },
    { key: 'wasteland_sun', label: '废土日落', icon: '◻' },
    { key: 'deep_ocean', label: '深海幽境', icon: '◎' },
    { key: 'dark_forest', label: '暗夜森林', icon: '◆' },
    { key: 'cosmic_void', label: '宇宙深渊', icon: '✦' },
    { key: 'ancient_ruins', label: '远古遗迹', icon: '▣' },
  ]

  return (
    <div className="grid grid-cols-2 gap-1.5">
      {presets.map((p) => (
        <button
          key={p.key}
          onClick={() => {
            applyPreset(p.key, PRESETS[p.key].params)
          }}
          className="px-2 py-2 border text-left transition-all hover:shadow-sm"
          style={{
            fontSize: '8px',
            fontFamily: "'JetBrains Mono', monospace",
            borderColor: activePreset === p.key ? '#1a1a1a' : '#e0e0e0',
            backgroundColor: activePreset === p.key ? '#1a1a1a' : 'rgba(255,255,255,0.5)',
            color: activePreset === p.key ? '#fff' : '#555',
          }}
        >
          <span className="block text-base mb-0.5">{p.icon}</span>
          {p.label}
        </button>
      ))}
    </div>
  )
}

function QuickSliders() {
  const { scene, setScene } = useConceptArtStore()

  return (
    <div>
      <div
        style={{ fontSize: '9px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}
        className="mb-2 tracking-wide"
      >
        快速调节 / QUICK ADJUST
      </div>

      <SliderRow label="色彩" value={scene.colorIntensity} onChange={(v) => setScene({ colorIntensity: v })} />
      <SliderRow label="雾气" value={scene.fogDensity} onChange={(v) => setScene({ fogDensity: v })} />
      <SliderRow label="镜头" value={scene.cameraHeight} onChange={(v) => setScene({ cameraHeight: v })} />
      <SliderRow label="时间" value={scene.timeOfDay} onChange={(v) => setScene({ timeOfDay: v })} />
      <SliderRow label="粒子" value={scene.particleDensity} onChange={(v) => setScene({ particleDensity: v })} />
      <SliderRow label="颗粒" value={scene.grainAmount} onChange={(v) => setScene({ grainAmount: v })} />
      <SliderRow label="暗角" value={scene.vignetteStrength} onChange={(v) => setScene({ vignetteStrength: v })} />
      <SliderRow label="景深" value={scene.depthOfField} onChange={(v) => setScene({ depthOfField: v })} />
    </div>
  )
}

function SliderRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-0.5">
        <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#888' }}>
          {label}
        </span>
        <span style={{ fontSize: '8px', fontFamily: "'JetBrains Mono', monospace", color: '#aaa' }}>
          {(value * 100).toFixed(0)}%
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 appearance-none bg-gray-200 cursor-pointer accent-gray-800"
      />
    </div>
  )
}
