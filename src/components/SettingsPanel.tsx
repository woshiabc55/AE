import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";

interface Props {
  onClose: () => void;
  inGame?: boolean;
}

const PIXEL_LABEL: Record<number, string> = {
  1: "高（细）",
  2: "中",
  3: "低（粗）",
};

export function SettingsPanel({ onClose, inGame }: Props) {
  const settings = useGameStore((s) => s.settings);
  const setSettings = useGameStore((s) => s.setSettings);

  return (
    <div className="w-[min(92vw,460px)] border-2 border-tac-500/40 bg-void-800/95 shadow-pixel p-6 animate-fade-in">
      <h2 className="font-pixel text-sm text-tac-400 text-glow-tac mb-5">
        设置
      </h2>

      <div className="space-y-5">
        {/* 像素分辨率 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-term text-xl text-tac-400/90">像素颗粒</label>
            <span className="font-term text-lg text-tac-400">
              {PIXEL_LABEL[settings.pixelScale] ?? settings.pixelScale}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={1}
            value={settings.pixelScale}
            onChange={(e) => setSettings({ pixelScale: Number(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between mt-1 font-term text-xs text-tac-400/40">
            <span>细</span>
            <span>粗</span>
          </div>
        </div>

        {/* 鼠标灵敏度 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-term text-xl text-tac-400/90">鼠标灵敏度</label>
            <span className="font-term text-lg text-tac-400">
              {settings.sensitivity.toFixed(2)}x
            </span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.05}
            value={settings.sensitivity}
            onChange={(e) => setSettings({ sensitivity: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* 雾浓度 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="font-term text-xl text-tac-400/90">战场浓雾</label>
            <span className="font-term text-lg text-tac-400">
              {settings.fogDensity.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min={0.06}
            max={0.18}
            step={0.01}
            value={settings.fogDensity}
            onChange={(e) => setSettings({ fogDensity: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        {/* 音效（占位，无音频实现） */}
        <div className="flex items-center justify-between">
          <label className="font-term text-xl text-tac-400/90">音效</label>
          <button
            onClick={() => setSettings({ sound: !settings.sound })}
            className={`font-pixel text-[10px] px-3 py-2 border-2 transition-colors ${
              settings.sound
                ? "border-tac-500 text-tac-400 bg-tac-500/15"
                : "border-void-600 text-tac-400/40 bg-void-700"
            }`}
          >
            {settings.sound ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <PixelButton variant="ghost" onClick={onClose}>
          {inGame ? "返回" : "完成"}
        </PixelButton>
      </div>
    </div>
  );
}
