import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlayerStore } from '@/store/usePlayerStore';
import { ALL_SHOTS } from '@/data/scripts';
import { CHAPTERS, TOTAL_DURATION_MS } from '@/data/chapters';
import { ShotCanvas } from '@/components/visual/ShotCanvas';
import { PlayerHUD } from '@/components/player/PlayerHUD';
import { PromptPanel } from '@/components/player/PromptPanel';
import { usePlayback, getPlaybackElapsed } from '@/hooks/usePlayback';
import { useAudio } from '@/hooks/useAudio';

export function PlayerPage() {
  usePlayback();
  useAudio();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const {
    currentIndex,
    isPlaying,
    muted,
    showSubtitles,
    showPrompts,
    speed,
    setIndex,
    next,
    prev,
    togglePlay,
    toggleMute,
    toggleSubtitles,
    togglePrompts,
  } = usePlayerStore();
  const [_, setTick] = useState(0);
  const [showEnd, setShowEnd] = useState(false);

  // 同步进度显示（10fps）
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      setTick((n) => (n + 1) % 1000);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  useEffect(() => {
    const start = params.get('start');
    if (start) {
      const i = parseInt(start, 10);
      if (!isNaN(i)) setIndex(i - 1);
    }
    // 自动播放（如果用户已交互）
    const t = setTimeout(() => {
      if (!usePlayerStore.getState().isPlaying) togglePlay();
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 监听结束
  useEffect(() => {
    if (currentIndex === 0 && isPlaying && (window as unknown as { __startedOnce?: boolean }).__startedOnce) {
      // 回到首镜
    }
    (window as unknown as { __startedOnce?: boolean }).__startedOnce = true;
  }, [currentIndex, isPlaying]);

  useEffect(() => {
    if (currentIndex === ALL_SHOTS.length - 1 && isPlaying) {
      const id = setTimeout(() => setShowEnd(true), ALL_SHOTS[currentIndex].duration);
      return () => clearTimeout(id);
    }
  }, [currentIndex, isPlaying]);

  const shot = ALL_SHOTS[currentIndex];
  const chapter = CHAPTERS.find((c) => c.id === shot.chapter);

  const handleChapter = (id: number) => {
    const target = ALL_SHOTS.findIndex((s) => s.chapter === id);
    if (target >= 0) setIndex(target);
  };

  return (
    <div className="fixed inset-0 bg-ink overflow-hidden">
      {/* 顶部小栏 */}
      <div className="absolute top-0 left-0 right-0 z-30 px-6 lg:px-10 py-3 flex items-center justify-between pointer-events-none">
        <button
          onClick={() => navigate('/')}
          className="pointer-events-auto text-paper/70 hover:text-gold transition-colors flex items-center gap-2 text-xs tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
            <path d="M19 12H5M12 19L5 12L12 5" />
          </svg>
          <span>哥窑开片</span>
        </button>
        <div className="hidden md:flex items-center gap-4 text-[10px] shot-num text-gold/40 tracking-widest">
          <span>{chapter?.title}</span>
          <span>·</span>
          <span>4:30 / 74 镜</span>
        </div>
      </div>

      {/* 主舞台（16:9） */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="relative w-full h-full"
          style={{ maxWidth: 'min(100vw, calc(100vh * 16 / 9))', maxHeight: '100vh', aspectRatio: '16/9' }}
        >
          {/* 转场蒙层 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={shot.id}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <ShotCanvas
                shot={shot}
                subtitle={showSubtitles ? shot.dialogue : undefined}
              />
            </motion.div>
          </AnimatePresence>

          {/* 速度提示 */}
          {speed === 0.4 && (
            <div className="absolute top-16 right-6 lg:right-10 z-20 px-2 py-0.5 border border-gold/40 text-gold text-[10px] shot-num tracking-widest">
              0.4× SLOW-MO
            </div>
          )}

          {/* 暂停提示 */}
          {!isPlaying && currentIndex > 0 && (
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 border border-paper/40 rounded-full flex items-center justify-center bg-ink/40 backdrop-blur-sm">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                  <polygon points="6 4 20 12 6 20 6 4" />
                </svg>
              </div>
            </div>
          )}

          {/* AIGC 提示词面板 */}
          <PromptPanel shot={shot} visible={showPrompts} onClose={() => togglePrompts()} />
        </div>
      </div>

      {/* HUD */}
      <PlayerHUD
        shot={shot}
        currentIndex={currentIndex}
        totalShots={ALL_SHOTS.length}
        totalElapsed={getPlaybackElapsed()}
        isPlaying={isPlaying}
        muted={muted}
        showSubtitles={showSubtitles}
        showPrompts={showPrompts}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        onToggleSubtitles={toggleSubtitles}
        onTogglePrompts={togglePrompts}
        onPrev={prev}
        onNext={next}
        onSeek={setIndex}
        onChapter={handleChapter}
      />

      {/* 结束幕 */}
      <AnimatePresence>
        {showEnd && (
          <motion.div
            className="absolute inset-0 z-40 bg-ink/95 backdrop-blur flex flex-col items-center justify-center px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center max-w-2xl">
              <div className="text-gold/50 text-xs shot-num tracking-[0.3em] mb-4">
                EPILOGUE
              </div>
              <div className="serif-display text-3xl md:text-4xl lg:text-5xl text-paper leading-relaxed mb-8">
                真正活过的东西<br />
                <span className="text-gold fire-char">都会留下痕迹</span>
              </div>
              <div className="text-paper/60 text-sm leading-loose mb-12">
                谨以此片，致敬所有在泥土与火焰中，留下掌纹的人。
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => {
                    setShowEnd(false);
                    setIndex(0);
                    setTimeout(togglePlay, 100);
                  }}
                  className="btn-line btn-kiln"
                >
                  再看一次
                </button>
                <button
                  onClick={() => navigate('/chapter')}
                  className="btn-line"
                >
                  返回章节
                </button>
                <button
                  onClick={() => navigate('/about')}
                  className="btn-line"
                >
                  创作笔记
                </button>
              </div>
              <div className="mt-12 text-[10px] shot-num text-gold/30 tracking-widest">
                TOTAL · {Math.round(TOTAL_DURATION_MS / 1000)}S · {ALL_SHOTS.length} SHOTS · 9 CHAPTERS
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 占位：避免 lint 报错 tickRef */}
      <div className="hidden" />
    </div>
  );
}
