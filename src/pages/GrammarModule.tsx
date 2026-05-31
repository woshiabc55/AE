import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, ArrowRight } from 'lucide-react';
import { grammarData } from '@/data/courses';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';

export default function GrammarModule() {
  const { currentLanguage, addXP } = useStore();
  const exercises = grammarData[currentLanguage];
  const langColor = LANGUAGE_CONFIG[currentLanguage].color;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [fillInput, setFillInput] = useState('');
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [reorderSelected, setReorderSelected] = useState<string[]>([]);
  const [score, setScore] = useState(0);

  const exercise = exercises[currentIndex];
  const progress = ((currentIndex) / exercises.length) * 100;

  const resetState = useCallback(() => {
    setAnswered(false);
    setIsCorrect(false);
    setFillInput('');
    setSelectedChoice(null);
    setReorderSelected([]);
  }, []);

  const handleCheck = useCallback(() => {
    let correct = false;
    if (exercise.type === 'fill-blank') {
      correct = fillInput.toLowerCase().trim() === exercise.answer.toLowerCase().trim();
    } else if (exercise.type === 'choice') {
      correct = selectedChoice === exercise.answer;
    } else if (exercise.type === 'reorder') {
      correct = reorderSelected.join(' ') === exercise.answer;
    }
    setIsCorrect(correct);
    setAnswered(true);
    if (correct) {
      setScore((s) => s + 1);
      addXP(8);
    }
  }, [exercise, fillInput, selectedChoice, reorderSelected, addXP]);

  const handleNext = useCallback(() => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex((i) => i + 1);
      resetState();
    }
  }, [currentIndex, exercises.length, resetState]);

  const handleReorderChip = (part: string) => {
    if (reorderSelected.includes(part)) return;
    setReorderSelected((prev) => [...prev, part]);
  };

  const removeFromReorder = (index: number) => {
    setReorderSelected((prev) => prev.filter((_, i) => i !== index));
  };

  const availableParts = exercise.parts?.filter((p) => !reorderSelected.includes(p)) || [];

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">{currentIndex + 1} / {exercises.length}</span>
          <span className="text-sm font-medium" style={{ color: langColor }}>得分: {score}</span>
        </div>
        <div className="w-full h-2 bg-brand-card rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: langColor }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={exercise.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card p-6 rounded-2xl mb-4">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-brand-surface text-gray-400 mb-3 inline-block">
              {exercise.type === 'fill-blank' ? '填空题' : exercise.type === 'choice' ? '选择题' : '排序题'}
            </span>
            <p className="text-lg font-medium text-white mt-2">{exercise.question}</p>
          </div>

          {exercise.type === 'fill-blank' && (
            <div className="flex gap-3 mb-4">
              <input
                type="text"
                value={fillInput}
                onChange={(e) => setFillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !answered && handleCheck()}
                placeholder="输入答案..."
                className="input-field flex-1 text-center"
                disabled={answered}
                autoFocus
              />
              {!answered && (
                <button onClick={handleCheck} disabled={!fillInput.trim()} className="btn-primary px-5 disabled:opacity-40">
                  <Check size={20} />
                </button>
              )}
            </div>
          )}

          {exercise.type === 'choice' && exercise.options && (
            <div className="grid gap-3 mb-4">
              {exercise.options.map((opt) => {
                const isAnswer = opt === exercise.answer;
                const isSelected = selectedChoice === opt;
                let cls = 'card p-4 rounded-xl text-center font-medium transition-all cursor-pointer';
                if (answered) {
                  if (isAnswer) cls += ' !bg-brand-mint/20 !border-brand-mint text-brand-mint';
                  else if (isSelected && !isAnswer) cls += ' !bg-red-500/20 !border-red-400 text-red-400';
                  else cls += ' text-gray-500';
                } else {
                  cls += isSelected
                    ? ' !border-brand-accent text-white'
                    : ' text-gray-300 hover:!border-brand-accent/50';
                }
                return (
                  <button key={opt} onClick={() => !answered && setSelectedChoice(opt)} className={cls}
                    disabled={answered}>
                    {opt}
                  </button>
                );
              })}
              {!answered && (
                <button onClick={handleCheck} disabled={!selectedChoice} className="btn-primary w-full disabled:opacity-40 mt-2">
                  确认
                </button>
              )}
            </div>
          )}

          {exercise.type === 'reorder' && (
            <div className="mb-4">
              <div className="min-h-[52px] flex flex-wrap gap-2 p-3 bg-brand-surface rounded-xl border border-brand-border/50 mb-3">
                {reorderSelected.length === 0 && <span className="text-gray-500 text-sm">点击下方词语排列句子...</span>}
                {reorderSelected.map((part, i) => (
                  <motion.button
                    key={`${part}-${i}`}
                    layout
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={() => !answered && removeFromReorder(i)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium text-white"
                    style={{ backgroundColor: langColor }}
                    disabled={answered}
                  >
                    {part}
                  </motion.button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableParts.map((part) => (
                  <button
                    key={part}
                    onClick={() => !answered && handleReorderChip(part)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-brand-card border border-brand-border/50 text-gray-300 hover:border-brand-accent/50 transition-all"
                    disabled={answered}
                  >
                    {part}
                  </button>
                ))}
              </div>
              {!answered && (
                <button onClick={handleCheck} disabled={reorderSelected.length === 0} className="btn-primary w-full disabled:opacity-40">
                  确认
                </button>
              )}
            </div>
          )}

          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`p-4 rounded-xl mb-4 ${
                  isCorrect ? 'bg-brand-mint/10 border border-brand-mint/30' : 'bg-red-500/10 border border-red-400/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? <Check size={18} className="text-brand-mint" /> : <X size={18} className="text-red-400" />}
                  <span className={`font-medium ${isCorrect ? 'text-brand-mint' : 'text-red-400'}`}>
                    {isCorrect ? '正确！' : '不正确'}
                  </span>
                </div>
                <p className="text-sm text-gray-400">{exercise.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {answered && currentIndex < exercises.length - 1 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              下一题 <ArrowRight size={18} />
            </motion.button>
          )}

          {answered && currentIndex === exercises.length - 1 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-6 rounded-xl bg-brand-accent/10 border border-brand-accent/30"
            >
              <p className="text-2xl font-display font-bold text-brand-accent mb-2">🎉 练习完成！</p>
              <p className="text-gray-400">正确率: {score}/{exercises.length}</p>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
