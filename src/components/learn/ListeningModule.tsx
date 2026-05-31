import { useState } from "react";
import { Play, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import type { ListeningItem } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ListeningModuleProps {
  items: ListeningItem[];
  onComplete: (score: number) => void;
}

export default function ListeningModule({ items, onComplete }: ListeningModuleProps) {
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);

  const current = items[currentItemIndex];
  const question = current.questions[currentQIndex];
  const isAnswered = selectedAnswer !== null;

  const sentences = current.transcript.split(/[。.！!？?]/).filter((s) => s.trim());

  const handlePlay = () => {
    setIsPlaying(true);
    let idx = 0;
    const interval = setInterval(() => {
      idx++;
      if (idx >= sentences.length) {
        clearInterval(interval);
        setIsPlaying(false);
        setCurrentSentence(0);
      } else {
        setCurrentSentence(idx);
      }
    }, 1500);
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedAnswer(index);
    const newTotal = totalQuestions + 1;
    setTotalQuestions(newTotal);
    if (index === question.answer) {
      setCorrectCount(correctCount + 1);
    }
    setTimeout(() => setShowExplanation(true), 400);
  };

  const handleNext = () => {
    if (currentQIndex < current.questions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else if (currentItemIndex < items.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setCurrentQIndex(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
      onComplete(score);
    }
  };

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
        <div className="flex flex-col items-center">
          <button
            onClick={handlePlay}
            className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white transition-transform hover:scale-105 active:scale-95"
          >
            <Play size={28} className="ml-1" />
          </button>

          <div className="mt-4 flex items-end gap-0.5 h-8">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "w-1 rounded-full transition-all duration-300",
                  isPlaying
                    ? "bg-accent animate-pulse"
                    : "bg-gray-200"
                )}
                style={{
                  height: isPlaying
                    ? `${Math.random() * 24 + 8}px`
                    : `${8 + (i % 3) * 4}px`,
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>

          <button
            onClick={handlePlay}
            className="mt-3 flex items-center gap-1.5 text-sm text-gray-400 transition-colors hover:text-primary"
          >
            <RotateCcw size={14} />
            重新播放
          </button>
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-2 cursor-pointer mb-4">
            <div
              className={cn(
                "relative h-5 w-9 rounded-full transition-colors duration-200",
                showTranscript ? "bg-accent" : "bg-gray-200"
              )}
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <div
                className={cn(
                  "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
                  showTranscript ? "translate-x-4" : "translate-x-0.5"
                )}
              />
            </div>
            <span className="text-sm text-gray-500">逐句精听</span>
          </label>

          {showTranscript && (
            <div className="animate-slideUp rounded-lg bg-mint p-4 mb-4">
              {sentences.map((s, i) => (
                <span
                  key={i}
                  className={cn(
                    "text-sm transition-colors duration-300",
                    currentSentence === i && isPlaying
                      ? "text-primary font-semibold bg-accent/20 rounded px-0.5"
                      : "text-gray-500"
                  )}
                >
                  {s}。{" "}
                </span>
              ))}
            </div>
          )}
        </div>

        <h3 className="font-display text-lg font-semibold text-primary text-center">
          {question.question}
        </h3>

        <div className="mt-6 grid grid-cols-2 gap-3">
          {question.options.map((option, i) => {
            const isThisCorrect = i === question.answer;
            const isThisSelected = i === selectedAnswer;

            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 p-3 text-left text-sm font-medium transition-all duration-200",
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
                {isAnswered && isThisCorrect && <CheckCircle size={16} className="flex-shrink-0 text-emerald-500" />}
                {isAnswered && isThisSelected && !isThisCorrect && <XCircle size={16} className="flex-shrink-0 text-coral" />}
              </button>
            );
          })}
        </div>
      </div>

      {showExplanation && (
        <div className="animate-slideUp mt-4 flex justify-center">
          <button onClick={handleNext} className="btn-accent">
            {currentQIndex < current.questions.length - 1 || currentItemIndex < items.length - 1
              ? "下一题"
              : "完成练习"}
          </button>
        </div>
      )}
    </div>
  );
}
