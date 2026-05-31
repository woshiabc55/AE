import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, X, RotateCcw } from 'lucide-react';
import { vocabularyData } from '@/data/courses';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';

type TabMode = 'flashcard' | 'spelling' | 'matching';

export default function VocabularyModule() {
  const { currentLanguage, addXP } = useStore();
  const items = vocabularyData[currentLanguage];
  const langColor = LANGUAGE_CONFIG[currentLanguage].color;
  const [mode, setMode] = useState<TabMode>('flashcard');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [spellingInput, setSpellingInput] = useState('');
  const [spellingResult, setSpellingResult] = useState<'correct' | 'incorrect' | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [matchItems, setMatchItems] = useState(() => buildMatchCards(items));

  function buildMatchCards(data: typeof items) {
    const subset = data.slice(0, 3);
    const cards = subset.flatMap((v, i) => [
      { id: i * 2, pairId: i, text: v.word, type: 'word' as const },
      { id: i * 2 + 1, pairId: i, text: v.translation, type: 'translation' as const },
    ]);
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    return cards;
  }

  const tabs: { key: TabMode; label: string }[] = [
    { key: 'flashcard', label: '闪卡' },
    { key: 'spelling', label: '拼写' },
    { key: 'matching', label: '配对' },
  ];

  const goNext = useCallback(() => {
    setCurrentIndex((i) => Math.min(i + 1, items.length - 1));
    setFlipped(false);
    setSpellingInput('');
    setSpellingResult(null);
  }, [items.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
    setFlipped(false);
    setSpellingInput('');
    setSpellingResult(null);
  }, []);

  const checkSpelling = () => {
    const correct = items[currentIndex].word.toLowerCase().trim();
    const answer = spellingInput.toLowerCase().trim();
    if (answer === correct) {
      setSpellingResult('correct');
      addXP(5);
    } else {
      setSpellingResult('incorrect');
    }
  };

  const handleMatchClick = (cardId: number, pairId: number) => {
    if (matchedPairs.includes(pairId)) return;
    if (selectedCard === null) {
      setSelectedCard(cardId);
      return;
    }
    const prevCard = matchItems.find((c) => c.id === selectedCard);
    if (!prevCard) { setSelectedCard(null); return; }
    if (prevCard.pairId === pairId && prevCard.id !== cardId) {
      setMatchedPairs((p) => [...p, pairId]);
      addXP(3);
      if (matchedPairs.length + 1 === 3) addXP(10);
    }
    setSelectedCard(null);
  };

  const resetMatching = () => {
    setMatchedPairs([]);
    setSelectedCard(null);
    setMatchItems(buildMatchCards(items));
  };

  const NavArrows = () => (
    <div className="flex items-center gap-6 mt-6">
      <button onClick={goPrev} disabled={currentIndex === 0}
        className="p-2 rounded-full bg-brand-card border border-brand-border/50 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
        <ArrowLeft size={20} />
      </button>
      <span className="font-display font-bold text-white">
        {currentIndex + 1}<span className="text-gray-500">/{items.length}</span>
      </span>
      <button onClick={goNext} disabled={currentIndex === items.length - 1}
        className="p-2 rounded-full bg-brand-card border border-brand-border/50 text-gray-400 hover:text-white disabled:opacity-30 transition-all">
        <ArrowRight size={20} />
      </button>
    </div>
  );

  const item = items[currentIndex];

  return (
    <div>
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setMode(tab.key); setFlipped(false); setSpellingInput(''); setSpellingResult(null); }}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === tab.key
                ? 'text-white shadow-lg'
                : 'text-gray-400 bg-brand-card hover:text-gray-200'
            }`}
            style={mode === tab.key ? { backgroundColor: langColor } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'flashcard' && (
        <div className="flex flex-col items-center">
          <div
            className="w-full h-72 cursor-pointer perspective-1000"
            onClick={() => setFlipped(!flipped)}
          >
            <motion.div
              className="w-full h-full relative preserve-3d"
              animate={{ rotateY: flipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 backface-hidden card flex flex-col items-center justify-center p-8 rounded-2xl"
                style={{ backfaceVisibility: 'hidden' }}>
                <span className="text-3xl font-display font-bold text-white mb-3">{item.word}</span>
                <span className="text-lg" style={{ color: langColor }}>{item.phonetic}</span>
                <span className="text-sm text-gray-500 mt-4">点击翻转</span>
              </div>
              <div className="absolute inset-0 backface-hidden card flex flex-col items-center justify-center p-8 rounded-2xl"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <span className="text-2xl font-bold text-brand-accent mb-2">{item.translation}</span>
                <span className="text-sm text-gray-300 mb-1">{item.example}</span>
                <span className="text-xs text-gray-500">{item.exampleTranslation}</span>
              </div>
            </motion.div>
          </div>
          <NavArrows />
        </div>
      )}

      {mode === 'spelling' && (
        <div className="flex flex-col items-center">
          <div className="card w-full p-8 rounded-2xl text-center mb-6">
            <span className="text-sm text-gray-500 mb-2 block">翻译</span>
            <span className="text-2xl font-bold text-brand-accent">{item.translation}</span>
          </div>
          <div className="w-full flex gap-3 mb-4">
            <input
              type="text"
              value={spellingInput}
              onChange={(e) => { setSpellingInput(e.target.value); setSpellingResult(null); }}
              onKeyDown={(e) => e.key === 'Enter' && checkSpelling()}
              placeholder="输入单词..."
              className="input-field flex-1 text-center text-lg"
              autoFocus
            />
            <button onClick={checkSpelling} disabled={!spellingInput.trim()}
              className="btn-primary px-5 disabled:opacity-40">
              <Check size={20} />
            </button>
          </div>
          <AnimatePresence>
            {spellingResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                  spellingResult === 'correct' ? 'bg-brand-mint/20 text-brand-mint' : 'bg-red-500/20 text-red-400'
                }`}
              >
                {spellingResult === 'correct' ? <Check size={16} /> : <X size={16} />}
                {spellingResult === 'correct' ? '正确！' : `正确答案: ${item.word}`}
              </motion.div>
            )}
          </AnimatePresence>
          <NavArrows />
        </div>
      )}

      {mode === 'matching' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-400">配对: {matchedPairs.length}/3</span>
            <button onClick={resetMatching} className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-accent transition-colors">
              <RotateCcw size={14} /> 重置
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {matchItems.map((card) => {
              const isMatched = matchedPairs.includes(card.pairId);
              const isSelected = selectedCard === card.id;
              return (
                <motion.button
                  key={card.id}
                  layout
                  onClick={() => handleMatchClick(card.id, card.pairId)}
                  animate={isMatched ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`p-4 rounded-xl text-center font-medium text-sm transition-all ${
                    isMatched ? 'pointer-events-none' :
                    isSelected ? 'ring-2 ring-brand-accent bg-brand-accent/10 border-brand-accent' :
                    'bg-brand-card border border-brand-border/50 hover:border-brand-accent/30'
                  }`}
                  style={isSelected ? { borderColor: langColor } : undefined}
                  disabled={isMatched}
                >
                  <span className={card.type === 'word' ? 'text-white' : 'text-brand-mint'}>
                    {card.text}
                  </span>
                </motion.button>
              );
            })}
          </div>
          {matchedPairs.length === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center mt-6 p-4 rounded-xl bg-brand-mint/10 border border-brand-mint/30"
            >
              <span className="text-brand-mint font-display font-bold text-lg">🎉 全部配对成功！</span>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
