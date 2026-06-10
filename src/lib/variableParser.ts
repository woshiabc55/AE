import type { PromptSection, PromptVariable } from './types'

const VAR_REGEX = /\{\{\s*([a-zA-Z0-9_一-龥]+)\s*\}\}/g

/** 抽取所有变量名，按出现顺序去重 */
export function extractVariables(sections: PromptSection[]): string[] {
  const seen = new Set<string>()
  const result: string[] = []
  for (const s of sections) {
    const matches = s.body.matchAll(VAR_REGEX)
    for (const m of matches) {
      const key = m[1]
      if (!seen.has(key)) {
        seen.add(key)
        result.push(key)
      }
    }
  }
  return result
}

/** 合并：模板里声明的变量 + 自动抽到的变量（自动补默认 label） */
export function mergeVariables(
  sections: PromptSection[],
  declared: PromptVariable[] = [],
): PromptVariable[] {
  const keys = extractVariables(sections)
  const map = new Map<string, PromptVariable>()
  for (const d of declared) map.set(d.key, d)
  for (const k of keys) {
    if (!map.has(k)) {
      map.set(k, {
        key: k,
        label: prettifyKey(k),
        type: 'text',
        defaultValue: '',
      })
    }
  }
  return Array.from(map.values())
}

function prettifyKey(k: string): string {
  // 简单处理：下划线转空格、首字母大写
  const spaced = k.replace(/_/g, ' ')
  return spaced.charAt(0).toUpperCase() + spaced.slice(1)
}

/** 用值填充模板，返回完整 prompt 字符串 */
export function fillTemplate(
  sections: PromptSection[],
  values: Record<string, string>,
): string {
  return sections
    .map((s) => `【${s.title}】\n${fillBody(s.body, values)}`)
    .join('\n\n')
}

export function fillBody(body: string, values: Record<string, string>): string {
  return body.replace(VAR_REGEX, (_, key) => {
    const v = values[key]
    if (v && v.trim()) return v.trim()
    return `[${key}]`
  })
}

/** 检查变量是否都填了 */
export function getMissingKeys(
  sections: PromptSection[],
  values: Record<string, string>,
): string[] {
  return extractVariables(sections).filter(
    (k) => !values[k] || !values[k].trim(),
  )
}

/** 给一段文本中的 {{}} 变量加高亮 span */
export function highlightBody(body: string): string {
  return body.replace(VAR_REGEX, (_, key) => {
    return `<span class="var-token">{{${key}}}</span>`
  })
}

/** 字数统计 */
export function wordCount(text: string): number {
  // 中文按字符、英文按词
  const cn = (text.match(/[一-龥]/g) || []).length
  const en = (text.match(/[a-zA-Z]+/g) || []).length
  return cn + en
}
