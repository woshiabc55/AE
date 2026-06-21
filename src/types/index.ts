// 共享类型定义

export type Side = "left" | "right";

export interface Bead {
  x: number;
  y: number;
  color: number; // 调色板索引
}

export interface Joint {
  id: string;
  x: number;
  y: number;
  parent: string | null;
}

export interface Bone {
  from: string;
  to: string;
  influence: number; // 0~1
}

export interface Pose {
  joint: string;
  x: number;
  y: number;
}

export interface Project {
  id: string;
  name: string;
  gridSize: number;
  palette: string[];
  updatedAt: number;
  createdAt: number;
}

export interface HalfModule {
  id: string;
  projectId: string;
  side: Side;
  label: string;
  beads: Bead[];
}

export interface SkeletonData {
  id: string;
  projectId: string;
  joints: Joint[];
  bones: Bone[];
}

export interface Keyframe {
  id: string;
  projectId: string;
  frame: number;
  poses: Pose[];
}

export interface AnimationData {
  id: string;
  projectId: string;
  fps: number;
  loop: boolean;
  length: number;
}

// .gider 文件根结构
export interface GiderFile {
  meta: {
    format: "gider";
    version: "1.0";
    name: string;
    author: string;
    createdAt: string;
    gridSize: number;
  };
  palette: string[];
  modules: Array<{
    id: string;
    side: Side;
    label: string;
    beads: Bead[];
  }>;
  skeleton: {
    joints: Joint[];
    bones: Bone[];
  };
  keyframes: Array<{
    frame: number;
    poses: Pose[];
  }>;
  animation: {
    fps: number;
    loop: boolean;
    length: number;
  };
}

// 工具类型
export type Tool = "brush" | "eraser" | "fill" | "picker" | "skeleton" | "select";

export const DEFAULT_PALETTE: string[] = [
  "#1a1a1f", // 0 空/描边
  "#f4f1de", // 1 米白
  "#ff5e5b", // 2 珊瑚红
  "#ffd23f", // 3 电光黄
  "#39e991", // 4 薄荷绿
  "#3bceac", // 5 天蓝绿
  "#9b5de5", // 6 紫罗兰
  "#ff8c42", // 7 橙
  "#f15bb5", // 8 粉
  "#00bbf9", // 9 亮蓝
  "#2d2d44", // 10 深紫
  "#8b5a3c", // 12 棕
  "#e63946", // 13 深红
  "#06d6a0", // 14 翠绿
  "#118ab2", // 15 海蓝
  "#073b4c", // 16 深海
  "#ffc436", // 17 暖黄
  "#ff6b6b", // 18 浅红
  "#c9ada7", // 19 灰粉
  "#9a8c98", // 20 灰紫
  "#4a4e69", // 21 暗紫
  "#22223b", // 22 深蓝
  "#f2e9e4", // 23 米白2
  "#ef476f", // 24 玫红
];
