import { ACTS } from "@/data/acts";
import { ActCard } from "./ActCard";
import { BrushTitle } from "@/components/common/BrushTitle";
import { useWorkbenchStore } from "@/store/useWorkbenchStore";
import { Reveal } from "@/components/common/Reveal";

export function Breakdown() {
  const { activeActId, setActiveAct } = useWorkbenchStore();
  return (
    <section className="relative">
      <Reveal>
        <div className="flex items-end justify-between mb-6">
          <BrushTitle
            zh="拆解剧本"
            en="SCRIPT BREAKDOWN"
            seal="壹"
          />
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-mo-600">
            5 ACTS · CLICK TO EXPAND
          </div>
        </div>
      </Reveal>
      {ACTS.map((a) => (
        <ActCard
          key={a.id}
          act={a}
          isActive={a.id === activeActId}
          onActivate={setActiveAct}
        />
      ))}
    </section>
  );
}
