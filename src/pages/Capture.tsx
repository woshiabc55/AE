import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Video,
  ScanFace,
  PlayCircle,
  Download,
  Upload,
  Sparkles,
  Check,
  Eye,
  CircleDot,
} from "lucide-react";
import { useProjectStore } from "@/store/projectStore";
import {
  runFaceCapture,
  toAnimationClip,
  type FaceCaptureResult,
  type FaceSample,
} from "@/engine/face/videoCapture";
import { downloadZip, strToBytes } from "@/lib/zip";
import { cn } from "@/lib/utils";

export default function Capture() {
  const project = useProjectStore((s) => s.project);
  const addAnimation = useProjectStore((s) => s.addAnimation);
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [fps, setFps] = useState(15);
  const [smooth, setSmooth] = useState(true);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<FaceCaptureResult | null>(null);
  const [previewIdx, setPreviewIdx] = useState(0);
  const [clipName, setClipName] = useState("面捕·眨眼");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFile = (f: File | null) => {
    setFile(f);
    setResult(null);
    setProgress(0);
  };

  const onRun = async () => {
    if (!file) return;
    setBusy(true);
    setProgress(0);
    try {
      const r = await runFaceCapture(file, {
        fps,
        smooth,
        onProgress: (cur, total) => setProgress(cur / total),
      });
      setResult(r);
      setPreviewIdx(0);
    } catch (e) {
      console.error(e);
      alert("面捕失败：可能视频无法解析或浏览器不支持 seek 到所有帧");
    } finally {
      setBusy(false);
    }
  };

  const onAddToProject = () => {
    if (!result) return;
    const clip = toAnimationClip(result.live2dParams, clipName);
    addAnimation(clip);
  };

  const onExport = () => {
    if (!result) return;
    const entries = [
      { name: "keypoints.csv", data: strToBytes(result.csv) },
      { name: "live2d_params.json", data: strToBytes(JSON.stringify(result.live2dParams, null, 2)) },
      { name: "samples.json", data: strToBytes(JSON.stringify(result.samples, null, 2)) },
      { name: "manifest.json", data: strToBytes(JSON.stringify({
        format: "mochi-live.face-capture",
        version: 1,
        video: result.video,
        generatedAt: new Date().toISOString(),
      }, null, 2)) },
    ];
    const base = file?.name?.replace(/\.[^.]+$/, "") ?? "capture";
    downloadZip(entries, `${base}_facecap.zip`);
  };

  const preview: FaceSample | null = result?.samples[previewIdx] ?? null;

  return (
    <div className="flex-1 flex flex-col min-h-0 px-4 py-3 gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="label-cap">08 · CAPTURE</span>
          <span className="text-mist-200 text-sm">/</span>
          <span className="text-display text-mist-50">面部捕捉 · 离线视频</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/animate")} className="btn-ghost">
            <ArrowLeft className="w-4 h-4" /> 上一步
          </button>
          <button onClick={() => navigate("/optimize")} className="btn-ghost">
            <Sparkles className="w-4 h-4" /> 批量优化
          </button>
          <button onClick={() => navigate("/export")} className="btn-primary">
            <Download className="w-4 h-4" /> 去导出
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-3">
        {/* 左：上传 + 进度 */}
        <div className="panel p-4 flex flex-col gap-3 overflow-y-auto">
          <div className="text-display text-mist-50">视频输入</div>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="panel-solid p-6 border-2 border-dashed border-mist-100/20 hover:border-sakura-400/50 transition-colors flex flex-col items-center gap-2"
          >
            <Upload className="w-7 h-7 text-sakura-400" />
            <div className="text-display text-mist-50">
              {file ? file.name : "点击上传本地视频"}
            </div>
            <div className="text-[10px] font-mono text-mist-300">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "mp4 / webm / mov · 浏览器内解码"}
            </div>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <div className="text-[10px] font-mono text-mist-300 mb-1">检测 FPS</div>
              <input
                type="number"
                min={5}
                max={60}
                value={fps}
                onChange={(e) => setFps(parseInt(e.target.value) || 15)}
                className="input"
              />
            </div>
            <div>
              <div className="text-[10px] font-mono text-mist-300 mb-1">时间平滑</div>
              <button
                onClick={() => setSmooth(!smooth)}
                className={cn(
                  "w-full h-10 rounded-lg text-sm font-display font-bold transition-all",
                  smooth ? "bg-sakura-400 text-ink-900" : "bg-mist-100/10 text-mist-200"
                )}
              >
                {smooth ? "已开启" : "已关闭"}
              </button>
            </div>
          </div>

          <button
            onClick={onRun}
            disabled={!file || busy}
            className={cn(
              "btn-primary justify-center",
              (!file || busy) && "opacity-40 cursor-not-allowed"
            )}
          >
            <ScanFace className="w-4 h-4" />
            {busy ? `分析中 ${(progress * 100).toFixed(0)}%` : "开始分析"}
          </button>

          {busy && (
            <div className="h-2 rounded-full bg-mist-100/10 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-sakura-400 to-butter-400"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          )}

          {result && (
            <>
              <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-2 border-t border-mist-100/5">
                <Stat k="视频时长" v={`${result.video.duration.toFixed(2)} s`} />
                <Stat k="分辨率" v={`${result.video.width}×${result.video.height}`} />
                <Stat k="采样帧数" v={`${result.samples.length}`} />
                <Stat k="映射参数" v={`${Object.keys(result.live2dParams.channels).length} 条`} />
              </div>
              <div className="text-[10px] font-mono text-mist-300 leading-relaxed">
                * 算法：肤色连通域 → 双眼/嘴部暗度扫描 → 头部姿态。
                适用于正面或微侧头、光线均匀的简单场景。
              </div>
            </>
          )}
        </div>

        {/* 右：检测结果 + 预览 */}
        <div className="panel p-4 flex flex-col gap-3 min-h-0">
          <div className="text-display text-mist-50">检测预览</div>

          {!result && (
            <div className="flex-1 flex items-center justify-center text-mist-300 text-sm flex-col gap-2">
              <Video className="w-10 h-10 opacity-50" />
              <div>上传视频并点击"开始分析"</div>
            </div>
          )}

          {result && preview && (
            <>
              <div className="flex-1 min-h-0 panel-solid relative overflow-hidden">
                <FacePreview sample={preview} />
                <div className="absolute top-2 left-2 chip text-mist-50">
                  帧 {previewIdx + 1}/{result.samples.length} · t={preview.time.toFixed(2)}s
                </div>
              </div>

              <input
                type="range"
                min={0}
                max={Math.max(0, result.samples.length - 1)}
                value={previewIdx}
                onChange={(e) => setPreviewIdx(parseInt(e.target.value))}
                className="w-full accent-sakura-400"
              />

              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <ParamRow icon={<Eye className="w-3 h-3" />} k="eyeL" v={preview.eyeL?.open ?? 0} />
                <ParamRow icon={<Eye className="w-3 h-3" />} k="eyeR" v={preview.eyeR?.open ?? 0} />
                <ParamRow icon={<CircleDot className="w-3 h-3" />} k="mouth" v={preview.mouth?.open ?? 0} />
                <ParamRow k="head.x" v={preview.head.x} format={(x) => x.toFixed(2)} />
                <ParamRow k="head.y" v={preview.head.y} format={(x) => x.toFixed(2)} />
                <ParamRow k="head.z" v={preview.head.z} format={(x) => x.toFixed(2)} />
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-2 pt-2 border-t border-mist-100/5">
                <input
                  value={clipName}
                  onChange={(e) => setClipName(e.target.value)}
                  className="input"
                  placeholder="动画名称"
                />
                <button onClick={onAddToProject} className="btn-primary">
                  <Check className="w-4 h-4" /> 加入动画
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={onExport} className="btn-ghost justify-center">
                  <Download className="w-4 h-4" /> 导出数据包
                </button>
                <button
                  onClick={() => setPreviewIdx(0)}
                  className="btn-ghost justify-center"
                >
                  <PlayCircle className="w-4 h-4" /> 回到开头
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== 子组件 ===== */

const Stat = ({ k, v }: { k: string; v: string }) => (
  <div>
    <div className="text-mist-300">{k}</div>
    <div className="text-mist-50 font-display">{v}</div>
  </div>
);

const ParamRow = ({
  k,
  v,
  icon,
  format,
}: {
  k: string;
  v: number;
  icon?: React.ReactNode;
  format?: (v: number) => string;
}) => (
  <div className="panel-solid p-2 flex items-center gap-2">
    {icon}
    <div className="flex-1">
      <div className="text-mist-300">{k}</div>
      <div className="h-1.5 rounded bg-mist-100/10 mt-0.5 overflow-hidden">
        <div
          className="h-full bg-sakura-400"
          style={{ width: `${Math.max(0, Math.min(1, Math.abs(v))) * 100}%` }}
        />
      </div>
    </div>
    <div className="font-mono text-mist-50">{format ? format(v) : v.toFixed(2)}</div>
  </div>
);

const FacePreview = ({ sample }: { sample: FaceSample }) => {
  // 抽象示意图：用 SVG 展示检测到的 bbox/眼睛/嘴
  const W = 320;
  const H = 240;
  // 简单归一化到 0~1
  const scaleX = (x: number) => (x / 240) * W;
  const scaleY = (y: number) => (y / 180) * H;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FF7AB6" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFD66B" stopOpacity="0.1" />
        </linearGradient>
      </defs>
      <rect width={W} height={H} fill="url(#bg)" />
      {/* 坐标网格 */}
      <g stroke="#0B0F1A" strokeOpacity="0.06">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`v${i}`} x1={(i / 10) * W} y1={0} x2={(i / 10) * W} y2={H} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h${i}`} y1={(i / 8) * H} x1={0} y2={(i / 8) * H} x2={W} />
        ))}
      </g>
      {/* face bbox */}
      {sample.bbox && (
        <g>
          <rect
            x={scaleX(sample.bbox.x)}
            y={scaleY(sample.bbox.y)}
            width={scaleX(sample.bbox.width)}
            height={scaleY(sample.bbox.height)}
            fill="#FF7AB6"
            fillOpacity="0.08"
            stroke="#FF7AB6"
            strokeWidth="2"
            strokeDasharray="6 4"
          />
        </g>
      )}
      {/* 眼睛 */}
      {sample.eyeL && (
        <circle
          cx={scaleX(sample.eyeL.x)}
          cy={scaleY(sample.eyeL.y)}
          r={3 + sample.eyeL.open * 4}
          fill="#FFD66B"
          stroke="#0B0F1A"
          strokeWidth="1"
        />
      )}
      {sample.eyeR && (
        <circle
          cx={scaleX(sample.eyeR.x)}
          cy={scaleY(sample.eyeR.y)}
          r={3 + sample.eyeR.open * 4}
          fill="#FFD66B"
          stroke="#0B0F1A"
          strokeWidth="1"
        />
      )}
      {/* 嘴 */}
      {sample.mouth && (
        <rect
          x={scaleX(sample.mouth.x)}
          y={scaleY(sample.mouth.y)}
          width={scaleX(sample.mouth.width)}
          height={Math.max(2, scaleY(sample.mouth.height))}
          fill="#7CC0FF"
          stroke="#0B0F1A"
          strokeWidth="1"
          rx={1}
        />
      )}
      {/* 头部姿态箭头 */}
      <g transform={`translate(${W / 2}, ${H / 2})`}>
        <line
          x1={0}
          y1={0}
          x2={sample.head.x * 80}
          y2={sample.head.y * 80}
          stroke="#0B0F1A"
          strokeWidth="2"
          markerEnd="url(#arrow)"
        />
      </g>
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#0B0F1A" />
        </marker>
      </defs>
    </svg>
  );
};
