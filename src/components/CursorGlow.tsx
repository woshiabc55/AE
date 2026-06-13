import { useEffect, useState } from "react";
import { useMouse } from "@/hooks/useMouse";

/**
 * 自定义鼠标光斑（DOM 实现，避免大开销 canvas）
 */
export default function CursorGlow() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hover, setHover] = useState(false);
  const mouse = useMouse();

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("[data-hover]");
    const onOver = () => setHover(true);
    const onOut = () => setHover(false);
    els.forEach((el) => {
      el.addEventListener("mouseenter", onOver);
      el.addEventListener("mouseleave", onOut);
    });
    return () => {
      els.forEach((el) => {
        el.removeEventListener("mouseenter", onOver);
        el.removeEventListener("mouseleave", onOut);
      });
    };
  }, [mouse.x, mouse.y]); // 重新挂载

  return (
    <div
      className={`cursor-glow ${hover ? "is-hover" : ""}`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)` }}
    />
  );
}
