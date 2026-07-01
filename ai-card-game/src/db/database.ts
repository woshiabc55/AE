import { openDB, type IDBPDatabase } from "idb";

const DB_NAME = "chronicle-card-game";
const DB_VERSION = 1;

export interface ChronicleDBSchema {
  events: {
    key: string;
    value: import("@/types").GameEvent;
    indexes: {
      "by-turn": number;
      "by-era": string;
      "by-source": string;
      "by-causedBy": string;
    };
  };
  snapshots: {
    key: number;
    value: { turn: number; world: import("@/types").WorldSnapshot; ts: number };
  };
  causalGraph: {
    key: string;
    value: { version: string; data: string };
  };
  saves: {
    key: string;
    value: import("@/types").WorldSnapshot & { saveId: string; factionName: string };
  };
  cards: {
    key: string;
    value: import("@/types").CardTemplate;
  };
  aiCache: {
    key: string;
    value: { data: unknown; trace: import("@/types").AITrace; ts: number };
  };
}

let dbPromise: Promise<IDBPDatabase<ChronicleDBSchema>> | null = null;

export function getDB(): Promise<IDBPDatabase<ChronicleDBSchema>> {
  if (!dbPromise) {
    dbPromise = openDB<ChronicleDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        const events = db.createObjectStore("events", { keyPath: "id" });
        events.createIndex("by-turn", "turn");
        events.createIndex("by-era", "era");
        events.createIndex("by-source", "source");
        events.createIndex("by-causedBy", "causedBy");

        db.createObjectStore("snapshots", { keyPath: "turn" });
        db.createObjectStore("causalGraph", { keyPath: "version" });
        db.createObjectStore("saves", { keyPath: "saveId" });
        db.createObjectStore("cards", { keyPath: "id" });
        db.createObjectStore("aiCache", { keyPath: "key" });
      },
    });
  }
  return dbPromise;
}
