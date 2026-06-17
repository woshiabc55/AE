import Stage from '@/components/Stage';
import HUD from '@/components/HUD';
import ControlPanel from '@/components/ControlPanel';
import StartOverlay from '@/components/StartOverlay';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05060B] text-white select-none">
      <Stage />
      {/* 暗角 + 噪点叠加层（仅 CSS） */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 100%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-[0.07]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        }}
      />
      <HUD />
      <div className="pointer-events-none absolute bottom-4 right-4 z-10">
        <div className="pointer-events-auto">
          <ControlPanel />
        </div>
      </div>
      <StartOverlay />
    </main>
  );
}
