import { useEffect, useState } from "react";
import { Clock, BookOpen, GraduationCap, Flame } from "lucide-react";
import { useProgressStore } from "@/store/progressStore";
import { useAuthStore } from "@/store/authStore";

function StatCard({ icon: Icon, value, label, color }: { icon: typeof Clock; value: string | number; label: string; color: string }) {
  return (
    <div className="card relative overflow-hidden">
      <div className={`absolute -right-3 -top-3 ${color} opacity-10`}>
        <Icon size={64} />
      </div>
      <div className="relative">
        <Icon size={20} className={`${color} mb-2`} />
        <p className="font-display text-2xl font-bold text-primary">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-lg bg-white p-6 shadow-card">
      <div className="h-5 w-5 rounded bg-gray-200 mb-2" />
      <div className="h-7 w-20 rounded bg-gray-200 mb-1" />
      <div className="h-4 w-16 rounded bg-gray-200" />
    </div>
  );
}

function StudyCalendar({ calendar }: { calendar: Record<string, { minutes: number; lessonsCompleted: number }> | null }) {
  const [tooltip, setTooltip] = useState<{ date: string; minutes: number; x: number; y: number } | null>(null);
  const weeks = 52;
  const days = 7;
  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - (weeks * 7 - 1) - startDate.getDay());

  const monthLabels: { label: string; col: number }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + w * 7);
    if (d.getMonth() !== lastMonth) {
      lastMonth = d.getMonth();
      monthLabels.push({ label: `${d.getMonth() + 1}月`, col: w });
    }
  }

  function getCellColor(minutes: number) {
    if (minutes === 0) return "bg-gray-100";
    if (minutes < 30) return "bg-primary-200";
    if (minutes < 60) return "bg-primary-300";
    return "bg-primary-400";
  }

  function getCellDate(week: number, day: number) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + week * 7 + day);
    return d;
  }

  function formatDate(d: Date) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-primary mb-4">学习日历</h3>
      <div className="overflow-x-auto">
        <div className="inline-flex flex-col gap-0.5">
          <div className="flex gap-0.5 mb-1">
            <div className="w-6" />
            {monthLabels.map((m, i) => (
              <div
                key={i}
                className="text-[10px] text-gray-400"
                style={{ marginLeft: i === 0 ? m.col * 13 : (m.col - monthLabels[i - 1].col) * 13 - 13 }}
              >
                {m.label}
              </div>
            ))}
          </div>
          {Array.from({ length: days }).map((_, day) => (
            <div key={day} className="flex items-center gap-0.5">
              <span className="w-6 text-[10px] text-gray-400 text-right pr-1">{dayLabels[day]}</span>
              {Array.from({ length: weeks }).map((_, week) => {
                const cellDate = getCellDate(week, day);
                const dateStr = formatDate(cellDate);
                const minutes = calendar?.[dateStr]?.minutes ?? 0;
                const isFuture = cellDate > today;
                return (
                  <div
                    key={week}
                    className={`h-[11px] w-[11px] rounded-[2px] ${isFuture ? "bg-transparent" : getCellColor(minutes)} cursor-pointer transition-transform hover:scale-150`}
                    onMouseEnter={(e) => {
                      if (!isFuture) setTooltip({ date: dateStr, minutes, x: e.clientX, y: e.clientY });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <span>少</span>
          <div className="h-[11px] w-[11px] rounded-[2px] bg-gray-100" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary-200" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary-300" />
          <div className="h-[11px] w-[11px] rounded-[2px] bg-primary-400" />
          <span>多</span>
        </div>
      </div>
      {tooltip && (
        <div
          className="fixed z-50 rounded-lg bg-primary px-3 py-2 text-xs text-white shadow-lg pointer-events-none"
          style={{ left: tooltip.x + 12, top: tooltip.y - 36 }}
        >
          <div className="font-medium">{tooltip.date}</div>
          <div>{tooltip.minutes > 0 ? `学习 ${tooltip.minutes} 分钟` : "无学习记录"}</div>
        </div>
      )}
    </div>
  );
}

function WeeklyChart({ weeklyMinutes }: { weeklyMinutes: number[] }) {
  const dayLabels = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;
  const maxMinutes = Math.max(...weeklyMinutes, 1);

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-primary mb-4">本周学习时间</h3>
      <div className="flex items-end gap-3 h-48">
        {weeklyMinutes.map((minutes, i) => {
          const height = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;
          const isToday = i === todayIndex;
          return (
            <div key={i} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-500">{minutes}m</span>
              <div className="w-full flex items-end justify-center" style={{ height: "140px" }}>
                <div
                  className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ${
                    isToday ? "bg-accent" : "bg-primary-300"
                  }`}
                  style={{ height: `${Math.max(height, 2)}%` }}
                />
              </div>
              <span className={`text-xs ${isToday ? "font-bold text-accent" : "text-gray-400"}`}>
                {dayLabels[i]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function LearningPath({ level }: { level: string }) {
  const levels = ["A1", "A2", "B1", "B2", "C1", "C2"];
  const currentIndex = levels.indexOf(level);
  const progress = currentIndex >= 0 ? ((currentIndex + 0.6) / levels.length) * 100 : 10;
  const nextLevel = currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-primary mb-4">学习路径</h3>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            当前等级 <span className="font-bold text-primary">{level}</span>
            {nextLevel && <> → 下一等级 <span className="font-bold text-accent">{nextLevel}</span></>}
          </span>
          <span className="text-sm font-medium text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-300 to-accent transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        {levels.map((l, i) => (
          <div key={l} className="flex flex-col items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all ${
                i <= currentIndex
                  ? "bg-primary text-white shadow-card"
                  : i === currentIndex + 1
                  ? "border-2 border-accent text-accent"
                  : "border-2 border-gray-200 text-gray-300"
              }`}
            >
              {i <= currentIndex ? "✓" : l}
            </div>
            <span className={`mt-1 text-[10px] ${i <= currentIndex ? "text-primary font-medium" : "text-gray-300"}`}>
              {l}
            </span>
          </div>
        ))}
      </div>
      {nextLevel && (
        <div className="mt-4 rounded-lg bg-mint p-3">
          <p className="text-sm text-primary">
            解锁 <span className="font-bold">{nextLevel}</span> 需要：完成更多课程并积累学习时长
          </p>
        </div>
      )}
    </div>
  );
}

export default function Progress() {
  const { progress, calendar, stats, fetchProgress, fetchCalendar, fetchStats, isLoading } = useProgressStore();
  const { user } = useAuthStore();

  useEffect(() => {
    fetchProgress();
    fetchCalendar();
    fetchStats();
  }, [fetchProgress, fetchCalendar, fetchStats]);

  if (isLoading && !progress) {
    return (
      <div className="p-8 animate-fadeIn">
        <div className="mb-8">
          <div className="h-8 w-48 rounded bg-gray-200 animate-pulse mb-2" />
          <div className="h-5 w-32 rounded bg-gray-200 animate-pulse" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="h-64 rounded-lg bg-gray-100 animate-pulse mb-6" />
      </div>
    );
  }

  const studyHours = stats ? Math.round(stats.totalStudyTime / 60) : progress ? Math.round(progress.totalStudyTime / 60) : 0;
  const wordsLearned = stats?.totalWordsLearned ?? progress?.wordsLearned ?? 0;
  const coursesCompleted = stats?.totalCoursesCompleted ?? progress?.coursesCompleted ?? 0;
  const streak = stats?.currentStreak ?? progress?.streak ?? 0;
  const weeklyMinutes = progress?.weeklyMinutes ?? [0, 0, 0, 0, 0, 0, 0];

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-primary">学习进度</h1>
        <div className="mt-2 flex items-center gap-3">
          <span className="rounded-pill bg-mint px-3 py-1 text-sm font-medium text-primary">
            {user?.targetLanguage?.toUpperCase() ?? "EN"}
          </span>
          <span className="rounded-pill bg-accent-50 px-3 py-1 text-sm font-bold text-accent-600">
            {progress?.currentLevel ?? user?.level ?? "A1"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon={Clock} value={studyHours} label="学习时长 (小时)" color="text-primary-400" />
        <StatCard icon={BookOpen} value={wordsLearned} label="已学单词" color="text-accent" />
        <StatCard icon={GraduationCap} value={coursesCompleted} label="完成课程" color="text-coral" />
        <StatCard icon={Flame} value={streak} label="连续天数" color="text-coral-500" />
      </div>

      <div className="mb-6">
        <StudyCalendar calendar={calendar} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <WeeklyChart weeklyMinutes={weeklyMinutes} />
        <LearningPath level={progress?.currentLevel ?? user?.level ?? "A1"} />
      </div>
    </div>
  );
}
