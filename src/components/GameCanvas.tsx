import { useEffect, useRef, useState } from "react";
import { GameScene } from "@/game/GameScene";
import { useGameStore } from "@/store/useGameStore";
import { HUD } from "./HUD";
import { SettingsPanel } from "./SettingsPanel";
import { PixelButton } from "./PixelButton";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<GameScene | null>(null);
  const [locked, setLocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const gameState = useGameStore((s) => s.gameState);
  const settings = useGameStore((s) => s.settings);
  const resume = useGameStore((s) => s.resume);
  const goToMenu = useGameStore((s) => s.goToMenu);

  // 挂载 GameScene
  useEffect(() => {
    if (!containerRef.current) return;
    const scene = new GameScene(containerRef.current);
    scene.onLockChange = (l) => setLocked(l);
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  // 设置变更时应用到运行时
  useEffect(() => {
    sceneRef.current?.applySettings();
  }, [settings]);

  const requestLock = () => sceneRef.current?.requestLock();

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-950">
      {/* 3D 画布容器 */}
      <div ref={containerRef} className="absolute inset-0" />

      {/* CRT 后处理叠层 */}
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-50" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 bg-noise" />

      {/* HUD（仅游玩中显示） */}
      {gameState === "playing" && <HUD />}

      {/* 点击锁定提示 */}
      {gameState === "playing" && !locked && (
        <div
          onClick={requestLock}
          className="absolute inset-0 z-20 flex cursor-pointer flex-col items-center justify-center bg-void-950/70 backdrop-blur-[1px]"
        >
          <p className="font-pixel text-sm text-resonance-400 text-glow-reso animate-flicker mb-3">
            点击进入虚空
          </p>
          <p className="font-term text-lg text-resonance-400/60">
            鼠标将锁定，按 ESC 暂停
          </p>
        </div>
      )}

      {/* 暂停菜单 */}
      {gameState === "paused" && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-void-950/80">
          {!showSettings ? (
            <div className="flex w-64 flex-col items-center gap-3 animate-fade-in">
              <h2 className="font-pixel text-base text-resonance-400 text-glow-reso mb-2">
                暂停
              </h2>
              <PixelButton variant="primary" className="w-full" onClick={requestLock}>
                继续
              </PixelButton>
              <PixelButton variant="ghost" className="w-full" onClick={() => setShowSettings(true)}>
                设置
              </PixelButton>
              <PixelButton
                variant="warn"
                className="w-full"
                onClick={() => {
                  goToMenu();
                }}
              >
                返回主菜单
              </PixelButton>
            </div>
          ) : (
            <SettingsPanel onClose={() => setShowSettings(false)} inGame />
          )}
        </div>
      )}
    </div>
  );
}
