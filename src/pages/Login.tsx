// 登录 / 注册
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Input } from '../components/ui';
import { useApp } from '../store/useApp';

export default function Login() {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nav = useNavigate();
  const { login, register, loginDemo } = useApp();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        nav('/library');
      } else {
        if (!name.trim()) throw new Error('请填写名字');
        await register(email, password, name);
        nav('/library');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const onDemo = async () => {
    setLoading(true);
    try {
      await loginDemo();
      nav('/library');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2">
      {/* 左：表单 */}
      <div className="flex items-center justify-center p-8 lg:p-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[400px] space-y-7"
        >
          <div>
            <div className="eyebrow eyebrow-amber mb-3">{mode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</div>
            <h1 className="display text-4xl text-[var(--paper-0)] mb-2">
              {mode === 'login' ? '欢迎回到剧幕' : '加入剧幕'}
            </h1>
            <p className="text-[13px] text-[var(--paper-2)]">
              {mode === 'login' ? '继续管理你的云端剧目库' : '免费注册，1GB 云端空间即刻到手'}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <Input
                label="昵称"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="剧幕里大家怎么称呼你"
                prefix={<UserIcon size={14} />}
                required
              />
            )}
            <Input
              label="邮箱"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.com"
              prefix={<Mail size={14} />}
              required
            />
            <Input
              label="密码"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={mode === 'register' ? '至少 6 位' : '你的密码'}
              prefix={<Lock size={14} />}
              required
              minLength={6}
            />

            {error && (
              <div className="text-[12px] text-[var(--vermilion)] bg-[var(--vermilion-soft)] border border-[rgba(192,57,43,0.3)] rounded-[6px] px-3 py-2">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              iconRight={<ArrowRight size={16} />}
              className="w-full btn-amber-glow"
            >
              {mode === 'login' ? '登录' : '注册并进入'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full hairline" /></div>
            <div className="relative flex justify-center"><span className="bg-[var(--ink-1)] px-3 text-[11px] text-[var(--paper-3)] mono tracking-wider">OR · 或者</span></div>
          </div>

          <Button
            type="button"
            variant="outline-amber"
            size="lg"
            onClick={onDemo}
            loading={loading}
            icon={<Sparkles size={15} />}
            className="w-full"
          >
            一键体验演示账号
          </Button>

          <div className="text-center text-[12px] text-[var(--paper-2)]">
            {mode === 'login' ? '还没有账号？' : '已经有账号了？'}{' '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }}
              className="text-[var(--amber-1)] hover:underline mono"
            >
              {mode === 'login' ? '注册' : '登录'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* 右：装饰 */}
      <div className="hidden lg:flex relative overflow-hidden border-l border-[var(--ink-4)] bg-[var(--ink-2)] items-center justify-center p-12 film-edge">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle,rgba(232,177,74,0.3),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(58,142,142,0.2),transparent_60%)]" />
          <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-[radial-gradient(circle,rgba(192,57,43,0.08),transparent_60%)]" />
        </div>
        <div className="relative max-w-md space-y-8">
          <div className="inline-flex items-center gap-2 h-7 px-3 rounded-full glass border border-[rgba(232,177,74,0.25)] text-[11px] text-[var(--amber-1)] mono tracking-wider">
            <span className="dot-amber" />
            创作从此高效
          </div>
          <h2 className="display text-[40px] leading-[1.05] tracking-tight text-paper-gradient">
            你的每一次创作，<br />
            都值得被记住
          </h2>
          <p className="text-[14px] text-[var(--paper-2)] leading-relaxed">
            剧幕把零散的提示词变成可复用的剧目资产。
            一次搭建，永久调用；云端保存，跨设备同步。
          </p>
          <div className="grid grid-cols-3 gap-6 pt-4">
            <Mini value="12+" label="内置模板" />
            <Mini value="1GB" label="云端空间" />
            <Mini value="∞" label="变量复用" />
          </div>
          <div className="rounded-[10px] glass border border-[var(--ink-4)] p-4 mono text-[12px] text-[var(--paper-2)] space-y-1.5">
            <div className="flex items-center gap-1.5 text-[var(--amber-1)] mb-1.5">
              <Sparkles size={12} />
              <span className="text-[10px] tracking-wider">演示账号 · 一键登录</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--paper-3)]">email</span>
              <span>demo@promptstage.app</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--paper-3)]">password</span>
              <span>demo1234</span>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-[var(--paper-3)] mono tracking-wider">
            <span className="dot-jade" />
            <span>PASSKEY-READY · 数据本地化 · 离线可用</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="display text-2xl text-[var(--amber-2)]">{value}</div>
      <div className="text-[10px] text-[var(--paper-3)] tracking-wider uppercase mt-1">{label}</div>
    </div>
  );
}
