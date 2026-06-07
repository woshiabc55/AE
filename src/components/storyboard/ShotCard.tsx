import { Check, Copy, Film, Music, Timer } from "lucide-react";
import type { Shot } from "@/data/shots";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";
import { CAST } from "@/data/cast";
import { FX } from "@/data/fx";

type Props = {
  shot: Shot;
  index: number;
};

export function ShotCard({ shot, index }: Props) {
  const { copied, copy } = useCopy();
  const casts = (shot.castIds || []).map((id) =>
    CAST.find((c) => c.id === id),
  );
  const fx = shot.fxId ? FX.find((f) => f.id === shot.fxId) : null;

  return (
    <article
      id={shot.id}
      className={cn(
        "card-paper w-[320px] shrink-0 tick pt-6 rounded-sm flex flex-col",
        "hover:shadow-scroll transition-shadow",
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* 镜号 + 景别 */}
      <header className="px-5 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
            SHOT
          </span>
          <span className="font-xiao text-2xl text-zhu-500 tracking-[0.1em]">
            {shot.number}
          </span>
        </div>
        <span className="chip text-[10px]">{shot.shotType}</span>
      </header>

      {/* 缩略图占位（CSS 绘制） */}
      <div className="mx-5 h-32 relative overflow-hidden border border-mo-800/30">
        <ShotThumb shot={shot} />
      </div>

      {/* 一句话摘要 */}
      <div className="px-5 mt-4">
        <h4 className="font-brush text-lg text-mo-900 leading-snug">
          {shot.summary}
        </h4>
        <p className="mt-1 text-[11px] font-mono tracking-[0.2em] text-mo-600">
          {shot.movement} · {shot.duration}s
        </p>
      </div>

      {/* 画面描述 */}
      <div className="px-5 mt-3">
        <div className="font-mono text-[10px] tracking-[0.2em] text-mo-600">
          画面描述 / VISUAL
        </div>
        <p className="mt-1 text-sm font-serif text-mo-800 leading-relaxed">
          {shot.visualCn}
        </p>
      </div>

      {/* 配乐情绪 */}
      <div className="px-5 mt-3 flex items-center gap-2 text-xs font-serif text-mo-700">
        <Music className="size-3.5 text-zhu-500" />
        <span>{shot.music}</span>
      </div>

      {/* 人物标签 */}
      {casts.length > 0 && (
        <div className="px-5 mt-2 flex flex-wrap gap-1.5">
          {casts.map(
            (c) =>
              c && (
                <a
                  key={c.id}
                  href={`/cast#${c.id}`}
                  className={cn(
                    "chip text-[10px] hover:text-zhu-500",
                    c.faction === "宋" &&
                      "border-zhu-500/40 text-zhu-500",
                    c.faction === "辽" &&
                      "border-qi-500/40 text-qi-500",
                    c.faction === "北汉" &&
                      "border-jin-400/40 text-jin-500",
                  )}
                >
                  {c.name}
                </a>
              ),
          )}
        </div>
      )}

      {/* 特效标签 */}
      {fx && (
        <div className="px-5 mt-2">
          <a
            href={`/fx#${fx.id}`}
            className="chip text-[10px] border-jin-400/60 text-jin-500 hover:text-zhu-500"
          >
            <Film className="size-3" /> 特效：{fx.name}
          </a>
        </div>
      )}

      {/* 英文 Prompt */}
      <div className="mx-5 mt-4 mb-5 p-3 bg-mo-900 text-xuan-100 rounded-sm border border-mo-900/30">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-xuan-300">
            AI Prompt · EN
          </span>
          <button
            aria-label="复制提示词"
            onClick={() => copy(shot.promptEn)}
            className="text-xuan-300 hover:text-jin-300 inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.2em]"
          >
            {copied ? (
              <>
                <Check className="size-3" /> COPIED
              </>
            ) : (
              <>
                <Copy className="size-3" /> COPY
              </>
            )}
          </button>
        </div>
        <p className="font-mono text-[10.5px] leading-relaxed text-xuan-100/90 line-clamp-[10]">
          {shot.promptEn}
        </p>
      </div>

      {/* 时长条 */}
      <div className="px-5 pb-4 mt-auto flex items-center gap-1">
        <Timer className="size-3 text-mo-600" />
        <div className="flex-1 h-1 bg-mo-800/15 rounded-sm overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-zhu-500 to-jin-400"
            style={{ width: `${Math.min(100, (shot.duration / 12) * 100)}%` }}
          />
        </div>
        <span className="font-mono text-[10px] text-mo-600">{shot.duration}s</span>
      </div>
    </article>
  );
}

// 缩略图占位：纯 CSS/SVG 绘制镜头示意
function ShotThumb({ shot }: { shot: Shot }) {
  // 根据景别/关键词生成背景
  const palette = pickPalette(shot);
  return (
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(160deg, ${palette.from} 0%, ${palette.to} 100%)`,
      }}
    >
      <svg
        viewBox="0 0 200 120"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* 远山 */}
        <path
          d="M0 90 L40 60 L70 80 L120 50 L170 75 L200 60 L200 120 L0 120 Z"
          fill="rgba(14,10,7,0.25)"
        />
        <path
          d="M0 100 L30 80 L80 95 L130 75 L200 90 L200 120 L0 120 Z"
          fill="rgba(14,10,7,0.4)"
        />
        {/* 太阳 / 月亮 */}
        <circle
          cx={shot.shotType === "特写" ? 100 : 165}
          cy="30"
          r={shot.shotType === "大远景" ? 18 : 10}
          fill="rgba(245,236,213,0.7)"
        />
        {/* 旗帜 */}
        {shot.id.startsWith("s-1-1") || shot.id.startsWith("s-3-1") ? (
          <g>
            {[20, 60, 100, 140, 180].map((x, i) => (
              <g key={i}>
                <line
                  x1={x}
                  y1={20}
                  x2={x}
                  y2={80}
                  stroke="#1a1410"
                  strokeWidth="1.5"
                />
                <path
                  d={`M${x} 22 L${x + 18} 26 L${x + 14} 36 L${x + 18} 46 L${x} 50 Z`}
                  fill="#a23420"
                />
              </g>
            ))}
          </g>
        ) : null}
        {/* 人物剪影 */}
        {shot.shotType === "近景" || shot.shotType === "特写" || shot.shotType === "中景" ? (
          <g transform="translate(70 30)">
            <circle cx="30" cy="14" r="10" fill="rgba(14,10,7,0.55)" />
            <path
              d="M10 30 Q30 20 50 30 L55 80 L5 80 Z"
              fill="rgba(14,10,7,0.55)"
            />
          </g>
        ) : null}
        {/* 战马剪影 */}
        {shot.id.includes("s-1-") || shot.id.includes("s-3-4") ? (
          <g transform="translate(20 60)" fill="rgba(14,10,7,0.6)">
            <ellipse cx="30" cy="20" rx="22" ry="8" />
            <rect x="38" y="6" width="3" height="14" />
            <circle cx="40" cy="2" r="3" />
            <rect x="14" y="26" width="3" height="14" />
            <rect x="22" y="26" width="3" height="14" />
            <rect x="44" y="26" width="3" height="14" />
            <rect x="52" y="26" width="3" height="14" />
          </g>
        ) : null}
        {/* 滤镜 */}
        <rect
          x="0"
          y="0"
          width="200"
          height="120"
          fill="url(#grain)"
          opacity="0.18"
        />
        <defs>
          <pattern
            id="grain"
            x="0"
            y="0"
            width="3"
            height="3"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="1" cy="1" r="0.4" fill="rgba(14,10,7,0.4)" />
          </pattern>
        </defs>
      </svg>
      {/* 镜头运动示意 */}
      <div className="absolute top-2 left-2 font-mono text-[9px] tracking-[0.2em] text-xuan-100 bg-mo-900/60 px-1.5 py-0.5 rounded-sm">
        {shot.shotType}
      </div>
    </div>
  );
}

function pickPalette(shot: Shot) {
  if (shot.id.startsWith("s-0-")) {
    return { from: "#a87a2c", to: "#5b4634" };
  }
  if (shot.id.startsWith("s-1-")) {
    return { from: "#7d1f10", to: "#1a1410" };
  }
  if (shot.id.startsWith("s-2-")) {
    return { from: "#3a2c20", to: "#1a1410" };
  }
  if (shot.id.startsWith("s-3-")) {
    if (shot.id.includes("s-3-7") || shot.id.includes("s-3-8")) {
      return { from: "#33493b", to: "#1a1410" };
    }
    return { from: "#5d160a", to: "#1a1410" };
  }
  return { from: "#a87a2c", to: "#5b4634" };
}
