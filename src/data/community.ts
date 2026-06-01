import { CommunityPost, Comment } from '../types';

export const mockCommunityPosts: CommunityPost[] = [
  {
    id: 'p1',
    userId: '1',
    userName: '语言学习者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    title: '学习英语的一些心得',
    content: '最近开始学习英语，发现每天坚持学习15分钟效果很好。推荐大家试试卡片记忆法，对单词记忆很有帮助！',
    likes: 42,
    comments: 8,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'p2',
    userId: '2',
    userName: '日语达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    title: '日语N2备考经验分享',
    content: '备考N2的朋友们，推荐大家多做真题练习，尤其是听力部分。每天坚持听NHK新闻会有很大提升！',
    likes: 128,
    comments: 23,
    createdAt: '2024-01-14T15:20:00Z',
  },
  {
    id: 'p3',
    userId: '1',
    userName: '语言学习者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    title: '韩语学习打卡第10天',
    content: '今天学习了韩语的基本问候语，感觉发音比想象中难。有没有小伙伴一起组队学习呀？',
    likes: 35,
    comments: 12,
    createdAt: '2024-01-13T09:00:00Z',
  },
  {
    id: 'p4',
    userId: '2',
    userName: '日语达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    title: '分享一个很好用的日语学习APP',
    content: '最近发现了一个叫"日语学习助手"的APP，里面的动漫台词学习功能特别棒，推荐给大家！',
    likes: 89,
    comments: 15,
    createdAt: '2024-01-12T14:45:00Z',
  },
];

export const mockComments: Comment[] = [
  {
    id: 'c1',
    postId: 'p1',
    userId: '2',
    userName: '日语达人',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=2',
    content: '同意！卡片记忆法真的很有效，我也在用类似的方法学习日语。',
    createdAt: '2024-01-15T11:00:00Z',
  },
  {
    id: 'c2',
    postId: 'p1',
    userId: '1',
    userName: '语言学习者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    content: '感谢分享！一起加油学习吧！',
    createdAt: '2024-01-15T11:30:00Z',
  },
  {
    id: 'c3',
    postId: 'p2',
    userId: '1',
    userName: '语言学习者',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
    content: '谢谢分享！正准备备考N2，收藏了！',
    createdAt: '2024-01-14T16:00:00Z',
  },
];

export const getCommunityPosts = () => mockCommunityPosts;

export const getCommentsByPostId = (postId: string): Comment[] => {
  return mockComments.filter(comment => comment.postId === postId);
};

export const createPost = (userId: string, userName: string, userAvatar: string, title: string, content: string): CommunityPost => {
  const newPost: CommunityPost = {
    id: String(Date.now()),
    userId,
    userName,
    userAvatar,
    title,
    content,
    likes: 0,
    comments: 0,
    createdAt: new Date().toISOString(),
  };
  mockCommunityPosts.push(newPost);
  return newPost;
};

export const createComment = (postId: string, userId: string, userName: string, userAvatar: string, content: string): Comment => {
  const newComment: Comment = {
    id: String(Date.now()),
    postId,
    userId,
    userName,
    userAvatar,
    content,
    createdAt: new Date().toISOString(),
  };
  mockComments.push(newComment);
  return newComment;
};
