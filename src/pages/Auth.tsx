import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { LANGUAGE_CONFIG, type Language } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Globe } from 'lucide-react';

const BUBBLES = [
  { text: 'Hello', x: '8%', y: '12%', delay: 0 },
  { text: 'こんにちは', x: '78%', y: '18%', delay: 1 },
  { text: '안녕하세요', x: '12%', y: '78%', delay: 2 },
  { text: 'Bonjour', x: '72%', y: '72%', delay: 0.5 },
  { text: 'Hola', x: '45%', y: '8%', delay: 1.5 },
  { text: 'Ciao', x: '88%', y: '48%', delay: 2.5 },
];

export default function Auth() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [langOpen, setLangOpen] = useState(false);
  const { login, register, setCurrentLanguage, currentLanguage } = useStore();
  const navigate = useNavigate();

  const validate = (): boolean => {
    if (tab === 'register' && !name.trim()) { setError('请输入用户名'); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('邮箱格式不正确'); return false; }
    if (password.length < 6) { setError('密码长度至少6位'); return false; }
    if (tab === 'register' && password !== confirmPassword) { setError('两次密码不一致'); return false; }
    setError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const ok = tab === 'login' ? login(email, password) : register(name, email, password);
    if (ok) navigate('/');
    else setError(tab === 'login' ? '登录失败' : '注册失败');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1A1F36 0%, #232847 50%, #1A1F36 100%)' }}>

      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="absolute text-sm font-display text-gray-500/20 select-none pointer-events-none"
          style={{ left: b.x, top: b.y }}
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
        >
          {b.text}
        </motion.span>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-4"
      >
        <div className="bg-brand-card rounded-2xl border border-brand-border/50 p-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-display font-bold text-white">LinguaVerse</h1>
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-surface border border-brand-border/50 text-sm text-gray-300 hover:border-brand-accent/50 transition-colors"
              >
                <Globe size={16} />
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_CONFIG[currentLanguage].color }} />
                {LANGUAGE_CONFIG[currentLanguage].name}
              </button>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-1 w-36 bg-brand-surface border border-brand-border/50 rounded-lg shadow-xl z-10 overflow-hidden"
                >
                  {(Object.keys(LANGUAGE_CONFIG) as Language[]).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => { setCurrentLanguage(lang); setLangOpen(false); }}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-300 hover:bg-brand-card transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: LANGUAGE_CONFIG[lang].color }} />
                      {LANGUAGE_CONFIG[lang].name}
                      <span className="text-gray-500 text-xs ml-auto">{LANGUAGE_CONFIG[lang].nativeName}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex mb-6 bg-brand-surface rounded-xl p-1">
            {(['login', 'register'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  tab === t ? 'bg-brand-accent text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {t === 'login' ? '登录' : '注册'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input type="text" placeholder="用户名" value={name} onChange={(e) => setName(e.target.value)} className="input-field pl-10" />
              </div>
            )}
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input type="email" placeholder="邮箱" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" />
            </div>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10 pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {tab === 'register' && (
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-3.5 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="确认密码"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10 pr-10"
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-300">
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            )}
            {error && <p className="text-red-400 text-sm">{error}</p>}
            {tab === 'login' && (
              <div className="text-right">
                <button type="button" className="text-sm text-brand-accent hover:text-brand-accent-hover transition-colors">忘记密码?</button>
              </div>
            )}
            <button type="submit" className="btn-primary w-full py-3 text-center">
              {tab === 'login' ? '登录' : '注册'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
