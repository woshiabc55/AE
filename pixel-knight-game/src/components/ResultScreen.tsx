// 结算界面（胜利 / 失败）

import { useGameStore } from "@/store/useGameStore";
import { Crown, Skull } from "lucide-react";

interface Props {
  isVictory: boolean;
  onRestart: () => void;
  onTitle: () => void;
}

export default function ResultScreen({ isVictory, onRestart, onTitle }: Props) {
  const score = useGameStore((s) => s.score);
  const maxCombo = useGameStore((s) => s.maxCombo);
  const wave = useGameStore((s) => s.wave);
  const totalWaves = useGameStore((s) => s.totalWaves);

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center scanlines">
      <div className="absolute inset-0 bg-night-950/85" />

      <div className="relative flex flex-col items-center px-6">
        {isVictory ? (
          <Crown
            size={48}
            className="anim-in text-gold drop-shadow-[0_0_16px_rgba(255,210,63,0.7)]"
          />
        ) : (
          <Skull
            size={48}
            className="anim-in text-ghoul drop-shadow-[0_0_16px_rgba(61,220,132,0.6)]"
          />
        )}

        <h1
          className="anim-in font-pixel text-2xl sm:text-4xl mt-4"
          style={{
            color: isVictory ? "#ffd23f" : "#c01828",
            textShadow: "4px 4px 0 #0b0814",
          }}
        >
          {isVictory ? "征 伐 胜 利" : "骑 士 陨 落"}
        </h1>
        <p className="anim-in mt-2 font-term text-xl text-moon/60">
          {isVictory ? "亡灵军团已尽数伏诛" : "黑暗吞噬了最后的微光"}
        </p>

        {/* 数据 */}
        <div className="anim-in mt-8 w-72 border-2 border-night-700 bg-night-900/80">
          <Row label="最终分数" value={score.toLocaleString()} accent="text-gold" />
          <Row label="最高连击" value={`${maxCombo} HIT`} accent="text-ember" />
          <Row
            label="推进波次"
            value={`${wave} / ${totalWaves}`}
            accent="text-moon"
            last
          />
        </div>

        {/* 按钮 */}
        <div className="anim-in mt-8 flex gap-4">
          <button
            onClick={onRestart}
            className="pixel-btn bg-ember px-8 py-3 text-white text-xs hover:bg-ember-fire"
          >
            再 战 一 场
          </button>
          <button
            onClick={onTitle}
            className="pixel-btn bg-night-700 px-8 py-3 text-moon text-xs hover:bg-night-800"
          >
            返 回 标 题
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
  last,
}: {
  label: string;
  value: string;
  accent: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 ${
        last ? "" : "border-b-2 border-night-700"
      }`}
    >
      <span className="font-term text-xl text-moon/60">{label}</span>
      <span className={`font-pixel text-sm ${accent}`}>{value}</span>
    </div>
  );
}
