import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudioStore } from "@/stores/studioStore";
import { useExportStore } from "@/stores/exportStore";
import { downloadGider } from "@/utils/giderFormat";
import GiderTree from "@/components/export/GiderTree";
import MaskHeatmap from "@/components/export/MaskHeatmap";
import AnimationPreview from "@/components/export/AnimationPreview";
import { Download, AlertCircle } from "lucide-react";

export default function Export() {
  const navigate = useNavigate();
  const projectId = useStudioStore((s) => s.projectId);
  const gridSize = useStudioStore((s) => s.gridSize);
  const buildFromStudio = useExportStore((s) => s.buildFromStudio);
  const giderFile = useExportStore((s) => s.giderFile);
  const mask = useExportStore((s) => s.mask);

  useEffect(() => {
    buildFromStudio();
  }, [buildFromStudio]);

  if (!projectId || !giderFile) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="panel flex flex-col items-center gap-3 p-8 text-center">
          <AlertCircle className="h-8 w-8 text-coral" />
          <h2 className="font-pixel text-sm text-cream">NO PROJECT LOADED</h2>
          <p className="font-mono text-xs text-ink-400">
            请先在工作台创建或打开一个作品
          </p>
          <button
            onClick={() => navigate("/studio")}
            className="btn-bead btn-bead-primary"
          >
            前往工作台
          </button>
        </div>
      </div>
    );
  }

  const stats = {
    modules: giderFile.modules.length,
    joints: giderFile.skeleton.joints.length,
    bones: giderFile.skeleton.bones.length,
    keyframes: giderFile.keyframes.length,
    beads: giderFile.modules.reduce((s, m) => s + m.beads.length, 0),
  };

  return (
    <div className="h-full overflow-y-auto p-6 noise-overlay">
      <div className="mx-auto max-w-7xl">
        {/* 头部 */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-pixel text-lg text-volt">EXPORT PREVIEW</h1>
            <p className="mt-1 font-mono text-xs text-ink-400">
              .gider 文件结构 · 蒙版展开 · 动画回放
            </p>
          </div>
          <button
            onClick={() => downloadGider(giderFile, giderFile.meta.name)}
            className="btn-bead btn-bead-primary"
          >
            <Download className="h-4 w-4" />
            下载 .gider
          </button>
        </div>

        {/* 统计 */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
          {[
            { label: "MODULES", value: stats.modules, color: "text-mint" },
            { label: "BEADS", value: stats.beads, color: "text-volt" },
            { label: "JOINTS", value: stats.joints, color: "text-coral" },
            { label: "BONES", value: stats.bones, color: "text-aqua" },
            { label: "KEYFRAMES", value: stats.keyframes, color: "text-grape" },
          ].map((s) => (
            <div key={s.label} className="panel p-3">
              <div className={`font-pixel text-xl ${s.color}`}>{s.value}</div>
              <div className="mt-1 font-mono text-[9px] text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* 三栏 */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* 动画回放 */}
          <div className="lg:col-span-1">
            <AnimationPreview cellSize={18} />
          </div>

          {/* Gider 结构树 */}
          <div className="lg:col-span-1">
            <div className="h-[480px]">
              <GiderTree file={giderFile} />
            </div>
          </div>

          {/* 蒙版热力图 */}
          <div className="lg:col-span-1">
            <div className="h-[480px]">
              <MaskHeatmap mask={mask} gridSize={gridSize} cellSize={18} />
            </div>
          </div>
        </div>

        {/* 元信息 */}
        <section className="panel mt-6 p-4">
          <h2 className="title-pixel mb-3">META</h2>
          <dl className="grid grid-cols-2 gap-2 font-mono text-[11px] md:grid-cols-4">
            <div>
              <dt className="text-ink-400">format</dt>
              <dd className="text-mint">{giderFile.meta.format}</dd>
            </div>
            <div>
              <dt className="text-ink-400">version</dt>
              <dd className="text-volt">{giderFile.meta.version}</dd>
            </div>
            <div>
              <dt className="text-ink-400">name</dt>
              <dd className="text-cream">{giderFile.meta.name}</dd>
            </div>
            <div>
              <dt className="text-ink-400">gridSize</dt>
              <dd className="text-aqua">{giderFile.meta.gridSize}</dd>
            </div>
            <div>
              <dt className="text-ink-400">fps</dt>
              <dd className="text-coral">{giderFile.animation.fps}</dd>
            </div>
            <div>
              <dt className="text-ink-400">length</dt>
              <dd className="text-coral">{giderFile.animation.length}</dd>
            </div>
            <div>
              <dt className="text-ink-400">loop</dt>
              <dd className="text-coral">
                {giderFile.animation.loop ? "true" : "false"}
              </dd>
            </div>
            <div>
              <dt className="text-ink-400">palette</dt>
              <dd className="text-grape">{giderFile.palette.length} colors</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>
  );
}
