import { Desktop } from '@/components/desktop/Desktop'
import { Taskbar } from '@/components/taskbar/Taskbar'
import { WindowManager } from '@/components/window/WindowManager'
import { NotificationCenter } from '@/components/notifications/NotificationCenter'

export default function App() {
  return (
    <div className="w-screen h-screen overflow-hidden relative select-none">
      <Desktop />
      <WindowManager />
      <NotificationCenter />
      <Taskbar />
    </div>
  )
}
