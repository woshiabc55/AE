import { BattleGame } from '@/components/BattleGame';

export default function Home(): JSX.Element {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#05060A] px-4 py-8">
      <h1 className="mb-6 text-center text-2xl tracking-widest text-white/90 md:text-3xl">
        PIXEL MECHA BATTLE
      </h1>
      <BattleGame />
    </main>
  );
}
