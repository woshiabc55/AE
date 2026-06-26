// ===== 基础变换 =====
export interface Transform {
  translateX: number;
  translateY: number;
  rotate: number;
  scaleX: number;
  scaleY: number;
  skewX: number;
  skewY: number;
  originX: number;
  originY: number;
}

export const defaultTransform: Transform = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  scaleX: 1,
  scaleY: 1,
  skewX: 0,
  skewY: 0,
  originX: 0.5,
  originY: 0.5,
};

// ===== 填充与描边 =====
export interface GradientStop {
  offset: number;
  color: string;
  opacity: number;
}

export interface FillStyle {
  type: 'none' | 'solid' | 'linear-gradient' | 'radial-gradient';
  color: string;
  opacity: number;
  gradientStops?: GradientStop[];
}

export interface StrokeStyle {
  color: string;
  width: number;
  opacity: number;
  linecap: 'butt' | 'round' | 'square';
  linejoin: 'miter' | 'round' | 'bevel';
  dasharray?: string;
}

export const defaultFill: FillStyle = { type: 'solid', color: '#00e5ff', opacity: 1 };
export const defaultStroke: StrokeStyle = { color: '#ffffff', width: 0, opacity: 1, linecap: 'round', linejoin: 'round' };

// ===== SVG 元素 =====
export type SVGElementType = 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'text' | 'g' | 'image';

export interface SVGElement {
  id: string;
  layerId: string;
  type: SVGElementType;
  attrs: Record<string, number | string>;
  transform: Transform;
  fill: FillStyle;
  stroke: StrokeStyle;
  children?: SVGElement[];
}

// ===== 图层 =====
export type LayerType = 'shape' | 'group' | 'image' | 'text';

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: string;
  parentId: string | null;
  order: number;
  colorTag: string;
  elementIds: string[];
  expanded: boolean;
}

// ===== 缓动 =====
export type EasingPreset =
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'back-in'
  | 'back-out'
  | 'back-in-out'
  | 'elastic-in'
  | 'elastic-out'
  | 'bounce-in'
  | 'bounce-out';

export interface EasingData {
  type: 'preset' | 'cubic-bezier' | 'spring';
  name?: EasingPreset;
  cubicBezier?: [number, number, number, number];
  springConfig?: { stiffness: number; damping: number; mass: number };
}

export const defaultEasing: EasingData = { type: 'preset', name: 'ease-in-out' };

// ===== 关键帧 =====
export interface KeyframeProps {
  transform?: Partial<Transform>;
  opacity?: number;
  fill?: Partial<FillStyle>;
  stroke?: Partial<StrokeStyle>;
  [key: string]: unknown;
}

export interface Keyframe {
  id: string;
  layerId: string;
  elementId: string;
  frame: number;
  properties: KeyframeProps;
  easing: EasingData;
}

// ===== 场景 =====
export type TransitionType = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'slide-up' | 'slide-down' | 'zoom-in' | 'zoom-out';

export interface Transition {
  type: TransitionType;
  duration: number;
  easing: EasingData;
}

export const defaultTransition: Transition = { type: 'fade', duration: 15, easing: defaultEasing };

export interface Scene {
  id: string;
  name: string;
  order: number;
  startFrame: number;
  endFrame: number;
  transition: Transition;
  thumbnail: string;
}

// ===== 变量与事件 =====
export type VariableType = 'number' | 'string' | 'boolean' | 'color';

export interface Variable {
  id: string;
  name: string;
  type: VariableType;
  defaultValue: string | number | boolean;
  currentValue: string | number | boolean;
}

export type EventType = 'click' | 'hover' | 'frame-reach' | 'variable-change' | 'scene-end';
export type ActionType = 'play-scene' | 'set-variable' | 'toggle-visibility' | 'set-property' | 'play-animation';

export interface Action {
  type: ActionType;
  targetId?: string;
  params: Record<string, unknown>;
}

export interface EventBinding {
  id: string;
  eventType: EventType;
  sourceElementId?: string;
  sourceFrame?: number;
  sourceVariableId?: string;
  condition?: {
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte';
    value: unknown;
  };
  actions: Action[];
}

// ===== 项目 =====
export interface Project {
  id: string;
  name: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  backgroundColor: string;
  scenes: Scene[];
  layers: Layer[];
  elements: SVGElement[];
  keyframes: Keyframe[];
  variables: Variable[];
  eventBindings: EventBinding[];
  createdAt: number;
  updatedAt: number;
}

// ===== 工具类型 =====
export type ToolType = 'select' | 'rect' | 'circle' | 'ellipse' | 'line' | 'path' | 'text' | 'image' | 'hand';

// ===== UI 状态 =====
export type PanelTab = 'properties' | 'logic' | 'export';

export const LAYER_COLORS = [
  '#00e5ff', '#ff6b6b', '#a855f7', '#22c55e',
  '#f472b6', '#facc15', '#3b82f6', '#ef4444',
];
