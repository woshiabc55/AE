/**
 * 视频离线面捕（Face Capture）
 *
 * 工作流：
 *  1. 用户上传本地视频文件（mp4/webm/mov）
 *  2. 通过 <video> 逐帧 seek + 抽帧
 *  3. 调用 analyzer.analyzeFrame 做单帧视觉分析
 *  4. 映射成 Live2D 参数曲线
 *  5. 输出关键帧序列（AnimationClip）+ 关键点 CSV
 *
 * 启发式算法与实时面捕共用 analyzer.ts。
 */
import { analyzeFrame, smoothSamples, type FaceSample } from "./analyzer";

export type { FaceSample };

export interface FaceCaptureOptions {
  /** 检测帧率（<= 视频原始帧率） */
  fps: number;
  /** 是否做时间平滑（低通滤波） */
  smooth: boolean;
  /** 进度回调 */
  onProgress?: (current: number, total: number) => void;
}

export interface FaceCaptureResult {
  samples: FaceSample[];
  /** 视频信息 */
  video: { duration: number; width: number; height: number };
  /** 衍生 Live2D 参数 clip */
  live2dParams: Live2DParamClip;
  /** 原始关键点 CSV */
  csv: string;
}

export interface Live2DParamClip {
  /** 各参数名 -> 关键帧 {time, value}[] */
  channels: Record<string, Array<{ time: number; value: number }>>;
  duration: number;
  fps: number;
}

/* ============================================================
 * 1) 视频帧抽取
 * ========================================================== */

const loadVideoElement = (file: File): Promise<HTMLVideoElement> => {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const v = document.createElement("video");
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.src = url;
    v.onloadedmetadata = () => resolve(v);
    v.onerror = () => reject(new Error("video load failed"));
  });
};

const seekTo = (v: HTMLVideoElement, t: number): Promise<void> =>
  new Promise((resolve) => {
    const onSeek = () => {
      v.removeEventListener("seeked", onSeek);
      resolve();
    };
    v.addEventListener("seeked", onSeek);
    v.currentTime = Math.max(0, Math.min(t, v.duration));
  });

const drawToCanvas = (v: HTMLVideoElement, w: number, h: number): HTMLCanvasElement => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(v, 0, 0, w, h);
  return c;
};

/* ============================================================
 * 2) 映射到 Live2D 参数曲线
 * ========================================================== */

const toLive2DClip = (samples: FaceSample[], fps: number): Live2DParamClip => {
  const channels: Record<string, Array<{ time: number; value: number }>> = {
    ParamEyeLOpen: [],
    ParamEyeROpen: [],
    ParamMouthOpenY: [],
    ParamAngleX: [],
    ParamAngleY: [],
    ParamAngleZ: [],
    ParamBodyAngleX: [],
    ParamBodyAngleY: [],
    ParamBodyAngleZ: [],
  };
  samples.forEach((s, i) => {
    const t = i / fps;
    channels.ParamEyeLOpen.push({ time: t, value: s.eyeL?.open ?? 1 });
    channels.ParamEyeROpen.push({ time: t, value: s.eyeR?.open ?? 1 });
    channels.ParamMouthOpenY.push({ time: t, value: s.mouth?.open ?? 0 });
    channels.ParamAngleX.push({ time: t, value: s.head.x * 30 });
    channels.ParamAngleY.push({ time: t, value: s.head.y * 30 });
    channels.ParamAngleZ.push({ time: t, value: s.head.rot });
    channels.ParamBodyAngleX.push({ time: t, value: s.head.x * 10 });
    channels.ParamBodyAngleY.push({ time: t, value: s.head.y * 5 });
    channels.ParamBodyAngleZ.push({ time: t, value: s.head.rot * 0.5 });
  });
  const duration = samples.length / fps;
  return { channels, duration, fps };
};

/* ============================================================
 * 3) CSV
 * ========================================================== */

const toCsv = (samples: FaceSample[]): string => {
  const header = [
    "time",
    "face_x",
    "face_y",
    "face_w",
    "face_h",
    "eyeL_x",
    "eyeL_y",
    "eyeL_open",
    "eyeR_x",
    "eyeR_y",
    "eyeR_open",
    "mouth_x",
    "mouth_y",
    "mouth_w",
    "mouth_h",
    "mouth_open",
    "head_x",
    "head_y",
    "head_z",
    "head_rot",
  ].join(",");
  const rows = samples.map((s) => {
    const f = s.bbox;
    return [
      s.time.toFixed(3),
      f?.x ?? "",
      f?.y ?? "",
      f?.width ?? "",
      f?.height ?? "",
      s.eyeL?.x ?? "",
      s.eyeL?.y ?? "",
      s.eyeL?.open.toFixed(3) ?? "",
      s.eyeR?.x ?? "",
      s.eyeR?.y ?? "",
      s.eyeR?.open.toFixed(3) ?? "",
      s.mouth?.x ?? "",
      s.mouth?.y ?? "",
      s.mouth?.width ?? "",
      s.mouth?.height ?? "",
      s.mouth?.open.toFixed(3) ?? "",
      s.head.x.toFixed(3),
      s.head.y.toFixed(3),
      s.head.z.toFixed(3),
      s.head.rot.toFixed(3),
    ].join(",");
  });
  return [header, ...rows].join("\n");
};

/* ============================================================
 * 4) 主入口
 * ========================================================== */

export const runFaceCapture = async (
  file: File,
  opts: FaceCaptureOptions
): Promise<FaceCaptureResult> => {
  const v = await loadVideoElement(file);
  await new Promise<void>((res) => {
    if (v.readyState >= 1) return res();
    v.onloadedmetadata = () => res();
  });
  const procW = 240;
  const procH = Math.round((procW / v.videoWidth) * v.videoHeight);
  const duration = v.duration;
  const total = Math.max(1, Math.floor(duration * opts.fps));
  const samples: FaceSample[] = [];
  for (let i = 0; i < total; i++) {
    const t = i / opts.fps;
    await seekTo(v, t);
    const c = drawToCanvas(v, procW, procH);
    const ctx = c.getContext("2d")!;
    const img = ctx.getImageData(0, 0, procW, procH);
    const sample = analyzeFrame(img, t);
    samples.push(sample);
    opts.onProgress?.(i + 1, total);
  }
  URL.revokeObjectURL(v.src);
  const smoothed = opts.smooth ? smoothSamples(samples, 0.5) : samples;
  return {
    samples: smoothed,
    video: { duration, width: v.videoWidth, height: v.videoHeight },
    live2dParams: toLive2DClip(smoothed, opts.fps),
    csv: toCsv(smoothed),
  };
};

/**
 * 把 Live2DParamClip 转成 AnimationClip 形式
 */
export const toAnimationClip = (l2d: Live2DParamClip, name = "面部捕捉") => {
  const nodeIds = Object.keys(l2d.channels);
  const fps = l2d.fps;
  const kfCount = Math.floor(l2d.duration * fps);
  const keyframes = Array.from({ length: kfCount }, (_, i) => {
    const t = i / fps;
    const states: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
    nodeIds.forEach((id) => {
      const ch = l2d.channels[id];
      const idx = Math.min(ch.length - 1, Math.max(0, Math.round(t * fps)));
      const v = ch[idx]?.value ?? 0;
      states[id] = { x: 0, y: 0, rotation: v, scale: 1 };
    });
    return { id: `cap-${i}`, time: t, nodeStates: states };
  });
  return {
    id: `cap-${Date.now()}`,
    name,
    duration: l2d.duration,
    loop: true,
    keyframes,
    fromTemplate: "faceCapture",
  };
};
