import { useState } from 'react';
import { SEALS } from '../data/inscriptions';
import { useAtelier } from '../store/useAtelier';

export default function SealBar() {
  const seal = useAtelier((s) => s.seal);
  const switchMode = useAtelier((s) => s.switchMode);
  const reset = useAtelier((s) => s.reset);
  const clear = useAtelier((s) => s.clear);
  const mode = useAtelier((s) => s.mode);
  const [spinning, setSpinning] = useState<string | null>(null);

  const onClick = (id: string) => {
    setSpinning(id);
    if (id === 'reset') {
      reset();
    } else if (id === 'mode') {
      switchMode();
    } else if (id === 'clear') {
      clear();
    } else {
      seal();
    }
    setTimeout(() => setSpinning(null), 600);
  };

  return (
    <div className="seal-bar">
      <div className="seal-group">
        {SEALS.map((s) => (
          <button
            key={s.id}
            className={'seal' + (spinning === s.id ? ' spin' : '')}
            title={s.tip}
            onClick={() => onClick(s.id)}
            aria-label={s.tip}
          >
            <span className="glyph">{s.glyph}</span>
          </button>
        ))}
        <div className="seal-vertical">墨 · 印 · 音 · 缺</div>
      </div>

      <div className="brand">
        <span className="seal-mini">断</span>
        <span>断卷残章 · 卷七 · 残山瘦水 · 数字虫蛀版</span>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-soft)' }}>
        <span>纸本</span>
        <span style={{ padding: '2px 8px', border: '1px solid var(--mildew)', background: 'var(--paper-deep)' }}>
          {mode === 'paper' ? '纸' : '绢'}
        </span>
        <span>绢本</span>
      </div>
    </div>
  );
}
