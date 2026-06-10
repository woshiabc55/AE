import Dexie, { type Table } from "dexie";
import type {
  TemplateRecord,
  VersionRecord,
  CallLogRecord,
  FavoriteRecord,
  CommentRecord,
  RatingRecord,
} from "@/types";

export class LumiereDB extends Dexie {
  templates!: Table<TemplateRecord, string>;
  versions!: Table<VersionRecord, string>;
  callLogs!: Table<CallLogRecord, string>;
  favorites!: Table<FavoriteRecord, string>;
  comments!: Table<CommentRecord, string>;
  ratings!: Table<RatingRecord, string>;

  constructor() {
    super("lumiere-db");
    this.version(1).stores({
      templates: "id, slug, genre, beatModel, isPublic, updatedAt, usageCount",
      versions: "id, templateId, versionNo, createdAt",
      callLogs: "id, templateId, createdAt",
      favorites: "id, templateId, createdAt",
    });
    this.version(2).stores({
      templates: "id, slug, genre, beatModel, isPublic, updatedAt, usageCount",
      versions: "id, templateId, versionNo, createdAt",
      callLogs: "id, templateId, createdAt",
      favorites: "id, templateId, createdAt",
      comments: "id, templateId, fieldKey, createdAt",
      ratings: "id, templateId, createdAt",
    });
  }
}

export const db = new LumiereDB();

export async function clearAll() {
  await Promise.all([
    db.templates.clear(),
    db.versions.clear(),
    db.callLogs.clear(),
    db.favorites.clear(),
    db.comments.clear(),
    db.ratings.clear(),
  ]);
}

// 安全的 IndexedDB 写入，自动捕获 quota 错误
export async function safePut<T>(table: Table<T, any>, value: T): Promise<void> {
  try {
    await table.put(value);
  } catch (e) {
    if ((e as Error).name === "QuotaExceededError") {
      throw new Error("本地存储已满，请前往 Workshop 清理或导出数据。");
    }
    throw e;
  }
}
