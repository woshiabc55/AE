import { useStore } from '@/store/useStore';
import { LANGUAGE_CONFIG, type Language } from '@/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';
import { Flame, Star, BookOpen, CheckCircle, TrendingUp, Calendar, Target } from 'lucide-react';

const LANG_COLORS: Record<Language, string> = { en: '#3B82F6', ja: '#A78BFA', ko: '#F472B6' };

const generateCalendarData = () =>
  Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return { date: d, minutes: Math.random() > 0.25 ? Math.floor(Math.random() * 65) + 5 : 0 };
  });

const calendarData = generateCalendarData();

const getHeatColor = (minutes: number) => {
  if (minutes === 0) return '#232847';
  if (minutes < 15) return '#3D2A4A';
  if (minutes < 30) return '#6B3545';
  if (minutes < 60) return '#B84A3A';
  return '#FF6B4A';
};

const SKILL_META: Record<string, { label: string; type: string; icon: typeof BookOpen }> = {
  vocabulary: { label: '词汇强化', type: 'vocabulary', icon: BookOpen },
  grammar: { label: '语法练习', type: 'grammar', icon: Target },
  speaking: { label: '口语训练', type: 'speaking', icon: TrendingUp },
  listening: { label: '听力提升', type: 'listening', icon: Star },
};

const itemVar = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

export default function Dashboard() {
  const { user, progress, currentLanguage } = useStore();
  const langColor = LANG_COLORS[currentLanguage];
  const langConfig = LANGUAGE_CONFIG[currentLanguage];

  const radarData = [
    { subject: '词汇', value: progress.vocabularyMastered },
    { subject: '语法', value: progress.grammarMastered },
    { subject: '口语', value: progress.speakingScore },
    { subject: '听力', value: progress.listeningScore },
  ];

  const skills = [
    { key: 'vocabulary', score: progress.vocabularyMastered },
    { key: 'grammar', score: progress.grammarMastered },
    { key: 'speaking', score: progress.speakingScore },
    { key: 'listening', score: progress.listeningScore },
  ].sort((a, b) => a.score - b.score);

  const recommendations = [
    { ...SKILL_META[skills[0].key], reason: `${SKILL_META[skills[0].key].label}是你的薄弱项，加强练习！` },
    { ...SKILL_META[skills[1].key], reason: `${SKILL_META[skills[1].key].label}也需要进一步提升` },
    { label: '每日复习', type: 'review', icon: Calendar, reason: '保持连续学习，巩固记忆效果' },
  ];

  const stats = [
    { icon: Star, value: progress.totalXP, label: '总经验值', color: '#FFD93D' },
    { icon: Flame, value: progress.streak, label: '连续天数', color: '#FF6B4A' },
    { icon: BookOpen, value: progress.vocabularyMastered, label: '已掌握词汇', color: '#4ECDC4' },
    { icon: CheckCircle, value: progress.completedLessons.length, label: '已完成课程', color: '#3B82F6' },
  ];

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: '#1A1F36', fontFamily: 'Noto Sans SC, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>学习仪表盘</h1>
        <span className="px-3 py-1 rounded-full text-sm font-semibold text-white" style={{ background: langColor }}>
          {langConfig.name}
        </span>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-4 flex items-center gap-3"
            style={{ background: '#2A3058', border: '1px solid #3A4070' }}
          >
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${s.color}20` }}>
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div>
              <div className="text-xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>{s.value}</div>
              <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl p-4"
          style={{ background: '#2A3058', border: '1px solid #3A4070' }}
        >
          <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>能力雷达</h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#3A4070" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <PolarRadiusAxis tick={false} axisLine={false} domain={[0, 100]} />
              <Radar dataKey="value" stroke={langColor} fill={langColor} fillOpacity={0.3} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl p-4"
          style={{ background: '#2A3058', border: '1px solid #3A4070' }}
        >
          <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>本周学习</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={progress.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3A4070" />
              <XAxis dataKey="day" tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <YAxis tick={{ fill: '#94A3B8', fontSize: 12 }} />
              <Tooltip contentStyle={{ background: '#232847', border: '1px solid #3A4070', borderRadius: 8 }} labelStyle={{ color: '#94A3B8' }} />
              <Bar dataKey="minutes" fill="#FF6B4A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{ background: '#2A3058', border: '1px solid #3A4070' }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>学习日历</h2>
          <span className="text-sm flex items-center gap-1" style={{ color: '#FF6B4A' }}>
            <Flame size={14} /> {progress.streak} 天连续
          </span>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarData.map((d, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.02 }}
              className="aspect-square rounded-md flex items-center justify-center text-xs cursor-default"
              style={{ background: getHeatColor(d.minutes), color: d.minutes > 0 ? '#E2E8F0' : '#475569' }}
              title={`${d.date.getMonth() + 1}/${d.date.getDate()}: ${d.minutes}分钟`}
            >
              {d.date.getDate()}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl p-4"
        style={{ background: '#2A3058', border: '1px solid #3A4070' }}
      >
        <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>个性化推荐</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendations.map((r, i) => (
            <motion.div key={i} variants={itemVar} initial="hidden" animate="visible" transition={{ delay: i * 0.15 }}>
              <Link
                to={`/learn/${r.type}`}
                className="block rounded-lg p-4 transition-transform hover:scale-[1.02]"
                style={{ background: '#232847', border: '1px solid #3A4070' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <r.icon size={18} style={{ color: '#FF6B4A' }} />
                  <span className="text-white font-semibold text-sm">{r.label}</span>
                </div>
                <p className="text-xs" style={{ color: '#94A3B8' }}>{r.reason}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
