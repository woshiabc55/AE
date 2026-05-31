import { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, PenTool, Mic, Headphones, Star, Users, Clock, CheckCircle, Target, ChevronLeft } from 'lucide-react';
import { courses, courseDetails } from '@/data/courses';
import { LANGUAGE_CONFIG, LEVEL_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';

const TYPE_ICON: Record<string, React.ElementType> = {
  vocabulary: BookOpen,
  grammar: PenTool,
  speaking: Mic,
  listening: Headphones,
};

const TYPE_LABEL: Record<string, string> = {
  vocabulary: '词汇',
  grammar: '语法',
  speaking: '口语',
  listening: '听力',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35 } },
};

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const { progress } = useStore();

  const course = useMemo(() => courses.find((c) => c.id === id), [id]);
  const detail = useMemo(() => (id ? courseDetails[id] : undefined), [id]);

  const completedSet = useMemo(() => new Set(progress.completedLessons), [progress.completedLessons]);

  const firstIncomplete = useMemo(() => {
    if (!detail) return null;
    return detail.lessons.find((l) => !completedSet.has(l.id)) || null;
  }, [detail, completedSet]);

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ background: '#1A1F36' }}>
        <p className="text-xl text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>课程未找到</p>
        <Link to="/courses" className="text-sm" style={{ color: '#FF6B4A' }}>
          ← 返回课程列表
        </Link>
      </div>
    );
  }

  const langConf = LANGUAGE_CONFIG[course.language];

  if (!detail) {
    return (
      <div className="min-h-screen" style={{ background: '#1A1F36' }}>
        <div className="relative h-56 md:h-72 overflow-hidden">
          <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #1A1F36)' }} />
          <Link to="/courses" className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white" style={{ background: 'rgba(26,31,54,0.7)' }}>
            <ChevronLeft className="w-4 h-4" /> 返回
          </Link>
        </div>
        <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10">
          <div className="rounded-2xl p-8" style={{ background: '#232847', border: '1px solid #3A4070' }}>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h1>
            <p className="mb-4" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>{course.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: `${langConf.color}22`, color: langConf.color }}>{course.level} · {LEVEL_CONFIG[course.level].name}</span>
              <div className="flex items-center gap-1"><Star className="w-4 h-4" style={{ color: '#FFD93D', fill: '#FFD93D' }} /><span className="text-white text-sm">{course.rating}</span></div>
              <div className="flex items-center gap-1"><Users className="w-4 h-4" style={{ color: '#8890B5' }} /><span className="text-sm" style={{ color: '#8890B5' }}>{course.enrolledCount.toLocaleString()}</span></div>
            </div>
            <p className="text-center py-12" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>课程详情正在制作中，敬请期待</p>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = detail.lessons.filter((l) => completedSet.has(l.id)).length;

  return (
    <div className="min-h-screen" style={{ background: '#1A1F36' }}>
      <div className="relative h-56 md:h-72 overflow-hidden">
        <img src={course.coverImage} alt={course.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, #1A1F36)' }} />
        <Link to="/courses" className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm text-white" style={{ background: 'rgba(26,31,54,0.7)' }}>
          <ChevronLeft className="w-4 h-4" /> 返回
        </Link>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-16 relative z-10 pb-16">
        <motion.div
          className="rounded-2xl p-8 mb-6"
          style={{ background: '#232847', border: '1px solid #3A4070' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>{course.title}</h1>
          <p className="mb-4" style={{ color: '#8890B5', fontFamily: 'Noto Sans SC, sans-serif' }}>{course.description}</p>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: `${langConf.color}22`, color: langConf.color }}>{course.level} · {LEVEL_CONFIG[course.level].name}</span>
            <div className="flex items-center gap-1"><Star className="w-4 h-4" style={{ color: '#FFD93D', fill: '#FFD93D' }} /><span className="text-white text-sm">{course.rating}</span></div>
            <div className="flex items-center gap-1"><Users className="w-4 h-4" style={{ color: '#8890B5' }} /><span className="text-sm" style={{ color: '#8890B5' }}>{course.enrolledCount.toLocaleString()} 人已加入</span></div>
            <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4" style={{ color: '#4ECDC4' }} /><span className="text-sm" style={{ color: '#4ECDC4' }}>{completedCount}/{detail.lessons.length} 课时完成</span></div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-3" style={{ fontFamily: 'Outfit, sans-serif' }}>学习目标</h2>
            <ul className="space-y-2">
              {detail.objectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#4ECDC4' }} />
                  <span className="text-sm" style={{ color: '#C8CDE0', fontFamily: 'Noto Sans SC, sans-serif' }}>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>适合人群</h2>
            <div className="flex items-start gap-2">
              <Target className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#FF6B4A' }} />
              <span className="text-sm" style={{ color: '#C8CDE0', fontFamily: 'Noto Sans SC, sans-serif' }}>{detail.targetAudience}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="rounded-2xl p-8"
          style={{ background: '#232847', border: '1px solid #3A4070' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <h2 className="text-lg font-semibold text-white mb-5" style={{ fontFamily: 'Outfit, sans-serif' }}>课程目录</h2>
          <motion.ol className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
            {detail.lessons.map((lesson) => {
              const Icon = TYPE_ICON[lesson.type] || BookOpen;
              const done = completedSet.has(lesson.id);
              return (
                <motion.li key={lesson.id} variants={itemVariants}>
                  <div
                    className="flex items-center gap-4 p-4 rounded-xl transition-colors duration-200"
                    style={{ background: done ? '#2A3058' : '#1E2340', border: `1px solid ${done ? '#3A4070' : '#2E3460'}` }}
                  >
                    <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: done ? '#4ECDC422' : '#3A4070', color: done ? '#4ECDC4' : '#8890B5' }}>
                      {lesson.order}
                    </span>
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: done ? '#4ECDC4' : '#8890B5' }} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${done ? 'text-white' : ''}`} style={{ color: done ? '#fff' : '#C8CDE0', fontFamily: 'Noto Sans SC, sans-serif' }}>
                        {lesson.title}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: '#6B7194' }}>{TYPE_LABEL[lesson.type]}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0" style={{ color: '#6B7194' }}>
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs">{lesson.duration}min</span>
                    </div>
                    {done && <CheckCircle className="w-5 h-5 flex-shrink-0" style={{ color: '#4ECDC4' }} />}
                  </div>
                </motion.li>
              );
            })}
          </motion.ol>

          {firstIncomplete && (
            <Link to={`/learn/${firstIncomplete.type}?lesson=${firstIncomplete.id}`}>
              <motion.button
                className="w-full mt-6 py-3 rounded-xl text-white font-semibold text-base"
                style={{ background: 'linear-gradient(135deg, #FF6B4A, #FF8F6B)', fontFamily: 'Noto Sans SC, sans-serif' }}
                whileHover={{ scale: 1.02, boxShadow: '0 6px 24px #FF6B4A44' }}
                whileTap={{ scale: 0.98 }}
              >
                继续学习
              </motion.button>
            </Link>
          )}
        </motion.div>
      </div>
    </div>
  );
}
