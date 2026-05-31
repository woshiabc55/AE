import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Users, Filter } from 'lucide-react';
import { courses } from '@/data/courses';
import { LANGUAGE_CONFIG, LEVEL_CONFIG, type Language, type Level } from '@/types';

const LANG_TABS: { key: Language | 'all'; label: string; color?: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'en', label: '英语', color: LANGUAGE_CONFIG.en.color },
  { key: 'ja', label: '日语', color: LANGUAGE_CONFIG.ja.color },
  { key: 'ko', label: '韩语', color: LANGUAGE_CONFIG.ko.color },
];

const LEVELS: Level[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
};

export default function Courses() {
  const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<Level | 'all'>('all');

  const filtered = useMemo(() => {
    return courses.filter((c) => {
      if (langFilter !== 'all' && c.language !== langFilter) return false;
      if (levelFilter !== 'all' && c.level !== levelFilter) return false;
      return true;
    });
  }, [langFilter, levelFilter]);

  return (
    <div className="min-h-screen" style={{ background: '#1A1F36' }}>
      <section className="px-6 pt-10 pb-6 max-w-6xl mx-auto">
        <motion.h1
          className="text-3xl md:text-4xl font-bold text-white mb-2"
          style={{ fontFamily: 'Outfit, sans-serif' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          课程中心
        </motion.h1>
        <motion.p
          className="text-base mb-8"
          style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          探索丰富的语言课程，找到适合你的学习路径
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-3 mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#232847' }}>
            {LANG_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setLangFilter(tab.key)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  background: langFilter === tab.key ? '#2A3058' : 'transparent',
                  color: langFilter === tab.key ? '#fff' : '#8890B5',
                  border: langFilter === tab.key ? '1px solid #3A4070' : '1px solid transparent',
                  fontFamily: 'Noto Sans SC, sans-serif',
                }}
              >
                {tab.color && (
                  <span className="w-2 h-2 rounded-full" style={{ background: tab.color }} />
                )}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#8890B5' }} />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as Level | 'all')}
              className="pl-9 pr-4 py-2 rounded-xl text-sm font-medium appearance-none cursor-pointer"
              style={{
                background: '#232847',
                color: levelFilter !== 'all' ? '#4ECDC4' : '#8890B5',
                border: '1px solid #3A4070',
                fontFamily: 'Noto Sans SC, sans-serif',
              }}
            >
              <option value="all">全部等级</option>
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {l} - {LEVEL_CONFIG[l].name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </section>

      <section className="px-6 pb-16 max-w-6xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>
              暂无符合条件的课程
            </p>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${langFilter}-${levelFilter}`}
          >
            {filtered.map((course) => {
              const langConf = LANGUAGE_CONFIG[course.language];
              return (
                <motion.div key={course.id} variants={cardVariants}>
                  <Link to={`/courses/${course.id}`}>
                    <motion.div
                      className="rounded-2xl overflow-hidden cursor-pointer"
                      style={{ background: '#2A3058', border: '1px solid #3A4070' }}
                      whileHover={{ y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.35)' }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="h-1.5" style={{ background: langConf.color }} />
                      <div className="relative">
                        <img
                          src={course.coverImage}
                          alt={course.title}
                          className="w-full h-40 object-cover"
                        />
                        <span
                          className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold"
                          style={{ background: `${langConf.color}dd`, color: '#fff' }}
                        >
                          {course.level}
                        </span>
                      </div>
                      <div className="p-5">
                        <h3
                          className="text-white font-semibold text-lg mb-2 truncate"
                          style={{ fontFamily: 'Outfit, sans-serif' }}
                        >
                          {course.title}
                        </h3>
                        <p
                          className="text-sm mb-4 line-clamp-2"
                          style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}
                        >
                          {course.description}
                        </p>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className="w-3.5 h-3.5"
                                style={{
                                  color: i < Math.round(course.rating) ? '#FFD93D' : '#3A4070',
                                  fill: i < Math.round(course.rating) ? '#FFD93D' : 'none',
                                }}
                              />
                            ))}
                            <span className="text-xs text-white ml-1">{course.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" style={{ color: '#8890B5' }} />
                            <span className="text-xs" style={{ color: '#8890B5' }}>
                              {course.enrolledCount.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <button
                          className="w-full py-2.5 rounded-xl text-white text-sm font-semibold transition-all duration-200"
                          style={{
                            background: 'linear-gradient(135deg, #FF6B4A, #FF8F6B)',
                            fontFamily: 'Noto Sans SC, sans-serif',
                          }}
                        >
                          开始学习
                        </button>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </div>
  );
}
