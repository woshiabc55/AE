import { useEffect, useRef, useState } from "react";
import {
  ChevronUp,
  ListMusic,
  Pause,
  Play,
  Plus,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Trash2,
  Upload,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { usePlayerStore, formatTime } from "@/store/playerStore";
import GridMatrix from "./GridMatrix";
import { useFileUpload } from "@/hooks/useFileUpload";

/**
 * 底部单排播放器：
 * [封面] [标题/艺人] [可视化] [进度] [上/播停/下/模式] [音量] [上传] [列表]
 */
export default function PlayerBar() {
  const {
    playlist,
    currentId,
    playing,
    currentTime,
    duration,
    open,
    toggle,
    next,
    prev,
    seek,
    setOpen,
    uploadError,
  } = usePlayerStore();
  const { inputRef, open: openUpload, handleFiles } = useFileUpload();

  const current = playlist.find((t) => t.id === currentId) ?? playlist[0];
  const isUploaded = currentId.startsWith("up-");

  // 心跳：仅在没有真实音频时（demo 曲目）使用
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      const s = usePlayerStore.getState();
      const hasRealAudio = !!s.audioEl?.src;
      if (!hasRealAudio && s.playing) {
        const nt = s.currentTime + dt / s.duration;
        if (nt >= 1) {
          usePlayerStore.getState().next();
        } else {
          usePlayerStore.setState({ currentTime: nt, tick: s.tick + 1 });
        }
      } else {
        // 仅推进 tick，用于驱动可视化重绘
        usePlayerStore.setState({ tick: s.tick + 1 });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // 拖动进度
  const barRef = useRef<HTMLDivElement>(null);
  const onSeek = (e: React.MouseEvent) => {
    const el = barRef.current!;
    const r = el.getBoundingClientRect();
    const p = (e.clientX - r.left) / r.width;
    seek(p);
  };
  const dragging = useRef(false);
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const el = barRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (e.clientX - r.left) / r.width;
      seek(p);
    };
    const onUp = () => (dragging.current = false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [seek]);

  return (
    <>
      {/* 隐藏的文件 input */}
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-black/70 backdrop-blur-xl"
        style={{
          boxShadow:
            "0 -10px 30px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        <div className="mx-auto flex h-14 sm:h-[60px] max-w-[1600px] items-center gap-3 px-3 sm:px-5">
          {/* 封面 */}
          <div
            className="relative h-9 w-9 sm:h-11 sm:w-11 shrink-0 overflow-hidden border border-white/10"
            style={{ background: current.cover }}
          >
            <div className="absolute inset-0 noise-overlay opacity-60" />
            <div className="absolute inset-0 grid place-items-center font-display text-base sm:text-lg text-white/90 mix-blend-difference">
              ◢
            </div>
            {isUploaded && (
              <div className="absolute right-0 top-0 bg-danger px-1 font-mono text-[7px] font-bold tracking-widest text-white">
                UP
              </div>
            )}
            {playing && (
              <div
                className="absolute inset-x-0 bottom-0 h-1 bg-danger"
                style={{
                  background:
                    "linear-gradient(90deg, #FF2A2A, #FF8A2A, #7CF6FF)",
                  animation: "pulse2 1.4s ease-in-out infinite",
                }}
              />
            )}
          </div>

          {/* 标题 / 艺人 */}
          <div className="hidden min-w-0 flex-col sm:flex">
            <div className="truncate font-display text-sm tracking-[0.18em] text-white">
              {current.title}
            </div>
            <div className="truncate font-mono text-[10px] tracking-[0.3em] text-white/45">
              {current.artist}
              {current.bpm > 0 ? ` · BPM ${current.bpm}` : ""}
            </div>
          </div>

          {/* 可视化（音乐网格点阵） */}
          <div className="hidden h-9 w-[160px] md:block">
            <GridMatrix cols={20} rows={6} />
          </div>

          {/* 进度条 */}
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-block w-10 text-right font-mono text-[10px] tabular-nums text-white/55">
              {formatTime(currentTime, duration)}
            </span>
            <div
              ref={barRef}
              onMouseDown={(e) => {
                dragging.current = true;
                onSeek(e);
              }}
              className="group relative h-1.5 flex-1 cursor-pointer overflow-hidden bg-white/10"
            >
              <div
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${currentTime * 100}%`,
                  background:
                    "linear-gradient(90deg,#FF2A2A 0%,#FF8A2A 50%,#7CF6FF 100%)",
                  boxShadow: "0 0 12px rgba(255,42,42,0.55)",
                }}
              />
              <div
                className="absolute top-1/2 h-3 w-3 -translate-y-1/2 -translate-x-1/2 rounded-full bg-white opacity-0 transition-opacity group-hover:opacity-100"
                style={{ left: `${currentTime * 100}%` }}
              />
            </div>
            <span className="hidden sm:inline-block w-10 font-mono text-[10px] tabular-nums text-white/55">
              {formatTime(1, duration)}
            </span>
          </div>

          {/* 控制按钮 */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <IconBtn label="SHUFFLE">
              <Shuffle className="h-3.5 w-3.5" />
            </IconBtn>
            <IconBtn label="PREV" onClick={prev}>
              <SkipBack className="h-4 w-4" />
            </IconBtn>
            <button
              onClick={toggle}
              aria-label={playing ? "PAUSE" : "PLAY"}
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center border border-white/15 bg-white/5 text-white transition active:translate-y-px hover:border-danger hover:bg-danger hover:text-white"
            >
              {playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 translate-x-[1px]" />
              )}
            </button>
            <IconBtn label="NEXT" onClick={next}>
              <SkipForward className="h-4 w-4" />
            </IconBtn>
            <IconBtn label="REPEAT">
              <Repeat className="h-3.5 w-3.5" />
            </IconBtn>
          </div>

          {/* 音量 */}
          <Volume />

          {/* 上传按钮 */}
          <IconBtn label="UPLOAD" onClick={openUpload}>
            <Upload className="h-4 w-4" />
          </IconBtn>

          {/* 列表 */}
          <IconBtn
            label="QUEUE"
            onClick={() => setOpen(!open)}
            active={open}
          >
            <ListMusic className="h-4 w-4" />
          </IconBtn>
        </div>

        {/* 错误提示 */}
        {uploadError && (
          <div
            className="absolute -top-7 right-3 flex items-center gap-2 border border-danger/40 bg-black/80 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-danger backdrop-blur"
            role="alert"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse2" />
            {uploadError}
            <button
              onClick={() => usePlayerStore.getState().setUploadError(null)}
              className="text-danger/80 hover:text-white"
              aria-label="dismiss"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>

      {/* 抽屉：播放列表 */}
      <PlaylistDrawer />
    </>
  );
}

function IconBtn({
  children,
  onClick,
  active,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  active?: boolean;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`grid h-8 w-8 place-items-center border transition active:translate-y-px ${
        active
          ? "border-danger bg-danger/10 text-danger"
          : "border-white/12 bg-white/[0.03] text-white/75 hover:border-neon/60 hover:text-neon"
      }`}
    >
      {children}
    </button>
  );
}

function Volume() {
  const { volume, setVolume } = usePlayerStore();
  const [mute, setMute] = useState(false);
  const v = mute ? 0 : volume;
  return (
    <div className="hidden items-center gap-2 sm:flex">
      <button
        onClick={() => setMute((m) => !m)}
        className="grid h-7 w-7 place-items-center text-white/70 hover:text-neon"
        aria-label="MUTE"
      >
        {v === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
      <div
        className="relative h-1 w-20 cursor-pointer bg-white/10"
        onMouseDown={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          const p = (e.clientX - r.left) / r.width;
          setMute(false);
          setVolume(p);
          const move = (ev: MouseEvent) => {
            const r2 = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
            const p2 = (ev.clientX - r2.left) / r2.width;
            setVolume(p2);
          };
          const up = () => {
            window.removeEventListener("mousemove", move);
            window.removeEventListener("mouseup", up);
          };
          window.addEventListener("mousemove", move);
          window.addEventListener("mouseup", up);
        }}
      >
        <div
          className="absolute inset-y-0 left-0 bg-neon"
          style={{
            width: `${v * 100}%`,
            boxShadow: "0 0 8px rgba(124,246,255,0.55)",
          }}
        />
      </div>
    </div>
  );
}

function PlaylistDrawer() {
  const { open, setOpen, playlist, currentId, play, playing, removeTrack } =
    usePlayerStore();
  const { handleFiles } = useFileUpload();
  const drawerInputRef = useRef<HTMLInputElement>(null);

  return (
    <div
      className={`fixed inset-x-0 bottom-14 sm:bottom-[60px] z-30 origin-bottom transform border-t border-white/10 bg-black/85 backdrop-blur-xl transition-transform duration-300 ${
        open ? "translate-y-0" : "translate-y-full"
      }`}
      style={{
        maxHeight: "55vh",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.55)",
      }}
    >
      <input
        ref={drawerInputRef}
        type="file"
        accept="audio/*"
        multiple
        className="hidden"
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-white/55">
          <span className="h-1.5 w-1.5 rounded-full bg-danger animate-pulse2" />
          QUEUE · {playlist.length} TRACKS
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => drawerInputRef.current?.click()}
            className="flex items-center gap-1.5 border border-white/12 bg-white/[0.03] px-2 py-1 font-mono text-[10px] uppercase tracking-[0.25em] text-white/75 transition hover:border-neon/60 hover:text-neon"
          >
            <Plus className="h-3 w-3" />
            ADD TRACK
          </button>
          <button
            onClick={() => setOpen(false)}
            className="text-white/55 hover:text-white"
            aria-label="close"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
        </div>
      </div>
      <ul className="scrollbar-thin max-h-[40vh] overflow-y-auto">
        {playlist.map((t, i) => {
          const isCur = t.id === currentId;
          const isUp = t.id.startsWith("up-");
          return (
            <li
              key={t.id}
              className={`group flex cursor-pointer items-center gap-3 border-b border-white/5 px-4 py-3 sm:px-6 transition ${
                isCur
                  ? "bg-danger/5 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
              onClick={() => play(t.id)}
            >
              <div className="w-6 text-right font-mono text-[10px] tabular-nums text-white/40">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div
                className="h-8 w-8 shrink-0 border border-white/10"
                style={{ background: t.cover }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`truncate font-display text-sm tracking-[0.16em] ${
                      isCur ? "text-danger" : ""
                    }`}
                  >
                    {t.title}
                  </div>
                  {isUp && (
                    <span className="shrink-0 border border-neon/40 bg-neon/10 px-1 font-mono text-[8px] uppercase tracking-[0.2em] text-neon">
                      UPLOADED
                    </span>
                  )}
                </div>
                <div className="truncate font-mono text-[10px] tracking-[0.25em] text-white/40">
                  {t.artist}
                </div>
              </div>
              <div className="hidden font-mono text-[10px] tabular-nums text-white/45 sm:block">
                {t.bpm > 0 ? `BPM ${t.bpm}` : "—"}
              </div>
              <div className="font-mono text-[10px] tabular-nums text-white/55">
                {t.dur}
              </div>
              {isUp && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTrack(t.id);
                  }}
                  className="grid h-7 w-7 place-items-center border border-white/10 text-white/45 transition hover:border-danger hover:bg-danger/10 hover:text-danger"
                  aria-label="REMOVE"
                  title="删除此上传曲目"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
              <div className="grid h-7 w-7 place-items-center text-white/40 group-hover:text-white">
                {isCur && playing ? (
                  <Equalizer />
                ) : (
                  <Play className="h-3.5 w-3.5" />
                )}
              </div>
            </li>
          );
        })}
        {playlist.length === 0 && (
          <li className="px-6 py-12 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-white/40">
            QUEUE EMPTY
          </li>
        )}
      </ul>
    </div>
  );
}

function Equalizer() {
  return (
    <div className="flex h-3 items-end gap-[2px]">
      <span
        className="block w-[2px] animate-pulse2 bg-danger"
        style={{ height: "60%" }}
      />
      <span
        className="block w-[2px] animate-pulse2 bg-danger"
        style={{ height: "100%", animationDelay: "0.15s" }}
      />
      <span
        className="block w-[2px] animate-pulse2 bg-danger"
        style={{ height: "70%", animationDelay: "0.3s" }}
      />
    </div>
  );
}
