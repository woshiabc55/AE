import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  script as defaultScript,
  vfxShots,
  vfxAssets,
  vfxDisciplines,
  renderPipeline,
  type Script,
} from '../data/scriptData';
import {
  ChevronLeft,
  Wand2,
  Cpu,
  Box,
  Layers as LayersIcon,
  Zap,
  Sparkles,
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const complexityColor = (c: string) => {
  switch (c) {
    case 'extreme':
      return '#ff3838';
    case 'complex':
      return '#ff6b35';
    case 'medium':
      return '#d4af37';
    case 'simple':
      return '#74b9ff';
    default:
      return '#74b9ff';
  }
};

const complexityLabel = (c: string) => {
  switch (c) {
    case 'extreme':
      return '极难 EXTREME';
    case 'complex':
      return '复杂 COMPLEX';
    case 'medium':
      return '中等 MEDIUM';
    case 'simple':
      return '简单 SIMPLE';
    default:
      return c.toUpperCase();
  }
};

const elementLabel = (el: string) => {
  const map: Record<string, string> = {
    creature: '生物',
    environment: '环境',
    particle: '粒子',
    simulation: '解算',
    atmosphere: '氛围',
    'digital-double': '数字替身',
    prop: '道具',
    fx: '特效',
  };
  return map[el] ?? el;
};

const assetCategoryLabel = (c: string) => {
  const map: Record<string, string> = {
    creature: '生物',
    environment: '环境',
    prop: '道具',
    fx: '特效',
  };
  return map[c] ?? c;
};

export default function VFXBreakdown() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeSection, setActiveSection] = useState<'shots' | 'assets' | 'disciplines' | 'pipeline'>('shots');
  const [activeComplexity, setActiveComplexity] = useState<string>('all');
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

  const filteredShots = useMemo(() => {
    return vfxShots.filter((s) => {
      if (activeComplexity !== 'all' && s.complexity !== activeComplexity) return false;
      if (activeAct !== 0 && s.actId !== activeAct) return false;
      return true;
    });
  }, [activeComplexity, activeAct]);

  const totalRenderHours = vfxShots.reduce((sum, s) => sum + s.estimatedRenderHours, 0);
  const totalLayers = vfxShots.reduce((sum, s) => sum + s.layers, 0);
  const totalArtists = new Set(vfxShots.map((s) => s.artist)).size;

  // 统计各复杂度
  const complexityStats = {
    extreme: vfxShots.filter((s) => s.complexity === 'extreme').length,
    complex: vfxShots.filter((s) => s.complexity === 'complex').length,
    medium: vfxShots.filter((s) => s.complexity === 'medium').length,
    simple: vfxShots.filter((s) => s.complexity === 'simple').length,
  };

  return (
    <>
      <ParticleBackground />
      <div className="vfx-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · VFX BREAKDOWN</div>
        <div className="imax-label imax-label-bottom">
          {vfxShots.length} SHOTS · {totalLayers} LAYERS · {totalRenderHours.toLocaleString()} HRS
        </div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Wand2 size={12} />
              <span>VFX BREAKDOWN</span>
            </div>
            <h1 className="timeline-title">特效镜头分解 · VFX BREAKDOWN</h1>
            <p className="timeline-desc">
              12 个关键 CG 镜头、4 个主资产、6 大学科、8 阶段渲染管线——从概念到最终像素。
              WETA 的《指环王》、ILM 的《复仇者联盟》、DNEG 的《沙丘》——每一种 IMAX 巨兽的诞生都凝聚了上千小时的人力与渲染。
            </p>
          </header>

          {/* 顶部统计 */}
          <div className="vfx-stats anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="vfx-stat">
              <Sparkles size={20} style={{ color: '#ff3838' }} />
              <div>
                <div className="vfx-stat-value">{vfxShots.length}</div>
                <div className="vfx-stat-label">VFX 镜头 / SHOTS</div>
              </div>
            </div>
            <div className="vfx-stat">
              <LayersIcon size={20} style={{ color: '#d4af37' }} />
              <div>
                <div className="vfx-stat-value">{totalLayers.toLocaleString()}</div>
                <div className="vfx-stat-label">渲染图层 / LAYERS</div>
              </div>
            </div>
            <div className="vfx-stat">
              <Zap size={20} style={{ color: '#ff6b35' }} />
              <div>
                <div className="vfx-stat-value">{totalRenderHours.toLocaleString()}</div>
                <div className="vfx-stat-label">渲染小时 / HRS</div>
              </div>
            </div>
            <div className="vfx-stat">
              <Cpu size={20} style={{ color: '#74b9ff' }} />
              <div>
                <div className="vfx-stat-value">{totalArtists}</div>
                <div className="vfx-stat-label">主艺术家 / ARTISTS</div>
              </div>
            </div>
            <div className="vfx-stat">
              <Box size={20} style={{ color: '#a29bfe' }} />
              <div>
                <div className="vfx-stat-value">{vfxAssets.length}</div>
                <div className="vfx-stat-label">主资产 / ASSETS</div>
              </div>
            </div>
          </div>

          {/* 复杂度分布 */}
          <div className="vfx-complexity-bar anim-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <span className="vfx-complexity-label">复杂度分布</span>
            <div className="vfx-complexity-segments">
              {(['extreme', 'complex', 'medium', 'simple'] as const).map((c) => {
                const count = complexityStats[c];
                const percent = vfxShots.length > 0 ? (count / vfxShots.length) * 100 : 0;
                return (
                  <div
                    key={c}
                    className="vfx-complexity-segment"
                    style={{
                      width: `${percent}%`,
                      background: complexityColor(c),
                    }}
                    title={`${complexityLabel(c)}: ${count} 镜头`}
                  >
                    {percent > 12 && <span className="vfx-complexity-text">{count}</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4 大板块 */}
          <div className="vfx-tabs anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <button
              className={`vfx-tab ${activeSection === 'shots' ? 'active' : ''}`}
              onClick={() => setActiveSection('shots')}
              type="button"
            >
              <Sparkles size={14} />
              <span>镜头分解 · SHOTS</span>
            </button>
            <button
              className={`vfx-tab ${activeSection === 'assets' ? 'active' : ''}`}
              onClick={() => setActiveSection('assets')}
              type="button"
            >
              <Box size={14} />
              <span>主资产 · ASSETS</span>
            </button>
            <button
              className={`vfx-tab ${activeSection === 'disciplines' ? 'active' : ''}`}
              onClick={() => setActiveSection('disciplines')}
              type="button"
            >
              <Cpu size={14} />
              <span>学科 · DISCIPLINES</span>
            </button>
            <button
              className={`vfx-tab ${activeSection === 'pipeline' ? 'active' : ''}`}
              onClick={() => setActiveSection('pipeline')}
              type="button"
            >
              <LayersIcon size={14} />
              <span>渲染管线 · PIPELINE</span>
            </button>
          </div>

          {/* 镜头分解 */}
          {activeSection === 'shots' && (
            <section className="vfx-section anim-fade-in-up">
              <div className="vfx-filters">
                <span className="filter-label">复杂度</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${activeComplexity === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveComplexity('all')}
                    type="button"
                  >
                    全部 ({vfxShots.length})
                  </button>
                  {(['extreme', 'complex', 'medium', 'simple'] as const).map((c) => (
                    <button
                      key={c}
                      className={`filter-btn ${activeComplexity === c ? 'active' : ''}`}
                      onClick={() => setActiveComplexity(c)}
                      type="button"
                      style={
                        activeComplexity === c
                          ? { borderColor: complexityColor(c), color: complexityColor(c) }
                          : {}
                      }
                    >
                      {complexityLabel(c)} ({complexityStats[c]})
                    </button>
                  ))}
                </div>
                <span className="filter-label" style={{ marginLeft: 'var(--space-4)' }}>幕</span>
                <div className="filter-buttons">
                  <button
                    className={`filter-btn ${activeAct === 0 ? 'active' : ''}`}
                    onClick={() => setActiveAct(0)}
                    type="button"
                  >
                    全部
                  </button>
                  {script.acts.map((act) => (
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
                      {act.glyph} ACT {act.id}
                    </button>
                  ))}
                </div>
              </div>

              <div className="vfxshot-grid">
                {filteredShots.map((shot, idx) => {
                  const totalHrs = shot.estimatedRenderHours;
                  return (
                    <div
                      key={shot.id}
                      className="vfxshot-card"
                      style={{
                        borderColor: complexityColor(shot.complexity),
                        animationDelay: `${idx * 0.05}s`,
                      } as React.CSSProperties}
                    >
                      <div className="vfxshot-header">
                        <div className="vfxshot-id">
                          <span className="vfxshot-act">ACT {shot.actId.toString().padStart(2, '0')}</span>
                          <span className="vfxshot-num">SHOT #{shot.shotId.toString().padStart(2, '0')}</span>
                        </div>
                        <div
                          className="vfxshot-complexity"
                          style={{
                            color: complexityColor(shot.complexity),
                            borderColor: complexityColor(shot.complexity),
                          }}
                        >
                          {complexityLabel(shot.complexity)}
                        </div>
                      </div>

                      <p className="vfxshot-desc">{shot.description}</p>

                      <div className="vfxshot-elements">
                        {shot.elements.map((el, i) => (
                          <span key={i} className="vfxshot-element-tag">
                            {elementLabel(el)}
                          </span>
                        ))}
                      </div>

                      <div className="vfxshot-metrics">
                        <div className="vfxshot-metric">
                          <span className="vfxshot-metric-label">渲染</span>
                          <span className="vfxshot-metric-value">{totalHrs.toLocaleString()}h</span>
                        </div>
                        <div className="vfxshot-metric">
                          <span className="vfxshot-metric-label">图层</span>
                          <span className="vfxshot-metric-value">{shot.layers}</span>
                        </div>
                        <div className="vfxshot-metric">
                          <span className="vfxshot-metric-label">负责</span>
                          <span className="vfxshot-metric-value vfxshot-artist">{shot.artist}</span>
                        </div>
                      </div>

                      <div className="vfxshot-breakdown">
                        <div className="vfxshot-breakdown-label">工时分配</div>
                        <div className="vfxshot-breakdown-bar">
                          {Object.entries(shot.breakdown).map(([key, val]) => {
                            const colors: Record<string, string> = {
                              modeling: '#74b9ff',
                              texturing: '#a29bfe',
                              rigging: '#1dd1a1',
                              animation: '#d4af37',
                              lookdev: '#f368e0',
                              lighting: '#f4d03f',
                              render: '#ff6b35',
                              comp: '#ff3838',
                            };
                            return (
                              <div
                                key={key}
                                className="vfxshot-breakdown-seg"
                                style={{ width: `${val}%`, background: colors[key] }}
                                title={`${key}: ${val}%`}
                              />
                            );
                          })}
                        </div>
                        <div className="vfxshot-breakdown-legend">
                          {Object.entries(shot.breakdown)
                            .filter(([, v]) => v >= 8)
                            .map(([key]) => {
                              const labels: Record<string, string> = {
                                modeling: '建模',
                                texturing: '材质',
                                rigging: '绑定',
                                animation: '动画',
                                lookdev: '预览',
                                lighting: '灯光',
                                render: '渲染',
                                comp: '合成',
                              };
                              return (
                                <span key={key} className="vfxshot-breakdown-legend-item">
                                  {labels[key]} {shot.breakdown[key as keyof typeof shot.breakdown]}%
                                </span>
                              );
                            })}
                        </div>
                      </div>

                      <div className="vfxshot-tools">
                        {shot.tools.map((tool, i) => (
                          <span key={i} className="vfxshot-tool-tag">
                            {tool}
                          </span>
                        ))}
                      </div>

                      <div className="vfxshot-ref">
                        <span className="vfxshot-ref-label">REF</span>
                        <span className="vfxshot-ref-value">{shot.reference}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* 主资产 */}
          {activeSection === 'assets' && (
            <section className="vfx-section anim-fade-in-up">
              <div className="asset-intro">
                <h2 className="section-title">HERO ASSETS · 主资产</h2>
                <p className="asset-intro-text">
                  4 个核心 CG 资产。每一个都经过概念设计、模型、绑定、材质、动画的完整制作周期。
                </p>
              </div>

              <div className="asset-grid">
                {vfxAssets.map((asset, idx) => (
                  <div
                    key={asset.id}
                    className="asset-card"
                    style={{
                      animationDelay: `${idx * 0.1}s`,
                    } as React.CSSProperties}
                  >
                    <div className="asset-card-header">
                      <div
                        className="asset-category-badge"
                        data-category={asset.category}
                      >
                        {assetCategoryLabel(asset.category)}
                      </div>
                      <h3 className="asset-name">{asset.name}</h3>
                      <div className="asset-build-time">{asset.buildTime} 制作</div>
                    </div>

                    <p className="asset-desc">{asset.description}</p>

                    <div className="asset-specs">
                      <div className="asset-spec">
                        <span className="asset-spec-label">SCALE 尺寸</span>
                        <span className="asset-spec-value">{asset.scale}</span>
                      </div>
                      <div className="asset-spec">
                        <span className="asset-spec-label">POLY 多边形</span>
                        <span className="asset-spec-value">{asset.polyCount}</span>
                      </div>
                      <div className="asset-spec">
                        <span className="asset-spec-label">TEX 贴图</span>
                        <span className="asset-spec-value">{asset.textureRes}</span>
                      </div>
                    </div>

                    <div className="asset-rigging">
                      <span className="asset-rigging-label">RIG 绑定</span>
                      <p className="asset-rigging-text">{asset.riggingNotes}</p>
                    </div>

                    <div className="asset-refs">
                      <div className="asset-refs-label">REFERENCES 参考</div>
                      <div className="asset-refs-list">
                        {asset.references.map((ref, i) => (
                          <span key={i} className="asset-ref-tag">
                            {ref}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 学科 */}
          {activeSection === 'disciplines' && (
            <section className="vfx-section anim-fade-in-up">
              <div className="disc-intro">
                <h2 className="section-title">DISCIPLINES · VFX 学科</h2>
                <p className="disc-intro-text">
                  6 大 VFX 学科共 88 位艺术家参与。Comp（合成）团队最大（22 人），Creature（生物）最具技术挑战。
                </p>
              </div>

              <div className="disc-grid">
                {vfxDisciplines.map((disc, idx) => {
                  const totalShots = vfxShots.length;
                  return (
                    <div
                      key={disc.id}
                      className="disc-card"
                      style={{
                        '--disc-color': disc.color,
                        animationDelay: `${idx * 0.08}s`,
                      } as React.CSSProperties}
                    >
                      <div className="disc-card-header">
                        <div className="disc-icon" style={{ color: disc.color, borderColor: disc.color }}>
                          {disc.icon}
                        </div>
                        <div className="disc-name-block">
                          <h3 className="disc-name">{disc.name}</h3>
                          <div className="disc-chinese">{disc.chineseName}</div>
                        </div>
                        <div className="disc-headcount" style={{ borderColor: disc.color }}>
                          <span className="disc-headcount-value">{disc.headcount}</span>
                          <span className="disc-headcount-label">人</span>
                        </div>
                      </div>

                      <p className="disc-desc">{disc.description}</p>

                      <div className="disc-stats">
                        <div className="disc-stat">
                          <span className="disc-stat-label">镜头数</span>
                          <div className="disc-stat-bar-track">
                            <div
                              className="disc-stat-bar"
                              style={{
                                width: `${(disc.shotCount / totalShots) * 100}%`,
                                background: disc.color,
                              }}
                            />
                          </div>
                          <span className="disc-stat-value">{disc.shotCount}</span>
                        </div>
                      </div>

                      <div className="disc-toolchain">
                        <div className="disc-toolchain-label">TOOL CHAIN 工具链</div>
                        <div className="disc-toolchain-list">
                          {disc.toolChain.map((tool, i) => (
                            <span
                              key={i}
                              className="disc-tool-tag"
                              style={{ borderColor: disc.color, color: disc.color }}
                            >
                              {tool}
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

          {/* 渲染管线 */}
          {activeSection === 'pipeline' && (
            <section className="vfx-section anim-fade-in-up">
              <div className="pipeline-intro">
                <h2 className="section-title">RENDER PIPELINE · 8 阶段渲染管线</h2>
                <p className="pipeline-intro-text">
                  从概念到最终像素——每个镜头平均经过 1320 小时的 8 阶段制作。Render（渲染）耗时最长（600h/镜头）。
                </p>
              </div>

              <div className="pipeline-timeline">
                {renderPipeline.map((stage, idx) => {
                  const maxHours = Math.max(...renderPipeline.map((s) => s.hoursPerShot));
                  return (
                    <div
                      key={stage.id}
                      className="pipeline-stage"
                      style={{
                        animationDelay: `${idx * 0.1}s`,
                      } as React.CSSProperties}
                    >
                      <div className="pipeline-stage-header">
                        <div
                          className="pipeline-icon"
                          style={{ color: stage.color, borderColor: stage.color }}
                        >
                          {stage.icon}
                        </div>
                        <div className="pipeline-stage-info">
                          <div className="pipeline-stage-num">STAGE {String(idx + 1).padStart(2, '0')}</div>
                          <h3 className="pipeline-stage-name">
                            {stage.stage} · {stage.chineseName}
                          </h3>
                        </div>
                        <div
                          className="pipeline-hours"
                          style={{ borderColor: stage.color, color: stage.color }}
                        >
                          <span className="pipeline-hours-value">{stage.hoursPerShot}</span>
                          <span className="pipeline-hours-unit">h/shot</span>
                        </div>
                      </div>

                      <p className="pipeline-desc">{stage.description}</p>

                      <div className="pipeline-bar-track">
                        <div
                          className="pipeline-bar"
                          style={{
                            width: `${(stage.hoursPerShot / maxHours) * 100}%`,
                            background: stage.color,
                          }}
                        />
                      </div>

                      <div className="pipeline-deliverables">
                        <span className="pipeline-deliverables-label">DELIVERABLES</span>
                        <div className="pipeline-deliverables-list">
                          {stage.deliverables.map((d, i) => (
                            <span key={i} className="pipeline-deliverable-tag">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>

                      {idx < renderPipeline.length - 1 && (
                        <div className="pipeline-arrow" style={{ color: stage.color }}>
                          ↓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
