import type {
  Rule,
  GameCommand,
  World,
  CausalGraph,
  Verdict,
  Era,
} from "@/types";
import { ERA_ORDER } from "@/types";
import { getComponent } from "@/ecs/World";
import type { EconomicC, CulturalC, MilitaryC, HandC } from "@/types";
import { CARD_BY_ID, CARD_TECH_REQUIREMENT } from "@/game/cards";

const ok: Verdict = { level: "ok", reason: "通过" };
const reject = (reason: string): Verdict => ({ level: "reject", reason });
const warn = (reason: string, degradeTo?: Verdict["degradeTo"]): Verdict =>
  degradeTo ? { level: "warn", reason, degradeTo } : { level: "warn", reason };

/** 时代索引：ancient=0 < classical=1 < medieval=2 < modern=3 */
function eraIndex(era: Era): number {
  return ERA_ORDER.indexOf(era);
}

/**
 * 规则定义 — 三层：硬/软/涌现。
 *
 * 考究：规则即"历史规律的显式化"。
 *   硬规则：物理/逻辑铁律——时代不可倒退、科技不可凭空、亡国不可行动、资源不可负。
 *   软规则：反馈回路约束——违反则降级而非拒绝，模拟历史的"弹性"与"代价"。
 *
 * 硬规则覆盖：
 *   1. no_negative_resource    — 出牌资源消耗不得透支（泛化校验所有 cost 字段）
 *   2. card_era_match          — 卡牌时代不得超前于当前纪元（不可打出未来之牌）
 *   3. card_tech_prerequisite  — 卡牌所需科技等级不得高于势力当前科技
 *   4. faction_survivable     — 兵力归零的势力不可执行军事/外交动作
 *   5. hand_ownership          — 出牌须持有该牌（防 AI/系统构造非法命令）
 *
 * 软规则覆盖：
 *   1. expansion_corruption    — 扩张过快触发腐败（负反馈）
 *   2. war_fatigue             — 连年征战士气衰减（延迟反馈）
 *   3. tech_overstretch        — 科技跃进过快引发动荡（正反馈制衡）
 *   4. prestige_stagnation     — 威望极高而熵不足，预示文化僵化（延迟反馈预警）
 */

// ============================================================================
// 硬规则
// ============================================================================
export const HARD_RULES: Rule[] = [
  {
    id: "no_negative_resource",
    layer: "hard",
    description: "资源不可为负：出牌消耗不得透支黄金/粮草/威望",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      if (!cardId) return ok;
      const card = CARD_BY_ID.get(cardId);
      if (!card) return ok;

      const actor = cmd.actor;
      const economic = getComponent<EconomicC>(state, actor, "EconomicC");
      const cultural = getComponent<CulturalC>(state, actor, "CulturalC");

      if (card.cost.gold && (economic?.gold ?? 0) < card.cost.gold) {
        return reject(`黄金不足，无法打出【${card.name}】。`);
      }
      if (card.cost.food && (economic?.food ?? 0) < card.cost.food) {
        return reject(`粮草不足，无法打出【${card.name}】。`);
      }
      if (card.cost.prestige && (cultural?.prestige ?? 0) < card.cost.prestige) {
        return reject(`威望不足，无法打出【${card.name}】。`);
      }
      return ok;
    },
  },
  {
    id: "card_era_match",
    layer: "hard",
    description: "卡牌时代匹配：不可打出超前于当前纪元的卡牌（历史不可跃进）",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      if (!cardId) return ok;
      const card = CARD_BY_ID.get(cardId);
      if (!card) return ok;

      const currentIdx = eraIndex(state.era);
      const cardIdx = eraIndex(card.era);
      // 允许打出当前或过往纪元的卡（旧技术仍可用，作为"遗留"）
      // 但禁止打出未来纪元的卡（如帝国纪元不可打火绳枪）
      if (cardIdx > currentIdx) {
        return reject(
          `【${card.name}】属${card.era}纪元之物，当前尚在${state.era}纪元，时代未至。`
        );
      }
      return ok;
    },
  },
  {
    id: "card_tech_prerequisite",
    layer: "hard",
    description: "科技前置：高阶卡牌需相应科技等级支撑（冶铸/制度不可凭空而就）",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      if (!cardId) return ok;
      const requiredTech = CARD_TECH_REQUIREMENT[cardId];
      if (requiredTech === undefined || requiredTech === 0) return ok;

      const actor = cmd.actor;
      const military = getComponent<MilitaryC>(state, actor, "MilitaryC");
      const currentTech = military?.techLevel ?? 0;
      if (currentTech < requiredTech) {
        const card = CARD_BY_ID.get(cardId);
        return reject(
          `【${card?.name ?? cardId}】需科技等级 ${requiredTech}，当前仅 ${currentTech}，技术根基未备。`
        );
      }
      return ok;
    },
  },
  {
    id: "faction_survivable",
    layer: "hard",
    description: "势力存活性：兵力归零的势力不可执行军事/外交动作（亡国不可兴兵）",
    validate: (cmd: GameCommand, state: World): Verdict => {
      // 仅校验涉及军事/外交的命令
      const militaryActions: GameCommand["type"][] = [
        "PLAY_CARD",
        "DECLARE_WAR",
        "FORM_ALLIANCE",
      ];
      if (!militaryActions.includes(cmd.type)) return ok;

      const actor = cmd.actor;
      const military = getComponent<MilitaryC>(state, actor, "MilitaryC");
      if (military && (military.troops ?? 0) <= 0) {
        return reject("兵力已竭，社稷倾覆，无可兴兵举事。");
      }
      return ok;
    },
  },
  {
    id: "hand_ownership",
    layer: "hard",
    description: "出牌须持有该牌：防止 AI 或系统构造非法命令绕过手牌",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      if (!cardId) return ok;
      const actor = cmd.actor;
      const hand = getComponent<HandC>(state, actor, "HandC");
      if (hand && !hand.cards.includes(cardId)) {
        return reject("该卡牌不在手中，无法打出。");
      }
      return ok;
    },
  },
];

// ============================================================================
// 软规则（反馈回路约束）
// ============================================================================
export const SOFT_RULES: Rule[] = [
  {
    id: "expansion_corruption",
    layer: "soft",
    description: "扩张过快触发腐败（负反馈平衡环）：扩张→腐败→稳定度下降",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      // 部族集结扩张过快 → 士气下降作为腐败代价
      if (cardId === "clan_gathering") {
        const military = getComponent<MilitaryC>(state, cmd.actor, "MilitaryC");
        if ((military?.troops ?? 0) > 100) {
          return warn("扩张过快，腐败滋生，士气下降。", [
            { entity: cmd.actor, component: "MilitaryC", patch: { morale: -8 } },
          ]);
        }
      }
      return ok;
    },
  },
  {
    id: "war_fatigue",
    layer: "soft",
    description: "连年征战士气衰减（延迟反馈）：每次宣战折损民力",
    validate: (cmd: GameCommand): Verdict => {
      if (cmd.type === "DECLARE_WAR") {
        return warn("战事再启，民力渐疲。", [
          { entity: cmd.actor, component: "MilitaryC", patch: { morale: -5 } },
        ]);
      }
      return ok;
    },
  },
  {
    id: "tech_overstretch",
    layer: "soft",
    description:
      "科技跃进过快引发动荡（正反馈制衡）：高科技低威望→制度跟不上技术→不稳",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cardId = cmd.payload.cardId as string | undefined;
      const card = cardId ? CARD_BY_ID.get(cardId) : undefined;
      // 仅当打出提升科技等级的卡牌时校验
      const boostsTech = card?.effects.some(
        (e) => e.kind === "modify_component" && e.component === "MilitaryC" &&
          e.patch && "techLevel" in e.patch
      );
      if (!boostsTech) return ok;

      const military = getComponent<MilitaryC>(state, cmd.actor, "MilitaryC");
      const cultural = getComponent<CulturalC>(state, cmd.actor, "CulturalC");
      // 科技高而威望低 → 制度追不上技术，士气受损
      if ((military?.techLevel ?? 0) >= 4 && (cultural?.prestige ?? 0) < 30) {
        return warn("技术骤进而礼法未立，人心浮动。", [
          { entity: cmd.actor, component: "MilitaryC", patch: { morale: -6 } },
        ]);
      }
      return ok;
    },
  },
  {
    id: "prestige_stagnation",
    layer: "soft",
    description:
      "威望极高而熵不足，预示文化僵化（延迟反馈预警）：盛极而衰的先兆",
    validate: (cmd: GameCommand, state: World): Verdict => {
      if (cmd.type !== "PLAY_CARD") return ok;
      const cultural = getComponent<CulturalC>(state, cmd.actor, "CulturalC");
      // 威望极高 → 警示僵化风险（仅 warn，不降级）
      if ((cultural?.prestige ?? 0) > 85) {
        return warn("威望极盛，恐现盛极而衰之兆，宜未雨绸缪。");
      }
      return ok;
    },
  },
];
