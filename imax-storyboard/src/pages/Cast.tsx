import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  castProfiles,
  rehearsalPlan,
  type CastProfile,
} from '../data/scriptData';
import {
  ChevronLeft,
  User,
  Users,
  Clapperboard,
  Heart,
  AlertTriangle,
} from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const difficultyColor = (d: string) => {
  switch (d) {
    case 'extreme':
      return '#ff3838';
    case 'high':
      return '#ff6b35';
    case 'medium':
      return '#d4af37';
    case 'low':
      return '#74b9ff';
    default:
      return '#74b9ff';
  }
};

const difficultyLabel = (d: string) => {
  switch (d) {
    case 'extreme':
      return '极难 EXTREME';
    case 'high':
      return '高难 HIGH';
    case 'medium':
      return '中等 MEDIUM';
    case 'low':
      return '简单 LOW';
    default:
      return d.toUpperCase();
  }
};

export default function Cast() {
  const [activeCastId, setActiveCastId] = useState<string>(castProfiles[0]?.id ?? '');
  const activeProfile = useMemo(
    () => castProfiles.find((c) => c.id === activeCastId) ?? castProfiles[0],
    [activeCastId]
  );

  useEffect(() => {
    if (castProfiles.length > 0 && !activeCastId) {
      setActiveCastId(castProfiles[0].id);
    }
  }, [activeCastId]);

  // 统计
  const stats = {
    totalRoles: castProfiles.length,
    totalAuditions: castProfiles.reduce((sum, c) => sum + c.auditionScenes.length, 0),
    totalReferences: castProfiles.reduce((sum, c) => sum + c.referenceActors.length, 0),
    totalWorkshopWeeks: rehearsalPlan.reduce((sum, r) => sum + parseInt(r.duration), 0),
  };

  return (
    <>
      <ParticleBackground />
      <div className="cast-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · CAST & AUDITION</div>
        <div className="imax-label imax-label-bottom">
          {stats.totalRoles} ROLES · {stats.totalAuditions} AUDITIONS · {stats.totalReferences} REFERENCES
        </div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <User size={12} />
              <span>CAST & AUDITION</span>
            </div>
            <h1 className="timeline-title">选角与演员 · CAST & AUDITION</h1>
            <p className="timeline-desc">
              4 个核心角色、9 段试镜独白、10 位参考演员、5 阶段 16 周排练计划。
              选角是 IMAX 制作的第一道关——找到对的人，故事才有人相信。
            </p>
          </header>

          {/* 顶部统计 */}
          <div className="cast-stats anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="cast-stat">
              <User size={20} style={{ color: '#d4af37' }} />
              <div>
                <div className="cast-stat-value">{stats.totalRoles}</div>
                <div className="cast-stat-label">核心角色 / ROLES</div>
              </div>
            </div>
            <div className="cast-stat">
              <Clapperboard size={20} style={{ color: '#ff6b35' }} />
              <div>
                <div className="cast-stat-value">{stats.totalAuditions}</div>
                <div className="cast-stat-label">试镜场景 / SCENES</div>
              </div>
            </div>
            <div className="cast-stat">
              <Users size={20} style={{ color: '#a29bfe' }} />
              <div>
                <div className="cast-stat-value">{stats.totalReferences}</div>
                <div className="cast-stat-label">参考演员 / REFS</div>
              </div>
            </div>
            <div className="cast-stat">
              <Heart size={20} style={{ color: '#ff3838' }} />
              <div>
                <div className="cast-stat-value">{stats.totalWorkshopWeeks}</div>
                <div className="cast-stat-label">排练周 / WEEKS</div>
              </div>
            </div>
          </div>

          {/* 角色选择器 */}
          <div className="cast-selector anim-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {castProfiles.map((profile) => (
              <button
                key={profile.id}
                className={`cast-selector-btn ${activeCastId === profile.id ? 'active' : ''}`}
                onClick={() => setActiveCastId(profile.id)}
                type="button"
                style={
                  activeCastId === profile.id
                    ? { borderColor: profile.color, color: profile.color }
                    : {}
                }
              >
                <div
                  className="cast-selector-glyph"
                  style={{ color: profile.color, borderColor: profile.color }}
                >
                  {profile.characterName.charAt(0)}
                </div>
                <div className="cast-selector-info">
                  <div className="cast-selector-name">{profile.characterName}</div>
                  <div className="cast-selector-alias">{profile.alias}</div>
                </div>
                <div
                  className="cast-selector-difficulty"
                  style={{ color: difficultyColor(profile.castingDifficulty) }}
                >
                  {difficultyLabel(profile.castingDifficulty)}
                </div>
              </button>
            ))}
          </div>

          {activeProfile && <CastDetail profile={activeProfile} />}

          {/* 排练计划 */}
          <section className="cast-rehearsal anim-fade-in-up">
            <h2 className="section-title">REHEARSAL PLAN · 排练与训练计划</h2>
            <p className="cast-rehearsal-intro">
              5 阶段 16 周排练，从剧本围读到开机前最终合成。每阶段都有明确目标和关键节点。
            </p>

            <div className="rehearsal-timeline">
              {rehearsalPlan.map((plan, idx) => (
                <div
                  key={plan.id}
                  className="rehearsal-phase"
                  style={{
                    animationDelay: `${idx * 0.1}s`,
                  } as React.CSSProperties}
                >
                  <div className="rehearsal-phase-header">
                    <div className="rehearsal-phase-num">PHASE {idx + 1}</div>
                    <h3 className="rehearsal-phase-name">{plan.phase}</h3>
                    <div className="rehearsal-phase-duration">{plan.duration}</div>
                  </div>

                  <div className="rehearsal-phase-body">
                    <div className="rehearsal-section">
                      <div className="rehearsal-section-label">PARTICIPANTS 参与者</div>
                      <div className="rehearsal-tags">
                        {plan.participants.map((p, i) => (
                          <span key={i} className="rehearsal-tag">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="rehearsal-section">
                      <div className="rehearsal-section-label">ACTIVITIES 活动</div>
                      <ul className="rehearsal-list">
                        {plan.activities.map((a, i) => (
                          <li key={i} className="rehearsal-list-item">
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rehearsal-section">
                      <div className="rehearsal-section-label">GOALS 目标</div>
                      <ul className="rehearsal-list">
                        {plan.goals.map((g, i) => (
                          <li key={i} className="rehearsal-list-item">
                            {g}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rehearsal-section rehearsal-section-notes">
                      <div className="rehearsal-section-label">NOTES 备注</div>
                      <p className="rehearsal-notes">{plan.notes}</p>
                    </div>
                  </div>

                  {idx < rehearsalPlan.length - 1 && <div className="rehearsal-arrow">↓</div>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

function CastDetail({ profile }: { profile: CastProfile }) {
  return (
    <section className="cast-detail anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
      {/* 角色头部 */}
      <div className="cast-detail-header" style={{ borderColor: profile.color }}>
        <div className="cast-detail-id-block">
          <div
            className="cast-detail-glyph"
            style={{ color: profile.color, borderColor: profile.color }}
          >
            {profile.characterName.charAt(0)}
          </div>
          <div>
            <h2 className="cast-detail-name" style={{ color: profile.color }}>
              {profile.characterName}
            </h2>
            <div className="cast-detail-alias">{profile.alias}</div>
          </div>
        </div>
        <div
          className="cast-detail-difficulty"
          style={{
            color: difficultyColor(profile.castingDifficulty),
            borderColor: difficultyColor(profile.castingDifficulty),
          }}
        >
          <AlertTriangle size={14} />
          <span>选角难度 · {difficultyLabel(profile.castingDifficulty)}</span>
        </div>
      </div>

      {/* 选角理由 */}
      <div className="cast-reason-box">
        <div className="cast-reason-label">CASTING RATIONALE · 选角理由</div>
        <p className="cast-reason-text">{profile.castingReason}</p>
      </div>

      <div className="cast-detail-grid">
        {/* 左侧：身体要求 + 表演关键词 + 试镜 */}
        <div className="cast-detail-col">
          <div className="cast-card">
            <div className="cast-card-header">
              <h3 className="cast-card-title">身体要求 · PHYSICAL</h3>
            </div>
            <div className="cast-physical-grid">
              <div className="cast-physical-item">
                <div className="cast-physical-label">AGE 年龄</div>
                <div className="cast-physical-value">{profile.physicalRequirements.ageRange}</div>
              </div>
              <div className="cast-physical-item">
                <div className="cast-physical-label">HEIGHT 身高</div>
                <div className="cast-physical-value">{profile.physicalRequirements.height}</div>
              </div>
              <div className="cast-physical-item">
                <div className="cast-physical-label">BUILD 体型</div>
                <div className="cast-physical-value">{profile.physicalRequirements.build}</div>
              </div>
            </div>
            <div className="cast-physical-features">
              <div className="cast-physical-features-label">DISTINCTIVE 特征</div>
              <p className="cast-physical-features-text">
                {profile.physicalRequirements.distinctiveFeatures}
              </p>
            </div>
          </div>

          <div className="cast-card">
            <div className="cast-card-header">
              <h3 className="cast-card-title">表演画像 · PERFORMANCE</h3>
            </div>

            <div className="cast-section">
              <div className="cast-section-label">KEYWORDS 关键词</div>
              <div className="cast-keywords">
                {profile.performanceKeywords.map((kw, i) => (
                  <span key={i} className="cast-keyword" style={{ borderColor: profile.color, color: profile.color }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>

            <div className="cast-section">
              <div className="cast-section-label">EMOTIONAL RANGE 情绪范围</div>
              <ul className="cast-emotional-list">
                {profile.emotionalRange.map((emo, i) => (
                  <li key={i} className="cast-emotional-item">
                    <span className="cast-emotional-bullet" style={{ background: profile.color }} />
                    {emo}
                  </li>
                ))}
              </ul>
            </div>

            <div className="cast-section">
              <div className="cast-section-label">SPECIAL SKILLS 特殊技能</div>
              <div className="cast-keywords">
                {profile.specialSkills.map((s, i) => (
                  <span key={i} className="cast-keyword-secondary">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="cast-section">
              <div className="cast-section-label">LANGUAGE 语言</div>
              <div className="cast-keywords">
                {profile.languageRequirements.map((l, i) => (
                  <span key={i} className="cast-keyword-secondary">
                    {l}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 右侧：参考演员 + 试镜场景 */}
        <div className="cast-detail-col">
          <div className="cast-card">
            <div className="cast-card-header">
              <h3 className="cast-card-title">参考演员 · REFERENCE ACTORS</h3>
            </div>
            <div className="ref-actor-list">
              {profile.referenceActors.map((ref, i) => (
                <div key={i} className="ref-actor-item">
                  <div className="ref-actor-header">
                    <div className="ref-actor-name-block">
                      <div className="ref-actor-name">{ref.name}</div>
                      <div className="ref-actor-nationality">
                        {ref.nationality} · {ref.knownFor}
                      </div>
                    </div>
                  </div>
                  <p className="ref-actor-reason">{ref.reasonForReference}</p>
                  {ref.signature && (
                    <div className="ref-actor-signature">
                      <span className="ref-actor-signature-label">SIGNATURE</span>
                      <span className="ref-actor-signature-text">{ref.signature}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="cast-card">
            <div className="cast-card-header">
              <h3 className="cast-card-title">试镜场景 · AUDITION SCENES</h3>
            </div>
            <div className="audition-list">
              {profile.auditionScenes.map((aud, i) => (
                <div key={aud.id} className="audition-scene">
                  <div className="audition-scene-header">
                    <div className="audition-scene-num">SCENE {i + 1}</div>
                    <h4 className="audition-scene-title">{aud.title}</h4>
                    <div className="audition-scene-from">FROM ACT {aud.fromAct}</div>
                  </div>

                  <div className="audition-scene-grid">
                    <div className="audition-field">
                      <div className="audition-field-label">CONTEXT 上下文</div>
                      <p className="audition-field-text">{aud.emotionalContext}</p>
                    </div>
                    <div className="audition-field">
                      <div className="audition-field-label">DIRECTION 导演指示</div>
                      <p className="audition-field-text">{aud.directionNotes}</p>
                    </div>
                  </div>

                  <div className="audition-sides">
                    <div className="audition-sides-header">
                      <span className="audition-sides-label">SIDES · 试镜片段</span>
                      <span className="audition-sides-ref">{aud.pageReference}</span>
                    </div>
                    <div className="audition-sides-content">{aud.sidesContent}</div>
                    {aud.partnerCharacter && (
                      <div className="audition-sides-partner">
                        <span className="audition-partner-label">对手戏 ·</span>
                        <span className="audition-partner-name">{aud.partnerCharacter}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 排练导演备注 */}
      <div className="cast-workshop-box">
        <div className="cast-workshop-label">WORKSHOP NOTES · 排练导演备注</div>
        <p className="cast-workshop-text">{profile.workshopNotes}</p>
      </div>
    </section>
  );
}
