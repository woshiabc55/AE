// 我的剧库
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Folder, FolderPlus, FileText, Search, MoreHorizontal, Edit3, Trash2, Copy, ExternalLink,
  Plus, Library as LibraryIcon, Sparkles, ChevronRight, Heart, Star, Clock, ArrowUpRight,
} from 'lucide-react';
import { Button, Input, SearchInput, CoverArt, CategoryTag, Badge, EmptyState, Modal } from '../components/ui';
import { TemplateService } from '../services/template';
import { useApp } from '../store/useApp';
import { FOLDERS_SEED } from '../data/templates.seed';
import { formatRelative, formatDate, compactNumber } from '../lib/utils';
import type { Template, Folder as FolderT } from '../types';
import { cn } from '../lib/utils';

type Tab = 'mine' | 'favorites' | 'recent';

export default function Library() {
  const nav = useNavigate();
  const [params, setParams] = useSearchParams();
  const { user, pushToast } = useApp();
  const [tab, setTab] = useState<Tab>('mine');
  const [search, setSearch] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [favorites, setFavorites] = useState<Template[]>([]);
  const [folders, setFolders] = useState<FolderT[]>([]);
  const [activeFolder, setActiveFolder] = useState<string | null>(null);
  const [stats, setStats] = useState({ total: 0, thisMonth: 0, drafts: 0 });
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  useEffect(() => {
    if (!user) {
      setTemplates([]);
      return;
    }
    TemplateService.list().then((all) => {
      // 我的：从所有模板中筛出"非系统种子"或当前用户作者
      const mine = all.filter((t) => t.author.id === user.id);
      setTemplates(mine);
      setStats({
        total: mine.length,
        thisMonth: mine.filter((t) => {
          const d = new Date(t.createdAt);
          const now = new Date();
          return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        }).length,
        drafts: mine.length, // 演示里所有私有都算草稿
      });
    });
    TemplateService.list().then((all) => {
      // 收藏：取收藏列表
      const favs = JSON.parse(localStorage.getItem('ps_favorites_v1') ?? '[]') as string[];
      setFavorites(all.filter((t) => favs.includes(t.id)));
    });
    TemplateService.listFolders(user.id).then(setFolders);
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-5 lg:px-8 py-24">
        <div className="rounded-[16px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-10 text-center">
          <LibraryIcon size={32} className="text-[var(--amber-2)] mx-auto mb-4" />
          <h2 className="display text-3xl text-[var(--paper-0)] mb-3">登录后开启你的剧库</h2>
          <p className="text-[14px] text-[var(--paper-2)] mb-6">云端保存、跨设备同步、收藏管理…都在这里。</p>
          <div className="flex items-center justify-center gap-3">
            <Button variant="primary" onClick={() => nav('/login')}>登录 / 注册</Button>
            <Button variant="outline-amber" onClick={() => useApp.getState().loginDemo()}>先用演示账号</Button>
          </div>
        </div>
      </div>
    );
  }

  const filtered = (() => {
    if (tab === 'favorites') return favorites;
    if (tab === 'recent') return [...templates].sort((a, b) => +new Date(b.updatedAt) - +new Date(a.updatedAt));
    if (activeFolder) return templates.filter((t) => (t.folderId ?? 'f_default') === activeFolder);
    return templates;
  })().filter((t) => !search || t.title.toLowerCase().includes(search.toLowerCase()));

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    const f = await TemplateService.createFolder(newFolderName.trim(), user.id, activeFolder ?? 'f_default');
    setFolders((prev) => [...prev, f]);
    setNewFolderOpen(false);
    setNewFolderName('');
    pushToast({ kind: 'success', message: `已创建文件夹：${f.name}` });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-5 lg:px-8 py-10">
      <div className="grid lg:grid-cols-12 gap-8">
        {/* 左：文件夹树 */}
        <aside className="lg:col-span-3">
          <div className="rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-4 sticky top-20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="eyebrow text-[10px]">FOLDERS · 文件夹</h3>
              <button
                onClick={() => setNewFolderOpen(true)}
                className="w-6 h-6 inline-flex items-center justify-center rounded text-[var(--paper-3)] hover:text-[var(--amber-1)] hover:bg-[var(--ink-3)]"
              >
                <FolderPlus size={13} />
              </button>
            </div>
            <div className="space-y-0.5">
              <FolderItem icon={<LibraryIcon size={13} />} label="全部剧目" count={templates.length} active={!activeFolder} onClick={() => setActiveFolder(null)} />
              {folders.map((f) => {
                const count = templates.filter((t) => (t.folderId ?? 'f_default') === f.id).length;
                return (
                  <FolderItem
                    key={f.id}
                    icon={<Folder size={13} />}
                    label={f.name}
                    count={count}
                    active={activeFolder === f.id}
                    onClick={() => setActiveFolder(f.id)}
                  />
                );
              })}
            </div>
            <div className="hairline my-4" />
            <div className="space-y-0.5">
              <FolderItem icon={<Heart size={13} />} label="我的收藏" count={favorites.length} active={false} onClick={() => setTab('favorites')} accent />
              <FolderItem icon={<Clock size={13} />} label="最近编辑" count={templates.length} active={tab === 'recent'} onClick={() => setTab('recent')} />
              <FolderItem icon={<Trash2 size={13} />} label="回收站" count={0} active={false} onClick={() => pushToast({ kind: 'info', message: '回收站功能即将上线' })} />
            </div>
          </div>
        </aside>

        {/* 右：内容 */}
        <div className="lg:col-span-9 space-y-6">
          {/* 顶部统计 */}
          <div className="rounded-[12px] bg-[var(--ink-2)] border border-[var(--ink-4)] p-6">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <div className="eyebrow eyebrow-amber mb-2">MY LIBRARY · 我的剧库</div>
                <h1 className="display text-3xl lg:text-4xl text-[var(--paper-0)]">{user.name} 的剧目库</h1>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="secondary" icon={<Sparkles size={14} />} onClick={() => nav('/gallery')}>浏览展厅</Button>
                <Button variant="primary" icon={<Plus size={14} />} onClick={() => nav('/editor')}>新建模板</Button>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <StatBox label="剧目总数" value={stats.total} icon={<FileText size={14} />} />
              <StatBox label="本月新增" value={stats.thisMonth} icon={<Plus size={14} />} />
              <StatBox label="收藏" value={favorites.length} icon={<Heart size={14} />} />
            </div>
          </div>

          {/* Tab + 搜索 */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1 border-b border-[var(--ink-4)]">
              {[
                { k: 'mine' as const, l: '我的剧目', n: templates.length },
                { k: 'favorites' as const, l: '收藏', n: favorites.length },
                { k: 'recent' as const, l: '最近', n: templates.length },
              ].map((t) => (
                <button
                  key={t.k}
                  onClick={() => { setTab(t.k); setActiveFolder(null); }}
                  className={cn(
                    'px-4 h-10 text-[13px] font-medium relative',
                    tab === t.k ? 'text-[var(--paper-0)]' : 'text-[var(--paper-2)] hover:text-[var(--paper-0)]'
                  )}
                >
                  {t.l}
                  <span className="ml-1.5 mono text-[10px] text-[var(--paper-3)]">{t.n}</span>
                  {tab === t.k && <div className="absolute left-3 right-3 -bottom-px h-0.5 bg-[var(--amber-2)]" />}
                </button>
              ))}
            </div>
            <SearchInput value={search} onChange={setSearch} placeholder="搜索我的剧目…" />
          </div>

          {/* 网格 */}
          {filtered.length === 0 ? (
            <EmptyState
              title={tab === 'favorites' ? '还没有收藏' : tab === 'recent' ? '暂无最近编辑' : '空空如也'}
              hint={tab === 'mine' ? '从展厅挑选一个模板，或从零搭建你的第一个剧目' : undefined}
              icon={<FileText size={24} />}
              action={tab === 'mine' && <Button variant="primary" onClick={() => nav('/editor')}>从零搭建</Button>}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((t, i) => (
                <motion.article
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ y: -3 }}
                  onClick={() => nav(`/editor/${t.id}`)}
                  className="group rounded-[10px] bg-[var(--ink-2)] border border-[var(--ink-4)] overflow-hidden card-hover cursor-pointer"
                >
                  <div className="relative">
                    <CoverArt seed={t.cover} category={t.category} size="sm" />
                    <div className="absolute top-2 right-2 w-7 h-7 inline-flex items-center justify-center rounded-[5px] bg-[rgba(11,11,15,0.7)] backdrop-blur-sm text-[var(--paper-1)] opacity-0 group-hover:opacity-100 transition-opacity">
                      <Edit3 size={12} />
                    </div>
                  </div>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <CategoryTag category={t.category} withDot={false} />
                    </div>
                    <h3 className="display text-[14px] text-[var(--paper-0)] line-clamp-2 group-hover:text-[var(--amber-1)] transition-colors">
                      {t.title}
                    </h3>
                    <p className="text-[11px] text-[var(--paper-3)] line-clamp-1">{t.description || '暂无描述'}</p>
                    <div className="flex items-center justify-between pt-1 text-[10px] text-[var(--paper-3)] mono">
                      <span>{formatRelative(t.updatedAt)}</span>
                      <span>{t.variables.length} 变量</span>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal open={newFolderOpen} onClose={() => setNewFolderOpen(false)} title="新建文件夹">
        <div className="space-y-4">
          <Input
            label="文件夹名称"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="如: 双 11 备战"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setNewFolderOpen(false)}>取消</Button>
            <Button variant="primary" onClick={handleCreateFolder}>创建</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function FolderItem({ icon, label, count, active = false, onClick, accent }: { icon: React.ReactNode; label: string; count: number; active?: boolean; onClick: () => void; accent?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[12px] transition-colors text-left',
        active
          ? 'bg-[var(--ink-3)] text-[var(--paper-0)]'
          : 'text-[var(--paper-2)] hover:text-[var(--paper-0)] hover:bg-[var(--ink-3)]',
        accent && !active && 'text-[var(--amber-1)] hover:text-[var(--amber-1)]'
      )}
    >
      <span className={cn(active ? 'text-[var(--amber-2)]' : 'text-[var(--paper-3)]')}>{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {count > 0 && <span className="mono text-[10px] text-[var(--paper-3)]">{count}</span>}
    </button>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="rounded-[8px] bg-[var(--ink-3)] border border-[var(--ink-4)] p-4">
      <div className="flex items-center gap-2 text-[var(--paper-3)] mb-2">
        {icon}
        <span className="text-[10px] tracking-wider uppercase">{label}</span>
      </div>
      <div className="mono text-2xl text-[var(--paper-0)] tabular-nums">{value}</div>
    </div>
  );
}
