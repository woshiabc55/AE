import { useEffect, useState } from 'react';
import { listFrameworks, getFramework, deleteFramework } from '@/api';
import type { Workflow } from '@/types';
import { useStore } from '@/store';
import { Library as LibIcon, Trash2, Download, Upload, FileBox } from 'lucide-react';

interface FwItem {
  id: string;
  name: string;
  category?: string;
  updated_at: string;
}

export default function LibraryPage() {
  const [items, setItems] = useState<FwItem[]>([]);
  const [loading, setLoading] = useState(false);
  const setWorkflow = useStore((s) => s.setWorkflow);
  const appendLog = useStore((s) => s.appendLog);

  const refresh = async () => {
    setLoading(true);
    try {
      const r = await listFrameworks();
      setItems(r.frameworks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const loadOne = async (id: string) => {
    const w = (await getFramework(id)) as Workflow & { name: string; id: string; category?: string };
    setWorkflow({
      id: w.id,
      name: w.name,
      nodes: (w.nodes as any) || [],
      edges: (w.edges as any) || [],
    });
    appendLog({ level: 'info', message: `✔ 已加载框架「${w.name}」` });
    window.location.hash = '#/';
  };

  const del = async (id: string) => {
    if (!confirm('确认删除此框架?')) return;
    await deleteFramework(id);
    refresh();
  };

  const exportFw = (it: FwItem) => {
    alert(`导出 .ff 文件 (演示): ${it.name}`);
  };

  return (
    <div className="h-full p-6 overflow-y-auto scroll-fade">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-text-dim">
              // FRAMEWORK LIBRARY
            </div>
            <div className="text-2xl font-display font-semibold mt-1">框架库</div>
            <div className="text-[12px] text-text-secondary mt-1">
              工作流模板存放地 — 加载以快速复用,或保存当前工作流为新框架
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn">
              <Upload className="w-3.5 h-3.5" /> 导入 .ff
            </button>
            <button className="btn-primary" onClick={refresh}>
              <LibIcon className="w-3.5 h-3.5" /> 刷新
            </button>
          </div>
        </div>

        {loading && <div className="text-text-dim font-mono text-xs">// loading…</div>}

        {items.length === 0 && !loading && (
          <div className="panel rounded-md p-10 text-center">
            <FileBox className="w-8 h-8 text-text-dim mx-auto mb-2" />
            <div className="text-text-secondary text-sm">还没有任何框架</div>
            <div className="text-text-dim text-[11px] font-mono mt-1">
              在主画布搭建一个工作流,通过顶部菜单「保存为框架」即可入库
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 mt-4">
          {items.map((it) => (
            <div
              key={it.id}
              className="panel rounded-md p-3 hover:border-ink-500 transition-colors group"
            >
              <div className="flex items-start justify-between">
                <div className="min-w-0">
                  <div className="text-[13px] font-medium truncate">{it.name}</div>
                  <div className="text-[10px] font-mono text-text-dim mt-0.5">{it.id}</div>
                </div>
                <span className="chip">{it.category || 'general'}</span>
              </div>
              <div className="mt-3 h-20 rounded border border-edge bg-ink-900/60 grid-bg relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-text-dim text-[10px] font-mono">
                  // thumbnail
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-text-dim">
                <span>更新 {new Date(it.updated_at).toLocaleString()}</span>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => loadOne(it.id)} className="btn-ghost h-6">
                    加载
                  </button>
                  <button onClick={() => exportFw(it)} className="btn-ghost h-6">
                    <Download className="w-3 h-3" />
                  </button>
                  <button onClick={() => del(it.id)} className="btn-ghost h-6 !text-signal-red">
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
