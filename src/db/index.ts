import Dexie, { type Table } from "dexie";
import type {
  TemplateRecord,
  VersionRecord,
  CallLogRecord,
  FavoriteRecord,
} from "@/types";

export class LumiereDB extends Dexie {
  templates!: Table<TemplateRecord, string>;
  versions!: Table<VersionRecord, string>;
  callLogs!: Table<CallLogRecord, string>;
  favorites!: Table<FavoriteRecord, string>;

  constructor() {
    super("lumiere-db");
    this.version(1).stores({
      templates: "id, slug, genre, beatModel, isPublic, updatedAt, usageCount",
      versions: "id, templateId, versionNo, createdAt",
      callLogs: "id, templateId, createdAt",
      favorites: "id, templateId, createdAt",
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
  ]);
}
