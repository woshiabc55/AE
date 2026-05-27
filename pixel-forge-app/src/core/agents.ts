import { bus } from './EventBus'

export type AgentLayer = 'core' | 'effect' | 'arch'

export interface Agent {
  id: string
  name: string
  layer: AgentLayer
  color: string
  active: boolean
}

export interface AgentMessage {
  from: string
  to: string
  event: string
  data: unknown
  timestamp: number
}

const LAYER_COLORS: Record<AgentLayer, string> = {
  core: '#a29bfe',
  effect: '#ff6b9d',
  arch: '#44ddff',
}

const AGENT_REGISTRY: Agent[] = [
  { id: 'eventbus', name: 'EventBus', layer: 'core', color: LAYER_COLORS.core, active: true },
  { id: 'core', name: 'CoreModule', layer: 'core', color: LAYER_COLORS.core, active: true },
  { id: 'ui', name: 'UIModule', layer: 'core', color: LAYER_COLORS.core, active: true },
  { id: 'pixelate', name: 'PixelateEffect', layer: 'effect', color: LAYER_COLORS.effect, active: true },
  { id: 'ionize', name: 'IonizeEffect', layer: 'effect', color: LAYER_COLORS.effect, active: true },
  { id: 'wave', name: 'WaveEffect', layer: 'effect', color: LAYER_COLORS.effect, active: true },
  { id: 'glitch', name: 'GlitchEffect', layer: 'effect', color: LAYER_COLORS.effect, active: true },
  { id: 'chromatic', name: 'ChromaticEffect', layer: 'effect', color: LAYER_COLORS.effect, active: true },
  { id: 'pipeline', name: 'Pipeline', layer: 'arch', color: LAYER_COLORS.arch, active: true },
  { id: 'compositor', name: 'Compositor', layer: 'arch', color: LAYER_COLORS.arch, active: true },
  { id: 'modulation', name: 'ModulationEngine', layer: 'arch', color: LAYER_COLORS.arch, active: true },
  { id: 'physics', name: 'PhysicsEngine', layer: 'arch', color: LAYER_COLORS.arch, active: true },
  { id: 'scene3d', name: 'Scene3D', layer: 'arch', color: LAYER_COLORS.arch, active: true },
  { id: 'texture', name: 'ProceduralTexture', layer: 'arch', color: LAYER_COLORS.arch, active: true },
]

export function getLayerColor(layer: AgentLayer): string {
  return LAYER_COLORS[layer]
}

export function getAllAgents(): Agent[] {
  return [...AGENT_REGISTRY]
}

export function getAgentsByLayer(layer: AgentLayer): Agent[] {
  return AGENT_REGISTRY.filter(a => a.layer === layer)
}

export function getAgentById(id: string): Agent | undefined {
  return AGENT_REGISTRY.find(a => a.id === id)
}

export function getAgentsForVersion(versionAgentIds: string[]): Agent[] {
  return versionAgentIds
    .map(id => AGENT_REGISTRY.find(a => a.id === id))
    .filter((a): a is Agent => !!a)
}

export function sendMessage(from: string, to: string, event: string, data: unknown = null): void {
  const msg: AgentMessage = {
    from,
    to,
    event,
    data,
    timestamp: Date.now(),
  }
  bus.emit(`agent:${to}:${event}`, msg)
  bus.emit('agent:message', msg)
}

export function onAgentMessage(agentId: string, event: string, handler: (msg: AgentMessage) => void): () => void {
  return bus.on(`agent:${agentId}:${event}`, handler)
}

export function onAnyAgentMessage(handler: (msg: AgentMessage) => void): () => void {
  return bus.on('agent:message', handler)
}
