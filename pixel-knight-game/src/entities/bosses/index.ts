// Boss 工厂：根据 BossDef 创建对应 Boss 实例

import type { BossDef } from "@/config";
import { Boss } from "@/entities/Boss";
import { BoneGeneral } from "@/entities/bosses/BoneGeneral";
import { SwampTroll } from "@/entities/bosses/SwampTroll";
import { FrostKnight } from "@/entities/bosses/FrostKnight";
import { NightLord } from "@/entities/bosses/NightLord";

export function createBoss(def: BossDef, startX: number): Boss {
  switch (def.id) {
    case "kael":
      return new BoneGeneral(def, startX);
    case "bilefang":
      return new SwampTroll(def, startX);
    case "veyra":
      return new FrostKnight(def, startX);
    case "morgrim":
      return new NightLord(def, startX);
    default:
      return new BoneGeneral(def, startX);
  }
}
