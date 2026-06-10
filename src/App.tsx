import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Router } from './router'
import { useTemplateStore } from './stores/templateStore'

export default function App() {
  const setHydrated = useTemplateStore((s) => s.setHydrated)
  useEffect(() => {
    // 标记 zustand 持久化已水合
    const t = setTimeout(() => setHydrated(true), 0)
    return () => clearTimeout(t)
  }, [setHydrated])

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}
