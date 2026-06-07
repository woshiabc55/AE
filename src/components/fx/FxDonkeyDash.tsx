// 特殊效果 1：驴车漂移
// 纯 CSS 关键帧：驴车从左冲向右，两次急转倾斜
export function FxDonkeyDash() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, #a87a2c 0%, #7d1f10 40%, #1a1410 100%)",
      }}
    >
      {/* 太阳 */}
      <div
        className="absolute"
        style={{
          top: "12%",
          right: "8%",
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "radial-gradient(circle, #f5ecd5 0%, #e6c25a 80%)",
          boxShadow: "0 0 30px rgba(245,236,213,0.5)",
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
          fill="rgba(14,10,7,0.4)"
        />
        <path
          d="M0 95 L80 75 L160 90 L240 70 L320 88 L400 78 L400 120 L0 120 Z"
          fill="rgba(14,10,7,0.6)"
        />
      </svg>
      {/* 道路 */}
      <div
        className="absolute left-0 right-0"
        style={{ bottom: 0, height: 35, background: "#3a2c20" }}
      />
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: 30,
          height: 2,
          background:
            "repeating-linear-gradient(90deg, rgba(245,236,213,0.6) 0 14px, transparent 14px 28px)",
        }}
      />
      {/* 追杀骑兵 */}
      <div className="absolute bottom-7 left-0 right-0 h-12">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: `-10%`,
              bottom: 0,
              width: 40,
              height: 30,
              animation: `donkeyPursue 2.6s linear ${i * 0.18}s infinite`,
            }}
          >
            <div className="w-6 h-3 bg-mo-900 rounded-full mx-auto" />
            <div className="w-1 h-4 bg-mo-900 mx-auto" />
            <div className="w-1 h-2 bg-mo-900 inline-block ml-1" />
            <div className="w-1 h-2 bg-mo-900 inline-block mr-1" />
          </div>
        ))}
      </div>
      {/* 飞箭 */}
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="absolute"
          style={{
            top: `${30 + i * 8}%`,
            left: 0,
            width: 30,
            height: 2,
            background: "#1a1410",
            boxShadow: "0 0 0 1px #f5ecd5",
            animation: `donkeyArrow 1.2s linear ${i * 0.35}s infinite`,
          }}
        />
      ))}
      {/* 驴车 */}
      <div
        className="absolute"
        style={{
          bottom: 25,
          left: 0,
          width: 90,
          height: 50,
          animation: "donkeyDash 4s ease-in-out infinite",
        }}
      >
        {/* 车箱 */}
        <div
          className="absolute"
          style={{
            left: 0,
            top: 0,
            width: 60,
            height: 32,
            background: "linear-gradient(180deg, #7d1f10, #5d160a)",
            border: "1px solid #1a1410",
          }}
        >
          <div
            className="absolute"
            style={{
              left: 6,
              top: 6,
              width: 48,
              height: 18,
              background:
                "repeating-linear-gradient(90deg, rgba(245,236,213,0.4) 0 4px, transparent 4px 8px)",
            }}
          />
        </div>
        {/* 篷 */}
        <div
          className="absolute"
          style={{
            left: 12,
            top: -18,
            width: 36,
            height: 20,
            background: "linear-gradient(180deg, #c89a2a, #9b7517)",
            borderRadius: "8px 8px 0 0",
            border: "1px solid #1a1410",
          }}
        />
        {/* 轮 */}
        <div
          className="absolute"
          style={{
            left: 4,
            top: 28,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(circle, #1a1410 35%, #5b4634 36%, #1a1410 65%)",
            border: "2px solid #1a1410",
            animation: "donkeyWheel 0.4s linear infinite",
          }}
        />
        <div
          className="absolute"
          style={{
            right: 4,
            top: 28,
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: "radial-gradient(circle, #1a1410 35%, #5b4634 36%, #1a1410 65%)",
            border: "2px solid #1a1410",
            animation: "donkeyWheel 0.4s linear infinite",
          }}
        />
        {/* 驴头 */}
        <div
          className="absolute"
          style={{ right: -22, top: 8, width: 28, height: 20 }}
        >
          <div
            className="absolute"
            style={{
              left: 0,
              top: 4,
              width: 18,
              height: 12,
              background: "#5b4634",
              borderRadius: "8px 4px 4px 8px",
            }}
          />
          <div
            className="absolute"
            style={{
              left: 16,
              top: 2,
              width: 10,
              height: 10,
              background: "#5b4634",
              borderRadius: "50%",
            }}
          />
          <div
            className="absolute"
            style={{ right: 0, top: -2, width: 4, height: 8, background: "#5b4634" }}
          />
        </div>
      </div>
      {/* 文字 */}
      <div className="absolute left-4 top-3 seal text-[10px]">高粱河</div>
      <div className="absolute right-4 top-3 font-mono text-[10px] tracking-[0.2em] text-xuan-100/80">
        FX · CSS · 4s LOOP
      </div>
      <style>{`
        @keyframes donkeyDash {
          0%   { transform: translateX(-110px) rotate(0deg); }
          40%  { transform: translateX(40vw)  rotate(8deg); }
          50%  { transform: translateX(45vw)  rotate(-10deg); }
          60%  { transform: translateX(50vw)  rotate(6deg); }
          100% { transform: translateX(110vw) rotate(2deg); }
        }
        @keyframes donkeyWheel { to { transform: rotate(360deg); } }
        @keyframes donkeyArrow { 0% { left: -10%; opacity: 0; } 30% { opacity: 1; } 100% { left: 110%; opacity: 0; } }
        @keyframes donkeyPursue {
          0%   { transform: translateX(-20px); }
          100% { transform: translateX(110vw); }
        }
      `}</style>
    </div>
  );
}
