import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Star, Clock, Users, BookOpen, Play, CheckCircle, ChevronRight, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Course } from '../types';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const foundCourse = api.courses.getById(id || '');
    if (foundCourse) {
      setCourse(foundCourse);
    } else {
      navigate('/courses');
    }
  }, [id, navigate]);

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

  const learningModules = [
    { id: 'vocabulary', name: '单词记忆', description: '卡片式记忆，高效掌握词汇' },
    { id: 'grammar', name: '语法练习', description: '巩固语法知识，提升语言准确性' },
    { id: 'speaking', name: '口语跟读', description: '练习发音，提升口语能力' },
    { id: 'listening', name: '听力训练', description: '提升听力理解能力' },
  ];

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="relative h-80 overflow-hidden">
        <img
          src={course.coverImage}
          alt={course.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-end pb-12">
          <div className="text-white">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回课程列表</span>
            </button>
            <h1 className="text-4xl font-bold mb-2">{course.name}</h1>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[course.level]}`}>
                {levelLabels[course.level]}
              </span>
              <span className="text-white/80">{languageLabels[course.language]}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex border-b border-gray-100">
                {['overview', 'modules', 'reviews'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 font-medium transition-colors ${
                      activeTab === tab
                        ? 'text-primary-600 border-b-2 border-primary-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab === 'overview' && '课程介绍'}
                    {tab === 'modules' && '学习模块'}
                    {tab === 'reviews' && '学员评价'}
                  </button>
                ))}
              </div>

              <div className="p-8">
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">课程简介</h2>
                    <p className="text-gray-600 leading-relaxed mb-6">{course.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                      <div className="bg-primary-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-8 h-8 text-primary-600" />
                          <div>
                            <p className="text-2xl font-bold text-gray-800">{course.lessonsCount}</p>
                            <p className="text-gray-500 text-sm">课程数量</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <Star className="w-8 h-8 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold text-gray-800">{course.rating}</p>
                            <p className="text-gray-500 text-sm">课程评分</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                          <Users className="w-8 h-8 text-blue-600" />
                          <div>
                            <p className="text-2xl font-bold text-gray-800">{course.studentsCount.toLocaleString()}</p>
                            <p className="text-gray-500 text-sm">学员数量</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-800 mb-4">课程标签</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span key={tag} className="px-4 py-2 bg-gray-100 text-gray-600 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'modules' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">学习模块</h2>
                    <div className="space-y-4">
                      {learningModules.map((module) => (
                        <Link
                          key={module.id}
                          to={`/study/${module.id}`}
                          className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white mr-4">
                            <Play className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                              {module.name}
                            </h3>
                            <p className="text-gray-500 text-sm">{module.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">学员评价</h2>
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                            学
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">语言学习者</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">非常好的课程，内容丰富，讲解清晰。学习了很多实用的知识！</p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-4 mb-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            日
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">日语达人</p>
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">课程设计得很合理，循序渐进，适合各个水平的学习者。</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Award className="w-5 h-5 text-primary-600" />
                <h3 className="font-semibold text-gray-800">课程信息</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">课程级别</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${levelColors[course.level]}`}>
                    {levelLabels[course.level]}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">课程语言</span>
                  <span className="font-medium text-gray-800">{languageLabels[course.language]}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">课程数量</span>
                  <span className="font-medium text-gray-800">{course.lessonsCount} 节</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">学员评分</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-gray-800">{course.rating}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">学员人数</span>
                  <span className="font-medium text-gray-800">{course.studentsCount.toLocaleString()}</span>
                </div>
              </div>
              
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg hover:shadow-xl">
                开始学习
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
