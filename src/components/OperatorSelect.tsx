import { useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";
import { OPERATOR_LIST, type OperatorClass, type OperatorDef } from "@/game/operators";

const OP_VARIANT: Record<OperatorClass, "primary" | "alpha" | "warn"> = {
  assault: "primary",
  recon: "alpha",
  support: "warn",
};

export function OperatorSelect() {
  const startMatch = useGameStore((s) => s.startMatch);
  const goTo = useGameStore((s) => s.goTo);
  const [selected, setSelected] = useState<OperatorClass>("assault");
  const op: OperatorDef = OPERATOR_LIST.find((o) => o.id === selected)!;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-950 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 bg-void-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-50" />

      <div className="relative z-10 w-[min(96vw,860px)] animate-fade-in">
        {/* 标题 */}
        <div className="text-center mb-6">
          <h2 className="font-pixel text-lg md:text-2xl text-tac-400 text-glow-tac mb-1">
            选择干员
          </h2>
          <p className="font-term text-lg text-tac-400/60">
            SELECT OPERATOR · ALPHA 小队待命
          </p>
        </div>

        {/* 干员卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
          {OPERATOR_LIST.map((o) => {
            const isSel = o.id === selected;
            const variant = OP_VARIANT[o.id];
            const borderClass =
              o.id === "assault"
                ? "border-tac-500"
                : o.id === "recon"
                  ? "border-alpha-500"
                  : "border-warn-500";
            const textClass =
              o.id === "assault"
                ? "text-tac-400"
                : o.id === "recon"
                  ? "text-alpha-400"
                  : "text-warn-500";
            return (
              <button
                key={o.id}
                onClick={() => setSelected(o.id)}
                className={`text-left border-2 bg-void-800/90 p-4 transition-all duration-150 shadow-pixel ${
                  isSel
                    ? `${borderClass} ${textClass} shadow-glowTac`
                    : "border-void-600 text-tac-400/60 hover:border-void-500"
                }`}
                style={
                  isSel && o.id === "assault"
                    ? { boxShadow: "0 0 18px rgba(79,214,194,0.5)" }
                    : isSel && o.id === "recon"
                      ? { boxShadow: "0 0 18px rgba(58,140,255,0.5)" }
                      : isSel && o.id === "support"
                        ? { boxShadow: "0 0 18px rgba(255,138,61,0.5)" }
                        : undefined
                }
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-pixel text-xs tracking-widest">{o.role}</span>
                  {isSel && <span className="font-pixel text-[9px]">[ SELECTED ]</span>}
                </div>
                <div className={`font-pixel text-base mb-2 ${isSel ? textClass : ""}`}>{o.name}</div>
                <p className="font-term text-base leading-snug mb-3 min-h-[3.4em]">
                  {o.desc}
                </p>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-term text-sm">
                  <Stat label="HP" value={o.maxHp} />
                  <Stat label="护甲" value={`${Math.round(o.armor * 100)}%`} />
                  <Stat label="速度" value={o.speed.toFixed(1)} />
                  <Stat label="弹匣" value={o.magSize} />
                  <Stat label="伤害" value={o.damage} />
                  <Stat label="备弹" value={o.reserveAmmo} />
                </div>
              </button>
            );
          })}
        </div>

        {/* 选中详情 + 操作 */}
        <div className="border-2 border-void-600 bg-void-800/80 p-4 flex items-center justify-between">
          <div>
            <div className="font-pixel text-xs text-tac-400/60 mb-1">已选干员</div>
            <div className="font-pixel text-sm text-tac-400 text-glow-tac">
              {op.name} · {op.role}
            </div>
          </div>
          <div className="flex gap-3">
            <PixelButton variant="ghost" onClick={() => goTo("menu")}>
              返回
            </PixelButton>
            <PixelButton variant={OP_VARIANT[selected]} onClick={() => startMatch(selected)}>
              部署
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="flex items-center justify-between border-b border-void-700/60">
      <span className="text-tac-400/50">{label}</span>
      <span className="text-tac-400/90">{value}</span>
    </div>
  );
}
