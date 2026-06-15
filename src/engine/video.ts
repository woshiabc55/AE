export type VideoMeta = {
  src: string;
  fileName?: string;
  mime?: string;
  duration: number;
  width: number;
  height: number;
  fps: number;
};

/**
 * 加载本地视频文件并解析元数据。
 * 通过隐藏的 <video> 元素触发 metadata 解析。
 */
export async function loadVideoFile(file: File): Promise<VideoMeta> {
  const src = URL.createObjectURL(file);
  const meta = await readVideoMeta(src);
  return {
    src,
    fileName: file.name,
    mime: file.type,
    ...meta,
  };
}

export function loadVideoFromUrl(src: string, fileName?: string, mime?: string): Promise<VideoMeta> {
  return readVideoMeta(src).then((m) => ({ src, fileName, mime, ...m }));
}

function readVideoMeta(src: string): Promise<{
  duration: number;
  width: number;
  height: number;
  fps: number;
}> {
  return new Promise((resolve, reject) => {
    const v = document.createElement("video");
    v.preload = "metadata";
    v.muted = true;
    v.playsInline = true;
    v.crossOrigin = "anonymous";
    v.src = src;
    const timer = setTimeout(() => {
      reject(new Error("视频元数据读取超时"));
    }, 15000);
    v.onloadedmetadata = () => {
      clearTimeout(timer);
      // 浏览器一般不直接给出 fps，这里假设 30；用户可在 UI 中修改
      const fps = 30;
      resolve({
        duration: v.duration || 0,
        width: v.videoWidth || 1280,
        height: v.videoHeight || 720,
        fps,
      });
    };
    v.onerror = () => {
      clearTimeout(timer);
      reject(new Error("视频无法解码"));
    };
  });
}

/**
 * 在指定时间抓取一帧，返回 dataURL。
 */
export function grabFrame(
  video: HTMLVideoElement,
  t: number,
  width?: number,
  height?: number
): string | null {
  if (!video || !video.duration) return null;
  const w = width || video.videoWidth || 320;
  const h = height || video.videoHeight || 180;
  // 同步跳帧需要确保已 seeked
  if (Math.abs(video.currentTime - t) > 0.05) {
    try {
      video.currentTime = Math.max(0, Math.min(video.duration, t));
    } catch {
      return null;
    }
  }
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  try {
    ctx.drawImage(video, 0, 0, w, h);
    return canvas.toDataURL("image/jpeg", 0.7);
  } catch {
    return null;
  }
}

/** 异步抓帧：等待 seeked 事件后绘制 */
export async function grabFrameAsync(
  video: HTMLVideoElement,
  t: number,
  width = 320,
  height = 180
): Promise<string | null> {
  return new Promise((resolve) => {
    if (!video.duration) return resolve(null);
    const w = width;
    const h = height;
    const targetT = Math.max(0, Math.min(video.duration - 0.01, t));
    if (Math.abs(video.currentTime - targetT) < 0.02) {
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      try {
        ctx.drawImage(video, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } catch {
        resolve(null);
      }
      return;
    }
    const onSeeked = () => {
      video.removeEventListener("seeked", onSeeked);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return resolve(null);
      try {
        ctx.drawImage(video, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } catch {
        resolve(null);
      }
    };
    video.addEventListener("seeked", onSeeked);
    try {
      video.currentTime = targetT;
    } catch {
      video.removeEventListener("seeked", onSeeked);
      resolve(null);
    }
  });
}

/** 把 File 读取为 dataURL（用于 HTML 内联） */
export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result as string);
    fr.onerror = () => reject(fr.error);
    fr.readAsDataURL(file);
  });
}
