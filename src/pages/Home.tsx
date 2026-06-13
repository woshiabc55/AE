import Backdrop from "@/components/Backdrop";
import TextStage from "@/components/TextStage";
import HUD from "@/components/HUD";
import PlayerBar from "@/components/PlayerBar";
import CursorGlow from "@/components/CursorGlow";
import LineArt from "@/components/LineArt";
import GridMatrix from "@/components/GridMatrix";

export default function Home() {
  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-ink-950 text-white"
      data-hover
    >
      <Backdrop />
      <LineArt />
      <TextStage />
      <HUD />
      {/* 角落大网格点阵（全屏半透明） */}
      <div
        className="pointer-events-none fixed right-6 top-24 z-[6] hidden h-[260px] w-[400px] lg:block"
        aria-hidden
      >
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-neon/70">
          <span>NX-09 // SPECTRUM</span>
          <span className="text-danger">● REC</span>
        </div>
        <div className="relative h-[220px] w-full border border-neon/15 bg-black/30 backdrop-blur-sm">
          <GridMatrix cols={32} rows={10} full />
          <div className="pointer-events-none absolute inset-0 border border-neon/10" />
        </div>
      </div>
      <div
        className="pointer-events-none fixed left-6 top-24 z-[6] hidden h-[200px] w-[260px] xl:block"
        aria-hidden
      >
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-danger/80">
          <span>FFT // 256</span>
          <span className="text-neon/70">SCAN</span>
        </div>
        <div className="relative h-[170px] w-full border border-danger/15 bg-black/30 backdrop-blur-sm">
          <GridMatrix cols={20} rows={8} full />
          <div className="pointer-events-none absolute inset-0 border border-danger/10" />
        </div>
      </div>
      <PlayerBar />
      <CursorGlow />
    </div>
  );
}
