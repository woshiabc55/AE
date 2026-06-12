import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useStore } from '@/store/storyboardStore';
import { SHOT_TYPE_LABELS, CAMERA_MOVE_LABELS, PROJECT_TYPE_LABELS } from '@/lib/types';

export default function Present() {
  const { projectId = '' } = useParams();
  const navigate = useNavigate();
  const project = useStore((s) => s.projects.find((p) => p.id === projectId));
  const [idx, setIdx] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const panels = project?.panels ?? [];
  const current = panels[idx];

  const next = useCallback(() => {
    setIdx((i) => (i + 1) % Math.max(1, panels.length));
    setProgress(0);
  }, [panels.length]);
  const prev = useCallback(() => {
    setIdx((i) => (i - 1 + panels.length) % Math.max(1, panels.length));
    setProgress(0);
  }, [panels.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        if (e.key === ' ') setPlaying((p) => !p);
        else next();
      } else if (e.key === 'ArrowLeft') {
        prev();
      } else if (e.key === 'Escape') {
        navigate(`/projects/${projectId}`);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, navigate, projectId]);

  // 自动播放
  useEffect(() => {
    if (!playing || !current) return;
    const dur = current.duration * 1000;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else next();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [idx, playing, current, next]);

  if (!project) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-midnight-900 text-paper-50">
        <p className="serif text-2xl">项目不存在</p>
      </div>
    );
  }

  if (panels.length === 0) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-midnight-900 text-paper-50 gap-4">
        <p className="serif text-2xl">这个本子还是空的</p>
        <Link to={`/projects/${projectId}`} className="btn-outline">
          <ArrowLeft className="w-4 h-4" /> 返回工作台
        </Link>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full flex flex-col"
      style={{
        background: `linear-gradient(135deg, ${project.color}11 0%, #0A0A12 60%)`,
      }}
    >
      {/* 顶部 */}
      <div className="flex items-center justify-between px-6 py-4 text-paper-50/80">
        <Link to={`/projects/${projectId}`} className="flex items-center gap-2 text-xs hover:text-paper-50">
          <ArrowLeft className="w-4 h-4" /> 退出
        </Link>
        <div className="text-[10px] font-mono tracking-[0.3em] uppercase">
          {project.title} · {PROJECT_TYPE_LABELS[project.type]}
        </div>
        <div className="text-[10px] font-mono num text-paper-50/60">
          {idx + 1} / {panels.length}
        </div>
      </div>

      {/* 主体 */}
      <div className="flex-1 flex items-center justify-center px-12 min-h-0">
        <div className="max-w-4xl w-full animate-fadeIn" key={current.id}>
          <div className="flex items-center gap-4 text-[10px] font-mono tracking-[0.3em] uppercase text-paper-50/60">
            <span>SCENE {(idx + 1).toString().padStart(2, '0')}</span>
            <span>·</span>
            <span>{current.shotType} · {SHOT_TYPE_LABELS[current.shotType]}</span>
            <span>·</span>
            <span>{CAMERA_MOVE_LABELS[current.cameraMove]}</span>
          </div>

          {current.imageUrl && (
            <div className="mt-4 aspect-video bg-midnight-800 border border-paper-50/10 overflow-hidden">
              <img src={current.imageUrl} className="w-full h-full object-cover" alt="" />
            </div>
          )}

          <p className="serif text-4xl md:text-5xl font-light text-paper-50 mt-6 leading-tight">
            {current.description || '...'}
          </p>

          {current.dialogue && (
            <p className="mt-4 text-paper-50/80 serif italic text-2xl">
              「{current.dialogue}」
            </p>
          )}
          {current.sound && (
            <p className="mt-2 text-paper-50/50 text-sm font-mono tracking-wider">
              ♪ {current.sound}
            </p>
          )}
        </div>
      </div>

      {/* 底部进度条 + 控制 */}
      <div className="px-6 pb-6 text-paper-50">
        <div className="h-px bg-paper-50/10 mb-4 relative">
          <div
            className="absolute left-0 top-0 h-px transition-all"
            style={{
              width: `${((idx + progress) / panels.length) * 100}%`,
              background: project.color,
              boxShadow: `0 0 8px ${project.color}`,
            }}
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border border-paper-50/20 hover:border-paper-50 hover:bg-paper-50 hover:text-midnight-900 flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-12 h-12 rounded-full border-2 flex items-center justify-center transition-colors"
            style={{
              borderColor: project.color,
              color: project.color,
              background: 'transparent',
            }}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          <button
            onClick={next}
            className="w-10 h-10 rounded-full border border-paper-50/20 hover:border-paper-50 hover:bg-paper-50 hover:text-midnight-900 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="text-center mt-3 text-[10px] font-mono tracking-[0.3em] uppercase text-paper-50/40">
          ← / → 切换 · Space 暂停 · Esc 退出
        </div>
      </div>
    </div>
  );
}
