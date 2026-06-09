// WPS 风格的纯文本处理工具集
// 不依赖任何外部库，全部为同步纯函数

export interface CountMeta {
  total: number;
  chinese: number;
  english: number;
  digits: number;
  spaces: number;
  lines: number;
  paragraphs: number;
}

export function countStats(text: string): CountMeta {
  const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const english = (text.match(/[A-Za-z]/g) || []).length;
  const digits = (text.match(/[0-9]/g) || []).length;
  const spaces = (text.match(/[\s]/g) || []).length;
  const linesArr = text.split(/\r?\n/);
  const lines = linesArr.length;
  const paragraphs = linesArr.filter((l) => l.trim().length > 0).length;
  const total = text.length;
  return { total, chinese, english, digits, spaces, lines, paragraphs };
}

// 段落清洗：合并空行 / 删除行尾空白 / 删除半角与全角空格
export function cleanText(text: string): string {
  return text
    .replace(/ /g, '') // 去除不间断空格
    .replace(/　/g, '') // 全角空格
    .replace(/[ \t]+$/gm, '') // 行尾空白
    .replace(/\n{3,}/g, '\n\n') // 合并 3+ 空行为 2
    .replace(/^\s+|\s+$/g, '') // 首尾空白
    .replace(/\r\n/g, '\n'); // 统一换行
}

// 全角 → 半角（数字 / 字母）
export function toHalfWidth(text: string): string {
  return text.replace(/[\uFF01-\uFF5E]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) - 0xFEE0),
  ).replace(/\u3000/g, ' ');
}

// 半角 → 全角
export function toFullWidth(text: string): string {
  return text.replace(/[!-~]/g, (ch) =>
    String.fromCharCode(ch.charCodeAt(0) + 0xFEE0),
  ).replace(/ /g, '\u3000');
}

// 极简 Markdown → 纯文本（去掉标题符号 / 引用 / 链接标记）
export function mdToPlain(text: string): string {
  return text
    .replace(/^#{1,6}\s*/gm, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[(.+?)\]\((.+?)\)/g, '$1 ($2)')
    .replace(/^>\s?/gm, '')
    .replace(/^[-*+]\s+/gm, '• ');
}

// 纯文本 → Markdown 段落
export function plainToMd(text: string): string {
  const paras = text.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return paras.map((p) => (p.includes('\n') ? p : p)).join('\n\n');
}

// 简易繁简映射（不依赖 opencc，覆盖最常用字）
const S2T_MAP: Record<string, string> = {
  国: '國', 时: '時', 说: '說', 样: '樣', 长: '長', 华: '華',
  变: '變', 观: '觀', 记: '記', 听: '聽', 见: '見', 让: '讓',
  马: '馬', 龙: '龍', 风: '風', 飞: '飛', 鸟: '鳥', 鱼: '魚',
  书: '書', 写: '寫', 画: '畫', 银: '銀', 铁: '鐵', 铜: '銅',
  战: '戰', 场: '場', 节: '節', 头: '頭', 脸: '臉', 声: '聲',
  点: '點', 闪: '閃', 烛: '燭', 灯: '燈', 黄: '黃', 红: '紅',
  嘶: '嘶', 吼: '吼', 喊: '喊', 响: '響', 动: '動', 静: '靜',
};
const T2S_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(S2T_MAP).map(([k, v]) => [v, k]),
);
export function toTraditional(text: string): string {
  return text.replace(/[\u4e00-\u9fa5]/g, (ch) => S2T_MAP[ch] || ch);
}
export function toSimplified(text: string): string {
  return text.replace(/[\u4e00-\u9fa5]/g, (ch) => T2S_MAP[ch] || ch);
}

// 拆分长段落为短句（按 。. ！？!?；;\n）
export function splitParagraphs(text: string): string[] {
  return text
    .split(/(?<=[。！？!?；;])\s*|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
