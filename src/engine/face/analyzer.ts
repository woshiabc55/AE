/**
 * 启发式人脸分析：单帧分析 + 时间平滑
 *
 * 抽出为独立模块以便离线视频与实时 webcam 共用。
 * 算法：肤色连通域 → 双眼/嘴部暗度扫描 → 头部姿态。
 */
export interface FaceSample {
  /** 帧在原视频中的时间（秒） */
  time: number;
  /** 人脸 bbox（像素） */
  bbox: { x: number; y: number; width: number; height: number } | null;
  /** 双眼中心 + 开放度 0~1 */
  eyeL: { x: number; y: number; open: number } | null;
  eyeR: { x: number; y: number; open: number } | null;
  /** 嘴部 bbox + 开放度 */
  mouth: { x: number; y: number; width: number; height: number; open: number } | null;
  /** 头部姿态 */
  head: { x: number; y: number; z: number; rot: number };
}

/* ============================================================
 * 启发式：肤色 / 暗度
 * ========================================================== */

const isSkin = (r: number, g: number, b: number): boolean => {
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
    !(r > 220 && g > 220 && b > 220)
  );
};

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

const findDarkBand = (
  data: Uint8ClampedArray,
  w: number,
  h: number,
  x0: number,
  y0: number,
  x1: number,
  y1: number
) => {
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
) => {
  let best: { x: number; y: number; width: number; height: number; open: number } | null = null;
  const ew = x1 - x0;
  const eh = y1 - y0;
  if (ew <= 0 || eh <= 0) return null;
  for (let dy = 0; dy + minH <= eh; dy += 1) {
    for (let dx = 0; dx < ew; dx += 1) {
      const x = x0 + dx;
      const y = y0 + dy;
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
        const open = Math.min(1, darkness / 120);
        if (!best || open > best.open) {
          best = { x, y, width: Math.min(ew - dx, 8), height: hh, open };
        }
      }
    }
  }
  return best;
};

/* ============================================================
 * 单帧分析
 * ========================================================== */

export const analyzeFrame = (img: ImageData, time = 0): FaceSample => {
  const { data, width: w, height: h } = img;
  const face = findFaceBBox(data, w, h);
  if (!face) {
    return {
      time,
      bbox: null,
      eyeL: null,
      eyeR: null,
      mouth: null,
      head: { x: 0, y: 0, z: 0, rot: 0 },
    };
  }
  const eyeTop = face.y;
  const eyeBot = face.y + face.height * 0.45;
  const eyeAreaW = Math.floor(face.width * 0.45);
  const eyeCenterX = face.x + face.width / 2;
  const eyeLX0 = face.x + face.width * 0.05;
  const eyeRX0 = eyeCenterX + face.width * 0.05;
  const left = findDarkBand(data, w, h, eyeLX0, eyeTop, eyeLX0 + eyeAreaW, eyeBot);
  const right = findDarkBand(data, w, h, eyeRX0, eyeTop, eyeRX0 + eyeAreaW, eyeBot);
  const mouthTop = face.y + face.height * 0.6;
  const mouthBot = face.y + face.height * 0.92;
  const mouth = findDarkRegion(
    data,
    w,
    h,
    face.x + face.width * 0.15,
    mouthTop,
    face.x + face.width * 0.85,
    mouthBot,
    2,
    12
  );
  const headX = ((face.x + face.width / 2) / w) * 2 - 1;
  const headY = ((face.y + face.height / 2) / h) * 2 - 1;
  const ratio = (face.width * face.height) / (w * h);
  const headZ = Math.min(1, Math.max(-1, (ratio - 0.1) * 4));
  let rot = 0;
  if (left && right) {
    const eyeDy = left.y - right.y;
    const eyeDx = Math.max(8, right.x - left.x);
    rot = Math.atan2(eyeDy, eyeDx);
  }
  return {
    time,
    bbox: face,
    eyeL: left
      ? { x: left.x + left.w / 2, y: left.y + left.h / 2, open: Math.min(1, left.darkness / 110) }
      : null,
    eyeR: right
      ? { x: right.x + right.w / 2, y: right.y + right.h / 2, open: Math.min(1, right.darkness / 110) }
      : null,
    mouth: mouth
      ? { x: mouth.x, y: mouth.y, width: mouth.width, height: mouth.height, open: mouth.open }
      : null,
    head: { x: headX, y: headY, z: headZ, rot: rot * (180 / Math.PI) * 0.2 },
  };
};

/* ============================================================
 * 时间平滑（低通）
 * ========================================================== */

export const smoothSamples = (samples: FaceSample[], beta = 0.5): FaceSample[] => {
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
 * 简易增量平滑：用于实时流（保留上一帧状态）
 * ========================================================== */

export class IncrementalSmoother {
  private last: FaceSample | null = null;
  constructor(private beta = 0.6) {}
  push(s: FaceSample): FaceSample {
    if (!this.last) {
      this.last = s;
      return s;
    }
    const b = this.beta;
    const blend = (a: number, c: number) => a * (1 - b) + c * b;
    const merged: FaceSample = {
      time: s.time,
      bbox: s.bbox,
      eyeL: s.eyeL && this.last.eyeL
        ? {
            x: blend(this.last.eyeL.x, s.eyeL.x),
            y: blend(this.last.eyeL.y, s.eyeL.y),
            open: blend(this.last.eyeL.open, s.eyeL.open),
          }
        : s.eyeL,
      eyeR: s.eyeR && this.last.eyeR
        ? {
            x: blend(this.last.eyeR.x, s.eyeR.x),
            y: blend(this.last.eyeR.y, s.eyeR.y),
            open: blend(this.last.eyeR.open, s.eyeR.open),
          }
        : s.eyeR,
      mouth: s.mouth && this.last.mouth
        ? {
            x: blend(this.last.mouth.x, s.mouth.x),
            y: blend(this.last.mouth.y, s.mouth.y),
            width: blend(this.last.mouth.width, s.mouth.width),
            height: blend(this.last.mouth.height, s.mouth.height),
            open: blend(this.last.mouth.open, s.mouth.open),
          }
        : s.mouth,
      head: {
        x: blend(this.last.head.x, s.head.x),
        y: blend(this.last.head.y, s.head.y),
        z: blend(this.last.head.z, s.head.z),
        rot: blend(this.last.head.rot, s.head.rot),
      },
    };
    this.last = merged;
    return merged;
  }
  reset() {
    this.last = null;
  }
}
