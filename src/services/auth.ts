// 鉴权服务 - 本地账户演示
import type { User } from '../types';
import { sleep, uid } from '../lib/utils';

const LS_USER = 'ps_user_v1';
const LS_USERS = 'ps_users_v1';

interface StoredUser extends User {
  password: string;
}

function loadUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(LS_USERS);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(list: StoredUser[]) {
  localStorage.setItem(LS_USERS, JSON.stringify(list));
}

class AuthServiceImpl {
  current(): User | null {
    try {
      const raw = localStorage.getItem(LS_USER);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }

  isGuest(): boolean {
    return this.current() === null;
  }

  async login(email: string, password: string): Promise<User> {
    await sleep(400);
    const users = loadUsers();
    const found = users.find((u) => u.email === email && u.password === password);
    if (!found) throw new Error('邮箱或密码不正确');
    const { password: _pw, ...pub } = found;
    localStorage.setItem(LS_USER, JSON.stringify(pub));
    return pub;
  }

  async register(email: string, password: string, name: string): Promise<User> {
    await sleep(500);
    const users = loadUsers();
    if (users.find((u) => u.email === email)) throw new Error('该邮箱已注册');
    const u: StoredUser = {
      id: uid('u'),
      email,
      password,
      name,
      createdAt: new Date().toISOString(),
    };
    users.push(u);
    saveUsers(users);
    const { password: _pw, ...pub } = u;
    localStorage.setItem(LS_USER, JSON.stringify(pub));
    return pub;
  }

  async loginAsDemo(): Promise<User> {
    await sleep(300);
    let users = loadUsers();
    if (!users.find((u) => u.email === 'demo@promptstage.app')) {
      users.push({
        id: 'u_demo',
        email: 'demo@promptstage.app',
        password: 'demo1234',
        name: '剧幕演示账号',
        createdAt: new Date().toISOString(),
      });
      saveUsers(users);
    }
    return this.login('demo@promptstage.app', 'demo1234');
  }

  logout() {
    localStorage.removeItem(LS_USER);
  }
}

export const AuthService = new AuthServiceImpl();
