import { create } from "zustand";
import { api, type Post, type PostDetail } from "@/lib/api";

interface CommunityState {
  posts: Post[];
  currentPost: PostDetail | null;
  isLoading: boolean;
  error: string | null;

  fetchPosts: (languageTag?: string) => Promise<void>;
  createPost: (data: {
    title: string;
    content: string;
    languageTag: string;
  }) => Promise<void>;
  fetchPostDetail: (id: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
}

export const useCommunityStore = create<CommunityState>((set) => ({
  posts: [],
  currentPost: null,
  isLoading: false,
  error: null,

  fetchPosts: async (languageTag?: string) => {
    set({ isLoading: true, error: null });
    try {
      const posts = await api.community.posts(languageTag);
      set({ posts, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch posts",
      });
    }
  },

  createPost: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newPost = await api.community.createPost(data);
      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }));
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to create post",
      });
      throw err;
    }
  },

  fetchPostDetail: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const post = await api.community.postDetail(id);
      set({ currentPost: post, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to fetch post detail",
      });
    }
  },

  addComment: async (postId: string, content: string) => {
    set({ isLoading: true, error: null });
    try {
      const newComment = await api.community.addComment(postId, content);
      set((state) => {
        if (!state.currentPost) return { isLoading: false };
        return {
          currentPost: {
            ...state.currentPost,
            comments: [...state.currentPost.comments, newComment],
            commentsCount: state.currentPost.commentsCount + 1,
          },
          isLoading: false,
        };
      });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error
          ? err.message
          : "Failed to add comment",
      });
      throw err;
    }
  },

  likePost: async (postId: string) => {
    try {
      const result = await api.community.likePost(postId);
      set((state) => ({
        posts: state.posts.map((p) =>
          p.id === postId
            ? { ...p, likes: result.likes, liked: result.liked }
            : p
        ),
        currentPost:
          state.currentPost?.id === postId
            ? {
                ...state.currentPost,
                likes: result.likes,
                liked: result.liked,
              }
            : state.currentPost,
      }));
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to like post",
      });
    }
  },
}));
