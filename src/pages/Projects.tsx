import { useRef, useState } from 'react';
import { Plus, Search, Sun, Moon, Download, Upload, Sparkles } from 'lucide-react';
import { useStore } from '@/store/storyboardStore';
import ProjectCard from '@/components/ProjectCard';
import ProjectForm from '@/components/ProjectForm';
import { downloadJson } from '@/lib/utils';

export default function Projects() {
  const projects = useStore((s) => s.projects);
  const createProject = useStore((s) => s.createProject);
  const importFromJson = useStore((s) => s.importFromJson);
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  const exportToJson = useStore((s) => s.exportToJson);
  const [showForm, setShowForm] = useState(false);
  const [query, setQuery] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? projects.filter(
        (p) =>
          p.title.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : projects;

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <div className="notebook-bg min-h-full">
        <div className="max-w-5xl mx-auto px-8 py-10">
          {/* 顶部条 */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-sm flex items-center justify-center"
                style={{ background: '#1A1814' }}
              >
                <Sparkles className="w-4 h-4 text-amber2-400" strokeWidth={1.5} />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-[0.4em] text-ink-400 uppercase">
                  STORYBOARDER · 分镜师
                </div>
                <h1 className="serif text-2xl font-semibold text-ink-900 leading-none mt-0.5">
                  笔记本
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <IconButton
                title={theme === 'cream' ? '切换至暗夜模式' : '切换至纸质模式'}
                onClick={() => setTheme(theme === 'cream' ? 'midnight' : 'cream')}
              >
                {theme === 'cream' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              </IconButton>
              <IconButton
                title="导出全部 JSON"
                onClick={() => downloadJson(`storyboards-${Date.now()}.json`, JSON.parse(exportToJson()))}
              >
                <Download className="w-4 h-4" />
              </IconButton>
              <IconButton title="导入 JSON" onClick={() => fileRef.current?.click()}>
                <Upload className="w-4 h-4" />
              </IconButton>
              <input
                ref={fileRef}
                type="file"
                accept="application/json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    importFromJson(data);
                  } catch (err) {
                    alert('文件格式不正确');
                  }
                  e.target.value = '';
                }}
              />
            </div>
          </div>

          {/* 大标题 */}
          <div className="mt-10 mb-2 flex items-end gap-3">
            <h2 className="serif text-6xl md:text-7xl font-black text-ink-900 leading-[0.9] tracking-tight">
              你的<br />
              <span className="italic font-light">分镜本</span>
            </h2>
            <div className="mb-2 flex-1 h-px bg-ink-900/30 relative">
              <span
                className="absolute -top-1 left-0 w-2 h-2 rounded-full"
                style={{ background: '#7A1F1F' }}
              />
            </div>
          </div>
          <p className="serif italic text-ink-500 text-lg">
            把一闪而过的画面,落笔为一份可以给团队看的脚本。
          </p>

          {/* 操作条 */}
          <div className="mt-8 flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="按标题或简介搜索..."
                className="input-ink pl-9"
              />
            </div>
            <button
              className="btn-ink whitespace-nowrap"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" /> 开一个新本
            </button>
          </div>

          {/* 项目列表 */}
          <div className="mt-6">
            {filtered.length === 0 ? (
              <EmptyState onCreate={() => setShowForm(true)} hasQuery={!!query} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filtered.map((p, i) => (
                  <div
                    key={p.id}
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <ProjectCard project={p} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-16 text-center text-[10px] font-mono tracking-[0.3em] text-ink-400 uppercase">
            FRAME BY FRAME · 一镜一世界
          </div>
        </div>
      </div>

      <ProjectForm
        open={showForm}
        onClose={() => setShowForm(false)}
        onCreate={(input) => createProject(input)}
      />
    </div>
  );
}

function IconButton({
  children,
  onClick,
  title,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-9 h-9 rounded-sm border border-ink-900/15 hover:border-ink-900 hover:bg-ink-900 hover:text-paper-50 text-ink-700 flex items-center justify-center transition-colors"
    >
      {children}
    </button>
  );
}

function EmptyState({ onCreate, hasQuery }: { onCreate: () => void; hasQuery: boolean }) {
  return (
    <div className="card p-12 text-center animate-fadeIn">
      <svg
        viewBox="0 0 200 140"
        className="mx-auto mb-4 w-44 h-32 text-ink-900"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* 手绘笔记本 */}
        <path d="M30 20 L170 20 L170 120 L130 120 L130 130 L120 120 L30 120 Z" strokeOpacity="0.7" />
        <path d="M40 35 L160 35" strokeOpacity="0.3" />
        <path d="M40 50 L120 50" strokeOpacity="0.3" />
        <path d="M40 65 L150 65" strokeOpacity="0.3" />
        <path d="M40 80 L100 80" strokeOpacity="0.3" />
        <path d="M40 95 L130 95" strokeOpacity="0.3" />
        {/* 铅笔 */}
        <path d="M150 100 L185 65 L195 75 L160 110 Z" strokeOpacity="0.85" />
        <path d="M155 105 L190 70" strokeOpacity="0.85" />
        <path d="M160 110 L158 113 L161 113 L163 110" strokeOpacity="0.85" />
        {/* 装订线 */}
        <line x1="20" y1="20" x2="20" y2="120" strokeDasharray="2 3" strokeOpacity="0.5" />
      </svg>
      <h3 className="serif text-2xl font-semibold text-ink-900">
        {hasQuery ? '没找到相关的本子' : '本子还空着'}
      </h3>
      <p className="text-sm text-ink-500 mt-1.5">
        {hasQuery ? '换个关键词,或者开一个新的。' : '从第一个项目开始,把你的故事勾出来。'}
      </p>
      <button onClick={onCreate} className="btn-ink mt-5">
        <Plus className="w-4 h-4" /> {hasQuery ? '开新本' : '开本'}
      </button>
    </div>
  );
}
