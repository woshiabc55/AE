import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ResultScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const stats = useGameStore((s) => s.stats);
  const bestTimeSec = useGameStore((s) => s.bestTimeSec);
  const goToMenu = useGameStore((s) => s.goToMenu);
  const startNewGame = useGameStore((s) => s.startNewGame);

  const victory = gameState === "victory";
  const time = stats.finalTimeSec || stats.elapsedSec;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-950 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 bg-void-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-50" />

      <div className="relative z-10 w-[min(90vw,460px)] border-2 bg-void-800/90 shadow-pixel p-8 text-center animate-fade-in"
        style={{ borderColor: victory ? "var(--tw-shadow-glowEcho,#ffd86b)" : undefined }}>
        <div
          className={`border-2 ${victory ? "border-echo-500" : "border-warn-500"} p-6 mb-6`}
          style={{ borderColor: victory ? "#ffd86b" : "#ff3b5c" }}
        >
          <h1
            className={`font-pixel text-2xl mb-2 ${
              victory ? "text-echo-400 text-glow-echo" : "text-warn-500 text-glow-warn animate-flicker"
            }`}
          >
            {victory ? "虚空归寂" : "残响消散"}
          </h1>
          <p className={`font-term text-xl ${victory ? "text-echo-400/70" : "text-warn-500/70"}`}>
            {victory ? "你拾回了所有回响" : "暗影吞没了你的余音"}
          </p>
        </div>

        <div className="space-y-3 mb-7">
          <Row label="用时" value={formatTime(time)} accent={victory ? "echo" : "warn"} />
          <Row label="累计回响" value={`${stats.totalEchoes}`} accent="rift" />
          <Row
            label="抵达层数"
            value={`${stats.level}`}
            accent="reso"
          />
          {victory && bestTimeSec != null && (
            <Row label="最佳记录" value={formatTime(bestTimeSec)} accent="echo" />
          )}
        </div>

        <div className="flex flex-col gap-3">
          <PixelButton variant={victory ? "echo" : "primary"} className="w-full" onClick={() => startNewGame()}>
            再次潜行
          </PixelButton>
          <PixelButton variant="ghost" className="w-full" onClick={() => goToMenu()}>
            返回主菜单
          </PixelButton>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: "echo" | "warn" | "rift" | "reso";
}) {
  const color =
    accent === "echo"
      ? "text-echo-400 text-glow-echo"
      : accent === "warn"
        ? "text-warn-500"
        : accent === "rift"
          ? "text-rift-500 text-glow-rift"
          : "text-resonance-400 text-glow-reso";
  return (
    <div className="flex items-center justify-between border-b border-void-600 pb-2">
      <span className="font-term text-xl text-resonance-400/60">{label}</span>
      <span className={`font-pixel text-sm ${color}`}>{value}</span>
    </div>
  );
}
