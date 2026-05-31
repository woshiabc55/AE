import { useEffect, useState } from "react";
import { Trophy, Lock, Flame, BookOpen, Users, Star } from "lucide-react";
import { useAchievementStore } from "@/store/achievementStore";
import { useAuthStore } from "@/store/authStore";
import type { Achievement, LeaderboardEntry } from "@/lib/api";

const categoryIcons: Record<string, typeof BookOpen> = {
  study: BookOpen,
  social: Users,
  streak: Flame,
  mastery: Star,
};

const categoryLabels: Record<string, string> = {
  all: "全部",
  study: "学习",
  social: "社交",
  streak: "连续",
  mastery: "精通",
};

const avatarColors = ["bg-primary", "bg-accent", "bg-coral", "bg-primary-300", "bg-accent-300", "bg-coral-300"];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function HexBadge({ achievement }: { achievement: Achievement }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const Icon = categoryIcons[achievement.category] ?? Star;

  return (
    <div
      className="relative flex flex-col items-center"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div
        className={`relative flex h-20 w-20 items-center justify-center transition-all duration-300 ${
          achievement.unlocked ? "hover:scale-110" : "opacity-50 grayscale"
        }`}
        style={{
          clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
        }}
      >
        <div
          className={`absolute inset-0 ${
            achievement.unlocked
              ? "bg-gradient-to-br from-accent via-accent-300 to-primary-300"
              : "bg-gray-300"
          }`}
        />
        {achievement.unlocked && (
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
            }}
          />
        )}
        <div className="relative z-10 flex items-center justify-center">
          {achievement.unlocked ? (
            <Icon size={28} className="text-white" strokeWidth={2.5} />
          ) : (
            <Lock size={24} className="text-gray-500" />
          )}
        </div>
      </div>
      {achievement.unlocked && (
        <div
          className="absolute -inset-1 -z-10 rounded-full opacity-30 blur-md"
          style={{
            background: "radial-gradient(circle, rgba(212,168,83,0.6) 0%, transparent 70%)",
          }}
        />
      )}
      <span className={`mt-2 text-xs font-medium ${achievement.unlocked ? "text-primary" : "text-gray-400"}`}>
        {achievement.unlocked ? achievement.name : "???"}
      </span>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-48 rounded-lg bg-primary px-3 py-2 text-xs text-white shadow-lg pointer-events-none animate-fadeIn">
          <p className="font-bold mb-0.5">{achievement.name}</p>
          <p className="opacity-80">{achievement.description}</p>
          <p className="mt-1 text-accent">
            {achievement.unlocked ? "✓ 已解锁" : `需要: ${achievement.requirement}`}
          </p>
        </div>
      )}
    </div>
  );
}

function AchievementTab({ achievements }: { achievements: Achievement[] }) {
  const [category, setCategory] = useState("all");
  const filtered = category === "all" ? achievements : achievements.filter((a) => a.category === category);
  const unlocked = achievements.filter((a) => a.unlocked).length;
  const total = achievements.length;
  const progress = total > 0 ? (unlocked / total) * 100 : 0;

  return (
    <div>
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500">
            <span className="font-bold text-primary">{unlocked}</span>/{total} 成就已解锁
          </span>
          <span className="text-sm font-bold text-accent">{Math.round(progress)}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary-300 to-accent transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "study", "social", "streak", "mastery"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all ${
              category === cat
                ? "bg-primary text-white shadow-card"
                : "bg-surface text-gray-500 hover:bg-mint hover:text-primary"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {filtered.map((achievement) => (
          <HexBadge key={achievement.id} achievement={achievement} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="py-12 text-center text-gray-400">暂无该类别的成就</div>
      )}
    </div>
  );
}

function LeaderboardTab({ leaderboard }: { leaderboard: LeaderboardEntry[] }) {
  const { user } = useAuthStore();
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("week");
  const [sortBy, setSortBy] = useState<"streak" | "words" | "time">("time");

  const sortLabels: Record<string, string> = { streak: "连续天数", words: "单词数", time: "学习时长" };
  const timeLabels: Record<string, string> = { week: "周榜", month: "月榜", all: "总榜" };

  function getStatValue(entry: LeaderboardEntry) {
    if (sortBy === "streak") return { value: entry.coursesCompleted, unit: "天" };
    if (sortBy === "words") return { value: entry.wordsLearned, unit: "词" };
    return { value: Math.round(entry.studyTime / 60), unit: "小时" };
  }

  function getRankStyle(rank: number) {
    if (rank === 1) return "bg-gradient-to-r from-accent to-accent-300 text-primary font-bold";
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-200 text-gray-700 font-bold";
    if (rank === 3) return "bg-gradient-to-r from-coral-200 to-coral-100 text-coral-700 font-bold";
    return "bg-gray-100 text-gray-500";
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {(["week", "month", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all ${
                timeRange === range
                  ? "bg-primary text-white shadow-card"
                  : "bg-surface text-gray-500 hover:bg-mint hover:text-primary"
              }`}
            >
              {timeLabels[range]}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["streak", "words", "time"] as const).map((sort) => (
            <button
              key={sort}
              onClick={() => setSortBy(sort)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all ${
                sortBy === sort
                  ? "bg-accent text-primary shadow-card"
                  : "bg-surface text-gray-500 hover:bg-accent-50 hover:text-accent-600"
              }`}
            >
              {sortLabels[sort]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {leaderboard.map((entry) => {
          const stat = getStatValue(entry);
          const isCurrentUser = user?.id === entry.userId;
          return (
            <div
              key={entry.userId}
              className={`card flex items-center gap-4 py-3 ${
                isCurrentUser ? "ring-2 ring-accent bg-accent-50/30" : ""
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm ${getRankStyle(entry.rank)}`}
              >
                {entry.rank <= 3 ? (
                  <Trophy size={14} />
                ) : (
                  entry.rank
                )}
              </div>
              <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(entry.username)}`}>
                {entry.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary">
                  {entry.username}
                  {isCurrentUser && <span className="ml-2 text-xs text-accent">(你)</span>}
                </p>
              </div>
              <div className="text-right">
                <span className="font-display text-lg font-bold text-primary">{stat.value}</span>
                <span className="ml-1 text-xs text-gray-400">{stat.unit}</span>
              </div>
            </div>
          );
        })}
        {leaderboard.length === 0 && (
          <div className="py-12 text-center text-gray-400">暂无排行数据</div>
        )}
      </div>
    </div>
  );
}

export default function Achievements() {
  const { achievements, leaderboard, fetchAchievements, fetchLeaderboard, isLoading } = useAchievementStore();
  const [activeTab, setActiveTab] = useState<"badges" | "leaderboard">("badges");

  useEffect(() => {
    fetchAchievements();
    fetchLeaderboard();
  }, [fetchAchievements, fetchLeaderboard]);

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">成就中心</h1>
        <p className="text-sm text-gray-500 mt-1">收集徽章，挑战排行榜</p>
      </div>

      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setActiveTab("badges")}
          className={`rounded-pill px-6 py-2 text-sm font-semibold transition-all ${
            activeTab === "badges"
              ? "bg-primary text-white shadow-card"
              : "bg-surface text-gray-500 hover:bg-mint hover:text-primary"
          }`}
        >
          成就徽章
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={`rounded-pill px-6 py-2 text-sm font-semibold transition-all ${
            activeTab === "leaderboard"
              ? "bg-primary text-white shadow-card"
              : "bg-surface text-gray-500 hover:bg-mint hover:text-primary"
          }`}
        >
          排行榜
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <div className="card animate-pulse">
            <div className="h-3 w-full rounded-full bg-gray-200" />
          </div>
          <div className="flex flex-wrap justify-center gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="h-20 w-20 animate-pulse rounded-full bg-gray-200" style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }} />
                <div className="mt-2 h-3 w-12 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        </div>
      ) : activeTab === "badges" ? (
        <AchievementTab achievements={achievements} />
      ) : (
        <LeaderboardTab leaderboard={leaderboard} />
      )}
    </div>
  );
}
