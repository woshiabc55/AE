import { useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { BookOpen, Clock, Search } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import { useProgressStore } from "@/store/progressStore";
import { cn } from "@/lib/utils";
import type { Course } from "@/lib/api";

const LANGUAGES = [
  { key: "", label: "全部" },
  { key: "en", label: "English" },
  { key: "ja", label: "日本語" },
  { key: "ko", label: "한국어" },
];

const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

const langGradients: Record<string, string> = {
  en: "from-emerald-400 to-emerald-600",
  ja: "from-pink-400 to-pink-600",
  ko: "from-blue-400 to-blue-600",
};

const langColors: Record<string, string> = {
  en: "bg-emerald-100 text-emerald-700",
  ja: "bg-pink-100 text-pink-700",
  ko: "bg-blue-100 text-blue-700",
};

function CourseCard({ course, progress }: { course: Course; progress?: number }) {
  const navigate = useNavigate();
  const gradient = langGradients[course.language] || "from-gray-400 to-gray-600";
  const langBadge = langColors[course.language] || "bg-gray-100 text-gray-700";

  return (
    <button
      onClick={() => navigate(`/courses/${course.id}`)}
      className="group flex flex-col overflow-hidden rounded-lg bg-white shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-card-hover text-left"
    >
      <div className={cn("relative flex flex-col items-center justify-center bg-gradient-to-br p-8", gradient)}>
        <span className={cn("absolute left-3 top-3 rounded-pill px-2.5 py-0.5 text-xs font-semibold", langBadge)}>
          {course.language.toUpperCase()}
        </span>
        <span className="absolute right-3 top-3 rounded-pill bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
          {course.level}
        </span>
        <BookOpen size={40} className="text-white/80" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-primary line-clamp-1">
          {course.title}
        </h3>
        <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
          {course.description}
        </p>
        <div className="mt-auto flex items-center gap-4 pt-4 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <BookOpen size={14} />
            {course.totalLessons} 课时
          </span>
          <span className="flex items-center gap-1">
            <Clock size={14} />
            {course.duration} 分钟
          </span>
        </div>
        {progress !== undefined && progress > 0 && (
          <div className="mt-3">
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-gray-400">学习进度</span>
              <span className="font-medium text-accent">{Math.round(progress)}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-mint">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export default function Courses() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { courses, fetchCourses, isLoading } = useCourseStore();
  const { progress, fetchProgress } = useProgressStore();

  const langFilter = searchParams.get("language") || "";
  const levelFilter = searchParams.get("level") || "";

  useEffect(() => {
    fetchCourses(langFilter || undefined, levelFilter || undefined);
  }, [langFilter, levelFilter, fetchCourses]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const setFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  const courseProgress = useMemo(() => {
    const map: Record<string, number> = {};
    if (progress) {
      return map;
    }
    return map;
  }, [progress]);

  return (
    <div className="min-h-full p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">课程中心</h1>
        <p className="mt-1 text-gray-500">选择你感兴趣的语言和级别，开始学习之旅</p>
      </div>

      <div className="mb-8 space-y-4 rounded-lg bg-white p-5 shadow-card">
        <div className="flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">语言</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.key}
              onClick={() => setFilter("language", lang.key)}
              className={cn(
                "rounded-pill px-4 py-1.5 text-sm font-medium transition-all duration-200",
                langFilter === lang.key
                  ? "bg-accent text-primary shadow-sm"
                  : "bg-mint text-gray-600 hover:bg-primary-100"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-600">级别</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setFilter("level", levelFilter === level ? "" : level)}
              className={cn(
                "rounded-pill px-4 py-1.5 text-sm font-medium transition-all duration-200",
                levelFilter === level
                  ? "bg-accent text-primary shadow-sm"
                  : "bg-mint text-gray-600 hover:bg-primary-100"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 animate-pulse rounded-lg bg-white shadow-card" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <BookOpen size={48} className="text-gray-300" />
          <p className="mt-4 font-display text-xl text-gray-400">没有找到匹配的课程</p>
          <p className="mt-1 text-sm text-gray-400">试试调整筛选条件吧</p>
          <button
            onClick={() => setSearchParams({})}
            className="btn-accent mt-4"
          >
            清除筛选
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              progress={courseProgress[course.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
