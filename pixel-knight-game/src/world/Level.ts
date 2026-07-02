// 关卡数据：世界尺寸、火把位置（用于光照与绘制）

import { GROUND_Y, WORLD_LEFT, WORLD_RIGHT } from "@/config";

export interface TorchPos {
  x: number;
  y: number;
}

// 沿关卡分布的火把（世界坐标）
export const TORCHES: TorchPos[] = [
  { x: 100, y: GROUND_Y - 150 },
  { x: 360, y: GROUND_Y - 150 },
  { x: 640, y: GROUND_Y - 150 },
  { x: 920, y: GROUND_Y - 150 },
  { x: 1200, y: GROUND_Y - 150 },
  { x: 1480, y: GROUND_Y - 150 },
  { x: 1760, y: GROUND_Y - 150 },
  { x: 2040, y: GROUND_Y - 150 },
  { x: 2320, y: GROUND_Y - 150 },
];

export const LEVEL = {
  groundY: GROUND_Y,
  left: WORLD_LEFT,
  right: WORLD_RIGHT,
  torches: TORCHES,
};
