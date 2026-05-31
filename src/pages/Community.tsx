import { useState } from 'react';
import { communityPosts, communityTopics } from '@/data/community';
import { LANGUAGE_CONFIG, type Language } from '@/types';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Clock, Tag, Send, Users, Search, UserPlus } from 'lucide-react';

type Tab = 'posts' | 'topics' | 'partners';

const TABS: { key: Tab; label: string; icon: typeof Users }[] = [
  { key: 'posts', label: '动态', icon: MessageCircle },
  { key: 'topics', label: '话题', icon: Tag },
  { key: 'partners', label: '伙伴', icon: Users },
];

const PARTNERS = [
  { id: 'p1', avatar: '👩‍🎓', name: 'Emily', language: 'en' as Language, level: 'B2', streak: 32 },
  { id: 'p2', avatar: '🧑‍🏫', name: '田中太郎', language: 'ja' as Language, level: 'A2', streak: 18 },
  { id: 'p3', avatar: '👩‍💼', name: '수진', language: 'ko' as Language, level: 'B1', streak: 45 },
  { id: 'p4', avatar: '🧑‍🔬', name: 'Alex', language: 'en' as Language, level: 'C1', streak: 60 },
];

const cardVar = { hidden: { opacity: 0, y: 20 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4 } }) };

const formatTime = (iso: string) => {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 60) return `${mins}分钟前`;
  const hrs = Math.floor(mins / 60);
  return hrs < 24 ? `${hrs}小时前` : `${Math.floor(hrs / 24)}天前`;
};

export default function Community() {
  const { user, currentLanguage } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('posts');
  const [posts, setPosts] = useState(communityPosts);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [matchedIds, setMatchedIds] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const toggleLike = (id: string) => setLikedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const handlePost = () => {
    if (!newContent.trim()) return;
    setPosts([{ id: `post-${Date.now()}`, userId: user?.id || 'user-01', userName: user?.name || '我', userAvatar: user?.avatar || '🧑‍💻', content: newContent.trim(), language: currentLanguage, likes: 0, comments: 0, createdAt: new Date().toISOString(), tags: [LANGUAGE_CONFIG[currentLanguage].name] }, ...posts]);
    setNewContent('');
    setShowForm(false);
  };

  const filteredPosts = selectedTopic ? posts.filter((p) => p.language === communityTopics.find((t) => t.id === selectedTopic)?.language) : posts;

  return (
    <div className="min-h-screen p-6 space-y-6" style={{ background: '#1A1F36', fontFamily: 'Noto Sans SC, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>社区广场</h1>
        <p className="mt-1 text-sm" style={{ color: '#94A3B8' }}>与全球语言学习者交流</p>
      </motion.div>

      <div className="flex gap-2">
        {TABS.map((tab) => (
          <button key={tab.key} onClick={() => { setActiveTab(tab.key); setSelectedTopic(null); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
            style={{ background: activeTab === tab.key ? '#FF6B4A' : '#2A3058', color: activeTab === tab.key ? '#fff' : '#94A3B8', border: `1px solid ${activeTab === tab.key ? '#FF6B4A' : '#3A4070'}` }}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'posts' && (
          <motion.div key="posts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white flex items-center gap-2" style={{ background: '#FF6B4A' }}>
                <Send size={14} /> 发布动态
              </button>
              {selectedTopic && (
                <span className="text-xs px-3 py-1 rounded-full" style={{ background: '#232847', color: '#4ECDC4', border: '1px solid #3A4070' }}>
                  筛选: {communityTopics.find((t) => t.id === selectedTopic)?.title}
                  <button onClick={() => setSelectedTopic(null)} className="ml-2 hover:text-white">×</button>
                </span>
              )}
            </div>
            <AnimatePresence>
              {showForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                  <div className="rounded-xl p-4 space-y-3" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
                    <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} placeholder="分享你的学习心得..." className="w-full bg-transparent text-white text-sm resize-none outline-none placeholder-slate-500" rows={3} />
                    <div className="flex justify-end">
                      <button onClick={handlePost} className="px-4 py-1.5 rounded-lg text-sm font-semibold text-white" style={{ background: '#4ECDC4' }}>发送</button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {filteredPosts.map((post, i) => {
              const liked = likedIds.has(post.id);
              const langCfg = LANGUAGE_CONFIG[post.language];
              return (
                <motion.div key={post.id} custom={i} variants={cardVar} initial="hidden" animate="visible"
                  className="rounded-xl p-4 space-y-3" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{post.userAvatar}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{post.userName}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: langCfg.bgColor, color: langCfg.color }}>{langCfg.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><Clock size={10} /> {formatTime(post.createdAt)}</div>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#CBD5E1' }}>{post.content}</p>
                  <div className="flex items-center gap-4">
                    <button onClick={() => toggleLike(post.id)} className="flex items-center gap-1 text-xs transition-colors" style={{ color: liked ? '#FF6B4A' : '#64748B' }}>
                      <Heart size={14} fill={liked ? '#FF6B4A' : 'none'} /> {post.likes + (liked ? 1 : 0)}
                    </button>
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#64748B' }}><MessageCircle size={14} /> {post.comments}</span>
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-0.5 rounded-full" style={{ background: '#232847', color: '#94A3B8' }}><Tag size={8} className="inline mr-1" />{tag}</span>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'topics' && (
          <motion.div key="topics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
            {communityTopics.map((topic, i) => {
              const langCfg = LANGUAGE_CONFIG[topic.language];
              return (
                <motion.div key={topic.id} custom={i} variants={cardVar} initial="hidden" animate="visible"
                  onClick={() => { setSelectedTopic(topic.id); setActiveTab('posts'); }}
                  className="rounded-xl p-4 cursor-pointer transition-transform hover:scale-[1.01]"
                  style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs px-2.5 py-1 rounded-full font-semibold" style={{ background: langCfg.bgColor, color: langCfg.color }}>{langCfg.nativeName}</span>
                      <span className="text-sm font-semibold text-white">{topic.title}</span>
                    </div>
                    <Search size={14} style={{ color: '#64748B' }} />
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-xs" style={{ color: '#64748B' }}>
                    <span className="flex items-center gap-1"><MessageCircle size={10} /> {topic.postsCount} 帖子</span>
                    <span className="flex items-center gap-1"><Clock size={10} /> {formatTime(topic.lastActive)}</span>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {activeTab === 'partners' && (
          <motion.div key="partners" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="rounded-xl p-4" style={{ background: '#2A3058', border: '1px solid #3A4070' }}>
              <div className="flex items-center gap-2 mb-1">
                <UserPlus size={18} style={{ color: '#4ECDC4' }} />
                <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>寻找学习伙伴</h2>
              </div>
              <p className="text-xs" style={{ color: '#94A3B8' }}>根据你的学习语言和水平，为你推荐最佳搭档</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PARTNERS.map((partner, i) => {
                const matched = matchedIds.has(partner.id);
                const langCfg = LANGUAGE_CONFIG[partner.language];
                return (
                  <motion.div key={partner.id} custom={i} variants={cardVar} initial="hidden" animate="visible"
                    className="rounded-xl p-4" style={{ background: '#2A3058', border: `1px solid ${matched ? '#4ECDC4' : '#3A4070'}` }}>
                    <div className="flex items-center gap-3">
                      <motion.span className="text-3xl" animate={matched ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : {}} transition={{ duration: 0.5 }}>
                        {partner.avatar}
                      </motion.span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-white">{partner.name}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: langCfg.bgColor, color: langCfg.color }}>{langCfg.name}</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs" style={{ color: '#64748B' }}>
                          <span>Level {partner.level}</span>
                          <span className="flex items-center gap-1" style={{ color: '#FF6B4A' }}>🔥 {partner.streak}天</span>
                        </div>
                      </div>
                      <motion.button onClick={() => setMatchedIds((prev) => new Set(prev).add(partner.id))} whileTap={{ scale: 0.9 }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: matched ? '#4ECDC4' : '#FF6B4A', color: '#fff' }}>
                        {matched ? '✓ 已打招呼' : '打招呼'}
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
