import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, MousePointerClick, Wand2, Download, Eye, ChevronRight } from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import { PRESET_TEMPLATES } from "@/templates/presets";
import { PIXEL_SAMPLES } from "@/templates/pixelSamples";
import { useState } from "react";
import { cn } from "@/lib/utils";
import MiniCharacter from "@/components/canvas/MiniCharacter";
import { PixelPreviewImage } from "@/components/canvas/PixelPreviewImage";
import { useMemo } from "react";

const WORKFLOW = [
  { num: "01", name: "绘制", sub: "DRAW", desc: "像素画工具：铅笔、橡皮、油漆桶、吸管，支持镜像", color: "from-sakura-400 to-sakura-600" },
  { num: "02", name: "分层", sub: "SPLIT", desc: "按颜色族自动切分，每种颜色 = 一个图层", color: "from-butter-400 to-sakura-400" },
  { num: "03", name: "网格", sub: "MESH", desc: "智能生成树形骨骼，绑定到每个图层", color: "from-leaf to-sky" },
  { num: "04", name: "展开", sub: "ATLAS", desc: "把所有图层打包成一张贴图（含 UV 坐标）", color: "from-butter-300 to-flame" },
  { num: "05", name: "动画", sub: "ANIMATE", desc: "套用预设动画模板，实时预览", color: "from-sky to-sakura-400" },
];

export default function Home() {
  const loadTemplate = useProjectStore((s) => s.loadTemplate);
  const newBlank = useProjectStore((s) => s.newBlankProject);
  const setPixel = useProjectStore((s) => s.setPixel);
  const navigate = useNavigate();
  const [hover, setHover] = useState<string | null>(null);

  const heroPixel = useMemo(() => PIXEL_SAMPLES[0].build(), []);

  const handleLoad = (id: string) => {
    const tpl = PRESET_TEMPLATES.find((p) => p.id === id);
    if (!tpl) return;
    loadTemplate(tpl.build());
    navigate("/draw");
  };

  const handleStartPixelSample = () => {
    newBlank();
    const sample = PIXEL_SAMPLES[0].build();
    setPixel(sample);
    navigate("/draw");
  };

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative max-w-[1440px] mx-auto px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 items-center">
          <div className="animate-riseIn">
            <div className="chip mb-5">
              <Sparkles className="w-3 h-3 text-sakura-400" />
              <span>SVG · 分图层 · 树形网格 · 动画模板</span>
            </div>
            <h1 className="text-display text-5xl md:text-6xl lg:text-7xl text-mist-50 leading-[0.95] tracking-tight">
              把任何 <span className="text-sakura-400">草图</span>
              <br />
              变成会动的 <span className="text-butter-400">角色</span>。
            </h1>
            <p className="mt-6 text-mist-200 text-lg max-w-xl leading-relaxed">
              Mochi Live 是一款基于浏览器的 Live2D 动画模板工具。
              绘制矢量 → 自动分图层 → 生成树形骨骼 → 一键套用动画。
              <span className="text-sakura-300 font-bold"> 10 分钟 </span>
              完成从草图到动画。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleStartPixelSample}
                className="btn-primary text-base"
              >
                <Wand2 className="w-5 h-5" />
                打开像素示例
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  newBlank();
                  navigate("/draw");
                }}
                className="btn-ghost text-base"
              >
                <MousePointerClick className="w-4 h-4" />
                空白画布
              </button>
              <Link to="/preview" className="btn-ghost text-base">
                <Eye className="w-4 h-4" />
                效果预览
              </Link>
            </div>
            <div className="mt-8 flex gap-6 text-xs font-mono text-mist-300">
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-leaf" />纯前端</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sakura-400" />5 步出片</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-butter-400" />5+ 动画模板</div>
              <div className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-sky" />moc3 / JSON / WebM</div>
            </div>
          </div>

          {/* Floating Preview Card */}
          <div className="relative h-[520px] hidden lg:block">
            <div className="absolute inset-0 rounded-3xl panel overflow-hidden">
              <div className="absolute inset-0 bg-sakura-glow opacity-60" />
              <div className="relative h-full flex flex-col items-center justify-center">
                <div className="animate-float">
                  <div
                    className="w-64 h-80 bg-ink-50 shadow-2xl rounded-lg flex items-center justify-center"
                    style={{ filter: "drop-shadow(0 8px 20px rgba(7,10,20,0.4))" }}
                  >
                    <PixelPreviewImage
                      pixel={heroPixel}
                      className="w-56 h-72 block"
                    />
                  </div>
                </div>
                <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                  <div className="panel-solid p-3 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sakura-400 flex items-center justify-center text-ink-900 text-display font-black">
                      M
                    </div>
                    <div>
                      <div className="text-xs label-cap">兽耳少女 · Mochi</div>
                      <div className="text-sm font-display font-bold text-mist-50">live2d-ready</div>
                    </div>
                  </div>
                  <div className="panel-solid p-3 font-mono text-[11px] text-mist-100">
                    <div><span className="text-mist-300">FPS</span> 60</div>
                    <div><span className="text-mist-300">Bones</span> 12</div>
                    <div><span className="text-mist-300">Layers</span> 11</div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating chips */}
            <div className="absolute -top-3 -left-3 panel-solid p-2.5 animate-float" style={{ animationDelay: "-2s" }}>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf animate-pulse" />
                <span className="text-mist-100">sakura-pink · #FF7AB6</span>
              </div>
            </div>
            <div className="absolute top-10 -right-4 panel-solid p-2.5 animate-float" style={{ animationDelay: "-1s" }}>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-butter-400 animate-pulse" />
                <span className="text-mist-100">bone · head → body</span>
              </div>
            </div>
            <div className="absolute bottom-24 -right-3 panel-solid p-2.5 animate-float" style={{ animationDelay: "-3s" }}>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-leaf animate-pulse" />
                <span className="text-mist-100">64 × 96 · 像素画</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW */}
      <section className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="label-cap mb-1">WORKFLOW · 工作流</div>
            <h2 className="text-display text-3xl md:text-4xl text-mist-50">四步出片</h2>
          </div>
          <Link to="/draw" className="hidden md:inline-flex btn-ghost text-sm">
            立即开始 <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {WORKFLOW.map((step, i) => (
            <div
              key={step.num}
              className="panel p-5 relative overflow-hidden hover:-translate-y-1 transition-transform duration-300"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={cn("absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-20 blur-2xl", step.color)} />
              <div className="relative">
                <div className="font-mono text-[10px] text-mist-300 tracking-widest">STEP {step.num}</div>
                <div className="text-display text-2xl text-mist-50 mt-1">{step.name}</div>
                <div className="font-mono text-[10px] text-sakura-300 tracking-widest mt-1">{step.sub}</div>
                <p className="text-sm text-mist-200 mt-3 leading-relaxed">{step.desc}</p>
                <div className="mt-4 h-1 rounded-full bg-ink-600 overflow-hidden">
                  <div className={cn("h-full bg-gradient-to-r", step.color)} style={{ width: `${(i + 1) * 25}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section className="max-w-[1440px] mx-auto px-6 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="label-cap mb-1">TEMPLATES · 模板库</div>
            <h2 className="text-display text-3xl md:text-4xl text-mist-50">挑一个开始</h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PRESET_TEMPLATES.map((t) => (
            <button
              key={t.id}
              onMouseEnter={() => setHover(t.id)}
              onMouseLeave={() => setHover(null)}
              onClick={() => handleLoad(t.id)}
              className={cn(
                "panel p-5 text-left group transition-all duration-300 relative overflow-hidden",
                hover === t.id ? "-translate-y-1.5 ring-1 ring-sakura-400/40" : ""
              )}
            >
              <div className="aspect-[3/4] rounded-xl bg-gradient-to-b from-ink-600/50 to-ink-800 mb-4 relative overflow-hidden border border-mist-100/5">
                <div className="absolute inset-0 flex items-center justify-center">
                  <MiniCharacter templateId={t.id as "fox" | "mech" | "blob"} className="w-3/4 h-3/4" />
                </div>
                <div className="absolute top-3 left-3 chip">
                  <span className="text-mist-300">{t.id}</span>
                </div>
                <div className="absolute bottom-3 right-3 text-3xl">{t.emoji}</div>
              </div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-display text-lg text-mist-50">{t.name}</div>
                  <div className="text-xs text-mist-200 mt-1 leading-relaxed">{t.desc}</div>
                </div>
                <div className="w-9 h-9 rounded-lg bg-sakura-400 flex items-center justify-center text-ink-900 group-hover:scale-110 transition-transform shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-3 flex gap-1.5">
                {t.palette.map((c) => (
                  <span key={c} className="w-4 h-4 rounded ring-1 ring-mist-100/10" style={{ background: c }} />
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* BIG CTA */}
      <section className="max-w-[1440px] mx-auto px-6 py-16">
        <div className="panel relative overflow-hidden p-8 md:p-14">
          <div className="absolute inset-0 bg-sakura-glow opacity-70" />
          <div className="relative grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-8 items-center">
            <div>
              <div className="label-cap mb-2">EXPORT · 导出</div>
              <h2 className="text-display text-3xl md:text-5xl text-mist-50 leading-tight">
                导出 moc3 / JSON / WebM，
                <br />
                接入你的项目。
              </h2>
              <p className="text-mist-200 mt-4 max-w-xl">
                一键打包所有图层 PNG、网格树和动画数据，丢进 Live2D Cubism、Three.js
                或任何 web 引擎就能直接驱动。
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Link to="/animate" className="btn-primary justify-center text-base">
                <Download className="w-4 h-4" /> 立即创作
              </Link>
              <Link to="/preview" className="btn-ghost justify-center text-base">
                <Eye className="w-4 h-4" /> 先看效果
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
