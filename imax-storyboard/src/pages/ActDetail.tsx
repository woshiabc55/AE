import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { script as defaultScript, type Script, type StoryboardShot } from '../data/scriptData';
import { ChevronLeft, ChevronRight, Clock, MapPin, Users, Music, Camera } from 'lucide-react';
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

const moodLabels: Record<string, string> = {
  epic: '史诗',
  tense: '紧张',
  mystic: '神秘',
  romantic: '浪漫',
  melancholy: '苍凉',
  triumphant: '胜利',
  quiet: '安静',
};

export default function ActDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const actId = parseInt(id ?? '1', 10);
  const [script, setScript] = useState<Script>(defaultScript);
  const [selectedShot, setSelectedShot] = useState<StoryboardShot | null>(null);

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

  const act = script.acts.find((a) => a.id === actId);
  if (!act) {
    return (
      <div className="chapter-page">
        <div style={{ padding: 'var(--space-8)', textAlign: 'center' }}>幕未找到</div>
      </div>
    );
  }

  const prevAct = script.acts.find((a) => a.id === actId - 1);
  const nextAct = script.acts.find((a) => a.id === actId + 1);

  return (
    <>
      <ParticleBackground />
      <div className="act-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · ACT {act.id.toString().padStart(2, '0')}</div>
        <div className="imax-label imax-label-bottom">{act.duration.toUpperCase()} · {act.shots.length} SHOTS</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <Link to="/script/detail" className="back-button">
              <ChevronLeft size={14} />
              <span>SCRIPT</span>
            </Link>
            <button
              className="back-button"
              onClick={() => navigate('/')}
              type="button"
            >
              <ChevronLeft size={14} />
              <span>HOME</span>
            </button>
          </div>

          <header className="act-header anim-fade-in-up" style={{ '--accent': act.accentColor } as React.CSSProperties}>
            <div className="act-header-meta">
              <span className="act-glyph">{act.glyph}</span>
              <span>ACT {act.id.toString().padStart(2, '0')}</span>
              <span className="meta-divider" />
              <span>{act.duration}</span>
              <span className="meta-divider" />
              <span>{act.shots.length} SHOTS</span>
            </div>

            <h1 className="act-header-title">{act.title}</h1>
            <p className="act-header-subtitle">{act.subtitle}</p>

            <div className="act-header-grid">
              <div className="act-info-block">
                <div className="info-label">SYNOPSIS</div>
                <p>{act.summary}</p>
              </div>
              <div className="act-info-block">
                <div className="info-label">THEME</div>
                <p>{act.theme}</p>
              </div>
              <div className="act-info-block">
                <div className="info-label">EMOTIONAL ARC</div>
                <p>{act.emotionalArc}</p>
              </div>
              <div className="act-info-block">
                <div className="info-label">KEY BEATS</div>
                <div className="key-beats">
                  {act.keyBeats.map((beat, i) => (
                    <span key={i} className="key-beat">{beat}</span>
                  ))}
                </div>
              </div>
            </div>
          </header>

          <div className="section-divider" />

          <section className="shots-grid">
            {act.shots.map((shot, idx) => (
              <button
                key={shot.id}
                className="shot-card anim-fade-in-up"
                style={{
                  animationDelay: `${idx * 0.06}s`,
                  '--accent': act.accentColor,
                  '--mood': moodColors[shot.mood] ?? act.accentColor,
                } as React.CSSProperties}
                onClick={() => setSelectedShot(shot)}
                type="button"
              >
                <div className="shot-card-header">
                  <div className="shot-card-id">SHOT {shot.id.toString().padStart(2, '0')}</div>
                  <div className="shot-card-timestamp">{shot.timestamp}</div>
                </div>

                <div className="shot-card-scene-row">
                  <span className="shot-card-scene">{shot.scene}</span>
                  <span className="shot-card-duration">{shot.duration}s</span>
                </div>

                <div className="shot-card-camera">
                  <Camera size={11} />
                  <span>{shot.camera}</span>
                </div>

                <p className="shot-card-content">{shot.content}</p>

                <div className="shot-card-meta">
                  <div className="shot-meta-item">
                    <MapPin size={10} />
                    <span>{shot.location}</span>
                  </div>
                  <div className="shot-meta-item">
                    <Users size={10} />
                    <span>{shot.characters.join(' · ')}</span>
                  </div>
                </div>

                <div className="shot-card-mood" style={{ color: moodColors[shot.mood] }}>
                  <span className="mood-dot" style={{ background: moodColors[shot.mood] }} />
                  {moodLabels[shot.mood]}
                </div>
              </button>
            ))}
          </section>

          <div className="act-nav">
            {prevAct ? (
              <Link to={`/script/act/${prevAct.id}`} className="act-nav-button">
                <ChevronLeft size={16} />
                <div>
                  <div className="nav-label">PREV ACT</div>
                  <div className="nav-title">{prevAct.title}</div>
                </div>
              </Link>
            ) : <div />}

            {nextAct ? (
              <Link to={`/script/act/${nextAct.id}`} className="act-nav-button next">
                <div>
                  <div className="nav-label">NEXT ACT</div>
                  <div className="nav-title">{nextAct.title}</div>
                </div>
                <ChevronRight size={16} />
              </Link>
            ) : (
              <Link to="/script/detail" className="act-nav-button next">
                <div>
                  <div className="nav-label">END OF SCRIPT</div>
                  <div className="nav-title">回到剧本总览</div>
                </div>
                <ChevronRight size={16} />
              </Link>
            )}
          </div>
        </div>

        {selectedShot && (
          <div className="shot-modal" onClick={() => setSelectedShot(null)}>
            <div
              className="shot-modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ '--accent': act.accentColor } as React.CSSProperties}
            >
              <button
                className="modal-close"
                onClick={() => setSelectedShot(null)}
                type="button"
              >
                ✕
              </button>

              <div className="modal-header">
                <div className="modal-shot-id">SHOT {selectedShot.id.toString().padStart(2, '0')}</div>
                <div className="modal-timestamp">{selectedShot.timestamp} · {selectedShot.duration}s</div>
              </div>

              <h2 className="modal-title">{selectedShot.scene} · {act.title}</h2>

              <div className="modal-section">
                <div className="modal-label">运镜</div>
                <p>{selectedShot.camera}</p>
              </div>

              <div className="modal-section">
                <div className="modal-label">画面内容</div>
                <p className="modal-content">{selectedShot.content}</p>
              </div>

              <div className="modal-section">
                <div className="modal-label">特效 / 渲染</div>
                <p className="modal-effects">{selectedShot.effects}</p>
              </div>

              <div className="modal-section">
                <div className="modal-label">音效</div>
                <p className="modal-sound">{selectedShot.sound}</p>
              </div>

              <div className="modal-meta-grid">
                <div className="modal-meta-item">
                  <MapPin size={12} />
                  <div>
                    <div className="modal-meta-label">场景</div>
                    <div>{selectedShot.location}</div>
                  </div>
                </div>
                <div className="modal-meta-item">
                  <Users size={12} />
                  <div>
                    <div className="modal-meta-label">角色</div>
                    <div>{selectedShot.characters.join(' · ')}</div>
                  </div>
                </div>
                <div className="modal-meta-item">
                  <Music size={12} />
                  <div>
                    <div className="modal-meta-label">情绪</div>
                    <div style={{ color: moodColors[selectedShot.mood] }}>
                      {moodLabels[selectedShot.mood]}
                    </div>
                  </div>
                </div>
                <div className="modal-meta-item">
                  <Clock size={12} />
                  <div>
                    <div className="modal-meta-label">时长</div>
                    <div>{selectedShot.duration} 秒</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
