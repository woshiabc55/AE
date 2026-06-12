import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, ChevronLeft, Home as HomeIcon, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { useSaveStore } from '@/store/saveStore';
import { getTheme } from '@/game/theme';

export default function Result() {
  const { levelId = '1' } = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const id = Math.max(1, Math.min(10, parseInt(levelId, 10) || 1));
  const outcome = (search.get('outcome') as 'win' | 'lose' | null) ?? 'win';
  const newBest = search.get('newBest') === '1';
  const unlockedNext = search.get('unlockedNext') === '1';
  const level = useSaveStore((s) => s.levels.find((l) => l.id === id));
  const theme = useMemo(() => getTheme(id), [id]);

  // 入场动画
  const [reveal, setReveal] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setReveal(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-grid">
      <div className="scanline animate-scanline" />
      <div className="absolute inset-0 z-0 opacity-30" style={{
        background: `radial-gradient(circle at 50% 40%, ${theme.primary}22, transparent 60%)`,
      }} />

      <div className="relative z-20 h-full w-full flex flex-col items-center justify-center px-6">
        <div
          className={`glass-strong rounded-3xl p-8 w-[min(480px,92vw)] text-center transition-all duration-500 ${
            reveal ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          {/* 顶部小徽标 */}
          <div className="flex items-center justify-center gap-2 text-[10px] font-display tracking-[0.5em]" style={{ color: theme.primary }}>
            <Sparkles className="w-3 h-3" />
            <span>{outcome === 'win' ? 'CLEAR' : 'TRY AGAIN'}</span>
            <Sparkles className="w-3 h-3" />
          </div>

          {/* 大标题 */}
          <h2
            className="mt-3 font-display text-5xl font-black tracking-[0.18em] leading-none"
            style={{
              color: outcome === 'win' ? theme.primary : '#F43F5E',
              textShadow: `0 0 24px ${outcome === 'win' ? theme.glow : '#F43F5E'}`,
            }}
          >
            {outcome === 'win' ? 'VICTORY' : 'DEFEATED'}
          </h2>

          <div className="mt-2 font-display text-[11px] tracking-[0.4em] text-zinc-400">
            LV {String(id).padStart(2, '0')} · {theme.name}
          </div>

          {/* 数据卡 */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            <Stat label="SCORE" value={level?.bestScore.toLocaleString() ?? '—'} color={theme.accent} />
            <Stat label="BEST TIME" value={formatTime(level?.bestTimeMs ?? 0)} color={theme.primary} />
            <Stat label="KILLS" value={`${level && level.bestScore > 0 ? Math.ceil(level.bestScore / 50) : 0}`} color="#FBBF24" />
          </div>

          {newBest && outcome === 'win' && (
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-amber/50 bg-neon-amber/10 text-neon-amber text-xs font-display tracking-[0.25em]">
              <Trophy className="w-3.5 h-3.5" /> NEW BEST
            </div>
          )}
          {unlockedNext && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-neon-cyan/50 bg-neon-cyan/10 text-neon-cyan text-xs font-display tracking-[0.25em]">
              <ArrowRight className="w-3.5 h-3.5" /> 下一关已解锁
            </div>
          )}

          {/* 操作 */}
          <div className="mt-7 flex flex-col gap-2">
            <button
              className="btn-neon w-full justify-center"
              onClick={() => navigate(`/play/${id}`)}
            >
              <RotateCcw className="w-4 h-4" /> {outcome === 'win' ? '再玩一次' : '再试一次'}
            </button>
            {outcome === 'win' && id < 10 && (
              <button
                className="btn-neon w-full justify-center"
                style={{
                  background: `linear-gradient(180deg, ${theme.primary}22, ${theme.accent}22)`,
                  borderColor: `${theme.primary}88`,
                }}
                onClick={() => navigate(`/play/${id + 1}`)}
              >
                <ArrowRight className="w-4 h-4" /> 下一关
              </button>
            )}
            <Link
              to="/"
              className="btn-ghost w-full justify-center"
            >
              <HomeIcon className="w-4 h-4" /> 返回菜单
            </Link>
          </div>
        </div>

        <Link
          to="/"
          className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 flex items-center gap-1"
        >
          <ChevronLeft className="w-3 h-3" /> 返回主菜单
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-zinc-700/60 bg-space-800/60 px-3 py-2">
      <div className="text-[9px] font-display tracking-[0.3em] text-zinc-500">{label}</div>
      <div className="mt-0.5 num text-base" style={{ color }}>{value}</div>
    </div>
  );
}

function formatTime(ms: number) {
  if (!ms) return '— —';
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60).toString().padStart(2, '0');
  const s = (total % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
