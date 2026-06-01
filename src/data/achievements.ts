import { Achievement } from '../types';

export const mockAchievements: Achievement[] = [
  {
    id: 'a1',
    badgeId: 'first_day',
    name: '初学者',
    description: '完成第一天学习',
    icon: '🏆',
  },
  {
    id: 'a2',
    badgeId: 'week_streak',
    name: '坚持不懈',
    description: '连续学习7天',
    icon: '🔥',
  },
  {
    id: 'a3',
    badgeId: 'month_streak',
    name: '月度冠军',
    description: '连续学习30天',
    icon: '⭐',
  },
  {
    id: 'a4',
    badgeId: 'vocabulary_master',
    name: '词汇达人',
    description: '学习100个单词',
    icon: '📚',
  },
  {
    id: 'a5',
    badgeId: 'grammar_ninja',
    name: '语法忍者',
    description: '正确回答50道语法题',
    icon: '⚔️',
  },
  {
    id: 'a6',
    badgeId: 'listening_pro',
    name: '听力专家',
    description: '完成20次听力练习',
    icon: '🎧',
  },
  {
    id: 'a7',
    badgeId: 'speaking_star',
    name: '口语之星',
    description: '完成10次口语练习',
    icon: '🎤',
  },
  {
    id: 'a8',
    badgeId: 'language_explorer',
    name: '语言探索者',
    description: '学习三种不同语言',
    icon: '🌍',
  },
];

export const getUserAchievements = (userId: string): Achievement[] => {
  if (userId === '1') {
    return mockAchievements.slice(0, 4);
  }
  if (userId === '2') {
    return mockAchievements.slice(0, 6);
  }
  return [];
};

export const getAchievements = () => mockAchievements;
