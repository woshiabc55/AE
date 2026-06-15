import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Work from '@/components/Work'
import Services from '@/components/Services'
import Manifesto from '@/components/Manifesto'
import Studio from '@/components/Studio'
import Clients from '@/components/Clients'
import Contact from '@/components/Contact'
import { useActiveSection } from '@/hooks/useActiveSection'

const SECTIONS = ['hero', 'work', 'services', 'manifesto', 'studio', 'clients', 'contact']

export default function Home() {
  useActiveSection(SECTIONS)
  const { pathname } = useLocation()

  // 路由切回根路径时,回到页面顶部
  useEffect(() => {
    if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'auto' })
    }
  }, [pathname])

  return (
    <div className="relative min-h-screen bg-bg text-fg">
      <Nav />
      <main>
        <Hero />
        <Work />
        <Services />
        <Manifesto />
        <Studio />
        <Clients />
        <Contact />
      </main>
    </div>
  )
}
