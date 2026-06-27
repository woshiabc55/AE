import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/Game/Board";
import Hud from "@/components/Game/Hud";
import SeedPackets from "@/components/Game/SeedPackets";
import Controls from "@/components/Game/Controls";
import { Play, Sprout, Shield, Sun } from "lucide-react";

export default function Home() {
  const dispatch = useGameStore((s) => s.dispatch);
  const status = useGameStore((s) => s.status);

  useEffect(() => {
    let raf = 0;
    const loop = (t: number) => {
      dispatch({ type: "TICK", now: t });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [dispatch]);

  const isIdle = status === "idle";
  const isGameOver = status === "gameover";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-sky-400 to-sky-300 p-4 sm:p-6">
      <div className="flex w-full max-w-5xl flex-col items-center gap-4">
        <header className="text-center">
          <h1 className="font-pixel text-xl text-white text-shadow drop-shadow-md sm:text-2xl">
            植物大战僵尸 SVG 模板
          </h1>
          <p className="mt-1 text-sm text-white/90">纯 SVG 绘制 · 可二次开发</p>
        </header>

        <div className="flex w-full flex-wrap items-center justify-center gap-3 sm:justify-between">
          <Hud />
          <SeedPackets />
          <Controls />
        </div>

        <Board />
      </div>

      {isIdle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm animate-fade-in">
          <div className="mx-4 w-full max-w-md rounded-3xl bg-lawn-800 p-8 text-center text-white shadow-2xl">
            <h2 className="mb-2 font-pixel text-2xl text-sun-400">准备迎战</h2>
            <p className="mb-6 text-white/80">选择植物卡槽，点击草地种植，抵御僵尸入侵</p>

            <div className="mb-6 grid grid-cols-3 gap-3 text-xs">
              <div className="rounded-xl bg-lawn-700 p-3">
                <Sun className="mx-auto mb-1 h-6 w-6 text-sun-400" />
                <p className="font-bold">向日葵</p>
                <p className="text-white/60">产出阳光</p>
              </div>
              <div className="rounded-xl bg-lawn-700 p-3">
                <Sprout className="mx-auto mb-1 h-6 w-6 text-plant-light" />
                <p className="font-bold">豌豆射手</p>
                <p className="text-white/60">发射豌豆</p>
              </div>
              <div className="rounded-xl bg-lawn-700 p-3">
                <Shield className="mx-auto mb-1 h-6 w-6 text-nut-light" />
                <p className="font-bold">坚果墙</p>
                <p className="text-white/60">阻挡僵尸</p>
              </div>
            </div>

            <button
              onClick={() => dispatch({ type: "START" })}
              className="inline-flex items-center gap-2 rounded-xl bg-plant px-8 py-3 font-bold text-white shadow-card transition-transform hover:bg-lawn-400 active:scale-95"
            >
              <Play className="h-5 w-5" />
              开始游戏
            </button>
          </div>
        </div>
      )}

      {isGameOver && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="rounded-3xl bg-lawn-800 p-10 text-center text-white shadow-2xl">
            <h2 className="mb-4 font-pixel text-3xl text-red-400">游戏结束</h2>
            <p className="mb-6 text-lg">僵尸吃掉了你的脑子！</p>
            <button
              onClick={() => dispatch({ type: "RESET" })}
              className="rounded-xl bg-plant px-6 py-3 font-bold text-white transition-transform hover:bg-lawn-400 active:scale-95"
            >
              重新开始
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
