// AI 服务：内置 Mock 生成器（无 key 时可用），可选 OpenAI 兼容协议
import type { StoryboardTable, Tick } from '../store/projectStore';
import { buildEmptyTables } from '../store/projectStore';
import { PROMPT_TEMPLATES } from '../templates/prompts';

export interface GenerateOptions {
  prompt: string;
  template: 'cameraman' | 'director' | 'editor' | 'vfx';
  totalDurationSec: number;
  apiKey?: string;
  model?: string;
  signal?: AbortSignal;
}

// Mock：根据关键词自动生成 8 表格
export function mockGenerate(opts: GenerateOptions): StoryboardTable[] {
  const tpl = PROMPT_TEMPLATES.find((t) => t.key === opts.template);
  void tpl;
  const tables = buildEmptyTables(opts.totalDurationSec);
  const seed = opts.prompt.trim() || '安史之乱爆发 · 25 秒高潮';
  const keywords = seed
    .replace(/[\n\r]/g, ' ')
    .split(/[，。、！？\s,!?]+/)
    .filter((w) => w.length >= 2)
    .slice(0, 8);

  const PHRASES = [
    ['烛火摇曳', '烟柱螺旋', '阴影兵器化', '色调转灰', '心跳渐快'],
    ['圣旨展开', '朱砂字迹', '玉轴雕刻', '鼓点铺垫', '泥点溅射'],
    ['铁靴落地', '圣旨凹陷', '泥水飞溅', '锈迹斑斑', '沉重撞击'],
    ['胡人面孔', '瞳孔火红', '法令纹深', '口水拉丝', '青筋暴起'],
    ['嘶吼爆发', '字幕弹出', '血雾飞溅', '音压峰值', '表情狰狞'],
    ['万马奔腾', '旗帜燃烧', '孩童惊叫', '黑白红闪', '眩晕感强'],
    ['天宝十四载', '血色蔓延', '写经体字', '鼓点加重', '地震感'],
    ['Logo 旋转', '金属碎裂', '玻璃崩解', '血色光晕', '静默收尾'],
  ];

  for (let i = 0; i < tables.length; i++) {
    const phrases = PHRASES[i] || PHRASES[0];
    tables[i] = {
      ...tables[i],
      title: keywords[i] || `镜头 ${i + 1}`,
      ticks: tables[i].ticks.map((tk, j) => {
        const p = phrases[j % phrases.length];
        return {
          ...tk,
          image: j < 2 ? p : `${p} · 持续 ${tk.sec.toFixed(2)}s`,
          action: j === 0 ? '镜头固定 / 微距' : j === 8 ? '上摇' : '慢动作推近',
          sound: j % 4 === 0 ? '鼓点' : j % 4 === 1 ? '心跳' : '环境音',
          note: `模板：${opts.template} · 关键词：${seed.slice(0, 12)}…`,
        } as Tick;
      }),
    };
  }
  return tables;
}

// 真实 OpenAI 兼容协议请求（未配置时直接抛错，由调用方降级到 mock）
export async function callOpenAI(opts: GenerateOptions): Promise<string> {
  if (!opts.apiKey) throw new Error('MISSING_API_KEY');
  const tpl = PROMPT_TEMPLATES.find((t) => t.key === opts.template);
  if (!tpl) throw new Error('UNKNOWN_TEMPLATE');
  const system = tpl.system;
  const user = tpl.build(opts.prompt, opts.totalDurationSec);
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model || 'gpt-4o-mini',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
      temperature: 0.7,
    }),
    signal: opts.signal,
  });
  if (!res.ok) {
    throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || '';
}

// 解析 AI 返回的 JSON，宽松匹配，失败时降级到 mock
export function parseAITables(raw: string, totalDuration: number): StoryboardTable[] {
  try {
    const m = raw.match(/\[[\s\S]*\]/);
    if (!m) throw new Error('NO_JSON');
    const arr = JSON.parse(m[0]);
    if (!Array.isArray(arr) || arr.length === 0) throw new Error('EMPTY');
    const out: StoryboardTable[] = arr.slice(0, 8).map((t: any, i: number) => {
      const slice = totalDuration / Math.max(arr.length, 1);
      return {
        id: `t${i + 1}`,
        index: i + 1,
        title: t.title || `镜头 ${i + 1}`,
        startSec: t.startSec ?? +(i * slice).toFixed(3),
        endSec: t.endSec ?? +((i + 1) * slice).toFixed(3),
        ticks: Array.from({ length: 16 }).map((_, j) => {
          const src = Array.isArray(t.ticks) ? t.ticks[j] : undefined;
          return {
            index: j + 1,
            sec: src?.sec ?? +((i * slice) + j * (slice / 16)).toFixed(3),
            image: src?.image || '',
            action: src?.action || '',
            sound: src?.sound || '',
            note: src?.note || '',
          };
        }),
      };
    });
    // 不足 8 张时补齐
    const base = buildEmptyTables(totalDuration);
    for (let i = out.length; i < 8; i++) out.push(base[i]);
    return out;
  } catch (e) {
    console.warn('[AI] parse fail, fallback to mock', e);
    return mockGenerate({ prompt: raw, template: 'cameraman', totalDurationSec: totalDuration });
  }
}
