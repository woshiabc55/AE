import { Trophy, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface CompletionModalProps {
  score: number;
  timeSpent: number;
  onContinue: () => void;
}

export default function CompletionModal({ score, timeSpent, onContinue }: CompletionModalProps) {
  const minutes = Math.floor(timeSpent / 60);
  const seconds = timeSpent % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="animate-slideUp mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-50">
          <Trophy size={32} className="text-accent" />
        </div>

        <h2 className="mt-4 font-display text-2xl font-bold text-primary">练习完成！</h2>
        <p className="mt-1 text-sm text-gray-400">你做得很棒，继续加油</p>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-mint p-4">
            <div className="flex items-center justify-center gap-1">
              <Star size={16} className="text-accent" />
              <span className="text-xs text-gray-500">得分</span>
            </div>
            <p className={cn(
              "mt-1 font-display text-2xl font-bold",
              score >= 90 ? "text-emerald-500" : score >= 70 ? "text-accent" : "text-coral"
            )}>
              {score}
            </p>
          </div>
          <div className="rounded-xl bg-mint p-4">
            <div className="flex items-center justify-center gap-1">
              <Clock size={16} className="text-accent" />
              <span className="text-xs text-gray-500">用时</span>
            </div>
            <p className="mt-1 font-display text-2xl font-bold text-primary">
              {minutes}:{seconds.toString().padStart(2, "0")}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button onClick={onContinue} className="btn-accent w-full py-3 text-base">
            继续学习
          </button>
        </div>
      </div>
    </div>
  );
}
