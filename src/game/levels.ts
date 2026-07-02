// 关卡布局数据。字符约定：
//   # = 墙    . = 地板(可走)    E = 记忆回响
//   P = 传送门    S = 暗影实体出生点    @ = 玩家出生点
// 每个单元格在 3D 中对应 CELL_SIZE 单位。
// 关卡采用「开放式柱厅」设计：只有外圈墙与独立立柱，无连续内墙，
// 保证整片地板连通，所有回响均可到达，确保可通关。

export const CELL = 4; // 单元格边长（3D 单位）
export const WALL_H = 4.2; // 墙高

export interface LevelConfig {
  index: number;
  name: string;
  subtitle: string;
  rows: string[];
  enemySpeed: number; // 暗影移动速度
}

export const LEVELS: LevelConfig[] = [
  {
    index: 1,
    name: "寂静回廊",
    subtitle: "回响在此沉眠",
    enemySpeed: 2.4,
    rows: [
      "#############",
      "#@..........#",
      "#..........E#",
      "#..##.......#",
      "#..##.......#",
      "#.......##..#",
      "#.......##..#",
      "#..E........#",
      "#..##.......#",
      "#..##....E..#",
      "#...........#",
      "#.E...S...P.#",
      "#############",
    ],
  },
  {
    index: 2,
    name: "残响迷阵",
    subtitle: "影随步动",
    enemySpeed: 2.9,
    rows: [
      "###############",
      "#@............#",
      "#..##.....##..#",
      "#..##.....##..#",
      "#......E......#",
      "#..##.....##..#",
      "#..##.....##..#",
      "#......S......#",
      "#..##.....##..#",
      "#..##.....##..#",
      "#......E......#",
      "#..##..E..##..#",
      "#.............#",
      "#.E..S..E...P.#",
      "###############",
    ],
  },
  {
    index: 3,
    name: "虚空之核",
    subtitle: "终焉之回响",
    enemySpeed: 3.4,
    rows: [
      "#################",
      "#@..............#",
      "#..##......##...#",
      "#..##..E...##...#",
      "#......##.......#",
      "#..##......##...#",
      "#..##......##...#",
      "#...E....S....E.#",
      "#..##......##...#",
      "#..##......##...#",
      "#......##.......#",
      "#..##..E...##...#",
      "#..##......##...#",
      "#...............#",
      "#.E....S......E.#",
      "#...............#",
      "#......S......P.#",
      "#################",
    ],
  },
];

export type CellType = 0 | 1 | 2 | 3 | 4 | 5;

export interface ParsedLevel {
  grid: CellType[][]; // [row][col]
  cols: number;
  rows: number;
  echoes: { r: number; c: number }[];
  portal: { r: number; c: number } | null;
  shadows: { r: number; c: number }[];
  playerSpawn: { r: number; c: number } | null;
}

export function parseLevel(level: LevelConfig): ParsedLevel {
  const rows = level.rows;
  const rowCount = rows.length;
  const colCount = Math.max(...rows.map((r) => r.length));
  const grid: CellType[][] = [];
  const echoes: { r: number; c: number }[] = [];
  const shadows: { r: number; c: number }[] = [];
  let portal: { r: number; c: number } | null = null;
  let playerSpawn: { r: number; c: number } | null = null;

  for (let r = 0; r < rowCount; r++) {
    const row: CellType[] = [];
    const line = rows[r].padEnd(colCount, "#");
    for (let c = 0; c < colCount; c++) {
      const ch = line[c];
      switch (ch) {
        case "#":
          row.push(1);
          break;
        case "E":
          row.push(2);
          echoes.push({ r, c });
          break;
        case "P":
          row.push(3);
          portal = { r, c };
          break;
        case "S":
          row.push(4);
          shadows.push({ r, c });
          break;
        case "@":
          row.push(5);
          playerSpawn = { r, c };
          break;
        default:
          row.push(0);
      }
    }
    grid.push(row);
  }

  return { grid, cols: colCount, rows: rowCount, echoes, portal, shadows, playerSpawn };
}

// 网格坐标 -> 世界坐标（以地图中心为原点）
export function cellToWorld(r: number, c: number, cols: number, rowCount: number) {
  return {
    x: (c - cols / 2) * CELL,
    z: (r - rowCount / 2) * CELL,
  };
}
