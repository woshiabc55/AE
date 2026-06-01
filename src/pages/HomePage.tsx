import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Flame, Star, ChevronRight, Globe, Volume2, MessageSquare, CheckCircle, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Course, Language } from '../types';

const languageOptions = [
  { code: 'english', name: '英语', icon: '🇺🇸', color: 'from-blue-500 to-blue-700' },
  { code: 'japanese', name: '日语', icon: '🇯🇵', color: 'from-red-500 to-red-700' },
  { code: 'korean', name: '韩语', icon: '🇰🇷', color: 'from-purple-500 to-purple-700' },
];

const HomePage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>('english');
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    setCourses(api.courses.getByLanguage(selectedLanguage));
  }, [selectedLanguage]);

  const levelColors = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-yellow-100 text-yellow-700',
    advanced: 'bg-red-100 text-red-700',
  };

  const levelLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-primary-600 to-purple-600"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center text-white">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              沉浸式语言学习体验
            </h1>
            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              支持英语、日语、韩语等主流语言，开启您的多语种学习之旅
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
            {languageOptions.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code as Language)}
                className={`relative p-6 rounded-2xl transition-all duration-300 transform ${
                  selectedLanguage === lang.code
                    ? 'bg-white shadow-xl scale-105'
                    : 'bg-white/10 backdrop-blur-sm hover:bg-white/20'
                }`}
              >
                <span className="text-4xl mb-2 block">{lang.icon}</span>
                <span className={`font-semibold ${
                  selectedLanguage === lang.code ? 'text-gray-800' : 'text-white'
                }`}>
                  {lang.name}
                </span>
                {selectedLanguage === lang.code && (
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {user && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{user.streakDays}</p>
                  <p className="text-gray-500 text-sm">连续学习天数</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">{user.totalMinutes}</p>
                  <p className="text-gray-500 text-sm">累计学习分钟</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {api.achievements.getUserAchievements(user.id).length}
                  </p>
                  <p className="text-gray-500 text-sm">已获得成就</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-800">
                    {levelLabels[user.level]}
                  </p>
                  <p className="text-gray-500 text-sm">当前等级</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">推荐课程</h2>
            <p className="text-gray-500 mt-1">根据您的水平推荐合适的课程</p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
          >
            查看全部
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.coverImage}
                  alt={course.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
                  {levelLabels[course.level]}
                </span>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-600">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">{course.studentsCount.toLocaleString()} 学员</span>
                  </div>
                  <span className="text-sm text-primary-600 font-medium">{course.lessonsCount} 节课</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">学习模块</h2>
          <p className="text-gray-500 mt-1">多种互动式学习方式，提升您的语言能力</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            to="/study/vocabulary"
            className="group bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Globe className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">单词记忆</h3>
            <p className="text-white/80 text-sm">卡片式记忆，高效掌握词汇</p>
          </Link>
          <Link
            to="/study/grammar"
            className="group bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <BookOpen className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">语法练习</h3>
            <p className="text-white/80 text-sm">巩固语法知识，提升语言准确性</p>
          </Link>
          <Link
            to="/study/speaking"
            className="group bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <Volume2 className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">口语跟读</h3>
            <p className="text-white/80 text-sm">练习发音，提升口语能力</p>
          </Link>
          <Link
            to="/study/listening"
            className="group bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <MessageSquare className="w-12 h-12 mb-4" />
            <h3 className="text-xl font-semibold mb-2">听力训练</h3>
            <p className="text-white/80 text-sm">提升听力理解能力</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
