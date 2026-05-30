import { create } from 'zustand'

export type CinematicStyle =
  | 'noir'
  | 'cyberpunk'
  | 'fantasy'
  | 'wasteland'
  | 'ocean'
  | 'forest'
  | 'space'
  | 'ancient'

export type MoodType =
  | 'dramatic'
  | 'serene'
  | 'mysterious'
  | 'melancholic'
  | 'epic'
  | 'eerie'

export type LightingType =
  | 'golden'
  | 'cold'
  | 'volumetric'
  | 'backlit'
  | 'neon'
  | 'moonlight'

export interface SceneParams {
  text: string
  style: CinematicStyle
  mood: MoodType
  lighting: LightingType
  colorIntensity: number
  fogDensity: number
  cameraHeight: number
  cameraAngle: number
  timeOfDay: number
  particleDensity: number
  grainAmount: number
  vignetteStrength: number
  depthOfField: number
}

export interface ConceptArtState {
  scene: SceneParams
  isRendering: boolean
  showControls: boolean
  activePreset: string | null
  setScene: (params: Partial<SceneParams>) => void
  setRendering: (v: boolean) => void
  toggleControls: () => void
  applyPreset: (name: string, params: Partial<SceneParams>) => void
  resetScene: () => void
}

const defaultScene: SceneParams = {
  text: '',
  style: 'noir',
  mood: 'dramatic',
  lighting: 'volumetric',
  colorIntensity: 0.6,
  fogDensity: 0.4,
  cameraHeight: 0.5,
  cameraAngle: 0.3,
  timeOfDay: 0.7,
  particleDensity: 0.3,
  grainAmount: 0.15,
  vignetteStrength: 0.5,
  depthOfField: 0.3,
}

export const useConceptArtStore = create<ConceptArtState>((set) => ({
  scene: { ...defaultScene },
  isRendering: false,
  showControls: true,
  activePreset: null,
  setScene: (params) =>
    set((state) => ({
      scene: { ...state.scene, ...params },
      activePreset: null,
    })),
  setRendering: (v) => set({ isRendering: v }),
  toggleControls: () => set((state) => ({ showControls: !state.showControls })),
  applyPreset: (name, params) =>
    set((state) => ({
      scene: { ...state.scene, ...params },
      activePreset: name,
    })),
  resetScene: () => set({ scene: { ...defaultScene }, activePreset: null }),
}))

export const PRESETS: Record<string, { label: string; params: Partial<SceneParams> }> = {
  noir_city: {
    label: '黑色电影·城市',
    params: {
      style: 'noir',
      mood: 'dramatic',
      lighting: 'backlit',
      colorIntensity: 0.2,
      fogDensity: 0.6,
      cameraHeight: 0.3,
      cameraAngle: 0.2,
      timeOfDay: 0.85,
      particleDensity: 0.5,
      grainAmount: 0.25,
      vignetteStrength: 0.7,
      depthOfField: 0.4,
    },
  },
  cyber_neon: {
    label: '赛博霓虹',
    params: {
      style: 'cyberpunk',
      mood: 'mysterious',
      lighting: 'neon',
      colorIntensity: 0.9,
      fogDensity: 0.5,
      cameraHeight: 0.6,
      cameraAngle: 0.4,
      timeOfDay: 0.9,
      particleDensity: 0.6,
      grainAmount: 0.1,
      vignetteStrength: 0.4,
      depthOfField: 0.2,
    },
  },
  fantasy_realm: {
    label: '奇幻领域',
    params: {
      style: 'fantasy',
      mood: 'epic',
      lighting: 'golden',
      colorIntensity: 0.7,
      fogDensity: 0.3,
      cameraHeight: 0.7,
      cameraAngle: 0.5,
      timeOfDay: 0.4,
      particleDensity: 0.2,
      grainAmount: 0.05,
      vignetteStrength: 0.3,
      depthOfField: 0.5,
    },
  },
  wasteland_sun: {
    label: '废土日落',
    params: {
      style: 'wasteland',
      mood: 'melancholic',
      lighting: 'golden',
      colorIntensity: 0.8,
      fogDensity: 0.2,
      cameraHeight: 0.4,
      cameraAngle: 0.1,
      timeOfDay: 0.75,
      particleDensity: 0.1,
      grainAmount: 0.2,
      vignetteStrength: 0.5,
      depthOfField: 0.3,
    },
  },
  deep_ocean: {
    label: '深海幽境',
    params: {
      style: 'ocean',
      mood: 'eerie',
      lighting: 'cold',
      colorIntensity: 0.5,
      fogDensity: 0.7,
      cameraHeight: 0.2,
      cameraAngle: 0.6,
      timeOfDay: 0.3,
      particleDensity: 0.4,
      grainAmount: 0.08,
      vignetteStrength: 0.6,
      depthOfField: 0.6,
    },
  },
  dark_forest: {
    label: '暗夜森林',
    params: {
      style: 'forest',
      mood: 'mysterious',
      lighting: 'moonlight',
      colorIntensity: 0.35,
      fogDensity: 0.5,
      cameraHeight: 0.5,
      cameraAngle: 0.3,
      timeOfDay: 0.85,
      particleDensity: 0.3,
      grainAmount: 0.12,
      vignetteStrength: 0.55,
      depthOfField: 0.4,
    },
  },
  cosmic_void: {
    label: '宇宙深渊',
    params: {
      style: 'space',
      mood: 'eerie',
      lighting: 'cold',
      colorIntensity: 0.6,
      fogDensity: 0.1,
      cameraHeight: 0.5,
      cameraAngle: 0.8,
      timeOfDay: 0.1,
      particleDensity: 0.7,
      grainAmount: 0.03,
      vignetteStrength: 0.3,
      depthOfField: 0.1,
    },
  },
  ancient_ruins: {
    label: '远古遗迹',
    params: {
      style: 'ancient',
      mood: 'serene',
      lighting: 'volumetric',
      colorIntensity: 0.55,
      fogDensity: 0.4,
      cameraHeight: 0.4,
      cameraAngle: 0.35,
      timeOfDay: 0.5,
      particleDensity: 0.2,
      grainAmount: 0.15,
      vignetteStrength: 0.45,
      depthOfField: 0.35,
    },
  },
}

export const KEYWORD_MAP: Record<string, Partial<SceneParams>> = {
  '城市': { style: 'noir', cameraHeight: 0.3 },
  '赛博': { style: 'cyberpunk', lighting: 'neon', colorIntensity: 0.9 },
  '霓虹': { style: 'cyberpunk', lighting: 'neon' },
  '奇幻': { style: 'fantasy', mood: 'epic', lighting: 'golden' },
  '废土': { style: 'wasteland', mood: 'melancholic' },
  '海洋': { style: 'ocean', lighting: 'cold' },
  '深海': { style: 'ocean', mood: 'eerie', fogDensity: 0.7 },
  '森林': { style: 'forest', lighting: 'moonlight' },
  '太空': { style: 'space', mood: 'eerie' },
  '宇宙': { style: 'space', particleDensity: 0.7 },
  '遗迹': { style: 'ancient', mood: 'serene' },
  '远古': { style: 'ancient', lighting: 'volumetric' },
  '黑暗': { mood: 'dramatic', colorIntensity: 0.2, timeOfDay: 0.9 },
  '日落': { lighting: 'golden', timeOfDay: 0.75, colorIntensity: 0.8 },
  '月光': { lighting: 'moonlight', timeOfDay: 0.85 },
  '雾': { fogDensity: 0.7 },
  '雨': { particleDensity: 0.6, fogDensity: 0.4 },
  '雪': { particleDensity: 0.5, colorIntensity: 0.3, lighting: 'cold' },
  '神秘': { mood: 'mysterious', fogDensity: 0.5 },
  '史诗': { mood: 'epic', cameraAngle: 0.6 },
  '忧郁': { mood: 'melancholic', colorIntensity: 0.4 },
  '恐怖': { mood: 'eerie', grainAmount: 0.25, vignetteStrength: 0.7 },
  '宁静': { mood: 'serene', fogDensity: 0.3 },
  '戏剧': { mood: 'dramatic', lighting: 'backlit' },
  '体积光': { lighting: 'volumetric' },
  '景深': { depthOfField: 0.6 },
  '胶片': { grainAmount: 0.25 },
  '暗角': { vignetteStrength: 0.7 },
  'city': { style: 'noir', cameraHeight: 0.3 },
  'cyber': { style: 'cyberpunk', lighting: 'neon' },
  'neon': { style: 'cyberpunk', lighting: 'neon' },
  'fantasy': { style: 'fantasy', mood: 'epic' },
  'desert': { style: 'wasteland' },
  'ocean': { style: 'ocean', lighting: 'cold' },
  'forest': { style: 'forest' },
  'space': { style: 'space' },
  'ruins': { style: 'ancient' },
  'dark': { mood: 'dramatic', colorIntensity: 0.2 },
  'sunset': { lighting: 'golden', timeOfDay: 0.75 },
  'fog': { fogDensity: 0.7 },
  'rain': { particleDensity: 0.6 },
  'mystery': { mood: 'mysterious' },
  'epic': { mood: 'epic' },
}

export function parseTextToParams(text: string): Partial<SceneParams> {
  const result: Partial<SceneParams> = {}
  const lower = text.toLowerCase()
  for (const [keyword, params] of Object.entries(KEYWORD_MAP)) {
    if (lower.includes(keyword.toLowerCase())) {
      Object.assign(result, params)
    }
  }
  return result
}
