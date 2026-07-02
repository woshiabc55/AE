import { useGameStore } from "@/store/useGameStore";
import { PixelButton } from "./PixelButton";
import { OPERATORS } from "@/game/operators";

export function ResultScreen() {
  const matchWinner = useGameStore((s) => s.matchWinner);
  const match = useGameStore((s) => s.match);
  const kills = useGameStore((s) => s.kills);
  const deaths = useGameStore((s) => s.deaths);
  const career = useGameStore((s) => s.career);
  const selectedOp = useGameStore((s) => s.selectedOp);
  const goTo = useGameStore((s) => s.goTo);

  const victory = matchWinner === "alpha";
  const kdr = deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2);
  const op = OPERATORS[selectedOp];

  const kdrCareer =
    career.totalDeaths > 0
      ? (career.totalKills / career.totalDeaths).toFixed(2)
      : career.totalKills.toFixed(2);
  const winRate =
    career.matchesPlayed > 0
      ? Math.round((career.matchesWon / career.matchesPlayed) * 100)
      : 0;

  return (
    <div className="relative h-full w-full overflow-hidden bg-void-950 flex items-center justify-center">
      <div className="pointer-events-none absolute inset-0 bg-void-grid opacity-30" />
      <div className="pointer-events-none absolute inset-0 crt-vignette" />
      <div className="pointer-events-none absolute inset-0 crt-scanlines opacity-50" />

      <div className="relative z-10 w-[min(92vw,520px)] border-2 bg-void-800/90 shadow-pixel p-8 text-center animate-fade-in"
        style={{ borderColor: victory ? "#3a8cff" : "#ff3b5c" }}>
        {/* 胜负标题 */}
        <div
          className="border-2 p-5 mb-6"
          style={{ borderColor: victory ? "#3a8cff" : "#ff3b5c" }}
        >
          <h1
            className={`font-pixel text-2xl mb-2 ${
              victory ? "text-alpha-400 text-glow-alpha" : "text-bravo-400 text-glow-bravo animate-flicker"
            }`}
          >
            {victory ? "任务达成" : "行动失败"}
          </h1>
          <p className={`font-term text-xl ${victory ? "text-alpha-400/70" : "text-bravo-400/70"}`}>
            {victory ? "ALPHA 小队夺取据点" : "ALPHA 小队全员归零"}
          </p>
        </div>

        {/* 本局战绩 */}
        <div className="mb-5">
          <div className="font-pixel text-xs text-tac-400/60 mb-3">本局战绩</div>
          <div className="space-y-2">
            <Row label="击杀" value={`${kills}`} accent="tac" />
            <Row label="阵亡" value={`${deaths}`} accent="bravo" />
            <Row label="K/D" value={kdr} accent="gold" />
            <Row label="回合比分" value={`${match.scoreAlpha} : ${match.scoreBravo}`} accent={victory ? "alpha" : "bravo"} />
            <Row label="使用干员" value={op.name} accent="warn" />
          </div>
        </div>

        {/* 生涯档案 */}
        <div className="mb-6 border-t border-void-600 pt-4">
          <div className="font-pixel text-xs text-tac-400/60 mb-3">生涯档案</div>
          <div className="space-y-2">
            <Row label="总击杀" value={`${career.totalKills}`} accent="tac" />
            <Row label="总胜场" value={`${career.matchesWon} / ${career.matchesPlayed}`} accent="alpha" />
            <Row label="胜率" value={`${winRate}%`} accent="gold" />
            <Row label="生涯 K/D" value={kdrCareer} accent="gold" />
            <Row label="单局最佳击杀" value={`${career.bestRoundKills}`} accent="warn" />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <PixelButton variant="primary" className="w-full" onClick={() => goTo("operator")}>
            再次部署
          </PixelButton>
          <PixelButton variant="ghost" className="w-full" onClick={() => goTo("menu")}>
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
  accent: "tac" | "alpha" | "bravo" | "gold" | "warn";
}) {
  const color =
    accent === "tac"
      ? "text-tac-400 text-glow-tac"
      : accent === "alpha"
        ? "text-alpha-400 text-glow-alpha"
        : accent === "bravo"
          ? "text-bravo-400 text-glow-bravo"
          : accent === "warn"
            ? "text-warn-500 text-glow-warn"
            : "text-gold";
  return (
    <div className="flex items-center justify-between border-b border-void-600 pb-1">
      <span className="font-term text-lg text-tac-400/60">{label}</span>
      <span className={`font-pixel text-sm ${color}`} style={accent === "gold" ? { color: "#ffd86b" } : undefined}>
        {value}
      </span>
    </div>
  );
}
