import { StickyNav } from "@/components/StickyNav";
import { Hero } from "@/components/Hero";
import { CharacterProfile } from "@/components/CharacterProfile";
import { ScriptsSection } from "@/components/ScriptsSection";
import { StorylineTimeline } from "@/components/StorylineTimeline";
import { SloganWall } from "@/components/SloganWall";
import { DragonCursor } from "@/components/DragonCursor";
import { Footer } from "@/components/Footer";
import { useScrollSpy } from "@/hooks/useScrollSpy";

export default function Home() {
  useScrollSpy();
  return (
    <div className="relative">
      <StickyNav />
      <DragonCursor />
      <main>
        <Hero />
        <CharacterProfile />
        <ScriptsSection />
        <StorylineTimeline />
        <SloganWall />
      </main>
      <Footer />
    </div>
  );
}
