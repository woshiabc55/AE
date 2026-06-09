# 12 · 鉴权与安全设计

> 本文档说明「剧幕 PromptStage」的鉴权体系：账户、密码哈希、Session Token、攻击面与防御、隐私边界、未来规划。

## 一、目标与原则

- **零明文存储**：浏览器内不存在任何明文密码 / 密码哈希的明文对照
- **抗彩虹表**：每个用户独立 salt
- **抗时序攻击**：密码比较常数时间
- **抗枚举**：登录失败统一文案
- **可撤销**：改密后所有旧 session 立即失效
- **优雅降级**：IndexedDB 不可用时使用 LS（仅本地使用，无同步风险）

## 二、账户模型

```ts
interface User {
  id: string;          // u_<random>
  email: string;       // 已 lowercase
  name: string;
  createdAt: string;   // ISO
}

interface StoredUser extends User {
  passwordHash: string;  // PBKDF2-SHA256 100k iter
  passwordSalt: string;  // 16 字节 hex
}
```

- `StoredUser` 仅在 `users` store 内部流转
- 对外 API 一律返回 `User`（不暴露 `passwordHash` / `passwordSalt`）
- 通过对象解构剥离：`const { passwordHash, passwordSalt, ...pub } = user`

## 三、密码哈希

### 3.1 算法选择

| 算法 | 选择 | 理由 |
|------|------|------|
| MD5 | ❌ | 太快，已被攻破 |
| SHA-1 | ❌ | 已被攻破 |
| SHA-256 单轮 | ❌ | GPU 秒级 |
| bcrypt | ❌ | Web Crypto 不内置，需 wasm |
| **PBKDF2-SHA256** | ✅ | Web Crypto 原生，跨浏览器支持好 |
| scrypt / Argon2 | 暂不 | 浏览器支持不均，未来可作为 v2 选项 |

### 3.2 参数

```ts
{
  name: 'PBKDF2',
  salt: 16 字节 hex,
  iterations: 100_000,   // OWASP 2023 推荐下限
  hash: 'SHA-256',
  output: 256 bit
}
```

- 100k 迭代在现代笔记本 ~ 50ms / 次，在低端设备 < 300ms
- 注册时强制 ≥ 6 位（业务约束；强度由哈希承担）

### 3.3 salt 设计

- 16 字节 = 128 bit 熵
- 每个用户独立生成，**不**全局
- 持久化在 `users.passwordSalt`，与 hash 同行

### 3.4 验证

```ts
export async function verifyPassword(pw, hash, salt) {
  const { hash: candidate } = await hashPassword(pw, salt);
  return constantTimeEqual(candidate, hash);
}

function constantTimeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
```

- 始终遍历整段字符串，不短路
- `diff |= ...` 累积差异，任何位不同都会让结果 ≠ 0

## 四、Session Token

### 4.1 结构

```ts
interface Session {
  token: string;        // 32 字节 hex = 64 字符
  userId: string;
  createdAt: string;    // ISO
  expiresAt: string;    // ISO, +30d
  userAgent: string;    // 截 200 字
}
```

### 4.2 熵

- 32 字节 = 256 bit 熵
- 碰撞概率 ~ 2^-128，可视为永不复用
- 暴力枚举 2^256 远超宇宙粒子数

### 4.3 生成

```ts
function generateSessionToken() {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return bufToHex(arr.buffer);
}
```

- 使用 `crypto.getRandomValues`（CSPRNG）
- 浏览器不支持 `crypto` 时无法降级（抛错引导用户升级）

### 4.4 存储策略

```
┌──────────────────────────────────────────────┐
│ localStorage.ps_session_token_v1 = "<token>" │  ← 轻量指针
├──────────────────────────────────────────────┤
│ IndexedDB.sessions[token] = { userId, ... }   │  ← 真会话
└──────────────────────────────────────────────┘
```

- 启动时只读 LS 拿 token，再用 token 查 session
- LS 失存时回退检查 LS 中的旧 `current_session` 完整对象
- 双层冗余保证任一介质丢失都能恢复登录态

### 4.5 TTL

- 创建 + 30 天
- 启动时校验 `expiresAt`：
  ```ts
  if (new Date(s.expiresAt) < new Date()) {
    await db.delete(STORES.sessions, s.token);
    return null;
  }
  ```
- 不做滑动续期（v2 计划）：用户必须 30 天后重新登录
- 改密时清空该 user 所有 session，强制全设备下线

## 五、API 行为

### 5.1 注册 `register(email, password, name)`

校验：
1. 邮箱正则 `^[^\s@]+@[^\s@]+\.[^\s@]+$`
2. 密码长度 ≥ 6
3. 昵称非空
4. 邮箱唯一（查 `email` 唯一索引）

副作用：
- `users` 新增记录
- `sessions` 新建 session
- LS 写入 `ps_session_token_v1`

### 5.2 登录 `login(email, password)`

校验：
- 查 `users` by email
- `verifyPassword` 通过
- 失败统一抛 `邮箱或密码不正确`（不区分 "用户不存在" / "密码错误"）

副作用：
- 写新 session（不踢旧设备）
- 写 LS token

### 5.3 Demo 账号 `loginAsDemo()`

- 固定邮箱 `demo@promptstage.app`
- 固定密码 `demo1234`
- 首次访问自动建账号 + 默认文件夹 `f_default`
- 适合零注册体验

### 5.4 改密 `changePassword(userId, oldPw, newPw)`

```ts
async changePassword(userId, oldPassword, newPassword) {
  if (newPassword.length < 6) throw ...;
  const user = await db.get(STORES.users, userId);
  const ok = await verifyPassword(oldPassword, user.passwordHash, user.passwordSalt);
  if (!ok) throw '原密码不正确';
  const { hash, salt } = await hashPassword(newPassword);
  await db.put(STORES.users, { ...user, passwordHash: hash, passwordSalt: salt });
  // 撤销所有 session
  await db.deleteByIndex(STORES.sessions, 'userId', userId);
}
```

- 不返回新 session（前端要重新登录）
- 改密后旧 token 失效，下次任意 `bootstrap` 拿到 null

### 5.5 登出 `logout()`

- 删 `sessions[token]`
- 清 LS token 指针
- 清缓存

## 六、攻击面与防御

| 攻击 | 防御 |
|------|------|
| 彩虹表 | 128 bit 随机 salt |
| 暴力枚举（线上） | 当前为本地，rate-limit 通过 `sleep(400)` 模拟延迟；上线后需服务端 token bucket |
| 离线哈希爆破 | 100k PBKDF2 + 长密码可大幅提高成本 |
| 邮箱枚举 | 登录失败统一文案 |
| XSS 读取 LS token | 强制 CSP `default-src 'self'`，禁止 inline script；token 不带敏感信息（仅 userId 间接） |
| CSRF | 当前无服务端 API，不存在；未来加 SameSite=Strict Cookie |
| 中间人 | 强制 HTTPS + HSTS |
| 时序攻击 | `constantTimeEqual` |
| Session 固定 | 登录成功后必须新生成 token（已在 `saveSession`） |
| Session 劫持 | 30 天 TTL + userAgent 记录（仅审计用） |

## 七、隐私边界

- 所有数据**仅存在用户浏览器**
- 没有埋点 / 遥测 / 第三方分析
- 没有云同步（v1 范围）
- 离线可用，无网络请求
- 注销 = 删 `users` + 关联 `sessions` / `folders` / `templates` / `favorites`（v1.1 计划，UI 在「设置 → 注销账号」）

## 八、UX 上的取舍

- 30 天 TTL：兼顾 "不要频繁让我登录" 与 "不要太长的安全窗口"
- 注册仅需邮箱 + 密码 + 昵称：不收手机号 / 实名
- Demo 账号：降低首次体验门槛
- 失败统一文案：牺牲一点 UX（用户不知道是邮箱错还是密码错）换防枚举
- 改密强登：牺牲便利换安全

## 九、审计与调试

- `AuthService.listSessions(userId)` 返回该用户全部 session（含 userAgent / 时间）
- DevTools → Application → IndexedDB → PromptStageDB 可直接看 `users` / `sessions` 表
- `db.exportAll()` 一键导出 JSON，便于复现 bug

## 十、未来规划

### 10.1 v1.1
- 注销账号（清空级联）
- 邮箱验证（OTP）—— 需引入服务端
- 改密邮件通知

### 10.2 v2.0
- 服务端鉴权（JWT + Refresh Token）
- 设备列表管理（看哪些设备在线）
- 双因素认证（TOTP）

### 10.3 v2.5
- WebAuthn（指纹 / Face ID / 安全密钥）
- passkey 登录
- 端到端加密的同步（用户密码派生加密 key）

## 十一、API 速查

```ts
AuthService.bootstrap(): Promise<User | null>;
AuthService.current(): User | null;
AuthService.isGuest(): boolean;
AuthService.login(email, password): Promise<User>;
AuthService.register(email, password, name): Promise<User>;
AuthService.loginAsDemo(): Promise<User>;
AuthService.changePassword(userId, oldPw, newPw): Promise<void>;
AuthService.logout(): Promise<void>;
AuthService.listSessions(userId): Promise<Session[]>;
```

## 十二、相关文档

- [11-database-design.md](./11-database-design.md) — IndexedDB 拓扑
- [09-error-states.md](./09-error-states.md) — 错误态文案
- [10-accessibility.md](./10-accessibility.md) — 键盘 / 屏幕阅读器
