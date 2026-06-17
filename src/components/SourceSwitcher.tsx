import { useRef } from 'react';
import { useStore, type SourceId } from '@/store/useStore';
import { Radio, Mic, FileAudio2 } from 'lucide-react';
import clsx from 'clsx';

const SOURCES: { id: SourceId; label: string; icon: typeof Radio }[] = [
  { id: 'synth', label: '内置', icon: Radio },
  { id: 'mic', label: '麦克风', icon: Mic },
  { id: 'file', label: '本地', icon: FileAudio2 },
];

export default function SourceSwitcher() {
  const source = useStore((s) => s.source);
  const setSource = useStore((s) => s.setSource);
  const fileName = useStore((s) => s.fileName);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const onPick = (id: SourceId) => {
    if (id === 'file') {
      fileRef.current?.click();
      return;
    }
    setSource(id);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1 p-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md">
        {SOURCES.map((s) => {
          const active = source === s.id;
          const Icon = s.icon;
          return (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              className={clsx(
                'group relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-mono tracking-[0.12em] uppercase transition-all',
                active
                  ? 'text-white'
                  : 'text-white/55 hover:text-white/90',
              )}
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(125,249,255,0.18), rgba(155,93,229,0.18) 55%, rgba(255,60,172,0.18))',
                    boxShadow: 'inset 0 0 0 1px rgba(125,249,255,0.35)',
                  }}
                />
              )}
              <Icon size={12} className="relative" />
              <span className="relative">{s.label}</span>
            </button>
          );
        })}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) {
            (window as unknown as { __loadFile: (f: File) => void }).__loadFile(f);
          }
          e.target.value = '';
        }}
      />
      {source === 'file' && fileName && (
        <div className="mt-1.5 text-[10px] font-mono tracking-wider text-white/45 truncate max-w-[220px]">
          NOW · {fileName}
        </div>
      )}
    </div>
  );
}
