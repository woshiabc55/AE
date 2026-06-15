import { useEffect } from 'react'
import { useUIStore } from '@/store/ui'

/**
 * 监听一组 section id 的可见性,更新 zustand 中的 activeSection
 */
export function useActiveSection(ids: string[]) {
  const setActiveSection = useUIStore((s) => s.setActiveSection)
  const key = ids.join('|')

  useEffect(() => {
    if (ids.length === 0) return
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    if (elements.length === 0) return

    const obs = new IntersectionObserver(
      (entries) => {
        // 选取所有相交项中,top 距离视口顶部最近的那一个
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveSection(visible[0].target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    )
    elements.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [key, setActiveSection])
}
