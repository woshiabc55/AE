import type {
  World,
  EntityId,
  Component,
  ComponentName,
  WorldSnapshot,
  Era,
} from "@/types";
import { createEntity } from "./Entity";
import { applyPatch } from "./Component";

/**
 * World（单一真相快照）— Map<EntityId, Component[]> 结构。
 * 数据局部性 + 易扩展；天然适配事件溯源（组件状态变更 = 一组 ComponentDelta 事件，重放即重建世界）。
 */
export function createWorld(seed = Date.now()): World {
  return {
    turn: 0,
    era: "ancient",
    entities: new Map(),
    seed,
  };
}

/** 生成实体并可选挂载初始组件 */
export function spawnEntity(
  world: World,
  components: Partial<Record<ComponentName, Component>> = {}
): EntityId {
  const id = createEntity();
  world.entities.set(id, { ...components });
  return id;
}

/** 挂载/替换组件 */
export function setComponent<C extends Component>(
  world: World,
  entity: EntityId,
  name: ComponentName,
  component: C
): void {
  const comps = world.entities.get(entity) ?? {};
  comps[name] = component;
  world.entities.set(entity, comps);
}

/** 获取组件 */
export function getComponent<C extends Component>(
  world: World,
  entity: EntityId,
  name: ComponentName
): C | undefined {
  return world.entities.get(entity)?.[name] as C | undefined;
}

/** 移除组件 */
export function removeComponent(
  world: World,
  entity: EntityId,
  name: ComponentName
): void {
  const comps = world.entities.get(entity);
  if (comps) {
    delete comps[name];
  }
}

/** 查询所有拥有指定组件的实体（系统按组件类型查询） */
export function* queryEntities<C extends Component>(
  world: World,
  name: ComponentName
): Generator<{ entity: EntityId; component: C }> {
  for (const [entity, comps] of world.entities) {
    const comp = comps[name] as C | undefined;
    if (comp) {
      yield { entity, component: comp };
    }
  }
}

/** 应用 ComponentDelta 到世界（事件重放的核心） */
export function applyDelta(world: World, delta: import("@/types").ComponentDelta): void {
  const existing = getComponent(world, delta.entity, delta.component);
  const next = applyPatch(existing, delta.patch);
  setComponent(world, delta.entity, delta.component, next);
}

/** 序列化为快照（用于持久化） */
export function snapshot(world: World): WorldSnapshot {
  const entities: WorldSnapshot["entities"] = {};
  for (const [id, comps] of world.entities) {
    entities[id] = {};
    for (const [name, comp] of Object.entries(comps)) {
      entities[id][name as ComponentName] = structuredClone(comp as Component);
    }
  }
  return {
    turn: world.turn,
    era: world.era,
    entities,
    causalGraphVersion: 0,
    ts: Date.now(),
  };
}

/** 从快照重建世界 */
export function restore(snapshot: WorldSnapshot, seed: number): World {
  const world = createWorld(seed);
  world.turn = snapshot.turn;
  world.era = snapshot.era as Era;
  for (const [id, comps] of Object.entries(snapshot.entities)) {
    const restored: Partial<Record<ComponentName, Component>> = {};
    for (const [name, comp] of Object.entries(comps)) {
      restored[name as ComponentName] = structuredClone(comp as Component);
    }
    world.entities.set(id, restored);
  }
  return world;
}
