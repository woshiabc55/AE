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
  const data = JSON.parse(json) as ArtworkRecord;
  if (!data.id || !data.name || !Array.isArray(data.pixels)) {
    throw new Error("无效的作品文件格式");
  }
  return data;
}
