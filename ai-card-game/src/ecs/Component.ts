import type { Component, ComponentName, ComponentDelta } from "@/types";

/**
 * 组件（Component）= 数据。
 * 系统按组件类型查询，新增系统（如"瘟疫系统"）零侵入。
 */

/**
 * 应用结构化增量到组件（不可变更新）。
 * 语义：数值字段做加法（增量），其余（数组/对象/字符串）做替换。
 * 这使 systems 可直接写 `gold: -10` 表示扣除、`troops: 5` 表示增加，
 * 而数组如 `cards: newCards` 表示整体替换。
 */
export function applyPatch<C extends Component>(
  component: C | undefined,
  patch: Record<string, unknown>
): C {
  if (!component) {
    return patch as unknown as C;
  }
  const result: Record<string, unknown> = { ...component };
  for (const [key, value] of Object.entries(patch)) {
    const existing = (component as unknown as Record<string, unknown>)[key];
    if (typeof existing === "number" && typeof value === "number") {
      result[key] = existing + value; // 数值增量
    } else {
      result[key] = value; // 替换
    }
  }
  return result as C;
}

/** 将一组 ComponentDelta 转为可读摘要 */
export function describeDelta(delta: ComponentDelta): string {
  return `${delta.entity}.${delta.component}: ${JSON.stringify(delta.patch)}`;
}

// 重新导出类型便于使用
export type { Component, ComponentName, ComponentDelta };
