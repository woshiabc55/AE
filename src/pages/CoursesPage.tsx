import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, Star, ChevronRight, Globe, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Course, Language, Level } from '../types';

const CoursesPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | 'all'>('all');
  const [selectedLevel, setSelectedLevel] = useState<Level | 'all'>('all');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    let filtered = api.courses.getAll();
    
    if (selectedLanguage !== 'all') {
      filtered = filtered.filter(course => course.language === selectedLanguage);
    }
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }
    if (searchQuery) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setCourses(filtered);
  }, [selectedLanguage, selectedLevel, searchQuery]);

  const languageOptions: { code: Language | 'all'; name: string }[] = [
    { code: 'all', name: '全部语言' },
    { code: 'english', name: '英语' },
    { code: 'japanese', name: '日语' },
    { code: 'korean', name: '韩语' },
  ];

  const levelOptions: { code: Level | 'all'; name: string }[] = [
    { code: 'all', name: '全部等级' },
    { code: 'beginner', name: '初级' },
    { code: 'intermediate', name: '中级' },
    { code: 'advanced', name: '高级' },
  ];

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

  const languageLabels = {
    english: '英语',
    japanese: '日语',
    korean: '韩语',
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">课程中心</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            探索丰富的语言课程，找到适合您的学习路径
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索课程..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-4">
              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value as Language | 'all')}
                  className="appearance-none pl-12 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>{lang.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value as Level | 'all')}
                className="appearance-none pl-4 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white cursor-pointer"
              >
                {levelOptions.map((level) => (
                  <option key={level.code} value={level.code}>{level.name}</option>
                ))}
              </select>
            </div>
          </div>
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
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}>
                    {levelLabels[course.level]}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-primary-500" />
                  <span className="text-sm text-primary-600 font-medium">
                    {languageLabels[course.language]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {course.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">{course.description}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {course.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-medium text-gray-600">{course.rating}</span>
                    </div>
                    <span className="text-sm text-gray-400">{course.studentsCount.toLocaleString()} 学员</span>
                  </div>
                  <div className="flex items-center gap-1 text-primary-600 font-medium">
                    <span>{course.lessonsCount} 节课</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无课程</h3>
            <p className="text-gray-400">没有找到符合条件的课程，请尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesPage;
