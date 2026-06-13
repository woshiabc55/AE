import { useEffect, useRef } from "react";

/**
 * Canvas 粒子层
 * - 60~140 颗光点（自适应视口宽度）
 * - 自由落体 + 触底反弹
 * - 鼠标位置吸引（轻微）
 * - 偶发红色 / 青色高亮粒子
 */
export default function Particles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d", { alpha: true })!;
    let raf = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const mouse = { x: 0, y: 0, active: false };

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => (mouse.active = false);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);

    const count = () => {
      const w = window.innerWidth;
      if (w < 640) return 50;
      if (w < 1280) return 90;
      return 130;
    };

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      hue: "white" | "red" | "cyan";
      life: number;
      flicker: number;
    };

    let particles: P[] = [];

    const init = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      particles = Array.from({ length: count() }, () => spawn(w, h, true));
    };

    const spawn = (w: number, h: number, anywhere = false): P => {
      const hueRoll = Math.random();
      return {
        x: Math.random() * w,
        y: anywhere ? Math.random() * h : -10,
        vx: (Math.random() - 0.5) * 0.35,
        vy: 0.4 + Math.random() * 1.4,
        r: 0.6 + Math.random() * 2.2,
        hue: hueRoll < 0.08 ? "red" : hueRoll < 0.18 ? "cyan" : "white",
        life: 0,
        flicker: Math.random() * Math.PI * 2,
      };
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      init();
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      // 拖尾
      ctx.fillStyle = "rgba(7,8,11,0.18)";
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.life += 1;
        p.flicker += 0.12 + Math.random() * 0.04;

        // 鼠标吸引
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 220) {
            p.vx += (dx / dist) * 0.012;
            p.vy += (dy / dist) * 0.012;
          }
        }

        p.vy += 0.012; // 重力
        p.vx *= 0.992;
        p.vy = Math.min(p.vy, 3.2);
        p.x += p.vx;
        p.y += p.vy;

        // 触底反弹
        if (p.y > h - 6) {
          p.y = h - 6;
          p.vy *= -0.55;
          p.vx *= 0.85;
          if (Math.abs(p.vy) < 0.3) p.vy = 0;
        }
        // 出界回收
        if (p.x < -20 || p.x > w + 20) {
          Object.assign(p, spawn(w, h));
        }
        if (p.life > 700) {
          Object.assign(p, spawn(w, h));
        }

        const flick = (Math.sin(p.flicker) + 1) / 2;
        const alpha = 0.35 + flick * 0.55;
        let color = `rgba(255,255,255,${alpha})`;
        if (p.hue === "red") color = `rgba(255,42,42,${alpha * 0.95})`;
        if (p.hue === "cyan") color = `rgba(124,246,255,${alpha * 0.9})`;

        // 光晕
        const grd = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
        grd.addColorStop(0, color);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
