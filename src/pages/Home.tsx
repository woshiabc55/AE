import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, BookOpen, Users } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { useProgressStore } from "@/store/progressStore";

const SUBTITLES = [
  "探索语言的无限可能",
  "言葉の無限の可能性を探る",
  "언어의 무한한 가능성을 탐구하다",
];

const LANGUAGES = [
  {
    code: "en", name: "English", native: "English", flag: "🇬🇧",
    courses: 12, learners: "2.4k",
    pattern:
      "repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(212,168,83,0.08) 10px,rgba(212,168,83,0.08) 11px)",
  },
  {
    code: "ja", name: "Japanese", native: "日本語", flag: "🇯🇵",
    courses: 8, learners: "1.8k",
    pattern:
      "radial-gradient(circle 8px at 20px 20px,rgba(212,168,83,0.08) 50%,transparent 51%),radial-gradient(circle 8px at 0 20px,rgba(212,168,83,0.08) 50%,transparent 51%)",
  },
  {
    code: "ko", name: "Korean", native: "한국어", flag: "🇰🇷",
    courses: 6, learners: "1.2k",
    pattern:
      "repeating-linear-gradient(60deg,transparent,transparent 8px,rgba(212,168,83,0.07) 8px,rgba(212,168,83,0.07) 9px),repeating-linear-gradient(-60deg,transparent,transparent 8px,rgba(212,168,83,0.07) 8px,rgba(212,168,83,0.07) 9px)",
  },
];

const FLOATING_CHARS = [
  { char: "語", left: "10%", top: "20%", delay: 0, size: "2rem" },
  { char: "A", left: "82%", top: "15%", delay: 1.2, size: "1.5rem" },
  { char: "한", left: "62%", top: "72%", delay: 2.4, size: "1.8rem" },
  { char: "文", left: "25%", top: "78%", delay: 0.6, size: "1.6rem" },
  { char: "B", left: "88%", top: "48%", delay: 1.8, size: "2.2rem" },
  { char: "글", left: "42%", top: "28%", delay: 3, size: "1.4rem" },
];

const LEVEL_COLORS: Record<string, string> = {
  A1: "bg-green-100 text-green-700",
  A2: "bg-blue-100 text-blue-700",
  B1: "bg-amber-100 text-amber-700",
  B2: "bg-orange-100 text-orange-700",
  C1: "bg-red-100 text-red-700",
  C2: "bg-purple-100 text-purple-700",
};

const FLAG_EMOJI: Record<string, string> = { en: "🇬🇧", ja: "🇯🇵", ko: "🇰🇷" };

function HeroSection() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIdx((p) => (p + 1) % SUBTITLES.length);
        setFade(true);
      }, 500);
    }, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-500 to-primary-400 px-8 py-20 text-white">
      {FLOATING_CHARS.map((fc, i) => (
        <span
          key={i}
          className="pointer-events-none absolute font-display font-bold text-white/10"
          style={{
            left: fc.left,
            top: fc.top,
            fontSize: fc.size,
            animation: `bounce ${4 + fc.delay}s ease-in-out infinite`,
            animationDelay: `${fc.delay}s`,
          }}
        >
          {fc.char}
        </span>
      ))}
      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <h1 className="font-display text-6xl font-bold tracking-tight">
          LinguaVerse
        </h1>
        <p
          className="mt-4 font-body text-xl text-primary-200 transition-opacity duration-500"
          style={{ opacity: fade ? 1 : 0 }}
        >
          {SUBTITLES[idx]}
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="btn-accent mt-8 inline-flex items-center gap-2 text-lg"
        >
          开始学习之旅
          <ArrowRight size={20} />
        </button>
      </div>
    </section>
  );
}

function LanguageCards() {
  const navigate = useNavigate();

  return (
    <section className="px-8 py-16">
      <h2 className="font-display text-3xl font-bold text-primary">
        选择你的语言
      </h2>
      <p className="mt-2 font-body text-gray-500">开启一段全新的语言学习旅程</p>
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => navigate(`/courses?language=${lang.code}`)}
            className="group relative overflow-hidden rounded-lg bg-white p-6 text-left shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover hover:ring-2 hover:ring-accent"
          >
            <div className="absolute inset-0 opacity-50" style={{ background: lang.pattern }} />
            <div className="relative z-10">
              <span className="text-3xl">{lang.flag}</span>
              <h3 className="mt-3 font-display text-2xl font-bold text-primary">
                {lang.native}
              </h3>
              <p className="mt-1 font-body text-sm text-gray-500">{lang.name}</p>
              <div className="mt-4 flex items-center gap-4 font-body text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen size={14} /> {lang.courses} 课程
                </span>
                <span className="flex items-center gap-1">
                  <Users size={14} /> {lang.learners} 学习者
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function LearningOverview() {
  const { isAuthenticated } = useAuthStore();
  const { progress, fetchProgress } = useProgressStore();

  useEffect(() => {
    if (isAuthenticated) fetchProgress();
  }, [isAuthenticated, fetchProgress]);

  if (!isAuthenticated || !progress) return null;

  const dailyGoal = 30;
  const todayMin = progress.weeklyMinutes?.[6] ?? 0;
  const pct = Math.min((todayMin / dailyGoal) * 100, 100);
  const r = 40;
  const C = 2 * Math.PI * r;
  const offset = C - (pct / 100) * C;
  const maxMin = Math.max(...(progress.weeklyMinutes || [1]), 1);
  const days = ["一", "二", "三", "四", "五", "六", "日"];

  return (
    <section className="mx-8 rounded-lg bg-white p-6 shadow-card">
      <h2 className="font-display text-2xl font-bold text-primary">学习概览</h2>
      <div className="mt-6 flex flex-wrap items-center gap-8">
        <div className="flex flex-col items-center">
          <svg width="100" height="100" className="-rotate-90">
            <circle cx="50" cy="50" r={r} fill="none" stroke="#E8F0EC" strokeWidth="8" />
            <circle
              cx="50" cy="50" r={r} fill="none" stroke="#D4A853" strokeWidth="8"
              strokeDasharray={C} strokeDashoffset={offset}
              strokeLinecap="round" className="transition-all duration-700"
            />
          </svg>
          <span className="mt-2 font-body text-sm text-gray-500">
            今日 {todayMin}/{dailyGoal} 分钟
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Flame size={28} className="text-coral" />
          <div>
            <p className="font-display text-3xl font-bold text-primary">{progress.streak}</p>
            <p className="font-body text-sm text-gray-500">天连续学习</p>
          </div>
        </div>
        <div className="flex-1">
          <p className="mb-2 font-body text-sm text-gray-500">本周学习时间</p>
          <div className="flex items-end gap-1.5">
            {progress.weeklyMinutes?.map((mins, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className="w-6 rounded-t bg-primary/20 transition-all hover:bg-accent"
                  style={{ height: `${Math.max((mins / maxMin) * 60, 4)}px` }}
                  title={`${mins} 分钟`}
                />
                <span className="font-body text-[10px] text-gray-400">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedCourses() {
  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  if (courses.length === 0) return null;

  return (
    <section className="px-8 py-16">
      <h2 className="font-display text-3xl font-bold text-primary">精选课程</h2>
      <div className="mt-8 flex gap-5 overflow-x-auto pb-4">
        {courses.map((c) => (
          <div
            key={c.id}
            className="min-w-[260px] flex-shrink-0 rounded-lg bg-white p-5 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">{FLAG_EMOJI[c.language] ?? "📚"}</span>
              <span
                className={`rounded-pill px-2.5 py-0.5 font-body text-xs font-medium ${LEVEL_COLORS[c.level] ?? "bg-gray-100 text-gray-600"}`}
              >
                {c.level}
              </span>
            </div>
            <h3 className="mt-3 font-display text-lg font-semibold text-primary">{c.title}</h3>
            <p className="mt-1 line-clamp-2 font-body text-sm text-gray-500">{c.description}</p>
            <button className="btn-primary mt-4 w-full text-center text-sm">开始学习</button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="animate-fadeIn">
      <HeroSection />
      <LanguageCards />
      <LearningOverview />
      <FeaturedCourses />
    </div>
  );
}
