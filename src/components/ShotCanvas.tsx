import type { Shot } from "@/data/shots";

interface ShotCanvasProps {
  shot: Shot;
  isActive: boolean;
}

// 每个镜头的"画框内"示意 — 用 SVG 几何抽象表示分镜内容
// 重点在"电影监视器预览"质感，而非具象图形
export default function ShotCanvas({ shot, isActive }: ShotCanvasProps) {
  return (
    <div
      className="relative w-full h-full flex items-center justify-center transition-all duration-700"
      style={{
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${shot.palette.bg}, ${darken(shot.palette.bg, 0.5)})`,
      }}
    >
      {/* Safe area guides */}
      <SafeAreaGuides />

      {/* Caustic light for surface shots */}
      {shot.id === "shot-21" && <Caustics />}

      {/* Tindall light beam for underwater */}
      {shot.id === "shot-22" && <TindallBeam />}

      {/* Sediment puff for impact */}
      {shot.id === "shot-23" && <SedimentCloud active={isActive} />}

      {/* Subject marker (crosshair at gps position) */}
      <SubjectMarker shot={shot} active={isActive} />

      {/* Shot-specific geometric representation */}
      <SubjectShape shot={shot} active={isActive} />

      {/* Camera reticle overlay */}
      <CameraReticle shot={shot} />

      {/* Atmospheric particles */}
      <Particles shot={shot} />
    </div>
  );
}

function SafeAreaGuides() {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
      <rect x="5%" y="5%" width="90%" height="90%" stroke="rgba(232,232,232,0.06)" strokeWidth="1" strokeDasharray="2 4" fill="none" />
      <rect x="10%" y="10%" width="80%" height="80%" stroke="rgba(232,232,232,0.04)" strokeWidth="1" fill="none" />
    </svg>
  );
}

function Caustics() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full mix-blend-screen animate-caustic"
          style={{
            width: `${30 + (i % 4) * 30}px`,
            height: `${30 + (i % 4) * 30}px`,
            top: `${10 + (i * 11) % 80}%`,
            left: `${5 + (i * 17) % 85}%`,
            background: "radial-gradient(circle, rgba(244,162,97,0.5) 0%, transparent 70%)",
            filter: "blur(8px)",
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

function TindallBeam() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute"
        style={{
          top: "-10%",
          left: "30%",
          width: "40%",
          height: "120%",
          background: "linear-gradient(180deg, rgba(173,216,230,0.35) 0%, rgba(173,216,230,0.05) 60%, transparent 100%)",
          transform: "rotate(-12deg)",
          filter: "blur(6px)",
        }}
      />
      {/* Floating debris */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-bone/40 rounded-full"
          style={{
            top: `${(i * 13) % 100}%`,
            left: `${20 + (i * 7) % 60}%`,
            filter: "blur(0.5px)",
            animation: `dust ${8 + (i % 4)}s linear infinite`,
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  );
}

function SedimentCloud({ active }: { active: boolean }) {
  return (
    <div className="absolute inset-0 flex items-end justify-center pointer-events-none">
      <div
        className={`relative ${active ? "animate-sediment" : "opacity-30"}`}
        style={{
          width: "60%",
          height: "60%",
          bottom: "20%",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(220,220,220,0.7) 0%, rgba(180,180,180,0.3) 50%, transparent 75%)",
            filter: "blur(20px)",
          }}
        />
      </div>
    </div>
  );
}

function SubjectMarker({ shot, active }: { shot: Shot; active: boolean }) {
  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${shot.gpsMark.x * 100}%`,
        top: `${shot.gpsMark.y * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      <div className="relative">
        <div
          className={`w-12 h-12 border ${active ? "border-blood" : "border-fog/40"} transition-colors`}
          style={{ borderWidth: "1px" }}
        >
          <div className={`absolute top-1/2 left-0 w-2 h-px ${active ? "bg-blood" : "bg-fog/60"}`} />
          <div className={`absolute top-1/2 right-0 w-2 h-px ${active ? "bg-blood" : "bg-fog/60"}`} />
          <div className={`absolute left-1/2 top-0 h-2 w-px ${active ? "bg-blood" : "bg-fog/60"}`} />
          <div className={`absolute left-1/2 bottom-0 h-2 w-px ${active ? "bg-blood" : "bg-fog/60"}`} />
        </div>
        <div className={`absolute -top-5 left-0 font-mono text-[9px] tracking-widest ${active ? "text-blood" : "text-fog/50"}`}>
          [{shot.motif}]
        </div>
      </div>
    </div>
  );
}

function SubjectShape({ shot, active }: { shot: Shot; active: boolean }) {
  switch (shot.id) {
    case "shot-21":
      return <FloatingDebris color={shot.palette.accent} active={active} />;
    case "shot-22":
      return <SinkingBody active={active} />;
    case "shot-23":
      return <SeafloorScene active={active} color={shot.palette.accent} />;
    case "shot-24":
      return <FaceCloseUp active={active} />;
    case "shot-25":
      return <PullBackScene active={active} color={shot.palette.accent} />;
  }
}

function FloatingDebris({ color, active }: { color: string; active: boolean }) {
  return (
    <div
      className={`relative transition-transform duration-700 ${active ? "scale-100" : "scale-90 opacity-40"}`}
      style={{ animation: active ? "caustic 4s ease-in-out infinite" : undefined }}
    >
      <svg width="180" height="60" viewBox="0 0 180 60">
        <defs>
          <linearGradient id="debris-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M 10 30 L 30 12 L 60 18 L 95 8 L 130 22 L 160 15 L 170 32 L 155 48 L 120 52 L 80 50 L 40 55 L 18 45 Z"
          fill="url(#debris-grad)"
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Claw marks */}
        <g stroke="#1A1A1A" strokeWidth="1.5" opacity="0.7">
          <line x1="50" y1="20" x2="50" y2="50" />
          <line x1="60" y1="18" x2="60" y2="50" />
          <line x1="70" y1="22" x2="70" y2="50" />
        </g>
        {/* Keratin fragment */}
        <circle cx="60" cy="45" r="2" fill="#6B3FA0" />
      </svg>
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-mono text-[9px] text-fog/60 tracking-widest whitespace-nowrap">
        CHIXIAO · L · SHOULDER
      </div>
    </div>
  );
}

function SinkingBody({ active }: { active: boolean }) {
  return (
    <div
      className={`relative transition-all duration-700 ${active ? "opacity-90" : "opacity-30"}`}
      style={{
        transform: `rotate(70deg) ${active ? "translateY(0)" : "translateY(-20px)"}`,
      }}
    >
      <svg width="100" height="180" viewBox="0 0 100 180">
        {/* Body silhouette */}
        <ellipse cx="50" cy="60" rx="22" ry="28" fill="#C04050" opacity="0.8" />
        <rect x="38" y="80" width="24" height="60" fill="#C04050" opacity="0.7" />
        {/* Arms */}
        <rect x="14" y="80" width="20" height="50" fill="#C04050" opacity="0.6" />
        <rect x="66" y="85" width="18" height="45" fill="#888" opacity="0.6" />
        {/* Mechanical left eye */}
        <circle cx="40" cy="55" r="4" fill="#1A1A1A" stroke="#888" strokeWidth="0.5" />
        {/* Cyanosis lips */}
        <line x1="44" y1="68" x2="56" y2="68" stroke="#3A2B5C" strokeWidth="2" />
        {/* Hair flowing */}
        <path d="M 30 35 Q 20 50 25 70" stroke="#0A0A0A" strokeWidth="3" fill="none" />
        {/* Bubbles */}
        {[0, 1, 2, 3].map((i) => (
          <circle
            key={i}
            cx={50 + (i - 2) * 8}
            cy={70 + i * 25}
            r={2 + i * 0.4}
            fill="none"
            stroke="rgba(232,232,232,0.5)"
            strokeWidth="0.5"
            style={{
              animation: `bubble ${3 + i}s ease-out infinite`,
              animationDelay: `${i * 0.6}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

function SeafloorScene({ active, color }: { active: boolean; color: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-700 ${active ? "opacity-90" : "opacity-30"}`}>
      <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        {/* Seafloor curve */}
        <path
          d="M 0 280 Q 150 270 300 285 T 600 280 L 600 400 L 0 400 Z"
          fill="rgba(180,180,180,0.15)"
        />
        <path
          d="M 0 300 Q 200 295 400 305 T 600 300 L 600 400 L 0 400 Z"
          fill="rgba(150,150,150,0.25)"
        />
        {/* Body on floor */}
        <ellipse cx="300" cy="270" rx="50" ry="20" fill="#5A4040" opacity="0.7" />
        <ellipse cx="300" cy="265" rx="15" ry="10" fill="#5A4040" opacity="0.7" />
        {/* Chest armor (melted) */}
        <path
          d="M 200 250 Q 250 240 300 245 L 300 280 L 200 285 Z"
          fill={color}
          opacity="0.5"
          stroke={color}
          strokeWidth="0.5"
        />
        {/* Left arm with spread fingers */}
        <g transform="translate(380 270) rotate(-30)">
          <rect x="0" y="0" width="40" height="8" fill="#666" />
          {[0, 1, 2, 3, 4].map((i) => (
            <line key={i} x1={42 + i * 4} y1="0" x2={48 + i * 4} y2={-8 + i} stroke="#888" strokeWidth="1.5" />
          ))}
        </g>
        {/* Hydraulic tubes */}
        <path d="M 100 290 Q 130 285 160 295" stroke="#444" strokeWidth="3" fill="none" />
        <path d="M 440 295 Q 470 290 500 300" stroke="#444" strokeWidth="3" fill="none" />
      </svg>
    </div>
  );
}

function FaceCloseUp({ active }: { active: boolean }) {
  return (
    <div className={`relative transition-opacity duration-1000 ${active ? "opacity-100" : "opacity-30"}`}>
      <svg width="280" height="200" viewBox="0 0 280 200">
        {/* Face oval */}
        <ellipse cx="140" cy="100" rx="90" ry="100" fill="rgba(80,60,80,0.4)" />
        {/* Right eye half-open */}
        <ellipse cx="105" cy="85" rx="10" ry="4" fill="rgba(60,50,60,0.8)" />
        <circle cx="105" cy="85" r="3" fill="#1A1A1A" />
        {/* Left eye - mechanical cover */}
        <rect x="160" y="72" width="30" height="22" fill="#0A0A0A" stroke="#444" strokeWidth="0.5" />
        <line x1="160" y1="83" x2="190" y2="83" stroke="#222" strokeWidth="0.5" />
        {/* Cyanosis lips */}
        <path d="M 115 130 Q 140 128 165 130 Q 140 138 115 130 Z" fill="#3A2B5C" opacity="0.8" />
        {/* Forehead wound */}
        <path d="M 120 30 L 130 38 L 122 42" stroke="#3A0A0A" strokeWidth="1.5" fill="none" />
        {/* Small sea snail on eye cover */}
        <circle cx="175" cy="80" r="3" fill="#D4A574" />
        <path d="M 173 80 Q 175 78 177 80" stroke="#8B6F47" strokeWidth="0.5" fill="none" />
        {/* Scar on neck */}
        <line x1="135" y1="195" x2="155" y2="195" stroke="#888" strokeWidth="1" opacity="0.6" />
      </svg>
    </div>
  );
}

function PullBackScene({ active, color }: { active: boolean; color: string }) {
  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-opacity duration-700 ${active ? "opacity-100" : "opacity-30"}`}>
      <svg width="100%" height="100%" viewBox="0 0 600 400" preserveAspectRatio="xMidYMid meet">
        {/* Horizon - sun */}
        <circle cx="450" cy="120" r="50" fill={color} opacity="0.8" />
        <rect x="0" y="120" width="600" height="2" fill="rgba(244,162,97,0.3)" />
        {/* Sea surface */}
        <rect x="0" y="120" width="600" height="280" fill="rgba(26,77,107,0.4)" />
        {/* Underwater depth gradient */}
        <defs>
          <linearGradient id="depth-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(15,42,61,0.6)" />
            <stop offset="100%" stopColor="rgba(5,8,16,0.95)" />
          </linearGradient>
        </defs>
        <rect x="0" y="122" width="600" height="278" fill="url(#depth-grad)" />
        {/* Tiny debris at bottom (recede) */}
        <g opacity={active ? "0.3" : "0.1"}>
          <rect x="280" y="370" width="40" height="3" fill="#666" />
          <circle cx="290" cy="375" r="2" fill="#5A4040" />
        </g>
        {/* Wave lines */}
        {[180, 220, 260, 300, 340, 380].map((y, i) => (
          <path
            key={i}
            d={`M 0 ${y} Q 150 ${y - 3} 300 ${y} T 600 ${y}`}
            stroke="rgba(232,232,232,0.1)"
            strokeWidth="0.5"
            fill="none"
          />
        ))}
      </svg>
    </div>
  );
}

function CameraReticle({ shot }: { shot: Shot }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-3 left-3 font-mono text-[9px] text-fog/40 tracking-widest">
        FRAME · {shot.shotType}
      </div>
      <div className="absolute top-3 right-3 font-mono text-[9px] text-fog/40 tracking-widest">
        DEPTH · {shot.depth === 0 && shot.altitude ? `+${shot.altitude}m` : `${shot.depth}m`}
      </div>
      <div className="absolute bottom-3 left-3 font-mono text-[9px] text-fog/40 tracking-widest">
        {shot.timecode.start} — {shot.timecode.end}
      </div>
      <div className="absolute bottom-3 right-3 font-mono text-[9px] text-fog/40 tracking-widest">
        IMAX 3D
      </div>
    </div>
  );
}

function Particles({ shot }: { shot: Shot }) {
  const count = shot.id === "shot-22" || shot.id === "shot-24" ? 30 : 8;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="absolute w-px h-px bg-bone/30 rounded-full"
          style={{
            top: `${(i * 17) % 100}%`,
            left: `${(i * 23) % 100}%`,
            animation: `dust ${10 + (i % 5) * 2}s linear infinite`,
            animationDelay: `${i * 0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

function darken(hex: string, amount: number): string {
  const m = hex.replace("#", "");
  const r = parseInt(m.slice(0, 2), 16);
  const g = parseInt(m.slice(2, 4), 16);
  const b = parseInt(m.slice(4, 6), 16);
  const f = 1 - amount;
  const rr = Math.max(0, Math.floor(r * f)).toString(16).padStart(2, "0");
  const gg = Math.max(0, Math.floor(g * f)).toString(16).padStart(2, "0");
  const bb = Math.max(0, Math.floor(b * f)).toString(16).padStart(2, "0");
  return `#${rr}${gg}${bb}`;
}
