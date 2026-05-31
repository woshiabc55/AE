import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
import type { SpeakingItem } from "@/lib/api";

interface SpeakingModuleProps {
  items: SpeakingItem[];
  onComplete: (score: number) => void;
}

type SpeakingState = "idle" | "recording" | "processing" | "result";

export default function SpeakingModule({ items, onComplete }: SpeakingModuleProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [state, setState] = useState<SpeakingState>("idle");
  const [countdown, setCountdown] = useState(3);
  const [score, setScore] = useState(0);
  const [scores, setScores] = useState<number[]>([]);

  const current = items[currentIndex];

  useEffect(() => {
    if (state === "recording" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (state === "recording" && countdown === 0) {
      setState("processing");
      setTimeout(() => {
        const newScore = Math.floor(Math.random() * 26) + 70;
        setScore(newScore);
        setScores(prev => [...prev, newScore]);
        setState("result");
      }, 1500);
    }
  }, [state, countdown]);

  const handleMicClick = () => {
    setState("recording");
    setCountdown(3);
  };

  const handleRetry = () => {
    setState("idle");
    setCountdown(3);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setState("idle");
      setCountdown(3);
    } else {
      const avg = scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : score;
      onComplete(avg);
    }
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="mx-auto max-w-lg py-8">
      <div className="mb-6 text-center">
        <span className="text-sm text-gray-400">
          {currentIndex + 1} / {items.length}
        </span>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-lg border border-gray-100 text-center">
        <p className="font-display text-2xl font-bold text-primary">{current.text}</p>
        <p className="mt-2 text-gray-400">{current.pronunciation}</p>
        <p className="mt-1 text-sm text-gray-300">{current.translation}</p>

        <div className="mt-10 flex flex-col items-center">
          {state === "idle" && (
            <button
              onClick={handleMicClick}
              className="relative flex h-20 w-20 items-center justify-center rounded-full bg-coral text-white transition-transform hover:scale-105 active:scale-95"
            >
              <Mic size={32} />
              <span className="absolute inset-0 rounded-full bg-coral animate-pulse-ring opacity-50" />
            </button>
          )}

          {state === "recording" && (
            <div className="flex flex-col items-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white">
                <span className="text-3xl font-bold">{countdown}</span>
              </div>
              <p className="mt-3 text-sm text-coral font-medium">录音中...</p>
            </div>
          )}

          {state === "processing" && (
            <div className="flex flex-col items-center">
              <div className="h-20 w-20 animate-spin rounded-full border-4 border-gray-100 border-t-coral" />
              <p className="mt-3 text-sm text-gray-400">处理中...</p>
            </div>
          )}

          {state === "result" && (
            <div className="flex flex-col items-center">
              <div className="relative h-32 w-32">
                <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="54" fill="none" stroke="#E8F0EC" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="54" fill="none"
                    stroke={score >= 90 ? "#10B981" : score >= 80 ? "#D4A853" : "#E8734A"}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-display text-2xl font-bold text-primary">{score}</span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-400">
                {score >= 90 ? "非常棒！" : score >= 80 ? "很不错！" : "继续加油！"}
              </p>
            </div>
          )}
        </div>
      </div>

      {state === "result" && (
        <div className="mt-6 flex gap-3">
          <button onClick={handleRetry} className="btn-outline flex-1">
            再试一次
          </button>
          <button onClick={handleNext} className="btn-accent flex-1">
            {currentIndex < items.length - 1 ? "下一个" : "完成"}
          </button>
        </div>
      )}
    </div>
  );
}
