// 通用领域类型
export type Category =
  | 'short_drama'
  | 'short_video'
  | 'ad'
  | 'mv'
  | 'anime'
  | 'game'
  | 'custom'

export type Visibility = 'private' | 'team' | 'public'

export type SectionKey =
  | 'premise'
  | 'character'
  | 'scene'
  | 'camera'
  | 'tone'
  | 'output'

export interface PromptSection {
  id: string
  key: SectionKey
  title: string
  body: string
  collapsed: boolean
}

export type VariableType = 'text' | 'longtext' | 'enum' | 'number'

export interface PromptVariable {
  key: string
  label: string
  description?: string
  defaultValue?: string
  type: VariableType
  options?: string[]
}

export interface TemplateVersion {
  id: string
  label: string
  body: PromptSection[]
  createdAt: number
}

export interface Author {
  id: string
  name: string
  avatar?: string
  bio?: string
}

export interface PromptTemplate {
  id: string
  title: string
  description?: string
  category: Category
  tags: string[]
  visibility: Visibility
  author: Author
  sections: PromptSection[]
  variables: PromptVariable[]
  versions: TemplateVersion[]
  createdAt: number
  updatedAt: number
  cloneCount: number
  rating: number
}

export interface StageOutput {
  model: string
  modelLabel: string
  text: string
  durationMs: number
  score?: number
}

export interface StageRun {
  id: string
  templateId: string
  values: Record<string, string>
  outputs: StageOutput[]
  createdAt: number
}

export const SECTION_DEFS: Array<{
  key: SectionKey
  title: string
  hint: string
  placeholder: string
}> = [
  {
    key: 'premise',
    title: '前置设定',
    hint: '故事类型、核心冲突、目标受众',
    placeholder: '例：这是一个面向 Z 世代的悬疑短剧，前 3 秒必须建立反差冲突……',
  },
  {
    key: 'character',
    title: '角色档案',
    hint: '主角、对手、关键配角及动机',
    placeholder: '例：沈墨，28 岁，刑警，沉默寡言，因一桩旧案陷入内心挣扎……',
  },
  {
    key: 'scene',
    title: '场景描述',
    hint: '时间、地点、空间、关键道具',
    placeholder: '例：雨夜废弃工厂，铁皮屋顶滴落的水声，远处霓虹忽明忽暗……',
  },
  {
    key: 'camera',
    title: '镜头语言',
    hint: '景别、运镜、剪辑节奏',
    placeholder: '例：开场使用 35mm 手持跟拍，3 个特写切到中景，配低频环境音……',
  },
  {
    key: 'tone',
    title: '风格基调',
    hint: '情绪、配色、参考作品',
    placeholder: '例：参考诺兰《记忆碎片》+ 王家卫霓虹美学，整体冷蓝主调……',
  },
  {
    key: 'output',
    title: '输出约束',
    hint: '字数、格式、禁区、必含元素',
    placeholder: '例：输出 800-1200 字剧本，包含 6 场戏，每场标注时长与镜头……',
  },
]

export const CATEGORY_LABEL: Record<Category, string> = {
  short_drama: '短剧',
  short_video: '短视频',
  ad: '广告',
  mv: 'MV / 音乐',
  anime: '动漫',
  game: '游戏剧情',
  custom: '自定义',
}

export const VISIBILITY_LABEL: Record<Visibility, string> = {
  private: '私有',
  team: '团队',
  public: '公开',
}
