import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { HEROES } from "@/data/heroes";
import { GAMES } from "@/data/games";
import { HeroDetail } from "@/components/HeroDetail";

export default function HeroPage() {
  const { heroId } = useParams<{ heroId: string }>();
  const hero = HEROES.find((h) => h.id === heroId);

  if (!hero) {
    return (
      <div className="py-20 text-center">
        <div className="text-2xl text-white/60">未找到该角色</div>
        <Link to="/" className="btn-ghost mt-4 inline-flex">
          <ArrowLeft className="h-4 w-4" /> 返回首页
        </Link>
      </div>
    );
  }
  const game = GAMES.find((g) => g.id === hero.gameId);

  return (
    <div className="space-y-6">
      <Link
        to={game ? `/game/${game.id}` : "/"}
        className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> 返回 {game?.name ?? "首页"}
      </Link>
      <HeroDetail hero={hero} />
    </div>
  );
}
