export interface McopFormat {
  ext: string
  name: string
  color: string
  icon: string
  purpose: string
  dir: string
  items: { id: string; name: string; layer?: string }[]
}

export const MCOP_FORMATS: McopFormat[] = [
  {
    ext: '.selena', name: 'Selena', color: '#44ddff', icon: '◇', purpose: '场景选择', dir: 'scenes/',
    items: [
      { id: 'default-plane', name: '默认平面场景' }, { id: 'cloth-gravity', name: '布料重力场景' },
      { id: 'sphere-wrap', name: '球体包裹场景' }, { id: 'cylinder-roll', name: '圆柱滚动场景' },
      { id: 'cube-explode', name: '立方体爆炸场景' }, { id: 'torus-wave', name: '环面波浪场景' },
    ],
  },
  {
    ext: '.kelex', name: 'Kelex', color: '#ff6b9d', icon: '◈', purpose: '效果变换', dir: 'effects/',
    items: [
      { id: 'pixelate-basic', name: '像素化' }, { id: 'ionize-burst', name: '离子化消散' },
      { id: 'wave-line', name: '波浪纹线条' }, { id: 'glitch-shift', name: '故障偏移' },
      { id: 'chromatic-aberration', name: '色差' },
    ],
  },
  {
    ext: '.skill', name: 'Skill', color: '#7cff6b', icon: '▣', purpose: '能力技能', dir: 'skills/',
    items: [
      { id: 'pixel-render', name: '像素渲染能力' }, { id: 'physics-solve', name: '物理解算能力' },
    ],
  },
  {
    ext: '.hermes', name: 'Hermes', color: '#ffaa00', icon: '⚡', purpose: '通信事件', dir: 'comms/',
    items: [
      { id: 'core-events', name: '核心事件协议' }, { id: 'effect-events', name: '效果事件协议' },
      { id: 'ui-events', name: 'UI事件协议' },
    ],
  },
  {
    ext: '.agent', name: 'Agent', color: '#a29bfe', icon: '⬡', purpose: '模块代理', dir: 'agents/',
    items: [
      { id: 'eventbus', name: 'EventBus', layer: 'core' }, { id: 'core', name: 'CoreModule', layer: 'core' },
      { id: 'ui', name: 'UIModule', layer: 'core' }, { id: 'pixelate', name: 'PixelateEffect', layer: 'effect' },
      { id: 'ionize', name: 'IonizeEffect', layer: 'effect' }, { id: 'wave', name: 'WaveEffect', layer: 'effect' },
      { id: 'glitch', name: 'GlitchEffect', layer: 'effect' }, { id: 'chromatic', name: 'ChromaticEffect', layer: 'effect' },
      { id: 'pipeline', name: 'Pipeline', layer: 'arch' }, { id: 'compositor', name: 'Compositor', layer: 'arch' },
      { id: 'modulation', name: 'ModulationEngine', layer: 'arch' }, { id: 'plugin-manager', name: 'PluginManager', layer: 'arch' },
      { id: 'physics', name: 'PhysicsEngine', layer: 'arch' }, { id: 'scene3d', name: 'Scene3D', layer: 'arch' },
      { id: 'texture', name: 'ProceduralTexture', layer: 'arch' },
    ],
  },
  {
    ext: '.opic', name: 'Opic', color: '#ff3366', icon: '◉', purpose: '视觉纹理', dir: 'optics/',
    items: [
      { id: 'pixel-default', name: '默认像素化纹理' }, { id: 'rings-neon', name: '霓虹环带纹理' },
      { id: 'spiral-cyber', name: '赛博螺旋纹理' }, { id: 'checkerboard-mono', name: '单色棋盘纹理' },
      { id: 'gradient-sunset', name: '日落渐变纹理' }, { id: 'stripe-signal', name: '信号条纹纹理' },
    ],
  },
  {
    ext: '.rpa', name: 'RPA', color: '#00ff88', icon: '▶', purpose: '渲染管线', dir: 'pipelines/',
    items: [
      { id: 'single-effect', name: '单效果管线' }, { id: 'physics-pipeline', name: '3D物理渲染管线' },
      { id: 'composite-pipeline', name: '图层合成管线' }, { id: 'plugin-pipeline', name: '插件管线' },
    ],
  },
]

export interface SkillPack {
  id: string
  name: string
  tier: number
  color: string
}

export const SKILL_PACKS: SkillPack[] = [
  { id: 'skillpack-render', name: '渲染技能包', tier: 1, color: '#7cff6b' },
  { id: 'skillpack-effects', name: '效果技能包', tier: 1, color: '#ff6b9d' },
  { id: 'skillpack-physics', name: '物理技能包', tier: 1, color: '#ffaa00' },
  { id: 'skillpack-pipeline', name: '管线技能包', tier: 2, color: '#a29bfe' },
  { id: 'skillpack-3d', name: '3D场景技能包', tier: 2, color: '#44ddff' },
  { id: 'skillpack-plugin', name: '插件技能包', tier: 2, color: '#ff3366' },
]

export interface Workspace {
  id: string
  name: string
  tier: number
  desc: string
  effects: number
  physics: boolean
  threeD: boolean
  plugins: boolean
}

export const WORKSPACES: Workspace[] = [
  { id: 'workspace-starter', name: '入门制作空间', tier: 1, desc: '单效果 · 无3D/物理', effects: 1, physics: false, threeD: false, plugins: false },
  { id: 'workspace-advanced', name: '进阶制作空间', tier: 2, desc: '多效果合成 · 7种混合模式', effects: 5, physics: false, threeD: false, plugins: false },
  { id: 'workspace-3d', name: '3D制作空间', tier: 3, desc: '物理解算 + 3D面 + 程序化纹理', effects: 5, physics: true, threeD: true, plugins: false },
  { id: 'workspace-full', name: '完整制作空间', tier: 4, desc: '全部能力 + 插件扩展', effects: 99, physics: true, threeD: true, plugins: true },
]
