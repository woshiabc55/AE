import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { VocabularyItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface VocabularyModuleProps {
  items: VocabularyItem[];
  onComplete: (score: number) => void;
}

export default function VocabularyModule({ items, onComplete }: VocabularyModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<number>>(new Set());
  const [needsReview, setNeedsReview] = useState<Set<number>>(new Set());

  const current = items[currentIndex];
  const allMarked = mastered.size + needsReview.size === items.length;

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleMark = (type: "mastered" | "review") => {
    if (type === "mastered") {
      setMastered(new Set([...mastered, currentIndex]));
      needsReview.delete(currentIndex);
      setNeedsReview(new Set(needsReview));
    } else {
      setNeedsReview(new Set([...needsReview, currentIndex]));
      mastered.delete(currentIndex);
      setMastered(new Set(mastered));
    }
    if (allMarked || mastered.size + needsReview.size + 1 === items.length) {
      const score = Math.round((mastered.size + (type === "mastered" ? 1 : 0)) / items.length * 100);
      setTimeout(() => onComplete(score), 300);
    } else {
      handleNext();
    }
  };

  return (
    <div className="flex flex-col items-center py-8">
      <div
        className="perspective-1000 relative h-72 w-full max-w-md cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-500 [backface-visibility:hidden]",
            isFlipped && "[transform:rotateY(180deg)]"
          )}
        >
          <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-white shadow-lg border border-gray-100 p-8">
            <span className="font-display text-3xl font-bold text-primary">{current.word}</span>
            <span className="mt-3 text-lg text-gray-400">{current.pronunciation}</span>
            <span className="mt-4 text-xs text-gray-300">点击翻转查看释义</span>
          </div>
        </div>
        <div
          className={cn(
            "absolute inset-0 transition-transform duration-500 [backface-visibility:hidden] [transform:rotateY(180deg)]",
            isFlipped && "[transform:rotateY(360deg)]"
          )}
        >
          <div className="flex h-full flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary-600 p-8 text-white shadow-lg">
            <span className="text-2xl font-bold">{current.translation}</span>
            <span className="mt-4 text-sm text-white/70">{current.example}</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-30"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="flex gap-1.5">
          {items.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200",
                i === currentIndex
                  ? "w-6 bg-accent"
                  : mastered.has(i)
                  ? "bg-emerald-400"
                  : needsReview.has(i)
                  ? "bg-coral"
                  : "bg-gray-200"
              )}
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={currentIndex === items.length - 1}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200 disabled:opacity-30"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => handleMark("review")}
          className={cn(
            "rounded-pill px-6 py-2.5 text-sm font-medium transition-all duration-200",
            needsReview.has(currentIndex)
              ? "bg-coral text-white"
              : "border border-coral text-coral hover:bg-coral hover:text-white"
          )}
        >
          需复习
        </button>
        <button
          onClick={() => handleMark("mastered")}
          className={cn(
            "rounded-pill px-6 py-2.5 text-sm font-medium transition-all duration-200",
            mastered.has(currentIndex)
              ? "bg-emerald-500 text-white"
              : "border border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white"
          )}
        >
          已掌握
        </button>
      </div>

      <p className="mt-4 text-xs text-gray-400">
        {currentIndex + 1} / {items.length}
      </p>
    </div>
  );
}
