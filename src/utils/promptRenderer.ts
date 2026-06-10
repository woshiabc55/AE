/**
 * 替换提示词中的 {{variable}} 占位符，并返回高亮标记
 * 返回 React 节点数组，每个节点是字符串或带 className 的 span
 */
export interface RenderPart {
  type: 'text' | 'variable';
  value: string;
  key: string;
  missing?: boolean;
}

const VAR_REGEX = /\{\{\s*([a-zA-Z0-9_\u4e00-\u9fa5]+)\s*\}\}/g;

export function parsePrompt(prompt: string, variables: Record<string, string>): RenderPart[] {
  const parts: RenderPart[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let counter = 0;

  const re = new RegExp(VAR_REGEX.source, 'g');
  while ((match = re.exec(prompt)) !== null) {
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        value: prompt.slice(lastIndex, match.index),
        key: `t-${counter++}`,
      });
    }
    const key = match[1];
    const value = variables[key];
    parts.push({
      type: 'variable',
      value: value !== undefined && value !== '' ? value : `{{${key}}}`,
      key: `v-${counter++}`,
      missing: value === undefined || value === '',
    });
    lastIndex = re.lastIndex;
  }

  if (lastIndex < prompt.length) {
    parts.push({
      type: 'text',
      value: prompt.slice(lastIndex),
      key: `t-${counter++}`,
    });
  }

  return parts;
}

export function extractVariableKeys(prompt: string): string[] {
  const keys = new Set<string>();
  const re = new RegExp(VAR_REGEX.source, 'g');
  let match: RegExpExecArray | null;
  while ((match = re.exec(prompt)) !== null) {
    keys.add(match[1]);
  }
  return Array.from(keys);
}

export function renderPromptText(prompt: string, variables: Record<string, string>): string {
  return prompt.replace(VAR_REGEX, (_, key) => {
    const v = variables[key];
    return v !== undefined && v !== '' ? v : `[[${key}]]`;
  });
}

export function estimateTokens(text: string): number {
  // 简单估算：英文 ~4 字符/token，中文 ~1.5 字符/token
  const cnChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
  const enChars = text.length - cnChars;
  return Math.ceil(cnChars / 1.5 + enChars / 4);
}
