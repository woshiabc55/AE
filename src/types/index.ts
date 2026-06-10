/**
 * Mochi Live - 核心数据模型类型定义
 */

export type ShapeType = "rect" | "ellipse" | "path" | "freehand" | "text";

export interface Shape {
  id: string;
  type: ShapeType;
  name: string;
  /** SVG path / d / points / 文本等数据 */
  data: string;
  /** 渲染属性 */
  fill: string;
  stroke: string;
  strokeWidth: number;
  opacity: number;
  /** 包围盒（用于选择和分层） */
  bbox: { x: number; y: number; width: number; height: number };
  /** 父子关系，指向 group id */
  parentId: string | null;
  /** 层级 zIndex */
  zIndex: number;
  visible: boolean;
  locked: boolean;
}

export interface ShapeGroup {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  visible: boolean;
}

export interface Layer {
  id: string;
  name: string;
  /** 切分后的 PNG dataURL */
  pngDataUrl: string;
  /** 实际图像尺寸 */
  width: number;
  height: number;
  /** 在画布中的目标位置（默认居中） */
  offsetX: number;
  offsetY: number;
  zIndex: number;
  visible: boolean;
  /** 由哪个 SVG group/shape 切分而来 */
  sourceIds: string[];
  /** 默认关联的网格节点名（自动推断） */
  bindNodeHint?: string;
}

export interface MeshNode {
  id: string;
  name: string;
  parentId: string | null;
  /** 节点在画布中的归一化坐标（0~1） */
  x: number;
  y: number;
  rotation: number;
  scale: number;
  /** 关联的图层 id */
  boundLayerId: string | null;
  /** 权重半径（影响子节点影响范围） */
  influence: number;
  color: string;
}

export interface KeyFrame {
  id: string;
  time: number;
  nodeStates: Record<
    string,
    {
      x: number;
      y: number;
      rotation: number;
      scale: number;
    }
  >;
}

export interface AnimationClip {
  id: string;
  name: string;
  duration: number;
  loop: boolean;
  keyframes: KeyFrame[];
  /** 是否来自模板 */
  fromTemplate?: string;
}

export interface Project {
  id: string;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  shapes: Shape[];
  groups: ShapeGroup[];
  layers: Layer[];
  nodes: MeshNode[];
  animations: AnimationClip[];
  /** 当前生成的像素展开贴图 */
  atlas: AtlasResult | null;
  createdAt: number;
  updatedAt: number;
}

export interface HistoryState {
  shapes: Shape[];
  groups: ShapeGroup[];
}

/** 单个图层在 Atlas 贴图中的位置与尺寸（UV 坐标） */
export interface AtlasSlot {
  layerId: string;
  /** 在 atlas 图像中的像素区域 */
  x: number;
  y: number;
  width: number;
  height: number;
  /** UV 归一化坐标（0~1） */
  u0: number;
  v0: number;
  u1: number;
  v1: number;
  /** 旋转 0/90 度（暂时只支持 0） */
  rotated: boolean;
}

export interface AtlasResult {
  /** atlas 的最终尺寸（2 的幂次） */
  width: number;
  height: number;
  /** 整张 PNG dataURL */
  pngDataUrl: string;
  /** 各图层在 atlas 中的位置 */
  slots: AtlasSlot[];
  /** packing 模式 */
  mode: "shelf" | "grid" | "strip";
  /** packing 效率（被占用像素 / 总像素） */
  efficiency: number;
  /** 生成时间 */
  generatedAt: number;
}
