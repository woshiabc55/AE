/**
 * 网格地板（透视）层
 * 通过 CSS .grid-floor 实现，并叠加节奏脉冲动画
 */
export default function GridLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[2] overflow-hidden">
      <div className="grid-floor" />
      {/* 远端消失点光晕 */}
      <div
        className="absolute left-1/2 -translate-x-1/2 animate-bgpulse"
        style={{
          top: "20%",
          width: "60vmin",
          height: "60vmin",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(255,42,42,0.18) 0%, rgba(255,42,42,0) 60%)",
          filter: "blur(8px)",
          mixBlendMode: "screen",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          top: "30%",
          width: "36vmin",
          height: "36vmin",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle, rgba(124,246,255,0.16) 0%, rgba(124,246,255,0) 70%)",
          filter: "blur(4px)",
          mixBlendMode: "screen",
        }}
      />
      {/* 地平线 */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: "52%",
          height: "1px",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(124,246,255,0.4) 50%, transparent 100%)",
          boxShadow: "0 0 18px rgba(124,246,255,0.5)",
        }}
      />
    </div>
  );
}
