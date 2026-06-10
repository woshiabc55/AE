import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Play, Pause, RotateCcw, Home, Eye, Volume2, VolumeX } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { sampleClip } from "@/engine/animator/template";
import { cn } from "@/lib/utils";
import { PRESET_TEMPLATES } from "@/templates/presets";
import { foxGirl, mechKid, blob } from "@/templates/presets";
import { projectToSvg } from "@/engine/svg/svg";

export default function Preview() {
  const project = useProjectStore((s) => s.project);
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [templateId, setTemplateId] = useState<"fox" | "mech" | "blob" | "current">("current");
  const [muted, setMuted] = useState(true);
  const startRef = useRef<number | null>(null);

  // 如果项目为空，使用预设作为演示
  const demoProject =
    project.shapes.length > 0
      ? project
      : templateId === "fox"
      ? foxGirl()
      : templateId === "mech"
      ? mechKid()
      : templateId === "blob"
      ? blob()
      : foxGirl();

  // 演示项目需要造一个完整 animation
  const projectToShow = demoProject;

  // 简化：若没有 animations 给一个呼吸
  const effectiveAnimations =
    projectToShow.animations.length > 0
      ? projectToShow.animations
      : [{ id: "demo", name: "呼吸", duration: 3, loop: true, keyframes: [
          { id: "k1", time: 0, nodeStates: { all: { x: 0, y: 0, rotation: 0, scale: 1 } } },
          { id: "k2", time: 1.5, nodeStates: { all: { x: 0, y: -6, rotation: 0, scale: 1.02 } } },
          { id: "k3", time: 3, nodeStates: { all: { x: 0, y: 0, rotation: 0, scale: 1 } } },
        ] }];

  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const elapsed = (t - startRef.current) / 1000;
      setTime(elapsed);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  // 简易动画合成：合并所有动画的状态
  const combinedStates: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
  effectiveAnimations.forEach((a) => {
    if (projectToShow.nodes.length === 0) return;
    const states = sampleClip(a, projectToShow.nodes, time);
    Object.entries(states).forEach(([id, st]) => {
      if (!combinedStates[id]) combinedStates[id] = { x: 0, y: 0, rotation: 0, scale: 1 };
      combinedStates[id] = {
        x: combinedStates[id].x + st.x,
        y: combinedStates[id].y + st.y,
        rotation: combinedStates[id].rotation + st.rotation,
        scale: combinedStates[id].scale * st.scale,
      };
    });
  });

  // 若没有 layers 但有 shapes，使用完整 SVG
  const W = projectToShow.canvasWidth;
  const H = projectToShow.canvasHeight;

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">PREVIEW · 全屏预览</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">Mochi Live 演示</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/")} className="btn-ghost">
            <Home className="w-4 h-4" /> 回首页
          </button>
          <button onClick={() => navigate("/draw")} className="btn-primary">
            <Eye className="w-4 h-4" /> 开始创作
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1fr_20rem] gap-3">
        <div className="panel relative overflow-hidden flex items-center justify-center p-6"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(255,122,182,0.18), transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,214,107,0.12), transparent 60%)",
          }}
        >
          <div
            className="relative bg-ink-50 rounded-2xl shadow-2xl"
            style={{ width: W, height: H, maxWidth: "100%", maxHeight: "100%", aspectRatio: `${W}/${H}` }}
          >
            {projectToShow.layers.length > 0 ? (
              projectToShow.layers
                .filter((l) => l.visible)
                .sort((a, b) => a.zIndex - b.zIndex)
                .map((l) => {
                  const node = projectToShow.nodes.find((n) => n.boundLayerId === l.id);
                  const st = node ? combinedStates[node.id] : null;
                  return (
                    <div
                      key={l.id}
                      className="absolute"
                      style={{
                        left: l.offsetX + (st?.x ?? 0),
                        top: l.offsetY + (st?.y ?? 0),
                        width: l.width,
                        height: l.height,
                        transformOrigin: "center center",
                        transform: `rotate(${st?.rotation ?? 0}deg) scale(${st?.scale ?? 1})`,
                        transformBox: "fill-box",
                      }}
                    >
                      <img src={l.pngDataUrl} className="w-full h-full" alt="" />
                    </div>
                  );
                })
            ) : (
              <div
                className="w-full h-full"
                style={{ filter: "drop-shadow(0 6px 18px rgba(7,10,20,0.4))" }}
                dangerouslySetInnerHTML={{ __html: projectToSvg(projectToShow) }}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="panel p-4 flex flex-col gap-3">
            <div className="text-display text-mist-50">选择演示</div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setTemplateId("current")}
                className={cn("panel-solid p-3 text-left flex items-center gap-2", templateId === "current" && "ring-1 ring-sakura-400")}
              >
                <span className="text-xl">📂</span>
                <div className="flex-1">
                  <div className="text-sm font-display text-mist-50">当前项目</div>
                  <div className="text-[10px] font-mono text-mist-300">{projectToShow.name}</div>
                </div>
              </button>
              {PRESET_TEMPLATES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setTemplateId(p.id as any)}
                  className={cn("panel-solid p-3 text-left flex items-center gap-2", templateId === p.id && "ring-1 ring-sakura-400")}
                >
                  <span className="text-xl">{p.emoji}</span>
                  <div className="flex-1">
                    <div className="text-sm font-display text-mist-50">{p.name}</div>
                    <div className="text-[10px] font-mono text-mist-300">{p.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="panel p-4 flex flex-col gap-3">
            <div className="text-display text-mist-50">控制</div>
            <div className="flex items-center gap-2">
              <button onClick={() => setPlaying((p) => !p)} className={cn("btn-butter flex-1 justify-center", !playing && "opacity-60")}>
                {playing ? <><Pause className="w-4 h-4" /> 暂停</> : <><Play className="w-4 h-4" /> 播放</>}
              </button>
              <button
                onClick={() => {
                  setTime(0);
                  startRef.current = null;
                }}
                className="btn-ghost"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button onClick={() => setMuted((m) => !m)} className="btn-ghost">
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <div className="text-[10px] font-mono text-mist-300 flex flex-col gap-1">
              <div>time · {time.toFixed(2)}s</div>
              <div>animations · {effectiveAnimations.length}</div>
              <div>nodes · {projectToShow.nodes.length}</div>
              <div>layers · {projectToShow.layers.length}</div>
            </div>
          </div>

          <div className="panel p-4 flex flex-col gap-2 text-xs text-mist-200">
            <div className="text-display text-mist-50">说明</div>
            <p className="leading-relaxed">
              实时合成所有动画的节点变换。多个动画会自动叠加（位置相加、缩放相乘）。
              想让你的项目动起来？回【绘制】→【分层】→【网格】→【动画】走一遍即可。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
