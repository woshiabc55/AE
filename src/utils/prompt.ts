// 提示词模板渲染工具

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
