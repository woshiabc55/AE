/**
 * 图层切分引擎
 * 策略：
 * 1. 将完整 SVG 栅格化到一个大画布，得到基础图像
 * 2. 按 SVG 分组 <g> 逐个独立栅格化并提取包围盒，作为图层
 * 3. 保留每个图层的图像、命名和位置信息
 */
import type { Layer, Project } from "@/types";
import { projectToSvg, rasterizeSvg } from "@/engine/svg/svg";
import { uid } from "@/store/projectStore";

/**
 * 将分组提取为单独图层：每个 group 单独栅格化为 PNG
 * 同时栅格化全图作为参考底图（可选）
 */
export const splitIntoLayers = async (project: Project): Promise<Layer[]> => {
  const { canvasWidth, canvasHeight, groups, shapes } = project;
  const visibleGroups = groups.filter((g) => g.visible);
  const layers: Layer[] = [];

  const fullSvg = projectToSvg(project);
  await rasterizeSvg(fullSvg, canvasWidth, canvasHeight).catch(() => null);

  // 单分组切分
  for (let i = 0; i < visibleGroups.length; i++) {
    const group = visibleGroups[i];
    const groupShapes = shapes.filter((s) => s.parentId === group.id && s.visible);
    if (groupShapes.length === 0) continue;
    const sub: Project = {
      ...project,
      groups: [group],
      shapes: groupShapes,
    };
    try {
      const { dataUrl, canvas } = await rasterizeSvg(projectToSvg(sub), canvasWidth, canvasHeight, 2);
      // 提取非透明包围盒（裁剪函数返回的是 2x 像素坐标）
      const tight = cropToContent(canvas);
      const layer: Layer = {
        id: uid(),
        name: group.name || `图层 ${i + 1}`,
        pngDataUrl: tight.dataUrl,
        width: tight.width / 2,
        height: tight.height / 2,
        offsetX: tight.minX / 2,
        offsetY: tight.minY / 2,
        zIndex: i,
        visible: true,
        sourceIds: groupShapes.map((s) => s.id),
        bindNodeHint: group.name,
      };
      layers.push(layer);
    } catch (e) {
      console.warn("layer split fail", group.name, e);
    }
  }

  // 顶层未分组 shape 作为兜底图层
  const topShapes = shapes.filter((s) => s.parentId === null && s.visible);
  if (topShapes.length > 0) {
    const sub: Project = { ...project, groups: [], shapes: topShapes };
    try {
      const { dataUrl, canvas } = await rasterizeSvg(projectToSvg(sub), canvasWidth, canvasHeight, 2);
      const tight = cropToContent(canvas);
      layers.push({
        id: uid(),
        name: "未分组",
        pngDataUrl: tight.dataUrl,
        width: tight.width / 2,
        height: tight.height / 2,
        offsetX: tight.minX / 2,
        offsetY: tight.minY / 2,
        zIndex: layers.length,
        visible: true,
        sourceIds: topShapes.map((s) => s.id),
      });
    } catch {}
  }

  // 给每个图层分配标签色
  layers.forEach((l, i) => {
    l.zIndex = i;
  });

  return layers;
};

/**
 * 裁剪非透明包围盒
 */
const cropToContent = (
  canvas: HTMLCanvasElement
): { dataUrl: string; width: number; height: number; minX: number; minY: number } => {
  const ctx = canvas.getContext("2d")!;
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  let minX = width,
    minY = height,
    maxX = -1,
    maxY = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const a = data[(y * width + x) * 4 + 3];
      if (a > 8) {
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxX < 0) {
    return { dataUrl: canvas.toDataURL("image/png"), width, height, minX: 0, minY: 0 };
  }
  const cw = maxX - minX + 1;
  const ch = maxY - minY + 1;
  const out = document.createElement("canvas");
  out.width = cw;
  out.height = ch;
  const octx = out.getContext("2d")!;
  octx.drawImage(canvas, minX, minY, cw, ch, 0, 0, cw, ch);
  return { dataUrl: out.toDataURL("image/png"), width: cw, height: ch, minX, minY };
};

const SUGGEST_PALETTE = ["#FF7AB6", "#FFD66B", "#7CE3B5", "#7CC0FF", "#FF8B5C", "#C7A8FF"];

/**
 * 根据形状的包围盒自动推断分组颜色，用于左侧树
 */
export const suggestGroupColor = (i: number): string => SUGGEST_PALETTE[i % SUGGEST_PALETTE.length];

/**
 * 根据 layer 名称猜测动画中常用的网格节点名
 * 例如 "左臂" → "arm_L", "头发" → "hair"
 */
export const guessNodeName = (layerName: string): string => {
  const lower = layerName.toLowerCase();
  const map: Record<string, string> = {
    头: "head",
    脸: "face",
    眼: "eye",
    嘴: "mouth",
    头发: "hair",
    身体: "body",
    躯干: "body",
    手臂: "arm",
    左手: "arm_L",
    右手: "arm_R",
    腿: "leg",
    左脚: "leg_L",
    右脚: "leg_R",
    脚: "leg",
    手: "hand",
    衣服: "body",
    上衣: "body",
    裙子: "skirt",
    尾巴: "tail",
    耳朵: "ear",
    左耳: "ear_L",
    右耳: "ear_R",
    翅膀: "wing",
    角: "horn",
    背景: "bg",
  };
  for (const key of Object.keys(map)) {
    if (lower.includes(key)) return map[key];
  }
  return layerName.replace(/\s/g, "_");
};
