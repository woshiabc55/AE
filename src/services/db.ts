// IndexedDB 包装服务 - 真实数据库
// 设计要点：Promise 化、schema 版本化、自动迁移、连接复用
// 数据库：PromptStageDB v1

const DB_NAME = 'PromptStageDB';
const DB_VERSION = 1;

// Object Stores（表）
export const STORES = {
  users: 'users',           // 账户
  sessions: 'sessions',     // 登录会话
  templates: 'templates',   // 模板（含种子副本）
  folders: 'folders',       // 文件夹
  favorites: 'favorites',   // 收藏
  drafts: 'drafts',         // 工坊草稿
  editors: 'editors',       // 编辑器草稿
  meta: 'meta',             // 元信息（删除列表、版本等）
} as const;

export type StoreName = typeof STORES[keyof typeof STORES];

// 单例 DB 连接
let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      // 首次创建 / 升级
      if (!db.objectStoreNames.contains(STORES.users)) {
        const s = db.createObjectStore(STORES.users, { keyPath: 'id' });
        s.createIndex('email', 'email', { unique: true });
        s.createIndex('createdAt', 'createdAt');
      }
      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const s = db.createObjectStore(STORES.sessions, { keyPath: 'token' });
        s.createIndex('userId', 'userId');
        s.createIndex('expiresAt', 'expiresAt');
      }
      if (!db.objectStoreNames.contains(STORES.templates)) {
        const s = db.createObjectStore(STORES.templates, { keyPath: 'id' });
        s.createIndex('authorId', 'authorId');
        s.createIndex('category', 'category');
        s.createIndex('folderId', 'folderId');
        s.createIndex('isPublic', 'isPublic');
        s.createIndex('updatedAt', 'updatedAt');
      }
      if (!db.objectStoreNames.contains(STORES.folders)) {
        const s = db.createObjectStore(STORES.folders, { keyPath: 'id' });
        s.createIndex('userId', 'userId');
        s.createIndex('parentId', 'parentId');
      }
      if (!db.objectStoreNames.contains(STORES.favorites)) {
        const s = db.createObjectStore(STORES.favorites, { keyPath: 'id' });
        s.createIndex('userId', 'userId');
        s.createIndex('templateId', 'templateId', { unique: true });
      }
      if (!db.objectStoreNames.contains(STORES.drafts)) {
        db.createObjectStore(STORES.drafts, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.editors)) {
        db.createObjectStore(STORES.editors, { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains(STORES.meta)) {
        db.createObjectStore(STORES.meta, { keyPath: 'key' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
    req.onblocked = () => reject(new Error('IndexedDB blocked by another tab'));
  });
  return dbPromise;
}

// 通用事务包装
async function tx<T>(
  storeNames: StoreName | StoreName[],
  mode: IDBTransactionMode,
  fn: (stores: Record<string, IDBObjectStore>) => Promise<T> | T
): Promise<T> {
  const db = await openDB();
  const names = Array.isArray(storeNames) ? storeNames : [storeNames];
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(names, mode);
    const stores: Record<string, IDBObjectStore> = {};
    names.forEach((n) => {
      stores[n] = transaction.objectStore(n);
    });
    let result: T;
    let asyncReturned = false;
    Promise.resolve(fn(stores))
      .then((r) => {
        result = r;
        asyncReturned = true;
      })
      .catch(reject);
    transaction.oncomplete = () => {
      if (asyncReturned) resolve(result);
    };
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

// Promise 化 request
function req<T>(r: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

// ============================================================
// 通用 CRUD
// ============================================================
export const db = {
  async get<T>(store: StoreName, key: IDBValidKey): Promise<T | undefined> {
    return tx(store, 'readonly', (s) => req<T | undefined>(s[store].get(key)));
  },

  async getAll<T>(store: StoreName): Promise<T[]> {
    return tx(store, 'readonly', (s) => req<T[]>(s[store].getAll()));
  },

  async getByIndex<T>(store: StoreName, indexName: string, value: IDBValidKey): Promise<T | undefined> {
    return tx(store, 'readonly', (s) => req<T | undefined>(s[store].index(indexName).get(value)));
  },

  async getAllByIndex<T>(store: StoreName, indexName: string, value: IDBValidKey): Promise<T[]> {
    return tx(store, 'readonly', (s) => req<T[]>(s[store].index(indexName).getAll(value)));
  },

  async put<T>(store: StoreName, value: T): Promise<void> {
    await tx(store, 'readwrite', (s) => req(s[store].put(value as any)));
  },

  async putMany<T>(store: StoreName, values: T[]): Promise<void> {
    await tx(store, 'readwrite', (s) => {
      values.forEach((v) => s[store].put(v as any));
    });
  },

  async delete(store: StoreName, key: IDBValidKey): Promise<void> {
    await tx(store, 'readwrite', (s) => req(s[store].delete(key)));
  },

  async deleteByIndex(store: StoreName, indexName: string, value: IDBValidKey): Promise<void> {
    await tx(store, 'readwrite', (s) => {
      const idx = s[store].index(indexName);
      const req = idx.openCursor(value);
      req.onsuccess = () => {
        const cursor = req.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    });
  },

  async clear(store: StoreName): Promise<void> {
    await tx(store, 'readwrite', (s) => req(s[store].clear()));
  },

  async count(store: StoreName): Promise<number> {
    return tx(store, 'readonly', (s) => req<number>(s[store].count()));
  },

  async transaction<T>(
    storeNames: StoreName | StoreName[],
    mode: IDBTransactionMode,
    fn: (stores: Record<StoreName, IDBObjectStore>) => Promise<T> | T
  ): Promise<T> {
    return tx<T>(storeNames, mode, fn as any);
  },

  // 测试用：清空所有数据
  async dropAll(): Promise<void> {
    const all = Object.values(STORES);
    await tx(all, 'readwrite', (s) => {
      all.forEach((n) => s[n].clear());
    });
  },

  // 调试用：导出所有数据
  async exportAll(): Promise<Record<string, any[]>> {
    const result: Record<string, any[]> = {};
    for (const n of Object.values(STORES)) {
      result[n] = await db.getAll(n);
    }
    return result;
  },
};

// ============================================================
// 健康检查 + 降级
// ============================================================
export async function isDBAvailable(): Promise<boolean> {
  try {
    await openDB();
    return true;
  } catch {
    return false;
  }
}

// IndexedDB 不可用时降级到 localStorage
const LS_PREFIX = 'ps_';
export const lsFallback = {
  get<T>(key: string): T | undefined {
    try {
      const raw = localStorage.getItem(LS_PREFIX + key);
      return raw ? (JSON.parse(raw) as T) : undefined;
    } catch { return undefined; }
  },
  set(key: string, value: unknown) {
    try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(value)); } catch { /* ignore */ }
  },
  delete(key: string) {
    try { localStorage.removeItem(LS_PREFIX + key); } catch { /* ignore */ }
  },
};
