import type { Rule, GameCommand, World, CausalGraph, Verdict } from "@/types";
import { getComponent } from "@/ecs/World";
import type { EconomicC, CulturalC, MilitaryC } from "@/types";

const ok: Verdict = { level: "ok", reason: "通过" };
const reject = (reason: string): Verdict => ({ level: "reject", reason });

/**
 * 规则定义 — 三层：硬/软/涌现。
 * 硬规则：不可违反的物理/逻辑约束（时代不可倒退、资源不可负）
 * 软规则：反馈回路约束，违反则降级而非拒绝
 */

export const HARD_RULES: Rule[] = [
  {
    id: "no_negative_resource",
    layer: "hard",
    description: "资源不可为负",
    validate: (cmd: GameCommand, state: World): Verdict => {
      // 出牌消耗校验
      if (cmd.type === "PLAY_CARD") {
        const cardId = cmd.payload.cardId as string | undefined;
        const actor = cmd.actor;
        const economic = getComponent<EconomicC>(state, actor, "EconomicC");
        const cultural = getComponent<CulturalC>(state, actor, "CulturalC");
        if (cardId === "trade_caravan" && (economic?.gold ?? 0) < 12) {
          return reject("黄金不足，无法派遣商队。");
        }
        if (cardId === "revolution" && (cultural?.prestige ?? 0) < 30) {
          return reject("威望不足，无法发起革命。");
        }
      }
      return ok;
    },
  },
];

export const SOFT_RULES: Rule[] = [
  {
    id: "expansion_corruption",
    layer: "soft",
    description: "扩张过快触发腐败（负反馈平衡环）：扩张→腐败→稳定度下降",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type === "PLAY_CARD") {
        const cardId = cmd.payload.cardId as string | undefined;
        // 部族集结扩张过快 → 士气下降作为腐败代价
        if (cardId === "clan_gathering") {
          const military = getComponent<MilitaryC>(state, cmd.actor, "MilitaryC");
          if ((military?.troops ?? 0) > 100) {
            return {
              level: "warn",
              reason: "扩张过快，腐败滋生，士气下降。",
              degradeTo: [
                { entity: cmd.actor, component: "MilitaryC", patch: { morale: -8 } },
              ],
            };
          }
        }
      }
      return ok;
    },
  },
  {
    id: "war_fatigue",
    layer: "soft",
    description: "连年征战士气衰减（延迟反馈）",
    validate: (cmd: GameCommand): Verdict => {
      if (cmd.type === "DECLARE_WAR") {
        return {
          level: "warn",
          reason: "战事再启，民力渐疲。",
          degradeTo: [
            { entity: cmd.actor, component: "MilitaryC", patch: { morale: -5 } },
          ],
        };
      }
      return ok;
    },
  },
];
