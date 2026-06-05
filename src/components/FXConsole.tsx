import { useState } from "react";
import { useFXStore } from "@/store/ui";
import { Sliders, X, RotateCcw, Sparkles } from "lucide-react";

/**
 * FXConsole —— 光效控制台（浮动抽屉）
 */
export function FXConsole() {
  const [open, setOpen] = useState(true);
  const fx = useFXStore();

  return (
    <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-3">
      {open && (
        <div className="clip-corner w-[280px] animate-fadein border border-ark-line/80 bg-ark-1/95 p-4 shadow-[0_0_30px_rgba(94,227,255,0.18)] backdrop-blur-md">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-ark-cyan" />
              <div className="font-display text-xs font-bold tracking-[0.25em] text-ark-white">
                FX CONSOLE
              </div>
            </div>
            <button
              onClick={fx.resetFX}
              className="flex h-6 items-center gap-1 border border-ark-line/70 px-1.5 font-mono text-[9px] tracking-widest text-ark-silver/65 transition hover:border-ark-cyan hover:text-ark-cyan"
              title="重置"
            >
              <RotateCcw className="h-3 w-3" />
              RST
            </button>
          </div>

          <Slider
            label="GLOW · 辉光强度"
            min={0.2}
            max={1.5}
            step={0.05}
            value={fx.glowIntensity}
            onChange={(v) => fx.setFX({ glowIntensity: v })}
            suffix={`×${fx.glowIntensity.toFixed(2)}`}
            color="#5ee3ff"
          />
          <Slider
            label="SCAN · 扫描速度"
            min={0}
            max={2}
            step={0.1}
            value={fx.scanlineSpeed}
            onChange={(v) => fx.setFX({ scanlineSpeed: v })}
            suffix={fx.scanlineSpeed === 0 ? "PAUSE" : `×${fx.scanlineSpeed.toFixed(1)}`}
            color="#5ee3ff"
          />
          <Slider
            label="PARTICLES · 粒子密度"
            min={0}
            max={60}
            step={1}
            value={fx.particleDensity}
            onChange={(v) => fx.setFX({ particleDensity: v })}
            suffix={`${Math.round(fx.particleDensity)}`}
            color="#e8c477"
          />

          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <Toggle
              label="粒子"
              active={fx.particlesEnabled}
              onChange={(v) => fx.setFX({ particlesEnabled: v })}
            />
            <Toggle
              label="扫描"
              active={fx.scanlineEnabled}
              onChange={(v) => fx.setFX({ scanlineEnabled: v })}
            />
            <Toggle
              label="六边"
              active={fx.hexEnabled}
              onChange={(v) => fx.setFX({ hexEnabled: v })}
            />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className={[
          "flex h-10 items-center gap-2 border px-4 font-display text-[11px] font-bold tracking-[0.25em] transition",
          "clip-corner-sm",
          open
            ? "border-ark-cyan/80 bg-ark-cyan/10 text-ark-cyan shadow-[0_0_16px_rgba(94,227,255,0.35)]"
            : "border-ark-line/70 bg-ark-1/80 text-ark-silver hover:border-ark-cyan hover:text-ark-cyan",
        ].join(" ")}
      >
        {open ? <X className="h-4 w-4" /> : <Sliders className="h-4 w-4" />}
        {open ? "CLOSE FX" : "OPEN FX"}
      </button>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
  suffix,
  color,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
  color: string;
}) {
  return (
    <div className="mb-2.5">
      <div className="mb-1 flex items-center justify-between">
        <span className="font-mono text-[9.5px] tracking-widest text-ark-silver/65">{label}</span>
        <span className="font-mono text-[10px] tabular-nums" style={{ color }}>
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="ark-range h-[3px] w-full appearance-none bg-ark-2 outline-none"
        style={{ accentColor: color }}
      />
    </div>
  );
}

function Toggle({
  label,
  active,
  onChange,
}: {
  label: string;
  active: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!active)}
      className={[
        "clip-tag border px-1.5 py-1 font-mono text-[9.5px] tracking-widest transition",
        active
          ? "border-ark-cyan bg-ark-cyan/15 text-ark-cyan shadow-[0_0_8px_rgba(94,227,255,0.3)]"
          : "border-ark-line/60 bg-ark-2/40 text-ark-silver/60 hover:border-ark-cyan/60 hover:text-ark-cyan",
      ].join(" ")}
    >
      {active ? "●" : "○"} {label}
    </button>
  );
}
