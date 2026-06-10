import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Play,
  Pause,
  RotateCcw,
  Home,
  Eye,
  Volume2,
  VolumeX,
  ScanFace,
  Camera,
  Circle,
  StopCircle,
  Save,
  X,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { sampleClip } from "@/engine/animator/template";
import { cn } from "@/lib/utils";
import { PRESET_TEMPLATES } from "@/templates/presets";
import { foxGirl, mechKid, blob } from "@/templates/presets";
import { projectToSvg } from "@/engine/svg/svg";
import { useRealtimeFace, WebcamMount } from "@/engine/face/realtimeCapture";
import { toAnimationClip } from "@/engine/face/videoCapture";

const norm = (s: string) => s.toLowerCase();

const isEyeL = (name: string) => /^(eye_l|eyel|left_eye|lefteye)$/i.test(norm(name));
const isEyeR = (name: string) => /^(eye_r|eyer|right_eye|righteye)$/i.test(norm(name));
const isMouth = (name: string) => /^(mouth|口|嘴)$/.test(name) || /mouth/.test(norm(name));
const isHead = (name: string) => /^(head|face|hair|头|脸|发|hair|head)$/i.test(norm(name));
const isBody = (name: string) => /^(body|body|身体|躯干|衣服|上衣|裙子|skin|torso|clothing|shirt|skirt)$/i.test(norm(name));

export default function Preview() {
  const project = useProjectStore((s) => s.project);
  const addAnimation = useProjectStore((s) => s.addAnimation);
  const navigate = useNavigate();
  const [playing, setPlaying] = useState(true);
  const [time, setTime] = useState(0);
  const [templateId, setTemplateId] = useState<"fox" | "mech" | "blob" | "current">("current");
  const [muted, setMuted] = useState(true);
  const [faceOn, setFaceOn] = useState(false);
  const startRef = useRef<number | null>(null);

  // 实时面捕
  const face = useRealtimeFace({ active: faceOn, fps: 15, smooth: true });
  const [lastClip, setLastClip] = useState<{ name: string; duration: number } | null>(null);

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

  const projectToShow = demoProject;

  // 演示项目需要造一个完整 animation
  const effectiveAnimations =
    projectToShow.animations.length > 0
      ? projectToShow.animations
      : [
          {
            id: "demo",
            name: "呼吸",
            duration: 3,
            loop: true,
            keyframes: [
              { id: "k1", time: 0, nodeStates: { all: { x: 0, y: 0, rotation: 0, scale: 1 } } },
              { id: "k2", time: 1.5, nodeStates: { all: { x: 0, y: -6, rotation: 0, scale: 1.02 } } },
              { id: "k3", time: 3, nodeStates: { all: { x: 0, y: 0, rotation: 0, scale: 1 } } },
            ],
          },
        ];

  // 播放 tick
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

  // 动画状态
  const animStates: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
  if (!faceOn) {
    effectiveAnimations.forEach((a) => {
      if (projectToShow.nodes.length === 0) return;
      const states = sampleClip(a, projectToShow.nodes, time);
      Object.entries(states).forEach(([id, st]) => {
        if (!animStates[id]) animStates[id] = { x: 0, y: 0, rotation: 0, scale: 1 };
        animStates[id] = {
          x: animStates[id].x + st.x,
          y: animStates[id].y + st.y,
          rotation: animStates[id].rotation + st.rotation,
          scale: animStates[id].scale * st.scale,
        };
      });
    });
  }

  // 实时面捕 → 节点级覆盖（用 layer.boundNode 或 fallback 用节点名匹配 layer）

  const W = projectToShow.canvasWidth;
  const H = projectToShow.canvasHeight;

  // 把面捕参数映射到 layer transform
  const layerFaceTransform = (layerName: string) => {
    if (!faceOn || !face.sample) return { dx: 0, dy: 0, rot: 0, sx: 1, sy: 1 };
    const s = face.sample;
    const w = W;
    const h = H;
    // 默认全部为 identity
    let dx = 0,
      dy = 0,
      rot = 0,
      sx = 1,
      sy = 1;
    if (isEyeL(layerName)) {
      // 眨眼：scaleY
      sy = Math.max(0.05, Math.min(1, s.eyeL?.open ?? 1));
    } else if (isEyeR(layerName)) {
      sy = Math.max(0.05, Math.min(1, s.eyeR?.open ?? 1));
    } else if (isMouth(layerName)) {
      // 张嘴：scaleY 跟 open 走
      sy = 0.4 + (s.mouth?.open ?? 0) * 0.9;
    } else if (isHead(layerName)) {
      // 头部位移 / 旋转
      dx = s.head.x * (w * 0.05);
      dy = s.head.y * (h * 0.04);
      rot = s.head.rot * 1.5;
    } else if (isBody(layerName)) {
      dx = s.head.x * (w * 0.015);
      dy = s.head.y * (h * 0.012);
      rot = s.head.rot * 0.4;
    }
    return { dx, dy, rot, sx, sy };
  };

  // 录制实时面捕 → 生成 clip 并加入项目
  const onRecord = () => {
    if (!face.recording) {
      face.recordClip("实时面捕");
      return;
    }
    const l2d = face.recordClip("实时面捕");
    if (l2d) {
      const clip = toAnimationClip(l2d, `面捕·${new Date().toLocaleTimeString()}`);
      addAnimation(clip);
      setLastClip({ name: clip.name, duration: clip.duration });
      setTimeout(() => setLastClip(null), 3000);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <WebcamMount stream={face.stream} />

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">PREVIEW · 全屏预览</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">Mochi Live 演示</span>
          {faceOn && (
            <span className="chip text-sakura-400 animate-pulseGlow ml-2">
              <Circle className="w-2 h-2 fill-sakura-400" /> 实时面捕中
            </span>
          )}
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
        <div
          className="panel relative overflow-hidden flex items-center justify-center p-6"
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
                  const st = node ? animStates[node.id] : null;
                  const ft = layerFaceTransform(l.name);
                  return (
                    <div
                      key={l.id}
                      className="absolute"
                      style={{
                        left: l.offsetX + (st?.x ?? 0) + ft.dx,
                        top: l.offsetY + (st?.y ?? 0) + ft.dy,
                        width: l.width,
                        height: l.height,
                        transformOrigin: "center center",
                        transform: `rotate(${(st?.rotation ?? 0) + ft.rot}deg) scale(${(st?.scale ?? 1) * ft.sx}, ${(st?.scale ?? 1) * ft.sy})`,
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

          {/* 实时面捕状态浮层 */}
          {faceOn && (
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
              <div className="panel p-2 backdrop-blur-md bg-ink-900/70 w-44">
                <div className="flex items-center justify-between text-[10px] font-mono mb-1.5">
                  <span className="text-mist-300">face capture</span>
                  <span className={face.error ? "text-flame" : "text-leaf"}>
                    {face.error ? "ERR" : "LIVE"}
                  </span>
                </div>
                {face.sample ? (
                  <div className="grid grid-cols-3 gap-1 text-[9px] font-mono">
                    <Bar k="eyeL" v={face.sample.eyeL?.open ?? 0} />
                    <Bar k="eyeR" v={face.sample.eyeR?.open ?? 0} />
                    <Bar k="mouth" v={face.sample.mouth?.open ?? 0} />
                  </div>
                ) : (
                  <div className="text-[10px] text-mist-300">未检测到人脸…</div>
                )}
              </div>
            </div>
          )}

          {face.error && faceOn && (
            <div className="absolute bottom-3 left-3 right-3 panel p-2 text-xs text-flame border-flame/40">
              摄像头错误：{face.error}（请允许浏览器访问摄像头）
            </div>
          )}

          {lastClip && (
            <div className="absolute bottom-3 right-3 panel p-3 animate-riseIn bg-ink-900/80 border-leaf/40">
              <div className="flex items-center gap-2 text-xs">
                <Save className="w-4 h-4 text-leaf" />
                <div>
                  <div className="text-mist-50 font-display">已生成 clip</div>
                  <div className="text-[10px] font-mono text-mist-300">
                    {lastClip.name} · {lastClip.duration.toFixed(2)}s · 已加入项目
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          {/* 实时面捕控制 */}
          <div className="panel p-4 flex flex-col gap-3">
            <div className="text-display text-mist-50 flex items-center gap-2">
              <ScanFace className="w-4 h-4 text-sakura-400" /> 实时面捕
            </div>
            <button
              onClick={() => setFaceOn(!faceOn)}
              className={cn(
                "justify-center",
                faceOn ? "btn-primary" : "btn-ghost"
              )}
            >
              {faceOn ? <><StopCircle className="w-4 h-4" /> 关闭摄像头</> : <><Camera className="w-4 h-4" /> 开启摄像头</>}
            </button>
            {faceOn && (
              <button
                onClick={onRecord}
                className={cn(
                  "btn-butter justify-center",
                  face.recording && "ring-2 ring-flame animate-pulseGlow"
                )}
              >
                {face.recording ? (
                  <><StopCircle className="w-4 h-4" /> 停止并保存为 Clip</>
                ) : (
                  <><Circle className="w-4 h-4 fill-flame text-flame" /> 开始录制</>
                )}
              </button>
            )}
            <div className="text-[10px] font-mono text-mist-300 leading-relaxed">
              * 开启后用摄像头驱动角色：眨眼/张嘴/头部偏转。
              录制完成后会以 clip 形式加入项目，可与现有动画叠加。
            </div>
          </div>

          <div className="panel p-4 flex flex-col gap-3">
            <div className="text-display text-mist-50">选择演示</div>
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setTemplateId("current")}
                className={cn(
                  "panel-solid p-3 text-left flex items-center gap-2",
                  templateId === "current" && "ring-1 ring-sakura-400"
                )}
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
                  className={cn(
                    "panel-solid p-3 text-left flex items-center gap-2",
                    templateId === p.id && "ring-1 ring-sakura-400"
                  )}
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
              <button
                onClick={() => setPlaying((p) => !p)}
                disabled={faceOn}
                className={cn("btn-butter flex-1 justify-center", (faceOn || !playing) && "opacity-60")}
              >
                {playing ? <><Pause className="w-4 h-4" /> 暂停</> : <><Play className="w-4 h-4" /> 播放</>}
              </button>
              <button
                onClick={() => {
                  setTime(0);
                  startRef.current = null;
                }}
                className="btn-ghost"
                disabled={faceOn}
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
              <div className="flex items-center gap-1">
                mode ·
                <span className={cn(faceOn ? "text-sakura-400" : "text-mist-200")}>
                  {faceOn ? "实时面捕" : "动画播放"}
                </span>
              </div>
            </div>
          </div>

          <div className="panel p-4 flex flex-col gap-2 text-xs text-mist-200">
            <div className="text-display text-mist-50 flex items-center gap-2">
              <X className="w-3 h-3" /> 说明
            </div>
            <p className="leading-relaxed">
              实时面捕会按图层名匹配：eye_L/R → 眨眼，mouth → 张嘴，head/face/hair → 头部，body/skin/衣服 → 身体。
              录制完会生成 AnimationClip 加入项目，可继续走批量优化或导出。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const Bar = ({ k, v }: { k: string; v: number }) => (
  <div>
    <div className="text-mist-300 text-center">{k}</div>
    <div className="h-1 rounded bg-mist-100/10 mt-0.5 overflow-hidden">
      <div className="h-full bg-sakura-400" style={{ width: `${Math.max(0, Math.min(1, v)) * 100}%` }} />
    </div>
  </div>
);
