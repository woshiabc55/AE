import type { World, CausalGraph, GameEvent, EventId } from "@/types";
import { createWorld, spawnEntity, setComponent } from "@/ecs/World";
import { createCausalGraph } from "@/engine/CausalGraph";
import { EventBus } from "@/engine/EventBus";
import { CommandBus } from "@/engine/CommandBus";
import { QueryBus } from "@/engine/QueryBus";
import { RuleEngine } from "@/engine/RuleEngine";
import { FeedbackLoopRegistry } from "@/engine/FeedbackLoops";
import { StateManager } from "@/engine/StateManager";
import { EventStore } from "@/db/eventStore";
import { HARD_RULES, SOFT_RULES } from "./rules";
import { FEEDBACK_LOOPS } from "./loops";
import { FACTION_TEMPLATES, type FactionTemplate } from "./factions";
import { RELATION_RULES, initRelations } from "./relations";
import type { Component, ComponentName, EntityId } from "@/types";

/**
 * 游戏引擎装配 — 把 ECS 核心 + 确定性引擎 + 规则 + 反馈回路组装在一起。
 */
export interface GameContext {
  world: World;
  graph: CausalGraph;
  eventBus: EventBus;
  eventStore: EventStore;
  commandBus: CommandBus;
  queryBus: QueryBus;
  ruleEngine: RuleEngine;
  feedback: FeedbackLoopRegistry;
  stateManager: StateManager;
  playerEntity: EntityId | null;
  factions: EntityId[];
}

export function createGameContext(seed = Date.now()): GameContext {
  const world = createWorld(seed);
  const graph = createCausalGraph();
  const eventBus = new EventBus();
  const eventStore = new EventStore();
  const feedback = new FeedbackLoopRegistry();
  const ruleEngine = new RuleEngine(feedback);
  const stateManager = new StateManager();
  const commandBus = new CommandBus(ruleEngine, eventBus, eventStore, graph);
  const queryBus = new QueryBus();

  // 注册规则
  for (const rule of HARD_RULES) ruleEngine.register(rule);
  for (const rule of SOFT_RULES) ruleEngine.register(rule);
  for (const rule of RELATION_RULES) ruleEngine.register(rule);
  for (const loop of FEEDBACK_LOOPS) feedback.register(loop);

  return {
    world,
    graph,
    eventBus,
    eventStore,
    commandBus,
    queryBus,
    ruleEngine,
    feedback,
    stateManager,
    playerEntity: null,
    factions: [],
  };
}

/** 从势力模板生成实体并挂载组件 */
export function spawnFaction(ctx: GameContext, tpl: FactionTemplate): EntityId {
  const id = spawnEntity(ctx.world);
  setComponent(ctx.world, id, "FactionC", { ...tpl.components.FactionC });
  setComponent(ctx.world, id, "MilitaryC", { ...tpl.components.MilitaryC });
  setComponent(ctx.world, id, "EconomicC", { ...tpl.components.EconomicC });
  setComponent(ctx.world, id, "CulturalC", { ...tpl.components.CulturalC });
  setComponent(ctx.world, id, "EntropyC", { ...tpl.components.EntropyC });
  setComponent(ctx.world, id, "HandC", { ...tpl.components.HandC });
  setComponent(ctx.world, id, "PopulationC", { ...tpl.components.PopulationC });
  ctx.factions.push(id);
  return id;
}

/** 初始化新对局 */
export function initGame(
  ctx: GameContext,
  playerFactionId: string,
  opponentCount = 3
): { playerEntity: EntityId; factions: EntityId[] } {
  // 模板 ID → 实体 ID 映射（用于初始化势力关系）
  const factionIdMap = new Map<string, EntityId>();

  // 玩家势力
  const playerTpl =
    FACTION_TEMPLATES.find((f) => f.id === playerFactionId) ?? FACTION_TEMPLATES[0];
  const playerEntity = spawnFaction(ctx, {
    ...playerTpl,
    components: {
      ...playerTpl.components,
      FactionC: { ...playerTpl.components.FactionC, isPlayer: true },
    },
  });
  ctx.playerEntity = playerEntity;
  factionIdMap.set(playerTpl.id, playerEntity);

  // 对手势力（不重复选玩家）
  const opponents = FACTION_TEMPLATES.filter((f) => f.id !== playerFactionId).slice(
    0,
    opponentCount
  );
  for (const tpl of opponents) {
    const entityId = spawnFaction(ctx, tpl);
    factionIdMap.set(tpl.id, entityId);
  }

  // 初始化势力间关系（基于战国合纵连横史）
  initRelations(ctx, factionIdMap);

  return { playerEntity, factions: ctx.factions };
}

export type { GameEvent, EventId, Component, ComponentName };
