import { Check } from "lucide-react";
import {
  deliverables,
  shots,
  qualityBar,
  softwareStack,
} from "../data/world";
import { SectionHeader, BronzeDivider } from "../lib/ornaments";

export default function ProductionTable() {
  return (
    <section className="relative temp-changan py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeader
          index="03 / 03 · B"
          en="Production Brief"
          zh="制作需求"
          intro="交付物、镜头分解、软件栈、验收标准——可直接交给制作团队执行的清单。"
        />

        {/* Shot List */}
        <div className="mb-16">
          <SubTitle en="Shot List · 7 shots" zh="镜头分解" />
          <div className="overflow-x-auto rounded-sm border border-bronze-600/30 bg-ink-900/40">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b border-bronze-600/40 bg-gradient-to-r from-ink-800/80 to-ink-900/80 text-gold-400">
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    SHOT
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    CONTENT
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    MOVEMENT
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    DURATION
                  </th>
                  <th className="px-4 py-3 font-mono text-[0.65rem] tracking-widest2">
                    ASSETS
                  </th>
                </tr>
              </thead>
              <tbody>
                {shots.map((s, i) => (
                  <tr
                    key={s.id}
                    className={`border-b border-bronze-600/15 transition-colors hover:bg-bronze-500/5 ${
                      i % 2 === 0 ? "bg-ink-900/20" : ""
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-core-300">
                      {s.id}
                    </td>
                    <td className="px-4 py-3 text-ink-200/85">
                      {s.content}
                    </td>
                    <td className="px-4 py-3 font-display text-xs italic text-bronze-300">
                      {s.movement}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gold-400">
                      {s.duration}
                    </td>
                    <td className="px-4 py-3 font-mono text-[0.7rem] text-ink-200/60">
                      {s.assets}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-200/50">
            * 总时长控制在 10-15 s（俯冲转场标准节奏）
          </p>
        </div>

        {/* Deliverables + Software Stack */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <SubTitle en="Deliverables · D-01 ~ D-10" zh="交付物清单" />
            <ul className="space-y-2">
              {deliverables.map((d) => (
                <li
                  key={d.id}
                  className="flex items-start gap-3 rounded-sm border border-bronze-600/20 bg-ink-900/40 px-4 py-2.5 text-sm transition-colors hover:border-gold-500/40"
                >
                  <span className="font-mono text-xs text-core-300">
                    {d.id}
                  </span>
                  <div className="flex-1">
                    <div className="font-serif text-sm text-gold-200">
                      {d.asset}
                    </div>
                    <div className="text-[0.7rem] text-ink-200/55">
                      {d.note}
                    </div>
                  </div>
                  <span className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
                    {d.type}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <SubTitle en="Stack" zh="软件栈建议" />
            <div className="space-y-3">
              {softwareStack.map((s) => (
                <div
                  key={s.layer}
                  className="rounded-sm border border-bronze-600/30 bg-ink-900/40 p-4"
                >
                  <div className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
                    {s.layer}
                  </div>
                  <div className="mt-1 font-serif text-base text-gold-200">
                    {s.tools}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quality Bar */}
        <div>
          <SubTitle en="Quality Bar" zh="验收标准" />
          <ul className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
            {qualityBar.map((q) => (
              <li
                key={q}
                className="flex items-start gap-3 rounded-sm border border-bronze-600/30 bg-ink-900/40 p-3 text-sm text-ink-200/85"
              >
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-500" />
                <span>{q}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 flex justify-center">
          <BronzeDivider />
        </div>
      </div>
    </section>
  );
}

function SubTitle({ en, zh }: { en: string; zh: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="h-px w-8 bg-bronze-500" />
      <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
        {en}
      </span>
      <h3 className="font-serif text-xl font-bold text-gold-200">{zh}</h3>
    </div>
  );
}
