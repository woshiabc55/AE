import { useState } from 'react';
import { Link } from 'react-router-dom';
import { worldLore, type WorldLore } from '../data/scriptData';
import { ChevronLeft, Mountain, History, Sparkles, Cpu, Heart, Map } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const categoryMap: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  geography: { label: '地理', color: '#74b9ff', icon: <Mountain size={14} /> },
  history: { label: '历史', color: '#d4af37', icon: <History size={14} /> },
  mythology: { label: '神话', color: '#a29bfe', icon: <Sparkles size={14} /> },
  technology: { label: '科技', color: '#ff6b35', icon: <Cpu size={14} /> },
  culture: { label: '文化', color: '#fd79a8', icon: <Heart size={14} /> },
};

export default function WorldLorePage() {
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  const [activeLore, setActiveLore] = useState<WorldLore | null>(null);

  const filteredLore = activeCategory === 'all' ? worldLore : worldLore.filter((l) => l.category === activeCategory);

  return (
    <>
      <ParticleBackground />
      <div className="worldlore-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · WORLD BIBLE</div>
        <div className="imax-label imax-label-bottom">{worldLore.length} ENTRIES · BIBLIOGRAPHY</div>

        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Map size={12} />
              <span>WORLD LORE BIBLE</span>
            </div>
            <h1 className="timeline-title">世界观 · THE WORLD</h1>
            <p className="timeline-desc">
              神话不是故事，神话是已经发生过的事。一千年前，一位农夫封印了虚空。
            </p>
          </header>

          {/* 分类筛选 */}
          <div className="lore-categories anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <button
              className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
              type="button"
            >
              <span>全部</span>
              <span className="category-count">{worldLore.length}</span>
            </button>
            {Object.entries(categoryMap).map(([key, info]) => {
              const count = worldLore.filter((l) => l.category === key).length;
              return (
                <button
                  key={key}
                  className={`category-btn ${activeCategory === key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(key)}
                  type="button"
                  style={{ '--cat-color': info.color } as React.CSSProperties}
                >
                  {info.icon}
                  <span>{info.label}</span>
                  <span className="category-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* 时间线视图 */}
          <section className="lore-timeline-section anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">LORE TIMELINE · 时间轴</h2>
            <div className="lore-timeline">
              {filteredLore.map((lore, idx) => {
                const info = categoryMap[lore.category];
                return (
                  <div
                    key={lore.id}
                    className="lore-timeline-item"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    <div className="lore-era">{lore.era ?? '永恒'}</div>
                    <div className="lore-timeline-dot" style={{ background: info?.color ?? '#d4af37' }} />
                    <div className="lore-card" onClick={() => setActiveLore(lore)}>
                      <div className="lore-card-category" style={{ color: info?.color }}>
                        {info?.icon}
                        {info?.label}
                      </div>
                      <h3 className="lore-card-title">{lore.title}</h3>
                      <p className="lore-card-content">{lore.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 词条网格 */}
          <section className="lore-grid-section anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="section-title">LORE GRID · 词条网格</h2>
            <div className="lore-grid">
              {filteredLore.map((lore, idx) => {
                const info = categoryMap[lore.category];
                return (
                  <div
                    key={lore.id}
                    className="lore-grid-card"
                    style={{
                      '--cat-color': info?.color ?? '#d4af37',
                      animationDelay: `${idx * 0.06}s`,
                    } as React.CSSProperties}
                    onClick={() => setActiveLore(lore)}
                  >
                    <div className="lore-grid-card-header">
                      <div className="lore-grid-category">
                        {info?.icon}
                        <span>{info?.label}</span>
                      </div>
                      <div className="lore-grid-era">{lore.era ?? '永恒'}</div>
                    </div>
                    <h3 className="lore-grid-title">{lore.title}</h3>
                    <p className="lore-grid-content">{lore.content}</p>
                    <div className="lore-grid-arrow">→</div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {activeLore && (
          <div className="lore-modal" onClick={() => setActiveLore(null)}>
            <div className="lore-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setActiveLore(null)} type="button">
                ✕
              </button>
              <div className="lore-modal-category">
                {categoryMap[activeLore.category]?.icon}
                {categoryMap[activeLore.category]?.label}
              </div>
              <div className="lore-modal-era">{activeLore.era ?? '永恒'}</div>
              <h2 className="lore-modal-title">{activeLore.title}</h2>
              <p className="lore-modal-content-text">{activeLore.content}</p>
              <div className="lore-modal-footer">
                <div className="lore-modal-meta">
                  <span>WORLD BIBLE</span>
                  <span>·</span>
                  <span>ENTRY {activeLore.id.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
