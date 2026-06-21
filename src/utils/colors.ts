// 拼豆标准色卡（参考 Hama 拼豆 48 色）

export interface BeadColor {
  name: string;
  hex: string;
}

export const BEAD_PALETTE: BeadColor[] = [
  // 白/灰/黑
  { name: "纯白", hex: "#ffffff" },
  { name: "米白", hex: "#f5f0e1" },
  { name: "浅灰", hex: "#c8c8c8" },
  { name: "中灰", hex: "#8a8a8a" },
  { name: "深灰", hex: "#4a4a4a" },
  { name: "炭黑", hex: "#1a1a1a" },
  // 红色系
  { name: "正红", hex: "#e63946" },
  { name: "朱红", hex: "#ff6b35" },
  { name: "酒红", hex: "#7a1c2f" },
  { name: "粉红", hex: "#ffb3c1" },
  { name: "玫红", hex: "#d62872" },
  { name: "珊瑚", hex: "#ff7e67" },
  // 橙黄系
  { name: "橙黄", hex: "#ffa500" },
  { name: "金黄", hex: "#ffd23f" },
  { name: "柠檬", hex: "#fff352" },
  { name: "土黄", hex: "#c69214" },
  { name: "驼色", hex: "#c19a6b" },
  { name: "杏色", hex: "#fbceb1" },
  // 绿色系
  { name: "草绿", hex: "#52b788" },
  { name: "翠绿", hex: "#2d6a4f" },
  { name: "薄荷", hex: "#4ecdc4" },
  { name: "青柠", hex: "#a7c957" },
  { name: "墨绿", hex: "#1b4332" },
  { name: "橄榄", hex: "#606c38" },
  // 蓝色系
  { name: "天蓝", hex: "#56cfe1" },
  { name: "宝蓝", hex: "#0077b6" },
  { name: "深蓝", hex: "#03045e" },
  { name: "靛蓝", hex: "#3a0ca3" },
  { name: "湖蓝", hex: "#00b4d8" },
  { name: "雾蓝", hex: "#8ecae6" },
  // 紫色系
  { name: "丁香", hex: "#c8b6ff" },
  { name: "紫罗兰", hex: "#7209b7" },
  { name: "深紫", hex: "#3c096c" },
  { name: "葡萄", hex: "#5e548e" },
  { name: "梅紫", hex: "#9d4edd" },
  { name: "藕荷", hex: "#e0aaff" },
  // 棕色系
  { name: "浅棕", hex: "#a47148" },
  { name: "深棕", hex: "#5c3a21" },
  { name: "咖啡", hex: "#6f4e37" },
  { name: "栗色", hex: "#7b2d26" },
  { name: "焦糖", hex: "#b08968" },
  { name: "可可", hex: "#3d2817" },
  // 肤色系
  { name: "浅肤", hex: "#ffe0bd" },
  { name: "中肤", hex: "#e8b894" },
  { name: "深肤", hex: "#a17353" },
  { name: "小麦", hex: "#c68642" },
  { name: "古铜", hex: "#8d5524" },
  { name: "象牙", hex: "#fffff0" },
];

/** 默认选中色 */
export const DEFAULT_COLOR = "#ff6b35";

/** 生成 UUID */
export function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}
