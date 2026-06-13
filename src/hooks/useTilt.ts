import { useEffect, useRef, useState } from "react";
import { useMouse } from "./useMouse";

/**
 * 根据鼠标位置计算伪 3D 倾斜角度（度）。
 * - 水平方向：±10° (yaw)
 * - 垂直方向：±5° (pitch)
 */
export function useTilt() {
  const mouse = useMouse();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const raf = useRef(0);
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const targetX = (mouse.x - 0.5) * 20; // ±10
    const targetY = (mouse.y - 0.5) * 10; // ±5
    const tick = () => {
      const dx = targetX - current.current.x;
      const dy = targetY - current.current.y;
      current.current.x += dx * 0.08;
      current.current.y += dy * 0.08;
      setTilt({ x: current.current.x, y: current.current.y });
      const root = document.documentElement;
      root.style.setProperty("--tilt-x", `${current.current.y.toFixed(2)}deg`);
      root.style.setProperty("--tilt-y", `${(-current.current.x).toFixed(2)}deg`);
      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = 0;
      }
    };
    if (!raf.current) raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [mouse.x, mouse.y]);

  return tilt;
}
