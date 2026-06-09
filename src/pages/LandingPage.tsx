import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DotMatrix } from '@/components/visual/DotMatrix';
import { LightArc } from '@/components/visual/LightArc';
import { CrackleField } from '@/components/visual/CrackleField';
import { CHAPTERS } from '@/data/chapters';

export function LandingPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    if (countdown <= 0) {
      navigate('/player');
      return;
    }
    const id = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [countdown, navigate, paused]);

  return (
    <div className="min-h-screen w-full bg-ink relative overflow-hidden">
      {/* 背景层 */}
      <div className="absolute inset-0">
        <DotMatrix seed="landing-bg" cols={100} rows={56} color="#6FA39B" density={0.18} scale={0.5} />
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(14,17,22,0.6) 60%, rgba(14,17,22,0.95) 100%)',
        }} />
      </div>

      {/* 光弧环绕 */}
      <div className="absolute inset-0 pointer-events-none">
        <LightArc rotate={0} arc={Math.PI * 1.6} radius={42} color="#C2502A" width={1.6} blur={14} opacity={0.7} />
        <LightArc rotate={120} arc={Math.PI * 0.8} radius={32} color="#C9A972" width={0.8} blur={10} opacity={0.5} reverse />
        <LightArc rotate={240} arc={Math.PI * 1.2} radius={36} color="#C2502A" width={1} blur={8} opacity={0.6} />
      </div>

      {/* 裂纹 */}
      <div className="absolute inset-0 pointer-events-none">
        <CrackleField seed="landing-crack" count={20} color="#C9A972" width={0.6} />
      </div>

      {/* 噪点 */}
      <div className="grain absolute inset-0" />
      <div className="vignette absolute inset-0" />

      {/* 顶部导航 */}
      <div className="relative z-10 px-8 lg:px-12 py-6 flex items-center justify-between text-xs tracking-widest">
        <div className="text-gold/60 shot-num">GE YAO · 哥窑</div>
        <nav className="flex items-center gap-6">
          <button onClick={() => navigate('/chapter')} className="text-paper/70 hover:text-gold transition-colors">章节</button>
          <button onClick={() => navigate('/about')} className="text-paper/70 hover:text-gold transition-colors">关于</button>
        </nav>
      </div>

      {/* Hero */}
      <div className="relative z-10 flex flex-col items-center justify-center px-8 pt-12 pb-20 min-h-[calc(100vh-100px)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="text-center"
        >
          <div className="text-gold/50 text-xs shot-num tracking-[0.4em] mb-6">
            SOUTHERN SONG · LONGQUAN · AIGC STORYBOARD
          </div>
          <h1 className="serif-display text-6xl md:text-8xl lg:text-9xl text-paper leading-none mb-2">
            <span className="fire-char">哥</span>
            <span className="fire-char">窑</span>
            <span className="mx-4 text-gold/40">·</span>
            <span className="fire-char">开</span>
            <span className="fire-char">片</span>
          </h1>
          <div className="serif-display text-xl md:text-2xl lg:text-3xl text-gold/80 mt-6 tracking-wider">
            一只裂纹碗的千年旅程
          </div>
          <div className="text-paper/50 text-sm md:text-base mt-6 max-w-2xl mx-auto leading-loose serif-display">
            胎与釉在火中争吵，裂出第一道纹。<br />
            兄弟在山河南北分头，把裂纹带去更远的地方。<br />
            ——这是一个关于「不完美如何被敬奉为美」的故事。
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-16 flex flex-col items-center gap-6"
        >
          <button
            onClick={() => navigate('/player')}
            className="btn-line btn-kiln px-12 py-4 text-base"
          >
            {countdown > 0 ? `开始放映 · ${countdown}` : '进入画布'}
          </button>
          {paused && countdown > 0 && (
            <button onClick={() => setPaused(false)} className="text-xs text-gold/60 hover:text-gold">
              继续倒计时
            </button>
          )}
          {!paused && countdown > 0 && (
            <button onClick={() => setPaused(true)} className="text-xs text-paper/40 hover:text-paper/70">
              暂停倒计时
            </button>
          )}
        </motion.div>

        {/* 章节卡片预览 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="mt-20 w-full max-w-6xl"
        >
          <div className="text-gold/40 text-[10px] shot-num tracking-[0.3em] text-center mb-4">
            9 CHAPTERS · 74 SHOTS · 4:30
          </div>
          <div className="grid grid-cols-3 md:grid-cols-9 gap-2 md:gap-3">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate(`/player?start=${c.shots[0].id}`)}
                className="group relative aspect-[3/4] border border-gold/20 hover:border-gold/60 transition-all overflow-hidden"
              >
                <div
                  className="absolute inset-0 transition-transform group-hover:scale-110"
                  style={{
                    background:
                      c.accent === 'kiln'
                        ? 'radial-gradient(ellipse at 50% 80%, rgba(194,80,42,0.5) 0%, transparent 60%)'
                        : c.accent === 'celadon'
                        ? 'radial-gradient(ellipse at 50% 50%, rgba(111,163,155,0.5) 0%, transparent 60%)'
                        : c.accent === 'gold'
                        ? 'radial-gradient(ellipse at 50% 50%, rgba(201,169,114,0.5) 0%, transparent 60%)'
                        : 'radial-gradient(ellipse at 50% 50%, rgba(122,64,48,0.4) 0%, transparent 60%)',
                    backgroundColor: '#0E1116',
                  }}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-2">
                  <div className="text-gold/40 shot-num text-[8px] mb-1">
                    {String(c.id).padStart(2, '0')}
                  </div>
                  <div className="text-paper/90 serif-display text-[10px] md:text-xs leading-tight text-center">
                    {c.title}
                  </div>
                </div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-gold/5" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 底部 footer */}
      <div className="absolute bottom-4 left-0 right-0 z-10 px-8 text-center text-[10px] shot-num text-gold/30 tracking-widest">
        GE·YAO OPEN PIXEL · 2026 · CINEMATIC STORYBOARD
      </div>
    </div>
  );
}
