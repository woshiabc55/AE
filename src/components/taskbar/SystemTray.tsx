import { useClock } from '@/hooks/useClock'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { Bell, Wifi, Volume2, BatteryFull } from 'lucide-react'

export function SystemTray() {
  const { timeString, dateString } = useClock()
  const toggleNotification = useNotificationStore((s) => s.toggleOpen)
  const unreadCount = useNotificationStore((s) => s.notifications.filter((n) => !n.read).length)
  const volume = useSettingsStore((s) => s.settings.volume)

  return (
    <div className="flex items-center gap-1 pl-2 ml-auto">
      <div className="flex items-center gap-0.5 px-1.5">
        <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
          <Wifi size={14} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
          <Volume2 size={14} />
        </button>
        <button className="p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white/80">
          <BatteryFull size={14} />
        </button>
      </div>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <button
        className="relative p-1.5 rounded-md hover:bg-white/10 transition-colors text-white/60 hover:text-white/80"
        onClick={toggleNotification}
      >
        <Bell size={14} />
        {unreadCount > 0 && (
          <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 text-[8px] text-white flex items-center justify-center">
            {unreadCount}
          </div>
        )}
      </button>

      <div className="w-px h-5 bg-white/10 mx-1" />

      <div className="flex flex-col items-end px-2 py-0.5 rounded-md hover:bg-white/10 cursor-default transition-colors">
        <span className="text-[12px] text-white/90 font-medium leading-tight tabular-nums">
          {timeString}
        </span>
        <span className="text-[10px] text-white/50 leading-tight">
          {dateString}
        </span>
      </div>
    </div>
  )
}
