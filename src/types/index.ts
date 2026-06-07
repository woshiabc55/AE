// 通用项目与领域模型类型
export type ProjectType = 'svg' | 'live2d';

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  createdAt: number;
  updatedAt: number;
  thumbnail?: string;
  data: SvgProjectData | Live2DProjectData;
}

// ============ SVG 模型 ============
export interface SvgProjectData {
  width: number;
  height: number;
  background: string;
  duration: number; // 秒
  fps: number;
  layers: SvgLayer[];
  tracks: SvgTrack[];
}

export type SvgLayerKind = 'rect' | 'circle' | 'ellipse' | 'path' | 'text' | 'image' | 'group' | 'polygon';

export interface SvgLayer {
  id: string;
  name: string;
  kind: SvgLayerKind;
  visible: boolean;
  locked: boolean;
  parentId?: string | null;
  attrs: Record<string, string | number>;
  style: Record<string, string | number>;
  transform: { x: number; y: number; rotate: number; scaleX: number; scaleY: number; opacity: number };
  // 用于 path 的 d
  d?: string;
  // 用于 text
  text?: string;
  // 用于 image
  href?: string;
}

export interface SvgTrack {
  id: string;
  layerId: string;
  property: 'x' | 'y' | 'rotate' | 'scaleX' | 'scaleY' | 'opacity' | 'fill' | 'stroke' | 'd';
  keyframes: SvgKeyframe[];
}

export interface SvgKeyframe {
  id: string;
  time: number; // 秒
  value: number | string;
  easing: EasingPreset | BezierEasing;
}

export type EasingPreset = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'easeOutBack' | 'easeOutElastic';

export interface BezierEasing {
  type: 'bezier';
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

// ============ Live2D 模型 ============
export interface Live2DProjectData {
  canvas: { width: number; height: number };
  background: string;
  parts: Live2DPart[];
  parameters: Live2DParameter[];
  motions: Live2DMotion[];
  expressions: Live2DExpression[];
  currentMotion?: string;
}

export type PartKind = 'head' | 'eye' | 'mouth' | 'hair' | 'body' | 'arm' | 'leg' | 'accessory';

export interface Live2DPart {
  id: string;
  name: string;
  kind: PartKind;
  z: number; // 层级
  visible: boolean;
  // 形状定义:简化用 svg 路径表达
  path: string;
  fill: string;
  stroke: string;
  // 网格:用于 warp mesh
  meshRows: number;
  meshCols: number;
  // 当前形变 (per-vertex 偏移)
  vertices: number[]; // 长度 = (rows+1) * (cols+1) * 2
  // 基础锚点
  anchor: { x: number; y: number };
  // 跟随参数 (受参数影响的形变)
  bindings: PartBinding[];
}

export interface PartBinding {
  parameterId: string;
  // 形变影响:平移 / 缩放 / 旋转 / 自定义顶点
  mode: 'translate' | 'scale' | 'rotate' | 'vertex';
  // 强度
  weight: number;
  // 顶点模式时:对应哪些顶点索引
  vertexIndices?: number[];
}

export interface Live2DParameter {
  id: string;
  name: string;
  min: number;
  max: number;
  default: number;
  // 表达式:支持其他参数运算
  expression?: string;
}

export interface Live2DKeyframe {
  time: number;
  value: number;
  easing: EasingPreset | BezierEasing;
}

export interface Live2DMotion {
  id: string;
  name: string;
  trigger: 'idle' | 'tap' | 'flick' | 'shake' | 'custom';
  fadeIn: number;
  fadeOut: number;
  loop: boolean;
  tracks: Live2DMotionTrack[];
}

export interface Live2DMotionTrack {
  parameterId: string;
  keyframes: Live2DKeyframe[];
}

export interface Live2DExpression {
  id: string;
  name: string;
  // 设置参数值
  setParameters: { id: string; value: number }[];
}
