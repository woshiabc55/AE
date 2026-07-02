import { useEffect, useRef, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";
import { SettingsPanel } from "./SettingsPanel";

// 虚空粒子背景：低分辨率 canvas 像素点缓慢漂浮
function VoidBackground() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    let raf = 0;
    let w = 0;
    let h = 0;
    const LOW = 3; // 内部低分辨率倍率
    type P = { x: number; y: number; vx: number; vy: number; s: number; c: string };
    let pts: P[] = [];
    const colors = ["#3ad7ff", "#7a3bff", "#ffd86b", "#ff5be3"];

    function resize() {
      w = cv.clientWidth;
      h = cv.clientHeight;
      cv.width = Math.floor(w / LOW);
      cv.height = Math.floor(h / LOW);
      const count = Math.floor((cv.width * cv.height) / 900);
      pts = Array.from({ length: count }, () => ({
        x: Math.random() * cv.width,
        y: Math.random() * cv.height,
        vx: (Math.random() - 0.5) * 0.08,
        vy: (Math.random() - 0.5) * 0.08,
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
      t += 0.01;
      ctx.fillStyle = "rgba(5,6,10,0.35)";
      ctx.fillRect(0, 0, cv.width, cv.height);
      for (const p of pts) {
        p.x += p.vx + Math.sin(t + p.y) * 0.01;
        p.y += p.vy;
        if (p.x < 0) p.x = cv.width;
        if (p.x > cv.width) p.x = 0;
        if (p.y < 0) p.y = cv.height;
        if (p.y > cv.height) p.y = 0;
        ctx.globalAlpha = 0.5 + Math.sin(t * 2 + p.x) * 0.3;
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
  const startNewGame = useGameStore((s) => s.startNewGame);
  const continueGame = useGameStore((s) => s.continueGame);
  const hasSave = useGameStore((s) => s.hasSave);
  const bestTimeSec = useGameStore((s) => s.bestTimeSec);
  const [showSettings, setShowSettings] = useState(false);
  const [showHowto, setShowHowto] = useState(false);

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-900">
      <VoidBackground />
      {/* 网格叠层 */}
      <div className="pointer-events-none absolute inset-0 bg-void-grid opacity-40" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-60" />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6">
        {/* 标题 */}
        <div className="mb-2 text-center animate-flicker">
          <h1 className="font-pixel text-3xl md:text-5xl text-resonance-400 text-glow-reso leading-tight">
            VOIDWALKER
          </h1>
        </div>
        <p className="font-term text-2xl md:text-3xl text-rift-500 text-glow-rift mb-1 tracking-[0.3em]">
          残 响
        </p>
        <p className="font-term text-lg text-resonance-400/60 mb-10">
          于崩塌现实间，拾取记忆的回响
        </p>

        {/* 菜单 */}
        {!showHowto && !showSettings && (
          <div className="flex w-64 flex-col gap-3 animate-fade-in">
            <PixelButton variant="primary" onClick={() => startNewGame()}>
              开始游戏
            </PixelButton>
            <PixelButton
              variant="ghost"
              onClick={() => continueGame()}
              disabled={!hasSave}
            >
              继续旅程
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setShowSettings(true)}>
              设置
            </PixelButton>
            <PixelButton variant="ghost" onClick={() => setShowHowto(true)}>
              操作说明
            </PixelButton>
          </div>
        )}

        {showSettings && (
          <SettingsPanel onClose={() => setShowSettings(false)} />
        )}

        {showHowto && (
          <div className="w-[min(90vw,520px)] border-2 border-resonance-500/40 bg-void-800/90 shadow-pixel p-6 animate-fade-in">
            <h2 className="font-pixel text-sm text-echo-400 text-glow-echo mb-4">
              操作说明
            </h2>
            <ul className="font-term text-xl text-resonance-400/90 space-y-2 leading-relaxed">
              <li><span className="text-resonance-400">W A S D</span> / 方向键　移动</li>
              <li><span className="text-resonance-400">Shift</span>　冲刺（视野变广）</li>
              <li><span className="text-resonance-400">鼠标</span>　转向视角</li>
              <li><span className="text-resonance-400">左键</span>　开火（消耗残响弹）</li>
              <li><span className="text-resonance-400">点击画面</span>　锁定鼠标</li>
              <li><span className="text-resonance-400">ESC</span>　暂停 / 解锁</li>
            </ul>
            <div className="mt-4 border-t border-void-600 pt-3 font-term text-lg text-resonance-400/70 leading-relaxed">
              <p>· 收集本层所有 <span className="text-echo-400">记忆回响</span> 以开启传送门</p>
              <p>· <span className="text-resonance-400">残响弹</span> 可击退暗影，两发击杀，11 秒后重生</p>
              <p>· 准星对准暗影会变 <span className="text-warn-500">红</span>，命中显示金色 X</p>
              <p>· 暗影接近时屏幕边缘泛起 <span className="text-warn-500">心跳红光</span></p>
              <p>· 残响值耗尽即失败，请善用枪与地形</p>
            </div>
            <div className="mt-5 flex justify-end">
              <PixelButton variant="ghost" onClick={() => setShowHowto(false)}>
                返回
              </PixelButton>
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="absolute bottom-5 left-0 right-0 flex flex-col items-center gap-1">
          {bestTimeSec != null && (
            <p className="font-term text-base text-echo-400/70">
              最佳通关：{formatTime(bestTimeSec)}
            </p>
          )}
          <p className="font-term text-sm text-resonance-400/30">
            像素 2 渲 3 · VOIDWALKER v1.0
          </p>
        </div>
      </div>
    </div>
  );
}

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
