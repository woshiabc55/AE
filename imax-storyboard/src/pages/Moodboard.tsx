import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { script as defaultScript, sceneMoods, type Script, type SceneMood } from '../data/scriptData';
import { ChevronLeft, Sun, Cloud, Wind, Music, Image, Lightbulb } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function Moodboard() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeScene, setActiveScene] = useState<SceneMood>(sceneMoods[0]!);

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

  const currentAct = script.acts.find((a) => a.id === activeScene.actId);

  return (
    <>
      <ParticleBackground />
      <div className="moodboard-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · MOODBOARD</div>
        <div className="imax-label imax-label-bottom">SCENE ATMOSPHERES</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Image size={12} />
              <span>SCENE MOODBOARD</span>
            </div>
            <h1 className="timeline-title">场景气氛板 · MOODBOARD</h1>
            <p className="timeline-desc">
              每一寸光线、每一缕风、每一个道具，都是叙事的沉默语言。
            </p>
          </header>

          {/* 场景选择器 */}
          <div className="scene-selector anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {sceneMoods.map((scene, idx) => (
              <button
                key={scene.id}
                className={`scene-card ${activeScene.id === scene.id ? 'active' : ''}`}
                onClick={() => setActiveScene(scene)}
                type="button"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="scene-card-glyph">场</div>
                <div className="scene-card-act">ACT {scene.actId.toString().padStart(2, '0')}</div>
                <div className="scene-card-name">{scene.name}</div>
                <div className="scene-card-atmosphere">{scene.atmosphere}</div>
              </button>
            ))}
          </div>

          {/* 气氛板详情 */}
          {activeScene && (
            <>
              <section className="moodboard-hero anim-fade-in" key={activeScene.id}>
                <div className="moodboard-hero-bg" style={{ '--scene-color': getSceneColor(activeScene.atmosphere) } as React.CSSProperties}>
                  <div className="moodboard-fog" />
                  <div className="moodboard-particles" />
                </div>
                <div className="moodboard-hero-content">
                  <div className="moodboard-hero-act">ACT {activeScene.actId.toString().padStart(2, '0')}</div>
                  <h2 className="moodboard-hero-title">{activeScene.name}</h2>
                  <p className="moodboard-hero-atmosphere">{activeScene.atmosphere}</p>
                </div>
              </section>

              <div className="moodboard-grid">
                {/* 光线 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <div className="moodboard-block-header">
                    <Lightbulb size={14} />
                    <span>光线 / LIGHTING</span>
                  </div>
                  <p className="moodboard-block-content">{activeScene.lighting}</p>
                  <div className="moodboard-light-bar">
                    <div className="light-source" />
                    <div className="light-rays" />
                    <div className="light-target" />
                  </div>
                </div>

                {/* 天气 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.15s' }}>
                  <div className="moodboard-block-header">
                    <Cloud size={14} />
                    <span>天气 / WEATHER</span>
                  </div>
                  <p className="moodboard-block-content">{activeScene.weather}</p>
                  <div className="weather-icons">
                    {activeScene.weather.includes('晴') && <Sun size={20} className="weather-icon" />}
                    {activeScene.weather.includes('雨') && <Cloud size={20} className="weather-icon" />}
                    {activeScene.weather.includes('风') && <Wind size={20} className="weather-icon" />}
                  </div>
                </div>

                {/* 时段 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <div className="moodboard-block-header">
                    <Sun size={14} />
                    <span>时段 / TIME OF DAY</span>
                  </div>
                  <p className="moodboard-block-time">{activeScene.timeOfDay}</p>
                  <div className="time-bar">
                    <div className="time-tick" style={{ left: '25%' }} />
                    <div className="time-tick" style={{ left: '50%' }} />
                    <div className="time-tick" style={{ left: '75%' }} />
                    <div className="time-now" style={{ left: getTimePosition(activeScene.timeOfDay) }} />
                  </div>
                </div>

                {/* 色温 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.25s' }}>
                  <div className="moodboard-block-header">
                    <Image size={14} />
                    <span>色温 / COLOR TEMP</span>
                  </div>
                  <p className="moodboard-block-content">{activeScene.colorTemperature}</p>
                  <div className="temp-bar">
                    <div className="temp-cold" />
                    <div className="temp-mid" />
                    <div className="temp-warm" />
                    <div className="temp-indicator" style={{ left: getTempPosition(activeScene.colorTemperature) }} />
                  </div>
                </div>

                {/* 声音设计 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
                  <div className="moodboard-block-header">
                    <Music size={14} />
                    <span>声音 / SOUND DESIGN</span>
                  </div>
                  <p className="moodboard-block-content">{activeScene.soundDesign}</p>
                  <div className="sound-wave">
                    {Array.from({ length: 40 }).map((_, i) => (
                      <div
                        key={i}
                        className="sound-bar"
                        style={{
                          height: `${20 + Math.abs(Math.sin(i * 0.5) * 30)}%`,
                          animationDelay: `${i * 0.05}s`,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* 关键道具 */}
                <div className="moodboard-block anim-fade-in-up" style={{ animationDelay: '0.35s' }}>
                  <div className="moodboard-block-header">
                    <span>道具 / PROPS</span>
                  </div>
                  <div className="props-list">
                    {activeScene.props.map((prop, i) => (
                      <div
                        key={i}
                        className="prop-tag"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        {prop}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 视觉参考 */}
              <section className="moodboard-references anim-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <h2 className="section-title">视觉参考 / VISUAL REFERENCES</h2>
                <div className="references-grid">
                  {activeScene.visualReferences.map((ref, i) => (
                    <div key={i} className="reference-card">
                      <div className="reference-poster">
                        <div className="reference-frame">
                          <div className="reference-img-placeholder" style={{ background: `linear-gradient(135deg, var(--color-deep), ${getSceneColor(activeScene.atmosphere)})` }}>
                            <span className="reference-text">{ref}</span>
                          </div>
                        </div>
                      </div>
                      <div className="reference-title">{ref}</div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 关联镜头 */}
              {currentAct && (
                <section className="moodboard-shots anim-fade-in-up" style={{ animationDelay: '0.5s' }}>
                  <h2 className="section-title">本场景镜头 / SHOTS IN THIS SCENE</h2>
                  <div className="moodboard-shots-list">
                    {currentAct.shots
                      .filter((s) => s.location === activeScene.name || true)
                      .slice(0, 6)
                      .map((shot, i) => (
                        <div key={shot.id} className="moodboard-shot" style={{ animationDelay: `${i * 0.05}s` }}>
                          <div className="moodboard-shot-id">#{shot.id.toString().padStart(2, '0')}</div>
                          <div className="moodboard-shot-scene">{shot.scene}</div>
                          <div className="moodboard-shot-content">{shot.content}</div>
                        </div>
                      ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

const getSceneColor = (atmosphere: string): string => {
  if (atmosphere.includes('太古') || atmosphere.includes('神秘')) return '#d4af37';
  if (atmosphere.includes('虚空') || atmosphere.includes('压迫')) return '#a29bfe';
  if (atmosphere.includes('苍凉')) return '#74b9ff';
  return '#d4af37';
};

const getTimePosition = (time: string): string => {
  if (time.includes('清晨') || time.includes('06')) return '25%';
  if (time.includes('正午') || time.includes('12')) return '50%';
  if (time.includes('黄昏') || time.includes('18')) return '75%';
  if (time.includes('夜')) return '85%';
  return '50%';
};

const getTempPosition = (temp: string): string => {
  const match = temp.match(/(\d+)K/);
  if (!match) return '50%';
  const k = parseInt(match[1] ?? '5000', 10);
  if (k < 3500) return '85%';
  if (k < 5000) return '60%';
  if (k < 6000) return '40%';
  return '20%';
};
