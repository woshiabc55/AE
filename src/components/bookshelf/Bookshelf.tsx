import { useState } from "react";
import { ACTS, TOTAL_CHARS, TOTAL_DURATION } from "@/data/acts";
import { BookStand } from "./BookStand";
import { BookReader } from "./BookReader";
import { BrushTitle } from "@/components/common/BrushTitle";
import { Flame, ScrollText } from "lucide-react";
import { Link } from "react-router-dom";

export function Bookshelf() {
  const [openActId, setOpenActId] = useState<string | null>("act-1");

  return (
    <section className="relative">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <BrushTitle
          zh="剧本书架"
          en="SCRIPT BOOKSHELF · 5 VOLUMES"
          seal="壹"
        />
        <div className="flex items-center gap-2 text-xs font-mono text-mo-600">
          <ScrollText className="size-4" />
          <span className="tracking-[0.2em]">
            {ACTS.length} 卷 · {TOTAL_CHARS} 字 · {Math.floor(TOTAL_DURATION / 60)} 分钟
          </span>
        </div>
      </div>

      {/* 上方装饰条 */}
      <div className="flex items-center gap-3 mb-2">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mo-800/40 to-transparent" />
        <span className="font-mono text-[9px] tracking-[0.3em] text-mo-600">
          CLICK A VOLUME TO OPEN · 点击书脊以展卷
        </span>
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mo-800/40 to-transparent" />
      </div>

      {/* 书架主体 */}
      <div className="relative">
        {/* 顶板（光带） */}
        <div
          className="relative h-3 rounded-t-sm"
          style={{
            background:
              "linear-gradient(180deg, rgba(58,44,32,0.85) 0%, #5b4634 100%)",
            boxShadow:
              "inset 0 1px 0 rgba(245,236,213,0.2), 0 2px 0 rgba(0,0,0,0.2)",
          }}
        >
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.4) 0 1px, transparent 1px 5px)",
            }}
          />
        </div>

        {/* 书架背板（暗） */}
        <div
          className="relative px-3 py-8"
          style={{
            background:
              "linear-gradient(180deg, #2a2018 0%, #1a1410 100%)",
            boxShadow: "inset 0 0 80px rgba(0,0,0,0.6)",
          }}
        >
          {/* 装饰：左侧烛台 */}
          <Candle className="absolute left-3 top-1/2 -translate-y-1/2 hidden md:block" />
          {/* 装饰：右侧香炉 */}
          <Incense className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:block" />

          {/* 5 本书并排 */}
          <div className="relative z-10 flex items-end justify-center gap-1 min-h-[320px]">
            {ACTS.map((act, i) => (
              <BookStand
                key={act.id}
                act={act}
                index={i}
                total={ACTS.length}
                isOpen={openActId === act.id}
                onOpen={() =>
                  setOpenActId((prev) => (prev === act.id ? null : act.id))
                }
              />
            ))}
          </div>

          {/* 书本上的灰尘颗粒 */}
          <div className="absolute inset-0 pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => (
              <span
                key={i}
                className="absolute size-1 rounded-full bg-xuan-200/40"
                style={{
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${20 + (i * 11) % 70}%`,
                  opacity: 0.4 + (i % 3) * 0.1,
                }}
              />
            ))}
          </div>
        </div>

        {/* 底板（主架） */}
        <div
          className="relative h-7"
          style={{
            background:
              "linear-gradient(180deg, #6b4423 0%, #5b3818 50%, #3a2c20 100%)",
            boxShadow:
              "0 12px 30px -10px rgba(0,0,0,0.6), inset 0 1px 0 rgba(245,236,213,0.18), inset 0 -3px 0 rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background:
                "repeating-linear-gradient(90deg, rgba(0,0,0,0.3) 0 1px, transparent 1px 6px, rgba(0,0,0,0.4) 7px, transparent 7px 14px)",
            }}
          />
          {/* 金属标牌 */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2">
            <div
              className="font-xiao text-[10px] tracking-[0.4em] px-4 py-1 rounded-sm"
              style={{
                background:
                  "linear-gradient(180deg, #e6c25a 0%, #9b7517 100%)",
                color: "#1a1410",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 4px rgba(0,0,0,0.4)",
                border: "1px solid #5b3818",
              }}
            >
              燕 云 藏 书
            </div>
          </div>
        </div>

        {/* 下沿装饰 */}
        <div
          className="h-2 rounded-b-sm"
          style={{
            background:
              "linear-gradient(180deg, #3a2c20 0%, #1a1410 100%)",
          }}
        />
      </div>

      {/* 展开的阅读面板 */}
      {openActId && (
        <div className="mt-10">
          {(() => {
            const act = ACTS.find((a) => a.id === openActId);
            if (!act) return null;
            return <BookReader act={act} onClose={() => setOpenActId(null)} />;
          })()}
        </div>
      )}

      {/* 提示条 */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 text-xs font-serif text-mo-700">
        <span>
          「{openActId ? ACTS.find((a) => a.id === openActId)?.subtitle : "书架"}」 当前陈列中。
          <span className="text-mo-500">合上后可在分镜表按幕筛选复用镜头。</span>
        </span>
        <Link
          to="/storyboard"
          className="btn-ghost text-xs"
        >
          <Flame className="size-3.5" />
          进入分镜表
        </Link>
      </div>
    </section>
  );
}

function Candle({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-3 size-2 rounded-full"
            style={{
              background: "radial-gradient(circle, #e6c25a 0%, #c89a2a 70%)",
              boxShadow: "0 0 18px rgba(230,194,90,0.7)",
              animation: "flicker 1.6s ease-in-out infinite",
            }}
          />
          <div
            className="w-2 h-6"
            style={{
              background: "linear-gradient(180deg, #f5ecd5 0%, #a87a2c 100%)",
            }}
          />
        </div>
        <div
          className="w-6 h-2 rounded-sm"
          style={{
            background: "linear-gradient(180deg, #c89a2a 0%, #6b4423 100%)",
          }}
        />
        <div
          className="w-8 h-1.5 rounded-sm"
          style={{
            background: "linear-gradient(180deg, #5b3818 0%, #1a1410 100%)",
          }}
        />
      </div>
      <style>{`
        @keyframes flicker { 0%,100% { opacity: 0.85; } 50% { opacity: 1; } }
      `}</style>
    </div>
  );
}

function Incense({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <div className="flex flex-col items-center">
        {/* 三缕香烟 */}
        <div className="relative h-12 w-12">
          <div
            className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-3 rounded-full smoke-puff animate-smoke"
            style={{ animationDelay: "0s" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-1 w-3 h-3 rounded-full smoke-puff animate-smoke"
            style={{ animationDelay: "1.2s" }}
          />
          <div
            className="absolute left-1/2 -translate-x-1/2 top-2 w-3 h-3 rounded-full smoke-puff animate-smoke"
            style={{ animationDelay: "2.4s" }}
          />
        </div>
        {/* 香插 */}
        <div
          className="w-2 h-4"
          style={{ background: "linear-gradient(180deg, #a87a2c, #5b3818)" }}
        />
        <div
          className="w-8 h-2 rounded-sm"
          style={{ background: "linear-gradient(180deg, #5b4634, #1a1410)" }}
        />
        <div
          className="w-10 h-1.5 rounded-sm"
          style={{ background: "linear-gradient(180deg, #3a2c20, #0e0a07)" }}
        />
      </div>
    </div>
  );
}
