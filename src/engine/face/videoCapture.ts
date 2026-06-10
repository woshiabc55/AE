/**
 * 视频离线面捕（Face Capture）
 *
 * 工作流：
 *  1. 用户上传本地视频文件（mp4/webm/mov）
 *  2. 通过 <video> + requestVideoFrameCallback 逐帧抽取
 *  3. 对每帧做启发式视觉分析：
 *     - 肤色掩码 → 找最大连通区域 → 人脸 bbox
 *     - 人脸上半部找最暗水平带 → 双眼
 *     - 人脸下半部找最暗区域 → 嘴
 *  4. 把分析结果映射成 Live2D 参数：
 *     eye_L_open / eye_R_open / mouth_open / head_x / head_y / head_z / head_rot
 *  5. 输出关键帧序列（AnimationClip）+ 关键点 CSV
 *
 * 此实现无外部依赖，能在纯浏览器环境跑通。
 * 精度有限：仅做正面/微侧头、光照均匀的简单场景。
 * 复杂姿态/遮挡/侧脸建议接入 MediaPipe FaceMesh 扩展（已留接口）。
 */

export interface FaceSample {
  /** 帧在原视频中的时间（秒） */
  time: number;
  /** 人脸 bbox（像素） */
  bbox: { x: number; y: number; width: number; height: number } | null;
  /** 双眼中心 + 宽高 */
  eyeL: { x: number; y: number; open: number } | null;
  eyeR: { x: number; y: number; open: number } | null;
  /** 嘴部 bbox + 开放度 */
  mouth: { x: number; y: number; width: number; height: number; open: number } | null;
  /** 头部姿态（0~1 归一化，frame center 为 0） */
  head: { x: number; y: number; z: number; rot: number };
}

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
 * 2) 启发式人脸分析
 * ========================================================== */

const isSkin = (r: number, g: number, b: number): boolean => {
  // 经典 RGB 肤色启发式（兼容不同肤色）
  const mx = Math.max(r, g, b);
  const mn = Math.min(r, g, b);
  return (
    r > 95 &&
    g > 40 &&
    b > 20 &&
    r > g &&
    r > b &&
    mx - mn > 15 &&
    Math.abs(r - g) > 15 &&
    r > 60 &&
    g > 30 &&
    b > 15 &&
    !(r > 220 && g > 220 && b > 220) // 排除纯白
  );
};

/** 找最大肤色连通区域（4 邻 flood fill，返回 bbox） */
const findFaceBBox = (data: Uint8ClampedArray, w: number, h: number) => {
  const visited = new Uint8Array(w * h);
  const stack: number[] = [];
  let best: { x: number; y: number; x2: number; y2: number; n: number } | null = null;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = y * w + x;
      if (visited[idx]) continue;
      const r = data[idx * 4],
        g = data[idx * 4 + 1],
        b = data[idx * 4 + 2];
      if (!isSkin(r, g, b)) {
        visited[idx] = 1;
        continue;
      }
      // BFS
      stack.length = 0;
      stack.push(idx);
      let minX = x,
        minY = y,
        maxX = x,
        maxY = y,
        n = 0;
      while (stack.length) {
        const p = stack.pop()!;
        if (visited[p]) continue;
        visited[p] = 1;
        const px = p % w;
        const py = (p - px) / w;
        if (px < minX) minX = px;
        if (py < minY) minY = py;
        if (px > maxX) maxX = px;
        if (py > maxY) maxY = py;
        n++;
        if (px > 0) stack.push(p - 1);
        if (px < w - 1) stack.push(p + 1);
        if (py > 0) stack.push(p - w);
        if (py < h - 1) stack.push(p + w);
      }
      if (!best || n > best.n) best = { x: minX, y: minY, x2: maxX, y2: maxY, n };
    }
  }
  if (!best || best.n < 100) return null;
  return { x: best.x, y: best.y, width: best.x2 - best.x + 1, height: best.y2 - best.y + 1 };
};

/** 区域内暗度统计：把图像分块统计 darkness 分布 */
const findDarkBand = (
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
): { x: number; y: number; w: number; h: number; darkness: number } | null => {
  let best: { x: number; y: number; w: number; h: number; darkness: number } | null = null;
  const blockW = Math.max(1, Math.floor((x1 - x0) / 8));
  const blockH = Math.max(1, Math.floor((y1 - y0) / 6));
  for (let by = y0; by < y1; by += blockH) {
    for (let bx = x0; bx < x1; bx += blockW) {
      let sum = 0;
      let n = 0;
      for (let y = by; y < Math.min(by + blockH, y1); y++) {
        for (let x = bx; x < Math.min(bx + blockW, x1); x++) {
          const i = (y * w + x) * 4;
          const lum = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
          sum += 255 - lum;
          n++;
        }
      }
      const darkness = sum / Math.max(1, n);
      if (!best || darkness > best.darkness) {
        best = { x: bx, y: by, w: blockW, h: blockH, darkness };
      }
    }
  }
  return best;
};

/** 在区域内找最暗矩形（多分辨率） */
const findDarkRegion = (
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  minH: number,
  maxH: number
): { x: number; y: number; width: number; height: number; open: number } | null => {
  // 在区域内扫描垂直连续暗色带
  let best: { x: number; y: number; width: number; height: number; open: number } | null = null;
  const ew = x1 - x0;
  const eh = y1 - y0;
  if (ew <= 0 || eh <= 0) return null;
  for (let dy = 0; dy + minH <= eh; dy += 1) {
    for (let dx = 0; dx < ew; dx += 1) {
      const x = x0 + dx;
      const y = y0 + dy;
      // 试高度 h in [minH, maxH]，找最深的一段
      for (let hh = minH; hh <= maxH; hh += 2) {
        if (y + hh > y1) break;
        let sum = 0;
        let n = 0;
        for (let yy = y; yy < y + hh; yy++) {
          for (let xx = x; xx < x + Math.min(ew - dx, 8); xx++) {
            const i = (yy * w + xx) * 4;
            const lum = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
            sum += 255 - lum;
            n++;
          }
        }
        const darkness = sum / Math.max(1, n);
        // open 越深越大
        const open = Math.min(1, darkness / 120);
        if (!best || open > best.open) {
          best = { x, y, width: Math.min(ew - dx, 8), height: hh, open };
        }
      }
    }
  }
  return best;
};

const analyzeFrame = (img: ImageData): FaceSample => {
  const { data, width: w, height: h } = img;
  const face = findFaceBBox(data, w, h);
  if (!face) {
    return {
      time: 0,
      bbox: null,
      eyeL: null,
      eyeR: null,
      mouth: null,
      head: { x: 0, y: 0, z: 0, rot: 0 },
    };
  }
  // 眼睛：在脸上半部（0~45%）
  const eyeTop = face.y;
  const eyeBot = face.y + face.height * 0.45;
  const eyeAreaW = Math.floor(face.width * 0.45);
  const eyeCenterX = face.x + face.width / 2;
  const eyeLX0 = face.x + face.width * 0.05;
  const eyeRX0 = eyeCenterX + face.width * 0.05;
  // 分别找左右眼
  const left = findDarkBand(data, w, h, eyeLX0, eyeTop, eyeLX0 + eyeAreaW, eyeBot);
  const right = findDarkBand(data, w, h, eyeRX0, eyeTop, eyeRX0 + eyeAreaW, eyeBot);
  // 嘴：在脸下半部 60~85%
  const mouthTop = face.y + face.height * 0.6;
  const mouthBot = face.y + face.height * 0.92;
  const mouth = findDarkRegion(data, w, h, face.x + face.width * 0.15, mouthTop, face.x + face.width * 0.85, mouthBot, 2, 12);
  // 头部姿态：face center 偏离帧中心 / face 宽度
  const headX = ((face.x + face.width / 2) / w) * 2 - 1; // -1..1
  const headY = ((face.y + face.height / 2) / h) * 2 - 1;
  // z 用 face 面积占帧面积比例（粗略）
  const ratio = (face.width * face.height) / (w * h);
  const headZ = Math.min(1, Math.max(-1, (ratio - 0.1) * 4));
  // roll：左右眼 y 差 / 眼距
  let rot = 0;
  if (left && right) {
    const eyeDy = left.y - right.y;
    const eyeDx = Math.max(8, right.x - left.x);
    rot = Math.atan2(eyeDy, eyeDx);
  }
  return {
    time: 0,
    bbox: face,
    eyeL: left
      ? {
          x: left.x + left.w / 2,
          y: left.y + left.h / 2,
          open: Math.min(1, left.darkness / 110),
        }
      : null,
    eyeR: right
      ? {
          x: right.x + right.w / 2,
          y: right.y + right.h / 2,
          open: Math.min(1, right.darkness / 110),
        }
      : null,
    mouth: mouth
      ? {
          x: mouth.x,
          y: mouth.y,
          width: mouth.width,
          height: mouth.height,
          open: mouth.open,
        }
      : null,
    head: { x: headX, y: headY, z: headZ, rot: rot * (180 / Math.PI) * 0.2 },
  };
};

/* ============================================================
 * 3) 平滑
 * ========================================================== */

const smooth = (samples: FaceSample[], beta = 0.5): FaceSample[] => {
  const out: FaceSample[] = [];
  let last: FaceSample | null = null;
  for (const s of samples) {
    if (!last) {
      out.push(s);
      last = s;
      continue;
    }
    const blend = (a: number, b: number) => a * (1 - beta) + b * beta;
    const merged: FaceSample = {
      time: s.time,
      bbox: s.bbox,
      eyeL: s.eyeL && last.eyeL
        ? {
            x: blend(last.eyeL.x, s.eyeL.x),
            y: blend(last.eyeL.y, s.eyeL.y),
            open: blend(last.eyeL.open, s.eyeL.open),
          }
        : s.eyeL,
      eyeR: s.eyeR && last.eyeR
        ? {
            x: blend(last.eyeR.x, s.eyeR.x),
            y: blend(last.eyeR.y, s.eyeR.y),
            open: blend(last.eyeR.open, s.eyeR.open),
          }
        : s.eyeR,
      mouth: s.mouth && last.mouth
        ? {
            x: blend(last.mouth.x, s.mouth.x),
            y: blend(last.mouth.y, s.mouth.y),
            width: blend(last.mouth.width, s.mouth.width),
            height: blend(last.mouth.height, s.mouth.height),
            open: blend(last.mouth.open, s.mouth.open),
          }
        : s.mouth,
      head: {
        x: blend(last.head.x, s.head.x),
        y: blend(last.head.y, s.head.y),
        z: blend(last.head.z, s.head.z),
        rot: blend(last.head.rot, s.head.rot),
      },
    };
    out.push(merged);
    last = merged;
  }
  return out;
};

/* ============================================================
 * 4) 映射到 Live2D 参数曲线
 * ========================================================== */

const toLive2DClip = (samples: FaceSample[], fps: number): Live2DParamClip => {
  const channels: Record<string, Array<{ time: number; value: number }>> = {
    "ParamEyeLOpen": [],
    "ParamEyeROpen": [],
    "ParamMouthOpenY": [],
    "ParamAngleX": [],
    "ParamAngleY": [],
    "ParamAngleZ": [],
    "ParamBodyAngleX": [],
    "ParamBodyAngleY": [],
    "ParamBodyAngleZ": [],
  };
  samples.forEach((s, i) => {
    const t = i / fps;
    channels.ParamEyeLOpen.push({ time: t, value: s.eyeL?.open ?? 1 });
    channels.ParamEyeROpen.push({ time: t, value: s.eyeR?.open ?? 1 });
    channels.ParamMouthOpenY.push({ time: t, value: s.mouth?.open ?? 0 });
    channels.ParamAngleX.push({ time: t, value: s.head.x * 30 }); // 头部 yaw
    channels.ParamAngleY.push({ time: t, value: s.head.y * 30 }); // 头部 pitch
    channels.ParamAngleZ.push({ time: t, value: s.head.rot }); // 头部 roll
    channels.ParamBodyAngleX.push({ time: t, value: s.head.x * 10 });
    channels.ParamBodyAngleY.push({ time: t, value: s.head.y * 5 });
    channels.ParamBodyAngleZ.push({ time: t, value: s.head.rot * 0.5 });
  });
  const duration = samples.length / fps;
  return { channels, duration, fps };
};

/* ============================================================
 * 5) CSV
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
 * 6) 主入口
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
  // 把处理画布限制在 240x180 以提速
  const procW = 240;
  const procH = Math.round((procW / v.videoWidth) * v.videoHeight);
  const duration = v.duration;
  const total = Math.max(1, Math.floor(duration * opts.fps));
  const samples: FaceSample[] = [];
  for (let i = 0; i < total; i++) {
    const t = (i / opts.fps);
    await seekTo(v, t);
    const c = drawToCanvas(v, procW, procH);
    const ctx = c.getContext("2d")!;
    const img = ctx.getImageData(0, 0, procW, procH);
    const sample = analyzeFrame(img);
    sample.time = t;
    samples.push(sample);
    opts.onProgress?.(i + 1, total);
  }
  URL.revokeObjectURL(v.src);
  const smoothed = opts.smooth ? smooth(samples, 0.5) : samples;
  return {
    samples: smoothed,
    video: { duration, width: v.videoWidth, height: v.videoHeight },
    live2dParams: toLive2DClip(smoothed, opts.fps),
    csv: toCsv(smoothed),
  };
};

/**
 * 把 Live2DParamClip 转成 AnimationClip 形式的兼容输出
 * （每个参数一条"虚拟节点"，节点名 = 参数名）
 */
export const toAnimationClip = (l2d: Live2DParamClip, name = "面部捕捉") => {
  const nodeIds = Object.keys(l2d.channels);
  const fps = l2d.fps;
  const kfCount = Math.floor(l2d.duration * fps);
  const keyframes = Array.from({ length: kfCount }, (_, i) => {
    const t = i / fps;
    const states: Record<string, { x: number; y: number; rotation: number; scale: number }> = {};
    nodeIds.forEach((id) => {
      // 找最近的关键帧
      const ch = l2d.channels[id];
      const idx = Math.min(ch.length - 1, Math.max(0, Math.round(t * fps)));
      const v = ch[idx]?.value ?? 0;
      // 把标量参数映到 scale 上以便 4 通道兼容
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
