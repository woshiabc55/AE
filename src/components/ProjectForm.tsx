import { useEffect, useRef, useState } from 'react';
import { X, Plus } from 'lucide-react';
import type { ProjectType } from '@/lib/types';
import { PROJECT_TYPE_LABELS, PROJECT_TYPE_COLORS } from '@/lib/types';

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (input: { title: string; type: ProjectType; description: string; color: string }) => void;
};

const TYPES: ProjectType[] = ['short-film', 'commercial', 'animation', 'doc', 'social'];

export default function ProjectForm({ open, onClose, onCreate }: Props) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ProjectType>('short-film');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState(PROJECT_TYPE_COLORS['short-film']);
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTitle('');
      setDescription('');
      setType('short-film');
      setColor(PROJECT_TYPE_COLORS['short-film']);
      setTimeout(() => ref.current?.focus(), 200);
    }
  }, [open]);

  useEffect(() => {
    setColor(PROJECT_TYPE_COLORS[type]);
  }, [type]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 backdrop-blur-sm animate-fadeIn" onClick={onClose}>
      <div
        className="card w-[min(520px,92vw)] p-8 animate-popIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="text-[10px] font-mono tracking-[0.3em] text-ink-400 uppercase">NEW PROJECT</div>
            <h2 className="serif text-3xl font-semibold text-ink-900 mt-1">开一个新本子</h2>
          </div>
          <button
            onClick={onClose}
            className="text-ink-500 hover:text-ink-900 transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <Field label="项目名">
            <input
              ref={ref}
              className="input-ink"
              placeholder="例如:都市夜行 — 30 秒短片"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={60}
            />
          </Field>

          <Field label="类型">
            <div className="grid grid-cols-5 gap-2">
              {TYPES.map((t) => {
                const c = PROJECT_TYPE_COLORS[t];
                const active = t === type;
                return (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    className={[
                      'flex flex-col items-center gap-1 py-2.5 rounded-sm border transition-all text-xs font-mono tracking-wider',
                      active
                        ? 'border-ink-900 shadow-ink'
                        : 'border-ink-900/15 hover:border-ink-900/40',
                    ].join(' ')}
                    style={active ? { background: c, color: '#FBF8F1' } : { color: c }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: active ? '#FBF8F1' : c }}
                    />
                    {PROJECT_TYPE_LABELS[t]}
                  </button>
                );
              })}
            </div>
          </Field>

          <Field label="简介(可选)">
            <textarea
              className="input-ink"
              placeholder="一两句话,这个本子要讲什么?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={200}
            />
          </Field>
        </div>

        <div className="mt-7 flex items-center justify-end gap-3">
          <button className="btn-outline" onClick={onClose}>
            取消
          </button>
          <button
            className="btn-ink"
            disabled={!title.trim()}
            onClick={() => {
              onCreate({ title: title.trim(), type, description: description.trim(), color });
              onClose();
            }}
          >
            <Plus className="w-4 h-4" /> 开本
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] font-mono tracking-[0.25em] text-ink-400 uppercase mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}
