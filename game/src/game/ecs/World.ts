// ECS 核心：Entity = id；Component = 数据；World = 单一真相快照
// 纯确定性、零 AI 依赖、可单测。组件状态变更 = 一组 ComponentDelta，重放即重建世界。

import { nanoid } from 'nanoid';
import type {
  ComponentDelta,
  ComponentKind,
  ComponentMap,
  Effect,
  EntityId,
  Era,
  EventId,
  WorldMetaC,
} from '../types';

// World 的可序列化快照 —— 用于持久化(IDB)、undo 快照栈、replay 重建
export interface WorldSnapshot {
  entities: Record<EntityId, Partial<Record<ComponentKind, unknown>>>;
  nextId: number;
}

const WORLD_ENTITY = 'world'; // 全局单例实体，持有 WorldMeta

export class World {
  private entities = new Map<EntityId, Map<ComponentKind, unknown>>();
  private counter = 1;

  constructor() {
    // 预置 WorldMeta 单例
    this.entities.set(WORLD_ENTITY, new Map([['WorldMeta', {
      turn: 1,
      era: 'stone' as Era,
      entropy: 0,
    } as WorldMetaC]]));
  }

  // ===== 实体管理 =====
  createEntity(id?: EntityId): EntityId {
    const eid = id ?? `e${this.counter++}`;
    if (!this.entities.has(eid)) this.entities.set(eid, new Map());
    return eid;
  }

  addComponent<K extends ComponentKind>(entity: EntityId, kind: K, data: ComponentMap[K]): void {
    let comps = this.entities.get(entity);
    if (!comps) {
      comps = new Map();
      this.entities.set(entity, comps);
    }
    comps.set(kind, structuredClone(data));
  }

  getComponent<K extends ComponentKind>(entity: EntityId, kind: K): ComponentMap[K] | undefined {
    return this.entities.get(entity)?.get(kind) as ComponentMap[K] | undefined;
  }

  hasComponent(entity: EntityId, kind: ComponentKind): boolean {
    return this.entities.get(entity)?.has(kind) ?? false;
  }

  removeComponent(entity: EntityId, kind: ComponentKind): void {
    this.entities.get(entity)?.delete(kind);
  }

  removeEntity(entity: EntityId): void {
    this.entities.delete(entity);
  }

  /** 查询拥有指定组件的全部实体（System 按组件类型查询，新增系统零侵入） */
  query(kind: ComponentKind): EntityId[] {
    const result: EntityId[] = [];
    for (const [id, comps] of this.entities) {
      if (comps.has(kind)) result.push(id);
    }
    return result;
  }

  allEntities(): EntityId[] {
    return Array.from(this.entities.keys());
  }

  // ===== 全局元数据快捷访问 =====
  meta(): WorldMetaC {
    return this.getComponent(WORLD_ENTITY, 'WorldMeta')!;
  }
  setMeta(patch: Partial<WorldMetaC>): void {
    const m = this.meta();
    this.addComponent(WORLD_ENTITY, 'WorldMeta', { ...m, ...patch });
  }

  // ===== Effect 应用：统一处理所有 Effect 类型，返回产生的结构化 Delta =====
  // 这是"规则白箱"与"状态"的唯一接触面：所有变更经此入口，可审计、可重放。
  applyEffect(e: Effect): ComponentDelta[] {
    switch (e.kind) {
      case 'MODIFY_FIELD': {
        const comp = this.getComponent(e.entity, e.component) as unknown as Record<string, unknown> | undefined;
        if (!comp) return [];
        const cur = (comp[e.field] as number) ?? 0;
        comp[e.field] = cur + e.delta;
        return [{ entity: e.entity, component: e.component, patch: { [e.field]: comp[e.field] } }];
      }
      case 'SET_FIELD': {
        const comp = this.getComponent(e.entity, e.component) as unknown as Record<string, unknown> | undefined;
        if (!comp) return [];
        comp[e.field] = e.value;
        return [{ entity: e.entity, component: e.component, patch: { [e.field]: e.value } }];
      }
      case 'CREATE_CARD': {
        this.createEntity(e.card);
        this.addComponent(e.card, 'CardInstance', { templateId: e.templateId, ownerFaction: e.ownerFaction });
        return [{ entity: e.card, component: 'CardInstance', patch: { templateId: e.templateId, ownerFaction: e.ownerFaction } }];
      }
      case 'ADD_CARD_TO_HAND': {
        const hand = this.getComponent(e.faction, 'Hand');
        if (!hand) return [];
        if (!hand.cardIds.includes(e.card)) hand.cardIds.push(e.card);
        return [{ entity: e.faction, component: 'Hand', patch: { cardIds: [...hand.cardIds] } }];
      }
      case 'REMOVE_CARD_FROM_HAND': {
        const hand = this.getComponent(e.faction, 'Hand');
        if (!hand) return [];
        hand.cardIds = hand.cardIds.filter((c) => c !== e.card);
        return [{ entity: e.faction, component: 'Hand', patch: { cardIds: [...hand.cardIds] } }];
      }
      case 'ADVANCE_ERA': {
        this.setMeta({ era: e.era });
        return [{ entity: WORLD_ENTITY, component: 'WorldMeta', patch: { era: e.era } }];
      }
      case 'ADVANCE_TURN': {
        const turn = this.meta().turn + 1;
        this.setMeta({ turn });
        return [{ entity: WORLD_ENTITY, component: 'WorldMeta', patch: { turn } }];
      }
      case 'LOG_FLAVOR':
        return []; // 纯叙事，无状态变更
      default:
        return [];
    }
  }

  /** 直接应用一个 Delta（重放时使用，绕过 Effect 逻辑，保证幂等） */
  applyDelta(d: ComponentDelta): void {
    const comp = this.getComponent(d.entity, d.component) as unknown as Record<string, unknown> | undefined;
    if (!comp) {
      // 实体/组件可能尚不存在（重放顺序），创建之
      this.createEntity(d.entity);
      this.addComponent(d.entity, d.component, d.patch as never);
      return;
    }
    Object.assign(comp, d.patch);
  }

  // ===== 快照 / 重建 =====
  snapshot(): WorldSnapshot {
    const entities: WorldSnapshot['entities'] = {};
    for (const [id, comps] of this.entities) {
      const obj: Partial<Record<ComponentKind, unknown>> = {};
      for (const [k, v] of comps) obj[k] = structuredClone(v);
      entities[id] = obj;
    }
    return { entities, nextId: this.counter };
  }

  restore(s: WorldSnapshot): void {
    this.entities.clear();
    for (const [id, comps] of Object.entries(s.entities)) {
      const map = new Map<ComponentKind, unknown>();
      for (const [k, v] of Object.entries(comps)) {
        map.set(k as ComponentKind, structuredClone(v));
      }
      this.entities.set(id, map);
    }
    this.counter = s.nextId;
  }

  clone(): World {
    const w = new World();
    w.restore(this.snapshot());
    return w;
  }

  /** 生成事件 ID（与实体 ID 区分，便于因果图谱查询） */
  static eventId(): EventId {
    return `ev_${nanoid(10)}`;
  }
  static entityId(prefix = 'e'): EntityId {
    return `${prefix}_${nanoid(8)}`;
  }
}

export { WORLD_ENTITY };
