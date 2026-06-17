import Stage from '@/components/Stage';
import HUD from '@/components/HUD';
import ControlPanel from '@/components/ControlPanel';
import StartOverlay from '@/components/StartOverlay';

export default function Home() {
  return (
    <main className="relative w-screen h-screen overflow-hidden bg-[#05060B] text-white select-none">
      <Stage />
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
