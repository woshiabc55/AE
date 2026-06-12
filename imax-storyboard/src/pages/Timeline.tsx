import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { script as defaultScript, type Script, type StoryboardShot } from '../data/scriptData';
import { ChevronLeft, Clock, Zap } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const moodColors: Record<string, string> = {
  epic: '#d4af37',
  tense: '#ff6b35',
  mystic: '#a29bfe',
  romantic: '#fd79a8',
  melancholy: '#74b9ff',
  triumphant: '#fdcb6e',
  quiet: '#b2bec3',
};

const moodLevels: Record<string, number> = {
  epic: 8,
  tense: 9,
  mystic: 6,
  romantic: 5,
  melancholy: 4,
  triumphant: 10,
  quiet: 3,
};

export default function Timeline() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [hoveredShot, setHoveredShot] = useState<StoryboardShot | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const custom = sessionStorage.getItem('customScript');
    if (custom) {
      try {
        setScript(JSON.parse(custom));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  const allShots = script.acts.flatMap((act) =>
    act.shots.map((shot) => ({ ...shot, actGlyph: act.glyph, actTitle: act.title, accent: act.accentColor }))
  );

  // 角色出场统计
  const characterAppearance: Record<string, number> = {};
  allShots.forEach((s) => {
    s.characters.forEach((c) => {
      characterAppearance[c] = (characterAppearance[c] ?? 0) + 1;
    });
  });

  return (
    <>
      <ParticleBackground />
      <div className="timeline-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · TIMELINE</div>
        <div className="imax-label imax-label-bottom">120MIN · 72 SHOTS · 6 ACTS</div>

        <div style={{ maxWidth: '1700px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="timeline-header anim-fade-in-up">
            <div className="timeline-badge">
              <Clock size={12} />
              <span>120 MIN · STORY PACING</span>
            </div>
            <h1 className="timeline-title">时间线 · TIMELINE</h1>
            <p className="timeline-desc">
              横轴 120 分钟，纵轴情绪强度。每一个色块是一次出拳、一道目光、一场神战。
            </p>
          </header>

          {/* 情绪曲线 */}
          <section className="timeline-section anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">EMOTIONAL CURVE · 情绪曲线</h2>
            <div className="curve-container">
              <svg viewBox="0 0 1200 240" className="curve-svg" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="curveGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* 网格 */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={i * 60}
                    x2="1200"
                    y2={i * 60}
                    stroke="#2a2a35"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />
                ))}
                {/* 曲线区域 */}
                <path
                  d={`M 0 ${240 - (moodLevels[allShots[0]?.mood ?? 'quiet'] ?? 5) * 22} ${allShots
                    .map((s, i) => {
                      const x = (i / (allShots.length - 1)) * 1200;
                      const y = 240 - (moodLevels[s.mood] ?? 5) * 22;
                      return `L ${x} ${y}`;
                    })
                    .join(' ')} L 1200 240 L 0 240 Z`}
                  fill="url(#curveGrad)"
                />
                {/* 曲线 */}
                <path
                  d={`M 0 ${240 - (moodLevels[allShots[0]?.mood ?? 'quiet'] ?? 5) * 22} ${allShots
                    .map((s, i) => {
                      const x = (i / (allShots.length - 1)) * 1200;
                      const y = 240 - (moodLevels[s.mood] ?? 5) * 22;
                      return `L ${x} ${y}`;
                    })
                    .join(' ')}`}
                  stroke="#d4af37"
                  strokeWidth="2"
                  fill="none"
                />
                {/* 镜头点 */}
                {allShots.map((s, i) => {
                  const x = (i / (allShots.length - 1)) * 1200;
                  const y = 240 - (moodLevels[s.mood] ?? 5) * 22;
                  return (
                    <circle
                      key={s.id}
                      cx={x}
                      cy={y}
                      r="4"
                      fill={moodColors[s.mood]}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredShot(s)}
                      onMouseLeave={() => setHoveredShot(null)}
                    />
                  );
                })}
              </svg>

              {/* 幕分界线 */}
              {[1, 2, 3, 4, 5].map((actId) => {
                const x = ((actId * 12 - 1) / (allShots.length - 1)) * 1200;
                return (
                  <div key={actId} className="act-divider" style={{ left: `${(x / 1200) * 100}%` }}>
                    <div className="act-divider-line" />
                    <div className="act-divider-label">ACT {actId + 1}</div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 镜头时间线 */}
          <section className="timeline-section anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="section-title">SHOT TIMELINE · 镜头时间线</h2>
            <div className="shots-track">
              {allShots.map((shot, idx) => (
                <div
                  key={shot.id}
                  className="shot-tick"
                  style={{
                    background: moodColors[shot.mood],
                    height: `${20 + (moodLevels[shot.mood] ?? 5) * 6}px`,
                    animationDelay: `${idx * 0.02}s`,
                  }}
                  onMouseEnter={() => setHoveredShot(shot)}
                  onMouseLeave={() => setHoveredShot(null)}
                  title={`${shot.timestamp} - ${shot.content}`}
                />
              ))}
            </div>
            <div className="time-markers">
              {[0, 20, 40, 60, 80, 100, 120].map((min) => (
                <div key={min} className="time-marker" style={{ left: `${(min / 120) * 100}%` }}>
                  <span>{min}min</span>
                </div>
              ))}
            </div>
          </section>

          {/* 镜头网格 */}
          <section className="timeline-section anim-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h2 className="section-title">ALL 72 SHOTS · 全部72镜头</h2>
            <div className="timeline-shots-grid">
              {allShots.map((shot, idx) => (
                <div
                  key={shot.id}
                  className="timeline-shot"
                  style={{
                    borderColor: moodColors[shot.mood],
                    animationDelay: `${idx * 0.02}s`,
                  }}
                  onMouseEnter={() => setHoveredShot(shot)}
                  onMouseLeave={() => setHoveredShot(null)}
                >
                  <div className="timeline-shot-num">#{shot.id.toString().padStart(2, '0')}</div>
                  <div className="timeline-shot-time">{shot.timestamp}</div>
                  <div className="timeline-shot-scene">{shot.scene}</div>
                  <div className="timeline-shot-mood" style={{ background: moodColors[shot.mood] }} />
                </div>
              ))}
            </div>
          </section>

          {/* 人物出场分布 */}
          <section className="timeline-section anim-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <h2 className="section-title">CHARACTER PRESENCE · 人物出场分布</h2>
            <div className="characters-presence">
              {script.characters.map((char) => {
                const presence = characterAppearance[char.name] ?? 0;
                const percent = (presence / allShots.length) * 100;
                return (
                  <div key={char.id} className="presence-row">
                    <div className="presence-info">
                      <div className="presence-name">{char.name}</div>
                      <div className="presence-alias">{char.alias}</div>
                    </div>
                    <div className="presence-bar-track">
                      <div
                        className="presence-bar"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="presence-stats">
                      <span>{presence}</span> 镜头
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 场景密度热图 */}
          <section className="timeline-section anim-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <h2 className="section-title">LOCATION DENSITY · 场景密度</h2>
            <div className="location-grid">
              {script.acts.map((act) => {
                const locCount: Record<string, number> = {};
                act.shots.forEach((s) => {
                  locCount[s.location] = (locCount[s.location] ?? 0) + 1;
                });
                return (
                  <div key={act.id} className="location-act">
                    <div className="location-act-header" style={{ color: act.accentColor }}>
                      <span className="location-act-glyph">{act.glyph}</span>
                      <span>ACT {act.id}</span>
                    </div>
                    <div className="location-list">
                      {Object.entries(locCount).map(([loc, count]) => (
                        <div key={loc} className="location-item">
                          <div className="location-name">{loc}</div>
                          <div className="location-count" style={{ color: act.accentColor }}>
                            {count} 镜
                          </div>
                          <div className="location-dots">
                            {Array.from({ length: count }).map((_, i) => (
                              <span
                                key={i}
                                className="location-dot"
                                style={{ background: act.accentColor }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* 镜头详情浮窗 */}
        {hoveredShot && (
          <div
            className="shot-tooltip"
            style={{
              left: mousePos.x + 20,
              top: mousePos.y + 20,
              borderColor: moodColors[hoveredShot.mood],
            }}
          >
            <div className="shot-tooltip-header">
              <span>SHOT {hoveredShot.id.toString().padStart(2, '0')}</span>
              <span>{hoveredShot.timestamp}</span>
            </div>
            <div className="shot-tooltip-content">{hoveredShot.content}</div>
            <div className="shot-tooltip-meta">
              <span style={{ color: moodColors[hoveredShot.mood] }}>
                <Zap size={10} style={{ display: 'inline', marginRight: 4 }} />
                {hoveredShot.mood}
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
