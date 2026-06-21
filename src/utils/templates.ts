import type { Bead, Side } from "@/types";
import { DEFAULT_PALETTE } from "@/types";

// 半面模板：每个模板只定义左半面，右半面通过镜像生成
export interface HalfTemplate {
  id: string;
  name: string;
  label: string;
  emoji: string;
  gridSize: number;
  // 简化的图案：用字符表示调色板索引，'.' 表示空
  // 每个字符代表一颗豆，按行排列
  pattern: string[];
}

// 镜像左半面生成右半面
export function mirrorBeads(beads: Bead[], gridSize: number): Bead[] {
  return beads.map((b) => ({
    x: gridSize - 1 - b.x,
    y: b.y,
    color: b.color,
  }));
}

// 从字符图案解析为 beads 数组（仅左半面）
function parsePattern(pattern: string[]): Bead[] {
  const beads: Bead[] = [];
  pattern.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x];
      if (ch === "." || ch === " ") continue;
      const color = parseInt(ch, 16);
      if (!Number.isNaN(color)) {
        beads.push({ x, y, color });
      }
    }
  });
  return beads;
}

export const HALF_TEMPLATES: HalfTemplate[] = [
  {
    id: "cat",
    name: "cat",
    label: "猫脸",
    emoji: "🐱",
    gridSize: 16,
    // 0=描边 1=米白 2=珊瑚红 4=薄荷绿 6=紫罗兰
    pattern: [
      "00..........00",
      "0.0........0.0",
      "0.1........1.0",
      "0.11......11.0",
      "0.111....111.0",
      "0.1111..1111.0",
      "0.1111111111.0",
      "0.1166116611.0",
      "0.1166116611.0",
      "0.1111111111.0",
      "0.1112222111.0",
      "0.1112222111.0",
      "0.1111111111.0",
      "0.1114444111.0",
      "0.1111111111.0",
      "00..........00",
    ],
  },
  {
    id: "robot",
    name: "robot",
    label: "机器人",
    emoji: "🤖",
    gridSize: 16,
    pattern: [
      "00000000000000",
      "01111111111110",
      "01333333333110",
      "01333333333110",
      "01333333333110",
      "01111111111110",
      "01111111111110",
      "01166111166110",
      "01166111166110",
      "01111111111110",
      "01111111111110",
      "01111122111110",
      "01111122111110",
      "01111111111110",
      "01111111111110",
      "00000000000000",
    ],
  },
  {
    id: "flower",
    name: "flower",
    label: "花朵",
    emoji: "🌸",
    gridSize: 16,
    pattern: [
      "................",
      "....00....00....",
      "...0220..0220...",
      "...0220..0220...",
      "....00....00....",
      ".....0....0.....",
      ".....044440.....",
      "....04444440....",
      "....04444440....",
      "....04444440....",
      ".....044440.....",
      "......0440......",
      "......040.......",
      "......040.......",
      "......040.......",
      "................",
    ],
  },
  {
    id: "star",
    name: "star",
    label: "星星",
    emoji: "⭐",
    gridSize: 16,
    pattern: [
      "................",
      "................",
      ".......00.......",
      "......030.......",
      "......030.......",
      "0000003330000000",
      "03333333333330..",
      "00333333333300..",
      ".003333333300...",
      "..0033333300....",
      "...00333300.....",
      "....003300......",
      "....00300.......",
      "...00300........",
      "..00300.........",
      "................",
    ],
  },
  {
    id: "heart",
    name: "heart",
    label: "心形",
    emoji: "❤️",
    gridSize: 16,
    pattern: [
      "................",
      "..00......00....",
      ".0220....0220...",
      "022220..022220..",
      "02222200222220..",
      "02222222222220..",
      "02222222222220..",
      ".022222222220...",
      "..0222222220....",
      "...0222220......",
      "....02220.......",
      ".....020........",
      ".....00.........",
      "................",
      "................",
      "................",
    ],
  },
  {
    id: "skull",
    name: "skull",
    label: "骷髅",
    emoji: "💀",
    gridSize: 16,
    pattern: [
      "................",
      "....000000......",
      "...01111110.....",
      "..0111111110....",
      ".011111111110...",
      ".011111111110...",
      ".016611116610...",
      ".016611116610...",
      ".011111111110...",
      ".011122211110...",
      "..0112221110....",
      "...01111110.....",
      "....011110......",
      "....0.0.0.......",
      "....0.0.0.......",
      "................",
    ],
  },
];

// 获取模板的 beads（左半面）
export function getTemplateBeads(templateId: string): Bead[] {
  const t = HALF_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return [];
  return parsePattern(t.pattern);
}

// 获取模板的镜像 beads（右半面）
export function getTemplateMirrorBeads(templateId: string): Bead[] {
  const t = HALF_TEMPLATES.find((x) => x.id === templateId);
  if (!t) return [];
  return mirrorBeads(parsePattern(t.pattern), t.gridSize);
}

// 默认调色板
export function getDefaultPalette(): string[] {
  return [...DEFAULT_PALETTE];
}

// 创建空白半面
export function emptyBeads(): Bead[] {
  return [];
}

// 翻转 beads（水平/垂直）
export function flipBeads(
  beads: Bead[],
  gridSize: number,
  mode: "h" | "v",
): Bead[] {
  return beads.map((b) => ({
    x: mode === "h" ? gridSize - 1 - b.x : b.x,
    y: mode === "v" ? gridSize - 1 - b.y : b.y,
    color: b.color,
  }));
}

// 将 side 转中文
export function sideLabel(side: Side): string {
  return side === "left" ? "左半面" : "右半面";
}
