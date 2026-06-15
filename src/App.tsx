import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import TopBar from '@/components/TopBar';
import NodeLibrary from '@/components/NodeLibrary';
import PropertyPanel from '@/components/PropertyPanel';
import Console from '@/components/Console';
import Canvas from '@/components/Canvas';
import { fetchProviders } from '@/api';
import { useStore } from '@/store';
import { Activity, Cpu, Database, Layers } from 'lucide-react';

interface Props {
  children?: React.ReactNode;
  initialTab?: 'canvas' | 'library' | 'settings';
}

export default function App({ children }: Props) {
  const mode = useStore((s) => s.mode);
  const setProviders = useStore((s) => s.setProviders);
  const wf = useStore((s) => s.workflow);
  const loc = useLocation();
  const isOverlay = children != null;

  useEffect(() => {
    fetchProviders().then(setProviders).catch(() => undefined);
  }, [setProviders]);

  if (isOverlay) {
    return (
      <div className="h-screen flex flex-col">
        <TopBar />
        <div className="flex-1 min-h-0">{children}</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div className="flex-1 min-h-0 grid grid-cols-[260px_1fr_320px]">
        {/* Left: node library */}
        <aside className="border-r border-edge bg-ink-900/40 min-h-0">
          <NodeLibrary />
        </aside>

        {/* Center: dual canvas (single viewport, mode switch) */}
        <main className="relative min-h-0 grid-bg scanline">
          <div className="absolute inset-0">
            <Canvas mode={mode} />
          </div>
          {/* Footer status bar */}
          <div className="absolute bottom-0 left-0 right-0 h-6 px-3 flex items-center text-[10px] font-mono text-text-dim border-t border-edge bg-ink-900/60 backdrop-blur z-10">
            <span className="flex items-center gap-1.5">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  mode === 'runtime' ? 'bg-signal-magenta animate-pulse' : 'bg-signal-cyan'
                }`}
              />
              {mode === 'runtime' ? 'RUNTIME' : 'DESIGN'}
            </span>
            <span className="mx-3 opacity-40">|</span>
            <span className="flex items-center gap-1">
              <Layers className="w-2.5 h-2.5" /> {wf.nodes.length} nodes
            </span>
            <span className="mx-3 opacity-40">|</span>
            <span className="flex items-center gap-1">
              <Activity className="w-2.5 h-2.5" /> {wf.edges.length} edges
            </span>
            <span className="ml-auto flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Cpu className="w-2.5 h-2.5" /> backend :4317
              </span>
              <span className="flex items-center gap-1">
                <Database className="w-2.5 h-2.5" /> ~/.flowforge
              </span>
            </span>
          </div>
        </main>

        {/* Right: property panel */}
        <aside className="border-l border-edge bg-ink-900/40 min-h-0">
          <PropertyPanel />
        </aside>
      </div>
      {/* Bottom: console */}
      <div className="h-56 border-t border-edge bg-ink-900/40 min-h-0">
        <Console />
      </div>
    </div>
  );
}
