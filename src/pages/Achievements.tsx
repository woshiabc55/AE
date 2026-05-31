import { useState } from 'react';
import { achievements, leaderboard } from '@/data/community';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Medal, Crown, Star, Lock, TrendingUp, ChevronRight, X } from 'lucide-react';

const CATEGORIES = [
  { key: 'all', label: '全部' },
  { key: 'learning', label: '学习' },
  { key: 'streak', label: '连续' },
  { key: 'social', label: '社交' },
  { key: 'special', label: '特殊' },
] as const;

const LEVEL_NAMES = ['初学者', '学徒', '探索者', '行者', '达人', '大师', '宗师', '传奇', '神话', '至尊'];

const getLevelInfo = (xp: number) => {
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = (level - 1) * 500;
  const nextLevelXp = level * 500;
  const progress = ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100;
  return { level, name: LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)], progress, currentXp: xp - currentLevelXp, requiredXp: nextLevelXp - currentLevelXp };
};

const PODIUM_COLORS = ['#FFD93D', '#C0C0C0', '#CD7F32'];
const PODIUM_ICONS = [Crown, Medal, Star];

export default function Achievements() {
  const { user } = useStore();
  const [category, setCategory] = useState<string>('all');
  const [lbTab, setLbTab] = useState<'week' | 'month'>('week');
  const [selectedAch, setSelectedAch] = useState<typeof achievements[0] | null>(null);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const filtered = category === 'all' ? achievements : achievements.filter(a => a.category === category);
  const levelInfo = getLevelInfo(user?.xp ?? 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-white">成就中心</h1>
          <p className="text-sm text-gray-400 mt-1">已解锁 <span className="text-brand-accent font-semibold">{unlockedCount}</span>/{achievements.length} 个成就</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center">
          <Trophy size={24} className="text-brand-accent" />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="rounded-2xl p-5 bg-brand-card border border-brand-border/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-accent/15 flex items-center justify-center text-brand-accent font-display font-bold text-lg">
              {levelInfo.level}
            </div>
            <div>
              <p className="text-white font-display font-semibold">{levelInfo.name}</p>
              <p className="text-xs text-gray-400">{levelInfo.currentXp}/{levelInfo.requiredXp} XP</p>
            </div>
          </div>
          <TrendingUp size={20} className="text-brand-mint" />
        </div>
        <div className="h-3 bg-brand-surface rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${levelInfo.progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-brand-accent to-brand-amber" />
        </div>
      </motion.div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => setCategory(c.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              category === c.key ? 'bg-brand-accent text-white' : 'bg-brand-card text-gray-400 hover:text-white border border-brand-border/50'}`}>
            {c.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((ach, i) => (
            <motion.div key={ach.id} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }} transition={{ delay: i * 0.05 }}
              onClick={() => ach.unlocked && setSelectedAch(ach)}
              className={`rounded-2xl p-4 border transition-all ${
                ach.unlocked
                  ? 'bg-brand-card border-brand-border/50 cursor-pointer hover:border-brand-accent/40 animate-glow'
                  : 'bg-brand-card/50 border-brand-border/30 opacity-60 grayscale'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
                  ach.unlocked ? 'bg-brand-accent/15' : 'bg-brand-surface'}`}>
                  {ach.unlocked ? ach.icon : <Lock size={20} className="text-gray-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-semibold text-sm ${ach.unlocked ? 'text-white' : 'text-gray-500'}`}>{ach.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">{ach.description}</p>
                  {ach.unlocked ? (
                    <p className="text-xs text-brand-mint mt-2">{ach.unlockedAt} 解锁</p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">{ach.progress}/{ach.requirement}</span>
                        <span className="text-gray-500">{Math.round((ach.progress / ach.requirement) * 100)}%</span>
                      </div>
                      <div className="h-1.5 bg-brand-surface rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-brand-border" style={{ width: `${Math.min(100, (ach.progress / ach.requirement) * 100)}%` }} />
                      </div>
                    </div>
                  )}
                </div>
                {ach.unlocked && <ChevronRight size={16} className="text-gray-500 flex-shrink-0 mt-1" />}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="rounded-2xl p-5 bg-brand-card border border-brand-border/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-bold text-white">排行榜</h2>
          <div className="flex gap-1 bg-brand-surface rounded-lg p-1">
            {(['week', 'month'] as const).map(t => (
              <button key={t} onClick={() => setLbTab(t)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
                  lbTab === t ? 'bg-brand-accent text-white' : 'text-gray-400 hover:text-white'}`}>
                {t === 'week' ? '周榜' : '月榜'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-end justify-center gap-4 mb-6 pt-4">
          {[1, 0, 2].map(idx => {
            const entry = leaderboard[idx];
            if (!entry) return null;
            const PodiumIcon = PODIUM_ICONS[idx];
            const heights = ['h-24', 'h-20', 'h-16'];
            return (
              <motion.div key={entry.userId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className={`flex flex-col items-center ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}>
                <div className="relative mb-2">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: `${PODIUM_COLORS[idx]}20`, boxShadow: `0 0 16px ${PODIUM_COLORS[idx]}40` }}>
                    {entry.avatar}
                  </div>
                  <PodiumIcon size={14} className="absolute -top-1 -right-1" style={{ color: PODIUM_COLORS[idx] }} />
                </div>
                <p className="text-xs font-semibold text-white mb-1">{entry.userName}</p>
                <p className="text-xs text-gray-400">{entry.xp.toLocaleString()} XP</p>
                <div className={`w-20 ${heights[idx]} rounded-t-lg mt-2`} style={{ background: `${PODIUM_COLORS[idx]}30` }} />
              </motion.div>
            );
          })}
        </div>

        <div className="space-y-2">
          {leaderboard.slice(3).map((entry, i) => {
            const isCurrentUser = entry.userId === user?.id;
            return (
              <motion.div key={entry.userId} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isCurrentUser ? 'bg-brand-accent/10 border border-brand-accent/30' : 'bg-brand-surface/50 hover:bg-brand-surface'}`}>
                <span className="w-6 text-center text-sm font-display font-bold text-gray-400">{entry.rank}</span>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg bg-brand-card">{entry.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-brand-accent' : 'text-white'}`}>{entry.userName}</p>
                  <p className="text-xs text-gray-400">🔥 {entry.streak} 天连续</p>
                </div>
                <span className="text-sm font-display font-semibold text-brand-amber">{entry.xp.toLocaleString()} XP</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedAch && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedAch(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-sm rounded-2xl p-6 bg-brand-card border border-brand-border/50 text-center relative">
              <button onClick={() => setSelectedAch(null)}
                className="absolute top-3 right-3 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-brand-surface transition-colors">
                <X size={18} />
              </button>
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-20 h-20 rounded-2xl bg-brand-accent/15 flex items-center justify-center text-5xl mx-auto mb-4 animate-glow">
                {selectedAch.icon}
              </motion.div>
              <h3 className="text-xl font-display font-bold text-white mb-1">{selectedAch.name}</h3>
              <p className="text-sm text-gray-400 mb-3">{selectedAch.description}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-mint/15 text-brand-mint text-xs font-medium">
                <Star size={12} /> {selectedAch.unlockedAt} 解锁
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
