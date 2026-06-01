export interface User {
  id: string;
  email: string;
  nickname: string;
  avatar: string;
  nativeLanguage: string;
  targetLanguage: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  streakDays: number;
  totalMinutes: number;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  language: 'english' | 'japanese' | 'korean';
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  coverImage: string;
  lessonsCount: number;
  rating: number;
  studentsCount: number;
  tags: string[];
}

export interface LearningRecord {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  lastStudyAt: string;
  totalMinutes: number;
  completedLessons: string[];
}

export interface Achievement {
  id: string;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'english' | 'japanese' | 'korean';
}

export interface GrammarQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'english' | 'japanese' | 'korean';
}

export interface ListeningItem {
  id: string;
  title: string;
  audioUrl: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
  level: 'beginner' | 'intermediate' | 'advanced';
  language: 'english' | 'japanese' | 'korean';
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createdAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export type Language = 'english' | 'japanese' | 'korean';
export type Level = 'beginner' | 'intermediate' | 'advanced';
