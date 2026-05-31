const BASE_URL = "/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      error: "Network error",
    }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  const json = await response.json();

  if (json.data !== undefined) {
    return json.data as T;
  }

  return json as T;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
    avatar: string;
    targetLanguage: string;
    level: string;
  };
}

export interface Course {
  id: string;
  title: string;
  language: "en" | "ja" | "ko";
  level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  description: string;
  coverImage: string;
  totalLessons: number;
  duration: number;
}

export interface VocabularyItem {
  word: string;
  translation: string;
  pronunciation: string;
  example: string;
}

export interface GrammarExercise {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface SpeakingItem {
  text: string;
  translation: string;
  pronunciation: string;
}

export interface ListeningItem {
  audioUrl: string;
  transcript: string;
  questions: {
    question: string;
    options: string[];
    answer: number;
  }[];
}

export interface LessonContent {
  vocabulary?: VocabularyItem[];
  grammar?: GrammarExercise[];
  speaking?: SpeakingItem[];
  listening?: ListeningItem[];
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  type: "vocabulary" | "grammar" | "speaking" | "listening";
  order: number;
  content: LessonContent;
}

export interface UserProgress {
  userId: string;
  language: string;
  currentLevel: string;
  totalStudyTime: number;
  wordsLearned: number;
  coursesCompleted: number;
  streak: number;
  weeklyMinutes: number[];
}

export interface LessonResult {
  lessonId: string;
  score: number;
  timeSpent: number;
  answers: {
    questionIndex: number;
    selectedAnswer: number;
    correct: boolean;
  }[];
}

export interface CalendarData {
  [date: string]: {
    minutes: number;
    lessonsCompleted: number;
  };
}

export interface ProgressStats {
  totalStudyTime: number;
  totalWordsLearned: number;
  totalCoursesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  title: string;
  content: string;
  languageTag: string;
  likes: number;
  commentsCount: number;
  createdAt: string;
  liked?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  username: string;
  userAvatar: string;
  content: string;
  createdAt: string;
}

export interface PostDetail extends Post {
  comments: Comment[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "study" | "social" | "streak" | "mastery";
  requirement: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  studyTime: number;
  coursesCompleted: number;
  wordsLearned: number;
}

export const api = {
  auth: {
    register: (data: {
      email: string;
      password: string;
      username: string;
    }) =>
      request<AuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    login: (data: { email: string; password: string }) =>
      request<AuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    me: () => request<AuthResponse["user"]>("/auth/me"),
  },

  courses: {
    list: (params?: { language?: string; level?: string }) => {
      const searchParams = new URLSearchParams();
      if (params?.language) searchParams.set("language", params.language);
      if (params?.level) searchParams.set("level", params.level);
      const query = searchParams.toString();
      return request<Course[]>(`/courses${query ? `?${query}` : ""}`);
    },

    detail: (id: string) => request<Course>(`/courses/${id}`),

    lessons: (courseId: string) =>
      request<Lesson[]>(`/courses/${courseId}/lessons`),
  },

  progress: {
    get: () => request<UserProgress>("/progress"),

    submitLesson: (result: LessonResult) =>
      request<{ success: boolean }>("/progress/lesson", {
        method: "POST",
        body: JSON.stringify(result),
      }),

    calendar: () => request<CalendarData>("/progress/calendar"),

    stats: () => request<ProgressStats>("/progress/stats"),
  },

  community: {
    posts: (languageTag?: string) => {
      const params = languageTag
        ? `?languageTag=${encodeURIComponent(languageTag)}`
        : "";
      return request<Post[]>(`/community/posts${params}`);
    },

    createPost: (data: {
      title: string;
      content: string;
      languageTag: string;
    }) =>
      request<Post>("/community/posts", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    postDetail: (id: string) =>
      request<PostDetail>(`/community/posts/${id}`),

    addComment: (postId: string, content: string) =>
      request<Comment>(`/community/posts/${postId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content }),
      }),

    likePost: (postId: string) =>
      request<{ liked: boolean; likes: number }>(
        `/community/posts/${postId}/like`,
        { method: "POST" }
      ),
  },

  achievements: {
    list: () => request<Achievement[]>("/achievements"),

    leaderboard: () => request<LeaderboardEntry[]>("/achievements/leaderboard"),
  },
};
