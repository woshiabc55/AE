import { characters, relations } from "@/data/characters";
import { useReveal } from "@/hooks/useReveal";
import { Diamond, SealStamp } from "./Decorations";
import { cn } from "@/lib/utils";

const accentMap: Record<string, string> = {
  crimson: "border-crimson/70 text-crimson",
  cyan: "border-cyan/70 text-cyan",
  paper: "border-paper/70 text-paper",
};

export function CharacterProfile() {
  const hero = characters.find((c) => c.id === "chenqianyu")!;
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="profile" className="relative isolate py-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-cyan/[0.04] blur-3xl" />
        <div className="absolute left-0 bottom-1/4 h-72 w-72 rounded-full bg-crimson/[0.05] blur-3xl" />
      </div>

      <div className="mx-auto max-w-[1440px] px-6">
        {/* 章节标头 */}
        <div
          ref={ref}
          className={cn(
            "mb-16 grid grid-cols-12 items-end gap-4 transition-all duration-700",
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8",
          )}
        >
          <div className="col-span-12 md:col-span-2">
            <p className="font-mono text-[11px] tracking-[0.3em] text-cyan">
              ⌜ 01 / DOSSIER
            </p>
            <p className="mt-2 font-display text-6xl text-paper/90">档案</p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <h2 className="font-serif text-3xl leading-tight sm:text-4xl">
              <span className="text-cyan">「</span>
              真龙后裔<span className="text-paper/40"> × </span>
              小可爱<span className="text-cyan">」</span>
              <br />
              <span className="text-paper/70">的反差人设报告</span>
            </h2>
          </div>
          <div className="col-span-12 md:col-span-3 md:text-right">
            <p className="font-mono text-[11px] tracking-[0.2em] text-ash">
              SUBJECT 陈千语
            </p>
            <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-ash">
              RECORDED ON 終末地 / 塔衛二
            </p>
          </div>
        </div>

        {/* 主体：左侧属性卡 + 右侧关系网 */}
        <div className="grid grid-cols-12 gap-8">
          {/* 属性卡 */}
          <div className="col-span-12 lg:col-span-7">
            <div className="relative border border-line/60 bg-ink-elev/40 p-8 clip-bevel">
              {/* 角标 */}
              <div className="absolute -top-3 left-6 bg-ink px-2 font-mono text-[10px] tracking-[0.3em] text-cyan">
                FILE No.0001
              </div>
              <div className="absolute -top-3 right-6 bg-ink px-2 font-mono text-[10px] tracking-[0.3em] text-crimson">
                SEALED
              </div>

              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-kuaile text-5xl text-paper sm:text-6xl">
                    {hero.name}
                  </h3>
                  <p className="mt-2 font-display text-xl tracking-[0.2em] text-cyan">
                    CHEN&nbsp;QIANYU
                  </p>
                  <p className="mt-1 font-mono text-xs tracking-wider text-ash">
                    {hero.role}
                  </p>
                </div>
                <div className="h-20 w-20 shrink-0">
                  <SealStamp char="龍" />
                </div>
              </div>

              <p className="mt-6 border-l-2 border-crimson/70 pl-4 font-serif text-base leading-relaxed text-paper/85">
                {hero.description}
              </p>

              {/* 标签 */}
              <div className="mt-6 flex flex-wrap gap-2">
                {hero.tags.map((t, i) => (
                  <span
                    key={t}
                    className="clip-tag inline-flex items-center gap-1 border border-cyan/40 bg-cyan/5 px-3 py-1 font-mono text-[11px] tracking-[0.15em] text-cyan"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Diamond className="h-1.5 w-1.5" />
                    {t}
                  </span>
                ))}
              </div>

              {/* 属性参数 */}
              <div className="mt-8 grid grid-cols-3 gap-3 border-t border-line/60 pt-6">
                {[
                  { k: "正義感", v: 95, color: "bg-cyan" },
                  { k: "闖禍率", v: 99, color: "bg-crimson" },
                  { k: "甩鍋力", v: 100, color: "bg-paper" },
                ].map((stat) => (
                  <div key={stat.k} className="flex flex-col gap-2">
                    <div className="flex items-baseline justify-between font-mono text-[10px] tracking-wider text-ash">
                      <span>{stat.k}</span>
                      <span className={cn("text-paper", stat.color === "bg-crimson" && "text-crimson", stat.color === "bg-cyan" && "text-cyan")}>
                        {stat.v}
                      </span>
                    </div>
                    <div className="h-1 w-full bg-line/50">
                      <div
                        className={cn("h-full", stat.color)}
                        style={{ width: `${stat.v}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 关系网 */}
          <div className="col-span-12 lg:col-span-5">
            <RelationGraph />
          </div>
        </div>

        {/* 配角小卡 */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {characters
            .filter((c) => c.id !== "chenqianyu")
            .map((c) => (
              <div
                key={c.id}
                className={cn(
                  "group relative border bg-ink-elev/30 p-5 transition-colors hover:bg-ink-elev/60",
                  accentMap[c.accent],
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-serif text-xl text-paper">{c.name}</h4>
                    <p className="mt-1 font-mono text-[10px] tracking-wider text-ash">
                      {c.role}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "h-2 w-2",
                      c.accent === "crimson" && "bg-crimson",
                      c.accent === "cyan" && "bg-cyan",
                      c.accent === "paper" && "bg-paper",
                    )}
                  />
                </div>
                <p className="mt-3 text-sm leading-relaxed text-paper/75">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="border border-line/60 px-1.5 py-0.5 font-mono text-[10px] tracking-wider text-ash"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

// 关系网 SVG
function RelationGraph() {
  const cx = 220;
  const cy = 220;
  const r = 160;
  const others = characters.filter((c) => c.id !== "chenqianyu");

  // 计算节点位置（均匀分布）
  const positions = others.map((_, i) => {
    const angle = (Math.PI * 2 * i) / others.length - Math.PI / 2;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    };
  });

  return (
    <div className="relative h-full min-h-[460px] border border-line/60 bg-ink-elev/40 p-6 clip-bevel hud-frame">
      <div className="absolute -top-3 left-6 bg-ink px-2 font-mono text-[10px] tracking-[0.3em] text-cyan">
        RELATION&nbsp;GRAPH
      </div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-ash">人物关系拓扑</p>
      <p className="mt-1 font-serif text-base text-paper/80">围绕『真龙后裔』的卫星图谱</p>

      <svg viewBox="0 0 440 440" className="mt-4 h-[420px] w-full">
        <defs>
          <linearGradient id="edgeCrimson" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ff2d4a" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ff2d4a" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="edgeCyan" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id="coreGlow">
            <stop offset="0%" stopColor="#ff2d4a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#ff2d4a" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#ff2d4a" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* 中心光晕 */}
        <circle cx={cx} cy={cy} r={70} fill="url(#coreGlow)" />

        {/* 圆环 */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#2a2a35" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="#2a2a35" strokeWidth="1" />

        {/* 连线 */}
        {relations.map((rel, i) => {
          const to = positions.find((_, idx) => others[idx].id === rel.to);
          if (!to) return null;
          const isRed = rel.type === "frames" || rel.type === "targets" || rel.type === "mentor";
          return (
            <g key={i}>
              <line
                x1={cx}
                y1={cy}
                x2={to.x}
                y2={to.y}
                stroke={isRed ? "url(#edgeCrimson)" : "url(#edgeCyan)"}
                strokeWidth="1.2"
                strokeDasharray={rel.type === "protects" ? "0" : "4 4"}
              />
              <text
                x={(cx + to.x) / 2 + 6}
                y={(cy + to.y) / 2 - 4}
                fill={isRed ? "#ff2d4a" : "#00d4ff"}
                fontSize="10"
                fontFamily="JetBrains Mono"
                letterSpacing="1"
              >
                {rel.label}
              </text>
            </g>
          );
        })}

        {/* 中心节点 */}
        <g>
          <circle cx={cx} cy={cy} r={36} fill="#0a0a0f" stroke="#ff2d4a" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={32} fill="none" stroke="#ff2d4a" strokeWidth="0.5" strokeDasharray="2 3" />
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fontSize="14"
            fontFamily="Noto Serif SC"
            fontWeight="900"
            fill="#f5f1e8"
          >
            千语
          </text>
          <text
            x={cx}
            y={cy + 12}
            textAnchor="middle"
            fontSize="8"
            fontFamily="JetBrains Mono"
            fill="#ff2d4a"
            letterSpacing="2"
          >
            CORE
          </text>
        </g>

        {/* 卫星节点 */}
        {others.map((c, i) => {
          const p = positions[i];
          return (
            <g key={c.id}>
              <circle
                cx={p.x}
                cy={p.y}
                r={22}
                fill="#14141c"
                stroke={
                  c.accent === "crimson"
                    ? "#ff2d4a"
                    : c.accent === "cyan"
                      ? "#00d4ff"
                      : "#f5f1e8"
                }
                strokeWidth="1.5"
              />
              <text
                x={p.x}
                y={p.y + 4}
                textAnchor="middle"
                fontSize="11"
                fontFamily="Noto Serif SC"
                fontWeight="700"
                fill="#f5f1e8"
              >
                {c.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
