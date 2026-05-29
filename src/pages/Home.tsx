import { useEffect, useState } from 'react'
import IntroSection from '@/components/sections/IntroSection'
import AncientSection from '@/components/sections/AncientSection'
import ModernSection from '@/components/sections/ModernSection'
import ResonanceSection from '@/components/sections/ResonanceSection'
import EpilogueSection from '@/components/sections/EpilogueSection'

const sections = [
  { id: 'intro', label: '窑火引', color: '#D4622B' },
  { id: 'ancient', label: '古线', color: '#C9A84C' },
  { id: 'modern', label: '今线', color: '#4A7C59' },
  { id: 'resonance', label: '共振', color: '#B0C4B1' },
  { id: 'epilogue', label: '尾声', color: '#F5F0E8' },
]

export default function Home() {
  const [activeSection, setActiveSection] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const sectionIndex = Math.floor(scrollY / windowHeight)
      setActiveSection(Math.min(sectionIndex, sections.length - 1))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <nav className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((section, index) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className="group relative flex items-center justify-end"
            aria-label={`跳转到${section.label}`}
          >
            <span
              className="mr-3 text-xs tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-serif whitespace-nowrap"
              style={{ color: section.color }}
            >
              {section.label}
            </span>
            <span
              className="block rounded-full transition-all duration-500"
              style={{
                width: activeSection === index ? '12px' : '6px',
                height: activeSection === index ? '12px' : '6px',
                backgroundColor: activeSection === index ? section.color : `${section.color}40`,
                boxShadow: activeSection === index ? `0 0 8px ${section.color}60` : 'none',
              }}
            />
          </button>
        ))}
      </nav>

      <div id="intro">
        <IntroSection />
      </div>
      <div id="ancient">
        <AncientSection />
      </div>
      <div id="modern">
        <ModernSection />
      </div>
      <div id="resonance">
        <ResonanceSection />
      </div>
      <div id="epilogue">
        <EpilogueSection />
      </div>
    </div>
  )
}
