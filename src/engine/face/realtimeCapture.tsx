/**
 * 实时 webcam 面捕 hook
 *
 *  - getUserMedia 拿视频流
 *  - 离屏 canvas 抽帧（默认 200×150 / 15fps）
 *  - analyzer.IncrementalSmoother 平滑
 *  - 持续返回最新 FaceSample
 *  - 可选：录制一段时间内的样本，转 Live2DParamClip
 */
import { useEffect, useRef, useState } from "react";
import {
  analyzeFrame,
  IncrementalSmoother,
  type FaceSample,
} from "./analyzer";
import type { Live2DParamClip } from "./videoCapture";

export interface UseRealtimeFaceOptions {
  /** 是否启动（绑定到开关按钮） */
  active: boolean;
  /** 处理帧率 */
  fps?: number;
  /** 是否平滑 */
  smooth?: boolean;
}

export interface UseRealtimeFaceResult {
  /** 最新一帧分析结果 */
  sample: FaceSample | null;
  /** webcam 视频流（接到 <video> 即可显示） */
  stream: MediaStream | null;
  /** 错误 */
  error: string | null;
  /** 是否处于活跃状态 */
  active: boolean;
  /** 录制并返回 Live2DParamClip（手动触发） */
  recordClip: (name?: string) => Live2DParamClip | null;
  /** 是否在录制 */
  recording: boolean;
}

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

export const useRealtimeFace = (opts: UseRealtimeFaceOptions): UseRealtimeFaceResult => {
  const { active, fps = 15, smooth = true } = opts;
  const [sample, setSample] = useState<FaceSample | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const procRef = useRef<HTMLCanvasElement | null>(null);
  const smootherRef = useRef<IncrementalSmoother | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTickRef = useRef<number>(0);
  const recordingRef = useRef<FaceSample[]>([]);
  const recordStartRef = useRef<number>(0);

  useEffect(() => {
    if (!active) {
      // 停流
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
        setStream(null);
      }
      setSample(null);
      smootherRef.current?.reset();
      return;
    }

    let cancelled = false;
    setError(null);
    (async () => {
      try {
        const ms = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: "user" },
          audio: false,
        });
        if (cancelled) {
          ms.getTracks().forEach((t) => t.stop());
          return;
        }
        setStream(ms);
        // 等下一个 microtick 拿到 video 节点
        requestAnimationFrame(() => {
          const v = videoRef.current;
          if (!v) return;
          v.srcObject = ms;
          v.muted = true;
          v.playsInline = true;
          v.play().catch(() => {
            /* autoplay block is fine */
          });
          // 离屏 canvas
          const c = document.createElement("canvas");
          c.width = 200;
          c.height = Math.round((c.width / ms.getVideoTracks()[0].getSettings().width!) * ms.getVideoTracks()[0].getSettings().height!) || 150;
          procRef.current = c;
          smootherRef.current = new IncrementalSmoother(smooth ? 0.55 : 1.0);
          lastTickRef.current = 0;

          const tick = (now: number) => {
            if (cancelled) return;
            const interval = 1000 / fps;
            if (now - lastTickRef.current >= interval) {
              lastTickRef.current = now;
              if (v.readyState >= 2 && v.videoWidth > 0) {
                const ctx = c.getContext("2d", { willReadFrequently: true })!;
                ctx.drawImage(v, 0, 0, c.width, c.height);
                const img = ctx.getImageData(0, 0, c.width, c.height);
                const raw = analyzeFrame(img, now / 1000);
                const merged = smootherRef.current!.push(raw);
                setSample(merged);
                if (recordingRef.current && recordStartRef.current) {
                  recordingRef.current.push({ ...merged, time: (now - recordStartRef.current) / 1000 });
                }
              }
            }
            rafRef.current = requestAnimationFrame(tick);
          };
          rafRef.current = requestAnimationFrame(tick);
        });
      } catch (e) {
        if (!cancelled) {
          setError((e as Error).message || "无法访问摄像头");
        }
      }
    })();

    return () => {
      cancelled = true;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, fps, smooth]);

  // 卸载时停流
  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const recordClip = (name = "实时面捕"): Live2DParamClip | null => {
    if (recording) {
      // 停止：把累积的样本打包
      const samples = recordingRef.current;
      recordingRef.current = [];
      setRecording(false);
      if (samples.length < 2) return null;
      return toLive2DClip(samples, fps);
    }
    // 开始
    recordingRef.current = [];
    recordStartRef.current = performance.now();
    setRecording(true);
    return null;
  };

  return {
    sample,
    stream,
    error,
    active,
    recordClip,
    recording,
  };
};

/** 隐藏 video 元素（用于挂载 stream） */
export const WebcamMount = ({ stream }: { stream: MediaStream | null }) => {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.srcObject = stream;
  }, [stream]);
  return <video ref={ref} className="hidden" muted playsInline autoPlay />;
};
