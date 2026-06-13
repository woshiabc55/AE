import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/playerStore";

/**
 * 简易波形可视化（无 Web Audio，用伪随机算法 + 节奏 BPM 同步）
 */
export default function Visualizer() {
  const ref = useRef<HTMLCanvasElement>(null);
  const playing = usePlayerStore((s) => s.playing);
  const bpm = usePlayerStore((s) => {
    const cur = s.playlist.find((t) => t.id === s.currentId);
    return cur?.bpm ?? 140;
  });
  const tick = usePlayerStore((s) => s.tick);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let raf = 0;
    const t0 = performance.now();
    const bars = 56;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (canvas.width !== w * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, w, h);
      const t = (performance.now() - t0) / 1000;
      const beat = (bpm / 60) * t; // 节拍
      const beatPhase = beat % 1; // 0~1

      const bw = w / bars;
      for (let i = 0; i < bars; i++) {
        const phase = i / bars;
        const env =
          playing
            ? 0.45 +
              0.55 *
                Math.abs(
                  Math.sin(beat * Math.PI * 2 + phase * 6.2) *
                    Math.cos(beat * Math.PI + phase * 3.1)
                )
            : 0.18 + 0.12 * Math.sin(t * 1.6 + phase * 4);
        const barH = env * h * 0.9;
        const x = i * bw;
        const y = (h - barH) / 2;
        const grad = ctx.createLinearGradient(0, y, 0, y + barH);
        grad.addColorStop(0, "rgba(255,42,42,0.95)");
        grad.addColorStop(0.5, "rgba(255,138,42,0.7)");
        grad.addColorStop(1, "rgba(124,246,255,0.7)");
        ctx.fillStyle = grad;
        ctx.fillRect(x + bw * 0.18, y, bw * 0.64, barH);
      }
      // 节拍闪线
      if (playing) {
        const k = Math.max(0, 1 - beatPhase * 4);
        ctx.fillStyle = `rgba(255,42,42,${0.18 * k})`;
        ctx.fillRect(0, 0, w, h);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [playing, bpm, tick]);

  return <canvas ref={ref} className="h-full w-full" />;
}
