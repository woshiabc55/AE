import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, Play, Pause, RotateCcw, Repeat, Plus, Trash2, Clock } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { TEMPLATE_LIST, sampleClip } from "@/engine/animator/template";
import { cn } from "@/lib/utils";
import type { AnimationClip, KeyFrame, MeshNode } from "@/types";
import { uid } from "@/store/projectStore";

export default function Animate() {
  const project = useProjectStore((s) => s.project);
  const addAnimation = useProjectStore((s) => s.addAnimation);
  const setAnimations = useProjectStore((s) => s.setAnimations);
  const navigate = useNavigate();

  const [selectedAnimId, setSelectedAnimId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [time, setTime] = useState(0);
  const startRef = useRef<number | null>(null);
  const baseTimeRef = useRef(0);
  const animRafRef = useRef<number | null>(null);

  useEffect(() => {
    if (project.animations.length === 0 && project.nodes.length > 0) {
      // 默认添加呼吸
      const t = TEMPLATE_LIST[1];
      const clip = t.factory(project.nodes);
      addAnimation(clip);
      setSelectedAnimId(clip.id);
    } else if (project.animations.length > 0 && !selectedAnimId) {
      setSelectedAnimId(project.animations[0].id);
    }
  }, [project.id]);

  const selectedAnim = project.animations.find((a) => a.id === selectedAnimId) ?? null;

  // 播放循环
  useEffect(() => {
    if (!playing || !selectedAnim) return;
    const tick = (t: number) => {
      if (startRef.current === null) {
        startRef.current = t;
        baseTimeRef.current = time;
      }
      const elapsed = ((t - startRef.current) / 1000) * speed;
      const dur = selectedAnim.duration;
      const newTime = baseTimeRef.current + elapsed;
      const finalTime = selectedAnim.loop ? newTime % dur : Math.min(newTime, dur);
      setTime(finalTime);
      animRafRef.current = requestAnimationFrame(tick);
    };
    animRafRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRafRef.current) cancelAnimationFrame(animRafRef.current);
      startRef.current = null;
    };
  }, [playing, selectedAnim?.id, speed]);

  const currentStates = useMemo(() => {
    if (!selectedAnim) return {};
    return sampleClip(selectedAnim, project.nodes, time);
  }, [selectedAnim, project.nodes, time]);

  const applyTemplate = (factory: (n: MeshNode[]) => AnimationClip, fromTemplate: string) => {
    if (project.nodes.length === 0) return;
    const clip = factory(project.nodes);
    clip.fromTemplate = fromTemplate;
    addAnimation(clip);
    setSelectedAnimId(clip.id);
  };

  const removeAnim = (id: string) => {
    setAnimations(project.animations.filter((a) => a.id !== id));
    if (selectedAnimId === id) setSelectedAnimId(null);
  };

  const addKeyFrameAtPlayhead = () => {
    if (!selectedAnim) return;
    const states: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
    project.nodes.forEach((n) => (states[n.id] = { x: 0, y: 0, rotation: 0, scale: 1 }));
    selectedAnim.keyframes.forEach((kf) => {
      Object.entries(kf.nodeStates).forEach(([id, st]) => {
        if (states[id]) states[id] = st;
      });
    });
    const newKf: KeyFrame = { id: uid(), time, nodeStates: states };
    const updated = {
      ...selectedAnim,
      keyframes: [...selectedAnim.keyframes, newKf].sort((a, b) => a.time - b.time),
    };
    setAnimations(project.animations.map((a) => (a.id === selectedAnim.id ? updated : a)));
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">05 · ANIMATE</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">套用动画 · 实时预览</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/atlas")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button
            onClick={() => navigate("/export")}
            disabled={project.animations.length === 0}
            className="btn-primary"
          >
            下一步：导出 <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-[16rem_1fr] gap-3">
        {/* Templates & Animation List */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="panel p-3 flex flex-col gap-2">
            <div className="label-cap">动画模板</div>
            <div className="flex flex-col gap-1.5 max-h-72 overflow-y-auto">
              {TEMPLATE_LIST.map((t) => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t.factory as any, t.id)}
                  className="panel-solid p-2 text-left flex items-center gap-2 hover:ring-1 hover:ring-sakura-400/40"
                >
                  <span className="text-2xl">{t.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-display text-mist-50">{t.name}</div>
                    <div className="text-[10px] text-mist-300 font-mono">{t.desc}</div>
                  </div>
                  <Plus className="w-4 h-4 text-mist-300" />
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-3 flex flex-col gap-2 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <div className="label-cap">我的动画</div>
              <span className="chip">{project.animations.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col gap-1.5">
              {project.animations.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setSelectedAnimId(a.id)}
                  className={cn(
                    "panel-solid p-2 text-left flex items-center gap-2",
                    selectedAnimId === a.id ? "ring-1 ring-sakura-400" : "hover:ring-1 hover:ring-sakura-400/40"
                  )}
                >
                  <div className="w-8 h-8 rounded-lg bg-ink-800 border border-mist-100/10 flex items-center justify-center text-lg">
                    {TEMPLATE_LIST.find((t) => t.id === a.fromTemplate)?.emoji ?? "✨"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-display text-mist-50 truncate">{a.name}</div>
                    <div className="text-[10px] font-mono text-mist-300 flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" /> {a.duration.toFixed(1)}s · {a.keyframes.length} 关键帧
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAnim(a.id);
                    }}
                    className="w-6 h-6 flex items-center justify-center text-mist-300 hover:text-flame"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stage + Timeline */}
        <div className="flex flex-col gap-3 min-h-0">
          <div className="panel p-4 flex-1 flex flex-col gap-3 min-h-0">
            <div className="flex items-center justify-between">
              <div className="text-display text-mist-50">实时预览</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setTime(0);
                    baseTimeRef.current = 0;
                    startRef.current = null;
                  }}
                  className="btn-ghost"
                >
                  <RotateCcw className="w-4 h-4" /> 回到开头
                </button>
                <button onClick={() => setPlaying((p) => !p)} className={cn("btn-butter", !playing && "opacity-50")}>
                  {playing ? <><Pause className="w-4 h-4" /> 暂停</> : <><Play className="w-4 h-4" /> 播放</>}
                </button>
                <div className="chip">
                  <span className="text-mist-300">×</span>
                  <input
                    type="number"
                    step={0.1}
                    min={0.1}
                    max={4}
                    value={speed}
                    onChange={(e) => setSpeed(parseFloat(e.target.value))}
                    className="w-12 bg-transparent text-mist-50 outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex-1 rounded-xl bg-ink-900 overflow-hidden flex items-center justify-center p-4"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(154,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(154,163,184,0.08) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            >
              <div
                className="relative bg-ink-50 rounded-xl shadow-2xl"
                style={{ width: project.canvasWidth, height: project.canvasHeight, maxWidth: "100%", maxHeight: "100%", aspectRatio: `${project.canvasWidth}/${project.canvasHeight}` }}
              >
                {project.layers
                  .filter((l) => l.visible)
                  .sort((a, b) => a.zIndex - b.zIndex)
                  .map((l) => {
                    const node = project.nodes.find((n) => n.boundLayerId === l.id);
                    const st = node ? currentStates[node.id] : null;
                    if (!st) {
                      return (
                        <div
                          key={l.id}
                          className="absolute"
                          style={{ left: l.offsetX, top: l.offsetY, width: l.width, height: l.height }}
                        >
                          <img src={l.pngDataUrl} className="w-full h-full" alt="" />
                        </div>
                      );
                    }
                    const W = project.canvasWidth;
                    const H = project.canvasHeight;
                    return (
                      <div
                        key={l.id}
                        className="absolute"
                        style={{
                          left: l.offsetX + st.x,
                          top: l.offsetY + st.y,
                          width: l.width,
                          height: l.height,
                          transformOrigin: "center center",
                          transform: `rotate(${st.rotation}deg) scale(${st.scale})`,
                          transformBox: "fill-box",
                        }}
                      >
                        <img src={l.pngDataUrl} className="w-full h-full" alt="" />
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="text-xs font-mono text-mist-300 flex items-center gap-3">
              <span>time: {time.toFixed(2)}s</span>
              <span>·</span>
              <span>duration: {selectedAnim?.duration.toFixed(2) ?? "—"}s</span>
              <span>·</span>
              <span>keyframes: {selectedAnim?.keyframes.length ?? 0}</span>
              <span className="ml-auto inline-flex items-center gap-1">
                <Repeat className="w-3 h-3" /> {selectedAnim?.loop ? "loop" : "once"}
              </span>
            </div>
          </div>

          {/* Timeline */}
          <div className="panel p-3 h-44 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="label-cap">时间轴</div>
              <div className="flex items-center gap-2">
                <button onClick={addKeyFrameAtPlayhead} className="btn-ghost text-xs">
                  <Plus className="w-3 h-3" /> 在 {time.toFixed(2)}s 添加关键帧
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
              <Timeline
                clip={selectedAnim}
                time={time}
                setTime={(t) => {
                  setTime(t);
                  setPlaying(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Timeline({ clip, time, setTime }: { clip: AnimationClip | null; time: number; setTime: (t: number) => void }) {
  if (!clip) {
    return <div className="text-mist-300 text-sm h-full flex items-center justify-center">未选择动画</div>;
  }
  const W = 800;
  const H = 80;
  const dur = Math.max(clip.duration, 0.1);
  const toX = (t: number) => (t / dur) * W;
  return (
    <div className="relative w-[800px] h-full" onClick={(e) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const x = e.clientX - rect.left;
      const t = (x / W) * dur;
      setTime(Math.max(0, Math.min(dur, t)));
    }}>
      {/* 背景刻度 */}
      <div className="absolute inset-x-0 top-0 h-6 border-b border-mist-100/5">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="absolute top-0 bottom-0 border-l border-mist-100/10 text-[10px] font-mono text-mist-300" style={{ left: (i / 10) * W }}>
            <span className="ml-1">{(i * dur / 10).toFixed(1)}s</span>
          </div>
        ))}
      </div>
      {/* 关键帧轨道 */}
      <div className="absolute inset-x-0 top-6 bottom-0">
        {clip.keyframes.map((kf) => (
          <div
            key={kf.id}
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
            style={{ left: toX(kf.time) }}
          >
            <div className="w-3 h-3 rotate-45 bg-sakura-400 border border-sakura-600 shadow" title={`${kf.time.toFixed(2)}s`} />
          </div>
        ))}
        {/* 播放头 */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-butter-400"
          style={{ left: toX(time) }}
        >
          <div className="absolute -top-1 -left-1.5 w-3.5 h-3.5 rounded-full bg-butter-400 shadow-glow" />
        </div>
      </div>
    </div>
  );
}
