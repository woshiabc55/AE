// 作品数据 CRUD 仓库

import { getDB } from "./database";
import type { ArtworkRecord } from "@/types";

/** 获取所有作品（按更新时间倒序） */
export async function listArtworks(): Promise<ArtworkRecord[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex("artworks", "by_updatedAt");
  return all.reverse();
}

/** 根据 ID 获取作品 */
export async function getArtwork(id: string): Promise<ArtworkRecord | undefined> {
  const db = await getDB();
  return db.get("artworks", id);
}

/** 保存（新增或更新）作品 */
export async function saveArtwork(record: ArtworkRecord): Promise<void> {
  const db = await getDB();
  await db.put("artworks", record);
}

/** 删除作品 */
export async function deleteArtwork(id: string): Promise<void> {
  const db = await getDB();
  await db.delete("artworks", id);
}

/** 导出作品为 JSON 字符串 */
export function exportArtwork(record: ArtworkRecord): string {
  return JSON.stringify(record, null, 2);
}

/** 从 JSON 字符串导入作品 */
export function importArtwork(json: string): ArtworkRecord {
  const data = JSON.parse(json) as Partial<ArtworkRecord>;
  if (!data.id || !data.name || !Array.isArray(data.pixels)) {
    throw new Error("无效的作品文件格式");
  }
  // 补全可选字段，防止旧版/残缺数据导致下游崩溃
  return {
    id: data.id,
    name: data.name,
    gridSize: data.gridSize ?? 24,
    pixels: data.pixels,
    layers: Array.isArray(data.layers) && data.layers.length > 0
      ? data.layers
      : [{ id: crypto.randomUUID(), name: "图层 1", visible: true, locked: false, opacity: 1, pixels: Object.fromEntries(data.pixels.map((c) => [`${c.x},${c.y}`, c.color])) }],
    skeleton:
      data.skeleton && Array.isArray(data.skeleton.joints)
        ? data.skeleton
        : { joints: [], bones: [] },
    keyframes: Array.isArray(data.keyframes) ? data.keyframes : [],
    stretchRegions: Array.isArray(data.stretchRegions) ? data.stretchRegions : [],
    thumbnail: data.thumbnail ?? "",
    createdAt: data.createdAt ?? Date.now(),
    updatedAt: data.updatedAt ?? Date.now(),
  };
}
