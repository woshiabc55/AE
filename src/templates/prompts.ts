// 提示词模板：4 套角色化模板，注入到 AI 对话

export type TemplateKey = 'cameraman' | 'director' | 'editor' | 'vfx';

export interface PromptTemplate {
  key: TemplateKey;
  label: string;
  hint: string;
  system: string;
  build: (input: string, totalDuration: number) => string;
}

export const PROMPT_TEMPLATES: PromptTemplate[] = [
  {
    key: 'cameraman',
    label: '摄影指导',
    hint: '镜头语言、运镜、光影',
    system:
      '你是一位资深电影摄影指导。请基于用户的创意描述，输出严格的 8 段分镜表，每段 16 个等分时间刻度（总时长由用户指定），每格必须包含：画面 / 动作 / 音效 / 设计要点。',
    build: (input, dur) =>
      `总时长：${dur} 秒；镜头数：8；每镜 16 个时间刻度（每刻度 ${(dur / 128).toFixed(3)} 秒）。\n` +
      `创意/脚本：\n${input}\n\n` +
      `请以 JSON 数组返回，结构：[{ index, title, startSec, endSec, ticks:[{index,sec,image,action,sound,note}] }]`,
  },
  {
    key: 'director',
    label: '导演',
    hint: '叙事节奏、表演、情绪',
    system:
      '你是一位擅长仪式感与情绪爆发的导演。请把用户描述拆为 8 段分镜表，每段 16 个时间刻度，关注情绪曲线与节奏对比。',
    build: (input, dur) =>
      `总时长 ${dur}s；8 镜头 × 16 刻度。\n` +
      `素材：\n${input}\n\n` +
      `请输出 JSON，结构：[{ index, title, startSec, endSec, ticks:[{index,sec,image,action,sound,note}] }]`,
  },
  {
    key: 'editor',
    label: '剪辑师',
    hint: '节奏、匹配剪辑、转场',
    system:
      '你是一位擅长动作匹配与碎切剪辑的剪辑师。请基于用户输入，输出 8 段分镜表，每段 16 时间刻度，重点标记转场点。',
    build: (input, dur) =>
      `总时长 ${dur}s。素材：\n${input}\n\n` +
      `请输出 JSON，结构同上。`,
  },
  {
    key: 'vfx',
    label: '特效总监',
    hint: '粒子、流体、解算、合成',
    system:
      '你是一位精通 Houdini / Nuke 的特效总监。请输出 8 段分镜表，每段 16 时间刻度，重点标注粒子、流体、合成与渲染时间预算。',
    build: (input, dur) =>
      `总时长 ${dur}s。素材：\n${input}\n\n` +
      `请输出 JSON。`,
  },
];
