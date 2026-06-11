import { useParams, Navigate } from 'react-router-dom';
import { chapters } from '../data/storyboardData';
import BackButton from '../components/BackButton';
import StoryboardTable from '../components/StoryboardTable';
import ParticleBackground from '../components/ParticleBackground';
import { Clock, Crosshair } from 'lucide-react';

export default function ChapterPage() {
  const { id } = useParams<{ id: string }>();
  const chapterId = parseInt(id ?? '1', 10);
  const chapter = chapters.find((c) => c.id === chapterId);

  if (!chapter) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <ParticleBackground />
      <div className="chapter-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · ACT {chapter.id.toString().padStart(2, '0')}</div>
        <div className="imax-label imax-label-bottom">SANDBOX · 16:9 · {chapter.duration}</div>

        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <BackButton to="/" />

          <header className="chapter-header anim-fade-in-up">
            <div className="chapter-header-meta" style={{ color: chapter.accentColor }}>
              <Crosshair size={12} />
              <span>ACT {chapter.id.toString().padStart(2, '0')}</span>
              <span className="chapter-header-meta-divider" />
              <span>{chapter.shots.length} SHOTS</span>
              <span className="chapter-header-meta-divider" />
              <span>{chapter.duration}</span>
            </div>

            <h1 className="chapter-header-title">{chapter.title}</h1>
            <p className="chapter-header-subtitle">{chapter.subtitle}</p>
            <p className="chapter-header-theme">{chapter.theme}</p>

            <div className="chapter-header-duration" style={{ color: chapter.accentColor }}>
              <span className="duration-label">DURATION</span>
              <span className="duration-value">{chapter.duration}</span>
            </div>
          </header>

          <StoryboardTable chapter={chapter} />

          <div
            style={{
              maxWidth: '1400px',
              margin: 'var(--space-20) auto 0',
              padding: 'var(--space-8)',
              border: '1px solid var(--color-ash)',
              background: 'rgba(10, 10, 20, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 'var(--space-4)',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <Clock size={14} style={{ color: 'var(--color-fog)' }} />
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--text-xs)',
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: 'var(--color-fog)',
                }}
              >
                END OF ACT {chapter.id.toString().padStart(2, '0')}
              </span>
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 'var(--text-xs)',
                color: 'var(--color-whisper)',
                letterSpacing: '0.2em',
              }}
            >
              NEXT: {chapter.id < chapters.length ? chapters[chapter.id]?.title : 'THE END'}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
