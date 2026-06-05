import { HexBackground } from "@/components/HexBackground";
import { ParticleField } from "@/components/ParticleField";
import { StatusBar } from "@/components/StatusBar";
import { FilterBar } from "@/components/FilterBar";
import { SkillGrid } from "@/components/SkillGrid";
import { DetailPanel } from "@/components/DetailPanel";
import { FXConsole } from "@/components/FXConsole";

export default function Home() {
  return (
    <div className="relative min-h-screen text-ark-silver">
      <HexBackground />
      <ParticleField />

      <div className="relative z-10 flex h-screen min-h-[720px] flex-col">
        <StatusBar />
        <FilterBar />

        <main className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <SkillGrid />

            <footer className="mt-12 border-t border-ark-line/40 pt-4 pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-widest text-ark-silver/45">
                <div>RHODES ISLAND · OPERATOR SKILL BATCH TERMINAL · v0.9.2</div>
                <div>© ARKNIGHTS FAN UI · NOT AFFILIATED WITH HYPERGRYPH</div>
              </div>
            </footer>
          </div>

          <DetailPanel />
        </main>
      </div>

      <FXConsole />
    </div>
  );
}
