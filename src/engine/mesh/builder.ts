/**
 * 树形骨骼网格生成引擎
 * 启发式：
 * - 从 layer 名推测节点名（head/body/arm_L/arm_R/leg_L/leg_R/...）
 * - 根据图层位置（x 偏左/偏右）和 zIndex 推断父子关系
 * - root 为 body，body 上挂 head / arm / leg 等
 */
import type { Layer, MeshNode, Project } from "@/types";
import { uid } from "@/store/projectStore";
import { guessNodeName } from "@/engine/layer/splitter";

const COLORS = ["#FF7AB6", "#FFD66B", "#7CE3B5", "#7CC0FF", "#FF8B5C", "#C7A8FF"];

interface NodeDef {
  id: string;
  name: string;
  hint: string;
  parentHint: string | null;
  x: number; // 归一化 0~1
  y: number;
  color: string;
  bindLayerId: string | null;
}

export const buildMeshFromLayers = (project: Project): MeshNode[] => {
  const { canvasWidth, canvasHeight, layers } = project;
  if (layers.length === 0) return [];

  // 1. 先建立节点定义列表
  const defs: NodeDef[] = [];
  const seen = new Set<string>();
  const colorMap = new Map<string, string>();
  let colorI = 0;

  // 计算整体中心
  const cx = canvasWidth / 2;
  const cy = canvasHeight / 2;

  // 收集所有 layer 的中心点
  const layerInfo = layers.map((l) => {
    const centerX = l.offsetX + l.width / 2;
    const centerY = l.offsetY + l.height / 2;
    const nodeName = guessNodeName(l.name);
    return { layer: l, nodeName, centerX, centerY };
  });

  // 2. body 节点（如果存在名为"身体/躯干/Body/skin"等 layer）
  const bodyLayer = layerInfo.find((li) => /^(body|body|身体|躯干|衣服|上衣|裙子|skin)$/.test(li.nodeName));
  if (bodyLayer) {
    defs.push({
      id: uid(),
      name: "body",
      hint: bodyLayer.layer.name,
      parentHint: null,
      x: bodyLayer.centerX / canvasWidth,
      y: bodyLayer.centerY / canvasHeight,
      color: "#FF7AB6",
      bindLayerId: bodyLayer.layer.id,
    });
    colorMap.set("body", "#FF7AB6");
  }

  // 3. 头节点（位于画布上 1/3，识别 hair/head/face）
  const headLayer = layerInfo.find((li) => ["head", "face", "hair"].includes(li.nodeName));
  if (headLayer) {
    const parentName = defs[0]?.name ?? null;
    defs.push({
      id: uid(),
      name: headLayer.nodeName,
      hint: headLayer.layer.name,
      parentHint: parentName,
      x: headLayer.centerX / canvasWidth,
      y: headLayer.centerY / canvasHeight,
      color: "#FFD66B",
      bindLayerId: headLayer.layer.id,
    });
    colorMap.set(headLayer.nodeName, "#FFD66B");
  }

  // 4. 其它：按 x 偏左/偏右推断 arm_L/leg_L
  for (const li of layerInfo) {
    if ([bodyLayer?.layer.id, headLayer?.layer.id].includes(li.layer.id)) continue;
    if (seen.has(li.layer.id)) continue;
    const name = li.nodeName;
    const isLeft = li.centerX < cx;
    const isTop = li.centerY < cy;
    let parent = defs[0]?.name ?? null;
    if (name.includes("arm") || name.includes("手")) {
      parent = defs[0]?.name ?? null;
    } else if (name.includes("leg") || name.includes("脚")) {
      parent = defs[0]?.name ?? null;
    } else if (name.includes("ear") || name.includes("耳")) {
      parent = headLayer ? headLayer.nodeName : defs[0]?.name ?? null;
    } else if (name.includes("eye") || name.includes("眼") || name.includes("mouth") || name.includes("嘴")) {
      parent = headLayer ? headLayer.nodeName : defs[0]?.name ?? null;
    } else if (name.includes("wing") || name.includes("翅膀") || name.includes("tail") || name.includes("尾巴")) {
      parent = defs[0]?.name ?? null;
    }
    const finalName = (name === "arm" || name === "leg" || name === "ear" || name === "eye" || name === "mouth")
      ? isLeft
        ? `${name}_L`
        : `${name}_R`
      : name;
    if (seen.has(finalName + "_" + li.layer.id)) continue;
    seen.add(li.layer.id);
    defs.push({
      id: uid(),
      name: finalName,
      hint: li.layer.name,
      parentHint: parent,
      x: li.centerX / canvasWidth,
      y: li.centerY / canvasHeight,
      color: COLORS[colorI++ % COLORS.length],
      bindLayerId: li.layer.id,
    });
  }

  // 5. 兜底：若没有 body 节点，使用 root
  if (defs.length === 0) {
    defs.push({
      id: uid(),
      name: "root",
      hint: "",
      parentHint: null,
      x: 0.5,
      y: 0.5,
      color: "#FF7AB6",
      bindLayerId: null,
    });
  } else if (!defs.find((d) => d.parentHint === null)) {
    defs[0].parentHint = null;
  }

  // 6. 解析 parentHint 为 parentId
  const nameToId = new Map(defs.map((d) => [d.name, d.id]));
  const nodes: MeshNode[] = defs.map((d) => ({
    id: d.id,
    name: d.name,
    parentId: d.parentHint ? nameToId.get(d.parentHint) ?? null : null,
    x: d.x,
    y: d.y,
    rotation: 0,
    scale: 1,
    boundLayerId: d.bindLayerId,
    influence: 0.25,
    color: d.color,
  }));

  return nodes;
};

export const NODE_DEFAULT_INFLUENCE = 0.25;
