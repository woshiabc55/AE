// 鉴权服务 v2 - 基于 IndexedDB + 密码哈希 + session token
import type { User } from '../types';
import { sleep } from '../lib/utils';
import { db, isDBAvailable, lsFallback, STORES } from './db';
import { hashPassword, verifyPassword, generateSessionToken, randomId } from '../lib/crypto';

const SESSION_TTL_DAYS = 30;
const SESSION_KEY = 'current_session';

interface StoredUser extends User {
  passwordHash: string;
  passwordSalt: string;
}

interface Session {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  userAgent: string;
}

class AuthServiceImpl {
  private cache: User | null = null;
  private useLS = false;

  constructor() {
    // 检查 IndexedDB 可用性
    isDBAvailable().then((ok) => {
      this.useLS = !ok;
      if (!ok) console.warn('[Auth] IndexedDB unavailable, falling back to localStorage');
    });
  }

  // ---------- Session 管理 ----------

  private async getCurrentSession(): Promise<Session | null> {
    if (this.useLS) {
      const s = lsFallback.get<Session>(SESSION_KEY);
      if (!s) return null;
      if (new Date(s.expiresAt) < new Date()) {
        lsFallback.delete(SESSION_KEY);
        return null;
      }
      return s;
    }
    const s = await db.get<Session>(STORES.sessions, this.getSessionTokenFromLS() ?? '');
    if (!s) {
      // 兜底：试 LS（兜底模式 / 旧版）
      const ls = lsFallback.get<Session>(SESSION_KEY);
      if (ls && new Date(ls.expiresAt) > new Date()) return ls;
      return null;
    }
    if (new Date(s.expiresAt) < new Date()) {
      await db.delete(STORES.sessions, s.token);
      return null;
    }
    return s;
  }

  private getSessionTokenFromLS(): string | null {
    try {
      const raw = localStorage.getItem('ps_session_token_v1');
      return raw;
    } catch { return null; }
  }

  private setSessionTokenInLS(token: string | null) {
    try {
      if (token) localStorage.setItem('ps_session_token_v1', token);
      else localStorage.removeItem('ps_session_token_v1');
    } catch { /* ignore */ }
  }

  private async saveSession(userId: string): Promise<Session> {
    const session: Session = {
      token: generateSessionToken(),
      userId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + SESSION_TTL_DAYS * 24 * 3600 * 1000).toISOString(),
      userAgent: navigator.userAgent.slice(0, 200),
    };
    if (this.useLS) {
      lsFallback.set(SESSION_KEY, session);
    } else {
      await db.put(STORES.sessions, session);
    }
    this.setSessionTokenInLS(session.token);
    return session;
  }

  private async clearSession() {
    const token = this.getSessionTokenFromLS();
    if (token && !this.useLS) {
      try { await db.delete(STORES.sessions, token); } catch { /* ignore */ }
    }
    this.setSessionTokenInLS(null);
    lsFallback.delete(SESSION_KEY);
  }

  // ---------- 公开 API ----------

  current(): User | null {
    return this.cache;
  }

  isGuest(): boolean {
    return this.cache === null;
  }

  async bootstrap(): Promise<User | null> {
    const session = await this.getCurrentSession();
    if (!session) return null;
    if (this.useLS) {
      const u = lsFallback.get<User & { passwordHash: string }>(`user_${session.userId}`);
      if (u) {
        const { passwordHash: _h, ...pub } = u;
        this.cache = pub;
        return pub;
      }
      return null;
    }
    const u = await db.get<StoredUser>(STORES.users, session.userId);
    if (!u) return null;
    const { passwordHash: _h, passwordSalt: _s, ...pub } = u;
    this.cache = pub;
    return pub;
  }

  async login(email: string, password: string): Promise<User> {
    await sleep(400); // 模拟网络
    const normalized = email.trim().toLowerCase();
    let user: StoredUser | undefined;
    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      user = all.find((u) => u.email === normalized);
    } else {
      user = await db.getByIndex<StoredUser>(STORES.users, 'email', normalized);
    }
    if (!user) throw new Error('邮箱或密码不正确');
    const ok = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!ok) throw new Error('邮箱或密码不正确');
    const { passwordHash: _h, passwordSalt: _s, ...pub } = user;
    await this.saveSession(pub.id);
    this.cache = pub;
    return pub;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    await sleep(500);
    if (password.length < 6) throw new Error('密码至少需要 6 位');
    const normalized = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) throw new Error('邮箱格式不正确');
    if (!name.trim()) throw new Error('请填写昵称');

    const { hash, salt } = await hashPassword(password);
    const user: StoredUser = {
      id: randomId('u'),
      email: normalized,
      name: name.trim(),
      createdAt: new Date().toISOString(),
      passwordHash: hash,
      passwordSalt: salt,
    };

    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      if (all.find((u) => u.email === normalized)) throw new Error('该邮箱已注册');
      all.push(user);
      lsFallback.set('users', all);
    } else {
      const existing = await db.getByIndex(STORES.users, 'email', normalized);
      if (existing) throw new Error('该邮箱已注册');
      await db.put(STORES.users, user);
    }
    const { passwordHash: _h, passwordSalt: _s, ...pub } = user;
    await this.saveSession(pub.id);
    this.cache = pub;
    return pub;
  }

  async loginAsDemo(): Promise<User> {
    await sleep(300);
    const demoEmail = 'demo@promptstage.app';
    const demoPassword = 'demo1234';
    let user: StoredUser | undefined;
    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      user = all.find((u) => u.email === demoEmail);
      if (!user) {
        const { hash, salt } = await hashPassword(demoPassword);
        user = {
          id: 'u_demo',
          email: demoEmail,
          name: '剧幕演示账号',
          createdAt: new Date().toISOString(),
          passwordHash: hash,
          passwordSalt: salt,
        };
        all.push(user);
        lsFallback.set('users', all);
      }
    } else {
      user = await db.getByIndex<StoredUser>(STORES.users, 'email', demoEmail);
      if (!user) {
        const { hash, salt } = await hashPassword(demoPassword);
        user = {
          id: 'u_demo',
          email: demoEmail,
          name: '剧幕演示账号',
          createdAt: new Date().toISOString(),
          passwordHash: hash,
          passwordSalt: salt,
        };
        await db.put(STORES.users, user);
        // 自动建默认文件夹
        const defaultFolder = {
          id: 'f_default',
          name: '我的剧库',
          parentId: null,
          userId: user.id,
          createdAt: new Date().toISOString(),
        };
        await db.put(STORES.folders, defaultFolder);
      }
    }
    return this.login(demoEmail, demoPassword);
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    if (newPassword.length < 6) throw new Error('新密码至少 6 位');
    let user: StoredUser | undefined;
    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      const idx = all.findIndex((u) => u.id === userId);
      if (idx === -1) throw new Error('用户不存在');
      user = all[idx];
    } else {
      user = await db.get<StoredUser>(STORES.users, userId);
    }
    if (!user) throw new Error('用户不存在');
    const ok = await verifyPassword(oldPassword, user.passwordHash, user.passwordSalt);
    if (!ok) throw new Error('原密码不正确');
    const { hash, salt } = await hashPassword(newPassword);
    const updated: StoredUser = { ...user, passwordHash: hash, passwordSalt: salt };
    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      const idx = all.findIndex((u) => u.id === userId);
      all[idx] = updated;
      lsFallback.set('users', all);
    } else {
      await db.put(STORES.users, updated);
    }
    // 撤销所有 session
    if (!this.useLS) {
      await db.deleteByIndex(STORES.sessions, 'userId', userId);
    }
  }

  async logout(): Promise<void> {
    await this.clearSession();
    this.cache = null;
  }

  /**
   * 永久注销账号（v1.1）
   * - 校验密码（防止误操作 / 设备被借用）
   * - 级联清理：users / sessions / templates / folders / favorites / drafts / editors
   * - 不可恢复：调用前应提示用户
   */
  async deleteAccount(userId: string, password: string): Promise<void> {
    // 1. 重新校验密码（安全闸门）
    let user: StoredUser | undefined;
    if (this.useLS) {
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      user = all.find((u) => u.id === userId);
    } else {
      user = await db.get<StoredUser>(STORES.users, userId);
    }
    if (!user) throw new Error('用户不存在');
    const ok = await verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!ok) throw new Error('密码不正确，注销已取消');

    // 2. 级联清理
    if (this.useLS) {
      // LS 模式：直接清空所有 ps_ 键（最简单可靠）
      const all = lsFallback.get<StoredUser[]>('users') ?? [];
      lsFallback.set('users', all.filter((u) => u.id !== userId));
      lsFallback.set('sessions', (lsFallback.get<Session[]>('sessions') ?? []).filter((s) => s.userId !== userId));
      lsFallback.set('favorites', (lsFallback.get<{ userId: string }[]>('favorites') ?? []).filter((f) => f.userId !== userId));
      lsFallback.set('templates', (lsFallback.get<{ author?: { id: string } }[]>('templates') ?? []).filter((t) => t.author?.id !== userId));
      lsFallback.set('folders', (lsFallback.get<{ userId: string }[]>('folders') ?? []).filter((f) => f.userId !== userId));
    } else {
      // IndexedDB 模式：按 store 走
      await db.delete(STORES.users, userId);
      await db.deleteByIndex(STORES.sessions, 'userId', userId);
      await db.deleteByIndex(STORES.favorites, 'userId', userId);
      await db.deleteByIndex(STORES.folders, 'userId', userId);
      // 模板：按 authorId 索引删
      const userTpls = await db.getAllByIndex<{ id: string }>(STORES.templates, 'authorId', userId);
      for (const t of userTpls) {
        await db.delete(STORES.templates, t.id);
      }
      // 草稿 / 编辑器：key 前缀 = `${userId}:`
      const draftKeys = (await db.getAll<{ key: string }>(STORES.drafts))
        .filter((d) => d.key.startsWith(`${userId}:`))
        .map((d) => d.key);
      for (const k of draftKeys) await db.delete(STORES.drafts, k);
      const editorKeys = (await db.getAll<{ key: string }>(STORES.editors))
        .filter((d) => d.key.startsWith(`${userId}:`))
        .map((d) => d.key);
      for (const k of editorKeys) await db.delete(STORES.editors, k);
    }

    // 3. 清理登录态
    await this.clearSession();
    this.cache = null;
  }

  // 调试用：列出所有 session
  async listSessions(userId: string): Promise<Session[]> {
    if (this.useLS) {
      const all = lsFallback.get<Session[]>('sessions') ?? [];
      return all.filter((s) => s.userId === userId);
    }
    return db.getAllByIndex<Session>(STORES.sessions, 'userId', userId);
  }
}

export const AuthService = new AuthServiceImpl();
