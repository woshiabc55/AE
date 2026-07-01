import type {
  FactionC,
  MilitaryC,
  EconomicC,
  CulturalC,
  EntropyC,
  HandC,
} from "@/types";

export interface FactionTemplate {
  id: string;
  name: string;
  color: string;
  title: string;
  description: string;
  /** 历史依据（真实性考究） */
  historicalRef: string;
  /** 势力特色机制标识（供反馈回路/事件触发判定） */
  trait: "militarist" | "mercantile" | "cultural" | "agrarian";
  components: {
    FactionC: FactionC;
    MilitaryC: MilitaryC;
    EconomicC: EconomicC;
    CulturalC: CulturalC;
    EntropyC: EntropyC;
    HandC: HandC;
  };
}

/**
 * 可选势力模板 — 基于战国末期（约前260-221）实力排序校准。
 *
 * 考究依据（《史记》《战国策》）：
 *   秦 > 赵 > 齐 > 楚
 *   - 秦：商鞅变法（前356）后耕战立国，锐士最强，军功爵激发战意；法家压制思想，文化偏弱。
 *   - 赵：胡服骑射（前307）后骑兵冠绝，李牧守边；代地贫瘠农桑不足；长平之战（前260）元气大伤。
 *   - 齐：鱼盐之利甲天下，稷下学宫文化盛；然齐军素称怯战，前284 燕破齐后一蹶不振。
 *   - 楚：地广五千里，人口众多，楚辞巫风文化灿然；贵族分权组织松散，屡败于秦。
 *
 * 数值校准原则：
 *   troops/morale 反映军事实力排序；gold/food 反映经济结构；prestige 反映文化；
 *   techLevel 反映冶铸/制度水平；entropy 反映文明复杂度积累。
 */
export const FACTION_TEMPLATES: FactionTemplate[] = [
  {
    id: "qin",
    name: "秦",
    color: "#4A4A4A",
    title: "虎狼之国",
    description: "耕战立国，法度森严，东出函谷而有吞并天下之志。",
    historicalRef:
      "商鞅变法后行耕战、军功爵，锐士冠绝七国。法家压制思想，文化相对薄弱，故 prestige 偏低。",
    trait: "agrarian",
    components: {
      FactionC: { name: "秦", color: "#4A4A4A", isPlayer: false },
      MilitaryC: { troops: 95, morale: 85, techLevel: 3 },
      EconomicC: { gold: 90, food: 75, tradeRoutes: ["渭水商道"] },
      CulturalC: { prestige: 15, ideas: ["商鞅变法", "军功爵制"] },
      EntropyC: { entropy: 28 },
      HandC: { cards: ["iron_sword", "shang_yang_reform"] },
    },
  },
  {
    id: "zhao",
    name: "赵",
    color: "#8B2E1F",
    title: "胡服骑射",
    description: "骑兵雄劲，民风剽悍，然代地贫瘠，农桑不足为继。",
    historicalRef:
      "武灵王胡服骑射（前307）改革军制，骑兵冠绝。李牧守北疆抗匈奴。然代地苦寒，粮草常窘。",
    trait: "militarist",
    components: {
      FactionC: { name: "赵", color: "#8B2E1F", isPlayer: false },
      MilitaryC: { troops: 85, morale: 80, techLevel: 3 },
      EconomicC: { gold: 100, food: 50, tradeRoutes: ["代地商道"] },
      CulturalC: { prestige: 35, ideas: ["胡服骑射", "北疆防线"] },
      EntropyC: { entropy: 24 },
      HandC: { cards: ["iron_sword", "clan_gathering"] },
    },
  },
  {
    id: "qi",
    name: "齐",
    color: "#3E5C4D",
    title: "海王之国",
    description: "鱼盐之利甲天下，稷下学宫冠于列邦，然军力素称怯弱。",
    historicalRef:
      "齐据东海，鱼盐之利富甲天下；稷下学宫聚天下学者。然齐军怯战，前284 燕将乐毅破齐，七十余城下。",
    trait: "mercantile",
    components: {
      FactionC: { name: "齐", color: "#3E5C4D", isPlayer: false },
      MilitaryC: { troops: 55, morale: 50, techLevel: 2 },
      EconomicC: { gold: 230, food: 95, tradeRoutes: ["东海盐道", "临淄商埠"] },
      CulturalC: { prestige: 65, ideas: ["稷下学宫", "管子轻重"] },
      EntropyC: { entropy: 26 },
      HandC: { cards: ["trade_caravan", "harvest_rite"] },
    },
  },
  {
    id: "chu",
    name: "楚",
    color: "#C9A24B",
    title: "南方雄邦",
    description: "地广五千里，人众百万，楚辞巫风灿然，然贵族分权，组织松散。",
    historicalRef:
      "楚疆域最广，人口最多，楚辞、巫觋文化鼎盛。然贵族世袭分权，吴起变法半途而废，屡败于秦。",
    trait: "cultural",
    components: {
      FactionC: { name: "楚", color: "#C9A24B", isPlayer: false },
      MilitaryC: { troops: 75, morale: 65, techLevel: 2 },
      EconomicC: { gold: 110, food: 85, tradeRoutes: ["汉水通道", "云梦泽利"] },
      CulturalC: { prestige: 70, ideas: ["楚辞", "巫觋文化", "吴起变法"] },
      EntropyC: { entropy: 22 },
      HandC: { cards: ["harvest_rite", "bronze_rite_vessel"] },
    },
  },
];

/** 势力间初始关系（-100 敌对 ~ 100 友好，依据战国合纵连横史） */
export const INITIAL_RELATIONS: Record<string, Record<string, number>> = {
  qin: { zhao: -70, qi: -40, chu: -60 }, // 秦为众矢之的
  zhao: { qin: -75, qi: 20, chu: 10 }, // 赵抗秦主力，与齐友善
  qi: { qin: -30, zhao: 25, chu: 15 }, // 齐远离秦，与赵友善
  chu: { qin: -65, zhao: 15, qi: 10 }, // 楚屡败于秦，恨秦
};

/** NPC 模板（对话博弈方）— 各势力代表性谋士，考究其历史事迹 */
export const NPC_TEMPLATES = [
  {
    id: "npc_fanju",
    persona: {
      name: "范雎",
      title: "秦国客卿",
      description: "深谋远虑的纵横家，主张远交近攻，前270 年入秦献策。",
      archetype: "谋士",
    },
    faction: "qin",
    goals: [
      { id: "g1", description: "促成秦王采纳远交近攻之策", priority: 5 },
      { id: "g2", description: "削弱政敌魏冉在国内的影响", priority: 3 },
      { id: "g3", description: "报昔日魏国中大夫魏齐折辱之仇", priority: 4 },
    ],
    secrets: [
      {
        id: "s1",
        content: "范雎化名张禄入秦，旧日仇家魏齐仍在中原寻其踪迹。",
        revealedTo: [],
      },
    ],
  },
  {
    id: "npc_linxiangru",
    persona: {
      name: "蔺相如",
      title: "赵国上卿",
      description: "完璧归赵、渑池之会的智勇之士，主和抗秦。",
      archetype: "国相",
    },
    faction: "zhao",
    goals: [
      { id: "g1", description: "维系赵秦脆弱的平衡，避免过早决战", priority: 5 },
      { id: "g2", description: "调和国相与廉颇老将的将相和", priority: 4 },
    ],
    secrets: [
      {
        id: "s1",
        content: "赵国朝堂暗有主和主战两派之争，廉颇老而弥坚但颇自矜。",
        revealedTo: [],
      },
    ],
  },
  {
    id: "npc_zouyan",
    persona: {
      name: "邹衍",
      title: "稷下先生",
      description: "齐地阴阳家，谈天衍，主五德终始，游历列国。",
      archetype: "学士",
    },
    faction: "qi",
    goals: [
      { id: "g1", description: "游说诸侯采纳五德终始之说，论证天命转移", priority: 4 },
      { id: "g2", description: "维系稷下学宫的学术自由", priority: 5 },
    ],
    secrets: [
      {
        id: "s1",
        content: "邹衍观星象，私以为齐之气数已现颓势，然不敢明言。",
        revealedTo: [],
      },
    ],
  },
  {
    id: "npc_lisi",
    persona: {
      name: "李斯",
      title: "秦国廷尉",
      description: "师从荀子，佐秦王并天下，主法术势，定郡县之制。",
      archetype: "谋士",
    },
    faction: "qin",
    goals: [
      { id: "g1", description: "辅佐秦王统一六国，废分封而行郡县", priority: 5 },
      { id: "g2", description: "推行书同文、车同轨，确立法家一统之制", priority: 4 },
      { id: "g3", description: "铲除同门韩非，独占帝王之师", priority: 3 },
    ],
    secrets: [
      {
        id: "s1",
        content: "李斯昔为楚之布衣，'诟莫大于卑贱，而悲莫甚于穷困'，故汲汲于功利。",
        revealedTo: [],
      },
      {
        id: "s2",
        content: "韩非入秦，秦王极赏其才，李斯恐失宠，或下谮于狱。",
        revealedTo: [],
      },
    ],
  },
  {
    id: "npc_zhangliang",
    persona: {
      name: "张良",
      title: "帝王之师",
      description: "博浪沙椎秦未遂，后得黄石公传太公兵法，运筹帷幄。",
      archetype: "国相",
    },
    faction: "zhao",
    goals: [
      { id: "g1", description: "为韩复仇，颠覆暴秦之政", priority: 5 },
      { id: "g2", description: "辅佐明主成就帝业，复立韩国社稷", priority: 4 },
      { id: "g3", description: "功成之后隐退从赤松子游", priority: 2 },
    ],
    secrets: [
      {
        id: "s1",
        content: "张良家五世相韩，秦灭韩后散尽家财求刺客，博浪沙之椎即其所谋。",
        revealedTo: [],
      },
    ],
  },
  {
    id: "npc_zhugeliang",
    persona: {
      name: "诸葛亮",
      title: "卧龙先生",
      description: "躬耕南阳，自比管仲乐毅。三顾之恩，隆中定三分之计。",
      archetype: "国相",
    },
    faction: "chu",
    goals: [
      { id: "g1", description: "佐明主成三分鼎足之势，以图兴复", priority: 5 },
      { id: "g2", description: "南抚夷越，结好孙权，北拒曹魏", priority: 4 },
      { id: "g3", description: "鞠躬尽瘁，死而后已", priority: 3 },
    ],
    secrets: [
      {
        id: "s1",
        content: "隆中对已定天下三分之计，然'谋事在人，成事在天'，成败未可知。",
        revealedTo: [],
      },
    ],
  },
] as const;

export type FactionTrait = FactionTemplate["trait"];
