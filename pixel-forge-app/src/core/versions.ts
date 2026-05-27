export interface VersionAgent {
  id: string
  name: string
  layer: 'core' | 'effect' | 'arch'
  color: string
}

export interface VersionEffect {
  id: string
  name: string
  category: string
  color: string
}

export interface VersionPipeline {
  id: string
  name: string
  stages: string[]
}

export interface VersionScene {
  id: string
  name: string
  surface: string
}

export interface VersionEvent {
  name: string
  publisher: string
}

export interface VersionConfig {
  id: string
  label: string
  name: string
  desc: string
  color: string
  path: string
  workspace: string
  agents: VersionAgent[]
  effects: VersionEffect[]
  pipeline: VersionPipeline
  scene: VersionScene
  events: VersionEvent[]
  skillPacks: string[]
  newCapabilities: string[]
  cumulativeCount: number
}

export const VERSIONS: VersionConfig[] = [
  {
    id: 'v1', label: 'v1-core', name: '模块化基础', desc: 'EventBus + 单效果渲染',
    color: '#00ff88', path: '/v1-core/', workspace: 'workspace-starter',
    agents: [
      { id: 'eventbus', name: 'EventBus', layer: 'core', color: '#a29bfe' },
      { id: 'core', name: 'CoreModule', layer: 'core', color: '#a29bfe' },
      { id: 'ui', name: 'UIModule', layer: 'core', color: '#a29bfe' },
      { id: 'pixelate', name: 'PixelateEffect', layer: 'effect', color: '#ff6b9d' },
    ],
    effects: [
      { id: 'pixelate-basic', name: '像素化', category: 'basic', color: '#00ff88' },
    ],
    pipeline: { id: 'single-effect', name: '单效果管线', stages: ['source', 'effect', 'output'] },
    scene: { id: 'default-plane', name: '默认平面场景', surface: 'plane' },
    events: [
      { name: 'image:loaded', publisher: 'CoreModule' },
      { name: 'effect:changed', publisher: 'UIModule' },
      { name: 'param:changed', publisher: 'UIModule' },
      { name: 'animation:frame', publisher: 'CoreModule' },
    ],
    skillPacks: ['skillpack-render'],
    newCapabilities: ['EventBus通信', '模块化架构', '像素化效果'],
    cumulativeCount: 3,
  },
  {
    id: 'v2', label: 'v2-chain', name: '链式管道', desc: '效果串联执行 + 3种效果',
    color: '#ffaa00', path: '/v2-chain/', workspace: 'workspace-starter',
    agents: [
      { id: 'pipeline', name: 'Pipeline', layer: 'arch', color: '#44ddff' },
    ],
    effects: [
      { id: 'ionize-burst', name: '离子化消散', category: 'particle', color: '#ff3366' },
      { id: 'wave-line', name: '波浪纹线条', category: 'line', color: '#44ddff' },
    ],
    pipeline: { id: 'single-effect', name: '链式管线', stages: ['source', 'effect-1', 'effect-2', 'output'] },
    scene: { id: 'default-plane', name: '默认平面场景', surface: 'plane' },
    events: [
      { name: 'pipeline:updated', publisher: 'Pipeline' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects'],
    newCapabilities: ['链式管道', '3种效果', '动态增删'],
    cumulativeCount: 6,
  },
  {
    id: 'v3', label: 'v3-blend', name: '图层合成', desc: '多效果图层叠加 + 7种混合模式',
    color: '#ff3366', path: '/v3-blend/', workspace: 'workspace-advanced',
    agents: [
      { id: 'compositor', name: 'Compositor', layer: 'arch', color: '#44ddff' },
    ],
    effects: [],
    pipeline: { id: 'composite-pipeline', name: '图层合成管线', stages: ['source', 'effects', 'composite', 'output'] },
    scene: { id: 'default-plane', name: '默认平面场景', surface: 'plane' },
    events: [
      { name: 'compositor:rendered', publisher: 'Compositor' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects', 'skillpack-pipeline'],
    newCapabilities: ['图层合成', '7种混合模式', '离屏Canvas'],
    cumulativeCount: 9,
  },
  {
    id: 'v4', label: 'v4-interactive', name: '参数调制', desc: 'source→transform→target参数联动',
    color: '#44ddff', path: '/v4-interactive/', workspace: 'workspace-advanced',
    agents: [
      { id: 'modulation', name: 'ModulationEngine', layer: 'arch', color: '#ffaa00' },
    ],
    effects: [],
    pipeline: { id: 'composite-pipeline', name: '调制合成管线', stages: ['source', 'effects', 'modulation', 'composite', 'output'] },
    scene: { id: 'default-plane', name: '默认平面场景', surface: 'plane' },
    events: [
      { name: 'modulation:applied', publisher: 'ModulationEngine' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects', 'skillpack-pipeline'],
    newCapabilities: ['参数调制', '实时联动', 'transform函数'],
    cumulativeCount: 11,
  },
  {
    id: 'v5', label: 'v5-plugin', name: '插件系统', desc: '动态注册/注销效果插件',
    color: '#a29bfe', path: '/v5-plugin/', workspace: 'workspace-advanced',
    agents: [
      { id: 'plugin-manager', name: 'PluginManager', layer: 'arch', color: '#cc44cc' },
    ],
    effects: [],
    pipeline: { id: 'plugin-pipeline', name: '插件管线', stages: ['source', 'builtin', 'plugin', 'composite', 'output'] },
    scene: { id: 'default-plane', name: '默认平面场景', surface: 'plane' },
    events: [
      { name: 'plugin:installed', publisher: 'PluginManager' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects', 'skillpack-pipeline', 'skillpack-plugin'],
    newCapabilities: ['插件注册', 'eval沙箱', '自定义效果'],
    cumulativeCount: 13,
  },
  {
    id: 'v6', label: 'v6-physics3d', name: '3D物理解算', desc: 'Three.js + Verlet物理 + 5种3D面',
    color: '#ff6b9d', path: '/v6-physics3d/', workspace: 'workspace-3d',
    agents: [
      { id: 'physics', name: 'PhysicsEngine', layer: 'arch', color: '#ff4444' },
      { id: 'scene3d', name: 'Scene3D', layer: 'arch', color: '#44aaff' },
    ],
    effects: [],
    pipeline: { id: 'physics-pipeline', name: '3D物理管线', stages: ['source', 'effect', 'texture', 'physics', '3d-render', 'output'] },
    scene: { id: 'cloth-gravity', name: '布料重力场景', surface: 'plane' },
    events: [
      { name: 'physics:applied', publisher: 'PhysicsEngine' },
      { name: 'surface:changed', publisher: 'UIModule' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects', 'skillpack-pipeline', 'skillpack-physics', 'skillpack-3d'],
    newCapabilities: ['3D面渲染', 'Verlet物理', '5种力场', '轨道相机'],
    cumulativeCount: 17,
  },
  {
    id: 'v7', label: 'v7-software-model', name: '软件实体模型', desc: '程序化纹理 + 3D软件实体建模',
    color: '#7cff6b', path: '/v7-software-model/', workspace: 'workspace-3d',
    agents: [
      { id: 'texture', name: 'ProceduralTexture', layer: 'arch', color: '#44ff44' },
    ],
    effects: [],
    pipeline: { id: 'physics-pipeline', name: '实体模型管线', stages: ['source', 'effect', 'texture', 'physics', '3d-render', 'entity-model', 'output'] },
    scene: { id: 'cloth-gravity', name: '布料重力场景', surface: 'plane' },
    events: [
      { name: 'texture:param', publisher: 'ProceduralTexture' },
    ],
    skillPacks: ['skillpack-render', 'skillpack-effects', 'skillpack-pipeline', 'skillpack-physics', 'skillpack-3d'],
    newCapabilities: ['5种程序化纹理', '3D实体建模', '通信连线可视化'],
    cumulativeCount: 20,
  },
]
