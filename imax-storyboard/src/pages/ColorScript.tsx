import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  script as defaultScript,
  colorCues,
  actPalettes,
  colorTemperatureCurve,
  characterPalettes,
  lutStyles,
  type Script,
} from '../data/scriptData';
import {
  ChevronLeft,
  Palette,
  Thermometer,
  Sparkles,
  Sun,
  Layers,
  Droplet,
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function ColorScript() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeSection, setActiveSection] = useState<'cues' | 'palettes' | 'curve' | 'characters' | 'lut'>('cues');
  const [activeAct, setActiveAct] = useState<number>(0);

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
    if (activeAct === 0) return colorCues;
    return colorCues.filter((c) => c.actId === activeAct);
  }, [activeAct]);

  const tempColor = (t: number) => {
    if (t > 30) return '#ff6b35';
    if (t > 0) return '#f4d03f';
    if (t > -30) return '#74b9ff';
    return '#3a4a55';
  };

  const temperatureLabel = (t: number) => {
    if (t > 50) return '极暖';
    if (t > 20) return '暖';
    if (t > -20) return '中性';
    if (t > -50) return '冷';
    return '极冷';
  };

  return (
    <>
      <ParticleBackground />
      <div className="color-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · COLOR SCRIPT</div>
        <div className="imax-label imax-label-bottom">{colorCues.length} CUES · {actPalettes.length} ACT PALETTES</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Palette size={12} />
              <span>COLOR SCRIPT</span>
            </div>
            <h1 className="timeline-title">色彩脚本 · COLOR SCRIPT</h1>
            <p className="timeline-desc">
              从晨雾金调到深渊灰黑——12 个关键镜头的调色设计、6 幕主调色板、4 角色色彩语言、4 套 LUT 风格参考。
              IMAX 摄影师罗杰·迪金斯遇上东方水墨，留白与浓墨的银幕对话。
            </p>
          </header>

          {/* 5 大板块导航 */}
          <div className="color-tabs anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <button
              className={`color-tab ${activeSection === 'cues' ? 'active' : ''}`}
              onClick={() => setActiveSection('cues')}
              type="button"
            >
              <Droplet size={14} />
              <span>调色提示 · CUES</span>
            </button>
            <button
              className={`color-tab ${activeSection === 'palettes' ? 'active' : ''}`}
              onClick={() => setActiveSection('palettes')}
              type="button"
            >
              <Palette size={14} />
              <span>幕调色板 · ACT</span>
            </button>
            <button
              className={`color-tab ${activeSection === 'curve' ? 'active' : ''}`}
              onClick={() => setActiveSection('curve')}
              type="button"
            >
              <Thermometer size={14} />
              <span>温度曲线 · CURVE</span>
            </button>
            <button
              className={`color-tab ${activeSection === 'characters' ? 'active' : ''}`}
              onClick={() => setActiveSection('characters')}
              type="button"
            >
              <Sparkles size={14} />
              <span>角色色 · CHARACTER</span>
            </button>
            <button
              className={`color-tab ${activeSection === 'lut' ? 'active' : ''}`}
              onClick={() => setActiveSection('lut')}
              type="button"
            >
              <Layers size={14} />
              <span>LUT 风格 · LUT</span>
            </button>
          </div>

          {/* 调色提示 */}
          {activeSection === 'cues' && (
            <section className="color-section anim-fade-in-up">
              <div className="color-filters">
                <span className="filter-label">按幕筛选</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${activeAct === 0 ? 'active' : ''}`}
                    onClick={() => setActiveAct(0)}
                    type="button"
                  >
                    全部 ({colorCues.length})
                  </button>
                  {script.acts.map((act) => {
                    const count = colorCues.filter((c) => c.actId === act.id).length;
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

              <div className="colorcue-grid">
                {filteredCues.map((cue, idx) => {
                  return (
                    <div
                      key={cue.id}
                      className="colorcue-card"
                      style={{
                        '--cue-primary': cue.primaryColor,
                        '--cue-secondary': cue.secondaryColor,
                        '--cue-accent': cue.accentColor,
                        animationDelay: `${idx * 0.05}s`,
                      } as React.CSSProperties}
                    >
                      <div
                        className="colorcue-preview"
                        style={{
                          background: `linear-gradient(135deg, ${cue.primaryColor} 0%, ${cue.secondaryColor} 60%, ${cue.accentColor} 100%)`,
                        }}
                      >
                        <div className="colorcue-preview-overlay">
                          <div className="colorcue-act">ACT {cue.actId.toString().padStart(2, '0')}</div>
                          <div className="colorcue-shot">SHOT #{cue.shotId.toString().padStart(2, '0')}</div>
                          <div className={`colorcue-temp temp-${cue.temperature}`}>
                            {cue.temperature === 'warm' && '暖 WARM'}
                            {cue.temperature === 'cool' && '冷 COOL'}
                            {cue.temperature === 'neutral' && '中 NEUTRAL'}
                            {cue.temperature === 'mixed' && '混 MIXED'}
                          </div>
                        </div>
                      </div>

                      <div className="colorcue-body">
                        <h3 className="colorcue-palette-name">{cue.paletteName}</h3>
                        <div className="colorcue-lut">LUT · {cue.lutStyle}</div>

                        <div className="colorcue-swatches">
                          <div className="colorcue-swatch">
                            <div
                              className="colorcue-swatch-color"
                              style={{ background: cue.primaryColor }}
                            />
                            <div className="colorcue-swatch-hex">{cue.primaryColor}</div>
                          </div>
                          <div className="colorcue-swatch">
                            <div
                              className="colorcue-swatch-color"
                              style={{ background: cue.secondaryColor }}
                            />
                            <div className="colorcue-swatch-hex">{cue.secondaryColor}</div>
                          </div>
                          <div className="colorcue-swatch">
                            <div
                              className="colorcue-swatch-color"
                              style={{ background: cue.accentColor }}
                            />
                            <div className="colorcue-swatch-hex">{cue.accentColor}</div>
                          </div>
                        </div>

                        <div className="colorcue-meters">
                          <div className="colorcue-meter">
                            <span className="colorcue-meter-label">SAT</span>
                            <div className="colorcue-meter-track">
                              <div className="colorcue-meter-fill" style={{ width: `${cue.saturation}%` }} />
                            </div>
                            <span className="colorcue-meter-value">{cue.saturation}</span>
                          </div>
                          <div className="colorcue-meter">
                            <span className="colorcue-meter-label">BRT</span>
                            <div className="colorcue-meter-track">
                              <div className="colorcue-meter-fill" style={{ width: `${cue.brightness}%` }} />
                            </div>
                            <span className="colorcue-meter-value">{cue.brightness}</span>
                          </div>
                          <div className="colorcue-meter">
                            <span className="colorcue-meter-label">CTR</span>
                            <div className="colorcue-meter-track">
                              <div className="colorcue-meter-fill" style={{ width: `${cue.contrast}%` }} />
                            </div>
                            <span className="colorcue-meter-value">{cue.contrast}</span>
                          </div>
                        </div>

                        <p className="colorcue-desc">{cue.description}</p>

                        <div className="colorcue-ref">
                          <span className="colorcue-ref-label">REF</span>
                          <span className="colorcue-ref-value">{cue.reference}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 幕调色板 */}
          {activeSection === 'palettes' && (
            <section className="color-section anim-fade-in-up">
              <div className="palette-intro">
                <h2 className="section-title">ACT PALETTES · 6 幕主调色板</h2>
                <p className="palette-intro-text">
                  每幕的视觉主导色。从第一幕的晨雾金，到第三幕的深渊黑，再到第六幕的回归——色彩在 120 分钟内完成一个轮回。
                </p>
              </div>

              <div className="palette-grid">
                {actPalettes.map((pal, idx) => (
                  <div
                    key={pal.actId}
                    className="palette-card"
                    style={{
                      '--pal-primary': pal.primaryColor,
                      '--pal-secondary': pal.secondaryColor,
                      '--pal-accent': pal.accentColor,
                      animationDelay: `${idx * 0.08}s`,
                    } as React.CSSProperties}
                  >
                    <div
                      className="palette-preview"
                      style={{
                        background: `linear-gradient(135deg, ${pal.primaryColor} 0%, ${pal.secondaryColor} 100%)`,
                      }}
                    >
                      <div className="palette-act-num">ACT {pal.actId.toString().padStart(2, '0')}</div>
                      <div className="palette-temp-badge" data-temp={pal.temperature}>
                        {pal.temperature === 'warm' && '暖'}
                        {pal.temperature === 'cool' && '冷'}
                        {pal.temperature === 'neutral' && '中'}
                        {pal.temperature === 'mixed' && '混'}
                      </div>
                    </div>

                    <div className="palette-body">
                      <h3 className="palette-title">{pal.actTitle}</h3>
                      <div className="palette-evolution">{pal.evolution}</div>

                      <div className="palette-keywords">
                        {pal.keywords.map((kw, i) => (
                          <span key={i} className="palette-keyword">
                            #{kw}
                          </span>
                        ))}
                      </div>

                      <p className="palette-desc">{pal.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 温度曲线 */}
          {activeSection === 'curve' && (
            <section className="color-section anim-fade-in-up">
              <div className="curve-intro">
                <h2 className="section-title">TEMPERATURE CURVE · 温度曲线</h2>
                <p className="curve-intro-text">
                  每幕的色温（暖↔冷）、饱和度、对比度。-100 极冷蓝，+100 极暖橙。
                </p>
              </div>

              <div className="curve-container">
                <svg className="curve-svg" viewBox="0 0 800 280" preserveAspectRatio="none">
                  {/* 中线（0 度） */}
                  <line x1="0" y1="140" x2="800" y2="140" stroke="rgba(116, 116, 124, 0.3)" strokeWidth="1" strokeDasharray="4,4" />
                  <text x="0" y="135" fill="var(--color-whisper)" fontSize="10" fontFamily="JetBrains Mono">0°</text>
                  <text x="0" y="20" fill="#ff6b35" fontSize="10" fontFamily="JetBrains Mono">+100° 暖</text>
                  <text x="0" y="270" fill="#74b9ff" fontSize="10" fontFamily="JetBrains Mono">-100° 冷</text>

                  {/* 暖色区域 */}
                  <rect x="0" y="0" width="800" height="140" fill="url(#warmGrad)" opacity="0.1" />
                  {/* 冷色区域 */}
                  <rect x="0" y="140" width="800" height="140" fill="url(#coolGrad)" opacity="0.1" />

                  {/* 渐变定义 */}
                  <defs>
                    <linearGradient id="warmGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#ff6b35" />
                      <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
                    </linearGradient>
                    <linearGradient id="coolGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#74b9ff" stopOpacity="0" />
                      <stop offset="100%" stopColor="#74b9ff" />
                    </linearGradient>
                  </defs>

                  {/* 温度曲线 - 路径 */}
                  <path
                    d={colorTemperatureCurve
                      .map((p, i) => {
                        const x = (i / (colorTemperatureCurve.length - 1)) * 800;
                        const y = 140 - (p.temperature / 100) * 120;
                        return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
                      })
                      .join(' ')}
                    fill="none"
                    stroke="url(#curveGrad)"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient id="curveGrad" x1="0" x2="1" y1="0" y2="0">
                      <stop offset="0%" stopColor="#d4af37" />
                      <stop offset="50%" stopColor="#9d0208" />
                      <stop offset="100%" stopColor="#d4af37" />
                    </linearGradient>
                  </defs>

                  {/* 数据点 */}
                  {colorTemperatureCurve.map((p, i) => {
                    const x = (i / (colorTemperatureCurve.length - 1)) * 800;
                    const y = 140 - (p.temperature / 100) * 120;
                    return (
                      <g key={i}>
                        <circle cx={x} cy={y} r="6" fill={tempColor(p.temperature)} stroke="var(--color-void)" strokeWidth="2" />
                        <text
                          x={x}
                          y={y - 12}
                          fill="var(--color-star)"
                          fontSize="10"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          {p.temperature}°
                        </text>
                        <text
                          x={x}
                          y={280}
                          fill="var(--color-fog)"
                          fontSize="11"
                          fontFamily="JetBrains Mono"
                          textAnchor="middle"
                        >
                          ACT {p.actId}
                        </text>
                        <text
                          x={x}
                          y={270}
                          fill="var(--color-whisper)"
                          fontSize="9"
                          fontFamily="Noto Serif SC"
                          textAnchor="middle"
                        >
                          {p.actTitle}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* 6 幕数据卡 */}
              <div className="curve-data-grid">
                {colorTemperatureCurve.map((p, idx) => (
                  <div
                    key={p.actId}
                    className="curve-data-card"
                    style={{
                      borderColor: tempColor(p.temperature),
                      animationDelay: `${idx * 0.06}s`,
                    } as React.CSSProperties}
                  >
                    <div className="curve-data-act">ACT {p.actId.toString().padStart(2, '0')}</div>
                    <div className="curve-data-title">{p.actTitle}</div>

                    <div className="curve-data-meters">
                      <div className="curve-data-meter">
                        <span className="curve-data-label">色温</span>
                        <div
                          className="curve-data-bar"
                          style={{
                            background: tempColor(p.temperature),
                            width: `${Math.abs(p.temperature)}%`,
                            marginLeft: p.temperature < 0 ? `${100 - Math.abs(p.temperature)}%` : '0',
                          }}
                        />
                        <span className="curve-data-value">{temperatureLabel(p.temperature)}</span>
                      </div>
                      <div className="curve-data-meter">
                        <span className="curve-data-label">饱和</span>
                        <div className="curve-data-bar-bg">
                          <div
                            className="curve-data-bar"
                            style={{
                              background: 'linear-gradient(90deg, #4a4a55 0%, #ff6b35 100%)',
                              width: `${p.saturation}%`,
                            }}
                          />
                        </div>
                        <span className="curve-data-value">{p.saturation}</span>
                      </div>
                      <div className="curve-data-meter">
                        <span className="curve-data-label">对比</span>
                        <div className="curve-data-bar-bg">
                          <div
                            className="curve-data-bar"
                            style={{
                              background: 'linear-gradient(90deg, #4a4a55 0%, #d4af37 100%)',
                              width: `${p.contrast}%`,
                            }}
                          />
                        </div>
                        <span className="curve-data-value">{p.contrast}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 角色色 */}
          {activeSection === 'characters' && (
            <section className="color-section anim-fade-in-up">
              <div className="character-color-intro">
                <h2 className="section-title">CHARACTER PALETTES · 角色色彩语言</h2>
                <p className="character-color-intro-text">
                  4 个主要角色各有专属色彩语言。色相是他们的视觉签名——守田=金、燕无忧=红、清禾=紫、魏镇=蓝。
                </p>
              </div>

              <div className="char-palette-grid">
                {characterPalettes.map((char, idx) => (
                  <div
                    key={char.characterName}
                    className="char-palette-card"
                    style={{
                      '--char-color': char.primaryColor,
                      animationDelay: `${idx * 0.1}s`,
                    } as React.CSSProperties}
                  >
                    <div className="char-palette-header">
                      <div
                        className="char-palette-glyph"
                        style={{ color: char.primaryColor, borderColor: char.primaryColor }}
                      >
                        {char.characterName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="char-palette-name">{char.characterName}</h3>
                        <div className="char-palette-alias">{char.alias}</div>
                      </div>
                    </div>

                    <div className="char-palette-meaning">
                      <span className="char-palette-meaning-label">象征</span>
                      <span className="char-palette-meaning-text">{char.meaning}</span>
                    </div>

                    <p className="char-palette-evolution">{char.evolution}</p>

                    <div className="char-palette-timeline-label">色彩演化时间轴</div>
                    <div className="char-palette-timeline">
                      {char.sceneUsage.map((usage, i) => {
                        const isLast = i === char.sceneUsage.length - 1;
                        return (
                          <div key={i} className="char-palette-node">
                            <div
                              className="char-palette-dot"
                              style={{ background: usage.color, boxShadow: `0 0 8px ${usage.color}` }}
                            />
                            <div className="char-palette-node-info">
                              <div className="char-palette-node-act">ACT {usage.actId}</div>
                              <div className="char-palette-node-note">{usage.note}</div>
                            </div>
                            {!isLast && (
                              <div
                                className="char-palette-line"
                                style={{
                                  background: `linear-gradient(180deg, ${usage.color} 0%, ${char.sceneUsage[i + 1]?.color ?? usage.color} 100%)`,
                                }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* LUT 风格 */}
          {activeSection === 'lut' && (
            <section className="color-section anim-fade-in-up">
              <div className="lut-intro">
                <h2 className="section-title">LUT STYLES · 调色风格</h2>
                <p className="lut-intro-text">
                  4 套核心 LUT 风格。LUT（Look-Up Table）定义了画面的整体色彩走向——从高光、阴影到中间调。
                </p>
              </div>

              <div className="lut-grid">
                {lutStyles.map((lut, idx) => (
                  <div
                    key={lut.id}
                    className="lut-card"
                    style={{
                      '--lut-primary': lut.primaryHue,
                      '--lut-shadow': lut.shadowTint,
                      '--lut-highlight': lut.highlightTint,
                      animationDelay: `${idx * 0.1}s`,
                    } as React.CSSProperties}
                  >
                    {/* LUT 预览 - 三色渐变（阴影→主色→高光） */}
                    <div
                      className="lut-preview"
                      style={{
                        background: `linear-gradient(90deg, ${lut.shadowTint} 0%, ${lut.primaryHue} 50%, ${lut.highlightTint} 100%)`,
                      }}
                    >
                      <div className="lut-preview-marks">
                        <div className="lut-mark left">SHADOW</div>
                        <div className="lut-mark center">MIDTONE</div>
                        <div className="lut-mark right">HIGHLIGHT</div>
                      </div>
                    </div>

                    <div className="lut-body">
                      <h3 className="lut-name">{lut.name}</h3>
                      <p className="lut-description">{lut.description}</p>

                      <div className="lut-params">
                        <div className="lut-param">
                          <span className="lut-param-label">CONTRAST</span>
                          <div className="lut-param-bar">
                            <div
                              className="lut-param-fill"
                              style={{
                                width: lut.contrast === 'extreme' ? '100%' : lut.contrast === 'high' ? '75%' : lut.contrast === 'medium' ? '50%' : '25%',
                                background: lut.contrast === 'extreme' ? '#ff3838' : lut.contrast === 'high' ? '#ff6b35' : lut.contrast === 'medium' ? '#d4af37' : '#74b9ff',
                              }}
                            />
                          </div>
                          <span className="lut-param-value">{lut.contrast.toUpperCase()}</span>
                        </div>
                        <div className="lut-param">
                          <span className="lut-param-label">SATURATION</span>
                          <div className="lut-param-bar">
                            <div
                              className="lut-param-fill"
                              style={{
                                width: lut.saturation === 'high' ? '100%' : lut.saturation === 'medium' ? '50%' : '25%',
                                background: lut.saturation === 'high' ? '#ff6b35' : lut.saturation === 'medium' ? '#d4af37' : '#74b9ff',
                              }}
                            />
                          </div>
                          <span className="lut-param-value">{lut.saturation.toUpperCase()}</span>
                        </div>
                      </div>

                      <div className="lut-usecases">
                        <div className="lut-usecases-label">适用场景</div>
                        <div className="lut-usecases-list">
                          {lut.useCases.map((uc, i) => (
                            <span key={i} className="lut-usecase-tag">
                              {uc}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="lut-ref">
                        <Sun size={12} style={{ color: lut.primaryHue }} />
                        <span>{lut.reference}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
