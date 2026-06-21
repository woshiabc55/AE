import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkle: number;
  hue: number;
}

interface StarfieldCanvasProps {
  density?: "low" | "high";
}

/**
 * 全局星云粒子背景：模拟深空中的星点与漂浮尘埃。
 * 使用 Canvas 2D 绘制，根据视口尺寸自适应粒子数量。
 */
export default function StarfieldCanvas({ density = "high" }: StarfieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const isMobile = window.innerWidth < 768;
    const baseCount = density === "low" ? 90 : isMobile ? 140 : 320;

    const particles: Particle[] = [];
    for (let i = 0; i < baseCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.2,
        size: Math.random() * 1.6 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkle: Math.random() * Math.PI * 2,
        hue: Math.random() < 0.15 ? 18 : Math.random() < 0.4 ? 210 : 0,
      });
    }

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let t = 0;
    const render = () => {
      t += 0.005;
      ctx.clearRect(0, 0, width, height);

      // 远处星云辉光
      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.35,
        0,
        width * 0.5,
        height * 0.35,
        Math.max(width, height) * 0.6,
      );
      glow.addColorStop(0, "rgba(26, 15, 46, 0.5)");
      glow.addColorStop(0.5, "rgba(10, 10, 31, 0.2)");
      glow.addColorStop(1, "rgba(5, 5, 16, 0)");
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        p.twinkle += 0.02 * p.z;
        const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        const driftY = (scrollY * 0.04 * p.z) % height;
        const px = p.x + Math.sin(t + p.twinkle) * 6 * p.z;
        const py = ((p.y - driftY + height) % height) + Math.cos(t * 0.5) * 4 * p.z;

        if (p.hue === 18) {
          ctx.fillStyle = `rgba(255, 140, 66, ${alpha})`;
        } else if (p.hue === 210) {
          ctx.fillStyle = `rgba(120, 170, 220, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(232, 240, 255, ${alpha})`;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();

        // 较大星点加光晕
        if (p.size > 1.2) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * p.z * 3, 0, Math.PI * 2);
          const halo = ctx.createRadialGradient(px, py, 0, px, py, p.size * p.z * 3);
          halo.addColorStop(0, `rgba(232, 240, 255, ${alpha * 0.3})`);
          halo.addColorStop(1, "rgba(232, 240, 255, 0)");
          ctx.fillStyle = halo;
          ctx.fill();
        }
      }

      rafRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-full w-full"
      aria-hidden="true"
    />
  );
}
