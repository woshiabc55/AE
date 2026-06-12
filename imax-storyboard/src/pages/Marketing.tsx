import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  taglines,
  posterConcepts,
  targetAudiences,
  marketingTimeline,
  festivalStrategy,
} from '../data/scriptData';
import {
  ChevronLeft,
  Megaphone,
  Image as ImageIcon,
  Users,
  CalendarDays,
  Award,
  Quote,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const stageLabel = (s: string) => {
  const map: Record<string, string> = {
    teaser: '预热',
    main: '正式',
    character: '角色',
    final: '终极',
  };
  return map[s] ?? s;
};

const relevanceColor = (r: string) => {
  switch (r) {
    case 'high':
      return '#ff3838';
    case 'medium':
      return '#d4af37';
    case 'low':
      return '#74b9ff';
    default:
      return '#74b9ff';
  }
};

export default function Marketing() {
  const [activeSection, setActiveSection] = useState<'taglines' | 'posters' | 'audiences' | 'timeline' | 'festival'>('taglines');

  return (
    <>
      <ParticleBackground />
      <div className="mkt-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · MARKETING & DISTRIBUTION</div>
        <div className="imax-label imax-label-bottom">
          {taglines.length} TAGLINES · {posterConcepts.length} POSTERS · {marketingTimeline.length} PHASES
        </div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Megaphone size={12} />
              <span>MARKETING & DISTRIBUTION</span>
            </div>
            <h1 className="timeline-title">营销与发行 · MARKETING & DISTRIBUTION</h1>
            <p className="timeline-desc">
              6 句式一句线、3 版概念海报、4 类目标受众、5 阶段传播计划、5 个电影节策略——
              从"造梦"到"造梦者"。120 分钟的银幕故事需要 6 个月的银幕外经营。
            </p>
          </header>

          {/* 5 大板块 */}
          <div className="mkt-tabs anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <button
              className={`mkt-tab ${activeSection === 'taglines' ? 'active' : ''}`}
              onClick={() => setActiveSection('taglines')}
              type="button"
            >
              <Quote size={14} />
              <span>一句线 · TAGLINES</span>
            </button>
            <button
              className={`mkt-tab ${activeSection === 'posters' ? 'active' : ''}`}
              onClick={() => setActiveSection('posters')}
              type="button"
            >
              <ImageIcon size={14} />
              <span>概念海报 · POSTERS</span>
            </button>
            <button
              className={`mkt-tab ${activeSection === 'audiences' ? 'active' : ''}`}
              onClick={() => setActiveSection('audiences')}
              type="button"
            >
              <Users size={14} />
              <span>受众画像 · AUDIENCE</span>
            </button>
            <button
              className={`mkt-tab ${activeSection === 'timeline' ? 'active' : ''}`}
              onClick={() => setActiveSection('timeline')}
              type="button"
            >
              <CalendarDays size={14} />
              <span>传播计划 · TIMELINE</span>
            </button>
            <button
              className={`mkt-tab ${activeSection === 'festival' ? 'active' : ''}`}
              onClick={() => setActiveSection('festival')}
              type="button"
            >
              <Award size={14} />
              <span>电影节 · FESTIVAL</span>
            </button>
          </div>

          {/* 一句线 */}
          {activeSection === 'taglines' && (
            <section className="mkt-section anim-fade-in-up">
              <div className="mkt-section-intro">
                <h2 className="section-title">TAGLINES · 一句线</h2>
                <p className="mkt-intro-text">
                  6 句式一句线，覆盖 5 种受众、3 种语言。同一个故事，针对不同观众用不同钥匙。
                </p>
              </div>

              <div className="tagline-grid">
                {taglines.map((tag, idx) => (
                  <div
                    key={tag.id}
                    className="tagline-card"
                    style={{
                      animationDelay: `${idx * 0.08}s`,
                    } as React.CSSProperties}
                  >
                    <div className="tagline-version">
                      <span className="tagline-version-num">v{idx + 1}</span>
                      <span className="tagline-version-name">{tag.version}</span>
                      <span className="tagline-lang">{tag.language}</span>
                    </div>

                    <div className="tagline-text-wrap">
                      <Quote size={24} className="tagline-quote-icon" />
                      <div className="tagline-text">{tag.text}</div>
                      {tag.englishText && (
                        <div className="tagline-text-en">{tag.englishText}</div>
                      )}
                    </div>

                    <div className="tagline-meta">
                      <div className="tagline-meta-row">
                        <span className="tagline-meta-label">TONE 调性</span>
                        <span className="tagline-meta-value">{tag.tone}</span>
                      </div>
                      <div className="tagline-meta-row">
                        <span className="tagline-meta-label">TARGET 受众</span>
                        <span className="tagline-meta-value">{tag.target}</span>
                      </div>
                    </div>

                    <p className="tagline-desc">{tag.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 概念海报 */}
          {activeSection === 'posters' && (
            <section className="mkt-section anim-fade-in-up">
              <div className="mkt-section-intro">
                <h2 className="section-title">POSTER CONCEPTS · 概念海报</h2>
                <p className="mkt-intro-text">
                  3 版概念海报——核心向（守望者）、动作向（神战）、奖项向（三千年）。
                </p>
              </div>

              <div className="poster-grid">
                {posterConcepts.map((poster, idx) => (
                  <div
                    key={poster.id}
                    className="poster-card"
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                    } as React.CSSProperties}
                  >
                    {/* 海报预览区 */}
                    <div
                      className="poster-preview"
                      style={{
                        background: `linear-gradient(135deg, ${poster.colorScheme.primary} 0%, ${poster.colorScheme.secondary} 70%, ${poster.colorScheme.accent} 100%)`,
                      }}
                    >
                      <div className="poster-stage-badge">{stageLabel(poster.releaseStage)}</div>
                      <div className="poster-title">
                        <div className="poster-title-main">对决</div>
                        <div className="poster-title-sub">DUEL</div>
                      </div>
                      <div className="poster-visual-desc">{poster.visual}</div>
                    </div>

                    <div className="poster-body">
                      <h3 className="poster-name">{poster.name}</h3>

                      <div className="poster-specs">
                        <div className="poster-spec">
                          <span className="poster-spec-label">TYPOGRAPHY 字体</span>
                          <p className="poster-spec-text">{poster.typography}</p>
                        </div>
                        <div className="poster-spec">
                          <span className="poster-spec-label">COMPOSITION 构图</span>
                          <p className="poster-spec-text">{poster.composition}</p>
                        </div>
                      </div>

                      <div className="poster-elements">
                        <span className="poster-elements-label">KEY ELEMENTS 元素</span>
                        <div className="poster-elements-list">
                          {poster.keyElements.map((el, i) => (
                            <span key={i} className="poster-element-tag">
                              {el}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="poster-tags-row">
                        <div className="poster-tag-block">
                          <span className="poster-tag-label">EMOTION 情绪</span>
                          <span className="poster-tag-value">{poster.emotion}</span>
                        </div>
                        <div className="poster-tag-block">
                          <span className="poster-tag-label">AUDIENCE 受众</span>
                          <span className="poster-tag-value">{poster.targetAudience}</span>
                        </div>
                      </div>

                      {/* 配色色板 */}
                      <div className="poster-palette">
                        <div
                          className="poster-swatch"
                          style={{ background: poster.colorScheme.primary }}
                          title={poster.colorScheme.primary}
                        />
                        <div
                          className="poster-swatch"
                          style={{ background: poster.colorScheme.secondary }}
                          title={poster.colorScheme.secondary}
                        />
                        <div
                          className="poster-swatch"
                          style={{ background: poster.colorScheme.accent }}
                          title={poster.colorScheme.accent}
                        />
                        <div className="poster-palette-hex">
                          {poster.colorScheme.primary} / {poster.colorScheme.secondary} / {poster.colorScheme.accent}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 受众画像 */}
          {activeSection === 'audiences' && (
            <section className="mkt-section anim-fade-in-up">
              <div className="mkt-section-intro">
                <h2 className="section-title">TARGET AUDIENCE · 受众画像</h2>
                <p className="mkt-intro-text">
                  4 个核心受众分层，总预期占比 100%。每个分层都有专属渠道、价格敏感度、观看动机。
                </p>
              </div>

              <div className="audience-grid">
                {targetAudiences.map((aud, idx) => (
                  <div
                    key={aud.id}
                    className="audience-card"
                    style={{
                      '--aud-color': aud.color,
                      animationDelay: `${idx * 0.08}s`,
                    } as React.CSSProperties}
                  >
                    <div className="audience-header">
                      <h3 className="audience-segment">{aud.segment}</h3>
                      <div className="audience-share" style={{ borderColor: aud.color }}>
                        <span className="audience-share-value">{aud.expectedShare}%</span>
                        <span className="audience-share-label">预期占比</span>
                      </div>
                    </div>

                    <div className="audience-stats">
                      <div className="audience-stat">
                        <span className="audience-stat-label">AGE 年龄</span>
                        <span className="audience-stat-value">{aud.ageRange}</span>
                      </div>
                      <div className="audience-stat">
                        <span className="audience-stat-label">GENDER 性别</span>
                        <span className="audience-stat-value">{aud.gender}</span>
                      </div>
                      <div className="audience-stat">
                        <span className="audience-stat-label">TICKET 票价</span>
                        <span className="audience-stat-value">{aud.ticketPrice}</span>
                      </div>
                    </div>

                    <div className="audience-section">
                      <div className="audience-section-label">INTERESTS 兴趣</div>
                      <div className="audience-tags">
                        {aud.interests.map((int, i) => (
                          <span key={i} className="audience-tag">
                            {int}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="audience-section">
                      <div className="audience-section-label">MOTIVATIONS 动机</div>
                      <ul className="audience-motivation-list">
                        {aud.motivations.map((m, i) => (
                          <li key={i} className="audience-motivation-item">
                            <span className="audience-motivation-bullet" style={{ background: aud.color }} />
                            {m}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="audience-section">
                      <div className="audience-section-label">CHANNELS 渠道</div>
                      <div className="audience-tags">
                        {aud.channels.map((c, i) => (
                          <span key={i} className="audience-tag-channel" style={{ borderColor: aud.color, color: aud.color }}>
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="audience-hook" style={{ background: `${aud.color}10`, borderColor: aud.color }}>
                      <Sparkles size={12} style={{ color: aud.color }} />
                      <span>{aud.hookLine}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 传播计划 */}
          {activeSection === 'timeline' && (
            <section className="mkt-section anim-fade-in-up">
              <div className="mkt-section-intro">
                <h2 className="section-title">MARKETING TIMELINE · 6 个月传播计划</h2>
                <p className="mkt-intro-text">
                  从开机前 6 月到上映月——5 个阶段。预算分配 10% / 15% / 25% / 30% / 20%。
                </p>
              </div>

              {/* 预算饼条 */}
              <div className="mkt-budget-bar">
                {marketingTimeline.map((phase, idx) => {
                  const colors = ['#74b9ff', '#d4af37', '#a29bfe', '#ff6b35', '#ff3838'];
                  return (
                    <div
                      key={phase.id}
                      className="mkt-budget-segment"
                      style={{
                        width: `${phase.budgetShare}%`,
                        background: colors[idx],
                      }}
                      title={`${phase.phaseName}: ${phase.budgetShare}%`}
                    >
                      <span className="mkt-budget-text">{phase.budgetShare}%</span>
                    </div>
                  );
                })}
              </div>

              <div className="timeline-grid">
                {marketingTimeline.map((phase, idx) => {
                  const colors = ['#74b9ff', '#d4af37', '#a29bfe', '#ff6b35', '#ff3838'];
                  return (
                    <div
                      key={phase.id}
                      className="timeline-card"
                      style={{
                        borderColor: colors[idx],
                        animationDelay: `${idx * 0.1}s`,
                      } as React.CSSProperties}
                    >
                      <div className="timeline-card-header">
                        <div className="timeline-month">
                          <TrendingUp size={12} style={{ color: colors[idx] }} />
                          <span>{phase.month}</span>
                        </div>
                        <h3 className="timeline-phase-name">{phase.phaseName}</h3>
                        <div
                          className="timeline-budget-tag"
                          style={{ background: `${colors[idx]}20`, color: colors[idx], borderColor: colors[idx] }}
                        >
                          {phase.budgetShare}%
                        </div>
                      </div>

                      <div className="timeline-focus">
                        <span className="timeline-focus-label">FOCUS 重点</span>
                        <span className="timeline-focus-text">{phase.focus}</span>
                      </div>

                      <div className="timeline-section">
                        <div className="timeline-section-label">ACTIVITIES 活动</div>
                        <ul className="timeline-list">
                          {phase.activities.map((a, i) => (
                            <li key={i} className="timeline-list-item">
                              {a}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="timeline-section">
                        <div className="timeline-section-label">CHANNELS 渠道</div>
                        <div className="timeline-tags">
                          {phase.channels.map((c, i) => (
                            <span key={i} className="timeline-tag">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="timeline-section">
                        <div className="timeline-section-label">KPIs 关键指标</div>
                        <ul className="timeline-list timeline-list-kpi">
                          {phase.kpis.map((k, i) => (
                            <li key={i} className="timeline-list-item">
                              {k}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="timeline-section">
                        <div className="timeline-section-label">MILESTONES 关键节点</div>
                        <div className="timeline-milestones">
                          {phase.milestones.map((m, i) => (
                            <span key={i} className="timeline-milestone" style={{ color: colors[idx] }}>
                              ◆ {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 电影节策略 */}
          {activeSection === 'festival' && (
            <section className="mkt-section anim-fade-in-up">
              <div className="mkt-section-intro">
                <h2 className="section-title">FESTIVAL STRATEGY · 电影节策略</h2>
                <p className="mkt-intro-text">
                  5 个 A 类电影节 + 奥斯卡奖项冲刺。电影节口碑是奖项与长线票房的双重保险。
                </p>
              </div>

              <div className="fest-grid">
                {festivalStrategy.map((fest, idx) => (
                  <div
                    key={fest.id}
                    className="fest-card"
                    style={{
                      animationDelay: `${idx * 0.08}s`,
                    } as React.CSSProperties}
                  >
                    <div className="fest-header">
                      <div
                        className="fest-type-badge"
                        style={{
                          color: relevanceColor(fest.relevance),
                          borderColor: relevanceColor(fest.relevance),
                        }}
                      >
                        {fest.type}
                      </div>
                      <div className="fest-relevance" style={{ color: relevanceColor(fest.relevance) }}>
                        相关度 {fest.relevance.toUpperCase()}
                      </div>
                    </div>

                    <h3 className="fest-name">{fest.festival}</h3>
                    <div className="fest-timing">{fest.timing}</div>

                    <div className="fest-strategy">
                      <span className="fest-strategy-label">STRATEGY 策略</span>
                      <span className="fest-strategy-value">
                        {fest.strategy === 'premiere' && '🌟 全球首映'}
                        {fest.strategy === 'competition' && '🏆 主竞赛'}
                        {fest.strategy === 'special-screening' && '✨ 特别展映'}
                        {fest.strategy === 'market' && '💼 市场放映'}
                      </span>
                    </div>

                    <div className="fest-section">
                      <div className="fest-section-label">EXPECTED OUTCOME 预期成果</div>
                      <p className="fest-section-text">{fest.expectedOutcome}</p>
                    </div>

                    <div className="fest-section">
                      <div className="fest-section-label">HISTORICAL 历年情况</div>
                      <p className="fest-section-text fest-section-historical">{fest.historical}</p>
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
