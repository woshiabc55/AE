// lib/crypto.ts - 浏览器内密码哈希与 session token
// 使用 Web Crypto API（SubtleCrypto）

// SHA-256 + 随机 salt
export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const saltStr = salt ?? randomSalt();
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: enc.encode(saltStr),
      iterations: 100_000,
      hash: 'SHA-256',
    },
    keyMaterial,
    256
  );
  const hash = bufToHex(bits);
  return { hash, salt: saltStr };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const { hash: candidate } = await hashPassword(password, salt);
  return constantTimeEqual(candidate, hash);
}

function bufToHex(buf: ArrayBuffer): string {
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function randomSalt(): string {
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  return bufToHex(arr.buffer);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// 生成 32 字节 session token
export function generateSessionToken(): string {
  const arr = new Uint8Array(32);
  crypto.getRandomValues(arr);
  return bufToHex(arr.buffer);
}

export function randomId(prefix: string): string {
  const arr = new Uint8Array(8);
  crypto.getRandomValues(arr);
  return `${prefix}_${bufToHex(arr.buffer)}${Date.now().toString(36).slice(-4)}`;
}
