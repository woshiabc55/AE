import { ChevronLeft, Crosshair } from 'lucide-react';
import { Link } from 'react-router-dom';
import { chapters } from '../data/storyboardData';

export default function HeroSection() {
  return (
    <section className="hero">
      <div className="imax-corner imax-corner-tl" />
      <div className="imax-corner imax-corner-tr" />
      <div className="imax-corner imax-corner-bl" />
      <div className="imax-corner imax-corner-br" />
      <div className="imax-label imax-label-top anim-flicker">IMAX · 16:9 · FRAME</div>
      <div className="imax-label imax-label-bottom">SANDBOX · RENDER · 24FPS</div>

      <div className="hero-badge">
        <Crosshair size={12} />
        <span>STORYBOARD / 18 SHOTS / 6 ACTS</span>
      </div>

      <h1 className="hero-title">
        <span className="hero-title-zh">对决</span>
      </h1>

      <p className="hero-subtitle">A DUEL ACROSS THE COSMOS</p>

      <p className="hero-tagline">
        衣衫褴褛的农夫，眨一眨眼便让行星坍缩；
        <br />
        一次出拳，便是宇宙级别的涟漪。
        <br />
        一位种地的老人，一柄无形的炽龙，
        <br />
        对决贯穿星辰之间的神祇巨兽。
      </p>

      <div className="hero-meta">
        <div className="hero-meta-item">
          <span>6</span>
          <span>ACTS</span>
        </div>
        <div className="hero-meta-divider" />
        <div className="hero-meta-item">
          <span>18</span>
          <span>SHOTS</span>
        </div>
        <div className="hero-meta-divider" />
        <div className="hero-meta-item">
          <span>90s</span>
          <span>RUNTIME</span>
        </div>
        <div className="hero-meta-divider" />
        <div className="hero-meta-item">
          <span>4K</span>
          <span>IMAX</span>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>SCROLL TO ENTER</span>
        <div className="scroll-line" />
      </div>

      <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 5 }}>
        <Link
          to={`/chapter/${chapters[0]?.id ?? 1}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--color-gold)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.6,
            transition: 'all 0.3s var(--ease-ink)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '0.6';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
          ENTER FIRST ACT
        </Link>
      </div>
    </section>
  );
}
