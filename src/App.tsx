import { useGameStore } from "@/store/useGameStore";
import { MainMenu } from "@/components/MainMenu";
import { OperatorSelect } from "@/components/OperatorSelect";
import { GameCanvas } from "@/components/GameCanvas";
import { ResultScreen } from "@/components/ResultScreen";

export default function App() {
  const gameState = useGameStore((s) => s.gameState);

  return (
    <div className="h-full w-full">
      {gameState === "menu" && <MainMenu />}
      {gameState === "operator" && <OperatorSelect />}
      {(gameState === "playing" || gameState === "paused") && <GameCanvas />}
      {gameState === "matchEnd" && <ResultScreen />}
    </div>
  );
}
