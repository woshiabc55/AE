import { CoreOrb } from "../lib/ornaments";
import { characters } from "../data/world";
import { SectionHeader } from "../lib/ornaments";

export default function CharacterCards() {
  return (
    <section className="relative temp-jianmu py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeader
          index="01 / 03"
          en="Personae · The Five"
          zh="角色档案"
          intro="五人小队以楔形箭头排列于建木之巅。队长居前，蚩奼与伏鹤分列两翼，蓄势待发。"
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {characters.map((c, idx) => (
            <article
              key={c.id}
              className="group relative overflow-hidden rounded-sm border border-bronze-600/40 bg-gradient-to-br from-ink-800/60 to-ink-900/80 p-7 transition-all duration-500 hover:border-core-500/60 hover:shadow-[0_0_60px_-15px_rgba(79,168,255,0.4)]"
              style={{
                animation: `rise 0.9s cubic-bezier(0.16,1,0.3,1) ${idx * 0.12}s both`,
              }}
            >
              {/* ID 印章 */}
              <div className="absolute right-5 top-5">
                <div className="seal">{String(c.id).padStart(2, "0")}</div>
              </div>

              {/* 顶部装饰线 */}
              <div className="mb-6 flex items-center gap-2">
                <span className="h-px w-8 bg-bronze-500" />
                <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
                  {c.role}
                </span>
              </div>

              {/* 角色名 */}
              <h3 className="font-serif text-4xl font-black text-gold-200">
                {c.name}
              </h3>
              <p className="mt-1 font-display text-xs italic text-bronze-300/80">
                {c.position}
              </p>

              {/* 蚩奼 展示能量核心 */}
              {c.id === 9 && (
                <div className="my-6 flex justify-center">
                  <CoreOrb size={88} />
                </div>
              )}
              {/* 伏鹤 展示展翼标记 */}
              {c.id === 10 && (
                <div className="my-6 flex h-[88px] items-center justify-center">
                  <svg viewBox="0 0 200 60" className="w-full" aria-hidden>
                    <defs>
                      <linearGradient id="wingCard" x1="0%" x2="100%">
                        <stop offset="0%" stopColor="#7A5C2E" />
                        <stop offset="100%" stopColor="#D4A24C" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M20 30 L 90 30 M110 30 L 180 30 M90 30 L 75 12 M110 30 L 125 12 M90 30 L 75 48 M110 30 L 125 48"
                      stroke="url(#wingCard)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <circle cx="100" cy="30" r="6" fill="#0A0612" stroke="#D4A24C" strokeWidth="0.6" />
                    <path d="M75 12 L 70 8 M125 12 L 130 8" stroke="#D4A24C" strokeWidth="0.6" />
                  </svg>
                </div>
              )}
              {/* 队长 展示楔形顶点标记 */}
              {c.id === 1 && (
                <div className="my-6 flex h-[88px] items-center justify-center">
                  <svg viewBox="0 0 200 60" className="w-full" aria-hidden>
                    <defs>
                      <linearGradient id="leaderGrad" x1="50%" y1="0%" x2="50%" y2="100%">
                        <stop offset="0%" stopColor="#D4A24C" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#7A5C2E" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M100 8 L 50 48 L 150 48 Z"
                      fill="none"
                      stroke="url(#leaderGrad)"
                      strokeWidth="1.4"
                    />
                    <circle cx="100" cy="8" r="5" fill="#D4A24C" />
                    <circle cx="100" cy="8" r="9" fill="none" stroke="#D4A24C" strokeWidth="0.4" opacity="0.5">
                      <animate attributeName="r" values="9;14;9" dur="2s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                    </circle>
                  </svg>
                </div>
              )}

              {/* 属性表 */}
              <dl className="mt-4 space-y-2 border-t border-bronze-600/30 pt-4 text-sm">
                <Row label="表情" value={c.face} />
                <Row label="姿态" value={c.pose} />
                <Row label="关联道具" value={c.prop} />
                {c.lightNote !== "无" && (
                  <Row label="光效" value={c.lightNote} accent="core" />
                )}
              </dl>

              {/* 引言 */}
              <p className="mt-5 font-display text-sm italic text-ink-200/70">
                {c.quote}
              </p>
            </article>
          ))}
        </div>

        {/* 群像提示 */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4 rounded-sm border border-bronze-600/30 bg-ink-900/40 px-6 py-4 text-sm text-ink-200/70">
          <span className="font-mono text-xs tracking-widest2 text-bronze-400">
            ENSEMBLE
          </span>
          <span>·</span>
          <span>五人楔形箭头</span>
          <span>·</span>
          <span>视线统一指向东方（穿界门方向）</span>
          <span>·</span>
          <span>集结 → 蓄势 → 起跳俯冲</span>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
  accent = "default",
}: {
  label: string;
  value: string;
  accent?: "default" | "core";
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-16 shrink-0 font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
        {label}
      </dt>
      <dd
        className={`flex-1 text-xs leading-relaxed md:text-sm ${
          accent === "core" ? "text-core-300" : "text-ink-200/80"
        }`}
      >
        {value}
      </dd>
    </div>
  );
}
