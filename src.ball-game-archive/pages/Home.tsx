import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Trash2, Trophy, Sparkles, ChevronRight, Lock } from 'lucide-react';
import { TOTAL_LEVELS, useSaveStore } from '@/store/saveStore';
import { getTheme } from '@/game/theme';

function useBackgroundParticles() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    let raf = 0;
    let particles: { x: number; y: number; vx: number; vy: number; r: number; a: number; c: string }[] = [];
    let w = 0, h = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // 重新生成粒子
      const count = Math.min(80, Math.floor((w * h) / 22000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        r: 0.5 + Math.random() * 1.5,
        a: 0.3 + Math.random() * 0.6,
        c: Math.random() > 0.5 ? '#A855F7' : '#22D3EE',
      }));
    };
    resize();
    window.addEventListener('resize', resize);

    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of particles) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        ctx.fillStyle = p.c;
        ctx.globalAlpha = p.a;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      // 绘制连接线
      ctx.strokeStyle = 'rgba(168,85,247,0.08)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 140 * 140) {
            const al = 1 - Math.sqrt(d2) / 140;
            ctx.globalAlpha = al * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return ref;
}

export default function Home() {
  const navigate = useNavigate();
  const levels = useSaveStore((s) => s.levels);
  const reset = useSaveStore((s) => s.reset);
  const bgRef = useBackgroundParticles();
  const [confirming, setConfirming] = useState(false);

  const totalBest = levels.reduce((sum, l) => sum + l.bestScore, 0);
  const totalCleared = levels.filter((l) => l.bestScore > 0).length;

  return (
    <div className="relative h-full w-full overflow-hidden bg-grid">
      <canvas ref={bgRef} className="absolute inset-0 z-0" />
      <div className="scanline animate-scanline" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-space-950/80 to-transparent pointer-events-none z-10" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-space-950/80 to-transparent pointer-events-none z-10" />

      <div className="relative z-20 h-full w-full flex flex-col items-center px-6 py-10">
        {/* 顶部小徽标 */}
        <div className="flex items-center gap-2 text-xs font-display tracking-[0.4em] text-neon-cyan/70">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SINGLE-PLAYER · CANVAS ARCADE</span>
          <Sparkles className="w-3.5 h-3.5" />
        </div>

        {/* 标题 */}
        <div className="mt-6 flex flex-col items-center text-center">
          <h1 className="font-display font-black text-6xl md:text-7xl tracking-[0.18em] leading-none">
            <span
              className="bg-gradient-to-r from-neon-cyan via-white to-neon-purple bg-clip-text text-transparent animate-glow"
              style={{ WebkitBackgroundClip: 'text' }}
            >
              BALL
            </span>
            <span
              className="bg-gradient-to-r from-neon-purple via-white to-neon-cyan bg-clip-text text-transparent animate-glow ml-3"
              style={{ WebkitBackgroundClip: 'text' }}
            >
              FORGE
            </span>
          </h1>
          <div className="mt-3 font-display tracking-[0.6em] text-[11px] text-neon-purple/80">
            球 · 球 · 大 · 冒 · 险
          </div>
          <div className="mt-2 text-sm text-zinc-400 max-w-xl">
            用方向键或 WASD 移动,<kbd className="kbd">Space</kbd> 冲刺撞击。撞毁所有敌人以解锁下一关。
          </div>
        </div>

        {/* 统计 */}
        <div className="mt-6 flex items-center gap-6 text-xs font-display text-zinc-400">
          <div className="flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-neon-amber" />
            <span className="num text-neon-amber">{totalBest.toLocaleString()}</span>
            <span>总得分</span>
          </div>
          <div className="h-3 w-px bg-zinc-700" />
          <div className="flex items-center gap-1.5">
            <span className="num text-neon-cyan">{totalCleared}</span>
            <span>/</span>
            <span className="num">{TOTAL_LEVELS}</span>
            <span>已通关</span>
          </div>
        </div>

        {/* 关卡卡片网格 */}
        <div className="mt-8 w-full max-w-5xl flex-1 min-h-0 overflow-auto px-2">
          <div className="grid grid-cols-5 gap-3 md:gap-4">
            {levels.map((lv, idx) => {
              const t = getTheme(lv.id);
              const unlocked = lv.unlocked;
              return (
                <button
                  key={lv.id}
                  disabled={!unlocked}
                  onClick={() => navigate(`/play/${lv.id}`)}
                  className={[
                    'group relative flex flex-col items-stretch p-3 rounded-xl border transition-all overflow-hidden',
                    unlocked
                      ? 'glass hover:scale-[1.04] hover:border-neon-cyan/60 cursor-pointer'
                      : 'glass locked-card cursor-not-allowed',
                  ].join(' ')}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <div
                    className="absolute inset-0 opacity-30 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 0%, ${t.primary}33, transparent 60%)`,
                    }}
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="font-display text-[10px] tracking-[0.3em] text-zinc-400">
                      LV
                    </div>
                    {unlocked ? (
                      <div
                        className="font-display text-xl num"
                        style={{ color: t.primary, textShadow: `0 0 12px ${t.glow}` }}
                      >
                        {String(lv.id).padStart(2, '0')}
                      </div>
                    ) : (
                      <Lock className="w-4 h-4 text-zinc-600" />
                    )}
                  </div>
                  <div
                    className="relative mt-1 text-[10px] font-display tracking-[0.15em] truncate"
                    style={{ color: unlocked ? '#E5E7EB' : '#52525B' }}
                  >
                    {t.name}
                  </div>
                  <div className="relative mt-2 flex items-end justify-between">
                    <div>
                      <div className="text-[9px] text-zinc-500 font-display tracking-widest">BEST</div>
                      <div className="num text-sm" style={{ color: unlocked ? t.accent : '#52525B' }}>
                        {lv.bestScore > 0 ? lv.bestScore.toLocaleString() : '— —'}
                      </div>
                    </div>
                    {unlocked && (
                      <ChevronRight
                        className="w-4 h-4 text-zinc-400 group-hover:translate-x-1 transition-transform"
                        style={{ color: t.primary }}
                      />
                    )}
                  </div>
                  {/* 底部细线 */}
                  <div
                    className="absolute left-3 right-3 bottom-0 h-px"
                    style={{ background: `linear-gradient(90deg, transparent, ${t.primary}99, transparent)` }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* 底部操作 */}
        <div className="mt-4 flex items-center gap-3">
          <button
            className="btn-neon"
            onClick={() => {
              const firstUncleared = levels.find((l) => l.unlocked);
              if (firstUncleared) navigate(`/play/${firstUncleared.id}`);
            }}
            disabled={!levels.some((l) => l.unlocked)}
          >
            <Play className="w-4 h-4" /> 开始挑战
          </button>
          <button
            className="btn-ghost"
            onClick={() => {
              if (confirming) {
                reset();
                setConfirming(false);
              } else {
                setConfirming(true);
                setTimeout(() => setConfirming(false), 2200);
              }
            }}
          >
            <Trash2 className="w-3.5 h-3.5" />
            {confirming ? '再次点击以确认清空' : '清空存档'}
          </button>
        </div>
      </div>
    </div>
  );
}
