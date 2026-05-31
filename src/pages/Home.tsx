import { useStore } from '@/store/useStore';
import { courses } from '@/data/courses';
import { LANGUAGE_CONFIG } from '@/types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Mic, Headphones, ArrowRight, Flame, Star, Users } from 'lucide-react';
import ProgressRing from '@/components/ProgressRing';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const quickStartModules = [
  { type: 'vocabulary', icon: BookOpen, title: '词汇', desc: '掌握核心词汇', color: '#3B82F6' },
  { type: 'grammar', icon: PenTool, title: '语法', desc: '构建语言框架', color: '#4ECDC4' },
  { type: 'speaking', icon: Mic, title: '口语', desc: '流利表达自我', color: '#FF6B4A' },
  { type: 'listening', icon: Headphones, title: '听力', desc: '听懂母语者', color: '#FFD93D' },
];

const floatingBubbles = [
  { text: 'English', color: '#3B82F6', x: '15%', y: '30%', delay: 0 },
  { text: '日本語', color: '#A78BFA', x: '75%', y: '25%', delay: 0.5 },
  { text: '한국어', color: '#F472B6', x: '50%', y: '60%', delay: 1 },
];

export default function Home() {
  const { user, isAuthenticated, progress, currentLanguage } = useStore();
  const langConfig = LANGUAGE_CONFIG[currentLanguage];
  const dailyPercentage =
    isAuthenticated && user?.dailyGoal
      ? Math.min(100, Math.round((progress.dailyMinutes / user.dailyGoal) * 100))
      : 0;
  const filteredCourses = courses.filter((c) => c.language === currentLanguage).slice(0, 8);

  return (
    <div className="min-h-screen" style={{ background: '#1A1F36' }}>
      <section
        className="relative overflow-hidden px-6 py-20 text-center"
        style={{ background: 'linear-gradient(135deg, #1A1F36 0%, #232847 100%)' }}
      >
        {floatingBubbles.map((b, i) => (
          <motion.div
            key={i}
            className="absolute flex items-center justify-center rounded-full font-semibold text-white"
            style={{
              left: b.x,
              top: b.y,
              width: 90,
              height: 90,
              background: `radial-gradient(circle, ${b.color}44, ${b.color}22)`,
              border: `2px solid ${b.color}66`,
              fontSize: 14,
            }}
            animate={{ y: [0, -20, 0], scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: b.delay, ease: 'easeInOut' }}
          >
            {b.text}
          </motion.div>
        ))}
        <motion.h1
          className="relative z-10 text-4xl md:text-5xl font-bold text-white mb-4"
          style={{ fontFamily: 'Outfit, sans-serif' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          开启你的语言学习之旅
        </motion.h1>
        <motion.p
          className="relative z-10 text-lg mb-8"
          style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          沉浸式学习，让语言成为你的超能力
        </motion.p>
        <Link to="/courses">
          <motion.button
            className="relative z-10 px-8 py-3 rounded-full text-white font-semibold text-lg"
            style={{
              background: 'linear-gradient(135deg, #FF6B4A, #FF8F6B)',
              boxShadow: '0 4px 20px #FF6B4A44',
            }}
            whileHover={{ scale: 1.05, boxShadow: '0 6px 30px #FF6B4A66' }}
            whileTap={{ scale: 0.95 }}
          >
            开始学习 <ArrowRight className="inline ml-2 w-5 h-5" />
          </motion.button>
        </Link>
      </section>

      <section className="px-6 py-12 max-w-6xl mx-auto">
        {isAuthenticated ? (
          <motion.div
            className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
            style={{ background: '#232847', border: '1px solid #3A4070' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col items-center">
              <ProgressRing percentage={dailyPercentage} size={120} strokeWidth={10} color={langConfig.color} />
              <p className="mt-2 text-sm" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>
                今日进度
              </p>
            </div>
            <div className="flex-1 grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Flame className="w-5 h-5" style={{ color: '#FF6B4A' }} />
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {progress.streak}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#8890B5' }}>连续天数</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Star className="w-5 h-5" style={{ color: '#FFD93D' }} />
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {progress.totalXP}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#8890B5' }}>总经验值</p>
              </div>
              <div>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5" style={{ color: '#4ECDC4' }} />
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {progress.completedLessons}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#8890B5' }}>已完成课程</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="rounded-2xl p-8 text-center"
            style={{ background: 'linear-gradient(135deg, #232847, #2A3058)', border: '1px solid #3A4070' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>
              欢迎来到 LinguaVerse
            </h2>
            <p className="mb-6" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>
              登录后即可追踪学习进度，解锁个性化推荐
            </p>
            <Link to="/login">
              <button
                className="px-6 py-2.5 rounded-full text-white font-semibold"
                style={{ background: 'linear-gradient(135deg, #FF6B4A, #FF8F6B)' }}
              >
                立即登录
              </button>
            </Link>
          </motion.div>
        )}
      </section>

      <section className="px-6 py-8 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
          每日推荐
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              className="min-w-[260px] rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
              style={{ background: '#2A3058', border: '1px solid #3A4070' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
            >
              <div className="h-1.5" style={{ background: LANGUAGE_CONFIG[course.language]?.color || '#3B82F6' }} />
              <img src={course.coverImage} alt={course.title} className="w-full h-32 object-cover" />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 truncate" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  {course.title}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#3A4070', color: '#4ECDC4' }}>
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5" style={{ color: '#FFD93D' }} />
                    <span className="text-xs text-white">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" style={{ color: '#8890B5' }} />
                  <span className="text-xs" style={{ color: '#8890B5' }}>{course.enrolledCount} 人已加入</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-6 py-8 pb-16 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
          快速开始
        </h2>
        <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4" variants={containerVariants} initial="hidden" animate="visible">
          {quickStartModules.map((mod) => (
            <motion.div key={mod.type} variants={itemVariants}>
              <Link to={`/learn/${mod.type}`}>
                <div
                  className="rounded-xl p-6 text-center transition-colors"
                  style={{ background: '#2A3058', border: '1px solid #3A4070' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#323868')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#2A3058')}
                >
                  <div
                    className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
                    style={{ background: `${mod.color}22` }}
                  >
                    <mod.icon className="w-6 h-6" style={{ color: mod.color }} />
                  </div>
                  <h3 className="text-white font-semibold mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
                    {mod.title}
                  </h3>
                  <p className="text-xs" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>
                    {mod.desc}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
