import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Pause, Play, RotateCcw, Home as HomeIcon, Heart, Zap, Timer } from 'lucide-react';
import { GameEngine } from '@/game/engine';
import { Renderer } from '@/game/renderer';
import { ParticleSystem } from '@/game/particles';
import { buildLevel, WORLD_H, WORLD_W } from '@/game/level';
import { getTheme } from '@/game/theme';
import { setupKeyboard, setupTouch, type TouchStickState } from '@/game/input';
import { useSaveStore } from '@/store/saveStore';

type Status = 'PLAYING' | 'WIN' | 'LOSE';

export default function PlayPage() {
  const { levelId = '1' } = useParams();
  const navigate = useNavigate();
  const id = Math.max(1, Math.min(10, parseInt(levelId, 10) || 1));

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const particlesRef = useRef<ParticleSystem | null>(null);
  const stickRef = useRef<TouchStickState>({
    active: false,
    touchId: null,
    origin: { x: 0, y: 0 },
    current: { x: 0, y: 0 },
  });

  const theme = useMemo(() => getTheme(id), [id]);
  const [status, setStatus] = useState<Status>('PLAYING');
  const [paused, setPaused] = useState(false);
  const [tick, setTick] = useState(0); // 强制重渲染 HUD
  const [showHint, setShowHint] = useState(true);

  const recordResult = useSaveStore((s) => s.recordResult);

  // 初始化引擎
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const level = buildLevel(id);
    const particles = new ParticleSystem();
    const engine = new GameEngine(level, particles, {
      onScore: () => setTick((t) => t + 1),
      onPlayerHit: () => setTick((t) => t + 1),
      onEnemyKilled: () => setTick((t) => t + 1),
      onWin: () => {
        setStatus('WIN');
        const score = engine.stats.score;
        const time = engine.stats.elapsedMs;
        const result = recordResult(id, score, time);
        // 短暂停留后跳转
        setTimeout(() => {
          navigate(`/result/${id}?outcome=win&newBest=${result.newBest ? 1 : 0}&unlockedNext=${result.unlockedNext ? 1 : 0}`);
        }, 1200);
      },
      onLose: () => {
        setStatus('LOSE');
        const score = engine.stats.score;
        const time = engine.stats.elapsedMs;
        recordResult(id, score, time);
        setTimeout(() => {
          navigate(`/result/${id}?outcome=lose`);
        }, 1200);
      },
    }, theme);
    engineRef.current = engine;
    rendererRef.current = new Renderer(canvas.getContext('2d')!);
    particlesRef.current = particles;

    // 自适应尺寸
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      const w = Math.floor(rect.width);
      const h = Math.floor(rect.height);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.getContext('2d')?.setTransform(dpr, 0, 0, dpr, 0, 0);
      engine.resize(w, h);
    };
    resize();
    window.addEventListener('resize', resize);

    // 输入
    const kbCleanup = setupKeyboard(engine.input);
    const touchCleanup = setupTouch(
      stickRef.current,
      engine.input,
      () => canvas.getBoundingClientRect()
    );

    return () => {
      window.removeEventListener('resize', resize);
      kbCleanup();
      touchCleanup();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // 主循环
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      const engine = engineRef.current;
      const renderer = rendererRef.current;
      if (engine && renderer) {
        if (paused) {
          // 暂停时只渲染,更新相机平滑
          engine.camera.x += (engine.player.pos.x - engine.camera.x) * Math.min(1, dt * 6);
          engine.camera.y += (engine.player.pos.y - engine.camera.y) * Math.min(1, dt * 6);
        } else {
          engine.update(dt, t);
        }
        renderer.render(engine, t);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [paused]);

  // 自动隐藏提示
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 4500);
    return () => clearTimeout(t);
  }, [showHint]);

  const engine = engineRef.current;
  const stats = engine?.stats ?? { score: 0, kills: 0, elapsedMs: 0, hp: 5 };

  return (
    <div ref={containerRef} className="relative h-full w-full overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* 顶部 HUD */}
      <div className="absolute inset-x-0 top-0 z-20 px-4 pt-4 pointer-events-none">
        <div className="flex items-start justify-between gap-3">
          {/* 左上:关卡 + 血量 + 分数 */}
          <div className="glass-strong rounded-2xl px-4 py-3 pointer-events-auto">
            <div className="flex items-center gap-2 text-[10px] font-display tracking-[0.3em]" style={{ color: theme.primary }}>
              <span>LV {String(id).padStart(2, '0')}</span>
              <span className="text-zinc-600">·</span>
              <span className="text-zinc-300">{theme.name}</span>
            </div>
            <div className="mt-1 flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-neon-red" />
                <span className="num text-sm text-white">{Math.max(0, stats.hp)}</span>
                <span className="text-zinc-500 text-xs">/5</span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" style={{ color: theme.accent }} />
                <span className="num text-sm" style={{ color: theme.accent }}>
                  {stats.score.toLocaleString()}
                </span>
              </div>
              <div className="h-3 w-px bg-zinc-700" />
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-display text-zinc-500">KILLS</span>
                <span className="num text-sm text-white">{stats.kills}</span>
              </div>
            </div>
            {/* 血条 */}
            <div className="mt-2 h-1.5 w-44 rounded-full bg-space-700 overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${Math.max(0, (stats.hp / 5) * 100)}%`,
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.accent})`,
                  boxShadow: `0 0 12px ${theme.glow}`,
                }}
              />
            </div>
          </div>

          {/* 右上:时间 + 返回 + 重玩 + 暂停 */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <div className="glass rounded-xl px-3 py-2 flex items-center gap-1.5">
              <Timer className="w-3.5 h-3.5 text-zinc-400" />
              <span className="num text-sm text-zinc-200">{formatTime(stats.elapsedMs)}</span>
            </div>
            <button
              className="glass rounded-xl p-2 hover:border-neon-cyan/60"
              onClick={() => {
                engineRef.current?.reset();
                setStatus('PLAYING');
                setTick((t) => t + 1);
              }}
              title="重新开始"
            >
              <RotateCcw className="w-4 h-4 text-zinc-300" />
            </button>
            <button
              className="glass rounded-xl p-2 hover:border-neon-cyan/60"
              onClick={() => setPaused((p) => !p)}
              title={paused ? '继续' : '暂停'}
            >
              {paused ? <Play className="w-4 h-4 text-neon-cyan" /> : <Pause className="w-4 h-4 text-zinc-300" />}
            </button>
            <button
              className="glass rounded-xl p-2 hover:border-neon-red/60"
              onClick={() => navigate('/')}
              title="返回菜单"
            >
              <HomeIcon className="w-4 h-4 text-zinc-300" />
            </button>
          </div>
        </div>
      </div>

      {/* 提示卡 */}
      {showHint && status === 'PLAYING' && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-32 z-20 pointer-events-none">
          <div className="glass-strong rounded-2xl px-5 py-3 animate-slideUp">
            <div className="flex items-center gap-4 text-xs text-zinc-300 font-display tracking-wider">
              <span className="flex items-center gap-1.5">
                <Key>WASD</Key> 移动
              </span>
              <span className="text-zinc-700">|</span>
              <span className="flex items-center gap-1.5">
                <Key>SPACE</Key> 冲刺
              </span>
              <span className="text-zinc-700">|</span>
              <span style={{ color: theme.primary }}>撞毁所有敌人</span>
            </div>
          </div>
        </div>
      )}

      {/* 触摸摇杆(移动端) */}
      <TouchStick
        stick={stickRef.current}
        color={theme.primary}
        accent={theme.accent}
        onDash={() => {
          if (engineRef.current) engineRef.current.input.dashQueued = true;
        }}
      />

      {/* 暂停遮罩 */}
      {paused && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-space-950/70 backdrop-blur-sm">
          <div className="glass-strong rounded-3xl p-8 w-80 text-center animate-popIn">
            <div className="font-display tracking-[0.4em] text-sm" style={{ color: theme.primary }}>
              PAUSED
            </div>
            <div className="mt-4 text-zinc-300 text-sm">已暂停</div>
            <div className="mt-6 flex flex-col gap-2">
              <button
                className="btn-neon w-full justify-center"
                onClick={() => setPaused(false)}
              >
                <Play className="w-4 h-4" /> 继续
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={() => {
                  engineRef.current?.reset();
                  setPaused(false);
                  setStatus('PLAYING');
                  setTick((t) => t + 1);
                }}
              >
                <RotateCcw className="w-4 h-4" /> 重新开始
              </button>
              <button
                className="btn-ghost w-full justify-center"
                onClick={() => navigate('/')}
              >
                <ArrowLeft className="w-4 h-4" /> 返回菜单
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 胜利/失败中转闪光 */}
      {(status === 'WIN' || status === 'LOSE') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div
            className="font-display text-5xl tracking-[0.3em] animate-popIn"
            style={{
              color: status === 'WIN' ? theme.primary : '#F43F5E',
              textShadow: `0 0 24px ${status === 'WIN' ? theme.glow : '#F43F5E'}`,
            }}
          >
            {status === 'WIN' ? 'VICTORY' : 'DEFEATED'}
          </div>
        </div>
      )}
    </div>
  );
}

function Key({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="inline-flex items-center px-1.5 py-0.5 rounded border border-zinc-600 bg-zinc-800/80 text-[10px] text-zinc-200 num">
      {children}
    </kbd>
  );
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function TouchStick({
  stick,
  color,
  accent,
  onDash,
}: {
  stick: TouchStickState;
  color: string;
  accent: string;
  onDash: () => void;
}) {
  if (typeof window === 'undefined') return null;
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (!isTouch) return null;
  const ox = stick.origin.x;
  const oy = stick.origin.y;
  const cx = stick.current.x;
  const cy = stick.current.y;
  const dx = cx - ox;
  const dy = cy - oy;
  const mag = Math.min(60, Math.hypot(dx, dy));
  const angle = Math.atan2(dy, dx);
  const kx = Math.cos(angle) * mag;
  const ky = Math.sin(angle) * mag;
  return (
    <>
      {stick.active && (
        <>
          <div
            className="absolute z-20 rounded-full pointer-events-none"
            style={{
              left: ox - 60,
              top: oy - 60,
              width: 120,
              height: 120,
              border: `1px solid ${color}88`,
              background: `radial-gradient(circle, ${color}22, transparent 70%)`,
              boxShadow: `0 0 30px ${color}55`,
            }}
          />
          <div
            className="absolute z-20 rounded-full pointer-events-none"
            style={{
              left: ox + kx - 22,
              top: oy + ky - 22,
              width: 44,
              height: 44,
              background: `radial-gradient(circle at 30% 30%, #fff, ${color})`,
              boxShadow: `0 0 18px ${color}`,
            }}
          />
        </>
      )}
      <button
        className="absolute z-20 right-6 bottom-6 px-4 py-3 rounded-2xl font-display text-xs tracking-[0.2em]"
        style={{
          background: `linear-gradient(180deg, ${accent}33, ${color}33)`,
          border: `1px solid ${accent}88`,
          boxShadow: `0 0 20px ${accent}55`,
        }}
        onTouchStart={(e) => {
          e.preventDefault();
          onDash();
        }}
        onClick={onDash}
      >
        DASH
      </button>
    </>
  );
}
