import { useFXStore } from "@/store/ui";

/**
 * HexBackground —— 全局背景层
 * 叠加 径向渐变 + 六边形网格 + 横向扫描线 + 顶部高光
 */
export function HexBackground() {
  const { scanlineEnabled, scanlineSpeed, hexEnabled, glowIntensity } = useFXStore();
  const speed = scanlineSpeed > 0 ? `${4.2 / Math.max(scanlineSpeed, 0.1)}s` : "0s";
  const speedPaused = scanlineSpeed === 0;

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ ["--glow" as never]: glowIntensity }}
    >
      {/* 径向渐变底色 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 0%, #0e1830 0%, #0a0e1a 35%, #050810 75%, #03050b 100%)",
        }}
      />

      {/* 六边形网格 */}
      {hexEnabled && (
        <svg
          className="absolute inset-0 h-full w-full opacity-[0.18]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hex"
              x="0"
              y="0"
              width="56"
              height="64.8"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M28 0 L56 16 L56 48 L28 64 L0 48 L0 16 Z"
                fill="none"
                stroke="rgba(94,227,255,0.18)"
                strokeWidth="0.6"
              />
            </pattern>
            <radialGradient id="hex-mask" cx="50%" cy="35%" r="70%">
              <stop offset="0%" stopColor="white" stopOpacity="0.95" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
            <mask id="hex-mask-use">
              <rect width="100%" height="100%" fill="url(#hex-mask)" />
            </mask>
          </defs>
          <rect width="100%" height="100%" fill="url(#hex)" mask="url(#hex-mask-use)" />
        </svg>
      )}

      {/* 顶部金色辉光 + 底部冷光 */}
      <div
        className="absolute -top-40 left-1/2 h-[420px] w-[1100px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(232,196,119,0.18), transparent 70%)",
          opacity: glowIntensity,
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 h-[360px] w-[1400px] -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgba(94,227,255,0.18), transparent 70%)",
          opacity: glowIntensity,
        }}
      />

      {/* 扫描线 */}
      {scanlineEnabled && !speedPaused && (
        <div
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(94,227,255,0.85), transparent)",
            boxShadow: "0 0 18px rgba(94,227,255,0.6)",
            animation: `ark-scan ${speed} linear infinite`,
            opacity: glowIntensity,
          }}
        />
      )}

      {/* 横向细线纹理 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 1px, transparent 3px)",
          mixBlendMode: "overlay",
        }}
      />
    </div>
  );
}
