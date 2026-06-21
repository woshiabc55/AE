// 拼豆网格工具函数

import type { PixelCell } from "@/types";

/** 网格坐标转字符串键 */
export function cellKey(x: number, y: number): string {
  return `${x},${y}`;
}

/** 字符串键转网格坐标 */
export function parseKey(key: string): { x: number; y: number } {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
}

/** 镜像 X 坐标（半面对称） */
export function mirrorX(x: number, gridSize: number): number {
  return gridSize - 1 - x;
}

/** 判断是否在中线左侧（含中线） */
export function isLeftHalf(x: number, gridSize: number): boolean {
  return x < gridSize / 2;
}

/** 判断是否在中线上 */
export function isOnCenter(x: number, gridSize: number): boolean {
  if (gridSize % 2 === 0) {
    return x === gridSize / 2 - 1 || x === gridSize / 2;
  }
  return x === Math.floor(gridSize / 2);
}

/** 将 Record<string,string> 转为 PixelCell[] */
export function recordToCells(record: Record<string, string>): PixelCell[] {
  return Object.entries(record).map(([key, color]) => {
    const { x, y } = parseKey(key);
    return { x, y, color };
  });
}

/** 将 PixelCell[] 转为 Record<string,string> */
export function cellsToRecord(cells: PixelCell[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const cell of cells) {
    record[cellKey(cell.x, cell.y)] = cell.color;
  }
  return record;
}

/** 洪水填充：从起点开始，将所有相连的相同颜色格子替换为新颜色 */
export function floodFill(
  record: Record<string, string>,
  startX: number,
  startY: number,
  gridSize: number,
  newColor: string,
): Record<string, string> {
  const startKey = cellKey(startX, startY);
  const targetColor = record[startKey] ?? null;
  if (targetColor === newColor) return record;

  const result = { ...record };
  const queue: Array<{ x: number; y: number }> = [{ x: startX, y: startY }];
  const visited = new Set<string>();

  while (queue.length > 0) {
    const { x, y } = queue.shift()!;
    if (x < 0 || x >= gridSize || y < 0 || y >= gridSize) continue;
    const key = cellKey(x, y);
    if (visited.has(key)) continue;
    visited.add(key);
    const currentColor = result[key] ?? null;
    if (currentColor !== targetColor) continue;
    result[key] = newColor;
    queue.push({ x: x + 1, y }, { x: x - 1, y }, { x, y: y + 1 }, { x, y: y - 1 });
  }
  return result;
}

/** 生成空作品 ID */
export function newArtworkId(): string {
  return `art_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
