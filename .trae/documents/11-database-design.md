# 11 · 数据库设计（IndexedDB 真实库）

> 本文档说明「剧幕 PromptStage」从 localStorage 单体迁移到 **IndexedDB** 的真实数据库设计方案，覆盖 Object Store 设计、索引、迁移策略、降级方案与一致性约束。

## 一、为什么从 localStorage 升级到 IndexedDB

| 维度 | localStorage | IndexedDB |
|------|--------------|-----------|
| 容量 | 5–10 MB | 浏览器配额（通常 50% 磁盘） |
| 数据结构 | 字符串 KV | 强类型 Object Store + 索引 |
| 事务 | 无 | ACID 事务，跨 store |
| 查询 | 只能全表 JSON.parse | 主键 / 二级索引 / Cursor |
| 性能 | 同步阻塞 | 异步，不阻塞主线程 |
| 并发 | 单写者 | 读写事务并发 |
| 存储对象 | 字符串 | 结构化对象（Date / ArrayBuffer） |

localStorage 仅适合存一个偏好 / token。真正的多对象关系、索引查询、事务一致性需要 IndexedDB。

## 二、数据库拓扑

- **DB 名**：`PromptStageDB`
- **版本**：`1`
- **位置**：浏览器每个 origin 独立

### Object Store 一览

| Store | keyPath | 索引 | 作用 |
|-------|---------|------|------|
| `users` | `id` | `email`(unique) / `createdAt` | 账户主表，存 passwordHash + salt |
| `sessions` | `token` | `userId` / `expiresAt` | 登录会话，30 天 TTL |
| `templates` | `id` | `authorId` / `category` / `folderId` / `isPublic` / `updatedAt` | 模板主表 |
| `folders` | `id` | `userId` / `parentId` | 文件夹（支持多级） |
| `favorites` | `id` | `userId` / `templateId`(unique) | 收藏 |
| `drafts` | `key` | — | 工坊草稿（按 `key = userId:workshop:tmplId`） |
| `editors` | `key` | — | 编辑器草稿（按 `key = userId:editor:tplId`） |
| `meta` | `key` | — | 元数据（删除列表、迁移标记） |

### 主键设计

- `users.id`：`u_<8字节hex><时间戳>`，例如 `u_a3f1b2c09e7d7c4d`，见 `randomId('u')`
- `sessions.token`：32 字节随机 hex（256 bit 熵），不可预测
- `templates.id`：种子使用稳定 `t_001`–`t_016`；用户新建使用 `t_<random>`
- `folders.id`：默认 `f_default`；用户新建 `f_<random>`
- `favorites.id`：`fav_<random>`，但 `templateId` 上有 unique 索引保证不重复
- `drafts.key` / `editors.key`：复合 key `userId:scope:tmplId`，方便幂等 upsert

## 三、关键索引场景

### 3.1 登录查邮箱

```ts
const u = await db.getByIndex<StoredUser>(STORES.users, 'email', normalizedEmail);
```

- 走 `email` 唯一索引，O(1)
- 失败返回 `undefined`，前端统一抛 `邮箱或密码不正确`（不区分原因以防枚举）

### 3.2 我的剧库

```ts
const folders = await db.getAllByIndex<Folder>(STORES.folders, 'userId', currentUserId);
const tpls = await db.getAllByIndex<Template>(STORES.templates, 'authorId', currentUserId);
```

### 3.3 模板展厅分类

```ts
const viral = await db.getAllByIndex<Template>(STORES.templates, 'category', 'viral');
```

- `category` 是 `'drama' | 'short' | 'viral' | 'ad' | 'custom'`
- 配合 `updatedAt` 索引降序：先 `getAllByIndex` 再 sort

### 3.4 收藏夹

```ts
await db.put(STORES.favorites, { id, userId, templateId, createdAt });
// 重复 put 触发 unique 约束冲突（templateId 上 unique）—— 自然幂等
```

### 3.5 草稿自动保存

```ts
await db.put(STORES.drafts, { key: `${userId}:workshop:${tmplId}`, body, vars, updatedAt });
```

- 复合 key 保证同一用户同一模板只有一份草稿
- upsert 语义，`put` 直接覆盖

## 四、连接管理与事务

### 4.1 单例连接

```ts
let dbPromise: Promise<IDBDatabase> | null = null;
function openDB() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = ...;
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}
```

- 整个 App 共享一个 `IDBDatabase` 实例
- 避免反复 `open` 触发 upgrade 事件

### 4.2 Promise 化事务

```ts
async function tx<T>(storeNames, mode, fn): Promise<T> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const t = db.transaction(storeNames, mode);
    const stores = ...;
    let result, asyncReturned = false;
    Promise.resolve(fn(stores))
      .then(r => { result = r; asyncReturned = true; })
      .catch(reject);
    t.oncomplete = () => asyncReturned && resolve(result);
    t.onerror = () => reject(t.error);
    t.onabort = () => reject(t.error);
  });
}
```

要点：
- 业务函数可以 `async`
- 等业务函数 resolve 后再让事务 `oncomplete` 触发，保证 commit 时数据已写入
- `onerror` + `onabort` 都 reject，避免静默失败

### 4.3 事务边界

| 场景 | 涉及 store | 模式 |
|------|-----------|------|
| 注册并自动登录 | `users` → `sessions` | 先写 user，再开新事务写 session（避免跨 await 跨越事务） |
| 收藏 | `favorites` | 单 store readwrite |
| 删除模板 | `templates` + `favorites`（清理） | 两段事务，最终一致 |
| 迁移 | 多个 store | 逐个独立事务，失败时跳过 |

## 五、降级方案：localStorage 后备

当 `IndexedDB.open` 失败（隐私模式、配额满、文件协议）时，启用 LS 兜底：

```ts
export async function isDBAvailable(): Promise<boolean> { ... }

export const lsFallback = {
  get<T>(key) { ... },     // ps_ 前缀
  set(key, value) { ... },
  delete(key) { ... },
};
```

- 键前缀统一 `ps_`，避免与其它库冲突
- 仍走 JSON 序列化，但只保存必要子集（users / sessions / 当前 token 指针）
- Service 层（`AuthService` / `TemplateService`）内部用 `this.useLS` 切换路径，业务层无感

## 六、迁移策略

### 6.1 旧 → 新（一次性）

`TemplateService.ensureMigrated()` 在首次访问任意模板接口时触发：

1. 把 `SEED_TEMPLATES` 写入 `templates`（id 已存在则跳过）
2. 把 `FOLDERS_SEED` 写入 `folders`
3. 从 `ps_templates_v1` / `ps_folders_v1` / `ps_favorites_v1` 读旧数据，写入新 store
4. 删除旧 LS 键
5. 写 `meta.migrated_v1 = '1'`

下次启动 `ensureMigrated` 命中 `meta` 标记直接返回。

### 6.2 新 → 新（未来升级）

当 `DB_VERSION` 提升：

```ts
req.onupgradeneeded = (e) => {
  const db = e.target.result;
  const oldV = e.oldVersion;
  if (oldV < 1) {
    // 创建 v1 store
  }
  if (oldV < 2) {
    // v2 升级：加索引、迁移数据
    const tx = e.target.transaction;
    const store = tx.objectStore('templates');
    store.createIndex('tags', 'tags', { multiEntry: true });
  }
};
```

- 必须保留所有 `oldV < N` 分支（用户可能从任意老版本跳上来）
- 数据迁移在 upgrade 事务内完成，失败会回滚整次升级

## 七、session token 设计

- **存储位置**：`sessions` store + `localStorage.ps_session_token_v1`（仅 token 字符串，便于跨 tab / SSR 兜底）
- **token 格式**：32 字节随机 hex（256 bit 熵），`crypto.getRandomValues` 生成
- **TTL**：30 天，存于 `expiresAt`
- **跨 tab 同步**：token 存在 LS，监听 `storage` 事件可同步退出登录（v1.1 计划）
- **撤销**：`changePassword` 时 `db.deleteByIndex(STORES.sessions, 'userId', userId)` 强制全设备下线

## 八、密码哈希

详见 [12-auth-security.md](./12-auth-security.md)。摘要：

- 算法：**PBKDF2-SHA256**，100,000 次迭代
- salt：16 字节随机 hex
- 派生 256 bit，hex 存储
- 验证用 `constantTimeEqual` 防时序攻击

## 九、容量与配额管理

- IndexedDB 在 Chrome 默认上限 60% 磁盘
- 当单模板正文 > 50k 字符时给出提示
- 提供 `db.exportAll()` / `db.dropAll()` 调试用接口（开发模式菜单触发）
- 普通用户场景下，整库 < 1MB

## 十、并发与一致性

- IndexedDB 事务自动串行化，无需显式锁
- 跨 store 操作分多个事务，遵循 "先写主，再写从" 顺序
- 不使用 `db.transaction([...], 'readwrite')` 跨 await 多次 await（事务会提前 auto-commit）
- 所有 ID 写入由 `randomId` 生成，碰撞概率 ~ 2^-64，可忽略

## 十一、API 一览

```ts
// db.ts 导出
export const db = {
  get, getAll, getByIndex, getAllByIndex,
  put, putMany, delete, deleteByIndex,
  clear, count,
  transaction,
  dropAll, exportAll,
};

export async function isDBAvailable(): Promise<boolean>;
export const lsFallback = { get, set, delete };
export const STORES = { users, sessions, templates, folders, favorites, drafts, editors, meta };
```

## 十二、未来扩展

- **加密存储**：敏感模板可加 AES-GCM 信封加密（key 派生自 password）
- **服务端同步**：将 `syncStatus` 字段加进 templates / folders，未同步项打标
- **OPFS**：当模板体过大时，把 `body` 存到 Origin Private File System
- **多设备**：token 撤销广播使用 `BroadcastChannel`
