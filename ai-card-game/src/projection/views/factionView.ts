import type { GameContext as GCtx } from "@/game";
import { queryEntities } from "@/ecs/World";
import type {
  FactionC,
  MilitaryC,
  EconomicC,
  CulturalC,
  EntropyC,
} from "@/types";

export interface FactionView {
  entityId: string;
  name: string;
  color: string;
  title: string;
  isPlayer: boolean;
  troops: number;
  morale: number;
  techLevel: number;
  gold: number;
  food: number;
  prestige: number;
  entropy: number;
}

/** Projection — 势力面板视图 */
export function computeFactionView(ctx: GCtx): FactionView[] {
  const views: FactionView[] = [];
  for (const { entity, component: faction } of queryEntities<FactionC>(
    ctx.world,
    "FactionC"
  )) {
    const military = getComp<MilitaryC>(ctx, entity, "MilitaryC");
    const economic = getComp<EconomicC>(ctx, entity, "EconomicC");
    const cultural = getComp<CulturalC>(ctx, entity, "CulturalC");
    const entropy = getComp<EntropyC>(ctx, entity, "EntropyC");
    views.push({
      entityId: entity,
      name: faction.name,
      color: faction.color,
      title: faction.name === faction.name ? factionTitle(faction) : "",
      isPlayer: faction.isPlayer,
      troops: military?.troops ?? 0,
      morale: military?.morale ?? 0,
      techLevel: military?.techLevel ?? 0,
      gold: economic?.gold ?? 0,
      food: economic?.food ?? 0,
      prestige: cultural?.prestige ?? 0,
      entropy: entropy?.entropy ?? 0,
    });
  }
  return views;
}

function factionTitle(faction: FactionC): string {
  // 简单：用 name 作为 title 兜底（实际可从模板扩展）
  return faction.name;
}

function getComp<C>(ctx: GCtx, entity: string, name: import("@/types").ComponentName): C | undefined {
  return ctx.world.entities.get(entity)?.[name] as C | undefined;
}
