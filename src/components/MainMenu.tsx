import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";
import { SettingsPanel } from "./SettingsPanel";

// 战场背景：低分辨率 canvas，缓慢漂浮的战术光点 + 扫描雷达
function TacticalBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let raf = 0;
    let w = 0;
    let h = 0;
    const LOW = 3;
    type P = { x: number; y: number; vx: number; vy: number; s: number; c: string };
    let pts: P[] = [];
    const colors = ["#4fd6c2", "#3a8cff", "#ff3b5c", "#ffd86b"];

    function resize() {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w / LOW);
      cv.height = Math.floor(h / LOW);
      const count = Math.floor((cv.width * cv.height) / 1100);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.06,
        vy: (Math.random() - 0.5) * 0.06,
        s: Math.random() < 0.2 ? 2 : 1,
        c: colors[Math.floor(Math.random() * colors.length)],
      }));
    }
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    let t = 0;
    function frame() {
      raf = requestAnimationFrame(frame);
      t += 0.008;
      ctx.fillStyle = "rgba(6,9,7,0.4)";
      ctx.fillRect(0, 0, cv.width, cv.height);
      for (const p of pts) {
        p.x += p.vx + Math.sin(t + p.y) * 0.008;
        p.y += p.vy;
        if (p.x < 0) p.x = cv.width;
        if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height;
        if (p.y > cv.height) p.y = 0;
        ctx.globalAlpha = 0.45 + Math.sin(t * 2 + p.x) * 0.3;
        ctx.fillStyle = p.c;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), p.s, p.s);
      }
      ctx.globalAlpha = 1;
    }
    frame();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 h-full w-full canvas-pixel opacity-70"
    />
  );
}

export function MainMenu() {
  const career = useGameStore((s) => s.career);
  const goTo = useGameStore((s) => s.goTo);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowto, setShowHowto] = useState(false);
  const [showCareer, setShowCareer] = useState(false);

  const kdr =
    career.totalDeaths > 0
      ? (career.totalKills / career.totalDeaths).toFixed(2)
      : career.totalKills.toFixed(2);
  const winRate =
    career.matchesPlayed > 0
      ? Math.round((career.matchesWon / career.matchesPlayed) * 100)
      : 0;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-950">
      <TacticalBackground />
      <div className="pointer-events-none absolute inset-0 bg-void-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-60" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        {/* 标题 */}
        <div className="mb-1 text-center animate-flicker">
          <h1 className="font-pixel text-3xl md:text-5xl text-tac-400 text-glow-tac leading-tight">
            DELTA PROTOCOL
          </h1>
        </div>
        <p className="font-term text-2xl md:text-3xl text-alpha-400 text-glow-alpha mb-1 tracking-[0.3em]">
          裂 界 行 动
        </p>
        <p className="font-term text-lg text-tac-400/60 mb-10">
          战术小队 · 5 回合制 · 占领与压制
        </p>

        {/* 菜单 */}
        {!showHowto && !showSettings && !showCareer && (
          <div className="flex w-64 flex-col gap-3 animate-fade-in">
            <PixelButton variant="primary" onClick={() => goTo("operator")}>
              进入作战
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setShowCareer(true)}>
              生涯档案
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setShowHowto(true)}>
              作战简报
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setShowSettings(true)}>
              设置
            </PixelButton>
          </div>
        )}

        {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}

        {showHowto && (
          <div className="w-[min(90vw,540px)] border-2 border-tac-500/40 bg-void-800/90 shadow-pixel p-6 animate-fade-in">
            <h2 className="font-pixel text-sm text-tac-400 text-glow-tac mb-4">
              作战简报
            </h2>
            <ul className="font-term text-xl text-tac-400/90 space-y-2 leading-relaxed">
              <li><span className="text-tac-400">W A S D</span>　移动</li>
              <li><span className="text-tac-400">Shift</span>　冲刺（视野变广）</li>
              <li><span className="text-tac-400">鼠标</span>　转向视角</li>
              <li><span className="text-tac-400">左键</span>　开火（消耗弹匣）</li>
              <li><span className="text-tac-400">R</span>　装填弹药</li>
              <li><span className="text-tac-400">点击画面</span>　锁定鼠标</li>
              <li><span className="text-tac-400">ESC</span>　暂停 / 解锁</li>
            </ul>
            <div className="mt-4 border-t border-void-600 pt-3 font-term text-lg text-tac-400/70 leading-relaxed space-y-1">
              <p>· <span className="text-alpha-400">ALPHA</span> 小队 vs <span className="text-bravo-400">BRAVO</span> 敌军，每方 14 张票券</p>
              <p>· 占领中央 <span className="text-gold" style={{ color: "#ffd86b" }}>据点</span> 至 ±100 即可夺回合</p>
              <p>· 票券耗尽且全员阵亡，对方夺得回合</p>
              <p>· 先夺 <span className="text-gold" style={{ color: "#ffd86b" }}>3 回合</span> 者赢得整场对战</p>
              <p>· 准星对准敌军会变 <span className="text-bravo-400">红</span>，命中显示金色 X</p>
              <p>· 阵亡后 4 秒重生（票券耗尽则不可重生）</p>
            </div>
            <div className="mt-5 flex justify-end">
              <PixelButton variant="ghost" onClick={() => setShowHowto(false)}>
                返回
              </PixelButton>
            </div>
          </div>
        )}

        {showCareer && (
          <div className="w-[min(90vw,460px)] border-2 border-alpha-500/40 bg-void-800/90 shadow-pixel p-6 animate-fade-in">
            <h2 className="font-pixel text-sm text-alpha-400 text-glow-alpha mb-5">
              生涯档案
            </h2>
            <div className="space-y-3 mb-6">
              <CareerRow label="总击杀" value={`${career.totalKills}`} accent="tac" />
              <CareerRow label="总阵亡" value={`${career.totalDeaths}`} accent="bravo" />
              <CareerRow label="击杀比 K/D" value={kdr} accent="gold" />
              <CareerRow label="对战场次" value={`${career.matchesPlayed}`} accent="tac" />
              <CareerRow label="胜场" value={`${career.matchesWon}`} accent="alpha" />
              <CareerRow label="胜率" value={`${winRate}%`} accent="gold" />
              <CareerRow label="单局最佳击杀" value={`${career.bestRoundKills}`} accent="warn" />
            </div>
            <div className="flex justify-end">
              <PixelButton variant="ghost" onClick={() => setShowCareer(false)}>
                返回
              </PixelButton>
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1">
          <p className="font-term text-sm text-tac-400/30">
            像素 2 渲 3 · DELTA PROTOCOL v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

function CareerRow({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "tac" | "alpha" | "bravo" | "gold" | "warn";
}) {
  const color =
    accent === "tac"
      ? "text-tac-400 text-glow-tac"
      : accent === "alpha"
        ? "text-alpha-400 text-glow-alpha"
        : accent === "bravo"
          ? "text-bravo-400 text-glow-bravo"
          : accent === "warn"
            ? "text-warn-500 text-glow-warn"
            : "text-gold";
  return (
    <div className="flex items-center justify-between border-b border-void-600 pb-2">
      <span className="font-term text-xl text-tac-400/60">{label}</span>
      <span className={`font-pixel text-sm ${color}`} style={accent === "gold" ? { color: "#ffd86b" } : undefined}>
        {value}
      </span>
    </div>
  );
}
