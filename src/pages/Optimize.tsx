import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Gauge,
  Scissors,
  TrendingDown,
  Check,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import {
  batchOptimize,
  type ClipDiff,
  type ClipOptimizeOptions,
} from "@/engine/optimization/clipOptimizer";
import { downloadZip, strToBytes } from "@/lib/zip";
import { cn } from "@/lib/utils";

export default function Optimize() {
  const project = useProjectStore((s) => s.project);
  const setAnimations = useProjectStore((s) => s.setAnimations);
  const navigate = useNavigate();

  const [compressEnabled, setCompressEnabled] = useState(true);
  const [epsilon, setEpsilon] = useState(0.05);
  const [resampleEnabled, setResampleEnabled] = useState(false);
  const [targetFps, setTargetFps] = useState(15);
  const [pruneStatic, setPruneStatic] = useState(true);
  const [lodEnabled, setLodEnabled] = useState(false);
  const [lodThreshold, setLodThreshold] = useState(0.3);
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(project.animations.map((a) => a.id))
  );
  const [diffs, setDiffs] = useState<ClipDiff[] | null>(null);

  const opt: ClipOptimizeOptions = useMemo(
    () => ({
      compress: compressEnabled ? { epsilon } : false,
      resample: resampleEnabled ? { fps: targetFps } : false,
      pruneStatic,
      lod: lodEnabled ? { threshold: lodThreshold } : false,
    }),
    [compressEnabled, epsilon, resampleEnabled, targetFps, pruneStatic, lodEnabled, lodThreshold]
  );

  const targetClips = useMemo(
    () => project.animations.filter((a) => selected.has(a.id)),
    [project.animations, selected]
  );

  const onPreview = () => {
    if (targetClips.length === 0) {
      setDiffs([]);
      return;
    }
    const { diffs: ds } = batchOptimize(targetClips, project.nodes, opt);
    setDiffs(ds);
  };

  const onApply = () => {
    if (targetClips.length === 0) return;
    const { optimized } = batchOptimize(targetClips, project.nodes, opt);
    // 替换：保留未选中的原样
    const map = new Map(optimized.map((c) => [c.id, c]));
    const next = project.animations.map((a) => map.get(a.id) ?? a);
    setAnimations(next);
    setDiffs(null);
  };

  const onExport = () => {
    if (targetClips.length === 0) return;
    const { optimized } = batchOptimize(targetClips, project.nodes, opt);
    const report = optimized.map((c, i) => ({
      name: c.name,
      keyframes: c.keyframes.length,
      channels: new Set(c.keyframes.flatMap((k) => Object.keys(k.nodeStates))).size,
      duration: c.duration,
    }));
    const bundle = [
      { name: "optimized/manifest.json", data: strToBytes(JSON.stringify({
        format: "mochi-live.optimized-bundle",
        version: 1,
        options: opt,
        clips: report,
        generatedAt: new Date().toISOString(),
      }, null, 2)) },
      ...optimized.map((c, i) => ({
        name: `optimized/${i.toString().padStart(2, "0")}_${c.name}.anim.json`,
        data: strToBytes(JSON.stringify(c, null, 2)),
      })),
    ];
    downloadZip(bundle, `${project.name || "project"}_optimized.zip`);
  };

  const totals = useMemo(() => {
    if (!diffs) return null;
    const beforeKf = diffs.reduce((s, d) => s + d.before.keyframes, 0);
    const afterKf = diffs.reduce((s, d) => s + d.after.keyframes, 0);
    return { beforeKf, afterKf, ratio: beforeKf ? afterKf / beforeKf : 1 };
  }, [diffs]);

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">07 · OPTIMIZE</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">批量优化 · 关键帧</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/animate")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={() => navigate("/capture")} className="btn-ghost">
            <Sparkles className="w-4 h-4" /> 面部捕捉
          </button>
          <button onClick={() => navigate("/export")} className="btn-primary">
            <Zap className="w-4 h-4" /> 去导出
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-3">
        {/* 左：优化算子面板 */}
        <div className="panel p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="text-display text-mist-50">优化算子</div>

          <OperatorRow
            icon={<Scissors className="w-4 h-4" />}
            title="关键帧压缩 (RDP)"
            desc="用 Ramer-Douglas-Peucker 简化曲线，仅保留视觉差异超过阈值的帧"
            enabled={compressEnabled}
            onToggle={setCompressEnabled}
          >
            <Slider
              label="距离阈值 ε"
              min={0.005}
              max={0.5}
              step={0.005}
              value={epsilon}
              onChange={setEpsilon}
              format={(v) => v.toFixed(3)}
            />
            <div className="text-[10px] font-mono text-mist-300 leading-relaxed">
              * 阈值越大压缩越狠。0.02 适合精细动画，0.1+ 适合粗动画。
            </div>
          </OperatorRow>

          <OperatorRow
            icon={<Gauge className="w-4 h-4" />}
            title="重采样 (Resample)"
            desc="把关键帧重新采样到目标帧率，去除过密关键帧"
            enabled={resampleEnabled}
            onToggle={setResampleEnabled}
          >
            <Slider
              label="目标 FPS"
              min={6}
              max={60}
              step={1}
              value={targetFps}
              onChange={setTargetFps}
              format={(v) => `${v} fps`}
            />
          </OperatorRow>

          <OperatorRow
            icon={<Zap className="w-4 h-4" />}
            title="通道剪枝 (Prune Static)"
            desc="移除整条无变化的节点通道，减少播放期计算量"
            enabled={pruneStatic}
            onToggle={setPruneStatic}
          />

          <OperatorRow
            icon={<TrendingDown className="w-4 h-4" />}
            title="LOD 简化"
            desc="丢弃低 influence 节点的关键帧状态，生成低细节版本"
            enabled={lodEnabled}
            onToggle={setLodEnabled}
          >
            <Slider
              label="影响阈值"
              min={0.05}
              max={1}
              step={0.05}
              value={lodThreshold}
              onChange={setLodThreshold}
              format={(v) => `≥ ${v.toFixed(2)}`}
            />
          </OperatorRow>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-mist-100/5">
            <button onClick={onPreview} className="btn-ghost col-span-1 justify-center">
              <Sparkles className="w-4 h-4" /> 预览
            </button>
            <button
              onClick={onApply}
              disabled={!diffs}
              className={cn("btn-primary col-span-1 justify-center", !diffs && "opacity-40 cursor-not-allowed")}
            >
              <Check className="w-4 h-4" /> 应用
            </button>
            <button onClick={onExport} className="btn-ghost col-span-1 justify-center">
              <Zap className="w-4 h-4" /> 导出包
            </button>
          </div>
        </div>

        {/* 右：clip 列表 + diff */}
        <div className="panel p-4 flex flex-col gap-3 min-h-0">
          <div className="flex items-center justify-between">
            <div className="text-display text-mist-50">待优化 Clip · {targetClips.length}/{project.animations.length}</div>
            <div className="flex items-center gap-1">
              <button
                className="btn-ghost text-xs"
                onClick={() => setSelected(new Set(project.animations.map((a) => a.id)))}
              >
                全选
              </button>
              <button className="btn-ghost text-xs" onClick={() => setSelected(new Set())}>
                清空
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 pr-1">
            {project.animations.length === 0 && (
              <div className="text-center text-mist-300 py-8">还没有动画 clip — 先在 05·动画中添加</div>
            )}
            {project.animations.map((a) => {
              const isOn = selected.has(a.id);
              const d = diffs?.find((x) => x.id === a.id);
              return (
                <div
                  key={a.id}
                  onClick={() => {
                    const next = new Set(selected);
                    if (next.has(a.id)) next.delete(a.id);
                    else next.add(a.id);
                    setSelected(next);
                  }}
                  className={cn(
                    "panel-solid p-3 cursor-pointer transition-all hover:-translate-y-0.5",
                    isOn ? "ring-2 ring-sakura-400" : "opacity-70"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center",
                          isOn ? "bg-sakura-400 border-sakura-400 text-ink-900" : "border-mist-100/20"
                        )}
                      >
                        {isOn && <Check className="w-3 h-3" />}
                      </div>
                      <div className="text-display text-mist-50">{a.name}</div>
                    </div>
                    <div className="text-[10px] font-mono text-mist-300">
                      {a.duration.toFixed(2)}s · {a.loop ? "loop" : "once"}
                    </div>
                  </div>
                  <div className="mt-1.5 flex items-center gap-3 text-[10px] font-mono text-mist-300">
                    <span>关键帧 {a.keyframes.length}</span>
                    <span>·</span>
                    <span>
                      通道 {new Set(a.keyframes.flatMap((k) => Object.keys(k.nodeStates))).size}
                    </span>
                    {a.fromTemplate && (
                      <>
                        <span>·</span>
                        <span className="text-butter-300">@ {a.fromTemplate}</span>
                      </>
                    )}
                  </div>
                  {d && (
                    <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] font-mono">
                      <div className="panel p-1.5">
                        <div className="text-mist-300">BEFORE</div>
                        <div className="text-mist-50">
                          kf {d.before.keyframes} · ch {d.before.channels}
                        </div>
                      </div>
                      <div className="panel p-1.5 border-leaf/30">
                        <div className="text-leaf">AFTER</div>
                        <div className="text-mist-50">
                          kf {d.after.keyframes} · ch {d.after.channels} ({(d.ratio * 100).toFixed(0)}%)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totals && (
            <div className="panel-solid p-3 grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-[10px] font-mono text-mist-300">优化前</div>
                <div className="text-display text-mist-50 text-lg">{totals.beforeKf}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-mist-300">优化后</div>
                <div className="text-display text-leaf text-lg">{totals.afterKf}</div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-mist-300">压缩比</div>
                <div className="text-display text-sakura-400 text-lg">
                  {(totals.ratio * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== 子组件 ===== */

const OperatorRow = ({
  icon,
  title,
  desc,
  enabled,
  onToggle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  children?: React.ReactNode;
}) => (
  <div className={cn("panel-solid p-3 transition-all", !enabled && "opacity-50")}>
    <div className="flex items-start gap-3">
      <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center bg-gradient-to-br", enabled ? "from-sakura-400 to-butter-400 text-ink-900" : "from-mist-100/10 to-mist-100/5 text-mist-200")}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div className="text-display text-mist-50 text-sm">{title}</div>
          <Toggle on={enabled} onClick={() => onToggle(!enabled)} />
        </div>
        <div className="text-[10px] text-mist-200 leading-relaxed mt-0.5">{desc}</div>
        {children && enabled && <div className="mt-2 flex flex-col gap-1">{children}</div>}
      </div>
    </div>
  </div>
);

const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-10 h-5 rounded-full relative transition-colors",
      on ? "bg-sakura-400" : "bg-mist-100/15"
    )}
  >
    <span
      className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform",
        on ? "translate-x-5" : "translate-x-0.5"
      )}
    />
  </button>
);

const Slider = ({
  label,
  min,
  max,
  step,
  value,
  onChange,
  format,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  format?: (v: number) => string;
}) => (
  <div>
    <div className="flex items-center justify-between text-[10px] font-mono text-mist-300">
      <span>{label}</span>
      <span className="text-mist-50">{format ? format(value) : value}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full accent-sakura-400"
    />
  </div>
);
