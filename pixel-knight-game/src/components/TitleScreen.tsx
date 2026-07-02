// 标题界面

import { Sword, Skull } from "lucide-react";

interface Props {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: Props) {
  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center scanlines">
      {/* 暗化背板 */}
      <div className="absolute inset-0 bg-gradient-to-b from-night-950/70 via-night-900/50 to-night-950/80" />

      <div className="relative flex flex-col items-center px-6">
        {/* 副标题 */}
        <div className="anim-in font-pixel text-[10px] tracking-[0.4em] text-ember-fire mb-4">
          PIXEL · 2.5D · ACT
        </div>

        {/* 主标题 */}
        <h1
          className="anim-in font-pixel text-3xl sm:text-5xl text-center leading-tight"
          style={{
            color: "#e6e0f5",
            textShadow:
              "0 0 0 #0b0814, 4px 4px 0 #0b0814, 0 0 24px rgba(255,87,51,0.5)",
          }}
        >
          像素骑士
        </h1>
        <h2
          className="anim-in font-pixel text-lg sm:text-2xl mt-3 text-ember"
          style={{ textShadow: "3px 3px 0 #0b0814" }}
        >
          暗影征伐
        </h2>

        {/* 装饰线 */}
        <div className="anim-in mt-6 flex items-center gap-3 text-gold">
          <Sword size={18} className="rotate-90" />
          <div className="h-[2px] w-24 bg-gold/60" />
          <Skull size={18} className="text-ghoul" />
          <div className="h-[2px] w-24 bg-gold/60" />
          <Sword size={18} className="-rotate-90" />
        </div>

        {/* 开始按钮 */}
        <button
          onClick={onStart}
          className="anim-in pixel-btn mt-10 bg-ember px-10 py-4 text-white text-sm hover:bg-ember-fire"
        >
          开 始 征 伐
        </button>

        {/* 操作说明 */}
        <div className="anim-in mt-10 grid grid-cols-2 gap-x-8 gap-y-1 font-term text-xl text-moon/70">
          <span><span className="text-gold">A / D</span> 左右移动</span>
          <span><span className="text-gold">空格</span> 跳跃（二段跳）</span>
          <span><span className="text-gold">J</span> 三段连斩</span>
          <span><span className="text-gold">Shift</span> 冲刺闪避</span>
          <span><span className="text-gold">L</span> 格挡</span>
          <span><span className="text-gold">Esc</span> 暂停</span>
        </div>

        <p className="anim-in mt-8 font-term text-base text-moon/40">
          月夜古堡 · 亡灵军团来袭 · 斩出你的连击
        </p>
      </div>
    </div>
  );
}
