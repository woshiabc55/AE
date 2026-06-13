import { useEffect, useRef, useState } from "react";

/**
 * 跟踪鼠标在视口中的位置（归一化 -1 ~ 1）。
 * 同时通过 CSS 变量 --mouse-x / --mouse-y 写入 :root，便于光斑与染色蒙版使用。
 */
export function useMouse() {
  const [pos, setPos] = useState({ x: 0.5, y: 0.5, px: 0, py: 0 });
  const rafId = useRef(0);
  const target = useRef({ px: 0.5, py: 0.5 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.px = e.clientX / window.innerWidth;
      target.current.py = e.clientY / window.innerHeight;
      if (!rafId.current) tick();
    };
    const tick = () => {
      const dx = target.current.px - pos.x;
      const dy = target.current.py - pos.y;
      const nx = pos.x + dx * 0.18;
      const ny = pos.y + dy * 0.18;
      setPos({ x: nx, y: ny, px: target.current.px, py: target.current.py });
      const root = document.documentElement;
      root.style.setProperty("--mouse-x", `${target.current.px * 100}vw`);
      root.style.setProperty("--mouse-y", `${target.current.py * 100}vh`);
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        rafId.current = 0;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", (e) => {
      const t = e.touches[0];
      if (t) onMove({ clientX: t.clientX, clientY: t.clientY } as MouseEvent);
    }, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return pos;
}
