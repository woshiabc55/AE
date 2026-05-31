export type Language = 'en' | 'ja' | 'ko';
export type Level = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type ModuleType = 'vocabulary' | 'grammar' | 'speaking' | 'listening';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  targetLanguage: Language;
  level: Level;
  xp: number;
  streak: number;
  dailyGoal: number;
  createdAt: string;
}

export interface Course {
  id: string;
  language: Language;
  level: Level;
  title: string;
  description: string;
  coverImage: string;
  totalLessons: number;
  enrolledCount: number;
  rating: number;
  tags: string[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  order: number;
  type: ModuleType;
  duration: number;
  completed: boolean;
}

export interface CourseDetail extends Course {
  lessons: Lesson[];
  objectives: string[];
  targetAudience: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  exampleTranslation: string;
  phonetic: string;
  audioUrl: string;
}

export interface GrammarExercise {
  id: string;
  type: 'fill-blank' | 'choice' | 'reorder';
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  parts?: string[];
}

export interface SpeakingItem {
  id: string;
  text: string;
  translation: string;
  phonetic: string;
  difficulty: number;
}

export interface ListeningItem {
  id: string;
  title: string;
  transcript: string;
  translation: string;
  questions: ListeningQuestion[];
}

export interface ListeningQuestion {
  id: string;
  question: string;
  options: string[];
  answer: number;
}

export interface LearningProgress {
  userId: string;
  language: Language;
  level: Level;
  completedLessons: string[];
  vocabularyMastered: number;
  grammarMastered: number;
  speakingScore: number;
  listeningScore: number;
  totalXP: number;
  streak: number;
  lastStudyDate: string;
  dailyMinutes: number;
  weeklyData: { day: string; minutes: number; words: number }[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: 'learning' | 'streak' | 'social' | 'special';
  requirement: number;
  progress: number;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  language: Language;
  likes: number;
  comments: number;
  createdAt: string;
  tags: string[];
}

export interface Topic {
  id: string;
  title: string;
  language: Language;
  postsCount: number;
  lastActive: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  avatar: string;
  xp: number;
  streak: number;
}

export const LANGUAGE_CONFIG: Record<Language, { name: string; nativeName: string; color: string; bgColor: string }> = {
  en: { name: '英语', nativeName: 'English', color: '#3B82F6', bgColor: 'rgba(59,130,246,0.1)' },
  ja: { name: '日语', nativeName: '日本語', color: '#A78BFA', bgColor: 'rgba(167,139,250,0.1)' },
  ko: { name: '韩语', nativeName: '한국어', color: '#F472B6', bgColor: 'rgba(244,114,182,0.1)' },
};

export const LEVEL_CONFIG: Record<Level, { name: string; description: string }> = {
  A1: { name: '入门', description: '能理解和使用熟悉的日常表达' },
  A2: { name: '初级', description: '能理解句子和常用表达' },
  B1: { name: '中级', description: '能应对旅行、工作等场景' },
  B2: { name: '中高级', description: '能与母语者流畅交流' },
  C1: { name: '高级', description: '能灵活运用语言进行学术工作' },
  C2: { name: '精通', description: '接近母语水平' },
};
