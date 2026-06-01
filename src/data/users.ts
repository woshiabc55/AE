import { User } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'user@example.com',
    nickname: '语言学习者',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    nativeLanguage: 'Chinese',
    targetLanguage: 'english',
    level: 'beginner',
    streakDays: 7,
    totalMinutes: 350,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    email: 'learner@example.com',
    nickname: '日语达人',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    nativeLanguage: 'Chinese',
    targetLanguage: 'japanese',
    level: 'intermediate',
    streakDays: 30,
    totalMinutes: 1200,
    createdAt: '2024-02-15T00:00:00Z',
  },
];

export const getUsers = () => mockUsers;

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  return mockUsers.find(user => user.email === email);
};

export const createUser = (email: string, password: string, nickname: string): User => {
  const newUser: User = {
    id: String(Date.now()),
    email,
    nickname,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`,
    nativeLanguage: 'Chinese',
    targetLanguage: 'english',
    level: 'beginner',
    streakDays: 0,
    totalMinutes: 0,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(newUser);
  return newUser;
};
