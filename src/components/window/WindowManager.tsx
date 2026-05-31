import { useWindowStore } from '@/stores/useWindowStore'
import { Window } from './Window'

export function WindowManager() {
  const windows = useWindowStore((s) => s.windows)

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ paddingBottom: 76 }}>
      {windows.map((win) => (
        <div key={win.id} className="pointer-events-auto" style={{ position: 'absolute', inset: 0 }}>
          <Window window={win} />
        </div>
      ))}
    </div>
  )
}
