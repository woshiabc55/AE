// 特殊效果 3：陈家谷伏击
// 极低饱和度冷蓝 + 米白月光 + 残旗摇摆 + 落空朱印
export function FxChenjia() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #1a2630 0%, #2a3a4a 40%, #0e0a07 100%)",
      }}
    >
      {/* 月光 */}
      <div
        className="absolute"
        style={{
          top: "8%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f5ecd5 0%, rgba(245,236,213,0.2) 70%)",
          boxShadow: "0 0 80px rgba(245,236,213,0.4)",
        }}
      />
      {/* 光柱 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 animate-flicker"
        style={{
          top: 0,
          width: 200,
          height: "100%",
          background:
            "linear-gradient(180deg, rgba(245,236,213,0.25) 0%, rgba(245,236,213,0.05) 50%, rgba(245,236,213,0) 100%)",
          clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0% 100%)",
        }}
      />
      {/* 远山 */}
      <svg
        viewBox="0 0 400 120"
        className="absolute bottom-0 left-0 w-full h-1/2"
        preserveAspectRatio="none"
      >
        <path
          d="M0 80 L60 50 L120 70 L180 40 L260 65 L340 45 L400 60 L400 120 L0 120 Z"
          fill="rgba(14,10,7,0.6)"
        />
        <path
          d="M0 95 L80 75 L160 90 L240 70 L320 88 L400 78 L400 120 L0 120 Z"
          fill="rgba(14,10,7,0.85)"
        />
      </svg>
      {/* 残旗 */}
      <div
        className="absolute"
        style={{
          bottom: 50,
          left: "20%",
          width: 4,
          height: 80,
          background: "#1a1410",
        }}
      >
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: 60,
            height: 40,
            background: "linear-gradient(180deg, #5d160a 0%, #7d1f10 100%)",
            transformOrigin: "0 50%",
            animation: "chenjiaFlag 2.4s ease-in-out infinite",
            boxShadow: "0 0 12px rgba(125,31,16,0.5)",
          }}
        />
      </div>
      <div
        className="absolute"
        style={{
          bottom: 50,
          right: "20%",
          width: 4,
          height: 80,
          background: "#1a1410",
        }}
      >
        <div
          className="absolute"
          style={{
            top: 0,
            left: 0,
            width: 50,
            height: 32,
            background: "linear-gradient(180deg, #5d160a 0%, #7d1f10 100%)",
            transformOrigin: "0 50%",
            animation: "chenjiaFlag 2.8s ease-in-out infinite reverse",
            boxShadow: "0 0 10px rgba(125,31,16,0.5)",
          }}
        />
      </div>
      {/* 杨业剪影（中央光柱中） */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{ bottom: 0, width: 60, height: 120 }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 0,
            width: 22,
            height: 22,
            background: "rgba(14,10,7,0.85)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            top: 22,
            width: 40,
            height: 80,
            background: "linear-gradient(180deg, rgba(245,236,213,0.2), rgba(14,10,7,0.85))",
            clipPath: "polygon(0 0, 100% 0, 80% 100%, 20% 100%)",
          }}
        />
        {/* 长刀 */}
        <div
          style={{
            position: "absolute",
            left: "70%",
            top: 30,
            width: 2,
            height: 70,
            background: "rgba(245,236,213,0.7)",
            transform: "rotate(15deg)",
          }}
        />
      </div>
      {/* 落空朱印（飞入右下） */}
      <div
        className="absolute right-6 bottom-6"
        style={{ animation: "chenjiaStamp 4s ease-out infinite" }}
      >
        <div className="seal text-[10px] opacity-90 rotate-[-6deg]">空谷</div>
      </div>
      {/* 烟霭 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            left: "10%",
            bottom: 30,
            width: 80,
            height: 40,
            background:
              "radial-gradient(ellipse, rgba(245,236,213,0.18) 0%, transparent 70%)",
            animation: "chenjiaMist 6s ease-in-out infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            right: "10%",
            bottom: 50,
            width: 100,
            height: 50,
            background:
              "radial-gradient(ellipse, rgba(245,236,213,0.18) 0%, transparent 70%)",
            animation: "chenjiaMist 8s ease-in-out infinite",
            animationDelay: "2s",
          }}
        />
      </div>
      <div className="absolute left-4 top-3 seal text-[10px]">陈家谷</div>
      <div className="absolute right-4 top-3 font-mono text-[10px] tracking-[0.2em] text-xuan-100/80">
        FX · CSS · 4s LOOP
      </div>
      <style>{`
        @keyframes chenjiaFlag {
          0%,100% { transform: skewX(-6deg); }
          50%     { transform: skewX(8deg); }
        }
        @keyframes chenjiaStamp {
          0%   { transform: translate(60px, 60px) scale(0); opacity: 0; }
          30%  { transform: translate(0, 0) scale(1.2); opacity: 1; }
          70%  { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(0, 0) scale(1); opacity: 0; }
        }
        @keyframes chenjiaMist {
          0%,100% { transform: translate(0, 0); opacity: 0.3; }
          50%     { transform: translate(20px, -10px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
