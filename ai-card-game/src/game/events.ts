import type {
  World,
  EntityId,
  ComponentDelta,
  EventType,
  Era,
  Contingency,
} from "@/types";
import { getComponent } from "@/ecs/World";
import type { MilitaryC, EconomicC, CulturalC, FactionC } from "@/types";
import { TRAIT_BY_NAME } from "@/game/economy";

/**
 * 历史事件库 — 带真实触发条件的历史转折点。
 *
 * 考究：原兜底事件为随机泛化（TECH/FAMINE/REBELLION），无历史质感。
 *   现按中国历史脉络编排 10 个标志性事件，每个带：
 *   - 历史依据（史料/年份）
 *   - 触发条件（时代 + 势力状态）
 *   - 真实效果（贴合史实的数值变化）
 *
 * 事件类型：
 *   时代专属：商鞅变法/胡服骑射/长平之战/合纵连横（变法纪元）
 *             焚书坑儒/科举创立/丝路开通（帝国纪元）
 *             海禁闭关（变革纪元）
 *   跨时代：井田瓦解（封建→变法过渡）、百家争鸣（变法纪元文化派）
 */

export interface HistoricalEvent {
  id: string;
  name: string;
  description: string;
  historicalRef: string;
  type: EventType;
  /** 事件所属时代（"any" 表示跨时代） */
  era: Era | "any";
  /** 触发条件：基于世界状态判断 */
  condition: (world: World, entity: EntityId) => boolean;
  /** 事件效果（作用于触发实体） */
  deltas: (entity: EntityId) => ComponentDelta[];
  /** 触发概率 */
  probability: number;
  /** 是否作用于所有满足条件的实体（默认 false=仅首个匹配） */
  broadcast?: boolean;
}

/** 势力特质查找辅助 */
function factionTrait(world: World, entity: EntityId): string | undefined {
  const faction = getComponent<FactionC>(world, entity, "FactionC");
  if (!faction) return undefined;
  return TRAIT_BY_NAME.get(faction.name);
}

export const HISTORICAL_EVENTS: HistoricalEvent[] = [
  // ===== 封建纪元 =====
  {
    id: "well_field_collapse",
    name: "井田瓦解",
    description: "私田日多，井田之制名存实亡，赋役之法亟待更张。",
    historicalRef: "春秋以降，铁器牛耕普及，私田开垦，井田制瓦解，'初税亩'应运而生（前594）。",
    type: "ENTROPY_SHIFT",
    era: "ancient",
    condition: (world, entity) => {
      const economic = getComponent<EconomicC>(world, entity, "EconomicC");
      // 粮食积累到一定程度，象征生产力发展突破旧制
      return world.turn >= 4 && (economic?.food ?? 0) > 100;
    },
    deltas: (entity) => [
      { entity, component: "EconomicC", patch: { gold: 15 } },
      { entity, component: "EntropyC", patch: { entropy: 6 } },
      { entity, component: "MilitaryC", patch: { morale: -5 } },
    ],
    probability: 0.35,
    broadcast: true,
  },

  // ===== 变法纪元 =====
  {
    id: "shang_yang_reform_event",
    name: "商鞅变法",
    description: "废井田、开阡陌，行军功爵，耕战立国。法度森严而士人怨。",
    historicalRef: "前356 商鞅变法，废井田、奖耕战、行军功爵。秦由此富强，然法严酷，文化薄弱。",
    type: "RULE_INJECTED",
    era: "classical",
    condition: (world, entity) => {
      const trait = factionTrait(world, entity);
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      // 农耕型势力且威望偏低 → 法家变法以富强代文化
      return trait === "agrarian" && (cultural?.prestige ?? 0) < 30;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: 10, morale: 8, techLevel: 1 } },
      { entity, component: "EconomicC", patch: { gold: 20 } },
      { entity, component: "CulturalC", patch: { prestige: -8 } },
    ],
    probability: 0.4,
  },
  {
    id: "cavalry_reform_event",
    name: "胡服骑射",
    description: "变衣冠、习骑射，骑兵取代车阵，军制为之一变。",
    historicalRef: "赵武灵王前307 改革，易胡服、习骑射，赵骑冠绝北疆。",
    type: "TECH_BREAKTHROUGH",
    era: "classical",
    condition: (world, entity) => {
      const trait = factionTrait(world, entity);
      return trait === "militarist";
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: 12, morale: 10, techLevel: 1 } },
    ],
    probability: 0.35,
  },
  {
    id: "changping_battle_event",
    name: "长平之战",
    description: "秦赵决战长平，白起坑赵卒四十万。赵元气大伤，秦独强。",
    historicalRef: "前260 长平之战，赵括纸上谈兵，白起坑赵卒四十万，赵自此衰。",
    type: "BATTLE_RESOLVED",
    era: "classical",
    condition: (world) => {
      // 两强并立且回合足够深 → 决战条件成熟
      if (world.turn < 4) return false;
      const strongFactions = Array.from(world.entities.entries()).filter(([, comps]) => {
        const m = comps.MilitaryC as MilitaryC | undefined;
        return (m?.troops ?? 0) > 70;
      });
      return strongFactions.length >= 2;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: -25, morale: -15 } },
      { entity, component: "EconomicC", patch: { gold: -20, food: -15 } },
    ],
    probability: 0.3,
    broadcast: true,
  },
  {
    id: "hezong_lianhe_event",
    name: "合纵连横",
    description: "苏秦合纵、张仪连横，纵横家以舌辩搅动天下。",
    historicalRef: "战国纵横家游说列国，'纵成则楚王，横成则秦帝'。",
    type: "ALLIANCE_FORMED",
    era: "classical",
    condition: (world) => {
      // 存在一家独大 → 弱者合纵抗衡
      const dominant = Array.from(world.entities.entries()).filter(([, comps]) => {
        const m = comps.MilitaryC as MilitaryC | undefined;
        return (m?.troops ?? 0) > 100;
      });
      return dominant.length >= 1;
    },
    deltas: (entity) => [
      { entity, component: "CulturalC", patch: { prestige: 10 } },
      { entity, component: "EconomicC", patch: { gold: 10 } },
    ],
    probability: 0.3,
    broadcast: true,
  },
  {
    id: "hundred_schools",
    name: "百家争鸣",
    description: "诸子并起，稷下论道，思想之盛冠于千古。",
    historicalRef: "轴心时代，儒墨道法诸子并起，稷下学宫为学术中心。",
    type: "ENTROPY_SHIFT",
    era: "classical",
    condition: (world, entity) => {
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      return (cultural?.prestige ?? 0) > 50;
    },
    deltas: (entity) => [
      { entity, component: "CulturalC", patch: { prestige: 15 } },
      { entity, component: "EntropyC", patch: { entropy: 8 } },
    ],
    probability: 0.3,
    broadcast: true,
  },

  // ===== 帝国纪元 =====
  {
    id: "book_burning_event",
    name: "焚书坑儒",
    description: "钳制思想以固一统，文化重创而集权强化。",
    historicalRef: "秦始皇焚书坑儒，'偶语诗书者弃市'，思想归于一律。",
    type: "RULE_INJECTED",
    era: "medieval",
    condition: (world) => world.turn >= 2,
    deltas: (entity) => [
      { entity, component: "CulturalC", patch: { prestige: -25 } },
      { entity, component: "EntropyC", patch: { entropy: 12 } },
      { entity, component: "MilitaryC", patch: { morale: 5 } },
    ],
    probability: 0.25,
    broadcast: true,
  },
  {
    id: "imperial_exam_event",
    name: "科举取士",
    description: "开科取士，'朝为田舍郎，暮登天子堂'，打破门阀垄断。",
    historicalRef: "隋唐立科举，知识官僚制成熟，社会流动通道打开。",
    type: "RULE_INJECTED",
    era: "medieval",
    condition: (world, entity) => {
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      return (cultural?.prestige ?? 0) > 40;
    },
    deltas: (entity) => [
      { entity, component: "CulturalC", patch: { prestige: 20 } },
      { entity, component: "EntropyC", patch: { entropy: 8 } },
    ],
    probability: 0.3,
    broadcast: true,
  },
  {
    id: "silk_road_open",
    name: "丝路开通",
    description: "张骞凿空，驼铃连通东西，商贸文化双交流。",
    historicalRef: "汉武通西域，张骞凿空，丝路贯通东西。",
    type: "TECH_BREAKTHROUGH",
    era: "medieval",
    condition: (world, entity) => {
      const economic = getComponent<EconomicC>(world, entity, "EconomicC");
      const trait = factionTrait(world, entity);
      // 商贸型或财富充裕者 → 开辟商道
      return trait === "mercantile" || (economic?.gold ?? 0) > 150;
    },
    deltas: (entity) => [
      { entity, component: "EconomicC", patch: { gold: 40 } },
      { entity, component: "CulturalC", patch: { prestige: 10 } },
    ],
    probability: 0.3,
  },

  // ===== 变革纪元 =====
  {
    id: "maritime_ban_event",
    name: "海禁闭关",
    description: "片板不许下海，短期维稳而长远闭塞。",
    historicalRef: "明清海禁与闭关锁国，'寸板不许下海'。",
    type: "RULE_INJECTED",
    era: "modern",
    condition: (world, entity) => {
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      return (cultural?.prestige ?? 0) > 50;
    },
    deltas: (entity) => [
      { entity, component: "EconomicC", patch: { gold: -25 } },
      { entity, component: "CulturalC", patch: { prestige: 12 } },
    ],
    probability: 0.25,
    broadcast: true,
  },
  {
    id: "jingke_assassination",
    name: "荆轲刺秦",
    description: "图穷匕见，荆轲献督亢之图。事败而秦王震怒，加速灭燕。",
    historicalRef: "前227 荆轲刺秦王，'风萧萧兮易水寒'。事败，秦遂攻燕。",
    type: "BATTLE_RESOLVED",
    era: "classical",
    condition: (world) => {
      // 存在一家独大的霸主 → 弱者铤而走险行刺
      const dominant = Array.from(world.entities.entries()).filter(([, comps]) => {
        const m = comps.MilitaryC as MilitaryC | undefined;
        return (m?.troops ?? 0) > 110;
      });
      return dominant.length >= 1 && world.turn >= 6;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { morale: -8 } },
      { entity, component: "CulturalC", patch: { prestige: 8 } },
    ],
    probability: 0.3,
    broadcast: true,
  },
  {
    id: "chu_han_contention",
    name: "楚汉相争",
    description: "秦鹿已失，天下共逐。楚汉对峙，成王败寇在此一举。",
    historicalRef: "秦亡后楚汉相争（前206-202），垓下一战，项羽自刎，汉立。",
    type: "BATTLE_RESOLVED",
    era: "medieval",
    condition: (world) => {
      // 帝国纪元初，两强并立 → 争霸
      if (world.turn < 2) return false;
      const strong = Array.from(world.entities.entries()).filter(([, comps]) => {
        const m = comps.MilitaryC as MilitaryC | undefined;
        return (m?.troops ?? 0) > 75;
      });
      return strong.length >= 2;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: -20, morale: -10 } },
      { entity, component: "EconomicC", patch: { food: -15 } },
    ],
    probability: 0.3,
    broadcast: true,
  },
  {
    id: "lushan_rebellion",
    name: "安史之乱",
    description: "渔阳鼙鼓动地来，惊破霓裳羽衣曲。盛唐由盛转衰。",
    historicalRef: "唐天宝十四载（755）安禄山起兵，'渔阳鼙鼓动地来'，唐由盛转衰。",
    type: "REBELLION",
    era: "medieval",
    condition: (world, entity) => {
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      // 威望极盛而内部腐化 → 边将拥兵叛乱
      return (cultural?.prestige ?? 0) > 80;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: -18, morale: -12 } },
      { entity, component: "EconomicC", patch: { gold: -30, food: -20 } },
      { entity, component: "CulturalC", patch: { prestige: -15 } },
      { entity, component: "EntropyC", patch: { entropy: 10 } },
    ],
    probability: 0.25,
    broadcast: true,
  },
  {
    id: "jingkang_humiliation",
    name: "靖康之耻",
    description: "金兵南下，二帝北狩。中原衣冠南渡，半壁江山沦丧。",
    historicalRef: "靖康二年（1127）金破汴京，徽钦二帝北狩，宋室南渡。",
    type: "BATTLE_RESOLVED",
    era: "modern",
    condition: (world, entity) => {
      const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
      const cultural = getComponent<CulturalC>(world, entity, "CulturalC");
      // 武备松弛而文化鼎盛 → 外患骤至
      return (military?.morale ?? 0) < 45 && (cultural?.prestige ?? 0) > 60;
    },
    deltas: (entity) => [
      { entity, component: "MilitaryC", patch: { troops: -25, morale: -15 } },
      { entity, component: "EconomicC", patch: { gold: -40, food: -25 } },
      { entity, component: "CulturalC", patch: { prestige: -10 } },
    ],
    probability: 0.2,
    broadcast: true,
  },
  {
    id: "zheng_he_voyage",
    name: "郑和下西洋",
    description: "宝船九桅，远涉重洋，万国来朝而靡费巨万。",
    historicalRef: "明永乐至宣德间（1405-1433）郑和七下西洋，耀兵异域，示中国富强。",
    type: "TECH_BREAKTHROUGH",
    era: "modern",
    condition: (world, entity) => {
      const economic = getComponent<EconomicC>(world, entity, "EconomicC");
      const military = getComponent<MilitaryC>(world, entity, "MilitaryC");
      // 国富兵强 → 远洋宣威
      return (economic?.gold ?? 0) > 200 && (military?.techLevel ?? 0) >= 3;
    },
    deltas: (entity) => [
      { entity, component: "CulturalC", patch: { prestige: 25 } },
      { entity, component: "EconomicC", patch: { gold: -30 } },
      { entity, component: "EntropyC", patch: { entropy: 6 } },
    ],
    probability: 0.25,
  },
];

/**
 * 选择本回合可触发的历史事件。
 * 按条件筛选，保留概率，随机选取（受 RNG 种子控制以保证可复现）。
 */
export function selectHistoricalEvents(
  world: World,
  rng: () => number,
  maxCount = 2
): Contingency[] {
  const eligible: HistoricalEvent[] = [];

  for (const event of HISTORICAL_EVENTS) {
    // 时代过滤
    if (event.era !== "any" && event.era !== world.era) continue;

    // 条件判定
    if (event.broadcast) {
      // 广播事件：只要有任一实体满足即纳入
      const anyMatch = Array.from(world.entities.keys()).some((e) =>
        event.condition(world, e)
      );
      if (anyMatch) eligible.push(event);
    } else {
      // 单体事件：取首个满足的实体
      for (const entity of world.entities.keys()) {
        if (event.condition(world, entity)) {
          eligible.push({ ...event, _target: entity } as HistoricalEvent & {
            _target: EntityId;
          });
          break;
        }
      }
    }
  }

  // 概率过滤 + 随机选取
  const triggered = eligible.filter((e) => rng() < e.probability);
  // 限制每回合事件数，避免信息过载
  const selected = triggered.slice(0, maxCount);

  return selected.map((e) => {
    const target =
      (e as HistoricalEvent & { _target?: EntityId })._target ??
      Array.from(world.entities.keys())[0];
    return {
      id: `hist_${e.id}_${world.turn}`,
      description: `${e.name}：${e.description}`,
      type: e.type,
      deltas: e.deltas(target),
      probability: 1, // 已通过概率过滤
    };
  });
}
