import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  script as defaultScript,
  generateStoryboardFrame,
  type Script,
  type StoryboardShot,
} from '../data/scriptData';
import { ChevronLeft, Image as ImageIcon, Camera, Crosshair, Download, Check } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const moodColors: Record<string, string> = {
  epic: '#d4af37',
  tense: '#ff6b35',
  mystic: '#a29bfe',
  romantic: '#fd79a8',
  melancholy: '#74b9ff',
  triumphant: '#fdcb6e',
  quiet: '#b2bec3',
};

export default function StoryboardSketch() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeAct, setActiveAct] = useState<number>(1);
  const [selectedShot, setSelectedShot] = useState<StoryboardShot | null>(null);
  const [copied, setCopied] = useState(false);

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

  const act = script.acts.find((a) => a.id === activeAct);

  const frames = useMemo(() => {
    if (!act) return [];
    return act.shots.map((shot) => ({
      shot,
      frame: generateStoryboardFrame(shot.id, shot.scene, shot.camera, shot.mood),
    }));
  }, [act]);

  const handleCopyAll = () => {
    if (!act) return;
    const text = act.shots
      .map((shot) => {
        const frame = generateStoryboardFrame(shot.id, shot.scene, shot.camera, shot.mood);
        return `=== SHOT ${shot.id.toString().padStart(2, '0')} | ${shot.timestamp} | ${shot.duration}s ===
${shot.scene} | ${shot.camera}
${frame.composition}
${shot.content}
`;
      })
      .join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <>
      <ParticleBackground />
      <div className="storyboard-sketch-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · STORYBOARD SKETCH</div>
        <div className="imax-label imax-label-bottom">COMPOSITION FRAMES</div>

        <div style={{ maxWidth: '1700px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            <Link to="/script/detail" className="back-button">
              <ChevronLeft size={14} />
              <span>SCRIPT</span>
            </Link>
            <button className="back-button" onClick={handleCopyAll} type="button">
              {copied ? <><Check size={14} /> 已复制</> : <><Download size={14} /> 导出 ASCII 分镜</>}
            </button>
          </div>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <ImageIcon size={12} />
              <span>STORYBOARD SKETCH</span>
            </div>
            <h1 className="timeline-title">分镜草图 · SKETCH</h1>
            <p className="timeline-desc">
              用符号描述构图——一个 ◯ 是人物，一条 ━ 是地平线，一组 ●●● 是剪影。
              导演、摄影、分镜师通用语言。
            </p>
          </header>

          {/* 幕选择器 */}
          <div className="act-tabs anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {script.acts.map((a) => (
              <button
                key={a.id}
                className={`act-tab ${activeAct === a.id ? 'active' : ''}`}
                onClick={() => setActiveAct(a.id)}
                type="button"
                style={
                  activeAct === a.id
                    ? { borderColor: a.accentColor, color: a.accentColor, background: `${a.accentColor}10` }
                    : {}
                }
              >
                <span className="act-tab-glyph">{a.glyph}</span>
                <span className="act-tab-num">ACT {a.id}</span>
                <span className="act-tab-title">{a.title.replace(/^第[一二三四五六]幕：/, '')}</span>
              </button>
            ))}
          </div>

          {/* 草图网格 */}
          {act && (
            <div className="sketch-grid anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
              {frames.map(({ shot, frame }, idx) => (
                <div
                  key={shot.id}
                  className="sketch-card"
                  style={{
                    '--accent': act.accentColor,
                    '--mood': moodColors[shot.mood],
                    animationDelay: `${idx * 0.04}s`,
                  } as React.CSSProperties}
                  onClick={() => setSelectedShot(shot)}
                >
                  <div className="sketch-card-header">
                    <div className="sketch-card-id">#{shot.id.toString().padStart(2, '0')}</div>
                    <div className="sketch-card-time">{shot.timestamp}</div>
                    <div className="sketch-card-duration">{shot.duration}s</div>
                  </div>

                  <div className="sketch-card-scene">
                    <Camera size={10} />
                    <span>{shot.scene}</span>
                    <span className="sketch-card-angle">{frame.cameraAngle}</span>
                  </div>

                  <div className="sketch-canvas">
                    <pre className="sketch-composition">{frame.composition}</pre>
                    <div className="sketch-overlay">
                      <div className="sketch-overlay-mood" style={{ color: moodColors[shot.mood] }}>
                        <Crosshair size={10} />
                        <span>FOCUS</span>
                      </div>
                      <div className="sketch-overlay-content">{frame.focalPoint}</div>
                    </div>
                  </div>

                  <div className="sketch-card-camera">{shot.camera}</div>
                  <div className="sketch-card-content">{shot.content}</div>

                  <div className="sketch-card-footer">
                    <div className="sketch-mood-dot" style={{ background: moodColors[shot.mood] }} />
                    <span className="sketch-mood-text" style={{ color: moodColors[shot.mood] }}>
                      {shot.mood.toUpperCase()}
                    </span>
                    <span className="sketch-card-loc">{shot.location}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 镜头详情弹窗 */}
          {selectedShot && act && (
            <div className="shot-modal" onClick={() => setSelectedShot(null)}>
              <div
                className="shot-modal-content"
                onClick={(e) => e.stopPropagation()}
                style={{ '--accent': act.accentColor } as React.CSSProperties}
              >
                <button className="modal-close" onClick={() => setSelectedShot(null)} type="button">
                  ✕
                </button>
                <div className="modal-header">
                  <div className="modal-shot-id">SHOT {selectedShot.id.toString().padStart(2, '0')}</div>
                  <div className="modal-timestamp">{selectedShot.timestamp}</div>
                </div>
                <h2 className="modal-title">分镜草图 · {selectedShot.scene}</h2>

                <div className="modal-section">
                  <div className="modal-label">构图 / COMPOSITION</div>
                  <pre className="sketch-modal-canvas">
                    {generateStoryboardFrame(selectedShot.id, selectedShot.scene, selectedShot.camera, selectedShot.mood).composition}
                  </pre>
                </div>

                <div className="modal-section">
                  <div className="modal-label">画面内容</div>
                  <p className="modal-content">{selectedShot.content}</p>
                </div>

                <div className="sketch-meta-grid">
                  <div className="sketch-meta">
                    <span className="sketch-meta-label">镜头角度</span>
                    <span className="sketch-meta-value">
                      {generateStoryboardFrame(selectedShot.id, selectedShot.scene, selectedShot.camera, selectedShot.mood).cameraAngle}
                    </span>
                  </div>
                  <div className="sketch-meta">
                    <span className="sketch-meta-label">镜头类型</span>
                    <span className="sketch-meta-value">
                      {generateStoryboardFrame(selectedShot.id, selectedShot.scene, selectedShot.camera, selectedShot.mood).shotType}
                    </span>
                  </div>
                  <div className="sketch-meta">
                    <span className="sketch-meta-label">焦点</span>
                    <span className="sketch-meta-value">
                      {generateStoryboardFrame(selectedShot.id, selectedShot.scene, selectedShot.camera, selectedShot.mood).focalPoint}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
