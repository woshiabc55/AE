import Backdrop from "@/components/Backdrop";
import TextStage from "@/components/TextStage";
import HUD from "@/components/HUD";
import PlayerBar from "@/components/PlayerBar";
import CursorGlow from "@/components/CursorGlow";

export default function Home() {
  return (
    <div
      className="relative h-screen w-screen overflow-hidden bg-ink-950 text-white"
      data-hover
    >
      <Backdrop />
      <TextStage />
      <HUD />
      <PlayerBar />
      <CursorGlow />
    </div>
  );
}
