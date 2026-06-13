import { useEffect, useMemo, useState } from "react";
import { useTilt } from "@/hooks/useTilt";

/**
 * 中央巨幅文字层：
 * - 主标题：INDUSTRIAL TRAP（黑体英字 + 中文）
 * - 副标题：循环切换
 * - 逐字符位移 / 闪烁 / 鼠标染色的径向蒙版
 * - 伪 3D 多层阴影
 */
const SUBTITLES = [
  "NOISE. / NO MERCY.",
  "FACTORY HYMNS / VOL.07",
  "WIRE / VENOM / RUST",
  "BPM 142 // BLOOD TYPE O",
  "STEEL / NEVER / SLEEP",
];

export default function TextStage() {
  const tilt = useTilt();
  const [subIdx, setSubIdx] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setSubIdx((i) => (i + 1) % SUBTITLES.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  // 打字机效果（subidx 切换时）
  useEffect(() => {
    const target = SUBTITLES[subIdx];
    let i = 0;
    setTyped("");
    const t = setInterval(() => {
      i++;
      setTyped(target.slice(0, i));
      if (i >= target.length) clearInterval(t);
    }, 38);
    return () => clearInterval(t);
  }, [subIdx]);

  const main = useMemo(
    () => [
      { t: "INDUSTRIAL", color: "text-white", shadow: "shadow-stack" },
      { t: "TRAP", color: "text-danger", shadow: "shadow-stack" },
    ],
    []
  );

  return (
    <div
      className="relative z-10 flex h-full w-full flex-col items-center justify-center"
      style={{
        transform: `perspective(1200px) rotateX(${tilt.y.toFixed(
          2
        )}deg) rotateY(${tilt.x.toFixed(2)}deg)`,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* 顶部小标签 */}
      <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.4em] text-neon/80 animate-flicker">
        <span className="h-px w-10 bg-neon/60" />
        <span>SECTOR // NX-09</span>
        <span className="h-1 w-1 rounded-full bg-danger animate-pulse2" />
        <span>LIVE FEED</span>
        <span className="h-px w-10 bg-neon/60" />
      </div>

      {/* 主标题 */}
      <h1
        className="font-display uppercase text-white"
        style={{
          fontSize: "clamp(80px, 18vw, 360px)",
          lineHeight: 0.9,
          letterSpacing: "-0.045em",
          fontWeight: 900,
        }}
      >
        {main.map((line, li) => (
          <div key={li} className="flex items-center justify-center gap-[0.06em]">
            {line.t.split("").map((ch, i) => (
              <span
                key={i}
                className={`inline-block ${line.color} ${line.shadow} breath`}
                style={{
                  transform: `translateZ(${20 + i * 1.5}px)`,
                  animationDelay: `${i * 0.04}s`,
                  willChange: "transform",
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        ))}
      </h1>

      {/* 中文副标题 */}
      <div className="mt-4 font-zh font-black text-white/85 tracking-[0.3em] text-sm sm:text-base md:text-xl">
        工 业 陷 阱
        <span className="ml-4 inline-block h-3 w-[2px] bg-danger align-middle animate-type" />
      </div>

      {/* 副标题（打字机） */}
      <div className="mt-6 font-mono text-xs sm:text-sm md:text-base tracking-[0.25em] text-neon/80">
        <span className="text-danger/80">[ SUB ]</span>{" "}
        <span className="text-white/85">{typed}</span>
        <span className="ml-1 inline-block h-3 w-[8px] bg-neon align-middle animate-type" />
      </div>

      {/* 鼠标染色蒙版（绝对定位覆盖文字） */}
      <div className="mouse-mask rounded-none" />

      {/* 装饰角标 */}
      <Corner pos="tl" />
      <Corner pos="tr" />
      <Corner pos="bl" />
      <Corner pos="br" />
    </div>
  );
}

function Corner({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) {
  const map: Record<string, string> = {
    tl: "top-[20%] left-[6%]",
    tr: "top-[20%] right-[6%]",
    bl: "bottom-[20%] left-[6%]",
    br: "bottom-[20%] right-[6%]",
  };
  return (
    <div
      className={`absolute ${map[pos]} hidden md:flex flex-col gap-1 font-mono text-[10px] text-neon/60 uppercase tracking-[0.3em]`}
    >
      <div className="flex items-center gap-1.5">
        <span className="block h-2 w-2 border-l border-t border-neon/60" />
        <span>{pos === "tl" ? "01" : pos === "tr" ? "02" : pos === "bl" ? "03" : "04"}</span>
      </div>
      <div className="text-white/40">
        {pos === "tl" && "REC ●"}
        {pos === "tr" && "SYNC ▲"}
        {pos === "bl" && "PWR ■"}
        {pos === "br" && "RX ◐"}
      </div>
    </div>
  );
}
