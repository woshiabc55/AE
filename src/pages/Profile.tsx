import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { LANGUAGE_CONFIG, LEVEL_CONFIG, type Language } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Edit3, Save, Globe, Clock, Shield, Bell, LogOut, Trash2, Camera, ChevronRight } from 'lucide-react';

const AVATARS = ['🧑‍💻', '👩‍🎓', '🧑‍🏫', '👨‍🚀', '🦊', '🐱', '🌸', '🎯', '🌍', '📚', '🎵', '🎨'];
const DIFFICULTIES = ['轻松', '标准', '挑战'];
const LANG_KEYS: Language[] = ['en', 'ja', 'ko'];

const sectionVar = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

export default function Profile() {
  const { user, updateUser, setCurrentLanguage, logout } = useStore();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState(user?.avatar || '🧑‍💻');
  const [dailyGoal, setDailyGoal] = useState(user?.dailyGoal || 30);
  const [difficulty, setDifficulty] = useState('标准');
  const [notifications, setNotifications] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  if (!user) return null;

  const handleSave = () => {
    updateUser({ name, avatar, dailyGoal });
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = () => {
    if (deleteConfirm) {
      logout();
      navigate('/login');
    } else {
      setDeleteConfirm(true);
      setTimeout(() => setDeleteConfirm(false), 3000);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6 font-body" style={{ background: '#1A1F36' }}>
      <motion.section variants={sectionVar} initial="hidden" animate="visible"
        className="relative rounded-2xl p-6 overflow-hidden" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
        <div className="absolute inset-0 opacity-10" style={{ background: 'linear-gradient(135deg, #FF6B4A, #4ECDC4)' }} />
        <div className="relative flex items-center gap-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl shrink-0"
            style={{ background: '#232847', border: '3px solid #FF6B4A' }}>
            {user.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-white font-display">{user.name}</h1>
            <div className="flex items-center gap-2 mt-1" style={{ color: '#94A3B8' }}>
              <Mail size={14} /> <span className="text-sm truncate">{user.email}</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-semibold text-white" style={{ background: '#FF6B4A' }}>
                {user.level} · {LEVEL_CONFIG[user.level].name}
              </span>
              <span className="flex items-center gap-1 text-xs" style={{ color: '#4ECDC4' }}>
                <Clock size={12} /> {new Date(user.createdAt).toLocaleDateString('zh-CN')} 加入
              </span>
            </div>
          </div>
          <button onClick={() => setEditMode(!editMode)}
            className="p-2 rounded-lg transition-colors" style={{ background: '#232847', color: '#94A3B8' }}>
            {editMode ? <Save size={18} /> : <Edit3 size={18} />}
          </button>
        </div>
      </motion.section>

      {editMode && (
        <motion.section initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
          className="rounded-2xl p-6 space-y-5" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
          <h2 className="text-lg font-semibold text-white font-display flex items-center gap-2">
            <Camera size={18} style={{ color: '#FF6B4A' }} /> 编辑资料
          </h2>
          <div>
            <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>选择头像</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((a) => (
                <button key={a} onClick={() => setAvatar(a)}
                  className="w-12 h-12 rounded-lg text-2xl flex items-center justify-center transition-all"
                  style={{ background: avatar === a ? '#FF6B4A' : '#232847', border: avatar === a ? '2px solid #FF6B4A' : '2px solid transparent' }}>
                  {a}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#94A3B8' }}>昵称</label>
            <input value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg text-white text-sm outline-none focus:ring-2"
              style={{ background: '#232847', border: '1px solid #3A4070', '--tw-ring-color': '#FF6B4A' } as React.CSSProperties} />
          </div>
          <div>
            <label className="text-sm mb-1 block" style={{ color: '#94A3B8' }}>个人简介</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
              className="w-full px-4 py-2 rounded-lg text-white text-sm outline-none resize-none focus:ring-2"
              style={{ background: '#232847', border: '1px solid #3A4070' }} />
          </div>
          <button onClick={handleSave}
            className="px-6 py-2 rounded-lg text-white font-semibold text-sm flex items-center gap-2 transition-transform hover:scale-105"
            style={{ background: '#FF6B4A' }}>
            <Save size={16} /> 保存
          </button>
        </motion.section>
      )}

      <motion.section variants={sectionVar} initial="hidden" animate="visible"
        className="rounded-2xl p-6 space-y-5" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
        <h2 className="text-lg font-semibold text-white font-display flex items-center gap-2">
          <Globe size={18} style={{ color: '#4ECDC4' }} /> 学习偏好
        </h2>
        <div>
          <label className="text-sm mb-3 block" style={{ color: '#94A3B8' }}>目标语言</label>
          <div className="grid grid-cols-3 gap-3">
            {LANG_KEYS.map((lang) => {
              const cfg = LANGUAGE_CONFIG[lang];
              const selected = user.targetLanguage === lang;
              return (
                <button key={lang} onClick={() => setCurrentLanguage(lang)}
                  className="rounded-xl p-4 text-center transition-all"
                  style={{
                    background: selected ? cfg.bgColor : '#232847',
                    border: `2px solid ${selected ? cfg.color : '#3A4070'}`,
                    boxShadow: selected ? `0 0 20px ${cfg.color}30` : 'none',
                  }}>
                  <div className="text-2xl mb-1">{lang === 'en' ? '🇬🇧' : lang === 'ja' ? '🇯🇵' : '🇰🇷'}</div>
                  <div className="text-sm font-semibold text-white">{cfg.name}</div>
                  <div className="text-xs" style={{ color: cfg.color }}>{cfg.nativeName}</div>
                  {selected && <div className="mt-2 w-3 h-3 rounded-full mx-auto" style={{ background: cfg.color }} />}
                </button>
              );
            })}
          </div>
        </div>
        <div>
          <label className="text-sm mb-2 flex items-center justify-between" style={{ color: '#94A3B8' }}>
            <span className="flex items-center gap-1"><Clock size={14} /> 每日目标</span>
            <span className="font-semibold text-white">{dailyGoal} 分钟</span>
          </label>
          <input type="range" min={10} max={60} step={5} value={dailyGoal}
            onChange={(e) => { const v = Number(e.target.value); setDailyGoal(v); updateUser({ dailyGoal: v }); }}
            className="w-full h-2 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #FF6B4A ${((dailyGoal - 10) / 50) * 100}%, #3A4070 ${((dailyGoal - 10) / 50) * 100}%)` }} />
          <div className="flex justify-between text-xs mt-1" style={{ color: '#64748B' }}>
            <span>10分钟</span><span>60分钟</span>
          </div>
        </div>
        <div>
          <label className="text-sm mb-2 block" style={{ color: '#94A3B8' }}>难度偏好</label>
          <div className="flex gap-2">
            {DIFFICULTIES.map((d) => (
              <button key={d} onClick={() => setDifficulty(d)}
                className="flex-1 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: difficulty === d ? '#FF6B4A' : '#232847',
                  color: difficulty === d ? '#fff' : '#94A3B8',
                  border: `1px solid ${difficulty === d ? '#FF6B4A' : '#3A4070'}`,
                }}>
                {d}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section variants={sectionVar} initial="hidden" animate="visible"
        className="rounded-2xl p-6 space-y-3" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
        <h2 className="text-lg font-semibold text-white font-display flex items-center gap-2 mb-4">
          <Shield size={18} style={{ color: '#A78BFA' }} /> 账户设置
        </h2>
        <button className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors"
          style={{ background: '#232847' }}>
          <span className="flex items-center gap-3 text-white text-sm"><Shield size={16} style={{ color: '#94A3B8' }} /> 修改密码</span>
          <ChevronRight size={16} style={{ color: '#64748B' }} />
        </button>
        <div className="flex items-center justify-between px-4 py-3 rounded-lg" style={{ background: '#232847' }}>
          <span className="flex items-center gap-3 text-white text-sm"><Bell size={16} style={{ color: '#94A3B8' }} /> 通知提醒</span>
          <button onClick={() => setNotifications(!notifications)}
            className="w-11 h-6 rounded-full relative transition-colors"
            style={{ background: notifications ? '#4ECDC4' : '#3A4070' }}>
            <div className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform"
              style={{ transform: notifications ? 'translateX(22px)' : 'translateX(2px)' }} />
          </button>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:opacity-80"
          style={{ background: '#232847' }}>
          <span className="flex items-center gap-3 text-sm" style={{ color: '#FF6B4A' }}><LogOut size={16} /> 退出登录</span>
          <ChevronRight size={16} style={{ color: '#64748B' }} />
        </button>
        <button onClick={handleDelete}
          className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors hover:opacity-80"
          style={{ background: deleteConfirm ? '#7F1D1D' : '#232847' }}>
          <span className="flex items-center gap-3 text-sm" style={{ color: '#EF4444' }}>
            <Trash2 size={16} /> {deleteConfirm ? '确认删除？再次点击' : '删除账户'}
          </span>
          <ChevronRight size={16} style={{ color: '#64748B' }} />
        </button>
      </motion.section>
    </div>
  );
}
