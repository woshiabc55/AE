// IndexedDB 数据库初始化

import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import type { ArtworkRecord } from "@/types";

interface PerlerBeadDB extends DBSchema {
  artworks: {
    key: string;
    value: ArtworkRecord;
    indexes: { "by_updatedAt": number; "by_name": string };
  };
}

const DB_NAME = "PerlerBeadStudio";
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PerlerBeadDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<PerlerBeadDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PerlerBeadDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("artworks")) {
          const store = db.createObjectStore("artworks", { keyPath: "id" });
          store.createIndex("by_updatedAt", "updatedAt");
          store.createIndex("by_name", "name");
        }
      },
    });
  }
  return dbPromise;
}
