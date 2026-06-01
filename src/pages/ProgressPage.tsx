import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Clock, Star, Trophy, TrendingUp, Award, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Achievement } from '../types';

const ProgressPage: React.FC = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setAchievements(api.achievements.getUserAchievements(user.id));
    }
  }, [user]);

  const weeklyData = [
    { day: '周一', minutes: 30 },
    { day: '周二', minutes: 45 },
    { day: '周三', minutes: 20 },
    { day: '周四', minutes: 50 },
    { day: '周五', minutes: 35 },
    { day: '周六', minutes: 60 },
    { day: '周日', minutes: 40 },
  ];

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes));

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">学习进度</h1>
          <p className="text-gray-500">查看您的学习数据和成就</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                <p className="text-2xl font-bold text-gray-800">{achievements.length}</p>
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
                  {user.level === 'beginner' ? '初级' : user.level === 'intermediate' ? '中级' : '高级'}
                </p>
                <p className="text-gray-500 text-sm">当前等级</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-800">本周学习时长</h2>
            </div>
            <div className="flex items-end justify-between h-48 gap-4">
              {weeklyData.map((data) => (
                <div key={data.day} className="flex-1 flex flex-col items-center">
                  <span className="text-sm font-medium text-gray-600 mb-2">{data.minutes}m</span>
                  <div className="w-full bg-gray-100 rounded-full h-32 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-primary-500 to-primary-400 rounded-full transition-all duration-500"
                      style={{ height: `${(data.minutes / maxMinutes) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 mt-2">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <p className="text-gray-500">本周总学习时长: {weeklyData.reduce((acc, d) => acc + d.minutes, 0)} 分钟</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 mb-6">
              <Award className="w-5 h-5 text-primary-600" />
              <h2 className="text-xl font-semibold text-gray-800">获得的成就</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <span className="text-3xl">{achievement.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-800">{achievement.name}</p>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
              ))}
              {achievements.length === 0 && (
                <div className="col-span-2 text-center py-8">
                  <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">还没有获得任何成就</p>
                  <p className="text-gray-400 text-sm">开始学习以解锁成就!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">继续保持学习!</h2>
              <p className="text-white/80">每天坚持学习，见证你的成长</p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-white text-primary-600 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              开始学习
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressPage;
