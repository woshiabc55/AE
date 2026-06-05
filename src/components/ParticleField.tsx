import { useMemo } from "react";
import { useFXStore } from "@/store/ui";

/**
 * ParticleField —— 背景上升粒子（15 ~ 60）
 */
export function ParticleField() {
  const { particleDensity, particlesEnabled } = useFXStore();
  const n = Math.max(0, Math.min(60, Math.round(particleDensity)));

  const particles = useMemo(() => {
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 1 + Math.random() * 2.2,
      duration: 14 + Math.random() * 18,
      delay: -Math.random() * 24,
      opacity: 0.18 + Math.random() * 0.5,
      hue: Math.random() > 0.7 ? "#e8c477" : Math.random() > 0.5 ? "#5ee3ff" : "#c15bff",
    }));
  }, [n]);

  if (!particlesEnabled || n === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute bottom-0 block rounded-full"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.hue,
            boxShadow: `0 0 ${p.size * 4}px ${p.hue}`,
            opacity: p.opacity,
            animation: `ark-rise ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
