import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { VocabularyItem } from '../types';

const VocabularyPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [knownWords, setKnownWords] = useState<Set<string>>(new Set());
  const [unknownWords, setUnknownWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const vocabulary = api.vocabulary.get(user?.targetLanguage || 'english', user?.level || 'beginner');
    setWords(vocabulary);
  }, [user]);

  const currentWord = words[currentIndex];

  const handleKnown = () => {
    setKnownWords(prev => new Set([...prev, currentWord.id]));
    goToNext();
  };

  const handleUnknown = () => {
    setUnknownWords(prev => new Set([...prev, currentWord.id]));
    goToNext();
  };

  const goToNext = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % words.length);
    }, 300);
  };

  const goToPrev = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev - 1 + words.length) % words.length);
    }, 300);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setKnownWords(new Set());
    setUnknownWords(new Set());
    setIsFlipped(false);
  };

  if (isLoading || !currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>重新开始</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">单词记忆</h1>
          <p className="text-gray-500">使用卡片记忆法高效学习单词</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>已掌握: {knownWords.size}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg">
            <XCircle className="w-5 h-5" />
            <span>需复习: {unknownWords.size}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
            <BookOpen className="w-5 h-5" />
            <span>进度: {currentIndex + 1}/{words.length}</span>
          </div>
        </div>

        <div className="relative h-80 mb-8">
          <div
            className={`w-full h-full cursor-pointer perspective-1000 ${isFlipped ? 'animate-bounce-in' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
          >
            <div
              className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              }}
            >
              <div
                className="absolute inset-0 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center text-white"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-4xl font-bold mb-4">{currentWord.word}</span>
                <span className="text-lg text-white/80">{currentWord.pronunciation}</span>
                <span className="text-sm text-white/60 mt-4">点击卡片查看释义</span>
              </div>
              <div
                className="absolute inset-0 bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-3xl font-bold text-gray-800 mb-4">{currentWord.translation}</span>
                <div className="w-full p-4 bg-gray-50 rounded-xl">
                  <p className="text-gray-600 italic">"{currentWord.example}"</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={goToPrev}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={handleKnown}
            className="flex-1 max-w-xs py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-6 h-6" />
            <span>已掌握</span>
          </button>
          <button
            onClick={handleUnknown}
            className="flex-1 max-w-xs py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <XCircle className="w-6 h-6" />
            <span>需复习</span>
          </button>
          <button
            onClick={goToNext}
            className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-600 hover:text-primary-600 hover:shadow-xl transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {words.map((word, index) => (
            <button
              key={word.id}
              onClick={() => {
                setIsFlipped(false);
                setTimeout(() => setCurrentIndex(index), 300);
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-primary-500 w-8'
                  : knownWords.has(word.id)
                  ? 'bg-green-400'
                  : unknownWords.has(word.id)
                  ? 'bg-red-400'
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VocabularyPage;
