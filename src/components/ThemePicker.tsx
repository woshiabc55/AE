import { useStore } from '@/store/useStore';
import { themeList } from '@/themes/themes';
import clsx from 'clsx';

export default function ThemePicker() {
  const theme = useStore((s) => s.theme);
  const setTheme = useStore((s) => s.setTheme);
  return (
    <div className="flex flex-col gap-2">
      <div className="text-[10px] tracking-[0.18em] uppercase text-white/55 font-mono">
        视觉主题
      </div>
      <div className="grid grid-cols-6 gap-2">
        {themeList.map((t) => {
          const active = theme === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              title={t.name}
              className={clsx(
                'relative h-7 w-7 rounded-full transition-transform',
                active ? 'scale-110' : 'hover:scale-105',
              )}
              style={{
                background: `linear-gradient(135deg, ${t.particleLow}, ${t.particleMid} 55%, ${t.particleHigh})`,
                boxShadow: active
                  ? `0 0 0 2px rgba(255,255,255,0.85), 0 0 14px ${t.particleLow}`
                  : `0 0 0 1px rgba(255,255,255,0.12)`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
