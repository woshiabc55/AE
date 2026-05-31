import { motion, AnimatePresence } from 'framer-motion'
import { useNotificationStore } from '@/stores/useNotificationStore'
import { useSettingsStore } from '@/stores/useSettingsStore'
import { X, Bell, Trash2, Volume2, Sun, Moon } from 'lucide-react'

export function NotificationCenter() {
  const isOpen = useNotificationStore((s) => s.isOpen)
  const setOpen = useNotificationStore((s) => s.setOpen)
  const notifications = useNotificationStore((s) => s.notifications)
  const removeNotification = useNotificationStore((s) => s.removeNotification)
  const clearAll = useNotificationStore((s) => s.clearAll)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const settings = useSettingsStore((s) => s.settings)
  const updateSettings = useSettingsStore((s) => s.updateSettings)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed top-3 right-3 bottom-20 w-80 z-[9600] flex flex-col
            rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/[0.08]
            shadow-2xl shadow-black/30 overflow-hidden"
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 40, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.32, 0.72, 0, 1] }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-white/60" />
              <span className="text-sm text-white/80 font-medium">通知中心</span>
            </div>
            <div className="flex items-center gap-1">
              {notifications.length > 0 && (
                <button
                  className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                  onClick={clearAll}
                  title="清除全部"
                >
                  <Trash2 size={14} />
                </button>
              )}
              <button
                className="p-1.5 rounded-md hover:bg-white/10 text-white/40 hover:text-white/70 transition-colors"
                onClick={() => setOpen(false)}
              >
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-white/[0.06] space-y-3">
            <div className="flex items-center gap-3">
              <Sun size={14} className="text-white/40 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/50">亮度</span>
                  <span className="text-[11px] text-white/40">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={100}
                  value={settings.brightness}
                  onChange={(e) => updateSettings({ brightness: Number(e.target.value) })}
                  className="w-full h-1 rounded-full appearance-none bg-white/10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Volume2 size={14} className="text-white/40 shrink-0" />
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-white/50">音量</span>
                  <span className="text-[11px] text-white/40">{settings.volume}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={settings.volume}
                  onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
                  className="w-full h-1 rounded-full appearance-none bg-white/10
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3
                    [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full
                    [&::-webkit-slider-thumb]:bg-blue-400 [&::-webkit-slider-thumb]:cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Moon size={14} className="text-white/40" />
                <span className="text-[11px] text-white/50">勿扰模式</span>
              </div>
              <button
                className={`w-9 h-5 rounded-full transition-colors duration-200 relative
                  ${settings.doNotDisturb ? 'bg-blue-500' : 'bg-white/10'}`}
                onClick={() => updateSettings({ doNotDisturb: !settings.doNotDisturb })}
              >
                <div
                  className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform duration-200
                    ${settings.doNotDisturb ? 'translate-x-[18px]' : 'translate-x-0.5'}`}
                />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-white/20">
                <Bell size={32} className="mb-2" />
                <span className="text-sm">暂无通知</span>
              </div>
            ) : (
              <div className="py-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 hover:bg-white/[0.04] transition-colors group
                      ${!notif.read ? 'bg-white/[0.02]' : ''}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                          )}
                          <span className="text-xs text-white/80 font-medium">{notif.title}</span>
                        </div>
                        <p className="text-[11px] text-white/40 mt-0.5 leading-relaxed">
                          {notif.content}
                        </p>
                        <span className="text-[10px] text-white/20 mt-1 block">
                          {new Date(notif.timestamp).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <button
                        className="p-1 rounded opacity-0 group-hover:opacity-100
                          hover:bg-white/10 text-white/30 hover:text-white/60 transition-all"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNotification(notif.id)
                        }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
