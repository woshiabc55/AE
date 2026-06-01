import { Course } from '../types';

export const mockCourses: Course[] = [
  {
    id: 'c1',
    name: '英语入门',
    language: 'english',
    level: 'beginner',
    description: '从零开始学习英语，掌握基础词汇和日常对话',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=english%20language%20learning%20colorful%20modern%20illustration&image_size=landscape_16_9',
    lessonsCount: 24,
    rating: 4.9,
    studentsCount: 12580,
    tags: ['入门', '日常对话', '基础词汇'],
  },
  {
    id: 'c2',
    name: '英语进阶',
    language: 'english',
    level: 'intermediate',
    description: '提升英语水平，掌握中级语法和复杂句式',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=advanced%20english%20learning%20professional%20modern%20design&image_size=landscape_16_9',
    lessonsCount: 36,
    rating: 4.8,
    studentsCount: 8920,
    tags: ['进阶', '语法', '写作'],
  },
  {
    id: 'c3',
    name: '英语精通',
    language: 'english',
    level: 'advanced',
    description: '精通英语，掌握商务英语和高级表达',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=business%20english%20professional%20corporate%20modern&image_size=landscape_16_9',
    lessonsCount: 48,
    rating: 4.7,
    studentsCount: 5640,
    tags: ['精通', '商务', '高级'],
  },
  {
    id: 'c4',
    name: '日语五十音',
    language: 'japanese',
    level: 'beginner',
    description: '学习日语五十音图，掌握日语发音基础',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=japanese%20hiragana%20katakana%20colorful%20cute%20illustration&image_size=landscape_16_9',
    lessonsCount: 12,
    rating: 4.9,
    studentsCount: 9870,
    tags: ['入门', '五十音', '发音'],
  },
  {
    id: 'c5',
    name: '日语基础',
    language: 'japanese',
    level: 'beginner',
    description: '学习日语基础语法和日常会话',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=japanese%20language%20learning%20traditional%20modern%20mix&image_size=landscape_16_9',
    lessonsCount: 32,
    rating: 4.8,
    studentsCount: 7650,
    tags: ['基础', '会话', '语法'],
  },
  {
    id: 'c6',
    name: '日语进阶',
    language: 'japanese',
    level: 'intermediate',
    description: '深入学习日语语法，提升听说能力',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=japanese%20culture%20modern%20city%20learning&image_size=landscape_16_9',
    lessonsCount: 40,
    rating: 4.7,
    studentsCount: 4320,
    tags: ['进阶', '听力', '口语'],
  },
  {
    id: 'c7',
    name: '韩语入门',
    language: 'korean',
    level: 'beginner',
    description: '学习韩语基础字母和日常对话',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=korean%20hangul%20colorful%20modern%20kpop%20style&image_size=landscape_16_9',
    lessonsCount: 20,
    rating: 4.9,
    studentsCount: 11230,
    tags: ['入门', '韩语字母', '日常'],
  },
  {
    id: 'c8',
    name: '韩语进阶',
    language: 'korean',
    level: 'intermediate',
    description: '提升韩语水平，学习韩剧台词和流行语',
    coverImage: 'https://neeko-copilot.bytedance.net/api/text_to_image?prompt=korean%20drama%20kpop%20modern%20trendy%20learning&image_size=landscape_16_9',
    lessonsCount: 34,
    rating: 4.8,
    studentsCount: 6780,
    tags: ['进阶', '韩剧', '流行语'],
  },
];

export const getCourses = () => mockCourses;

export const getCoursesByLanguage = (language: string): Course[] => {
  return mockCourses.filter(course => course.language === language);
};

export const getCoursesByLevel = (level: string): Course[] => {
  return mockCourses.filter(course => course.level === level);
};

export const getCourseById = (id: string): Course | undefined => {
  return mockCourses.find(course => course.id === id);
};
