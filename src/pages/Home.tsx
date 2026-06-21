import StarfieldCanvas from "@/components/StarfieldCanvas";
import HeroSection from "@/components/HeroSection";
import IntroSection from "@/components/IntroSection";
import ChapterSection from "@/components/ChapterSection";
import DustCollision from "@/components/DustCollision";
import StarIgnition from "@/components/StarIgnition";
import FinaleSection from "@/components/FinaleSection";
import Footer from "@/components/Footer";
import { chapters } from "@/data/chapters";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-void">
      <StarfieldCanvas />
      <div className="grain-overlay" />

      <main className="relative z-10">
        <HeroSection />
        <IntroSection />

        {chapters.map((chapter) => (
          <ChapterSection key={chapter.id} chapter={chapter}>
            {chapter.id === "embryo" && <DustCollision />}
            {chapter.id === "time" && <StarIgnition />}
          </ChapterSection>
        ))}

        <FinaleSection />
        <Footer />
      </main>
    </div>
  );
}
