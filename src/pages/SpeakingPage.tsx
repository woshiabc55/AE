import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, MicOff, Volume2, RotateCcw, CheckCircle, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { VocabularyItem } from '../types';

const SpeakingPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [words, setWords] = useState<VocabularyItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

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

  const handleStartRecording = () => {
    setIsRecording(true);
    setScore(null);
    setTimeout(() => {
      setIsRecording(false);
      const randomScore = Math.floor(Math.random() * 30) + 70;
      setScore(randomScore);
      setTotalScore(prev => prev + randomScore);
      setCompletedCount(prev => prev + 1);
    }, 3000);
  };

  const handleNext = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setScore(null);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(null);
    setTotalScore(0);
    setCompletedCount(0);
  };

  if (isLoading || !currentWord) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">口语跟读</h1>
          <p className="text-gray-500">点击麦克风，跟读单词进行发音练习</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
            <span>进度: {currentIndex + 1}/{words.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <Star className="w-5 h-5" />
            <span>平均分: {completedCount > 0 ? Math.round(totalScore / completedCount) : 0}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
          <div className="mb-8">
            <p className="text-gray-500 mb-2">请跟读以下单词</p>
            <p className="text-5xl font-bold text-gray-800 mb-4">{currentWord.word}</p>
            <p className="text-xl text-gray-500">{currentWord.pronunciation}</p>
            <p className="text-lg text-primary-600 mt-2">{currentWord.translation}</p>
          </div>

          <button
            onClick={handleStartRecording}
            disabled={isRecording || score !== null}
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${
              isRecording
                ? 'bg-red-500 animate-pulse'
                : score !== null
                ? 'bg-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-br from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 hover:scale-110'
            }`}
          >
            {isRecording ? (
              <MicOff className="w-12 h-12 text-white" />
            ) : (
              <Mic className={`w-12 h-12 ${score !== null ? 'text-gray-400' : 'text-white'}`} />
            )}
          </button>

          {isRecording && (
            <p className="mt-4 text-red-500 font-medium animate-pulse">正在录音中...</p>
          )}

          {score !== null && (
            <div className="mt-6 animate-fade-in">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl ${
                score >= 85 ? 'bg-green-100 text-green-700' : score >= 70 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                <CheckCircle className="w-6 h-6" />
                <span className="text-2xl font-bold">{score}</span>
                <span>分</span>
              </div>
              <p className="mt-4 text-gray-500">
                {score >= 85 ? '发音非常标准！继续保持！' : score >= 70 ? '不错！还有进步空间！' : '继续练习，加油！'}
              </p>
            </div>
          )}
        </div>

        {score !== null && currentIndex < words.length - 1 && (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            下一个单词
          </button>
        )}
      </div>
    </div>
  );
};

export default SpeakingPage;
