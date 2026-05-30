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

export type Mood = 'solemn' | 'tense' | 'warm' | 'melancholy' | 'hopeful' | 'furious' | 'peaceful' | 'awestruck'

export interface ParticleConfig {
  intensity: number
  colorScheme: 'warm' | 'cool' | 'mixed'
  direction: 'up' | 'down' | 'scatter' | 'converge'
  speed: number
  sizeRange: [number, number]
  glowRadius: number
  glowColor: string
}

export interface CrackConfig {
  mainCount: number
  goldCount: number
  mainLength: [number, number]
  goldLength: [number, number]
  growSpeed: number
  glowIntensity: number
  glowColor: string
}

export interface ShardConfig {
  count: number
  colors: string[]
  convergeSpeed: number
  glowOnComplete: boolean
}

export interface InkConfig {
  color: string
  spreadSpeed: number
  opacity: number
  blobCount: number
}

export interface CameraData {
  zoom: number
  panX: number
  panY: number
  shake: number
  shakeDuration: number
}

export interface LightData {
  color: string
  intensity: number
  pulse: boolean
  pulseSpeed: number
}

export interface CharacterAnimData {
  enterFrom?: 'left' | 'right' | 'bottom' | 'fade'
  exitTo?: 'left' | 'right' | 'top' | 'fade'
  enterDuration?: number
  exitDuration?: number
  breathe?: boolean
  glowColor?: string
  glowIntensity?: number
}

export interface SceneAtmosphere {
  fogDensity: number
  fogColor: string
  vignetteStrength: number
  grainIntensity: number
  lightRays: boolean
  lightRayColor: string
}

export interface Character {
  id: CharacterId
  name: string
  color: string
  side: 'left' | 'center' | 'right'
  era: 'ancient' | 'modern'
}

export interface DialogueLine {
  id: string
  character?: CharacterId
  text: string
  scene?: SceneId
  bgm?: BgmId
  sfx?: SfxId
  expression?: Expression
  mood?: Mood
  characterSide?: 'left' | 'center' | 'right'
  showCharacters?: CharacterId[]
  hideCharacters?: CharacterId[]
  characterAnims?: Record<CharacterId, CharacterAnimData>
  transition?: 'fade' | 'dissolve' | 'slide_left' | 'slide_right' | 'crack' | 'shard' | 'ink' | 'flash'
  transitionDuration?: number
  camera?: Partial<CameraData>
  light?: Partial<LightData>
  atmosphere?: Partial<SceneAtmosphere>
  particleOverride?: Partial<ParticleConfig>
  crackOverride?: Partial<CrackConfig>
  shardOverride?: Partial<ShardConfig>
  inkEffect?: Partial<InkConfig>
  choices?: DialogueChoice[]
  condition?: { var: string; value: string | number | boolean }
  setVar?: { key: string; value: string | number | boolean }
  next?: string
  chapter?: string
  isEnding?: boolean
  typingSpeed?: number
  pauseBefore?: number
  pauseAfter?: number
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
  currentMood: Mood
  currentCamera: CameraData
  currentLight: LightData
  currentAtmosphere: SceneAtmosphere
  currentParticleConfig: ParticleConfig
  shakeUntil: number
}

export const defaultCamera: CameraData = {
  zoom: 1,
  panX: 0,
  panY: 0,
  shake: 0,
  shakeDuration: 0,
}

export const defaultLight: LightData = {
  color: '#F5F0E8',
  intensity: 0.3,
  pulse: false,
  pulseSpeed: 1,
}

export const defaultAtmosphere: SceneAtmosphere = {
  fogDensity: 0,
  fogColor: '#1a1410',
  vignetteStrength: 0.4,
  grainIntensity: 0.02,
  lightRays: false,
  lightRayColor: '#F5F0E8',
}

export const defaultParticleConfig: ParticleConfig = {
  intensity: 0.5,
  colorScheme: 'warm',
  direction: 'up',
  speed: 1,
  sizeRange: [2, 6],
  glowRadius: 0.6,
  glowColor: '#D4622B',
}

export const characters: Record<CharacterId, Character> = {
  narrator: { id: 'narrator', name: '旁白', color: '#F5F0E8', side: 'center', era: 'ancient' },
  zhangCunGen: { id: 'zhangCunGen', name: '章村根', color: '#5C3A21', side: 'center', era: 'ancient' },
  zhangShengYi: { id: 'zhangShengYi', name: '章生一', color: '#D4622B', side: 'left', era: 'ancient' },
  zhangShengEr: { id: 'zhangShengEr', name: '章生二', color: '#4A7C59', side: 'right', era: 'ancient' },
  zhangJi: { id: 'zhangJi', name: '张寄', color: '#C9A84C', side: 'left', era: 'modern' },
  zhangShengYuan: { id: 'zhangShengYuan', name: '张生元', color: '#B0C4B1', side: 'right', era: 'modern' },
  student: { id: 'student', name: '学生', color: '#8aab8c', side: 'right', era: 'modern' },
  master: { id: 'master', name: '师傅', color: '#5C3A21', side: 'center', era: 'modern' },
}

export const moodConfig: Record<Mood, { lightColor: string; lightIntensity: number; vignette: number; grain: number; fogDensity: number }> = {
  solemn: { lightColor: '#F5F0E8', lightIntensity: 0.2, vignette: 0.6, grain: 0.03, fogDensity: 0.1 },
  tense: { lightColor: '#D4622B', lightIntensity: 0.5, vignette: 0.7, grain: 0.05, fogDensity: 0.05 },
  warm: { lightColor: '#C9A84C', lightIntensity: 0.4, vignette: 0.3, grain: 0.01, fogDensity: 0.02 },
  melancholy: { lightColor: '#4A7C59', lightIntensity: 0.2, vignette: 0.5, grain: 0.04, fogDensity: 0.15 },
  hopeful: { lightColor: '#B0C4B1', lightIntensity: 0.5, vignette: 0.2, grain: 0.01, fogDensity: 0 },
  furious: { lightColor: '#D4622B', lightIntensity: 0.7, vignette: 0.8, grain: 0.06, fogDensity: 0 },
  peaceful: { lightColor: '#8aab8c', lightIntensity: 0.3, vignette: 0.2, grain: 0.01, fogDensity: 0.05 },
  awestruck: { lightColor: '#C9A84C', lightIntensity: 0.6, vignette: 0.4, grain: 0.02, fogDensity: 0.03 },
}

export const sceneInfo: Record<SceneId, {
  name: string
  description: string
  bgStyle: string
  particle: ParticleConfig
  atmosphere: Partial<SceneAtmosphere>
  light: Partial<LightData>
}> = {
  kiln_night: {
    name: '窑夜', description: '深夜窑口，火光映天',
    bgStyle: 'from-iron-950 via-kiln-900/30 to-iron-950',
    particle: { intensity: 0.8, colorScheme: 'warm', direction: 'up', speed: 1.2, sizeRange: [2, 5], glowRadius: 0.6, glowColor: '#D4622B' },
    atmosphere: { fogDensity: 0.08, vignetteStrength: 0.5, grainIntensity: 0.02, lightRays: false },
    light: { color: '#D4622B', intensity: 0.4, pulse: true, pulseSpeed: 0.5 },
  },
  kiln_day: {
    name: '窑昼', description: '白日窑场，烟云缭绕',
    bgStyle: 'from-iron-950 via-glaze-900/20 to-iron-950',
    particle: { intensity: 0.4, colorScheme: 'cool', direction: 'up', speed: 0.6, sizeRange: [1, 3], glowRadius: 0.4, glowColor: '#B0C4B1' },
    atmosphere: { fogDensity: 0.15, vignetteStrength: 0.3, grainIntensity: 0.01, lightRays: true, lightRayColor: '#F5F0E8' },
    light: { color: '#F5F0E8', intensity: 0.3, pulse: false },
  },
  ancient_kiln_exterior: {
    name: '古窑外', description: '南宋龙泉，章氏大窑',
    bgStyle: 'from-kiln-900/40 via-iron-950 to-kiln-900/20',
    particle: { intensity: 0.6, colorScheme: 'warm', direction: 'up', speed: 1, sizeRange: [2, 5], glowRadius: 0.5, glowColor: '#D4622B' },
    atmosphere: { fogDensity: 0.1, vignetteStrength: 0.5, grainIntensity: 0.03, lightRays: false },
    light: { color: '#D4622B', intensity: 0.3, pulse: true, pulseSpeed: 0.3 },
  },
  ancient_kiln_interior: {
    name: '古窑内', description: '窑内火光，釉色流转',
    bgStyle: 'from-iron-950 via-kiln-400/15 to-iron-950',
    particle: { intensity: 1, colorScheme: 'warm', direction: 'up', speed: 1.5, sizeRange: [3, 7], glowRadius: 0.7, glowColor: '#E8843A' },
    atmosphere: { fogDensity: 0.05, vignetteStrength: 0.7, grainIntensity: 0.04, lightRays: true, lightRayColor: '#D4622B' },
    light: { color: '#E8843A', intensity: 0.6, pulse: true, pulseSpeed: 0.8 },
  },
  modern_workshop: {
    name: '青瓷厂', description: '当代龙泉，青瓷作坊',
    bgStyle: 'from-iron-950 via-celadon-900/20 to-iron-950',
    particle: { intensity: 0.3, colorScheme: 'cool', direction: 'up', speed: 0.5, sizeRange: [1, 3], glowRadius: 0.3, glowColor: '#B0C4B1' },
    atmosphere: { fogDensity: 0.05, vignetteStrength: 0.3, grainIntensity: 0.01, lightRays: false },
    light: { color: '#B0C4B1', intensity: 0.3, pulse: false },
  },
  school: {
    name: '宝溪乡校', description: '山村教室，泥地操场',
    bgStyle: 'from-iron-950 via-celadon-800/15 to-iron-950',
    particle: { intensity: 0.15, colorScheme: 'cool', direction: 'scatter', speed: 0.3, sizeRange: [1, 2], glowRadius: 0.2, glowColor: '#8aab8c' },
    atmosphere: { fogDensity: 0.03, vignetteStrength: 0.4, grainIntensity: 0.02, lightRays: true, lightRayColor: '#F5F0E8' },
    light: { color: '#F5F0E8', intensity: 0.25, pulse: false },
  },
  creek: {
    name: '溪边', description: '废弃窑址，溪水潺潺',
    bgStyle: 'from-celadon-900/20 via-iron-950 to-celadon-900/10',
    particle: { intensity: 0.2, colorScheme: 'cool', direction: 'down', speed: 0.4, sizeRange: [1, 2], glowRadius: 0.3, glowColor: '#4A7C59' },
    atmosphere: { fogDensity: 0.2, vignetteStrength: 0.3, grainIntensity: 0.02, lightRays: true, lightRayColor: '#B0C4B1' },
    light: { color: '#B0C4B1', intensity: 0.2, pulse: false },
  },
  storm_night: {
    name: '暴雨夜', description: '雷电交加，窑火同燃',
    bgStyle: 'from-iron-950 via-kiln-400/20 to-iron-950',
    particle: { intensity: 1, colorScheme: 'warm', direction: 'up', speed: 2, sizeRange: [2, 6], glowRadius: 0.8, glowColor: '#D4622B' },
    atmosphere: { fogDensity: 0.03, vignetteStrength: 0.8, grainIntensity: 0.06, lightRays: false },
    light: { color: '#D4622B', intensity: 0.7, pulse: true, pulseSpeed: 3 },
  },
  summer_camp: {
    name: '龙窑夏令营', description: '窑前教学，薪火相传',
    bgStyle: 'from-iron-950 via-celadon-500/15 to-kiln-900/15',
    particle: { intensity: 0.4, colorScheme: 'mixed', direction: 'up', speed: 0.8, sizeRange: [1, 4], glowRadius: 0.4, glowColor: '#C9A84C' },
    atmosphere: { fogDensity: 0.05, vignetteStrength: 0.2, grainIntensity: 0.01, lightRays: true, lightRayColor: '#F5F0E8' },
    light: { color: '#C9A84C', intensity: 0.4, pulse: true, pulseSpeed: 0.3 },
  },
  joint_firing: {
    name: '合烧', description: '窑门封堵，火光映面',
    bgStyle: 'from-kiln-900/30 via-iron-950 to-celadon-900/20',
    particle: { intensity: 0.8, colorScheme: 'mixed', direction: 'up', speed: 1.3, sizeRange: [2, 6], glowRadius: 0.7, glowColor: '#D4622B' },
    atmosphere: { fogDensity: 0.05, vignetteStrength: 0.5, grainIntensity: 0.03, lightRays: true, lightRayColor: '#C9A84C' },
    light: { color: '#C9A84C', intensity: 0.5, pulse: true, pulseSpeed: 0.5 },
  },
  crack_closeup: {
    name: '开片', description: '金丝铁线，裂纹蔓延',
    bgStyle: 'from-iron-950 via-gold-400/10 to-iron-950',
    particle: { intensity: 0.2, colorScheme: 'warm', direction: 'scatter', speed: 0.3, sizeRange: [1, 2], glowRadius: 0.3, glowColor: '#C9A84C' },
    atmosphere: { fogDensity: 0, vignetteStrength: 0.6, grainIntensity: 0.01, lightRays: true, lightRayColor: '#C9A84C' },
    light: { color: '#C9A84C', intensity: 0.5, pulse: true, pulseSpeed: 0.2 },
  },
  shard_closeup: {
    name: '残片', description: '碎片拼合，莲瓣犹存',
    bgStyle: 'from-iron-950 via-celadon-200/10 to-iron-950',
    particle: { intensity: 0.15, colorScheme: 'cool', direction: 'converge', speed: 0.3, sizeRange: [1, 2], glowRadius: 0.2, glowColor: '#B0C4B1' },
    atmosphere: { fogDensity: 0.05, vignetteStrength: 0.4, grainIntensity: 0.02, lightRays: false },
    light: { color: '#B0C4B1', intensity: 0.3, pulse: false },
  },
  resonance: {
    name: '共振', description: '古今交汇，千年窑火',
    bgStyle: 'from-kiln-900/20 via-iron-950 to-celadon-900/20',
    particle: { intensity: 0.7, colorScheme: 'mixed', direction: 'up', speed: 1, sizeRange: [2, 5], glowRadius: 0.6, glowColor: '#C9A84C' },
    atmosphere: { fogDensity: 0.1, vignetteStrength: 0.4, grainIntensity: 0.02, lightRays: true, lightRayColor: '#C9A84C' },
    light: { color: '#C9A84C', intensity: 0.5, pulse: true, pulseSpeed: 0.4 },
  },
}
