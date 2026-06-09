import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CHAPTERS } from '@/data/chapters';
import { DotMatrix } from '@/components/visual/DotMatrix';
import { CrackleField } from '@/components/visual/CrackleField';
import { LightArc } from '@/components/visual/LightArc';

export function ChapterPage() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full bg-ink relative overflow-hidden">
      {/* 背景 */}
      <div className="fixed inset-0 -z-0">
        <DotMatrix seed="chapter-bg" cols={80} rows={45} color="#6FA39B" density={0.12} scale={0.5} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,169,114,0.05) 0%, transparent 50%)' }} />
        <CrackleField seed="chapter-crack" count={12} color="#C9A972" width={0.4} />
      </div>

      {/* 顶部 */}
      <div className="relative z-10 px-8 lg:px-12 py-6 flex items-center justify-between border-b border-gold/10">
        <button
          onClick={() => navigate('/')}
          className="text-paper/70 hover:text-gold transition-colors flex items-center gap-2 text-xs tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
          返回首页
        </button>
        <div className="text-gold/60 shot-num text-xs tracking-widest">CHAPTERS · 8 段 + 致敬</div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-12 py-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="text-gold/50 text-[10px] shot-num tracking-[0.4em] mb-4">CHAPTERS</div>
          <h1 className="serif-display text-4xl md:text-5xl text-paper">九段火与裂</h1>
          <div className="text-paper/50 mt-4 serif-display">火·初生 → 问 → 裂 → 别 → 迁 → 燃 → 渡 → 绊 → 致敬</div>
        </motion.div>

        <div className="space-y-6">
          {CHAPTERS.map((c, i) => {
            const isActive = activeId === c.id;
            const total = c.shots.reduce((s, sh) => s + sh.duration, 0);
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`group relative border transition-all cursor-pointer overflow-hidden ${
                  isActive
                    ? 'border-gold/70 bg-ink/80'
                    : 'border-gold/15 bg-ink/40 hover:border-gold/40 hover:bg-ink/60'
                }`}
                onClick={() => setActiveId(isActive ? null : c.id)}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 md:p-8">
                  {/* 镜号大字 */}
                  <div className="md:col-span-2 flex flex-col justify-center">
                    <div className="text-gold/30 shot-num text-xs tracking-widest mb-1">
                      CHAPTER
                    </div>
                    <div className="text-gold/80 shot-num text-5xl md:text-6xl serif-display leading-none">
                      {String(c.id).padStart(2, '0')}
                    </div>
                  </div>

                  {/* 标题 + 简介 */}
                  <div className="md:col-span-6 flex flex-col justify-center">
                    <h2 className="serif-display text-2xl md:text-3xl text-paper mb-2">
                      {c.title}
                    </h2>
                    <div className="text-gold/60 text-xs shot-num tracking-widest mb-3">
                      {c.shots.length} 镜 · {Math.round(total / 1000)} 秒
                    </div>
                    <p className="text-paper/70 text-sm md:text-base leading-loose serif-display">
                      {c.intro}
                    </p>
                  </div>

                  {/* 视觉缩略 */}
                  <div className="md:col-span-3 relative aspect-[16/9] border border-gold/20 overflow-hidden">
                    <div className="absolute inset-0">
                      <DotMatrix
                        seed={`ch-${c.id}`}
                        cols={28}
                        rows={16}
                        color={
                          c.accent === 'kiln' ? '#C2502A'
                          : c.accent === 'celadon' ? '#6FA39B'
                          : c.accent === 'gold' ? '#C9A972'
                          : '#7A4030'
                        }
                        density={0.45}
                        scale={0.6}
                      />
                      {c.id === 3 || c.id === 5 ? (
                        <CrackleField seed={`ch-crack-${c.id}`} count={6} color="#C9A972" width={0.5} />
                      ) : null}
                      {c.id === 6 || c.id === 1 ? (
                        <div className="absolute inset-0">
                          <LightArc rotate={0} radius={40} color="#C2502A" width={0.8} blur={4} />
                        </div>
                      ) : null}
                    </div>
                    <div className="absolute inset-0 flex items-end p-2">
                      <div className="text-paper/40 text-[8px] shot-num tracking-widest">
                        {c.id}.1 - {c.id}.{c.shots.length}
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="md:col-span-1 flex md:flex-col items-center justify-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/player?start=${c.shots[0].id}`);
                      }}
                      className="hud-btn"
                      style={{ minWidth: 60 }}
                    >
                      播放
                    </button>
                  </div>
                </div>

                {/* 展开的镜列表 */}
                {isActive && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gold/10 bg-ink/60"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10">
                      {c.shots.map((sh) => (
                        <button
                          key={sh.id}
                          onClick={() => navigate(`/player?start=${sh.id}`)}
                          className="bg-ink/95 hover:bg-ink/70 transition-colors p-4 text-left"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gold/60 shot-num text-[10px] tracking-widest">
                              镜 {String(sh.id).padStart(2, '0')}.{sh.sub}
                            </span>
                            <span className="text-paper/40 text-[10px] shot-num">
                              {sh.duration / 1000}s
                            </span>
                          </div>
                          <div className="text-paper/80 text-xs serif-display leading-relaxed line-clamp-2">
                            {sh.prompt.split(',').slice(0, 2).join(', ')}
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <button
            onClick={() => navigate('/player')}
            className="btn-line btn-kiln px-10"
          >
            从头开始播放
          </button>
        </div>
      </div>
    </div>
  );
}
