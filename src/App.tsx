import { useGameStore } from "@/store/useGameStore";
import { MainMenu } from "@/components/MainMenu";
import { GameCanvas } from "@/components/GameCanvas";
import { ResultScreen } from "@/components/ResultScreen";

export default function App() {
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div className="h-full w-full">
      {gameState === "menu" && <MainMenu />}
      {(gameState === "playing" || gameState === "paused") && <GameCanvas />}
      {(gameState === "victory" || gameState === "defeat") && <ResultScreen />}
    </div>
  );
}
