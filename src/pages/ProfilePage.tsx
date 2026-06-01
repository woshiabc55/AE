import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Globe, Settings, LogOut, Edit, Check, Flame, Clock, Star, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { Achievement } from '../types';

const ProfilePage: React.FC = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/login');
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      setAchievements(api.achievements.getUserAchievements(user.id));
      setNickname(user.nickname);
    }
  }, [user]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const languageLabels = {
    english: '英语',
    japanese: '日语',
    korean: '韩语',
  };

  const levelLabels = {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
  };

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-purple-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>返回首页</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.nickname.charAt(0)}
              </div>
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="px-3 py-1 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    onClick={handleSave}
                    className="p-1 text-primary-600 hover:bg-primary-50 rounded-lg"
                  >
                    <Check className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">{user.nickname}</h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    编辑资料
                  </button>
                </>
              )}
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4" />
                  <span>{languageLabels[user.targetLanguage as keyof typeof languageLabels]}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Award className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-800">我的成就</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="flex flex-col items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-3xl mb-2">{achievement.icon}</span>
                <p className="font-semibold text-gray-800 text-sm text-center">{achievement.name}</p>
              </div>
            ))}
            {achievements.length === 0 && (
              <div className="col-span-4 text-center py-8">
                <p className="text-gray-500">还没有获得任何成就</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">账户设置</h2>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <Settings className="w-5 h-5 text-gray-500" />
              <span className="flex-1 text-left">账号设置</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <Globe className="w-5 h-5 text-gray-500" />
              <span className="flex-1 text-left">语言设置</span>
            </button>
            <button className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
              <User className="w-5 h-5 text-gray-500" />
              <span className="flex-1 text-left">修改密码</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 p-4 hover:bg-red-50 rounded-xl transition-colors text-red-600"
            >
              <LogOut className="w-5 h-5" />
              <span className="flex-1 text-left">退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
