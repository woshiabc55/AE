import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Eye, EyeOff, Check, X, ArrowRight } from 'lucide-react';
import { listeningData } from '@/data/courses';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';

export default function ListeningModule() {
  const { currentLanguage, addXP } = useStore();
  const items = listeningData[currentLanguage];
  const langColor = LANGUAGE_CONFIG[currentLanguage].color;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [waveProgress, setWaveProgress] = useState(0);

  const item = items[currentIndex];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setWaveProgress((p) => {
        if (p >= 100) { setIsPlaying(false); return 100; }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const togglePlay = useCallback(() => {
    if (waveProgress >= 100) setWaveProgress(0);
    setIsPlaying((p) => !p);
  }, [waveProgress]);

  const handleAnswer = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmit = useCallback(() => {
    setSubmitted(true);
    let correct = 0;
    item.questions.forEach((q) => {
      if (answers[q.id] === q.answer) correct++;
    });
    addXP(correct * 5);
  }, [answers, item, addXP]);

  const goNext = useCallback(() => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex((i) => i + 1);
      setAnswers({});
      setSubmitted(false);
      setIsPlaying(false);
      setWaveProgress(0);
      setShowTranscript(false);
    }
  }, [currentIndex, items.length]);

  const correctCount = submitted
    ? item.questions.filter((q) => answers[q.id] === q.answer).length
    : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">{currentIndex + 1} / {items.length}</span>
        {submitted && (
          <span className="text-sm font-medium" style={{ color: langColor }}>
            得分: {correctCount}/{item.questions.length}
          </span>
        )}
      </div>

      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="card p-6 rounded-2xl mb-4">
          <h3 className="font-display font-bold text-white text-lg mb-4">{item.title}</h3>

          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlay}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: langColor }}
            >
              {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-0.5" />}
            </button>
            <div className="flex-1">
              <div className="w-full h-2 bg-brand-surface rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: langColor }}
                  animate={{ width: `${waveProgress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{Math.floor(waveProgress * 0.3)}s</span>
                <span className="text-xs text-gray-500">15s</span>
              </div>
            </div>
          </div>

          <div className="flex items-end justify-center gap-0.5 h-10 mb-4">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = Math.sin(i * 0.5) * 15 + Math.random() * 8 + 6;
              const active = (i / 30) * 100 <= waveProgress;
              return (
                <div
                  key={i}
                  className="w-1 rounded-full transition-colors duration-200"
                  style={{
                    height: h,
                    backgroundColor: active ? langColor : '#3A4070',
                  }}
                />
              );
            })}
          </div>

          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mx-auto"
          >
            {showTranscript ? <EyeOff size={16} /> : <Eye size={16} />}
            {showTranscript ? '隐藏原文' : '显示原文'}
          </button>

          <AnimatePresence>
            {showTranscript && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 bg-brand-surface rounded-xl text-sm text-gray-300 overflow-hidden"
              >
                <p className="mb-2">{item.transcript}</p>
                <p className="text-gray-500 text-xs">{item.translation}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-4 mb-4">
          {item.questions.map((q, qi) => (
            <div key={q.id} className="card p-4 rounded-xl">
              <p className="text-sm font-medium text-white mb-3">
                {qi + 1}. {q.question}
              </p>
              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = answers[q.id] === oi;
                  const isCorrect = q.answer === oi;
                  let cls = 'p-3 rounded-lg text-sm font-medium transition-all cursor-pointer border ';
                  if (submitted) {
                    if (isCorrect) cls += 'bg-brand-mint/15 border-brand-mint/50 text-brand-mint';
                    else if (isSelected && !isCorrect) cls += 'bg-red-500/15 border-red-400/50 text-red-400';
                    else cls += 'bg-brand-surface border-brand-border/30 text-gray-500';
                  } else {
                    cls += isSelected
                      ? 'bg-brand-accent/10 border-brand-accent/50 text-white'
                      : 'bg-brand-surface border-brand-border/30 text-gray-300 hover:border-brand-accent/30';
                  }
                  return (
                    <button key={oi} onClick={() => handleAnswer(q.id, oi)} className={cls}>
                      <span className="flex items-center gap-2">
                        {submitted && isCorrect && <Check size={14} />}
                        {submitted && isSelected && !isCorrect && <X size={14} />}
                        {opt}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < item.questions.length}
            className="btn-primary w-full disabled:opacity-40 flex items-center justify-center gap-2"
          >
            <Check size={18} /> 提交答案
          </button>
        ) : (
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`p-4 rounded-xl text-center ${
                correctCount === item.questions.length
                  ? 'bg-brand-mint/10 border border-brand-mint/30'
                  : 'bg-brand-amber/10 border border-brand-amber/30'
              }`}
            >
              <p className={`font-display font-bold text-lg ${
                correctCount === item.questions.length ? 'text-brand-mint' : 'text-brand-amber'
              }`}>
                {correctCount === item.questions.length ? '🎉 全部正确！' : `答对 ${correctCount}/${item.questions.length}`}
              </p>
            </motion.div>
            {currentIndex < items.length - 1 && (
              <button onClick={goNext} className="btn-primary w-full flex items-center justify-center gap-2">
                下一篇 <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
