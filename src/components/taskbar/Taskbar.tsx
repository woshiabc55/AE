import { useState } from 'react'
import { StartButton } from './StartButton'
import { RunningApps } from './RunningApps'
import { SystemTray } from './SystemTray'
import { AppLauncher } from '@/components/launcher/AppLauncher'

export function Taskbar() {
  const [isLauncherOpen, setIsLauncherOpen] = useState(false)

  return (
    <>
      {isLauncherOpen && (
        <AppLauncher onClose={() => setIsLauncherOpen(false)} />
      )}

      <div
        className="absolute bottom-3 left-3 right-3 h-14 rounded-2xl
          bg-black/40 backdrop-blur-2xl border border-white/[0.08]
          shadow-lg shadow-black/20 flex items-center px-3 z-[9000]"
      >
        <StartButton
          onClick={() => setIsLauncherOpen(!isLauncherOpen)}
          isOpen={isLauncherOpen}
        />

        <div className="w-px h-6 bg-white/10 mx-2" />

        <RunningApps />

        <SystemTray />
      </div>
    </>
  )
}
