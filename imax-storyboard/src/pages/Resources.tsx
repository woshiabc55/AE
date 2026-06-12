import { useState } from 'react';
import { Link } from 'react-router-dom';
import { props, costumes, characters } from '../data/scriptData';
import { ChevronLeft, Package, Shirt, Wrench, Sword, FileText, Sparkles, Cpu, Search } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const categoryMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  weapon: { label: '兵器', color: '#ff6b35', icon: <Sword size={14} /> },
  tool: { label: '工具', color: '#d4af37', icon: <Wrench size={14} /> },
  costume: { label: '服装', color: '#fd79a8', icon: <Shirt size={14} /> },
  document: { label: '文档', color: '#74b9ff', icon: <FileText size={14} /> },
  ritual: { label: '法器', color: '#a29bfe', icon: <Sparkles size={14} /> },
  tech: { label: '科技', color: '#00d2d3', icon: <Cpu size={14} /> },
};

export default function Resources() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredProps = props.filter((p) => {
    if (activeCategory !== 'all' && p.category !== activeCategory) return false;
    if (search && !p.name.includes(search) && !p.significance.includes(search)) return false;
    return true;
  });

  const stats = {
    totalProps: props.length,
    totalCostumes: costumes.length,
    totalAppearances: props.reduce((sum, p) => sum + p.appearsIn.length, 0),
  };

  return (
    <>
      <ParticleBackground />
      <div className="resources-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · RESOURCES</div>
        <div className="imax-label imax-label-bottom">{stats.totalProps} PROPS · {stats.totalCostumes} COSTUMES</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Package size={12} />
              <span>PROPS · COSTUMES · WARDROBE</span>
            </div>
            <h1 className="timeline-title">资源清单 · RESOURCES</h1>
            <p className="timeline-desc">
              道具、服装、装备。每一个物件都是叙事的延伸——断潮刀不只是一件兵器，醒田铃不只是一只铃铛。
            </p>
          </header>

          {/* 统计 */}
          <div className="res-stats anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="res-stat">
              <Package size={20} style={{ color: 'var(--color-gold)' }} />
              <div>
                <div className="res-stat-value">{stats.totalProps}</div>
                <div className="res-stat-label">道具 / PROPS</div>
              </div>
            </div>
            <div className="res-stat">
              <Shirt size={20} style={{ color: 'var(--color-pink)' }} />
              <div>
                <div className="res-stat-value">{stats.totalCostumes}</div>
                <div className="res-stat-label">服装 / COSTUMES</div>
              </div>
            </div>
            <div className="res-stat">
              <Sparkles size={20} style={{ color: 'var(--color-purple)' }} />
              <div>
                <div className="res-stat-value">{stats.totalAppearances}</div>
                <div className="res-stat-label">出现总次数</div>
              </div>
            </div>
          </div>

          {/* 搜索 + 分类 */}
          <div className="res-controls anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="res-search">
              <Search size={14} />
              <input
                type="text"
                placeholder="搜索道具..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="res-categories">
              <button
                className={`res-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
                type="button"
              >
                全部 ({props.length})
              </button>
              {Object.entries(categoryMap).map(([key, info]) => {
                const count = props.filter((p) => p.category === key).length;
                return (
                  <button
                    key={key}
                    className={`res-cat-btn ${activeCategory === key ? 'active' : ''}`}
                    onClick={() => setActiveCategory(key)}
                    type="button"
                    style={{ '--cat-color': info.color } as React.CSSProperties}
                  >
                    {info.icon}
                    <span>{info.label}</span>
                    <span className="res-cat-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 道具网格 */}
          <section className="res-section">
            <h2 className="section-title">PROPS · 道具</h2>
            <div className="res-grid">
              {filteredProps.map((prop, idx) => {
                const info = categoryMap[prop.category];
                const ownerChar = characters.find((c) => c.name === prop.owner);
                return (
                  <div
                    key={prop.id}
                    className="res-card"
                    style={{
                      '--cat-color': info?.color ?? '#d4af37',
                      animationDelay: `${idx * 0.05}s`,
                    } as React.CSSProperties}
                  >
                    <div className="res-card-header">
                      <div className="res-card-icon">{info?.icon}</div>
                      <div className="res-card-category" style={{ color: info?.color }}>
                        {info?.label}
                      </div>
                      {prop.estimatedValue && (
                        <div className="res-card-value">{prop.estimatedValue}</div>
                      )}
                    </div>

                    <h3 className="res-card-name">{prop.name}</h3>

                    {ownerChar && (
                      <div className="res-card-owner">
                        <span className="res-owner-label">归属</span>
                        <span className="res-owner-name">{ownerChar.name}</span>
                        <span className="res-owner-alias">{ownerChar.alias}</span>
                      </div>
                    )}

                    <p className="res-card-significance">{prop.significance}</p>

                    <div className="res-card-appears">
                      <div className="res-appears-label">出现于 {prop.appearsIn.length} 个镜头</div>
                      <div className="res-appears-shots">
                        {prop.appearsIn.slice(0, 8).map((id) => (
                          <span key={id} className="res-appears-shot">
                            #{id.toString().padStart(2, '0')}
                          </span>
                        ))}
                        {prop.appearsIn.length > 8 && (
                          <span className="res-appears-shot">+{prop.appearsIn.length - 8}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 服装 */}
          <section className="res-section" style={{ marginTop: 'var(--space-16)' }}>
            <h2 className="section-title">COSTUMES · 服装</h2>
            <div className="costume-grid">
              {costumes.map((costume, idx) => {
                const char = characters.find((c) => c.name === costume.characterName);
                return (
                  <div
                    key={costume.id}
                    className="costume-card anim-fade-in-up"
                    style={{ animationDelay: `${idx * 0.08}s` }}
                  >
                    <div className="costume-card-visual">
                      <div className="costume-glyph">衣</div>
                    </div>
                    <div className="costume-card-info">
                      <div className="costume-character">{costume.characterName}</div>
                      {char && <div className="costume-alias">{char.alias}</div>}
                      <h3 className="costume-outfit">{costume.outfit}</h3>
                      <div className="costume-scenes">
                        <span className="costume-scenes-label">适用场景</span>
                        <span className="costume-scenes-value">{costume.scenes}</span>
                      </div>
                      <p className="costume-details">{costume.details}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
