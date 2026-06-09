export interface Category {
  id: ToolCategory
  name: string
  en: string
  short: string
}

export type ToolCategory =
  | 'all'
  | 'chat'
  | 'image'
  | 'code'
  | 'office'
  | 'video'
  | 'audio'
  | '3d'
  | 'design'
  | 'search'
  | 'translate'
  | 'voice'
  | 'education'
  | 'medical'
  | 'legal'
  | 'finance'
  | 'marketing'
  | 'data'
  | 'robotics'
  | 'automation'
  | 'agent'
  | 'open-source'

export const CATEGORIES: Category[] = [
  { id: 'all', name: '全部', en: 'ALL', short: '查看本期全部 AI 工具' },
  { id: 'chat', name: '聊天', en: 'CHAT', short: '对话、问答、推理' },
  { id: 'image', name: '绘画', en: 'IMAGE', short: '图像生成、编辑、修复' },
  { id: 'code', name: '编程', en: 'CODE', short: '代码生成、调试、评审' },
  { id: 'office', name: '办公', en: 'OFFICE', short: '文档、表格、演示' },
  { id: 'video', name: '视频', en: 'VIDEO', short: '视频生成与编辑' },
  { id: 'audio', name: '音频', en: 'AUDIO', short: '音乐、配音、音效' },
  { id: '3d', name: '3D', en: '3D', short: '3D 模型与场景' },
  { id: 'design', name: '设计', en: 'DESIGN', short: 'UI、平面、品牌' },
  { id: 'search', name: '搜索', en: 'SEARCH', short: 'AI 搜索与研究' },
  { id: 'translate', name: '翻译', en: 'TRANS', short: '翻译与本地化' },
  { id: 'voice', name: '语音', en: 'VOICE', short: '语音合成、克隆' },
  { id: 'education', name: '教育', en: 'EDU', short: '学习、辅导、题库' },
  { id: 'medical', name: '医疗', en: 'MED', short: '诊断、影像、临床' },
  { id: 'legal', name: '法律', en: 'LAW', short: '合同、检索、合规' },
  { id: 'finance', name: '金融', en: 'FIN', short: '投研、风控、量化' },
  { id: 'marketing', name: '营销', en: 'MKT', short: '文案、社媒、增长' },
  { id: 'data', name: '数据', en: 'DATA', short: '分析、可视化、ETL' },
  { id: 'robotics', name: '机器人', en: 'ROBO', short: '机器人与具身智能' },
  { id: 'automation', name: '自动化', en: 'AUTO', short: '流程与工作流' },
  { id: 'agent', name: 'Agent', en: 'AGENT', short: '智能体与编排' },
  { id: 'open-source', name: '开源', en: 'OSS', short: '开源模型与生态' }
]
