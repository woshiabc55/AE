// 提示词模板渲染工具
import type { SkillRecord } from "@/types";

export function renderPrompt(tpl: string, values: Record<string, string>): string {
  return tpl.replace(/\{\{\s*([\w-]+)\s*\}\}/g, (_m, key) => {
    const v = values[key];
    return v && v.trim() ? v : `（待填写：${key}）`;
  });
}

export function extractVars(tpl: string): string[] {
  const set = new Set<string>();
  const re = /\{\{\s*([\w-]+)\s*\}\}/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(tpl))) set.add(m[1]);
  return Array.from(set);
}

// 估算 token 数（粗略：中文 1.5 字符/token，英文 4 字符/token）
export function estimateTokens(text: string): number {
  if (!text) return 0;
  const cn = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const other = text.length - cn;
  return Math.ceil(cn / 1.5 + other / 4);
}

// ==== v1 新增：宏展开 ====

// 提取 @skill:key 或 @skill("name") 形式
const MACRO_RE = /@skill:([a-zA-Z0-9_-]+)/g;

export interface ExpandedPrompt {
  text: string;
  usedKeys: string[];
  missing: string[];
}

// 在提示词里展开 @skill:key 宏。
// 展开顺序：先展开宏，再渲染 {{var}}。
export function expandMacros(
  tpl: string,
  skills: SkillRecord[],
  values: Record<string, string>
): ExpandedPrompt {
  const skillByKey = new Map(skills.map((s) => [s.key, s]));
  const used = new Set<string>();
  const missing: string[] = [];
  const text = tpl.replace(MACRO_RE, (_m, key) => {
    used.add(key);
    const s = skillByKey.get(key);
    if (!s) {
      missing.push(key);
      return `[未找到技能 @skill:${key}]`;
    }
    // 片段直接原样嵌入，宏也用 renderPrompt 处理变量
    return s.content;
  });
  return {
    text: renderPrompt(text, values),
    usedKeys: Array.from(used),
    missing,
  };
}

// 提取提示词中引用的所有 @skill:key
export function extractMacros(tpl: string): string[] {
  const set = new Set<string>();
  let m: RegExpExecArray | null;
  const re = new RegExp(MACRO_RE.source, "g");
  while ((m = re.exec(tpl))) set.add(m[1]);
  return Array.from(set);
}
