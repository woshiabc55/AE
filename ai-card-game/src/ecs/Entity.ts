import { nanoid } from "nanoid";
import type { EntityId } from "@/types";

/**
 * 实体（Entity）只是 ID，含义由挂载的组件决定。
 * 组合优于继承：一个实体可以是 Faction + Military + Cultural + Diplomatic 组件的组合。
 */
export function createEntity(prefix = "e"): EntityId {
  return `${prefix}_${nanoid(10)}`;
}
