import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, CheckCircle, XCircle, Trophy, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { ListeningItem } from '../types';

const ListeningPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ListeningItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const listeningItems = api.listening.getItems(user?.targetLanguage || 'english', user?.level || 'beginner');
    setItems(listeningItems);
  }, [user]);

  const currentItem = items[currentIndex];

  useEffect(() => {
    if (currentItem) {
      setSelectedAnswers(new Array(currentItem.questions.length).fill(-1));
      setCurrentQuestionIndex(0);
      setShowResults(false);
    }
  }, [currentIndex, currentItem]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 5000);
    }
  };

  const handleSelectAnswer = (questionIndex: number, answerIndex: number) => {
    if (showResults) return;
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    setShowResults(true);
    let correct = 0;
    currentItem.questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correctAnswer) {
        correct++;
      }
    });
    setCorrectCount(prev => prev + correct);
  };

  const handleNext = () => {
    if (currentIndex < items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  if (isLoading || !currentItem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isFinished) {
    const totalQuestions = items.reduce((acc, item) => acc + item.questions.length, 0);
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">听力测试完成!</h2>
          <p className="text-gray-500 mb-6">你已经完成了所有听力练习</p>
          
          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <p className="text-6xl font-bold text-primary-600 mb-2">{correctCount}/{totalQuestions}</p>
            <p className="text-gray-500">正确率: {percentage}%</p>
          </div>

          <button
            onClick={handleReset}
            className="w-full py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            再次挑战
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-violet-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">听力训练</h1>
          <p className="text-gray-500">听录音并回答问题</p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg">
            <BookOpen className="w-5 h-5" />
            <span>练习: {currentIndex + 1}/{items.length}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg">
            <CheckCircle className="w-5 h-5" />
            <span>正确: {correctCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">{currentItem.title}</h3>
            
            <button
              onClick={handlePlay}
              className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 transition-all ${
                isPlaying
                  ? 'bg-red-100 text-red-600'
                  : 'bg-primary-100 text-primary-600 hover:bg-primary-200'
              }`}
            >
              {isPlaying ? (
                <Pause className="w-8 h-8" />
              ) : (
                <Play className="w-8 h-8" />
              )}
              <span className="text-lg font-semibold">
                {isPlaying ? '暂停播放' : '播放录音'}
              </span>
            </button>

            <div className="mt-6 p-4 bg-gray-50 rounded-xl">
              <p className="text-gray-600">原文:</p>
              <p className="text-gray-800 mt-2">{currentItem.transcript}</p>
            </div>
          </div>

          <div className="space-y-6">
            {currentItem.questions.map((question, qIndex) => (
              <div key={qIndex}>
                <h4 className="font-semibold text-gray-800 mb-3">{qIndex + 1}. {question.question}</h4>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    let optionClass = 'border-gray-200 text-gray-700 hover:border-primary-300 hover:bg-primary-50';
                    if (showResults) {
                      if (oIndex === question.correctAnswer) {
                        optionClass = 'border-green-500 bg-green-50 text-green-700';
                      } else if (selectedAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer) {
                        optionClass = 'border-red-500 bg-red-50 text-red-700';
                      } else {
                        optionClass = 'border-gray-200 text-gray-500';
                      }
                    } else if (selectedAnswers[qIndex] === oIndex) {
                      optionClass = 'border-primary-500 bg-primary-50 text-primary-700';
                    }

                    return (
                      <button
                        key={oIndex}
                        onClick={() => handleSelectAnswer(qIndex, oIndex)}
                        disabled={showResults}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-medium">
                            {String.fromCharCode(65 + oIndex)}
                          </span>
                          <span className="flex-1">{option}</span>
                          {showResults && oIndex === question.correctAnswer && (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          )}
                          {showResults && selectedAnswers[qIndex] === oIndex && oIndex !== question.correctAnswer && (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {!showResults ? (
          <button
            onClick={handleSubmit}
            disabled={selectedAnswers.some(a => a === -1)}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            提交答案
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="w-full py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl"
          >
            {currentIndex < items.length - 1 ? '下一个练习' : '查看结果'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ListeningPage;
