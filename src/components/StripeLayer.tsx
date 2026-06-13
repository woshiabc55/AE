/**
 * 倾斜条纹层 + 远端条带（视觉的"工业百叶"）
 */
export default function StripeLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-[3] overflow-hidden">
      <div className="stripes absolute inset-0" />
      {/* 主斜条带 */}
      <div
        className="absolute -inset-x-32"
        style={{
          top: "12%",
          height: "6px",
          transform: "rotate(-18deg)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,42,42,0.45) 30%, rgba(255,138,42,0.6) 50%, rgba(255,42,42,0.45) 70%, transparent 100%)",
          boxShadow: "0 0 18px rgba(255,42,42,0.6)",
          filter: "blur(0.4px)",
        }}
      />
      <div
        className="absolute -inset-x-32"
        style={{
          top: "28%",
          height: "2px",
          transform: "rotate(-18deg)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(124,246,255,0.4) 50%, transparent 100%)",
          boxShadow: "0 0 12px rgba(124,246,255,0.4)",
        }}
      />
      <div
        className="absolute -inset-x-32"
        style={{
          top: "70%",
          height: "3px",
          transform: "rotate(-18deg)",
          background:
            "linear-gradient(90deg, transparent 0%, rgba(255,138,42,0.35) 50%, transparent 100%)",
          boxShadow: "0 0 10px rgba(255,138,42,0.35)",
        }}
      />
    </div>
  );
}
