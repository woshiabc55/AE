// 大地图布局：战术战场
// 用网格定义墙体/建筑（碰撞 + 渲染），另定义双方基地出生点与中央据点

export const CELL = 4; // 单元格边长(3D 单位)
export const WALL_H = 5; // 墙/建筑高

// 网格符号：# 墙/建筑  . 地面  A 友军基地  B 敌军基地  O 中央据点
export const MAP_ROWS: string[] = [
  "#########################",
  "#A.......#.......#......B#",
  "#A.......#.......#......B#",
  "#A..........##..........B#",
  "#..........####..........#",
  "#....##....OOOO....##....#",
  "#....##....OOOO....##....#",
  "#..........####..........#",
  "#..........##...........#",
  "#B.......#.......#......A#",
  "#B.......#.......#......A#",
  "#B.......#.......#......A#",
  "#########################",
];

export interface ParsedMap {
  grid: number[][]; // 1=墙 0=地
  cols: number;
  rows: number;
  alphaSpawns: { x: number; z: number }[]; // 友军基地(世界坐标)
  bravoSpawns: { x: number; z: number }[];
  capture: { x: number; z: number; r: number }; // 据点中心 + 半径
  halfW: number;
  halfH: number;
}

export function parseMap(): ParsedMap {
  const rows = MAP_ROWS.length;
  const cols = MAP_ROWS[0].length;
  const grid: number[][] = [];
  const alphaSpawns: { x: number; z: number }[] = [];
  const bravoSpawns: { x: number; z: number }[] = [];
  let capR = 0;
  let capC = 0;
  let capCount = 0;

  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      const ch = MAP_ROWS[r][c];
      if (ch === "#") grid[r][c] = 1;
      else grid[r][c] = 0;
      if (ch === "A") alphaSpawns.push(toWorld(r, c, rows, cols));
      if (ch === "B") bravoSpawns.push(toWorld(r, c, rows, cols));
      if (ch === "O") {
        capR += r;
        capC += c;
        capCount++;
      }
    }
  }
  const capCenter =
    capCount > 0
      ? toWorld(capR / capCount, capC / capCount, rows, cols)
      : toWorld(rows / 2, cols / 2, rows, cols);

  return {
    grid,
    cols,
    rows,
    alphaSpawns,
    bravoSpawns,
    capture: { x: capCenter.x, z: capCenter.z, r: CELL * 2.2 },
    halfW: (cols * CELL) / 2,
    halfH: (rows * CELL) / 2,
  };
}

// 网格坐标 -> 世界坐标(居中)
export function toWorld(r: number, c: number, rows: number, cols: number) {
  return {
    x: (c - cols / 2 + 0.5) * CELL,
    z: (r - rows / 2 + 0.5) * CELL,
  };
}

export function worldToCell(x: number, z: number, parsed: ParsedMap) {
  const c = Math.floor(x / CELL + parsed.cols / 2);
  const r = Math.floor(z / CELL + parsed.rows / 2);
  return { r, c };
}
