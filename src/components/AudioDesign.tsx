import { audio } from "../data/world";
import { SectionHeader } from "../lib/ornaments";
import { Music, Volume2 } from "lucide-react";

export default function AudioDesign() {
  return (
    <section className="relative temp-changan py-24 md:py-32">
      {/* 光晕 */}
      <div className="pointer-events-none absolute inset-0 bg-cloud-noise opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6 md:px-12">
        <SectionHeader
          index="03 / 03 · A"
          en="Score & Sound Design"
          zh="音效设计"
          intro="弦乐拨奏→铜管长音的史诗管弦乐铺陈，穿界门 50Hz 低频嗡声奠定时空感。"
        />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {audio.map((a, i) => (
            <article
              key={i}
              className="group flex items-start gap-4 rounded-sm border border-bronze-600/30 bg-ink-900/40 p-5 transition-all duration-500 hover:border-gold-500/50 hover:bg-ink-800/40"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border ${
                  a.type === "music"
                    ? "border-bronze-500/60 text-bronze-300"
                    : "border-core-500/60 text-core-300"
                }`}
              >
                {a.type === "music" ? (
                  <Music className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
                    {a.type === "music" ? "SCORE" : "SFX"}
                  </span>
                  <span className="h-px flex-1 bg-bronze-600/20" />
                </div>
                <h3 className="font-serif text-lg font-bold text-gold-200">
                  {a.event}
                </h3>
                <p className="mt-1 text-sm text-ink-200/80">{a.sound}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span
                    className={`chip ${
                      a.type === "sfx" ? "chip-blue" : ""
                    }`}
                  >
                    {a.freq}
                  </span>
                </div>
                {/* 简易频谱条 */}
                <FrequencyBars
                  freq={a.freq}
                  isMusic={a.type === "music"}
                />
              </div>
            </article>
          ))}
        </div>

        {/* 主配乐曲线 */}
        <div className="mt-16 rounded-sm border border-bronze-600/30 bg-ink-900/40 p-8">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-bronze-500" />
            <span className="font-mono text-[0.65rem] tracking-widest2 text-bronze-400">
              SCORE TIMELINE
            </span>
          </div>
          <p className="mb-6 text-sm text-ink-200/70">
            弦乐拨奏（pizzicato，蓄势）→ 铜管长音（sustain，爆发）· 横跨整段俯冲
          </p>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              { label: "建木", track: "pizz", state: "start" },
              { label: "起跳", track: "pizz+brass", state: "rise" },
              { label: "穿越", track: "brass+sustain", state: "peak" },
              { label: "出画", track: "brass+gate", state: "tail" },
            ].map((t) => (
              <div
                key={t.label}
                className="rounded-sm border border-bronze-600/20 bg-ink-800/40 p-4"
              >
                <div className="font-mono text-[0.6rem] tracking-widest2 text-bronze-400">
                  {t.label}
                </div>
                <div className="mt-1 font-serif text-sm text-gold-200">
                  {t.track}
                </div>
                <ScoreBar state={t.state as "start" | "rise" | "peak" | "tail"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FrequencyBars({ freq, isMusic }: { freq: string; isMusic: boolean }) {
  // 根据频率文字生成伪随机但稳定的条形
  const seed = freq.charCodeAt(0) + freq.length;
  const bars = Array.from({ length: 16 }, (_, i) => {
    const v = Math.abs(Math.sin(seed + i * 0.7)) * 0.8 + 0.2;
    return v;
  });
  return (
    <div className="mt-3 flex h-6 items-end gap-0.5">
      {bars.map((b, i) => (
        <span
          key={i}
          className={`block w-1.5 rounded-sm ${
            isMusic ? "bg-bronze-400" : "bg-core-400"
          }`}
          style={{
            height: `${b * 100}%`,
            opacity: 0.45 + b * 0.5,
          }}
        />
      ))}
    </div>
  );
}

function ScoreBar({ state }: { state: "start" | "rise" | "peak" | "tail" }) {
  const map = {
    start: { from: "h-1", to: "h-1.5", note: "低音·稀疏" },
    rise: { from: "h-1.5", to: "h-3", note: "中音·加密" },
    peak: { from: "h-3", to: "h-5", note: "全频·稠密" },
    tail: { from: "h-5", to: "h-1", note: "尾音·收束" },
  } as const;
  const m = map[state];
  return (
    <div className="mt-3">
      <div className="flex h-6 items-end gap-0.5">
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 11;
          const v = state === "start" ? 0.2 + t * 0.1
            : state === "rise" ? 0.3 + t * 0.4
            : state === "peak" ? 0.85 - Math.abs(t - 0.5) * 0.3
            : 0.9 - t * 0.7;
          return (
            <span
              key={i}
              className="block w-1 rounded-sm bg-gradient-to-t from-bronze-500 to-gold-400"
              style={{ height: `${v * 100}%`, opacity: 0.5 + v * 0.5 }}
            />
          );
        })}
      </div>
      <p className="mt-1 font-mono text-[0.6rem] tracking-widest2 text-bronze-400/80">
        {m.note}
      </p>
    </div>
  );
}
