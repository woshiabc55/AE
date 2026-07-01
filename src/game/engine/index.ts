// 引擎统一出口 —— 确定性核心，不依赖 ai/
export { EventBus, CausalGraph } from './EventBus';
export { RuleEngine } from './RuleEngine';
export type { Rule } from './RuleEngine';
export { StateManager } from './StateManager';
export type { ApplyOptions } from './StateManager';
export { CommandBus } from './CommandBus';
export type { DispatchResult } from './CommandBus';
export { World } from '../ecs/World';
export type { WorldSnapshot } from '../ecs/World';
