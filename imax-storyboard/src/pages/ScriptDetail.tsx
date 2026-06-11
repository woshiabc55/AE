import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { script as defaultScript, type Script } from '../data/scriptData';
import { ChevronRight, Clock, Film, Users, BookOpen, Sparkles } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import BackButton from '../components/BackButton';

export default function ScriptDetail() {
  const navigate = useNavigate();
  const [script, setScript] = useState<Script>(defaultScript);

  useEffect(() => {
    const custom = sessionStorage.getItem('customScript');
    if (custom) {
      try {
        setScript(JSON.parse(custom));
      } catch (e) {
        console.error('Parse error', e);
      }
    }
  }, []);

  return (
    <>
      <ParticleBackground />
      <div className="script-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · SCRIPT</div>
        <div className="imax-label imax-label-bottom">120MIN · 6 ACTS · 72 SHOTS</div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <BackButton to="/" label="BACK TO INDEX" />
            <BackButton to="/script/new" label="EDIT SCRIPT" />
          </div>

          <header className="script-header anim-fade-in-up">
            <div className="script-badge">
              <Sparkles size={12} />
              <span>{script.genre.toUpperCase()}</span>
            </div>

            <h1 className="script-title">{script.title}</h1>
            <p className="script-english">{script.englishTitle}</p>

            <div className="script-stats">
              <div className="stat">
                <Clock size={14} />
                <div>
                  <div className="stat-value">{script.totalDuration}</div>
                  <div className="stat-label">RUNTIME</div>
                </div>
              </div>
              <div className="stat">
                <Film size={14} />
                <div>
                  <div className="stat-value">{script.totalShots}</div>
                  <div className="stat-label">SHOTS</div>
                </div>
              </div>
              <div className="stat">
                <BookOpen size={14} />
                <div>
                  <div className="stat-value">6</div>
                  <div className="stat-label">ACTS</div>
                </div>
              </div>
              <div className="stat">
                <Users size={14} />
                <div>
                  <div className="stat-value">{script.characters.length}</div>
                  <div className="stat-label">CHARACTERS</div>
                </div>
              </div>
            </div>
          </header>

          <section className="script-section anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="section-label">LOGLINE</div>
            <p className="logline">{script.logline}</p>
          </section>

          <section className="script-section anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="section-label">SYNOPSIS · 故事梗概</div>
            <p className="synopsis">{script.synopsis}</p>
          </section>

          <section className="script-section anim-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="section-label">VISUAL STYLE · 视觉风格</div>
            <div className="visual-style">
              <div className="visual-main">{script.visualStyle}</div>
              <div className="visual-references">
                <span>参考影片 / REFERENCES:</span>
                {script.referenceFilms.map((ref) => (
                  <span key={ref} className="ref-tag">{ref}</span>
                ))}
              </div>
            </div>
          </section>

          <section className="script-section anim-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="section-label">CHARACTERS · 人物小传</div>
            <div className="characters-grid">
              {script.characters.map((char, idx) => (
                <div
                  key={char.id}
                  className="character-profile"
                  style={{ animationDelay: `${0.6 + idx * 0.1}s` }}
                >
                  <div className="character-profile-header">
                    <div className={`character-role-tag role-${char.role}`}>
                      {char.role === 'protagonist' && '主角'}
                      {char.role === 'antagonist' && '反派'}
                      {char.role === 'mentor' && '引路'}
                      {char.role === 'witness' && '见证'}
                    </div>
                    <div className="character-meta-info">
                      <span>{char.age}</span>
                    </div>
                  </div>
                  <h3 className="character-profile-name">{char.name}</h3>
                  <div className="character-profile-alias">{char.alias}</div>
                  <div className="character-profile-section">
                    <div className="profile-label">外貌</div>
                    <p>{char.appearance}</p>
                  </div>
                  <div className="character-profile-section">
                    <div className="profile-label">背景</div>
                    <p>{char.background}</p>
                  </div>
                  <div className="character-profile-section">
                    <div className="profile-label">能力</div>
                    <p>{char.ability}</p>
                  </div>
                  <div className="character-profile-section">
                    <div className="profile-label">人物弧光</div>
                    <p className="arc-text">{char.arc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="script-section anim-fade-in-up" style={{ animationDelay: '0.8s' }}>
            <div className="section-label">SIX ACTS · 六幕结构</div>
            <div className="acts-grid">
              {script.acts.map((act) => (
                <Link
                  key={act.id}
                  to={`/script/act/${act.id}`}
                  className="act-card"
                  style={{ '--accent': act.accentColor } as React.CSSProperties}
                >
                  <div className="act-card-glyph">{act.glyph}</div>
                  <div className="act-card-num">ACT {act.id.toString().padStart(2, '0')}</div>
                  <h3 className="act-card-title">{act.title.replace(/^第[一二三四五六]幕：/, '')}</h3>
                  <div className="act-card-subtitle">{act.subtitle}</div>
                  <p className="act-card-theme">{act.theme}</p>

                  <div className="act-card-beats">
                    <div className="act-card-beats-label">KEY BEATS</div>
                    <div className="act-card-beats-list">
                      {act.keyBeats.map((beat, i) => (
                        <span key={i} className="beat-tag">{beat}</span>
                      ))}
                    </div>
                  </div>

                  <div className="act-card-footer">
                    <span>{act.duration} · {act.shots.length} shots</span>
                    <ChevronRight size={14} className="act-card-arrow" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <div className="section-divider" />

          <div className="cta-section anim-fade-in-up">
            <p className="cta-text">剧本已就绪 · 共 120 分钟 · 6 幕 · 72 镜头</p>
            <button
              className="cta-button"
              onClick={() => navigate('/script/act/1')}
              type="button"
            >
              <Film size={16} />
              <span>进入第一幕分镜</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
