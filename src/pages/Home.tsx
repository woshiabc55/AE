import { useEffect } from "react";
import Hero from "@/components/Hero";
import AgendaScreen from "@/components/AgendaScreen";
import ShotCard from "@/components/ShotCard";
import DepthRuler from "@/components/DepthRuler";
import LayerSwitcher from "@/components/LayerSwitcher";
import FooterTimeline from "@/components/FooterTimeline";
import EndScreen from "@/components/EndScreen";
import SlideNav from "@/components/SlideNav";
import DepthTransition from "@/components/DepthTransition";
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

  useEffect(() => {
    const onScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [setScrollProgress]);

  useEffect(() => {
    if (!hasEntered) return;
    const cue = shotAudioMap[activeShot];
    if (cue) {
      setMasterVolume(isMuted ? 0 : 0.6);
      playCue(cue, isMuted);
    }
  }, [activeShot, isMuted, hasEntered]);

  const jumpTo = (id: ShotId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const enterSequence = () => {
    setEntered(true);
    setTimeout(() => {
      const el = document.getElementById("agenda");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const goPrev = () => {
    const idx = shots.findIndex((s) => s.id === activeShot);
    if (idx > 0) jumpTo(shots[idx - 1].id);
  };
  const goNext = () => {
    const idx = shots.findIndex((s) => s.id === activeShot);
    if (idx < shots.length - 1) jumpTo(shots[idx + 1].id);
  };
  const goFirst = () => jumpTo(shots[0].id);
  const goLast = () => jumpTo(shots[shots.length - 1].id);

  useEffect(() => {
    if (!hasEntered) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Home") {
        e.preventDefault();
        goFirst();
      } else if (e.key === "End") {
        e.preventDefault();
        goLast();
      } else if (e.key === "m" || e.key === "M") {
        toggleMute();
      } else if (e.key === "1") setLayer("narrative");
      else if (e.key === "2") setLayer("camera");
      else if (e.key === "3") setLayer("audio");
      else if (e.key === "4") setLayer("vfx");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasEntered, activeShot]);

  return (
    <div className="grain relative">
      {/* 顶部场次号 — 永久显示 */}
      {hasEntered && (
        <div className="fixed top-0 left-0 right-0 z-30 px-12 py-2.5 flex justify-between items-center pointer-events-none bg-abyss/40 backdrop-blur-sm border-b border-bone/5">
          <div className="flex items-center gap-4 font-mono text-[10px] text-fog tracking-widest">
            <span className="text-blood">●</span>
            <span className="text-bone">深渊恐惧 / ABYSS FEAR</span>
            <span className="text-fog/40">/</span>
            <span>SEQ 21-25</span>
          </div>
          <div className="font-mono text-[10px] text-fog/60 tracking-widest tabular-nums">
            IMAX 3D · 65mm · {projectMetaTimeFormat(scrollProgress)}
          </div>
        </div>
      )}

      <main className={hasEntered ? "pt-9" : ""}>
        <Hero onEnter={enterSequence} />

        <AgendaScreen
          onEnter={(id) => jumpTo(id)}
          onVisible={() => {/* no-op */}}
        />

        {shots.map((shot) => (
          <ShotCard
            key={shot.id}
            shot={shot}
            index={shot.index - 20}
            total={shots.length}
            isActive={activeShot === shot.id}
            layer={activeLayer}
            onEnter={() => setShot(shot.id)}
          />
        ))}

        <EndScreen visible={scrollProgress > 0.92} />
      </main>

      {hasEntered && (
        <>
          <DepthTransition />
          <DepthRuler activeShotId={activeShot} />
          <LayerSwitcher active={activeLayer} onChange={setLayer} />
          <SlideNav
            activeShotId={activeShot}
            onPrev={goPrev}
            onNext={goNext}
            onFirst={goFirst}
            onLast={goLast}
          />
          <FooterTimeline
            activeShotId={activeShot}
            scrollProgress={scrollProgress}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onJump={jumpTo}
          />
        </>
      )}
    </div>
  );
}

function projectMetaTimeFormat(p: number): string {
  const total = 15;
  const secs = p * total;
  const mm = Math.floor(secs / 60);
  const ss = Math.floor(secs % 60);
  const ff = Math.floor((secs % 1) * 24);
  return `${mm}:${String(ss).padStart(2, "0")}:${String(ff).padStart(2, "0")}`;
}
