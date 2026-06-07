import { Check, Copy, Sword, Shirt, User } from "lucide-react";
import type { Cast } from "@/data/cast";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

type Props = {
  data: Cast;
};

const FACTION_BG: Record<string, string> = {
  宋: "from-zhu-500 to-zhu-600",
  辽: "from-qi-500 to-qi-600",
  北汉: "from-jin-400 to-jin-500",
};

export function CastCard({ data }: Props) {
  const { copied, copy } = useCopy();
  return (
    <article
      id={data.id}
      className="flip-card card-paper w-[260px] h-[420px] shrink-0 rounded-sm"
    >
      <div className="flip-inner">
        {/* 正面：竖排名 */}
        <div className="flip-face p-5 flex flex-col">
          <div
            className={cn(
              "h-44 relative overflow-hidden rounded-sm border border-mo-800/30 bg-gradient-to-br",
              FACTION_BG[data.faction],
            )}
          >
            <CastSilhouette data={data} />
            <div className="absolute top-2 left-2 seal text-[9px]">
              {data.faction}
            </div>
            <div className="absolute bottom-2 right-2 font-mono text-[9px] tracking-[0.25em] text-xuan-100/80">
              {data.age}
            </div>
          </div>
          <div className="mt-3 flex-1">
            <div className="font-mono text-[10px] tracking-[0.3em] text-mo-600">
              CAST · {data.id.slice(2).toUpperCase()}
            </div>
            <h3 className="font-xiao text-2xl text-mo-900 tracking-[0.16em] mt-1">
              {data.name}
            </h3>
            <p className="font-brush text-base text-zhu-500 mt-0.5">
              {data.title}
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-mo-800/20">
            <p className="text-xs font-serif text-mo-700 leading-relaxed line-clamp-4">
              {data.signature}
            </p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-mo-600">
              悬停 / 点击查看 Prompt →
            </p>
          </div>
        </div>

        {/* 背面：Prompt + 详细 */}
        <div className="flip-face flip-back p-5 flex flex-col bg-mo-900 text-xuan-100 rounded-sm">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] tracking-[0.3em] text-jin-300">
              {data.name} · PROMPT
            </span>
            <button
              aria-label="复制人物 Prompt"
              onClick={() => copy(data.promptEn)}
              className="text-jin-300 hover:text-xuan-100 inline-flex items-center gap-1 text-[10px] font-mono tracking-[0.2em]"
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
          <pre className="mt-2 font-mono text-[10.5px] leading-relaxed text-xuan-100/90 whitespace-pre-wrap break-words line-clamp-[14] flex-1 overflow-y-auto">
{data.promptEn}
          </pre>
          <div className="mt-3 pt-3 border-t border-xuan-100/20 space-y-1.5 text-[10.5px] font-serif">
            <Row icon={User} label="外貌" value={data.appearance} />
            <Row icon={Shirt} label="服饰" value={data.costume} />
            <Row icon={Sword} label="兵器" value={data.weapon} />
          </div>
        </div>
      </div>
    </article>
  );
}

function Row({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof User;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-1.5">
      <Icon className="size-3 mt-0.5 text-jin-300 shrink-0" />
      <div>
        <span className="text-jin-300 font-mono text-[9px] tracking-[0.2em]">
          {label}
        </span>
        <p className="text-xuan-100/90 leading-snug">{value}</p>
      </div>
    </div>
  );
}

function CastSilhouette({ data }: { data: Cast }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="absolute inset-0 w-full h-full"
      preserveAspectRatio="xMidYMid slice"
    >
      {/* 月亮 / 太阳 */}
      <circle
        cx="160"
        cy="36"
        r="18"
        fill="rgba(245,236,213,0.85)"
      />
      {/* 远山 */}
      <path
        d="M0 150 L40 120 L80 140 L120 110 L160 130 L200 115 L200 200 L0 200 Z"
        fill="rgba(14,10,7,0.3)"
      />
      {/* 身 */}
      <g transform="translate(60 30)">
        {/* 头 */}
        <circle cx="40" cy="20" r="14" fill="rgba(14,10,7,0.6)" />
        {/* 帽 / 盔 */}
        {data.faction !== "辽" ? (
          <path
            d="M26 12 L54 12 L50 0 L30 0 Z"
            fill="rgba(14,10,7,0.7)"
          />
        ) : (
          <path
            d="M28 12 Q40 -2 52 12 Z"
            fill="rgba(14,10,7,0.7)"
          />
        )}
        {data.faction === "宋" ? (
          <path
            d="M30 0 L20 -10 L24 0 Z M50 0 L60 -10 L56 0 Z"
            fill="rgba(14,10,7,0.7)"
          />
        ) : null}
        {/* 身 */}
        <path
          d="M20 38 L60 38 L70 130 L10 130 Z"
          fill="rgba(14,10,7,0.6)"
        />
        {/* 衣领 */}
        <path
          d="M28 38 L40 56 L52 38 L48 80 L32 80 Z"
          fill="rgba(245,236,213,0.5)"
        />
        {/* 袖 */}
        <path
          d="M20 38 L0 80 L10 90 L26 50 Z"
          fill="rgba(14,10,7,0.55)"
        />
        <path
          d="M60 38 L80 80 L70 90 L54 50 Z"
          fill="rgba(14,10,7,0.55)"
        />
        {/* 武器 */}
        {data.weapon.includes("刀") || data.weapon.includes("剑") ? (
          <line
            x1="78"
            y1="20"
            x2="90"
            y2="120"
            stroke="rgba(245,236,213,0.7)"
            strokeWidth="2"
          />
        ) : null}
        {data.weapon.includes("弓") ? (
          <g>
            <path
              d="M75 60 Q90 30 75 0"
              stroke="rgba(245,236,213,0.8)"
              strokeWidth="1.5"
              fill="none"
            />
            <line
              x1="75"
              y1="0"
              x2="75"
              y2="60"
              stroke="rgba(245,236,213,0.6)"
              strokeWidth="0.5"
            />
          </g>
        ) : null}
      </g>
      {/* 装饰：战旗 / 烽烟 */}
      {data.faction === "宋" ? (
        <g>
          <line x1="20" y1="20" x2="20" y2="80" stroke="rgba(14,10,7,0.6)" />
          <path d="M20 22 L36 26 L32 36 L36 46 L20 50 Z" fill="rgba(245,236,213,0.7)" />
        </g>
      ) : null}
    </svg>
  );
}
