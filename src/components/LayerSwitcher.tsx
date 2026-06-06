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

// 顶部水平标签条 — PPT 风格的 4 个信息层切换
export default function LayerSwitcher({ active, onChange }: LayerSwitcherProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="fixed left-1/2 -translate-x-1/2 top-20 z-30 hidden md:flex items-center"
    >
      <div className="flex items-center bg-abyss/85 backdrop-blur-sm border border-bone/15">
        <div className="px-3 py-2 border-r border-bone/15">
          <span className="label">LAYER</span>
        </div>
        {layers.map((layer, i) => {
          const isActive = active === layer.key;
          return (
            <button
              key={layer.key}
              onClick={() => onChange(layer.key)}
              className={`group relative px-4 py-2 flex items-center gap-2 transition-colors ${
                isActive ? "text-bone" : "text-fog/60 hover:text-bone"
              } ${i < layers.length - 1 ? "border-r border-bone/10" : ""}`}
            >
              <span className={`text-sm ${isActive ? "text-blood" : ""}`}>
                {layerGlyph[layer.key]}
              </span>
              <span className="font-mono text-[10px] tracking-widest">
                {layer.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="layer-underline"
                  className="absolute -bottom-px left-0 right-0 h-px bg-blood"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
