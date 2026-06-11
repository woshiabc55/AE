import { Link } from 'react-router-dom';
import { ArrowRight, Clock } from 'lucide-react';
import { chapters } from '../data/storyboardData';

export default function ChapterNav() {
  return (
    <section className="chapter-nav">
      <div className="chapter-nav-header">
        <span className="chapter-nav-label">CHAPTER INDEX</span>
        <h2 className="chapter-nav-title">六幕 · SIX ACTS</h2>
      </div>

      <div className="chapter-grid">
        {chapters.map((chapter, idx) => (
          <Link
            key={chapter.id}
            to={`/chapter/${chapter.id}`}
            className="chapter-card anim-fade-in-up"
            style={{
              color: chapter.accentColor,
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            <div className="chapter-card-number">{chapter.id.toString().padStart(2, '0')}</div>

            <div className="chapter-card-content">
              <div className="chapter-card-meta">
                <span className="chapter-card-glyph">{chapter.glyph}</span>
                <span>·</span>
                <span>ACT {chapter.id.toString().padStart(2, '0')}</span>
              </div>

              <h3 className="chapter-card-title">{chapter.title}</h3>
              <p className="chapter-card-subtitle">{chapter.subtitle}</p>
              <p className="chapter-card-theme">{chapter.theme}</p>

              <div className="chapter-card-footer">
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={12} />
                  {chapter.duration} · {chapter.shots.length} SHOTS
                </span>
                <ArrowRight size={14} className="chapter-card-arrow" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="section-divider" />
    </section>
  );
}
