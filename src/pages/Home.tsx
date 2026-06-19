import { BattleGame } from '@/components/BattleGame';

export default function Home(): JSX.Element {
  return (
    <main className="flex h-screen w-screen items-center justify-center overflow-hidden bg-black">
      <BattleGame />
    </main>
  );
}
