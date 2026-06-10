/**
 * 像素展开（Texture Atlas）打包引擎
 * 支持三种策略：
 *   - shelf  : 货架式，按高度分行（默认，效率高）
 *   - grid   : 等分网格（最直观）
 *   - strip  : 单行长条（适合调试）
 *
 * 输出 atlas 图像（POT 2 的幂）+ 每个 layer 的 slot（UV 坐标）
 */
import type { AtlasResult, AtlasSlot, Layer } from "@/types";

interface PackerInput {
  layers: Layer[];
  /** padding 像素 */
  padding?: number;
  /** 是否强制 POT 2（GPU 友好） */
  powerOfTwo?: boolean;
}

interface PackedPlacement {
  layerId: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

const nextPowerOfTwo = (n: number) => {
  let p = 1;
  while (p < n) p <<= 1;
  return p;
};

const packShelf = (items: { id: string; w: number; h: number }[], padding: number) => {
  // 按高度降序排序
  const sorted = [...items].sort((a, b) => b.h - a.h);
  const placements: PackedPlacement[] = [];
  let cursorX = 0;
  let cursorY = 0;
  let rowH = 0;
  let maxRowW = 0;
  for (const it of sorted) {
    if (cursorX + it.w > 2048) {
      // 换行
      cursorY += rowH + padding;
      cursorX = 0;
      rowH = 0;
    }
    placements.push({ layerId: it.id, x: cursorX, y: cursorY, width: it.w, height: it.h });
    cursorX += it.w + padding;
    if (it.h > rowH) rowH = it.h;
    if (cursorX > maxRowW) maxRowW = cursorX;
  }
  return { placements, width: maxRowW, height: cursorY + rowH };
};

const packGrid = (items: { id: string; w: number; h: number }[], padding: number) => {
  const n = items.length;
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  // 单元宽高 = 所有图层中的最大值
  const cellW = Math.max(...items.map((i) => i.w));
  const cellH = Math.max(...items.map((i) => i.h));
  const placements: PackedPlacement[] = items.map((it, i) => {
    const c = i % cols;
    const r = Math.floor(i / cols);
    return {
      layerId: it.id,
      x: c * (cellW + padding),
      y: r * (cellH + padding),
      width: it.w,
      height: it.h,
    };
  });
  return { placements, width: cols * (cellW + padding), height: rows * (cellH + padding) };
};

const packStrip = (items: { id: string; w: number; h: number }[], padding: number) => {
  let x = 0;
  const maxH = Math.max(...items.map((i) => i.h), 1);
  const placements: PackedPlacement[] = items.map((it) => {
    const p = { layerId: it.id, x, y: 0, width: it.w, height: it.h };
    x += it.w + padding;
    return p;
  });
  return { placements, width: x, height: maxH };
};

/**
 * 主入口：生成 atlas 贴图
 */
export const buildAtlas = async (
  input: PackerInput,
  mode: "shelf" | "grid" | "strip" = "shelf"
): Promise<AtlasResult> => {
  const padding = input.padding ?? 4;
  const powerOfTwo = input.powerOfTwo ?? true;
  const visibleLayers = input.layers.filter((l) => l.visible);

  if (visibleLayers.length === 0) {
    const empty = await renderEmpty(64);
    return {
      width: 64,
      height: 64,
      pngDataUrl: empty,
      slots: [],
      mode,
      efficiency: 0,
      generatedAt: Date.now(),
    };
  }

  // 加载所有图层为 Image
  const imgs = await Promise.all(
    visibleLayers.map(
      (l) =>
        new Promise<{ layer: Layer; img: HTMLImageElement }>((resolve, reject) => {
          const im = new Image();
          im.onload = () => resolve({ layer: l, img: im });
          im.onerror = reject;
          im.src = l.pngDataUrl;
        })
    )
  );

  // 打包布局
  const items = imgs.map(({ layer, img }) => ({ id: layer.id, w: img.naturalWidth, h: img.naturalHeight }));
  const packed =
    mode === "shelf"
      ? packShelf(items, padding)
      : mode === "grid"
      ? packGrid(items, padding)
      : packStrip(items, padding);

  // 调整到 POT
  const rawW = packed.width;
  const rawH = packed.height;
  const W = powerOfTwo ? nextPowerOfTwo(rawW) : rawW;
  const H = powerOfTwo ? nextPowerOfTwo(rawH) : rawH;

  // 绘制 atlas
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);

  // 棋盘背景（方便看到透明区域）
  drawCheckerboard(ctx, W, H, 16);

  const slots: AtlasSlot[] = [];
  for (let i = 0; i < packed.placements.length; i++) {
    const p = packed.placements[i];
    const { img, layer } = imgs.find((x) => x.layer.id === p.layerId)!;
    ctx.drawImage(img, p.x, p.y, p.width, p.height);
    slots.push({
      layerId: layer.id,
      x: p.x,
      y: p.y,
      width: p.width,
      height: p.height,
      u0: p.x / W,
      v0: p.y / H,
      u1: (p.x + p.width) / W,
      v1: (p.y + p.height) / H,
      rotated: false,
    });
  }

  // 在每个 slot 周围画细描边，方便观察
  ctx.strokeStyle = "rgba(255, 122, 182, 0.55)";
  ctx.lineWidth = 1;
  for (const s of slots) {
    ctx.strokeRect(s.x + 0.5, s.y + 0.5, s.width - 1, s.height - 1);
  }

  // 占用率
  const usedPx = slots.reduce((a, s) => a + s.width * s.height, 0);
  const efficiency = W * H > 0 ? usedPx / (W * H) : 0;

  return {
    width: W,
    height: H,
    pngDataUrl: canvas.toDataURL("image/png"),
    slots,
    mode,
    efficiency,
    generatedAt: Date.now(),
  };
};

const drawCheckerboard = (ctx: CanvasRenderingContext2D, w: number, h: number, cell: number) => {
  for (let y = 0; y < h; y += cell) {
    for (let x = 0; x < w; x += cell) {
      const odd = ((x / cell) + (y / cell)) % 2 === 0;
      ctx.fillStyle = odd ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)";
      ctx.fillRect(x, y, cell, cell);
    }
  }
};

const renderEmpty = async (size: number): Promise<string> => {
  const c = document.createElement("canvas");
  c.width = size;
  c.height = size;
  const ctx = c.getContext("2d")!;
  drawCheckerboard(ctx, size, size, 8);
  return c.toDataURL("image/png");
};

/**
 * 给图层在 atlas 上的归一化 UV 中心（用于在预览时定位）
 */
export const slotCenter = (slot: AtlasSlot) => ({
  x: (slot.u0 + slot.u1) / 2,
  y: (slot.v0 + slot.v1) / 2,
});

/** 由 layerId 查 slot */
export const findSlot = (atlas: AtlasResult | null, layerId: string) =>
  atlas?.slots.find((s) => s.layerId === layerId) ?? null;
