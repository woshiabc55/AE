import { useEffect, useState } from 'react';
import { NODES } from '../data/inscriptions';
import { inkBezier } from '../utils/inkPath';
import { useAtelier } from '../store/useAtelier';
import { usePulse } from '../hooks/usePulse';

export default function NodeTerminal() {
  const text = useAtelier((s) => s.text);
  const setText = useAtelier((s) => s.setText);
  const pushChar = useAtelier((s) => s.pushChar);
  const clear = useAtelier((s) => s.clear);
  const pulse = usePulse(360);
  const [pulseIdx, setPulseIdx] = useState(0);

  useEffect(() => {
    if (!pulse) return;
    setPulseIdx((i) => (i + 1) % NODES.length);
  }, [pulse]);

  const onType = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    const oldLen = text.length;
    const newLen = newVal.length;
    setText(newVal);
    if (newLen > oldLen) {
      const added = newVal.slice(oldLen);
      for (const ch of added) pushChar(ch);
    }
  };

  return (
    <aside className="terminal">
      <div className="terminal-head">终端 · 落墨</div>
      <div className="terminal-sub">. . . . . . . . . . . . . . . . . . .</div>

      <div className="terminal-canvas">
        {/* SVG 连线 */}
        <svg className="terminal-svg" width="100%" height="100%">
          {NODES.slice(0, -1).map((n, i) => {
            const y1 = ((i + 0.5) / NODES.length) * 100;
            const y2 = ((i + 1.5) / NODES.length) * 100;
            return (
              <path
                key={n.id + '-' + NODES[i + 1].id}
                d={inkBezier(20, y1, 20, y2, 4)}
                className={pulse && (i === pulseIdx || i + 1 === pulseIdx) ? 'active' : ''}
                style={{ animationDelay: `${0.4 + i * 0.12}s` }}
              />
            );
          })}
        </svg>

        {/* 节点 */}
        {NODES.map((n, i) => {
          const top = ((i + 0.5) / NODES.length) * 100;
          const isPulse = pulse && (i === pulseIdx || i === (pulseIdx + 1) % NODES.length);
          return (
            <div
              key={n.id}
              className={'node' + (isPulse ? ' pulse' : '')}
              style={{ top: top + '%', left: 12 }}
            >
              <span className="dot" />
              <div>
                <div className="label">{n.label}</div>
                <div className="meta">{n.meta}</div>
              </div>
              <span className="tail" />
            </div>
          );
        })}
      </div>

      <div className="terminal-input">
        <textarea
          value={text}
          onChange={onType}
          placeholder="落墨于卷 — 每键入一字符，节点将呼吸一次"
          rows={3}
          spellCheck={false}
        />
      </div>

      <div className="terminal-foot">
        <span>
          <span className="key">Esc</span> 清空
        </span>
        <span>
          <span className="key">⏎</span> 换行
        </span>
        <span style={{ cursor: 'pointer' }} onClick={clear}>
          清墨
        </span>
      </div>
    </aside>
  );
}
