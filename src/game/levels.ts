// 关卡布局数据。字符约定：
//   # = 墙    . = 地板(可走)    E = 记忆回响
//   P = 传送门    S = 暗影实体出生点    @ = 玩家出生点
// 每个单元格在 3D 中对应 CELL_SIZE 单位。
// 关卡采用「开放式柱厅」设计：只有外圈墙与独立立柱，无连续内墙，
// 保证整片地板连通，所有回响均可到达，确保可通关。

export const CELL = 4; // 单元格边长（3D 单位）
export const WALL_H = 4.2; // 墙高

// 每层主题：雾色、行者之光色、墙缝强调色、UI 强调色
export interface LevelTheme {
  fog: number; // 雾色（背景同色）
  light: number; // 行者之光色
  wallAccent: number; // 墙缝/裂纹强调色（用于纹理调色）
  accent: string; // CSS 强调色（HUD/横幅）
}

export interface EchoFragment {
  // 收集回响时随机展示一句记忆碎片
  lines: string[];
}

export interface LevelConfig {
  index: number;
  name: string;
  subtitle: string;
  theme: LevelTheme;
  fragments: EchoFragment;
  rows: string[];
  enemySpeed: number; // 暗影移动速度
  enemyCount: number; // 期望暗影数（实际以布局 S 数量为准）
}

export const LEVELS: LevelConfig[] = [
  {
    index: 1,
    name: "寂静回廊",
    subtitle: "回响在此沉眠",
    enemySpeed: 2.4,
    enemyCount: 1,
    theme: {
      fog: 0x05060a,
      light: 0x6fe0ff,
      wallAccent: 0x2a6f8a,
      accent: "#3ad7ff",
    },
    fragments: {
      lines: [
        "「……记得那条没走过的路吗？」",
        "「回响在低语：你曾在此停留。」",
        "「寂静不是终点，是未被听见的呼唤。」",
      ],
    },
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
    enemyCount: 2,
    theme: {
      fog: 0x080612,
      light: 0x9a7bff,
      wallAccent: 0x4a2a8a,
      accent: "#7a3bff",
    },
    fragments: {
      lines: [
        "「影子比身体先一步抵达终点。」",
        "「迷路的人，才看得见出口的形状。」",
        "「每一次回头，都少了一块自己。」",
      ],
    },
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
    enemyCount: 3,
    theme: {
      fog: 0x0a0512,
      light: 0xff8ae6,
      wallAccent: 0x6a2a5a,
      accent: "#ff5be3",
    },
    fragments: {
      lines: [
        "「核心是空的，所以才能容纳一切。」",
        "「回响汇聚之处，便是出口所在。」",
        "「你听见了吗？那是自己的心跳。」",
      ],
    },
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
  {
    index: 4,
    name: "深渊回响",
    subtitle: "潮声之下",
    enemySpeed: 3.7,
    enemyCount: 4,
    theme: {
      fog: 0x03100c,
      light: 0x5fffc4,
      wallAccent: 0x1a6a52,
      accent: "#3affb0",
    },
    fragments: {
      lines: [
        "「深渊不吞噬，它只是回送你的声音。」",
        "「沉下去，才能听见底下的歌。」",
        "「绿光尽头，是另一片更深的黑。」",
      ],
    },
    rows: [
      "###################",
      "#@................#",
      "#..##......##.....#",
      "#..##..E...##..E..#",
      "#......##.........#",
      "#..##......##.....#",
      "#..##......##..S..#",
      "#...E..........E..#",
      "#..##......##.....#",
      "#..##......##.....#",
      "#......##......E..#",
      "#..##..E...##..S..#",
      "#..##......##.....#",
      "#.................#",
      "#.E....S........E.#",
      "#......##.........#",
      "#..S......##......#",
      "#.................#",
      "#.E....S........P.#",
      "###################",
    ],
  },
  {
    index: 5,
    name: "终末之门",
    subtitle: "归寂",
    enemySpeed: 4.0,
    enemyCount: 5,
    theme: {
      fog: 0x100308,
      light: 0xff6a82,
      wallAccent: 0x7a1a2a,
      accent: "#ff3b5c",
    },
    fragments: {
      lines: [
        "「门后不是终点，是你选择放下的部分。」",
        "「最后的回响，是你自己的名字。」",
        "「归来者，已非离去之人。」",
      ],
    },
    rows: [
      "#####################",
      "#@..................#",
      "#..##......##..E....#",
      "#..##..E...##.......#",
      "#......##.......S...#",
      "#..##......##.......#",
      "#..##......##..E....#",
      "#...E....S......E...#",
      "#..##......##.......#",
      "#..##......##..S....#",
      "#......##.......E...#",
      "#..##..E...##.......#",
      "#..##......##..S....#",
      "#..........##.......#",
      "#.E....S........E...#",
      "#......##...........#",
      "#..S......##..E.....#",
      "#..........##.......#",
      "#.E....S........E...#",
      "#...................#",
      "#.S..............P..#",
      "#####################",
    ],
  },
];

// 随机取一句记忆碎片
export function randomFragment(level: LevelConfig): string {
  const lines = level.fragments.lines;
  return lines[Math.floor(Math.random() * lines.length)];
}

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
