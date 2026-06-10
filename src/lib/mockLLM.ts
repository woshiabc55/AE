// 模拟 LLM 试写：根据 prompt 中的关键变量动态产出"不同风格"的多模型输出
import type { StageOutput } from './types'

const MODELS = [
  { id: 'gpt-cinema', label: 'GPT · 银幕版' },
  { id: 'claude-ink', label: 'Claude · 墨韵版' },
  { id: 'gemini-nova', label: 'Gemini · 新浪潮' },
] as const

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

/** 抽取 prompt 中的关键变量值作为标签 */
function extractFlavor(prompt: string): string[] {
  const tags: string[] = []
  const lines = prompt.split('\n')
  for (const line of lines) {
    const m = line.match(/【(.+?)】([\s\S]*?)(?=【|$)/)
    if (m) {
      const value = m[2].trim()
      if (value && value.length < 40 && value.length > 1) {
        tags.push(value.split(/[，。、,.\s]+/)[0] || value.slice(0, 6))
      }
    }
  }
  return tags.filter(Boolean).slice(0, 3)
}

const STYLES = [
  {
    label: '冷硬派',
    opening: ['雨点砸在铁皮上，像无数个冷掉的钉子。', '他没回头，嘴唇绷成一条铁轨。', '霓虹把她的影子切成了三段。'],
    bodyTpl: (s: string) =>
      `${s} 整个世界像被按了静音键。空气里有铁锈和旧报纸的味道。镜头从低处爬升，越过碎玻璃，停在那个人的后颈。`,
    coda: '他终于开口，声音像砂纸划过金属：「我等了你七年。」',
  },
  {
    label: '新浪潮',
    opening: ['一束光，从画面右上角斜插下来。', '镜头跌跌撞撞地跑，像个刚学会走路的孩子。', '时间在这里打了个盹。'],
    bodyTpl: (s: string) =>
      `${s} 我们看到一个不太确定的世界：所有东西都微微失焦，又在某个瞬间异常锐利。色彩被抽掉一半，剩下的全是情绪。`,
    coda: '「故事？」她笑了笑，「故事只是我们替命运打的草稿。」',
  },
  {
    label: '墨韵派',
    opening: ['墨落纸上，是一场无声的雨。', '留白处，藏着他没说出口的十年。', '水袖翻起，又轻轻落下。'],
    bodyTpl: (s: string) =>
      `${s} 故事没有开端，也没有终点。它只是一段被反复抄写的心事。角色在纸上活了又死，死了又活。`,
    coda: '她在最末一行停笔，窗外的雨，正写到第三页。',
  },
]

export interface RunOptions {
  prompt: string
  signal?: AbortSignal
}

export async function runStage({ prompt, signal }: RunOptions): Promise<StageOutput[]> {
  const flavor = extractFlavor(prompt)
  const flavorLabel = flavor.length ? flavor.join(' · ') : '未指定场景'

  const outputs = await Promise.all(
    MODELS.map(async (m) => {
      const duration = randInt(700, 1500)
      await new Promise<void>((res, rej) => {
        const t = setTimeout(res, duration)
        signal?.addEventListener('abort', () => {
          clearTimeout(t)
          rej(new DOMException('aborted', 'AbortError'))
        })
      })
      const style = STYLES[Math.abs(m.id.charCodeAt(0) + m.id.length) % STYLES.length]
      const opening = pick(style.opening)
      const body = style.bodyTpl(`[${flavorLabel}]`)
      const coda = style.coda
      return {
        model: m.id,
        modelLabel: m.label,
        text: `${opening}\n\n${body}\n\n${coda}`,
        durationMs: duration,
        score: randInt(72, 95),
      }
    }),
  )

  return outputs
}

export const MODEL_OPTIONS = MODELS.slice()
