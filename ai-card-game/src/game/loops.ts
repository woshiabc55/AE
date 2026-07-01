import type { FeedbackLoop, World, CausalGraph, Verdict } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, CulturalC, EntropyC } from "@/types";

const ok: Verdict = { level: "ok", reason: "通过" };

/**
 * 反馈回路定义 — 系统动力学建模。
 * 正反馈（reinforcing）：技术→生产力→研究投入→技术（滚雪球，需负反馈制衡）
 * 负反馈（balancing）：扩张→腐败→稳定度下降→内乱→收缩（自我调节）
 * 延迟反馈（delayed）：政策后果在 N 回合后才显现
 *
 * 规则引擎不只校验"合不合法"，更建模"反馈结构"。
 */
export const FEEDBACK_LOOPS: FeedbackLoop[] = [
  {
    id: "tech_reinforcing",
    kind: "reinforcing",
    participants: [],
    variables: ["MilitaryC.techLevel", "EconomicC.gold"],
    description: "技术→生产力→研究投入→技术（正反馈，滚雪球）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      // 当某势力科技与财富都很高时，发出滚雪球告警（不阻止，但标记）
      for (const [, comps] of state.entities) {
        const military = comps.MilitaryC as MilitaryC | undefined;
        const economic = comps.EconomicC as EconomicC | undefined;
        if ((military?.techLevel ?? 0) >= 4 && (economic?.gold ?? 0) > 300) {
          return {
            level: "warn",
            reason: "技术—财富正反馈过强，需制衡。",
          };
        }
      }
      return ok;
    },
  },
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
        if ((military?.troops ?? 0) > 120 && (military?.morale ?? 100) < 40) {
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
    id: "cultural_entropy_delayed",
    kind: "delayed",
    participants: [],
    variables: ["CulturalC.prestige", "EntropyC.entropy"],
    description: "文化繁荣→数回合后文明熵跃升（延迟反馈，历史感核心来源）",
    constraint: (_graph: CausalGraph, state: World): Verdict => {
      for (const [entity, comps] of state.entities) {
        const cultural = comps.CulturalC as CulturalC | undefined;
        const entropy = comps.EntropyC as EntropyC | undefined;
        // 威望极高但熵未跟上 → 提示延迟反馈即将触发
        if ((cultural?.prestige ?? 0) > 80 && (entropy?.entropy ?? 0) < 40) {
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
