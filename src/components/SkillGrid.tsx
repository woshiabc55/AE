import { useUIStore, selectVisibleSkills } from "@/store/ui";
import { SkillCard } from "./SkillCard";
import { Inbox } from "lucide-react";

/**
 * SkillGrid —— 响应式技能网格
 */
export function SkillGrid() {
  const state = useUIStore();
  const skills = selectVisibleSkills(state);

  if (skills.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-2 text-ark-silver/55">
        <Inbox className="h-10 w-10" />
        <div className="font-display tracking-widest">NO SKILLS · EMPTY ARCHIVE</div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 网格标题 */}
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-[0.18em] text-ark-white">
            SKILL · BATCH
          </h2>
          <p className="mt-1 text-[12px] tracking-wider text-ark-silver/55">
            点击任意技能卡片以激活「光效释放」并查看完整描述
          </p>
        </div>
        <div className="hidden items-center gap-2 md:flex">
          <span className="block h-1.5 w-1.5 animate-blink rounded-full bg-ark-cyan" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-ark-cyan">
            LIVE · SYNCING
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((sk, i) => (
          <SkillCard key={sk.id} skill={sk} index={i} />
        ))}
      </div>
    </div>
  );
}
