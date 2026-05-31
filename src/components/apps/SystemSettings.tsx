import { useState } from 'react'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { WALLPAPERS } from '@/utils/apps'
import { Palette, Monitor, Image, Sun, Moon, Check } from 'lucide-react'

type SettingsTab = 'appearance' | 'display' | 'wallpaper'

export function SystemSettings() {
  const settings = useSettingsStore((s) => s.settings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)
  const [activeTab, setActiveTab] = useState<SettingsTab>('appearance')

  const tabs: { key: SettingsTab; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }[] = [
    { key: 'appearance', label: '外观', icon: Palette },
    { key: 'wallpaper', label: '壁纸', icon: Image },
    { key: 'display', label: '显示', icon: Monitor },
  ]

  return (
    <div className="flex h-full">
      <div className="w-40 shrink-0 border-r border-white/[0.06] py-3 px-2">
        <div className="text-[10px] text-white/25 uppercase tracking-wider px-2 mb-2">
          设置
        </div>
        {tabs.map((tab) => {
          const TabIcon = tab.icon
          return (
            <button
              key={tab.key}
              className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors
                ${activeTab === tab.key
                  ? 'bg-white/[0.08] text-white/80'
                  : 'text-white/45 hover:bg-white/[0.04] hover:text-white/65'
                }`}
              onClick={() => setActiveTab(tab.key)}
            >
              <TabIcon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'appearance' && (
          <div className="space-y-5">
            <h3 className="text-sm text-white/70 font-medium">外观设置</h3>

            <div className="space-y-3">
              <span className="text-xs text-white/40">主题模式</span>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map((theme) => (
                  <button
                    key={theme}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all
                      ${settings.theme === theme
                        ? 'border-blue-400/40 bg-blue-400/[0.06] text-white/80'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.04]'
                      }`}
                    onClick={() => updateSettings({ theme })}
                  >
                    {theme === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                    <span className="text-xs">{theme === 'dark' ? '深色' : '浅色'}</span>
                    {settings.theme === theme && <Check size={12} className="text-blue-400 ml-1" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'wallpaper' && (
          <div className="space-y-5">
            <h3 className="text-sm text-white/70 font-medium">壁纸选择</h3>
            <div className="grid grid-cols-3 gap-3">
              {WALLPAPERS.map((wp, i) => (
                <button
                  key={i}
                  className={`h-20 rounded-xl border-2 transition-all overflow-hidden relative
                    ${settings.wallpaper === wp
                      ? 'border-blue-400/60 shadow-lg shadow-blue-500/10'
                      : 'border-white/[0.06] hover:border-white/[0.12]'
                    }`}
                  style={{ background: wp }}
                  onClick={() => updateSettings({ wallpaper: wp })}
                >
                  {settings.wallpaper === wp && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Check size={20} className="text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'display' && (
          <div className="space-y-5">
            <h3 className="text-sm text-white/70 font-medium">显示设置</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/40">缩放比例</span>
                  <span className="text-xs text-white/30">{settings.scale}%</span>
                </div>
                <input
                  type="range"
                  min={75}
                  max={150}
                  value={settings.scale}
                  onChange={(e) => updateSettings({ scale: Number(e.target.value) })}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4
                    [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-500/20"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
