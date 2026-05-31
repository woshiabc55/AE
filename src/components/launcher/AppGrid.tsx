import { ICON_MAP, APP_DEFINITIONS } from '@/utils/apps'
import type { AppDefinition } from '@/types'

interface AppGridProps {
  apps: AppDefinition[]
  onLaunch: (appId: string) => void
}

export function AppGrid({ apps, onLaunch }: AppGridProps) {
  const categories = [
    { key: 'system', label: '系统' },
    { key: 'utility', label: '工具' },
    { key: 'productivity', label: '效率' },
  ] as const

  return (
    <div className="w-full max-w-2xl space-y-6">
      {categories.map((cat) => {
        const catApps = apps.filter((a) => a.category === cat.key)
        if (catApps.length === 0) return null

        return (
          <div key={cat.key}>
            <h3 className="text-xs text-white/40 uppercase tracking-wider mb-3 px-1">
              {cat.label}
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {catApps.map((app) => {
                const IconComponent = ICON_MAP[app.icon]
                return (
                  <button
                    key={app.id}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl
                      hover:bg-white/[0.08] active:bg-white/[0.12]
                      transition-all duration-150 group"
                    onClick={() => onLaunch(app.id)}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.06] group-hover:bg-white/[0.1]
                      flex items-center justify-center transition-colors duration-150">
                      {IconComponent && (
                        <IconComponent size={26} className="text-white/80 group-hover:text-white transition-colors" />
                      )}
                    </div>
                    <span className="text-[11px] text-white/60 group-hover:text-white/90 transition-colors text-center leading-tight">
                      {app.name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
