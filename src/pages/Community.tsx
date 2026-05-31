import { useEffect, useState } from "react";
import { Heart, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { useCommunityStore } from "@/store/communityStore";
import type { Post } from "@/lib/api";

const avatarColors = ["bg-primary", "bg-accent", "bg-coral", "bg-primary-300", "bg-accent-300", "bg-coral-300"];

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  return `${days}天前`;
}

function LanguageTag({ tag }: { tag: string }) {
  const colors: Record<string, string> = {
    en: "bg-primary-50 text-primary",
    ja: "bg-coral-50 text-coral",
    ko: "bg-accent-50 text-accent-600",
  };
  return (
    <span className={`rounded-pill px-2.5 py-0.5 text-xs font-medium ${colors[tag] ?? "bg-gray-100 text-gray-600"}`}>
      {tag.toUpperCase()}
    </span>
  );
}

function CreatePostCard() {
  const { createPost } = useCommunityStore();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [languageTag, setLanguageTag] = useState("en");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    await createPost({ title: title.trim(), content: content.trim(), languageTag });
    setTitle("");
    setContent("");
    setIsExpanded(false);
  };

  return (
    <div className="card mb-4">
      <textarea
        className="w-full resize-none rounded-lg border border-gray-200 bg-surface p-3 text-sm font-body placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        placeholder="分享你的学习心得..."
        rows={2}
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          if (e.target.value && !isExpanded) setIsExpanded(true);
        }}
        onFocus={() => setIsExpanded(true)}
      />
      {isExpanded && (
        <div className="mt-3 animate-fadeIn">
          <input
            className="w-full rounded-lg border border-gray-200 bg-surface p-3 text-sm font-body placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="mt-3 flex items-center justify-between">
            <select
              className="rounded-pill border border-gray-200 bg-surface px-3 py-1.5 text-sm text-gray-600 focus:border-primary focus:outline-none"
              value={languageTag}
              onChange={(e) => setLanguageTag(e.target.value)}
            >
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
            </select>
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim()}
              className="btn-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              发布
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PostCard({ post, onExpand }: { post: Post; onExpand: () => void }) {
  const { likePost } = useCommunityStore();
  const [expanded, setExpanded] = useState(false);
  const isLong = post.content.length > 120;

  return (
    <div className="card mb-3">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(post.username)}`}>
          {post.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">{post.username}</p>
          <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
        </div>
        <LanguageTag tag={post.languageTag} />
      </div>
      <h3 className="font-display text-base font-semibold text-primary mb-1">{post.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {isLong && !expanded ? post.content.slice(0, 120) + "..." : post.content}
      </p>
      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-1 flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-600"
        >
          {expanded ? <>收起 <ChevronUp size={14} /></> : <>展开 <ChevronDown size={14} /></>}
        </button>
      )}
      <div className="mt-3 flex items-center gap-4 border-t border-gray-100 pt-3">
        <button
          onClick={() => likePost(post.id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${post.liked ? "text-coral" : "text-gray-400 hover:text-coral"}`}
        >
          <Heart size={16} fill={post.liked ? "currentColor" : "none"} />
          <span>{post.likes}</span>
        </button>
        <button
          onClick={onExpand}
          className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-primary transition-colors"
        >
          <MessageCircle size={16} />
          <span>{post.commentsCount}</span>
        </button>
      </div>
    </div>
  );
}

function PostDetailView({ postId, onClose }: { postId: string; onClose: () => void }) {
  const { currentPost, fetchPostDetail, addComment, likePost, isLoading } = useCommunityStore();
  const [comment, setComment] = useState("");

  useEffect(() => {
    fetchPostDetail(postId);
  }, [postId, fetchPostDetail]);

  const handleComment = async () => {
    if (!comment.trim()) return;
    await addComment(postId, comment.trim());
    setComment("");
  };

  if (isLoading || !currentPost) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 w-48 rounded bg-gray-200 mb-4" />
        <div className="h-4 w-full rounded bg-gray-100 mb-2" />
        <div className="h-4 w-3/4 rounded bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="card animate-fadeIn">
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white ${getAvatarColor(currentPost.username)}`}>
          {currentPost.username.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary">{currentPost.username}</p>
          <p className="text-xs text-gray-400">{timeAgo(currentPost.createdAt)}</p>
        </div>
        <LanguageTag tag={currentPost.languageTag} />
        <button onClick={onClose} className="text-gray-400 hover:text-primary text-sm">✕</button>
      </div>
      <h3 className="font-display text-lg font-semibold text-primary mb-2">{currentPost.title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{currentPost.content}</p>
      <div className="flex items-center gap-4 border-t border-gray-100 pt-3 mb-4">
        <button
          onClick={() => likePost(currentPost.id)}
          className={`flex items-center gap-1.5 text-sm transition-colors ${currentPost.liked ? "text-coral" : "text-gray-400 hover:text-coral"}`}
        >
          <Heart size={16} fill={currentPost.liked ? "currentColor" : "none"} />
          <span>{currentPost.likes}</span>
        </button>
        <div className="flex items-center gap-1.5 text-sm text-gray-400">
          <MessageCircle size={16} />
          <span>{currentPost.commentsCount}</span>
        </div>
      </div>
      <div className="space-y-3 mb-4">
        {currentPost.comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(c.username)}`}>
              {c.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 rounded-lg bg-surface p-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-primary">{c.username}</span>
                <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-600">{c.content}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 rounded-pill border border-gray-200 bg-surface px-4 py-2 text-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          placeholder="写评论..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
        />
        <button
          onClick={handleComment}
          disabled={!comment.trim()}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white disabled:opacity-40 hover:bg-primary-600 transition-colors"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}

function Sidebar({ activeFilter, onFilterChange }: { activeFilter: string; onFilterChange: (f: string) => void }) {
  const hotTopics = ["日语N2备考经验", "韩语发音技巧", "英语口语练习方法", "单词记忆法分享", "语法难点讨论"];
  const activeLearners = ["小明", "Yuki", "Jisoo", "Alex", "花子", "Minho", "Sarah", "健太"];

  return (
    <div className="space-y-4">
      <div className="card">
        <h3 className="font-display text-base font-semibold text-primary mb-3">语言筛选</h3>
        <div className="flex flex-wrap gap-2">
          {["all", "en", "ja", "ko"].map((tag) => (
            <button
              key={tag}
              onClick={() => onFilterChange(tag)}
              className={`rounded-pill px-4 py-1.5 text-sm font-medium transition-all ${
                activeFilter === tag
                  ? "bg-primary text-white shadow-card"
                  : "bg-surface text-gray-500 hover:bg-mint hover:text-primary"
              }`}
            >
              {tag === "all" ? "全部" : tag.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div className="card">
        <h3 className="font-display text-base font-semibold text-primary mb-3">热门话题</h3>
        <ul className="space-y-2">
          {hotTopics.map((topic, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary cursor-pointer transition-colors">
              <span className={`flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold ${i < 3 ? "bg-accent text-primary" : "bg-gray-100 text-gray-400"}`}>
                {i + 1}
              </span>
              {topic}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3 className="font-display text-base font-semibold text-primary mb-3">活跃学习者</h3>
        <div className="flex flex-wrap gap-2">
          {activeLearners.map((name) => (
            <div
              key={name}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white ${getAvatarColor(name)} cursor-pointer transition-transform hover:scale-110`}
              title={name}
            >
              {name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const { posts, fetchPosts, isLoading } = useCommunityStore();
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts(activeFilter === "all" ? undefined : activeFilter);
  }, [activeFilter, fetchPosts]);

  return (
    <div className="p-8 animate-fadeIn">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-primary">社区</h1>
        <p className="text-sm text-gray-500 mt-1">与全球语言学习者交流互动</p>
      </div>

      <div className="flex gap-6">
        <div className="flex-1 min-w-0">
          <CreatePostCard />
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-gray-200" />
                    <div className="h-4 w-24 rounded bg-gray-200" />
                  </div>
                  <div className="h-4 w-3/4 rounded bg-gray-100 mb-2" />
                  <div className="h-4 w-full rounded bg-gray-100" />
                </div>
              ))}
            </div>
          ) : expandedPostId ? (
            <PostDetailView postId={expandedPostId} onClose={() => setExpandedPostId(null)} />
          ) : (
            <div className="space-y-0">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onExpand={() => setExpandedPostId(post.id)}
                />
              ))}
              {posts.length === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-400">暂无帖子，快来发布第一条吧！</p>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="w-80 flex-shrink-0">
          <Sidebar activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>
      </div>
    </div>
  );
}
