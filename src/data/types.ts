// 分镜 / 章节 / 类型定义
export type ShotType =
  | 'black'
  | 'wide'
  | 'medium'
  | 'closeup'
  | 'macro'
  | 'over-shoulder'
  | 'flashback'
  | 'freeze'
  | 'split'
  | 'montage'
  | 'pov';

export interface Shot {
  /** 全局唯一 id（与原脚本中的镜号一致） */
  id: number;
  /** 所属章节 1-9（9=致敬段） */
  chapter: number;
  /** 章节内子镜号（1-based） */
  sub: number;
  /** 单镜时长（毫秒） */
  duration: number;
  /** AIGC 提示词（英文） */
  prompt: string;
  /** 声音 / 对白描述 */
  voice: string;
  /** 转场 */
  transition: string;
  /** 视觉效果 */
  vfx: string;
  /** 对白（可选） */
  dialogue?: string;
  /** 镜头类型 */
  type: ShotType;
  /** 该镜要突出的核心意象关键词 */
  motif: ('fire' | 'crackle' | 'rain' | 'snow' | 'sea' | 'gold' | 'hand' | 'shadow' | 'mist' | 'ruin')[];
  /** 情绪 */
  mood: 'hope' | 'wonder' | 'tension' | 'grief' | 'resolve' | 'farewell' | 'rebirth' | 'awe';
}

export interface Chapter {
  id: number;
  /** 段落标题（火 · 初生） */
  title: string;
  /** 副标题（9 镜 / 27 秒） */
  subtitle: string;
  /** 引言 */
  intro: string;
  /** 视觉代表色（窑红 / 霁青 / 玄青） */
  accent: 'kiln' | 'celadon' | 'gold' | 'ash';
  /** 该段所有镜 */
  shots: Shot[];
}
