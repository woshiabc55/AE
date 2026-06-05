import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import { sections, type SectionId } from "@/data/sections";

/**
 * 监听滚动，驱动 activeSection 与 scrollProgress
 */
export function useScrollSpy() {
  const setActiveSection = useGameStore((s) => s.setActiveSection);
  const setScrollProgress = useGameStore((s) => s.setScrollProgress);

  useEffect(() => {
    const handle = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = window.scrollY;
      const progress = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setScrollProgress(progress);

      // 找到最靠近视口中部的 section
      const mid = window.scrollY + window.innerHeight * 0.35;
      let current: SectionId = "hero";
      for (const s of sections) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        const top = el.offsetTop;
        if (top <= mid) current = s.id;
      }
      setActiveSection(current);
    };

    handle();
    window.addEventListener("scroll", handle, { passive: true });
    window.addEventListener("resize", handle);
    return () => {
      window.removeEventListener("scroll", handle);
      window.removeEventListener("resize", handle);
    };
  }, [setActiveSection, setScrollProgress]);
}
