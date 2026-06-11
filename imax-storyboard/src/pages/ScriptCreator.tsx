import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { script, characters, type Script } from '../data/scriptData';
import { Sparkles, Film, Clock, Users, ChevronRight, Zap, BookOpen } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';
import BackButton from '../components/BackButton';

interface ScriptConfig {
  title: string;
  englishTitle: string;
  genre: string;
  logline: string;
  theme: string;
  tone: string;
  visualStyle: string;
  protagonist: string;
  antagonist: string;
  mentor: string;
  witness: string;
}

const PRESET_TEMPLATES: { label: string; config: Partial<ScriptConfig> }[] = [
  {
    label: '神话史诗',
    config: {
      genre: '神话史诗 · 科幻 · 武侠',
      theme: '田有守者——人间的烟火与宇宙的神力，在一片麦田中和解。',
      tone: '史诗 · 苍凉 · 中式幽默',
      visualStyle: 'IMAX 8K 渲染 / 3渲2 角色 / 水墨画风格 / 《沙丘》低饱和',
      logline: '千年以前封印虚空巨兽的农夫，被一个复仇刀客和一个年轻记者的闯入而重披战袍——一推湮星，一跃化龙。',
    },
  },
  {
    label: '都市神话',
    config: {
      genre: '现代都市 · 神话',
      theme: '神不在天上，神在每个早起买早餐的背影里。',
      tone: '暖色 · 中式幽默',
      visualStyle: '胶片颗粒 / 4K / 暖色低饱和',
      logline: '一个都市中的外卖小哥，发现自己前世是封印虚空的神。',
    },
  },
  {
    label: '江湖长卷',
    config: {
      genre: '武侠 · 史诗',
      theme: '刀出鞘时，才知道江湖已远。',
      tone: '冷峻 · 苍凉',
      visualStyle: '水墨长卷 / 4K',
      logline: '隐退江湖三十年的剑客，被一份未送出的信重新推回风雨。',
    },
  },
];

export default function ScriptCreator() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState<ScriptConfig>({
    title: script.title,
    englishTitle: script.englishTitle,
    genre: script.genre,
    logline: script.logline,
    theme: script.theme,
    tone: script.tone,
    visualStyle: script.visualStyle,
    protagonist: characters[0]?.name ?? '',
    antagonist: characters[1]?.name ?? '',
    mentor: characters[2]?.name ?? '',
    witness: characters[3]?.name ?? '',
  });

  const totalSteps = 4;

  const applyPreset = (preset: Partial<ScriptConfig>) => {
    setConfig((prev) => ({ ...prev, ...preset }));
  };

  const handleGenerate = () => {
    const finalScript: Script = {
      ...script,
      title: config.title,
      englishTitle: config.englishTitle,
      genre: config.genre,
      logline: config.logline,
      theme: config.theme,
      tone: config.tone,
      visualStyle: config.visualStyle,
    };
    sessionStorage.setItem('customScript', JSON.stringify(finalScript));
    navigate('/script/detail');
  };

  const steps = [
    {
      label: '题材',
      icon: <Film size={16} />,
      title: '选择题材',
      desc: '为你的电影定义基调和血脉',
    },
    {
      label: '主题',
      icon: <BookOpen size={16} />,
      title: '核心主题',
      desc: '一句话故事 & 主题',
    },
    {
      label: '人物',
      icon: <Users size={16} />,
      title: '主要人物',
      desc: '主角、反派、见证者',
    },
    {
      label: '生成',
      icon: <Sparkles size={16} />,
      title: '生成剧本',
      desc: '120分钟 · 6幕 · 72镜头',
    },
  ];

  return (
    <>
      <ParticleBackground />
      <div className="creator-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · SCRIPT FORGE</div>
        <div className="imax-label imax-label-bottom">120MIN · 6 ACTS · 72 SHOTS</div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <BackButton to="/" label="BACK TO INDEX" />

          <header className="creator-header anim-fade-in-up">
            <div className="creator-badge">
              <Zap size={12} />
              <span>SCRIPT GENERATOR · v1.0</span>
            </div>
            <h1 className="creator-title">剧本锻造炉</h1>
            <p className="creator-tagline">
              选择题材、定义主题、配置人物——
              <br />
              让 AI 导演为你生成一部 120 分钟的史诗分镜。
            </p>
          </header>

          <div className="stepper anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {steps.map((s, idx) => (
              <button
                key={idx}
                className={`stepper-item ${step === idx ? 'active' : ''} ${step > idx ? 'done' : ''}`}
                onClick={() => setStep(idx)}
                type="button"
              >
                <div className="stepper-num">{idx + 1}</div>
                <div className="stepper-text">
                  <div className="stepper-label">{s.label}</div>
                  <div className="stepper-title">{s.title}</div>
                </div>
              </button>
            ))}
          </div>

          <div className="creator-content anim-fade-in-up" style={{ animationDelay: '0.4s' }}>
            {step === 0 && (
              <div className="creator-step">
                <h2 className="step-title">选择题材模板</h2>
                <p className="step-desc">从预设开始，或自定义你的剧本</p>

                <div className="preset-grid">
                  {PRESET_TEMPLATES.map((preset) => (
                    <button
                      key={preset.label}
                      className="preset-card"
                      onClick={() => applyPreset(preset.config)}
                      type="button"
                    >
                      <div className="preset-glyph">{preset.label.charAt(0)}</div>
                      <div className="preset-name">{preset.label}</div>
                      <div className="preset-genre">{preset.config.genre}</div>
                    </button>
                  ))}
                </div>

                <div className="form-section">
                  <label className="form-label">剧本标题</label>
                  <input
                    className="form-input"
                    value={config.title}
                    onChange={(e) => setConfig({ ...config, title: e.target.value })}
                    placeholder="对决"
                  />
                  <input
                    className="form-input"
                    style={{ marginTop: 'var(--space-3)' }}
                    value={config.englishTitle}
                    onChange={(e) => setConfig({ ...config, englishTitle: e.target.value })}
                    placeholder="A Duel Across the Cosmos"
                  />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="creator-step">
                <h2 className="step-title">核心主题</h2>
                <p className="step-desc">一句话故事 + 主题 + 基调</p>

                <div className="form-section">
                  <label className="form-label">
                    <Film size={12} style={{ marginRight: 6 }} />
                    一句话故事 (Logline)
                  </label>
                  <textarea
                    className="form-textarea"
                    value={config.logline}
                    onChange={(e) => setConfig({ ...config, logline: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">主题</label>
                  <input
                    className="form-input"
                    value={config.theme}
                    onChange={(e) => setConfig({ ...config, theme: e.target.value })}
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">视觉风格</label>
                  <input
                    className="form-input"
                    value={config.visualStyle}
                    onChange={(e) => setConfig({ ...config, visualStyle: e.target.value })}
                  />
                </div>

                <div className="form-section">
                  <label className="form-label">情绪基调</label>
                  <input
                    className="form-input"
                    value={config.tone}
                    onChange={(e) => setConfig({ ...config, tone: e.target.value })}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="creator-step">
                <h2 className="step-title">主要人物</h2>
                <p className="step-desc">配置 4 个核心角色</p>

                <div className="character-grid">
                  {characters.map((char) => {
                    const roleKey = char.role === 'protagonist' ? 'protagonist' :
                                    char.role === 'antagonist' ? 'antagonist' :
                                    char.role === 'mentor' ? 'mentor' : 'witness';
                    return (
                      <div key={char.id} className="character-card">
                        <div className="character-role">
                          {char.role === 'protagonist' && 'PROTAGONIST'}
                          {char.role === 'antagonist' && 'ANTAGONIST'}
                          {char.role === 'mentor' && 'MENTOR'}
                          {char.role === 'witness' && 'WITNESS'}
                        </div>
                        <input
                          className="form-input"
                          value={config[roleKey as keyof ScriptConfig]}
                          onChange={(e) => setConfig({ ...config, [roleKey]: e.target.value })}
                        />
                        <div className="character-name">{char.alias} · {char.name}</div>
                        <div className="character-arc">{char.arc}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="creator-step">
                <h2 className="step-title">确认生成</h2>
                <p className="step-desc">预览剧本配置</p>

                <div className="preview-card">
                  <div className="preview-header">
                    <div className="preview-title">{config.title}</div>
                    <div className="preview-subtitle">{config.englishTitle}</div>
                  </div>

                  <div className="preview-meta">
                    <div className="preview-meta-item">
                      <Clock size={12} />
                      <span>120 分钟</span>
                    </div>
                    <div className="preview-meta-item">
                      <Film size={12} />
                      <span>6 幕 · 72 镜头</span>
                    </div>
                    <div className="preview-meta-item">
                      <Users size={12} />
                      <span>4 角色</span>
                    </div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-label">类型</div>
                    <div className="preview-value">{config.genre}</div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-label">一句话故事</div>
                    <div className="preview-value">{config.logline}</div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-label">主题</div>
                    <div className="preview-value">{config.theme}</div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-label">视觉风格</div>
                    <div className="preview-value preview-mono">{config.visualStyle}</div>
                  </div>

                  <div className="preview-section">
                    <div className="preview-label">人物</div>
                    <div className="preview-characters">
                      <div><span className="char-tag">主角</span>{config.protagonist}</div>
                      <div><span className="char-tag">反派</span>{config.antagonist}</div>
                      <div><span className="char-tag">引路</span>{config.mentor}</div>
                      <div><span className="char-tag">见证</span>{config.witness}</div>
                    </div>
                  </div>
                </div>

                <button className="generate-button" onClick={handleGenerate} type="button">
                  <Sparkles size={18} />
                  <span>生成 120 分钟剧本</span>
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          <div className="stepper-nav">
            <button
              className="nav-button"
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              type="button"
            >
              上一步
            </button>
            <div className="stepper-progress">
              {steps.map((_, idx) => (
                <div
                  key={idx}
                  className={`progress-dot ${step === idx ? 'active' : ''} ${step > idx ? 'done' : ''}`}
                />
              ))}
            </div>
            {step < totalSteps - 1 ? (
              <button
                className="nav-button primary"
                onClick={() => setStep(Math.min(totalSteps - 1, step + 1))}
                type="button"
              >
                下一步
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                className="nav-button primary"
                onClick={handleGenerate}
                type="button"
              >
                生成剧本
                <Sparkles size={14} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
