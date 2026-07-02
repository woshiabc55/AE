// 干员职业定义：突击 / 侦察 / 支援

export type OperatorClass = "assault" | "recon" | "support";
export type Team = "alpha" | "bravo"; // alpha=友军(蓝) bravo=敌军(红)
export type WeaponType = "ar" | "dmr" | "lmg"; // 突击步枪 / 战术步枪 / 轻机枪

export interface OperatorDef {
  id: OperatorClass;
  name: string;
  role: string;
  maxHp: number;
  armor: number; // 0~1 减伤
  speed: number; // 移动速度
  magSize: number; // 弹匣
  reserveAmmo: number; // 备弹
  fireDelay: number; // 射击间隔(秒)
  damage: number; // 单发伤害
  spread: number; // AI 命中精度(0~1, 越高越准)
  color: string; // 阵营/职业强调色(CSS)
  desc: string;

  // —— 枪械设计 ——
  weaponName: string;
  weaponType: WeaponType;
  baseSpread: number; // 静止腰射首发散布(弧度)
  bloom: number; // 每发增加散布(弧度)
  bloomMax: number; // 最大散布(弧度)
  bloomRecover: number; // 散布恢复速率(弧度/秒)
  recoil: number; // 每发枪口上抬(弧度)
  recoilRecover: number; // 后坐力恢复速率(弧度/秒)
  adsFov: number; // 瞄准视野
  adsSpreadMult: number; // 瞄准时散布倍率
  moveSpreadMult: number; // 移动时散布倍率
  headMult: number; // 爆头伤害倍率
  range: number; // 有效射程(米，伤害衰减起点)
}

export const OPERATORS: Record<OperatorClass, OperatorDef> = {
  assault: {
    id: "assault",
    name: "突击兵",
    role: "ASSAULT",
    maxHp: 100,
    armor: 0.25,
    speed: 4.6,
    magSize: 30,
    reserveAmmo: 120,
    fireDelay: 0.11,
    damage: 22,
    spread: 0.78,
    color: "#4fd6c2",
    desc: "均衡型，中距稳定输出，适合大多数交战场景。",
    weaponName: "VK-12 突击步枪",
    weaponType: "ar",
    baseSpread: 0.010,
    bloom: 0.0045,
    bloomMax: 0.065,
    bloomRecover: 0.20,
    recoil: 0.0060,
    recoilRecover: 0.10,
    adsFov: 55,
    adsSpreadMult: 0.30,
    moveSpreadMult: 2.0,
    headMult: 2.0,
    range: 55,
  },
  recon: {
    id: "recon",
    name: "侦察兵",
    role: "RECON",
    maxHp: 80,
    armor: 0.12,
    speed: 5.4,
    magSize: 20,
    reserveAmmo: 90,
    fireDelay: 0.16,
    damage: 34,
    spread: 0.9,
    color: "#3a8cff",
    desc: "高机动、高单发伤害，血量较低，侧翼穿插利器。",
    weaponName: "SR-7 战术步枪",
    weaponType: "dmr",
    baseSpread: 0.005,
    bloom: 0.0020,
    bloomMax: 0.030,
    bloomRecover: 0.13,
    recoil: 0.0120,
    recoilRecover: 0.07,
    adsFov: 40,
    adsSpreadMult: 0.18,
    moveSpreadMult: 3.0,
    headMult: 2.5,
    range: 72,
  },
  support: {
    id: "support",
    name: "支援兵",
    role: "SUPPORT",
    maxHp: 120,
    armor: 0.38,
    speed: 3.9,
    magSize: 50,
    reserveAmmo: 200,
    fireDelay: 0.09,
    damage: 16,
    spread: 0.66,
    color: "#ff8a3d",
    desc: "高血量厚甲、火力压制，机动最慢，担任前线据点。",
    weaponName: "MG-X 轻机枪",
    weaponType: "lmg",
    baseSpread: 0.020,
    bloom: 0.0070,
    bloomMax: 0.095,
    bloomRecover: 0.24,
    recoil: 0.0050,
    recoilRecover: 0.12,
    adsFov: 62,
    adsSpreadMult: 0.45,
    moveSpreadMult: 2.8,
    headMult: 1.5,
    range: 45,
  },
};

export const OPERATOR_LIST = Object.values(OPERATORS);
