import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import Board from "@/components/Game/Board";
import Hud from "@/components/Game/Hud";
import SeedPackets from "@/components/Game/SeedPackets";
import Controls from "@/components/Game/Controls";

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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-sky-400 to-sky-300 p-6">
      <div className="flex w-full max-w-5xl flex-col items-center gap-4">
        <h1 className="font-pixel text-2xl text-white text-shadow drop-shadow-md">
          植物大战僵尸 SVG 模板
        </h1>
        <div className="flex w-full flex-wrap items-center justify-between gap-4">
          <Hud />
          <SeedPackets />
          <Controls />
        </div>
        <Board />
      </div>
      {status === "gameover" && (
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
