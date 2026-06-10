// 评分组件
import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Star } from "lucide-react";
import { db } from "@/db";
import { useAppStore } from "@/store";
import { timeAgo } from "@/utils/format";
import { toast } from "@/store/toast";

export function RatingSection({ templateId }: { templateId: string }) {
  const rate = useAppStore((s) => s.rateTemplate);
  const ratings = useLiveQuery(
    () =>
      db.ratings
        .where("templateId")
        .equals(templateId)
        .reverse()
        .sortBy("createdAt"),
    [templateId]
  );
  const [hover, setHover] = useState(0);
  const [val, setVal] = useState(5);
  const [body, setBody] = useState("");

  const avg = ratings && ratings.length > 0
    ? ratings.reduce((s, r) => s + r.stars, 0) / ratings.length
    : 0;

  return (
    <div className="panel">
      <div className="flex items-center justify-between border-b border-ink-700 px-4 py-2.5">
        <span className="label-overline">★ 评分</span>
        {ratings && ratings.length > 0 && (
          <span className="font-mono text-[11px] text-amber">
            {avg.toFixed(1)} / 5 · {ratings.length} 票
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => {
            const v = i + 1;
            const active = (hover || val) >= v;
            return (
              <button
                key={v}
                onMouseEnter={() => setHover(v)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setVal(v)}
                aria-label={`${v} 星`}
                className="p-0.5"
              >
                <Star
                  size={18}
                  className={active ? "text-amber fill-amber" : "text-ink-500"}
                />
              </button>
            );
          })}
          <span className="ml-2 font-mono text-[11px] text-paper-200">{val} / 5</span>
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="（可选）说两句…"
          rows={2}
          className="field-input font-serif text-[13px] w-full resize-none"
        />
        <button
          onClick={async () => {
            await rate(templateId, val, body || undefined);
            setBody("");
            toast.success("评分已提交", `${val} 星 · 谢谢你的反馈`);
          }}
          className="reel-button text-[10px] py-1.5 px-3 mt-2"
        >
          <Star size={11} /> 提交
        </button>
      </div>
      {ratings && ratings.length > 0 && (
        <div className="border-t border-ink-700 max-h-40 overflow-auto divide-y divide-ink-700">
          {ratings.map((r) => (
            <div key={r.id} className="px-4 py-2.5 flex items-start gap-2">
              <div className="flex items-center gap-0.5 mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={9}
                    className={i < r.stars ? "text-amber fill-amber" : "text-ink-600"}
                  />
                ))}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[10px] text-ink-300">
                  {r.reviewer} · {timeAgo(r.createdAt)}
                </div>
                {r.body && (
                  <div className="font-serif text-[12.5px] text-paper-200 mt-0.5">
                    {r.body}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
