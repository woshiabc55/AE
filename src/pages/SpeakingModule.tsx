import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowLeft, ArrowRight, RotateCcw, Volume2 } from 'lucide-react';
import { speakingData } from '@/data/courses';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';

export default function SpeakingModule() {
  const { currentLanguage, addXP } = useStore();
  const items = speakingData[currentLanguage];
  const langColor = LANGUAGE_CONFIG[currentLanguage].color;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [score, setScore] = useState(0);
  const [waveHeights, setWaveHeights] = useState<number[]>(Array(20).fill(4));
  const [showResult, setShowResult] = useState(false);

  const item = items[currentIndex];

  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      setWaveHeights(Array(20).fill(0).map(() => Math.random() * 40 + 4));
    }, 150);
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = useCallback(() => {
    setIsRecording(true);
    setHasRecorded(false);
    setShowResult(false);
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      const simulated = Math.floor(Math.random() * 26) + 70;
      setScore(simulated);
      addXP(Math.floor(simulated / 10));
      setTimeout(() => setShowResult(true), 300);
    }, 2500);
  }, [addXP]);

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, items.length - 1));
    setHasRecorded(false);
    setShowResult(false);
    setScore(0);
    setWaveHeights(Array(20).fill(4));
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setHasRecorded(false);
    setShowResult(false);
    setScore(0);
    setWaveHeights(Array(20).fill(4));
  }, []);

  const scoreColor = score >= 90 ? '#4ECDC4' : score >= 80 ? '#FFD93D' : '#FF6B4A';

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">难度: {'⭐'.repeat(item.difficulty)}</span>
        <span className="font-display font-bold text-white">
          {currentIndex + 1}<span className="text-gray-500">/{items.length}</span>
        </span>
      </div>

      <motion.div
        key={item.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card w-full p-6 rounded-2xl text-center mb-6"
      >
        <p className="text-2xl font-display font-bold text-white mb-2">{item.text}</p>
        <p className="text-sm mb-1" style={{ color: langColor }}>{item.phonetic}</p>
        <p className="text-sm text-gray-400">{item.translation}</p>
        <button className="mt-3 text-gray-500 hover:text-brand-accent transition-colors">
          <Volume2 size={18} />
        </button>
      </motion.div>

      <div className="flex items-end justify-center gap-1 h-16 mb-6 w-full">
        {waveHeights.map((h, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-full"
            style={{ backgroundColor: isRecording ? langColor : '#3A4070' }}
            animate={{ height: h }}
            transition={{ duration: 0.15 }}
          />
        ))}
      </div>

      <div className="relative mb-6">
        <motion.button
          onClick={startRecording}
          disabled={isRecording}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: isRecording ? '#3A4070' : langColor }}
          animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
          transition={isRecording ? { duration: 1, repeat: Infinity } : {}}
        >
          <Mic size={32} className="text-white" />
        </motion.button>
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: langColor }}
            animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </div>

      {isRecording && (
        <p className="text-sm text-gray-400 mb-4">录音中...</p>
      )}

      <AnimatePresence>
        {showResult && hasRecorded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full card p-6 rounded-2xl text-center mb-4"
          >
            <div className="relative w-24 h-24 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="#3A4070" strokeWidth="8" />
                <motion.circle
                  cx="50" cy="50" r="42" fill="none" stroke={scoreColor} strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={264}
                  initial={{ strokeDashoffset: 264 }}
                  animate={{ strokeDashoffset: 264 - (264 * score / 100) }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-display font-bold text-2xl text-white">
                {score}
              </span>
            </div>
            <p className="font-medium" style={{ color: scoreColor }}>
              {score >= 90 ? '🌟 发音优秀！' : score >= 80 ? '👍 发音不错！' : '💪 继续加油！'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center gap-6 mt-2">
        <button onClick={goPrev} disabled={currentIndex === 0}
          className="p-2 rounded-full bg-brand-card border border-brand-border/50 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
          <ArrowLeft size={20} />
        </button>
        <button onClick={() => { setHasRecorded(false); setShowResult(false); setWaveHeights(Array(20).fill(4)); }}
          className="p-2 rounded-full bg-brand-card border border-brand-border/50 text-gray-400 hover:text-white transition-all">
          <RotateCcw size={20} />
        </button>
        <button onClick={goNext} disabled={currentIndex === items.length - 1}
          className="p-2 rounded-full bg-brand-card border border-brand-border/50 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
