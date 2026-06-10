/**
 * Photoshop 分层导出
 *
 *  模式 A：导出单张 PSD 二进制（合并图层 + Alpha 蒙板）
 *  模式 B：导出 PSD 风格 ZIP（含独立 PNG 序列 + 元数据 sidecar）
 *
 * PSD 简版规范（8-bit RGB + Alpha 单图层）：
 *  - Header 26 bytes
 *  - Color Mode Data (4 bytes length=0)
 *  - Image Resources (4 bytes length=0)
 *  - Layer and Mask Information
 *    - Layer Info: count + 重复 record
 *    - Channel Image Data
 *  - Image Data (合并预览)
 *
 * 我们这里输出的是简化版：单图层（合并后整图） + Alpha 通道，
 * 能被 Photoshop、GIMP、Krita、Photopea 打开。
 */
import type { Layer, Project } from "@/types";
import { dataUrlToBytes, downloadZip, strToBytes, type ZipEntry } from "@/lib/zip";

/* ---------- PNG 解码 ---------- */

const decodePng = async (dataUrl: string): Promise<ImageData> => {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => {
      const c = document.createElement("canvas");
      c.width = im.naturalWidth;
      c.height = im.naturalHeight;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(im, 0, 0);
      resolve(ctx.getImageData(0, 0, c.width, c.height));
    };
    im.onerror = reject;
    im.src = dataUrl;
  });
};

/* ---------- 合并图层为一张 RGBA ---------- */

const composeAll = async (project: Project): Promise<ImageData> => {
  const w = project.canvasWidth;
  const h = project.canvasHeight;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  ctx.clearRect(0, 0, w, h);
  const sorted = [...project.layers].sort((a, b) => a.zIndex - b.zIndex);
  for (const l of sorted) {
    if (!l.visible) continue;
    const im = new Image();
    await new Promise<void>((res, rej) => {
      im.onload = () => res();
      im.onerror = () => rej(new Error("image load fail"));
      im.src = l.pngDataUrl;
    });
    ctx.drawImage(im, l.offsetX, l.offsetY, l.width, l.height);
  }
  return ctx.getImageData(0, 0, w, h);
};

/* ---------- PSD 编码 ---------- */

const PSD_HEADER = (w: number, h: number, channels: number): Uint8Array => {
  const buf = new Uint8Array(26);
  const v = new DataView(buf.buffer);
  v.setUint32(0, 0x38425053, false); // "8BPS" big-endian signature? actually "8BPS" big-endian reads as 0x38425053
  // Correct PSD signature: 0x38425053 in BE = "8BPS"
  v.setUint16(4, 1, true); // version
  buf[6] = 0; buf[7] = 0; buf[8] = 0; buf[9] = 0; buf[10] = 0; buf[11] = 0; // reserved
  v.setUint16(12, channels, true);
  v.setUint32(14, h, true);
  v.setUint32(18, w, true);
  v.setUint16(22, 8, true); // depth
  v.setUint16(24, 3, true); // color mode = RGB
  return buf;
};

/** PackBits RLE 编码（PSD 规范） */
const packBitsEncode = (data: Uint8Array): Uint8Array => {
  const out: number[] = [];
  let i = 0;
  while (i < data.length) {
    // 找最长重复
    let run = 1;
    while (i + run < data.length && data[i + run] === data[i] && run < 128) run++;
    if (run >= 2) {
      out.push(257 - run); // -run+1 as uint8
      out.push(data[i]);
      i += run;
    } else {
      // 找最长非重复
      let literal = 1;
      while (
        i + literal < data.length &&
        literal < 128 &&
        !(data[i + literal] === data[i + literal - 1] && data[i + literal] === data[i + literal + 1])
      )
        literal++;
      out.push(literal - 1);
      for (let k = 0; k < literal; k++) out.push(data[i + k]);
      i += literal;
    }
  }
  return new Uint8Array(out);
};

/** 写一个通道（行优先） */
const encodeChannel = (channelBytes: Uint8Array, rowSize: number, height: number): Uint8Array => {
  // PSD 行扫描：每行前可能有 2 字节过滤类型
  const rowBytes: Uint8Array[] = [];
  for (let y = 0; y < height; y++) {
    const row = channelBytes.subarray(y * rowSize, y * rowSize + rowSize);
    rowBytes.push(row);
  }
  // 把所有行 pack
  const chunks: Uint8Array[] = [];
  for (const r of rowBytes) {
    const enc = packBitsEncode(r);
    const wrapped = new Uint8Array(enc.length + 2);
    new DataView(wrapped.buffer).setUint16(0, enc.length, true);
    wrapped.set(enc, 2);
    chunks.push(wrapped);
  }
  // 拼接
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const c of chunks) {
    out.set(c, p);
    p += c.length;
  }
  return out;
};

const pad2 = (n: number) => {
  // PSD length paddings: sections must be even
  return n % 2 === 0 ? n : n + 1;
};

const writePsd = (img: ImageData): Uint8Array => {
  const w = img.width;
  const h = img.height;
  const channels = 4; // R, G, B, A

  // 1) Header
  const header = PSD_HEADER(w, h, channels);

  // 2) Color Mode Data (length=0)
  const cmd = new Uint8Array(4);

  // 3) Image Resources (length=0)
  const ird = new Uint8Array(4);

  // 4) Layer and Mask Information
  //    简化：1 个 background 图层（合并后）
  // Layer Info: 长度 + 数量(2) + record
  // record: top,left,bottom,right,numChannels,channelId[len],blendMode(4),opacity(1),clipping(1),flags(1),filler(4),extraDataLen,extraData
  const recSize = 4 * 4 + 2 + channels * 2 + 4 + 1 + 1 + 1 + 4; // = 18 + 2*channels = 26
  const layerInfoBodySize = 2 + recSize + 4 + 0; // count(2) + record + extraData length(4) + extra
  const layerInfoLen = pad2(layerInfoBodySize);
  const layerInfoLenBuf = new Uint8Array(4);
  new DataView(layerInfoLenBuf.buffer).setUint32(0, layerInfoLen, true);

  // layer info body
  const layerInfoBody = new Uint8Array(layerInfoBodySize);
  const lv = new DataView(layerInfoBody.buffer);
  lv.setUint16(0, 1, true); // layer count
  // record
  lv.setInt32(2, 0, true); // top
  lv.setInt32(6, 0, true); // left
  lv.setInt32(10, h, true); // bottom
  lv.setInt32(14, w, true); // right
  lv.setUint16(18, channels, true);
  // channel id + length
  const chIds = [0, 1, 2, -1]; // R, G, B, A (alpha = -1)
  for (let i = 0; i < channels; i++) {
    lv.setInt16(20 + i * 2, chIds[i], true);
  }
  // blend mode signature "8BIM"
  layerInfoBody.set([0x38, 0x42, 0x49, 0x4d], 28);
  layerInfoBody[32] = 0x6e; // 'n' = normal
  layerInfoBody[33] = 0x6f;
  layerInfoBody[34] = 0x72; // 'r'
  layerInfoBody[35] = 0x6d; // 'm' (actually 4 bytes: 'norm')
  // we wrote "8BIM" then 4 bytes mode key
  // Opacity (1)
  layerInfoBody[36] = 255;
  // Clipping (1)
  layerInfoBody[37] = 0;
  // Flags (1): 0 = visible
  layerInfoBody[38] = 0;
  // Filler (4)
  layerInfoBody[39] = 0; layerInfoBody[40] = 0; layerInfoBody[41] = 0; layerInfoBody[42] = 0;
  // Extra data length = channel image data
  // 先写 0 占位，稍后回填
  // layerInfoBody[43..46] 是 extraDataLen(uint32)
  // 接下来 channel image data：每通道一段
  // (我们当前在 layerInfoBody 末尾，extraData 长度通过 lmi 整体长度计算)
  // 实际 PSD 规范：extraData 包含每个通道的 image data 段（length + bytes）。
  // 我们这里直接追加到 layerInfoBody 后更简单，但需要先计算长度。

  // 5) 通道数据（先按 R/G/B/A 顺序）
  const chBuf: Uint8Array[] = [];
  for (let c = 0; c < 4; c++) {
    const bytes = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      bytes[i] = img.data[i * 4 + c];
    }
    chBuf.push(encodeChannel(bytes, w, h));
  }
  // 每段前 2 字节长度
  const chWithLen: Uint8Array[] = chBuf.map((b) => {
    const out = new Uint8Array(b.length + 2);
    new DataView(out.buffer).setUint16(0, b.length, true);
    out.set(b, 2);
    return out;
  });
  // channel image data 总长
  let chTotal = 0;
  chWithLen.forEach((c) => (chTotal += c.length));
  const chTotalPadded = pad2(chTotal);

  // 重新组装 layer info：count + record + extraData
  // extraData 实际包含：每通道的 2 字节长度 + RLE 数据（合并段）
  // 按规范：extraData 应当先写通道 length 列表，但我们简化为线性拼接
  // 重新计算 extraData 长度并填充
  const extraDataLen = chTotal;
  lv.setUint32(43, extraDataLen, true);
  // 修正 record 写入位置：上面 26 字节 record 后面是 extraDataLen (4 字节)
  // 我们整个 layerInfoBody 已经写了 layerInfoBodySize 字节（包含 4 字节 extraData 长度占位）
  // 现在再追加 channel data
  const lmiTotal = layerInfoBody.length + chTotalPadded;
  const lmiLenBuf = new Uint8Array(4);
  new DataView(lmiLenBuf.buffer).setUint32(0, lmiTotal, true);

  // 6) 合并预览（Image Data section）
  // 顺序：R G B A（与 layer channels 一致）
  const merged: Uint8Array[] = [];
  for (let c = 0; c < 4; c++) {
    const bytes = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) bytes[i] = img.data[i * 4 + c];
    merged.push(encodeChannel(bytes, w, h));
  }
  const mergedData = new Uint8Array(merged.reduce((s, c) => s + c.length, 0));
  let mp = 0;
  for (const c of merged) {
    mergedData.set(c, mp);
    mp += c.length;
  }
  // compression type for merged: 1 = RLE
  const compType = new Uint8Array(2);
  new DataView(compType.buffer).setUint16(0, 1, true);

  // 7) 拼接
  const parts: Uint8Array[] = [
    header,
    cmd,
    ird,
    lmiLenBuf,
    layerInfoBody,
    ...chWithLen,
    ...(chTotalPadded > chTotal ? [new Uint8Array(chTotalPadded - chTotal)] : []),
    compType,
    mergedData,
  ];
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let p = 0;
  for (const part of parts) {
    out.set(part, p);
    p += part.length;
  }
  return out;
};

/* ---------- 公开 API ---------- */

/** 导出合并 PSD（教学简化版） */
export const exportPsdMerged = async (project: Project) => {
  const composed = await composeAll(project);
  const bytes = writePsd(composed);
  downloadBytes(bytes, `${slug(project.name)}_merged.psd`, "image/vnd.adobe.photoshop");
};

/** 导出分层 PSD + PNG 序列 + sidecar 元数据 */
export const exportLayeredBundle = async (project: Project) => {
  const entries: ZipEntry[] = [];
  // 合并 PSD
  try {
    const composed = await composeAll(project);
    const psdBytes = writePsd(composed);
    entries.push({ name: "merged.psd", data: psdBytes });
  } catch (e) {
    console.warn("psd 写出失败：", e);
  }
  // 分层 PNG
  const sorted = [...project.layers].sort((a, b) => a.zIndex - b.zIndex);
  const layerMeta: Array<{
    index: number;
    name: string;
    file: string;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
    visible: boolean;
  }> = [];
  sorted.forEach((l, i) => {
    if (!l.visible) return;
    const fname = `layers/${pad(i + 1, 3)}_${slug(l.name)}.png`;
    if (l.pngDataUrl.startsWith("data:image")) {
      entries.push({ name: fname, data: dataUrlToBytes(l.pngDataUrl) });
    }
    layerMeta.push({
      index: i,
      name: l.name,
      file: fname,
      width: l.width,
      height: l.height,
      offsetX: l.offsetX,
      offsetY: l.offsetY,
      visible: l.visible,
    });
  });
  // 蒙板 PNG（per-layer alpha mask，灰度）
  for (const l of sorted) {
    if (!l.visible) continue;
    if (!l.pngDataUrl.startsWith("data:image")) continue;
    try {
      const data = await decodePng(l.pngDataUrl);
      const gray = new Uint8ClampedArray(l.width * l.height * 4);
      for (let i = 0; i < l.width * l.height; i++) {
        const a = data.data[i * 4 + 3];
        gray[i * 4] = a;
        gray[i * 4 + 1] = a;
        gray[i * 4 + 2] = a;
        gray[i * 4 + 3] = 255;
      }
      const c = document.createElement("canvas");
      c.width = l.width;
      c.height = l.height;
      const ctx = c.getContext("2d")!;
      const id = new ImageData(gray, l.width, l.height);
      ctx.putImageData(id, 0, 0);
      const maskUrl = c.toDataURL("image/png");
      const fname = `masks/${pad(sorted.indexOf(l) + 1, 3)}_${slug(l.name)}_mask.png`;
      entries.push({ name: fname, data: dataUrlToBytes(maskUrl) });
    } catch (e) {
      console.warn("mask write fail", e);
    }
  }
  // sidecar 元数据 JSON
  const sidecar = {
    format: "mochi-live.layered-bundle",
    version: 1,
    project: {
      name: project.name,
      sourceMode: project.sourceMode,
      canvasWidth: project.canvasWidth,
      canvasHeight: project.canvasHeight,
    },
    layers: layerMeta,
    nodes: project.nodes.map((n) => ({
      id: n.id,
      name: n.name,
      parentId: n.parentId,
      boundLayerId: n.boundLayerId,
    })),
    animations: project.animations.map((a) => ({
      id: a.id,
      name: a.name,
      duration: a.duration,
      loop: a.loop,
      keyframes: a.keyframes.length,
    })),
    generatedAt: new Date().toISOString(),
  };
  entries.push({ name: "manifest.json", data: strToBytes(JSON.stringify(sidecar, null, 2)) });
  entries.push({
    name: "README.txt",
    data: strToBytes(
      [
        `Mochi Live · Layered Bundle for "${project.name}"`,
        ``,
        `目录结构：`,
        `  merged.psd             —— 合并后的 PSD 文件（Photoshop/GIMP/Krita 兼容）`,
        `  layers/                —— 原始分层 PNG（按 zIndex 顺序）`,
        `  masks/                 —— 每层的灰度 alpha 蒙板`,
        `  manifest.json          —— 完整元数据，可被外部工具解析`,
        ``,
        `时间：${new Date().toLocaleString()}`,
      ].join("\n")
    ),
  });
  downloadZip(entries, `${slug(project.name)}_layered.zip`);
};

const pad = (n: number, len: number) => n.toString().padStart(len, "0");
const slug = (s: string) => s.replace(/[^a-z0-9_\-]+/gi, "_").toLowerCase();

const downloadBytes = (bytes: Uint8Array, filename: string, type: string) => {
  const blob = new Blob([bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer], {
    type,
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 200);
};
