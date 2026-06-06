import { props, vfx } from "../data/world";
import { CoreOrb, GatePortal, SectionHeader } from "../lib/ornaments";

export default function PropsAndVFX() {
  return (
    <section className="relative temp-mid py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeader
          index="02 / 03 · B"
          en="Artifacts & Phenomena"
          zh="道具与视效"
          intro="三件关键道具与六项核心视效。所有参数都直接对应分镜中的硬性规格。"
        />

        {/* 道具三栏 */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {props.map((p) => (
            <article
              key={p.id}
              className="group relative overflow-hidden rounded-sm border border-bronze-600/40 bg-gradient-to-b from-ink-800/60 to-ink-900/80 p-7 transition-all duration-500 hover:border-core-500/60"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-bronze-400/60 to-transparent" />
              <div className="mb-5 flex h-32 items-center justify-center">
                {p.id === "core" && <CoreOrb size={120} />}
                {p.id === "wing" && <WingIcon />}
                {p.id === "gate" && <GatePortal className="h-full" />}
              </div>

              <h3 className="font-serif text-2xl font-bold text-gold-200">
                {p.name}
              </h3>
              <p className="mt-1 text-xs text-ink-200/60">{p.form}</p>

              <dl className="mt-5 space-y-2.5 border-t border-bronze-600/30 pt-4 text-sm">
                <Row label="颜色" value={p.color} />
                <Row label="节律" value={p.rhythm} />
                <Row label="机制" value={p.mechanic} />
              </dl>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.chips.map((c) => (
                  <span
                    key={c}
                    className={`chip ${
                      c.includes("Hz") || c.includes("0.3s")
                        ? "chip-blue"
                        : c === "bronze"
                        ? "chip-bronze"
                        : ""
                    }`}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* 视效表 */}
        <div className="mt-20">
          <div className="mb-6 flex items-center gap-3">
            <span className="h-px w-8 bg-bronze-500" />
            <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
              VFX PIPELINE
            </span>
          </div>

          <div className="overflow-x-auto rounded-sm border border-bronze-600/30 bg-ink-900/40">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-bronze-600/40 bg-gradient-to-r from-ink-800/80 to-ink-900/80 text-gold-400">
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    STAGE
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    EFFECT
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    PARAM
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    SOLUTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {vfx.map((v, i) => (
                  <tr
                    key={i}
                    className={`border-b border-bronze-600/15 transition-colors hover:bg-bronze-500/5 ${
                      i % 2 === 0 ? "bg-ink-900/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 text-ink-200/80">{v.stage}</td>
                    <td className="px-4 py-3 font-serif text-base text-gold-200">
                      {v.effect}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-core-300">
                      {v.param}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-200/70">
                      {v.solution}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline gap-3">
      <dt className="w-12 shrink-0 font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
        {label}
      </dt>
      <dd className="flex-1 text-xs leading-relaxed text-ink-200/80">
        {value}
      </dd>
    </div>
  );
}

function WingIcon() {
  return (
    <svg viewBox="0 0 240 100" className="h-28 w-56" aria-hidden>
      <defs>
        <linearGradient id="wingL" x1="0%" y1="50%" x2="100%" y2="50%">
          <stop offset="0%" stopColor="#7A5C2E" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4A24C" />
        </linearGradient>
        <linearGradient id="wingR" x1="100%" y1="50%" x2="0%" y2="50%">
          <stop offset="0%" stopColor="#7A5C2E" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#D4A24C" />
        </linearGradient>
      </defs>
      {/* 中央人体剪影 */}
      <circle cx="120" cy="30" r="8" fill="#0A0612" stroke="#D4A24C" strokeWidth="0.6" />
      <path
        d="M120 38 L 120 75 M120 50 L 110 70 M120 50 L 130 70"
        stroke="#D4A24C"
        strokeWidth="0.8"
      />
      {/* 翼骨 */}
      <g className="origin-center">
        <animateTransform
          attributeName="transform"
          type="scale"
          values="0.85;1;0.85"
          dur="3.6s"
          repeatCount="indefinite"
          additive="sum"
        />
        <path
          d="M120 50 L 30 20 M120 50 L 50 35 M120 50 L 70 50 M120 50 L 30 60 M120 50 L 50 70"
          stroke="url(#wingL)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M120 50 L 210 20 M120 50 L 190 35 M120 50 L 170 50 M120 50 L 210 60 M120 50 L 190 70"
          stroke="url(#wingR)"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        {/* 翼面 */}
        <path
          d="M120 50 L 30 20 L 50 35 L 70 50 L 50 70 L 30 60 Z"
          fill="url(#wingL)"
          opacity="0.18"
        />
        <path
          d="M120 50 L 210 20 L 190 35 L 170 50 L 190 70 L 210 60 Z"
          fill="url(#wingR)"
          opacity="0.18"
        />
      </g>
    </svg>
  );
}
