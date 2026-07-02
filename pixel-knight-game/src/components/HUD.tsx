// 战斗 HUD：血条 / 连击 / 分数 / 波次

import { useGameStore } from "@/store/useGameStore";
import { Pause } from "lucide-react";

interface Props {
  onPause: () => void;
}

export default function HUD({ onPause }: Props) {
  const hp = useGameStore((s) => s.hp);
  const maxHp = useGameStore((s) => s.maxHp);
  const combo = useGameStore((s) => s.combo);
  const score = useGameStore((s) => s.score);
  const wave = useGameStore((s) => s.wave);
  const totalWaves = useGameStore((s) => s.totalWaves);
  const enemiesLeft = useGameStore((s) => s.enemiesLeft);
  const waveLabel = useGameStore((s) => s.waveLabel);

  const hpPct = Math.max(0, Math.min(1, hp / maxHp));
  const hpSegs = 10;
  const filled = Math.round(hpPct * hpSegs);

  return (
    <div className="pointer-events-none absolute inset-0 z-20 select-none">
      {/* 左上：血条 + 连击 */}
      <div className="absolute left-5 top-5 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[10px] text-moon anim-flicker">HP</span>
          <div className="flex gap-[2px]">
            {Array.from({ length: hpSegs }).map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 border-2 border-night-950 ${
                  i < filled
                    ? hpPct > 0.5
                      ? "bg-ghoul"
                      : hpPct > 0.25
                        ? "bg-gold"
                        : "bg-blood"
                    : "bg-night-800"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="font-term text-2xl text-moon leading-none">
          {hp}
          <span className="text-moon/40">/{maxHp}</span>
        </div>

        {combo > 1 && (
          <div className="anim-in mt-1 flex items-baseline gap-1">
            <span className="font-pixel text-2xl text-ember drop-shadow-[0_0_8px_rgba(255,87,51,0.7)]">
              {combo}
            </span>
            <span className="font-pixel text-[10px] text-gold">COMBO</span>
          </div>
        )}
      </div>

      {/* 左下：分数 */}
      <div className="absolute left-5 bottom-5">
        <div className="font-pixel text-[9px] text-moon/50">SCORE</div>
        <div className="font-term text-4xl text-gold leading-none drop-shadow-[0_2px_0_#000]">
          {score.toLocaleString()}
        </div>
      </div>

      {/* 顶部中央：波次 */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 text-center">
        <div className="font-pixel text-[10px] text-ember-fire anim-flicker">
          {waveLabel}
        </div>
        <div className="font-term text-xl text-moon/80 mt-1">
          波次 {wave}/{totalWaves} · 剩余 {enemiesLeft}
        </div>
      </div>

      {/* 右上：暂停 */}
      <button
        onClick={onPause}
        className="pointer-events-auto absolute right-5 top-5 border-2 border-night-950 bg-night-800/80 px-3 py-2 text-moon hover:bg-night-700"
        title="暂停 (Esc)"
      >
        <Pause size={16} />
      </button>

      {/* 右下：操作提示 */}
      <div className="absolute right-5 bottom-5 text-right font-term text-lg text-moon/50 leading-tight">
        <div>A/D 移动 · 空格 跳跃</div>
        <div>J 攻击 · Shift 冲刺 · L 格挡</div>
      </div>
    </div>
  );
}
