import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  script as defaultScript,
  musicCues,
  leitmotifs,
  sfxLibrary,
  mixBalances,
  type Script,
} from '../data/scriptData';
import {
  ChevronLeft,
  Music,
  Volume2,
  Mic2,
  AudioWaveform,
  Headphones,
  Disc3,
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function SoundDesign() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeAct, setActiveAct] = useState<number>(0); // 0 = 全部
  const [activeSection, setActiveSection] = useState<'score' | 'leitmotif' | 'sfx' | 'mix'>('score');

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

  const filteredCues = useMemo(() => {
    if (activeAct === 0) return musicCues;
    return musicCues.filter((c) => c.actId === activeAct);
  }, [activeAct]);

  // 强度条颜色
  const intensityColor = (n: number) => {
    if (n >= 9) return '#ff3838';
    if (n >= 7) return '#ff6b35';
    if (n >= 4) return '#d4af37';
    return '#74b9ff';
  };

  // 统计
  const stats = {
    totalCues: musicCues.length,
    totalMotifs: leitmotifs.length,
    totalSFX: sfxLibrary.reduce((sum, cat) => sum + cat.examples.reduce((s, e) => s + e.count, 0), 0),
    sfxCategories: sfxLibrary.length,
  };

  return (
    <>
      <ParticleBackground />
      <div className="sound-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · SOUND DESIGN</div>
        <div className="imax-label imax-label-bottom">{stats.totalCues} CUES · {stats.totalMotifs} MOTIFS · {stats.totalSFX} SFX</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Headphones size={12} />
              <span>SOUND DESIGN</span>
            </div>
            <h1 className="timeline-title">音乐与声音设计 · SCORE & SOUND</h1>
            <p className="timeline-desc">
              从 50 BPM 远古低吟到 180 BPM 神战号角——12 个乐谱提示、5 条主导动机、70+ 音效、6 幕混音平衡。
              汉斯·季默遇上谭盾，东方与西方在 IMAX 银幕上碰撞。
            </p>
          </header>

          {/* 顶部统计 */}
          <div className="sound-stats anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="sound-stat">
              <Music size={20} style={{ color: '#d4af37' }} />
              <div>
                <div className="sound-stat-value">{stats.totalCues}</div>
                <div className="sound-stat-label">乐谱提示 / CUES</div>
              </div>
            </div>
            <div className="sound-stat">
              <Mic2 size={20} style={{ color: '#a29bfe' }} />
              <div>
                <div className="sound-stat-value">{stats.totalMotifs}</div>
                <div className="sound-stat-label">主导动机 / MOTIFS</div>
              </div>
            </div>
            <div className="sound-stat">
              <Volume2 size={20} style={{ color: '#ff6b35' }} />
              <div>
                <div className="sound-stat-value">{stats.totalSFX}</div>
                <div className="sound-stat-label">音效 / SFX</div>
              </div>
            </div>
            <div className="sound-stat">
              <Disc3 size={20} style={{ color: '#74b9ff' }} />
              <div>
                <div className="sound-stat-value">{stats.sfxCategories}</div>
                <div className="sound-stat-label">音效分类</div>
              </div>
            </div>
          </div>

          {/* 4 大板块导航 */}
          <div className="sound-tabs anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              className={`sound-tab ${activeSection === 'score' ? 'active' : ''}`}
              onClick={() => setActiveSection('score')}
              type="button"
            >
              <Music size={14} />
              <span>乐谱 · SCORE</span>
            </button>
            <button
              className={`sound-tab ${activeSection === 'leitmotif' ? 'active' : ''}`}
              onClick={() => setActiveSection('leitmotif')}
              type="button"
            >
              <AudioWaveform size={14} />
              <span>主导动机 · MOTIF</span>
            </button>
            <button
              className={`sound-tab ${activeSection === 'sfx' ? 'active' : ''}`}
              onClick={() => setActiveSection('sfx')}
              type="button"
            >
              <Volume2 size={14} />
              <span>音效库 · SFX</span>
            </button>
            <button
              className={`sound-tab ${activeSection === 'mix' ? 'active' : ''}`}
              onClick={() => setActiveSection('mix')}
              type="button"
            >
              <Disc3 size={14} />
              <span>混音平衡 · MIX</span>
            </button>
          </div>

          {/* 乐谱提示 */}
          {activeSection === 'score' && (
            <section className="sound-section anim-fade-in-up">
              <div className="sound-filters">
                <span className="filter-label">按幕筛选</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${activeAct === 0 ? 'active' : ''}`}
                    onClick={() => setActiveAct(0)}
                    type="button"
                  >
                    全部 ({musicCues.length})
                  </button>
                  {script.acts.map((act) => {
                    const count = musicCues.filter((c) => c.actId === act.id).length;
                    return (
                      <button
                        key={act.id}
                        className={`filter-btn ${activeAct === act.id ? 'active' : ''}`}
                        onClick={() => setActiveAct(act.id)}
                        type="button"
                        style={
                          activeAct === act.id
                            ? { borderColor: act.accentColor, color: act.accentColor }
                            : {}
                        }
                      >
                        {act.glyph} ACT {act.id} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cue-grid">
                {filteredCues.map((cue, idx) => {
                  const act = script.acts.find((a) => a.id === cue.actId);
                  return (
                    <div
                      key={cue.id}
                      className="cue-card"
                      style={{
                        '--accent': act?.accentColor ?? '#d4af37',
                        animationDelay: `${idx * 0.05}s`,
                      } as React.CSSProperties}
                    >
                      <div className="cue-header">
                        <div className="cue-act">ACT {cue.actId.toString().padStart(2, '0')}</div>
                        <div className="cue-shot">SHOT #{cue.shotId.toString().padStart(2, '0')}</div>
                        <div
                          className="cue-intensity"
                          style={{ color: intensityColor(cue.intensity) }}
                          title={`强度 ${cue.intensity}/10`}
                        >
                          <span className="intensity-num">{cue.intensity}</span>
                          <div className="intensity-bars">
                            {Array.from({ length: 10 }).map((_, i) => (
                              <div
                                key={i}
                                className={`intensity-bar ${i < cue.intensity ? 'on' : ''}`}
                                style={{
                                  background: i < cue.intensity ? intensityColor(cue.intensity) : undefined,
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <h3 className="cue-theme">{cue.theme}</h3>

                      <div className="cue-meta">
                        <div className="cue-meta-item">
                          <span className="cue-meta-label">TEMPO</span>
                          <span className="cue-meta-value">{cue.tempo}</span>
                        </div>
                        <div className="cue-meta-item">
                          <span className="cue-meta-label">KEY</span>
                          <span className="cue-meta-value">{cue.musicalKey}</span>
                        </div>
                      </div>

                      <div className="cue-instruments">
                        <span className="cue-instruments-label">主奏</span>
                        <div className="cue-instruments-list">
                          {cue.instruments.map((inst, i) => (
                            <span key={i} className="cue-instrument-tag">
                              {inst}
                            </span>
                          ))}
                        </div>
                      </div>

                      <p className="cue-description">{cue.description}</p>

                      <div className="cue-reference">
                        <span className="cue-ref-label">REF</span>
                        <span className="cue-ref-value">{cue.reference}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 主导动机 */}
          {activeSection === 'leitmotif' && (
            <section className="sound-section anim-fade-in-up">
              <div className="motif-intro">
                <h2 className="section-title">LEITMOTIF · 主导动机</h2>
                <p className="motif-intro-text">
                  每个角色拥有专属的音乐签名。瓦格纳首创这一手法——观众无需台词，旋律响起便知谁登场。
                </p>
              </div>

              <div className="motif-grid">
                {leitmotifs.map((motif, idx) => (
                  <div
                    key={motif.id}
                    className="motif-card"
                    style={{
                      '--accent': motif.color,
                      animationDelay: `${idx * 0.08}s`,
                    } as React.CSSProperties}
                  >
                    <div className="motif-card-header">
                      <div className="motif-character">
                        <div className="motif-character-glyph" style={{ color: motif.color }}>
                          {motif.characterName.charAt(0)}
                        </div>
                        <div>
                          <h3 className="motif-character-name">{motif.characterName}</h3>
                          <div className="motif-character-alias">{motif.alias}</div>
                        </div>
                      </div>
                      <div className="motif-emotion">{motif.emotion}</div>
                    </div>

                    {/* 波形可视化 */}
                    <div className="motif-waveform-wrap">
                      <div className="motif-waveform-label">MELODY · 旋律轮廓</div>
                      <div className="motif-waveform">
                        {motif.waveform.map((v, i) => (
                          <div
                            key={i}
                            className="motif-wave-bar"
                            style={{
                              height: `${v * 100}%`,
                              background: i % 4 === 0 ? motif.color : `${motif.color}88`,
                            }}
                          />
                        ))}
                        <div className="motif-waveform-center" />
                      </div>
                    </div>

                    <p className="motif-melody-desc">{motif.melody}</p>

                    <div className="motif-meta-grid">
                      <div className="motif-meta">
                        <span className="motif-meta-label">KEY</span>
                        <span className="motif-meta-value">{motif.musicalKey}</span>
                      </div>
                      <div className="motif-meta">
                        <span className="motif-meta-label">TEMPO</span>
                        <span className="motif-meta-value">{motif.tempo}</span>
                      </div>
                      <div className="motif-meta">
                        <span className="motif-meta-label">主奏</span>
                        <span className="motif-meta-value">{motif.primaryInstrument}</span>
                      </div>
                    </div>

                    <p className="motif-description">{motif.description}</p>

                    <div className="motif-appears">
                      <div className="motif-appears-label">出现于 {motif.appearsIn.length} 个镜头</div>
                      <div className="motif-appears-shots">
                        {motif.appearsIn.slice(0, 12).map((id) => (
                          <span key={id} className="motif-appears-shot" style={{ borderColor: motif.color }}>
                            #{id.toString().padStart(2, '0')}
                          </span>
                        ))}
                        {motif.appearsIn.length > 12 && (
                          <span className="motif-appears-more">+{motif.appearsIn.length - 12}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 音效库 */}
          {activeSection === 'sfx' && (
            <section className="sound-section anim-fade-in-up">
              <div className="sfx-intro">
                <h2 className="section-title">SFX LIBRARY · 音效库</h2>
                <p className="sfx-intro-text">
                  70+ 音效分三类：环境氛围持续铺底、Foley 拟音补足真实感、硬音效爆发冲击。
                </p>
              </div>

              <div className="sfx-grid">
                {sfxLibrary.map((cat, idx) => {
                  const total = cat.examples.reduce((s, e) => s + e.count, 0);
                  const maxCount = Math.max(...cat.examples.map((e) => e.count));
                  return (
                    <div
                      key={cat.id}
                      className="sfx-card"
                      style={{
                        '--accent': cat.color,
                        animationDelay: `${idx * 0.1}s`,
                      } as React.CSSProperties}
                    >
                      <div className="sfx-card-header">
                        <div className="sfx-icon">{cat.icon}</div>
                        <div>
                          <h3 className="sfx-label">{cat.label}</h3>
                          <div className="sfx-category-tag" style={{ color: cat.color }}>
                            {cat.category.toUpperCase()}
                          </div>
                        </div>
                        <div className="sfx-total" style={{ borderColor: cat.color }}>
                          {total}
                        </div>
                      </div>

                      <p className="sfx-description">{cat.description}</p>

                      <div className="sfx-examples">
                        {cat.examples.map((ex, i) => (
                          <div key={i} className="sfx-example">
                            <span className="sfx-example-name">{ex.name}</span>
                            <div className="sfx-example-bar-track">
                              <div
                                className="sfx-example-bar"
                                style={{
                                  width: `${(ex.count / maxCount) * 100}%`,
                                  background: cat.color,
                                }}
                              />
                            </div>
                            <span className="sfx-example-count" style={{ color: cat.color }}>
                              ×{ex.count}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 混音平衡 */}
          {activeSection === 'mix' && (
            <section className="sound-section anim-fade-in-up">
              <div className="mix-intro">
                <h2 className="section-title">MIX BALANCE · 混音平衡</h2>
                <p className="mix-intro-text">
                  每幕的对白 / 配乐 / 音效占比。柱子长度 = 该幕该声道的相对音量（0-100）。
                </p>
              </div>

              <div className="mix-grid">
                {mixBalances.map((mix, idx) => {
                  const act = script.acts.find((a) => a.id === mix.actId);
                  return (
                    <div
                      key={mix.actId}
                      className="mix-card"
                      style={{
                        '--accent': act?.accentColor ?? '#d4af37',
                        animationDelay: `${idx * 0.08}s`,
                      } as React.CSSProperties}
                    >
                      <div className="mix-card-header">
                        <div className="mix-act-num">ACT {mix.actId.toString().padStart(2, '0')}</div>
                        <h3 className="mix-act-title" style={{ color: act?.accentColor }}>
                          {mix.actTitle}
                        </h3>
                      </div>

                      <div className="mix-bars">
                        <div className="mix-bar-row">
                          <span className="mix-bar-label">对白 DIALOGUE</span>
                          <div className="mix-bar-track">
                            <div
                              className="mix-bar mix-bar-dialogue"
                              style={{ width: `${mix.dialogue}%` }}
                            >
                              <span className="mix-bar-value">{mix.dialogue}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="mix-bar-row">
                          <span className="mix-bar-label">配乐 MUSIC</span>
                          <div className="mix-bar-track">
                            <div
                              className="mix-bar mix-bar-music"
                              style={{ width: `${mix.music}%` }}
                            >
                              <span className="mix-bar-value">{mix.music}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="mix-bar-row">
                          <span className="mix-bar-label">音效 SFX</span>
                          <div className="mix-bar-track">
                            <div
                              className="mix-bar mix-bar-sfx"
                              style={{ width: `${mix.effects}%` }}
                            >
                              <span className="mix-bar-value">{mix.effects}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 堆叠条 */}
                      <div className="mix-stacked">
                        <div className="mix-stacked-segment dialogue" style={{ width: `${mix.dialogue}%` }} title="对白" />
                        <div className="mix-stacked-segment music" style={{ width: `${mix.music}%` }} title="配乐" />
                        <div className="mix-stacked-segment effects" style={{ width: `${mix.effects}%` }} title="音效" />
                      </div>

                      <p className="mix-description">{mix.description}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mix-legend">
                <div className="mix-legend-item">
                  <span className="mix-legend-dot" style={{ background: '#74b9ff' }} />
                  <span>对白 DIALOGUE</span>
                </div>
                <div className="mix-legend-item">
                  <span className="mix-legend-dot" style={{ background: '#d4af37' }} />
                  <span>配乐 MUSIC</span>
                </div>
                <div className="mix-legend-item">
                  <span className="mix-legend-dot" style={{ background: '#ff6b35' }} />
                  <span>音效 SFX</span>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
