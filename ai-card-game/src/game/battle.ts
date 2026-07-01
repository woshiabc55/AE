import type { World, EntityId, ComponentDelta } from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, FactionC } from "@/types";
import { SEASON_WAR_MULT, SEASON_LABELS } from "@/types";

/**
 * 战斗结算系统 — 具体战斗算法。
 *
 * 考究：古代战争非纯兵力堆砌，而是"天时地利人和"的综合。
 *   战力 = 兵力 × 士气系数 × 科技系数 × 季节系数 × 随机扰动
 *
 * 兰彻斯特平方律启发：大兵团作战，兵力优势被放大（兵力^0.8），
 *   但非完全平方律——古代战争指挥受限，线性更贴合。
 */

export interface BattleResult {
  attacker: EntityId;
  defender: EntityId;
  attackerPower: number;
  defenderPower: number;
  attackerLosses: number;
  defenderLosses: number;
  victor: EntityId;
  narrative: string;
  deltas: ComponentDelta[];
}

/** 计算势力战力：兵力 × 士气 × 科技 × 季节 × 随机 */
function computePower(
  world: World,
  entity: EntityId,
  isAttacker: boolean,
  rng: () => number
): { power: number; breakdown: string } {
  const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
  if (!military) return { power: 0, breakdown: "无军队" };

  const faction = getComponent<FactionC>(world, entity, "FactionC");
  const name = faction?.name ?? entity;

  // 1. 兵力基础（线性，指挥受限）
  const base = military.troops;

  // 2. 士气系数：0.5 ~ 1.3
  const moraleFactor = 0.5 + (military.morale / 100) * 0.8;

  // 3. 科技系数：每级 +20%
  const techFactor = 1 + military.techLevel * 0.2;

  // 4. 季节系数
  const seasonFactor = SEASON_WAR_MULT[world.season];

  // 5. 防守方加成（守土之利，城防地利）：+20%
  const defenseBonus = isAttacker ? 1.0 : 1.2;

  // 6. 随机扰动：0.8 ~ 1.2（战场风云莫测）
  const randomFactor = 0.8 + rng() * 0.4;

  const power = Math.floor(
    base * moraleFactor * techFactor * seasonFactor * defenseBonus * randomFactor
  );

  const breakdown = `${name}: ${base}兵 × 士气${moraleFactor.toFixed(2)} × 科技${techFactor.toFixed(1)} × 季节${seasonFactor} × ${isAttacker ? "攻" : "守"}${defenseBonus} × 运${randomFactor.toFixed(2)} = ${power}`;

  return { power, breakdown };
}

/**
 * 结算一场战斗。
 * 攻方发起进攻，守方防守。按战力对比计算伤亡。
 */
export function resolveBattle(
  world: World,
  attacker: EntityId,
  defender: EntityId,
  rng: () => number
): BattleResult {
  const atk = computePower(world, attacker, true, rng);
  const def = computePower(world, defender, false, rng);

  const totalPower = atk.power + def.power;
  // 胜率 = 己方战力 / 总战力
  const atkWinRate = atk.power / totalPower;
  const atkWon = rng() < atkWinRate;

  // 伤亡计算：败方损失 30-50%，胜方损失 15-25%
  const loserLossRate = 0.3 + rng() * 0.2;
  const winnerLossRate = 0.15 + rng() * 0.1;

  const attackerLosses = atkWon
    ? Math.floor(atk.power * winnerLossRate * 0.5) // 胜方按战力折算回兵力
    : Math.floor(atk.power * loserLossRate * 0.5);
  const defenderLosses = atkWon
    ? Math.floor(def.power * loserLossRate * 0.5)
    : Math.floor(def.power * winnerLossRate * 0.5);

  // 士气影响：败方士气大跌，胜方小升
  const atkMoraleDelta = atkWon ? 8 : -15;
  const defMoraleDelta = atkWon ? -18 : 5;

  const atkFaction = getComponent<FactionC>(world, attacker, "FactionC");
  const defFaction = getComponent<FactionC>(world, defender, "FactionC");
  const atkName = atkFaction?.name ?? "攻方";
  const defName = defFaction?.name ?? "守方";
  const seasonLabel = SEASON_LABELS[world.season];

  const narrative = atkWon
    ? `${seasonLabel}季，${atkName}伐${defName}。${atkName}军势如破竹，${defName}折损${defenderLosses}卒，士气大挫。${atkName}亦伤${attackerLosses}卒。`
    : `${seasonLabel}季，${atkName}伐${defName}。${defName}据守而胜，${atkName}折戟${attackerLosses}卒，铩羽而归。${defName}伤${defenderLosses}卒。`;

  const deltas: ComponentDelta[] = [
    {
      entity: attacker,
      component: "MilitaryC",
      patch: { troops: -attackerLosses, morale: atkMoraleDelta },
    },
    {
      entity: defender,
      component: "MilitaryC",
      patch: { troops: -defenderLosses, morale: defMoraleDelta },
    },
  ];

  return {
    attacker,
    defender,
    attackerPower: atk.power,
    defenderPower: def.power,
    attackerLosses,
    defenderLosses,
    victor: atkWon ? attacker : defender,
    narrative,
    deltas,
  };
}
