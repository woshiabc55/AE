import type { World, EntityId, MemoryC, Rule, GameCommand, CausalGraph, Verdict } from "@/types";
import { getComponent, setComponent } from "@/ecs/World";
import type { GameContext } from "@/game";
import { FACTION_TEMPLATES, INITIAL_RELATIONS } from "@/game/factions";

/**
 * 势力关系模型 — 盟友/敌国状态影响宣战/结盟合法性。
 *
 * 考究：战国合纵连横，关系决定外交可行性。
 *   秦为众矢之的（relation -70），齐楚友善（relation +20）。
 *   宣战须有敌意基础（不可突袭盟友），结盟须有善意基础（不可与死敌歃血）。
 *
 * 关系存储于 MemoryC.relationship（EntityId → 关系值 -100~100）。
 *   > 50  盟友（ally）
 *   < -50 敌国（enemy）
 *   其余  中立（neutral）
 */

export const ALLY_THRESHOLD = 50;
export const ENEMY_THRESHOLD = -50;

/** 关系档位 */
export type RelationStatus = "ally" | "enemy" | "neutral";

/** 初始化势力间关系：将模板 ID 映射为实体 ID 并写入 MemoryC */
export function initRelations(
  ctx: GameContext,
  factionIdMap: Map<string, EntityId>
): void {
  for (const [tplId, entityId] of factionIdMap) {
    const relations = INITIAL_RELATIONS[tplId] ?? {};
    const relationship: Record<string, number> = {};
    for (const [targetTplId, value] of Object.entries(relations)) {
      const targetEntity = factionIdMap.get(targetTplId);
      if (targetEntity) {
        relationship[targetEntity] = value;
      }
    }
    // 对称关系：若 A→B 未定义但 B→A 已定义，补齐
    for (const [otherTplId, otherEntity] of factionIdMap) {
      if (otherTplId === tplId) continue;
      if (relationship[otherEntity] !== undefined) continue;
      const reverse = INITIAL_RELATIONS[otherTplId]?.[tplId];
      if (reverse !== undefined) {
        relationship[otherEntity] = reverse;
      } else {
        relationship[otherEntity] = 0; // 默认中立
      }
    }
    setComponent(ctx.world, entityId, "MemoryC", {
      facts: [],
      summary: `${FACTION_TEMPLATES.find((t) => t.id === tplId)?.name ?? tplId}之外交记忆`,
      relationship,
    });
  }
}

/** 获取 A 对 B 的关系值（-100~100） */
export function getRelation(world: World, a: EntityId, b: EntityId): number {
  const memory = getComponent<MemoryC>(world, a, "MemoryC");
  return memory?.relationship[b] ?? 0;
}

/** 关系档位判定 */
export function relationStatus(world: World, a: EntityId, b: EntityId): RelationStatus {
  const v = getRelation(world, a, b);
  if (v > ALLY_THRESHOLD) return "ally";
  if (v < ENEMY_THRESHOLD) return "enemy";
  return "neutral";
}

/** 调整关系值（自动对称 + 钳制到 -100~100） */
export function adjustRelation(
  world: World,
  a: EntityId,
  b: EntityId,
  delta: number
): void {
  const memA = getComponent<MemoryC>(world, a, "MemoryC");
  const memB = getComponent<MemoryC>(world, b, "MemoryC");
  if (memA) {
    const cur = memA.relationship[b] ?? 0;
    memA.relationship[b] = Math.max(-100, Math.min(100, cur + delta));
  }
  if (memB) {
    const cur = memB.relationship[a] ?? 0;
    memB.relationship[a] = Math.max(-100, Math.min(100, cur + delta));
  }
}

const ok: Verdict = { level: "ok", reason: "通过" };

/**
 * 外交合法性硬规则 — 关系状态约束宣战/结盟。
 */
export const RELATION_RULES: Rule[] = [
  {
    id: "no_war_on_ally",
    layer: "hard",
    description: "不可对盟友宣战（须先毁约）",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "DECLARE_WAR") return ok;
      const target = cmd.payload.target as EntityId | undefined;
      if (!target) return ok;
      if (relationStatus(state, cmd.actor, target) === "ally") {
        return reject("两国尚为盟邦，不可骤然兴兵。须先毁约断交。");
      }
      return ok;
    },
  },
  {
    id: "no_alliance_with_enemy",
    layer: "hard",
    description: "不可与敌国结盟（须先修好关系）",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "FORM_ALLIANCE") return ok;
      const target = cmd.payload.target as EntityId | undefined;
      if (!target) return ok;
      if (relationStatus(state, cmd.actor, target) === "enemy") {
        return reject("两国积怨已深，势同水火，难以骤然结盟。须先修好关系。");
      }
      return ok;
    },
  },
];

function reject(reason: string): Verdict {
  return { level: "reject", reason };
}
