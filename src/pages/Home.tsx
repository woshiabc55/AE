import { useEffect } from "react";
import Hero from "@/components/Hero";
import AgendaScreen from "@/components/AgendaScreen";
import ShotCard from "@/components/ShotCard";
import LayerSwitcher from "@/components/LayerSwitcher";
import FooterTimeline from "@/components/FooterTimeline";
import EndScreen from "@/components/EndScreen";
import SlideNav from "@/components/SlideNav";
import DepthTransition from "@/components/DepthTransition";
import RunningTC from "@/components/RunningTC";
import ZAxisIndicator from "@/components/ZAxisIndicator";
import FilmStrip from "@/components/FilmStrip";
import DirectorScript from "@/components/DirectorScript";
import ColorScript from "@/components/ColorScript";
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
      {/* 顶部跑马灯 TC 条 */}
      {hasEntered && <RunningTC scrollProgress={scrollProgress} />}

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
          <ZAxisIndicator activeShotId={activeShot} scrollProgress={scrollProgress} />
          <ColorScript activeShotId={activeShot} onJump={jumpTo} />
          <LayerSwitcher active={activeLayer} onChange={setLayer} />
          <DirectorScript activeShotId={activeShot} onJump={jumpTo} />
          <FilmStrip activeShotId={activeShot} onJump={jumpTo} />
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

