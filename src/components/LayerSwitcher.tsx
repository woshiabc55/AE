import { motion } from "framer-motion";
import { layers } from "@/data/shots";
import type { LayerKey } from "@/data/shots";

interface LayerSwitcherProps {
  active: LayerKey;
  onChange: (key: LayerKey) => void;
}

const layerGlyph: Record<LayerKey, string> = {
  narrative: "目",
  camera: "◉",
  audio: "♪",
  vfx: "✧",
};

export default function LayerSwitcher({ active, onChange }: LayerSwitcherProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-3"
    >
      <div className="font-mono text-[9px] text-fog/50 tracking-widest mb-2 vertical self-end">
        INFORMATION LAYER
      </div>

      {layers.map((layer) => {
        const isActive = active === layer.key;
        return (
          <button
            key={layer.key}
            onClick={() => onChange(layer.key)}
            className="group relative w-12 h-12 flex items-center justify-center transition-all"
          >
            <div
              className={`absolute inset-0 border ${
                isActive ? "border-blood bg-blood/10" : "border-bone/15 bg-abyss/60 group-hover:border-bone/40"
              } transition-all`}
            />
            <span
              className={`relative numeral text-xl ${
                isActive ? "text-blood" : "text-fog/60 group-hover:text-bone"
              } transition-colors`}
            >
              {layerGlyph[layer.key]}
            </span>
            <div
              className={`absolute right-full mr-3 top-1/2 -translate-y-1/2 font-mono text-[10px] tracking-widest whitespace-nowrap transition-opacity ${
                isActive ? "text-blood opacity-100" : "text-fog/60 opacity-0 group-hover:opacity-100"
              }`}
            >
              {layer.cn} · {layer.label}
            </div>
          </button>
        );
      })}
    </motion.aside>
  );
}
