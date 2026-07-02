// 干员职业定义：突击 / 侦察 / 支援

export type OperatorClass = "assault" | "recon" | "support";
export type Team = "alpha" | "bravo"; // alpha=友军(蓝) bravo=敌军(红)

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
  },
};

export const OPERATOR_LIST = Object.values(OPERATORS);
