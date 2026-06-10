import { useEffect, useState } from 'react'

export function Toast({ message, onDone }: { message: string; onDone: () => void }) {
  const [leaving, setLeaving] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setLeaving(true), 1800)
    const t2 = setTimeout(() => onDone(), 2200)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [onDone])
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-md bg-ink-900 border border-amber-500/60 text-bone-50 font-mono-ui text-[12px] shadow-spotlight transition-all duration-300 ${
        leaving ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
      }`}
    >
      {message}
    </div>
  )
}

export function useToasts() {
  const [toast, setToast] = useState<string | null>(null)
  function show(msg: string) {
    setToast(msg)
  }
  return { toast, show }
}
