import { useAppStore, type TotalMinutes, type Resolution, type Speed, type StyleKey } from '../store/useAppStore';

const DURATIONS: TotalMinutes[] = [10, 20, 30, 40, 60];
const RESOLUTIONS: Resolution[] = [720, 1080];
const SPEEDS: Speed[] = [0.5, 1, 1.5, 2];
const STYLES: { v: StyleKey; label: string }[] = [
  { v: 'brainrot', label: 'Brainrot' },
  { v: 'neon', label: 'Neon' },
  { v: 'newspaper', label: 'Newspaper' },
  { v: 'bauhaus', label: 'Bauhaus' },
  { v: 'magazine', label: 'Magazine' },
  { v: 'pixel', label: 'Pixel' },
];
const STYLE_LABELS: Record<StyleKey, string> = {
  brainrot: 'Brainrot', neon: 'Neon', newspaper: 'Newspaper',
  bauhaus: 'Bauhaus', magazine: 'Magazine', pixel: 'Pixel',
};

export default function ControlPanel({ onGo }: { onGo: () => void }) {
  const s = useAppStore();
  return (
    <section className="panel">
      <h3>控制台</h3>
      <Field label="视频时长" v={`${s.totalMinutes} min`}>
        <div className="toggle">
          {DURATIONS.map(d => (
            <button key={d} className={s.totalMinutes === d ? 'on' : ''}
              onClick={() => s.set({ totalMinutes: d })}>{d} 分</button>
          ))}
        </div>
      </Field>
      <Field label="分辨率" v={s.resolution === 1080 ? '1920×1080' : '1280×720'}>
        <div className="toggle">
          {RESOLUTIONS.map(r => (
            <button key={r} className={s.resolution === r ? 'on' : ''}
              onClick={() => s.set({ resolution: r })}>{r}p</button>
          ))}
        </div>
      </Field>
      <Field label="语速" v={`${s.speed.toFixed(1)}×`}>
        <div className="toggle">
          {SPEEDS.map(sp => (
            <button key={sp} className={s.speed === sp ? 'on' : ''}
              onClick={() => s.set({ speed: sp })}>{sp.toFixed(1)}×</button>
          ))}
        </div>
      </Field>
      <Field label="BGM 音量" v={`${Math.round(s.volume * 100)}%`}>
        <input type="range" min={0} max={100} value={Math.round(s.volume * 100)}
          onChange={e => s.set({ volume: +e.target.value / 100 })} />
      </Field>
      <Field label="风格预设" v={STYLE_LABELS[s.style]}>
        <select value={s.style} onChange={e => s.set({ style: e.target.value as StyleKey })}>
          {STYLES.map(st => <option key={st.v} value={st.v}>{st.label} · {st.label}</option>)}
        </select>
      </Field>
      <Field label="附加项" v="">
        <div className="toggle">
          {(['watermark', 'particles', 'subtitles'] as const).map(k => (
            <button key={k} className={s[k] ? 'on' : ''}
              onClick={() => s.set({ [k]: !s[k] } as Partial<typeof s>)}>
              {k === 'watermark' ? '水印' : k === 'particles' ? '粒子' : '标签字幕'}
            </button>
          ))}
        </div>
      </Field>
      <button className="cta" onClick={onGo} disabled={s.running}>
        {s.running ? '生成中…请勿切换标签页' : `▶ 开始生成 ${s.totalMinutes} 分钟视频`}
      </button>
    </section>
  );
}

function Field({ label, v, children }: { label: string; v: string; children: React.ReactNode }) {
  return (
    <div className="field">
      <label>{label} {v && <b>{v}</b>}</label>
      {children}
    </div>
  );
}
