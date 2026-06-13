/**
 * 体积光 + 扫描线 + 噪点 + 暗角
 */
export default function LightRays() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[4] overflow-hidden">
      {/* 体积光 1：暖色 */}
      <div
        className="light-ray"
        style={{
          background:
            "conic-gradient(from 220deg at 72% 22%, rgba(255,255,255,0) 0deg, rgba(255,138,42,0.22) 16deg, rgba(255,42,42,0.16) 32deg, rgba(255,255,255,0) 60deg, rgba(124,246,255,0) 110deg, rgba(255,255,255,0) 220deg, rgba(255,138,42,0.1) 280deg, rgba(255,255,255,0) 360deg)",
          opacity: 0.95,
        }}
      />
      {/* 体积光 2：冷色（青色对位） */}
      <div
        className="light-ray"
        style={{
          background:
            "conic-gradient(from 50deg at 28% 78%, rgba(255,255,255,0) 0deg, rgba(124,246,255,0.22) 16deg, rgba(124,246,255,0) 60deg, rgba(255,255,255,0) 220deg, rgba(124,246,255,0.16) 290deg, rgba(255,255,255,0) 360deg)",
          animationDirection: "reverse",
          opacity: 0.85,
        }}
      />
      {/* 顶部斜光束 */}
      <div
        className="absolute -top-32 -left-20 w-[60vw] h-[40vh] rotate-[-22deg] origin-top-left"
        style={{
          background:
            "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,138,42,0.16) 30%, rgba(255,42,42,0.12) 60%, rgba(255,255,255,0) 100%)",
          filter: "blur(36px)",
          mixBlendMode: "screen",
        }}
      />
      {/* 扫描线 */}
      <div className="scanlines absolute inset-0" />
      {/* 暗角 */}
      <div className="vignette absolute inset-0" />
      {/* 噪点 */}
      <div className="noise-overlay absolute inset-0" />
      {/* 顶部红色横条 */}
      <div
        className="absolute left-0 right-0 h-[2px]"
        style={{
          top: "12%",
          background:
            "linear-gradient(90deg, transparent, rgba(255,42,42,0.7), transparent)",
          boxShadow: "0 0 16px rgba(255,42,42,0.6)",
        }}
      />
      <div
        className="absolute left-0 right-0 h-[1px]"
        style={{
          top: "88%",
          background:
            "linear-gradient(90deg, transparent, rgba(124,246,255,0.5), transparent)",
          boxShadow: "0 0 10px rgba(124,246,255,0.4)",
        }}
      />
    </div>
  );
}
