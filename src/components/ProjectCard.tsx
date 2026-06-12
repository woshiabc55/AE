import { Link } from 'react-router-dom';
import { Copy, Film, Trash2, MoreHorizontal } from 'lucide-react';
import type { Project } from '@/lib/types';
import { PROJECT_TYPE_LABELS } from '@/lib/types';
import { formatTimeAgo, totalDuration } from '@/lib/utils';
import { useStore } from '@/store/storyboardStore';

type Props = {
  project: Project;
};

export default function ProjectCard({ project }: Props) {
  const deleteProject = useStore((s) => s.deleteProject);
  const duplicateProject = useStore((s) => s.duplicateProject);
  const dur = totalDuration(project.panels);
  const panelsCount = project.panels.length;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group relative block card p-5 transition-all hover:-translate-y-0.5 hover:shadow-paper animate-slideUp"
    >
      {/* 左侧色条 */}
      <span
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ background: project.color }}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex-1 min-w-0">
          {/* 类型徽标 + 时间 */}
          <div className="flex items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-ink-400 uppercase">
            <span style={{ color: project.color }}>{PROJECT_TYPE_LABELS[project.type]}</span>
            <span className="text-ink-400/40">·</span>
            <span>{formatTimeAgo(project.updatedAt)}</span>
          </div>

          {/* 标题 */}
          <h3 className="serif text-2xl font-semibold text-ink-900 mt-1.5 leading-tight truncate group-hover:underline decoration-1 underline-offset-4">
            {project.title}
          </h3>

          {/* 描述 */}
          {project.description && (
            <p className="text-sm text-ink-500 mt-1.5 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* 统计 */}
          <div className="flex items-center gap-4 mt-3 text-xs text-ink-500">
            <span className="flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5" />
              <span className="num">{panelsCount}</span>
              <span>镜</span>
            </span>
            <span className="text-ink-400/40">·</span>
            <span className="num">
              {Math.floor(dur / 60)
                .toString()
                .padStart(2, '0')}
              :{(dur % 60).toString().padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* 装饰编号 */}
        <div
          className="serif italic text-4xl font-light leading-none -mt-1 select-none"
          style={{ color: project.color, opacity: 0.18 }}
        >
          №{String(project.panels.length).padStart(2, '0')}
        </div>
      </div>

      {/* 底部操作条 */}
      <div
        className="mt-4 pl-2 pt-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-1 text-xs">
          <ActionButton
            onClick={() => {
              if (confirm(`确定要删除「${project.title}」?`)) deleteProject(project.id);
            }}
            title="删除"
            danger
          >
            <Trash2 className="w-3.5 h-3.5" />
          </ActionButton>
          <ActionButton
            onClick={() => duplicateProject(project.id)}
            title="复制"
          >
            <Copy className="w-3.5 h-3.5" />
          </ActionButton>
        </div>
        <span className="text-[10px] font-mono tracking-[0.2em] text-ink-400 uppercase">
          {project.id.slice(0, 6)}
        </span>
      </div>
    </Link>
  );
}

function ActionButton({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={[
        'inline-flex items-center justify-center w-7 h-7 rounded-sm border transition-colors',
        danger
          ? 'border-ink-900/15 text-ink-500 hover:bg-oxblood-500 hover:border-oxblood-500 hover:text-white'
          : 'border-ink-900/15 text-ink-500 hover:bg-ink-900 hover:border-ink-900 hover:text-paper-50',
      ].join(' ')}
    >
      {children}
    </button>
  );
}
