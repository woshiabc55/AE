import type { Shot } from '@/data/types';
import { CHAPTERS } from '@/data/chapters';

interface PlayerHUDProps {
  shot: Shot;
  currentIndex: number;
  totalShots: number;
  totalElapsed: number;
  isPlaying: boolean;
  muted: boolean;
  showSubtitles: boolean;
  showPrompts: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onToggleSubtitles: () => void;
  onTogglePrompts: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSeek: (i: number) => void;
  onChapter: (id: number) => void;
}

export function PlayerHUD(props: PlayerHUDProps) {
  const {
    shot,
    currentIndex,
    totalShots,
    totalElapsed,
    isPlaying,
    muted,
    showSubtitles,
    showPrompts,
    onTogglePlay,
    onToggleMute,
    onToggleSubtitles,
    onTogglePrompts,
    onPrev,
    onNext,
    onSeek,
    onChapter,
  } = props;
  const chapter = CHAPTERS.find((c) => c.id === shot.chapter);
  const progressPct = (currentIndex / Math.max(1, totalShots - 1)) * 100;

  return (
    <div className="absolute inset-x-0 bottom-0 z-20 pointer-events-none">
      <div className="hud-bar pointer-events-auto">
        {/* 段落信息 */}
        <div className="px-6 lg:px-10 pt-3 pb-1 flex items-center justify-between text-xs tracking-widest uppercase text-gold/60">
          <div className="flex items-center gap-3">
            <span className="shot-num">CH.{String(shot.chapter).padStart(2, '0')}</span>
            {chapter && <span className="text-paper/80 serif-display text-sm">{chapter.title}</span>}
          </div>
          <div className="hidden md:flex items-center gap-3 shot-num">
            <span>{String(currentIndex + 1).padStart(2, '0')} / {String(totalShots).padStart(2, '0')}</span>
            <span className="text-gold/40">·</span>
            <span>{formatTime(totalElapsed)}</span>
          </div>
        </div>

        {/* 进度条 */}
        <div className="px-6 lg:px-10 pt-2">
          <input
            type="range"
            min={0}
            max={totalShots - 1}
            value={currentIndex}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="w-full h-1 appearance-none bg-transparent cursor-pointer accent-gold"
            style={{
              background: 'linear-gradient(to right, #C9A972 0%, #C9A972 ' + progressPct + '%, rgba(201,169,114,0.12) ' + progressPct + '%, rgba(201,169,114,0.12) 100%)',
              height: 4,
              borderRadius: 2,
            }}
          />
          <div className="flex justify-between mt-1 text-[10px] shot-num text-gold/30">
            {CHAPTERS.map((c) => (
              <button
                key={c.id}
                onClick={() => onChapter(c.id)}
                className={`hover:text-gold transition-colors ${
                  c.id === shot.chapter ? 'text-gold' : ''
                }`}
              >
                {String(c.id).padStart(2, '0')}
              </button>
            ))}
          </div>
        </div>

        {/* 控制条 */}
        <div className="px-6 lg:px-10 py-3 flex items-center gap-2 md:gap-4">
          <button
            onClick={onPrev}
            className="hud-btn"
            title="上一镜"
            aria-label="上一镜"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M19 20L9 12L19 4V20Z" />
              <line x1="5" y1="4" x2="5" y2="20" />
            </svg>
          </button>
          <button
            onClick={onTogglePlay}
            className="hud-btn-primary"
            aria-label={isPlaying ? '暂停' : '播放'}
          >
            {isPlaying ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <polygon points="6 4 20 12 6 20 6 4" />
              </svg>
            )}
          </button>
          <button
            onClick={onNext}
            className="hud-btn"
            title="下一镜"
            aria-label="下一镜"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M5 4L15 12L5 20V4Z" />
              <line x1="19" y1="4" x2="19" y2="20" />
            </svg>
          </button>

          <div className="ml-2 text-xs shot-num text-gold/60">
            {String(shot.id).padStart(2, '0')}.{shot.sub}
          </div>
          <div className="hidden md:block ml-2 text-xs text-paper/60 serif-display tracking-wider">
            {shot.vfx}
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <button
              onClick={onToggleSubtitles}
              className={`hud-btn ${showSubtitles ? 'hud-btn-active' : ''}`}
              title="字幕"
            >
              字幕
            </button>
            <button
              onClick={onTogglePrompts}
              className={`hud-btn ${showPrompts ? 'hud-btn-active' : ''}`}
              title="AIGC 提示词"
            >
              提示词
            </button>
            <button
              onClick={onToggleMute}
              className={`hud-btn ${muted ? 'hud-btn-active' : ''}`}
              title="静音"
            >
              {muted ? '🔇' : '🔊'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .hud-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 36px;
          height: 32px;
          padding: 0 10px;
          color: rgba(239, 231, 214, 0.7);
          border: 1px solid rgba(201, 169, 114, 0.15);
          background: rgba(14, 17, 22, 0.4);
          font-family: 'Noto Serif SC', serif;
          font-size: 12px;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s;
        }
        .hud-btn:hover {
          color: #C9A972;
          border-color: rgba(201, 169, 114, 0.4);
          background: rgba(201, 169, 114, 0.08);
        }
        .hud-btn-active {
          color: #C2502A;
          border-color: rgba(194, 80, 42, 0.6);
          background: rgba(194, 80, 42, 0.12);
        }
        .hud-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 44px;
          height: 36px;
          padding: 0 14px;
          color: #EFE7D6;
          border: 1px solid rgba(201, 169, 114, 0.6);
          background: linear-gradient(180deg, rgba(194, 80, 42, 0.2) 0%, rgba(14, 17, 22, 0.4) 100%);
          cursor: pointer;
          transition: all 0.3s;
        }
        .hud-btn-primary:hover {
          color: #C9A972;
          border-color: #C9A972;
          box-shadow: 0 0 16px rgba(194, 80, 42, 0.4);
        }
      `}</style>
    </div>
  );
}

function formatTime(ms: number) {
  const total = Math.floor(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
