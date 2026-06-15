import { Plus, Trash2, ChevronRight } from "lucide-react";
import { useProjectStore } from "@/store/useProjectStore";
import { formatTimeShort } from "@/utils/time";

export default function ChapterList() {
  const {
    project,
    currentTime,
    setCurrentTime,
    addChapter,
    removeChapter,
    updateChapter,
    selectedChapterId,
    selectChapter,
  } = useProjectStore();

  return (
    <section className="panel p-3 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="label-cap flex items-center gap-1.5">
          <ChevronRight size={11} />
          CHAPTERS · 章节
        </div>
        <button
          className="btn btn-ghost h-6 px-1.5"
          onClick={() => addChapter()}
          title="在当前时间新建章节"
        >
          <Plus size={12} />
        </button>
      </div>
      {project.chapters.length === 0 ? (
        <p className="text-xs text-dim py-3 text-center">尚无章节</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {project.chapters
            .slice()
            .sort((a, b) => a.start - b.start)
            .map((c) => {
              const active = selectedChapterId === c.id;
              const inRange = currentTime >= c.start && currentTime <= c.end;
              return (
                <li
                  key={c.id}
                  onClick={() => {
                    selectChapter(c.id);
                    setCurrentTime(c.start);
                  }}
                  className={`group relative cursor-pointer rounded border transition px-2.5 py-2 ${
                    active
                      ? "border-mint bg-mint/5"
                      : inRange
                      ? "border-line bg-panel2"
                      : "border-line bg-panel2/40 hover:border-mute"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                      style={{ background: c.color }}
                    />
                    <input
                      value={c.title}
                      onChange={(e) =>
                        updateChapter(c.id, { title: e.target.value })
                      }
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent text-fg text-xs flex-1 outline-none focus:bg-panel rounded px-1"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeChapter(c.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-dim hover:text-rose transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5 tabular text-[10px] text-mute">
                    <span>{formatTimeShort(c.start)}</span>
                    <span className="text-dim">→</span>
                    <span>{formatTimeShort(c.end)}</span>
                    <span className="text-dim ml-auto">
                      {formatTimeShort(c.end - c.start)}
                    </span>
                  </div>
                </li>
              );
            })}
        </ul>
      )}
    </section>
  );
}
