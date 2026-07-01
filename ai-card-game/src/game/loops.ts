import type { FeedbackLoop, World, CausalGraph, Verdict } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, CulturalC, EntropyC } from "@/types";

const ok: Verdict = { level: "ok", reason: "通过" };

/**
 * 反馈回路定义 — 系统动力学建模。
 *
 * 考究：反馈回路即"历史动力的显式化"。
 *   正反馈（reinforcing）：技术→生产力→研究投入→技术（滚雪球，需负反馈制衡）
 *   负反馈（balancing）：扩张→腐败→稳定度下降→内乱→收缩（自我调节）
 *   延迟反馈（delayed）：政策后果在 N 回合后才显现
 *
 * 阈值校准依据（基于战国末期初始数值）：
 *   秦 troops95/morale85/gold90/food75/tech3/prestige15/entropy28
 *   赵 troops85/morale80/gold100/food50/tech3/prestige35/entropy24
 *   齐 troops55/morale50/gold230/food95/tech2/prestige65/entropy26
 *   楚 troops75/morale65/gold110/food85/tech2/prestige70/entropy22
 *
 * 规则引擎不只校验"合不合法"，更建模"反馈结构"。
 */
export const FEEDBACK_LOOPS: FeedbackLoop[] = [
  // ===== 正反馈：滚雪球（需制衡）=====
  {
    id: "tech_reinforcing",
    kind: "reinforcing",
    participants: [],
    variables: ["MilitaryC.techLevel", "EconomicC.gold"],
    description: "技术→生产力→研究投入→技术（正反馈，滚雪球，以熵增为制衡代价）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      // 当某势力科技与财富都很高时，发出滚雪球告警，并以熵增作为制衡代价
      // 阈值由 300 降至 250：齐初始 gold=230，进一步积累即触发
      for (const [entity, comps] of state.entities) {
        const military = comps.MilitaryC as MilitaryC | undefined;
        const economic = comps.EconomicC as EconomicC | undefined;
        if ((military?.techLevel ?? 0) >= 4 && (economic?.gold ?? 0) > 250) {
          return {
            level: "warn",
            reason: "技术—财富正反馈过强，文明复杂度代价上升。",
            degradeTo: [
              { entity, component: "EntropyC", patch: { entropy: 5 } },
            ],
          };
        }
      }
      return ok;
    },
  },
  {
    id: "gengzhan_reinforcing",
    kind: "reinforcing",
    participants: [],
    variables: ["EconomicC.food", "MilitaryC.troops"],
    description:
      "耕战正反馈：粮足则兵强，兵强则护耕（秦耕战体系核心，以熵增为制衡代价）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      // 粮草与兵力俱高 → 耕战循环加速，但战争经济的刚性带来熵增
      for (const [entity, comps] of state.entities) {
        const military = comps.MilitaryC as MilitaryC | undefined;
        const economic = comps.EconomicC as EconomicC | undefined;
        if ((economic?.food ?? 0) > 80 && (military?.troops ?? 0) > 80) {
          return {
            level: "warn",
            reason: "耕战相济，国力正盛，然战争经济刚性日增。",
            degradeTo: [
              { entity, component: "EntropyC", patch: { entropy: 4 } },
            ],
          };
        }
      }
      return ok;
    },
  },

  // ===== 负反馈：自我调节 =====
  {
    id: "expansion_balancing",
    kind: "balancing",
    participants: [],
    variables: ["MilitaryC.troops", "MilitaryC.morale"],
    description: "扩张→腐败→稳定度下降→收缩（负反馈，自我调节）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      for (const [entity, comps] of state.entities) {
        const military = comps.MilitaryC as MilitaryC | undefined;
        // 兵力过高而士气过低 → 触发内乱收缩
        // 阈值由 120/40 调至 110/45：秦初始 troops=95，几张牌后即触达
        if ((military?.troops ?? 0) > 110 && (military?.morale ?? 100) < 45) {
          return {
            level: "warn",
            reason: "军势膨胀而士气崩坏，内部不稳。",
            degradeTo: [
              { entity, component: "MilitaryC", patch: { troops: -15 } },
            ],
          };
        }
      }
      return ok;
    },
  },
  {
    id: "wealth_corruption",
    kind: "balancing",
    participants: [],
    variables: ["EconomicC.gold", "MilitaryC.morale"],
    description:
      "财富—腐败负反馈：富甲天下则武备松弛（'生于忧患，死于安乐'）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      // 财富极盛 → 武备松弛，士气下降
      // 阈值 250：齐初始 gold=230，临近但未触发；进一步积累即腐化
      for (const [entity, comps] of state.entities) {
        const economic = comps.EconomicC as EconomicC | undefined;
        if ((economic?.gold ?? 0) > 250) {
          return {
            level: "warn",
            reason: "富甲天下而武备渐弛，'生于忧患，死于安乐'。",
            degradeTo: [
              { entity, component: "MilitaryC", patch: { morale: -5 } },
            ],
          };
        }
      }
      return ok;
    },
  },
  {
    id: "supply_crisis",
    kind: "balancing",
    participants: [],
    variables: ["MilitaryC.troops", "EconomicC.food"],
    description: "兵多粮少→饥溃（负反馈：补给不足则军自溃）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      // 兵力充足而粮草告罄 → 军粮不济，兵自溃散
      // 赵初始 food=50 偏低，若进一步消耗即触发，贴合"代地苦寒"
      for (const [entity, comps] of state.entities) {
        const military = comps.MilitaryC as MilitaryC | undefined;
        const economic = comps.EconomicC as EconomicC | undefined;
        if ((military?.troops ?? 0) > 70 && (economic?.food ?? 0) < 30) {
          return {
            level: "warn",
            reason: "兵多粮少，军粮不济，恐生哗变。",
            degradeTo: [
              { entity, component: "MilitaryC", patch: { troops: -10 } },
            ],
          };
        }
      }
      return ok;
    },
  },

  // ===== 延迟反馈：政策后果滞后显现 =====
  {
    id: "cultural_entropy_delayed",
    kind: "delayed",
    participants: [],
    variables: ["CulturalC.prestige", "EntropyC.entropy"],
    description: "文化繁荣→数回合后文明熵跃升（延迟反馈，历史感核心来源）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      for (const [, comps] of state.entities) {
        const cultural = comps.CulturalC as CulturalC | undefined;
        const entropy = comps.EntropyC as EntropyC | undefined;
        // 威望极高但熵未跟上 → 提示延迟反馈即将触发
        // 阈值由 80 降至 75：楚初始 prestige=70，进一步文化积累即触发
        if ((cultural?.prestige ?? 0) > 75 && (entropy?.entropy ?? 0) < 40) {
          return {
            level: "warn",
            reason: "文化繁荣将推动文明熵跃升（延迟效应酝酿中）。",
          };
        }
      }
      return ok;
    },
  },
];
