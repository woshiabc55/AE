import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";
import type { GrammarExercise } from "@/lib/api";
import { cn } from "@/lib/utils";

interface GrammarModuleProps {
  exercises: GrammarExercise[];
  onComplete: (score: number) => void;
}

export default function GrammarModule({ exercises, onComplete }: GrammarModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const current = exercises[currentIndex];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === current.answer;

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    if (index === current.answer) {
      setCorrectCount(correctCount + 1);
    }
    setTimeout(() => setShowExplanation(true), 400);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const finalCorrect = correctCount + (isCorrect ? 0 : 0);
      const score = Math.round((finalCorrect / exercises.length) * 100);
      onComplete(score);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-sm text-gray-400">
          第 {currentIndex + 1} 题 / 共 {exercises.length} 题
        </span>
        <span className="rounded-pill bg-mint px-3 py-1 text-sm font-medium text-primary">
          得分: {correctCount}
        </span>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <h3 className="font-display text-xl font-semibold text-primary text-center">
          {current.question}
        </h3>

        <div className="mt-8 grid grid-cols-2 gap-3">
          {current.options.map((option, i) => {
            const isThisCorrect = i === current.answer;
            const isThisSelected = i === selectedAnswer;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 p-4 text-left text-sm font-medium transition-all duration-200",
                  !isAnswered && "border-gray-100 hover:border-accent/50 hover:bg-accent-50",
                  isAnswered && isThisCorrect && "border-emerald-400 bg-emerald-50 text-emerald-700",
                  isAnswered && isThisSelected && !isThisCorrect && "border-coral bg-coral-50 text-coral",
                  isAnswered && !isThisSelected && !isThisCorrect && "border-gray-100 opacity-50"
                )}
              >
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-bold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {isAnswered && isThisCorrect && <CheckCircle size={18} className="flex-shrink-0 text-emerald-500" />}
                {isAnswered && isThisSelected && !isThisCorrect && <XCircle size={18} className="flex-shrink-0 text-coral" />}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="animate-slideUp mt-4 rounded-xl bg-accent-50 border border-accent/20 p-5">
          <p className="text-sm font-medium text-primary">解析</p>
          <p className="mt-1 text-sm text-gray-600">{current.explanation}</p>
          <button
            onClick={handleNext}
            className="btn-accent mt-4 w-full"
          >
            {currentIndex < exercises.length - 1 ? "下一题" : "完成练习"}
          </button>
        </div>
      )}
    </div>
  );
}
