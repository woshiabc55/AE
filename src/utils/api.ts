import { getCourses, getCourseById, getCoursesByLanguage, getCoursesByLevel } from '../data/courses';
import { getVocabulary } from '../data/vocabulary';
import { getGrammarQuestions } from '../data/grammar';
import { getListeningItems } from '../data/listening';
import { getCommunityPosts, getCommentsByPostId, createPost as createCommunityPost, createComment as createCommunityComment } from '../data/community';
import { getUserAchievements, getAchievements } from '../data/achievements';
import { Course, VocabularyItem, GrammarQuestion, ListeningItem, CommunityPost, Comment, Achievement, Language, Level } from '../types';

export const api = {
  courses: {
    getAll: (): Course[] => getCourses(),
    getById: (id: string): Course | undefined => getCourseById(id),
    getByLanguage: (language: Language): Course[] => getCoursesByLanguage(language),
    getByLevel: (level: Level): Course[] => getCoursesByLevel(level),
  },
  vocabulary: {
    get: (language?: Language, level?: Level): VocabularyItem[] => getVocabulary(language, level),
  },
  grammar: {
    getQuestions: (language?: Language, level?: Level): GrammarQuestion[] => getGrammarQuestions(language, level),
  },
  listening: {
    getItems: (language?: Language, level?: Level): ListeningItem[] => getListeningItems(language, level),
  },
  community: {
    getPosts: (): CommunityPost[] => getCommunityPosts(),
    getComments: (postId: string): Comment[] => getCommentsByPostId(postId),
    createPost: (userId: string, userName: string, userAvatar: string, title: string, content: string): CommunityPost =>
      createCommunityPost(userId, userName, userAvatar, title, content),
    createComment: (postId: string, userId: string, userName: string, userAvatar: string, content: string): Comment =>
      createCommunityComment(postId, userId, userName, userAvatar, content),
  },
  achievements: {
    getUserAchievements: (userId: string): Achievement[] => getUserAchievements(userId),
    getAll: (): Achievement[] => getAchievements(),
  },
};
