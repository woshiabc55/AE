import type { Achievement, Post, Topic, LeaderboardEntry } from '@/types';

export const achievements: Achievement[] = [
  { id: 'ach-01', name: '初出茅庐', description: '完成第一节课程', icon: '🎯', unlocked: true, unlockedAt: '2026-05-28', category: 'learning', requirement: 1, progress: 1 },
  { id: 'ach-02', name: '词汇新手', description: '掌握50个单词', icon: '📚', unlocked: true, unlockedAt: '2026-05-29', category: 'learning', requirement: 50, progress: 50 },
  { id: 'ach-03', name: '词汇达人', description: '掌握200个单词', icon: '📖', unlocked: false, category: 'learning', requirement: 200, progress: 78 },
  { id: 'ach-04', name: '语法入门', description: '完成10道语法题', icon: '✏️', unlocked: true, unlockedAt: '2026-05-30', category: 'learning', requirement: 10, progress: 10 },
  { id: 'ach-05', name: '语法高手', description: '完成100道语法题', icon: '🏆', unlocked: false, category: 'learning', requirement: 100, progress: 35 },
  { id: 'ach-06', name: '开口说', description: '完成第一次口语跟读', icon: '🎤', unlocked: true, unlockedAt: '2026-05-29', category: 'learning', requirement: 1, progress: 1 },
  { id: 'ach-07', name: '连续3天', description: '连续学习3天', icon: '🔥', unlocked: true, unlockedAt: '2026-05-30', category: 'streak', requirement: 3, progress: 3 },
  { id: 'ach-08', name: '连续7天', description: '连续学习7天', icon: '⚡', unlocked: false, category: 'streak', requirement: 7, progress: 5 },
  { id: 'ach-09', name: '连续30天', description: '连续学习30天', icon: '🌟', unlocked: false, category: 'streak', requirement: 30, progress: 5 },
  { id: 'ach-10', name: '社交蝴蝶', description: '在社区发布5条动态', icon: '🦋', unlocked: false, category: 'social', requirement: 5, progress: 2 },
  { id: 'ach-11', name: '助人为乐', description: '获得10个赞', icon: '💝', unlocked: false, category: 'social', requirement: 10, progress: 6 },
  { id: 'ach-12', name: '多语种探索者', description: '同时学习2门语言', icon: '🌍', unlocked: false, category: 'special', requirement: 2, progress: 1 },
  { id: 'ach-13', name: '学霸之路', description: '累计获得1000经验值', icon: '👑', unlocked: false, category: 'special', requirement: 1000, progress: 450 },
  { id: 'ach-14', name: '听力达人', description: '完成20个听力练习', icon: '🎧', unlocked: false, category: 'learning', requirement: 20, progress: 8 },
  { id: 'ach-15', name: '完美发音', description: '口语评分达到90分以上', icon: '💯', unlocked: false, category: 'learning', requirement: 90, progress: 75 },
];

export const communityPosts: Post[] = [
  { id: 'post-01', userId: 'user-02', userName: '小明同学', userAvatar: '🧑‍🎓', content: '今天终于把英语A1课程学完了！感觉自己的日常对话能力提升了很多，特别是购物和点餐的场景，下次出国旅行一定要试试！💪', language: 'en', likes: 24, comments: 8, createdAt: '2026-05-31T10:30:00', tags: ['英语', 'A1课程'] },
  { id: 'post-02', userId: 'user-03', userName: '樱花酱', userAvatar: '👩‍🎤', content: '日语五十音图终于背完了！分享一下我的记忆方法：把平假名和片假名配对来记，每天写10遍，一周就记住了～ あいうえお✨', language: 'ja', likes: 42, comments: 15, createdAt: '2026-05-31T09:15:00', tags: ['日语', '五十音'] },
  { id: 'post-03', userId: 'user-04', userName: '韩流少年', userAvatar: '🧑‍🎤', content: '通过K-pop学韩语真的超有效！今天跟着BTS的新歌学会了好多日常用语，学习也可以这么快乐！🎵', language: 'ko', likes: 38, comments: 12, createdAt: '2026-05-31T08:45:00', tags: ['韩语', 'K-pop'] },
  { id: 'post-04', userId: 'user-05', userName: '语法小达人', userAvatar: '🤓', content: '英语语法真的不难！关键是要理解逻辑而不是死记硬背。比如一般现在时，就是描述习惯和事实，这样想就简单多了。', language: 'en', likes: 19, comments: 6, createdAt: '2026-05-30T22:00:00', tags: ['英语', '语法'] },
  { id: 'post-05', userId: 'user-06', userName: '日语学习者', userAvatar: '👨‍💻', content: '敬语真的太难了😭 什么时候用ですか、什么时候用でしょうか，感觉永远分不清...有没有小伙伴一起练习？', language: 'ja', likes: 31, comments: 18, createdAt: '2026-05-30T20:30:00', tags: ['日语', '敬语'] },
  { id: 'post-06', userId: 'user-07', userName: '韩语小白', userAvatar: '🙋', content: '第一天学韩语！收音规则好复杂，但是老师说多读多练就好了。给自己加油！화이팅！', language: 'ko', likes: 15, comments: 5, createdAt: '2026-05-30T18:00:00', tags: ['韩语', '入门'] },
];

export const communityTopics: Topic[] = [
  { id: 'topic-01', title: '英语口语练习打卡', language: 'en', postsCount: 156, lastActive: '2026-05-31T10:30:00' },
  { id: 'topic-02', title: '日语N3备考经验分享', language: 'ja', postsCount: 89, lastActive: '2026-05-31T09:15:00' },
  { id: 'topic-03', title: 'K-pop歌词学韩语', language: 'ko', postsCount: 124, lastActive: '2026-05-31T08:45:00' },
  { id: 'topic-04', title: '旅行英语实用表达', language: 'en', postsCount: 203, lastActive: '2026-05-30T22:00:00' },
  { id: 'topic-05', title: '日语敬语使用指南', language: 'ja', postsCount: 67, lastActive: '2026-05-30T20:30:00' },
  { id: 'topic-06', title: '韩剧经典台词学习', language: 'ko', postsCount: 98, lastActive: '2026-05-30T18:00:00' },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, userId: 'user-10', userName: '语言大师', avatar: '🏆', xp: 12580, streak: 45 },
  { rank: 2, userId: 'user-11', userName: '学霸小王', avatar: '🥇', xp: 11200, streak: 38 },
  { rank: 3, userId: 'user-12', userName: '日语达人', avatar: '🥈', xp: 9870, streak: 32 },
  { rank: 4, userId: 'user-13', userName: '韩语少女', avatar: '🥉', xp: 8650, streak: 28 },
  { rank: 5, userId: 'user-14', userName: '英语爱好者', avatar: '⭐', xp: 7430, streak: 25 },
  { rank: 6, userId: 'user-15', userName: '多语种选手', avatar: '🌟', xp: 6200, streak: 20 },
  { rank: 7, userId: 'user-16', userName: '坚持不懈', avatar: '💪', xp: 5100, streak: 18 },
  { rank: 8, userId: 'user-17', userName: '学习小能手', avatar: '🎯', xp: 4500, streak: 15 },
  { rank: 9, userId: 'user-18', userName: '语言探索者', avatar: '🌍', xp: 3800, streak: 12 },
  { rank: 10, userId: 'user-19', userName: '新手进步中', avatar: '🌱', xp: 2900, streak: 8 },
];
