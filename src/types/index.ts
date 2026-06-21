// 拼豆半面工坊 - 核心类型定义

/** 拼豆格子 */
export interface PixelCell {
  x: number;
  y: number;
  color: string; // hex 格式，如 #ff6b35
}

/** 关节节点 */
export interface Joint {
  id: string;
  x: number; // 网格坐标
  y: number;
  name: string;
  parentBoneId?: string;
}

/** 骨骼连接 */
export interface Bone {
  id: string;
  fromJointId: string;
  toJointId: string;
  influencedCells: string[]; // 受影响格子键 "x,y"
}

/** 骨架数据 */
export interface SkeletonData {
  joints: Joint[];
  bones: Bone[];
}

/** 关键帧中的关节位置快照 */
export type JointPositions = Record<string, { x: number; y: number }>;

/** 动画关键帧 */
export interface Keyframe {
  id: string;
  time: number; // 0~1 归一化时间
  jointPositions: JointPositions;
}

/** 作品记录（IndexedDB 持久化） */
export interface ArtworkRecord {
  id: string;
  name: string;
  thumbnail: string; // Base64 缩略图
  gridSize: number; // 拼豆网格尺寸 (如 32 表示 32×32)
  pixels: PixelCell[];
  skeleton: SkeletonData;
  keyframes: Keyframe[];
  createdAt: number;
  updatedAt: number;
}

/** 创作模式 */
export type WorkMode = "draw" | "rig" | "animate";

/** 绘制工具 */
export type DrawTool = "brush" | "eraser" | "fill" | "picker";

/** 工具状态 */
export interface ToolState {
  tool: DrawTool;
  color: string;
  brushSize: number;
}

/** 几何点 */
export interface Point {
  x: number;
  y: number;
}
