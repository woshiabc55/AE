import { useEffect, useRef } from 'react';
import { CAPTIONS } from '../data/inscriptions';
import { mulberry32 } from '../utils/rng';

// 残字字幕 — Canvas 横向滚字
export default function GlitchCaption() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext('2d')!;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rng = mulberry32(13);
    const rowCount = 5;
    const rows = Array.from({ length: rowCount }, (_, i) => ({
      y: 14 + i * 14,
      text: CAPTIONS[(i * 3) % CAPTIONS.length],
      offset: rng() * canvas.clientWidth,
      speed: 14 + rng() * 16,
      gap: [], // 每行被"咬掉"的列
    }));
    // 初始化"咬痕"位
    rows.forEach((r) => {
      r.gap = Array.from({ length: r.text.length }, () => rng() < 0.18);
    });

    let raf = 0;
    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      ctx.font = '14px "Ma Shan Zheng", "ZCOOL XiaoWei", serif';
      ctx.textBaseline = 'top';
      rows.forEach((r) => {
        r.offset -= r.speed / 60;
        const totalW = ctx.measureText(r.text).width + 80;
        if (r.offset < -totalW) r.offset = w;

        // 描出每个字符，遇 gap 跳过
        let x = r.offset;
        for (let i = 0; i < r.text.length; i++) {
          if (r.gap[i]) { x += 14; continue; }
          ctx.fillStyle = 'rgba(27,22,18,0.55)';
          ctx.fillText(r.text[i], x, r.y);
          x += 14;
        }
        // 半透明重影
        ctx.fillStyle = 'rgba(168,52,30,0.18)';
        ctx.fillText(r.text, r.offset + 2, r.y + 2);
      });

      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      className="caption"
      style={{
        position: 'absolute',
        top: '24%',
        left: 0,
        right: 0,
        width: '70%',
        height: 90,
        pointerEvents: 'none',
        zIndex: 8,
        imageRendering: 'pixelated',
      }}
    />
  );
}
