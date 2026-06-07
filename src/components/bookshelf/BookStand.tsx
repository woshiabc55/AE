import type { Act } from "@/data/acts";
import { cn } from "@/lib/utils";

type Props = {
  act: Act;
  isOpen: boolean;
  onOpen: () => void;
  index: number;
  total: number;
};

// 一本"线装古籍"立在架上
// 通过 CSS 实现：书脊（前面）+ 书顶 + 阴影
export function BookStand({ act, isOpen, onOpen, index, total }: Props) {
  const palette = pickPalette(act.index);
  const height = pickHeight(act.index);
  const tilt = (index - (total - 1) / 2) * 0.6; // 书架上的轻微歪斜

  return (
    <div
      className="relative flex flex-col items-center justify-end group"
      style={{
        flex: "1 1 0",
        minWidth: 0,
        paddingBottom: 0,
        transform: isOpen ? "translateY(-12px)" : `rotate(${tilt}deg)`,
        transition: "transform 0.45s cubic-bezier(.2,.8,.2,1)",
        zIndex: isOpen ? 20 : 1,
      }}
    >
      {/* 书签飘带 */}
      <div
        className={cn(
          "absolute -top-3 left-1/2 -translate-x-1/2 z-10 font-mono text-[9px] tracking-[0.3em] px-1.5 py-0.5 rounded-sm",
          isOpen
            ? "bg-zhu-500 text-xuan-100"
            : "bg-xuan-200/90 text-mo-700 border border-mo-800/30",
        )}
      >
        ACT · {String(act.index).padStart(2, "0")}
      </div>

      {/* 书本体（3D 盒子：正面书脊 + 顶面 + 侧面） */}
      <button
        onClick={onOpen}
        aria-label={`打开 ${act.subtitle}`}
        className="relative cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-jin-400"
        style={{ width: "88%", height: `${height}px` }}
      >
        {/* 书顶（厚度） */}
        <div
          className="absolute top-0 left-0 right-0 h-3"
          style={{
            background: `linear-gradient(180deg, ${palette.topLight} 0%, ${palette.top} 100%)`,
            transform: "skewX(-22deg)",
            transformOrigin: "left bottom",
            borderTop: `1px solid ${palette.line}`,
            boxShadow: "0 -1px 0 rgba(0,0,0,0.15)",
          }}
        />
        {/* 书侧面（厚度） */}
        <div
          className="absolute top-3 right-0 bottom-0 w-3"
          style={{
            background: `linear-gradient(90deg, ${palette.side} 0%, ${palette.sideDark} 100%)`,
            transform: "skewY(-22deg)",
            transformOrigin: "right top",
            borderRight: `1px solid ${palette.line}`,
          }}
        />
        {/* 书脊正面 */}
        <div
          className="absolute inset-0 px-2 py-3 flex flex-col items-center justify-between"
          style={{
            background: `linear-gradient(180deg, ${palette.face} 0%, ${palette.faceDark} 100%)`,
            border: `1px solid ${palette.line}`,
            boxShadow: `
              inset 0 0 0 1px rgba(245,236,213,0.18),
              inset 0 -20px 30px rgba(0,0,0,0.25),
              0 6px 14px rgba(0,0,0,0.25)
            `,
          }}
        >
          {/* 顶部封皮横线 */}
          <div
            className="w-full h-px"
            style={{ background: palette.line, opacity: 0.6 }}
          />
          {/* 竖排标题 */}
          <div className="flex-1 flex flex-col items-center justify-center gap-1.5 py-1 overflow-hidden">
            {Array.from(act.title).map((ch, i) => (
              <span
                key={i}
                className="font-xiao text-[15px] leading-none tracking-[0.08em]"
                style={{ color: palette.text }}
              >
                {ch}
              </span>
            ))}
            <span
              className="font-brush text-[13px] mt-1"
              style={{ color: palette.accent }}
            >
              ·
            </span>
            {Array.from(act.subtitle.split("").slice(0, 6)).map((ch, i) => (
              <span
                key={`s-${i}`}
                className="font-brush text-[12px] leading-tight"
                style={{ color: palette.text, opacity: 0.92 }}
              >
                {ch}
              </span>
            ))}
          </div>
          {/* 底部印章 + 幕号 */}
          <div className="w-full flex flex-col items-center gap-1.5">
            <div
              className="font-mono text-[8px] tracking-[0.25em]"
              style={{ color: palette.text, opacity: 0.7 }}
            >
              {act.year}
            </div>
            <div
              className="font-mono text-[8px] tracking-[0.2em] px-1 rounded-sm"
              style={{
                color: palette.bgInk,
                background: palette.accent,
              }}
            >
              {act.body.length} 字
            </div>
          </div>
          {/* 底部封皮横线 */}
          <div
            className="w-full h-px"
            style={{ background: palette.line, opacity: 0.6 }}
          />
        </div>

        {/* 装订线（thread-bound） */}
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            left: "30%",
            width: 1,
            background: `repeating-linear-gradient(180deg, ${palette.line} 0 2px, transparent 2px 6px)`,
            opacity: 0.5,
          }}
        />
        <div
          className="absolute top-0 bottom-0 pointer-events-none"
          style={{
            right: "30%",
            width: 1,
            background: `repeating-linear-gradient(180deg, ${palette.line} 0 2px, transparent 2px 6px)`,
            opacity: 0.5,
          }}
        />
      </button>

      {/* 底座阴影 */}
      <div
        className="w-[88%] h-1 mt-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, transparent 70%)",
          filter: "blur(2px)",
        }}
      />

      {/* 打开时下方浮现的「打开中」浮签 */}
      {isOpen && (
        <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-zhu-500 animate-fadeUp">
          正在阅读 ↓
        </div>
      )}
    </div>
  );
}

function pickHeight(idx: number) {
  // 5 本书高度不同：表现重要性与时长
  switch (idx) {
    case 0:
      return 200; // 引子 - 短
    case 1:
      return 280; // 高粱河 - 重要 + 长
    case 2:
      return 180; // 七年 - 短
    case 3:
      return 300; // 雍熙 - 最长 + 最重
    case 4:
      return 220; // 落幕
    default:
      return 220;
  }
}

function pickPalette(idx: number) {
  switch (idx) {
    case 0:
      // 引子 - 宣纸米黄
      return {
        face: "#dcbf78",
        faceDark: "#a87a2c",
        top: "#8b6420",
        topLight: "#dcbf78",
        side: "#5b3818",
        sideDark: "#3a2c20",
        line: "#3a2c20",
        text: "#1a1410",
        accent: "#7d1f10",
        bgInk: "#f5ecd5",
      };
    case 1:
      // 高粱河 - 朱红血染
      return {
        face: "#a23420",
        faceDark: "#5d160a",
        top: "#7d1f10",
        topLight: "#c8523f",
        side: "#3a1a08",
        sideDark: "#1a0808",
        line: "#1a0808",
        text: "#f5ecd5",
        accent: "#e6c25a",
        bgInk: "#7d1f10",
      };
    case 2:
      // 七年酝酿 - 墨黑
      return {
        face: "#3a2c20",
        faceDark: "#1a1410",
        top: "#1a1410",
        topLight: "#2a2018",
        side: "#0e0a07",
        sideDark: "#000000",
        line: "#0e0a07",
        text: "#e6c25a",
        accent: "#c8523f",
        bgInk: "#1a1410",
      };
    case 3:
      // 雍熙北伐 - 深红 + 墨
      return {
        face: "#7d1f10",
        faceDark: "#3a1a08",
        top: "#5d160a",
        topLight: "#a23420",
        side: "#1a0808",
        sideDark: "#000000",
        line: "#1a0808",
        text: "#f5ecd5",
        accent: "#e6c25a",
        bgInk: "#7d1f10",
      };
    case 4:
      // 落幕 - 远山青 + 米色
      return {
        face: "#6c8a73",
        faceDark: "#33493b",
        top: "#4a6852",
        topLight: "#8aa890",
        side: "#1a2630",
        sideDark: "#0e0a07",
        line: "#1a2630",
        text: "#f5ecd5",
        accent: "#e6c25a",
        bgInk: "#33493b",
      };
    default:
      return pickPalette(0);
  }
}
