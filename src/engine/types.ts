export type CharacterId = 'narrator' | 'zhangShengYi' | 'zhangShengEr' | 'zhangJi' | 'zhangShengYuan' | 'zhangCunGen' | 'student' | 'master'

export type SceneId =
  | 'kiln_night'
  | 'kiln_day'
  | 'ancient_kiln_exterior'
  | 'ancient_kiln_interior'
  | 'modern_workshop'
  | 'school'
  | 'creek'
  | 'storm_night'
  | 'summer_camp'
  | 'joint_firing'
  | 'crack_closeup'
  | 'shard_closeup'
  | 'resonance'

export type BgmId = 'main_theme' | 'ancient_kiln' | 'modern_longquan' | 'tension' | 'reunion' | 'epilogue'
export type SfxId = 'kiln_fire' | 'crack' | 'rain' | 'shard' | 'chime' | 'typewriter'

export type Expression = 'neutral' | 'angry' | 'sad' | 'happy' | 'determined' | 'surprised' | 'guilty'

export interface Character {
  id: CharacterId
  name: string
  color: string
  side: 'left' | 'center' | 'right'
}

export interface DialogueLine {
  id: string
  character?: CharacterId
  text: string
  scene?: SceneId
  bgm?: BgmId
  sfx?: SfxId
  expression?: Expression
  characterSide?: 'left' | 'center' | 'right'
  showCharacters?: CharacterId[]
  hideCharacters?: CharacterId[]
  transition?: 'fade' | 'dissolve' | 'slide_left' | 'slide_right' | 'crack' | 'shard'
  choices?: DialogueChoice[]
  condition?: { var: string; value: string | number | boolean }
  setVar?: { key: string; value: string | number | boolean }
  next?: string
  chapter?: string
  isEnding?: boolean
}

export interface DialogueChoice {
  text: string
  next: string
  setVar?: { key: string; value: string | number | boolean }
}

export interface GameSave {
  currentLineId: string
  variables: Record<string, string | number | boolean>
  chapter: string
  timestamp: number
}

export interface GameState {
  currentLineId: string
  variables: Record<string, string | number | boolean>
  history: Array<{ character?: CharacterId; text: string }>
  chapter: string
  isTyping: boolean
  showMenu: boolean
  showHistory: boolean
  currentScene: SceneId
  currentBgm: BgmId | null
  visibleCharacters: CharacterId[]
  currentExpression: Record<CharacterId, Expression>
}

export const characters: Record<CharacterId, Character> = {
  narrator: { id: 'narrator', name: '旁白', color: '#F5F0E8', side: 'center' },
  zhangCunGen: { id: 'zhangCunGen', name: '章村根', color: '#5C3A21', side: 'center' },
  zhangShengYi: { id: 'zhangShengYi', name: '章生一', color: '#D4622B', side: 'left' },
  zhangShengEr: { id: 'zhangShengEr', name: '章生二', color: '#4A7C59', side: 'right' },
  zhangJi: { id: 'zhangJi', name: '张寄', color: '#C9A84C', side: 'left' },
  zhangShengYuan: { id: 'zhangShengYuan', name: '张生元', color: '#B0C4B1', side: 'right' },
  student: { id: 'student', name: '学生', color: '#8aab8c', side: 'right' },
  master: { id: 'master', name: '师傅', color: '#5C3A21', side: 'center' },
}

export const sceneInfo: Record<SceneId, { name: string; description: string; bgStyle: string }> = {
  kiln_night: { name: '窑夜', description: '深夜窑口，火光映天', bgStyle: 'from-iron-950 via-kiln-900/30 to-iron-950' },
  kiln_day: { name: '窑昼', description: '白日窑场，烟云缭绕', bgStyle: 'from-iron-950 via-glaze-900/20 to-iron-950' },
  ancient_kiln_exterior: { name: '古窑外', description: '南宋龙泉，章氏大窑', bgStyle: 'from-kiln-900/40 via-iron-950 to-kiln-900/20' },
  ancient_kiln_interior: { name: '古窑内', description: '窑内火光，釉色流转', bgStyle: 'from-iron-950 via-kiln-400/15 to-iron-950' },
  modern_workshop: { name: '青瓷厂', description: '当代龙泉，青瓷作坊', bgStyle: 'from-iron-950 via-celadon-900/20 to-iron-950' },
  school: { name: '宝溪乡校', description: '山村教室，泥地操场', bgStyle: 'from-iron-950 via-celadon-800/15 to-iron-950' },
  creek: { name: '溪边', description: '废弃窑址，溪水潺潺', bgStyle: 'from-celadon-900/20 via-iron-950 to-celadon-900/10' },
  storm_night: { name: '暴雨夜', description: '雷电交加，窑火同燃', bgStyle: 'from-iron-950 via-kiln-400/20 to-iron-950' },
  summer_camp: { name: '龙窑夏令营', description: '窑前教学，薪火相传', bgStyle: 'from-iron-950 via-celadon-500/15 to-kiln-900/15' },
  joint_firing: { name: '合烧', description: '窑门封堵，火光映面', bgStyle: 'from-kiln-900/30 via-iron-950 to-celadon-900/20' },
  crack_closeup: { name: '开片', description: '金丝铁线，裂纹蔓延', bgStyle: 'from-iron-950 via-gold-400/10 to-iron-950' },
  shard_closeup: { name: '残片', description: '碎片拼合，莲瓣犹存', bgStyle: 'from-iron-950 via-celadon-200/10 to-iron-950' },
  resonance: { name: '共振', description: '古今交汇，千年窑火', bgStyle: 'from-kiln-900/20 via-iron-950 to-celadon-900/20' },
}
