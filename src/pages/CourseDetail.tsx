import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BookOpen, PenTool, Mic, Headphones, Clock, Target, CheckCircle, ArrowRight } from "lucide-react";
import { useCourseStore } from "@/store/courseStore";
import { cn } from "@/lib/utils";
import type { Lesson } from "@/lib/api";

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

const typeIcons: Record<string, typeof BookOpen> = {
  vocabulary: BookOpen,
  grammar: PenTool,
  speaking: Mic,
  listening: Headphones,
};

const typeLabels: Record<string, string> = {
  vocabulary: "单词记忆",
  grammar: "语法练习",
  speaking: "口语跟读",
  listening: "听力训练",
};

const typeColors: Record<string, string> = {
  vocabulary: "text-emerald-500",
  grammar: "text-purple-500",
  speaking: "text-coral",
  listening: "text-blue-500",
};

function LessonRow({
  lesson,
  isCompleted,
  onClick,
}: {
  lesson: Lesson;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const Icon = typeIcons[lesson.type] || BookOpen;
  const color = typeColors[lesson.type] || "text-gray-500";

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-4 rounded-lg border border-gray-100 bg-white p-4 transition-all duration-200 hover:border-accent/30 hover:shadow-card-hover text-left"
    >
      <div className={cn("flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50", color)}>
        <Icon size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-400">L{lesson.order}</span>
          <h4 className="truncate text-sm font-semibold text-primary">{lesson.title}</h4>
        </div>
        <span className="text-xs text-gray-400">{typeLabels[lesson.type]}</span>
      </div>
      {isCompleted && <CheckCircle size={20} className="flex-shrink-0 text-accent" />}
      {!isCompleted && <ArrowRight size={16} className="flex-shrink-0 text-gray-300" />}
    </button>
  );
}

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentCourse, lessons, fetchCourseDetail, fetchLessons, clearCurrentCourse, isLoading } = useCourseStore();

  useEffect(() => {
    if (id) {
      fetchCourseDetail(id);
      fetchLessons(id);
    }
    return () => clearCurrentCourse();
  }, [id, fetchCourseDetail, fetchLessons, clearCurrentCourse]);

  if (isLoading || !currentCourse) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const gradient = langGradients[currentCourse.language] || "from-gray-400 to-gray-600";
  const langBadge = langColors[currentCourse.language] || "bg-gray-100 text-gray-700";

  const objectives = [
    `掌握${currentCourse.language.toUpperCase()} ${currentCourse.level} 级别核心词汇与表达`,
    `理解并运用 ${currentCourse.totalLessons} 个课时的重点语法结构`,
    `提升听说读写四项语言技能的综合运用能力`,
    `能够就日常话题进行流利自然的交流`,
  ];

  const handleStartLearning = () => {
    if (lessons.length > 0) {
      navigate(`/learn/${currentCourse.id}?lesson=${lessons[0].id}`);
    }
  };

  return (
    <div className="min-h-full">
      <div className={cn("bg-gradient-to-br p-8", gradient)}>
        <div className="mx-auto max-w-5xl">
          <button
            onClick={() => navigate("/courses")}
            className="mb-4 text-sm text-white/70 transition-colors hover:text-white"
          >
            ← 返回课程列表
          </button>
          <div className="flex items-center gap-3 mb-3">
            <span className={cn("rounded-pill px-3 py-1 text-xs font-semibold", langBadge)}>
              {currentCourse.language.toUpperCase()}
            </span>
            <span className="rounded-pill bg-white/20 px-3 py-1 text-xs font-semibold text-white">
              {currentCourse.level}
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-white">{currentCourse.title}</h1>
          <p className="mt-2 max-w-2xl text-white/80">{currentCourse.description}</p>
          <div className="mt-4 flex items-center gap-6 text-sm text-white/70">
            <span className="flex items-center gap-1.5">
              <BookOpen size={16} />
              {currentCourse.totalLessons} 课时
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={16} />
              {currentCourse.duration} 分钟
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-lg bg-white p-6 shadow-card">
              <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-primary">
                <Target size={20} className="text-accent" />
                学习目标
              </h2>
              <ul className="mt-4 space-y-3">
                {objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <CheckCircle size={16} className="mt-0.5 flex-shrink-0 text-accent" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={handleStartLearning} className="btn-accent w-full py-3 text-center text-base">
              开始学习
            </button>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 font-display text-xl font-semibold text-primary">课程内容</h2>
            <div className="space-y-3">
              {lessons.map((lesson) => (
                <LessonRow
                  key={lesson.id}
                  lesson={lesson}
                  isCompleted={false}
                  onClick={() => navigate(`/learn/${currentCourse.id}?lesson=${lesson.id}`)}
                />
              ))}
            </div>
            {lessons.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <BookOpen size={36} />
                <p className="mt-2 text-sm">暂无课程内容</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
