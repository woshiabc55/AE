import { useEffect } from "react";
import Hero from "@/components/Hero";
import ShotCard from "@/components/ShotCard";
import DepthRuler from "@/components/DepthRuler";
import LayerSwitcher from "@/components/LayerSwitcher";
import FooterTimeline from "@/components/FooterTimeline";
import EndScreen from "@/components/EndScreen";
import { shots } from "@/data/shots";
import { useAppStore } from "@/store";
import type { ShotId } from "@/data/shots";
import { playCue, shotAudioMap, setMasterVolume } from "@/lib/audio";

export default function Home() {
  const activeShot = useAppStore((s) => s.activeShot);
  const activeLayer = useAppStore((s) => s.activeLayer);
  const setShot = useAppStore((s) => s.setShot);
  const setLayer = useAppStore((s) => s.setLayer);
  const scrollProgress = useAppStore((s) => s.scrollProgress);
  const setScrollProgress = useAppStore((s) => s.setScrollProgress);
  const isMuted = useAppStore((s) => s.isMuted);
  const toggleMute = useAppStore((s) => s.toggleMute);
  const hasEntered = useAppStore((s) => s.hasEntered);
  const setEntered = useAppStore((s) => s.setEntered);

  // Track scroll for progress bar
  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setScrollProgress]);

  // Play audio cue when active shot changes
  useEffect(() => {
    if (!hasEntered) return;
    const cue = shotAudioMap[activeShot];
    if (cue) {
      setMasterVolume(isMuted ? 0 : 0.6);
      playCue(cue, isMuted);
    }
  }, [activeShot, isMuted, hasEntered]);

  // Anchor jump
  const jumpTo = (id: ShotId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const enterSequence = () => {
    setEntered(true);
    setTimeout(() => {
      const el = document.getElementById("shot-21");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <div className="grain relative">
      {/* Stage wrapper */}
      <main>
        <Hero onEnter={enterSequence} />

        {shots.map((shot) => (
          <ShotCard
            key={shot.id}
            shot={shot}
            isActive={activeShot === shot.id}
            layer={activeLayer}
            onEnter={() => setShot(shot.id)}
          />
        ))}

        <EndScreen visible={scrollProgress > 0.92} />
      </main>

      {/* Floating HUD elements */}
      {hasEntered && (
        <>
          <DepthRuler activeShotId={activeShot} />
          <LayerSwitcher active={activeLayer} onChange={setLayer} />
          <FooterTimeline
            activeShotId={activeShot}
            scrollProgress={scrollProgress}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onJump={jumpTo}
          />
        </>
      )}

      {/* Top HUD: persistent project meta */}
      {hasEntered && (
        <div className="fixed top-0 left-0 right-0 z-30 px-6 py-3 flex justify-between items-center pointer-events-none">
          <div className="flex items-center gap-4 font-mono text-[10px] text-fog/70 tracking-widest">
            <span className="text-blood">● REC</span>
            <span>CHIXIAO / 21-25</span>
          </div>
          <div className="font-mono text-[10px] text-fog/70 tracking-widest">
            IMAX 3D · 65MM
          </div>
        </div>
      )}
    </div>
  );
}
