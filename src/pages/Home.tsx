import Hero from "../components/Hero";
import CharacterCards from "../components/CharacterCards";
import ScriptSection from "../components/ScriptSection";
import SceneTimeline from "../components/SceneTimeline";
import PropsAndVFX from "../components/PropsAndVFX";
import AudioDesign from "../components/AudioDesign";
import ProductionTable from "../components/ProductionTable";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <CharacterCards />
      <ScriptSection />
      <SceneTimeline />
      <PropsAndVFX />
      <AudioDesign />
      <ProductionTable />
      <Footer />
    </main>
  );
}
