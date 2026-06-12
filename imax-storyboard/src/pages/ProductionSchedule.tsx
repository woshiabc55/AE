import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { script as defaultScript, type Script } from '../data/scriptData';
import { ChevronLeft, MapPin, Calendar, Users, Camera, Clock, TrendingUp, ListOrdered } from 'lucide-react';
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

interface ShootingUnit {
  id: string;
  location: string;
  actId: number;
  actTitle: string;
  shotIds: number[];
  totalDuration: number;
  characters: Set<string>;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
}

export default function ProductionSchedule() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [groupBy, setGroupBy] = useState<'location' | 'act' | 'character' | 'difficulty'>('location');
  const [view, setView] = useState<'list' | 'gantt'>('list');

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

  // 按地点归组（拍摄单元）
  const shootingUnits = useMemo(() => {
    const units: ShootingUnit[] = [];
    script.acts.forEach((act) => {
      const locMap: Record<string, number[]> = {};
      act.shots.forEach((s) => {
        if (!locMap[s.location]) locMap[s.location] = [];
        locMap[s.location]!.push(s.id);
      });
      Object.entries(locMap).forEach(([loc, ids]) => {
        const shots = act.shots.filter((s) => ids.includes(s.id));
        const characters = new Set<string>();
        shots.forEach((s) => s.characters.forEach((c) => characters.add(c)));
        const totalDur = shots.reduce((sum, s) => sum + s.duration, 0);
        const intenseShots = shots.filter((s) => s.mood === 'tense' || s.mood === 'epic').length;
        const extremeWide = shots.filter((s) => s.scene === '大全景').length;
        const difficulty: ShootingUnit['difficulty'] =
          intenseShots >= 3 || extremeWide >= 2 ? 'extreme' :
          intenseShots >= 2 || extremeWide >= 1 ? 'hard' :
          intenseShots >= 1 ? 'medium' : 'easy';

        units.push({
          id: `${act.id}-${loc}`,
          location: loc,
          actId: act.id,
          actTitle: act.title,
          shotIds: ids,
          totalDuration: totalDur,
          characters,
          difficulty,
        });
      });
    });
    return units;
  }, [script]);

  // 按人物归组
  const characterSchedules = useMemo(() => {
    const map: Record<string, { actId: number; shotIds: number[]; totalDuration: number }[]> = {};
    script.acts.forEach((act) => {
      act.shots.forEach((s) => {
        s.characters.forEach((c) => {
          if (!map[c]) map[c] = [];
          let entry = map[c]!.find((e) => e.actId === act.id);
          if (!entry) {
            entry = { actId: act.id, shotIds: [], totalDuration: 0 };
            map[c]!.push(entry);
          }
          entry.shotIds.push(s.id);
          entry.totalDuration += s.duration;
        });
      });
    });
    return map;
  }, [script]);

  // 按难度归组
  const difficultyGroups = useMemo(() => {
    const groups: Record<string, ShootingUnit[]> = { easy: [], medium: [], hard: [], extreme: [] };
    shootingUnits.forEach((u) => groups[u.difficulty]!.push(u));
    return groups;
  }, [shootingUnits]);

  const totalDays = useMemo(() => {
    const totalSeconds = script.acts.reduce(
      (sum, act) => sum + act.shots.reduce((s, sh) => s + sh.duration, 0),
      0
    );
    return Math.ceil(totalSeconds / (8 * 3600)); // 假设每天8小时拍摄
  }, [script]);

  const groupedData = useMemo(() => {
    if (groupBy === 'location') return shootingUnits;
    if (groupBy === 'act') {
      return script.acts.map((act) => ({
        id: `act-${act.id}`,
        location: act.title,
        actId: act.id,
        actTitle: act.title,
        shotIds: act.shots.map((s) => s.id),
        totalDuration: act.shots.reduce((s, sh) => s + sh.duration, 0),
        characters: new Set(act.shots.flatMap((s) => s.characters)),
        difficulty: 'medium' as const,
      }));
    }
    if (groupBy === 'character') {
      return Object.entries(characterSchedules).flatMap(([char, acts]) =>
        acts.map((a) => ({
          id: `${char}-${a.actId}`,
          location: char,
          actId: a.actId,
          actTitle: script.acts.find((ac) => ac.id === a.actId)?.title ?? '',
          shotIds: a.shotIds,
          totalDuration: a.totalDuration,
          characters: new Set([char]),
          difficulty: 'easy' as const,
        }))
      );
    }
    return Object.entries(difficultyGroups).flatMap(([diff, units]) =>
      units.map((u) => ({ ...u, id: `${diff}-${u.id}` }))
    );
  }, [groupBy, shootingUnits, script.acts, characterSchedules, difficultyGroups]);

  const difficultyColor = (d: string) => {
    if (d === 'extreme') return '#ff3838';
    if (d === 'hard') return '#ff6b35';
    if (d === 'medium') return '#d4af37';
    return '#74b9ff';
  };

  return (
    <>
      <ParticleBackground />
      <div className="production-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · PRODUCTION</div>
        <div className="imax-label imax-label-bottom">SHOOTING SCHEDULE</div>

        <div style={{ maxWidth: '1500px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Calendar size={12} />
              <span>SHOOTING SCHEDULE</span>
            </div>
            <h1 className="timeline-title">拍摄计划 · PRODUCTION</h1>
            <p className="timeline-desc">
              120分钟 / 72镜头 = 估算 {totalDays} 个拍摄日。按地点、幕、角色、难度 4 种视图聚合。
            </p>
          </header>

          {/* 顶部统计 */}
          <div className="prod-stats anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="prod-stat">
              <Camera size={20} style={{ color: 'var(--color-gold)' }} />
              <div>
                <div className="prod-stat-value">{script.totalShots}</div>
                <div className="prod-stat-label">镜头 / SHOTS</div>
              </div>
            </div>
            <div className="prod-stat">
              <MapPin size={20} style={{ color: 'var(--color-fire)' }} />
              <div>
                <div className="prod-stat-value">{shootingUnits.length}</div>
                <div className="prod-stat-label">拍摄单元 / UNITS</div>
              </div>
            </div>
            <div className="prod-stat">
              <Users size={20} style={{ color: 'var(--color-mystic)' }} />
              <div>
                <div className="prod-stat-value">{Object.keys(characterSchedules).length}</div>
                <div className="prod-stat-label">角色 / CHARACTERS</div>
              </div>
            </div>
            <div className="prod-stat">
              <Clock size={20} style={{ color: 'var(--color-blue)' }} />
              <div>
                <div className="prod-stat-value">{totalDays}</div>
                <div className="prod-stat-label">拍摄日 / DAYS</div>
              </div>
            </div>
          </div>

          {/* 视图切换 */}
          <div className="prod-controls anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="control-group">
              <span className="control-label">
                <ListOrdered size={11} /> 归组方式
              </span>
              <div className="control-buttons">
                {(['location', 'act', 'character', 'difficulty'] as const).map((g) => (
                  <button
                    key={g}
                    className={`control-btn ${groupBy === g ? 'active' : ''}`}
                    onClick={() => setGroupBy(g)}
                    type="button"
                  >
                    {g === 'location' && '按地点'}
                    {g === 'act' && '按幕'}
                    {g === 'character' && '按角色'}
                    {g === 'difficulty' && '按难度'}
                  </button>
                ))}
              </div>
            </div>

            <div className="control-group">
              <span className="control-label">
                <TrendingUp size={11} /> 视图
              </span>
              <div className="control-buttons">
                <button
                  className={`control-btn ${view === 'list' ? 'active' : ''}`}
                  onClick={() => setView('list')}
                  type="button"
                >
                  列表
                </button>
                <button
                  className={`control-btn ${view === 'gantt' ? 'active' : ''}`}
                  onClick={() => setView('gantt')}
                  type="button"
                >
                  甘特
                </button>
              </div>
            </div>
          </div>

          {/* 列表视图 */}
          {view === 'list' && (
            <div className="prod-units anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
              {groupedData.map((unit, idx) => {
                return (
                  <div
                    key={unit.id}
                    className="prod-unit"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="prod-unit-header">
                      <div className="prod-unit-title">
                        <span className="prod-unit-icon">
                          {groupBy === 'location' && <MapPin size={14} />}
                          {groupBy === 'act' && <Camera size={14} />}
                          {groupBy === 'character' && <Users size={14} />}
                          {groupBy === 'difficulty' && <TrendingUp size={14} />}
                        </span>
                        <span className="prod-unit-name">{unit.location}</span>
                        <span className="prod-unit-act">ACT {unit.actId}</span>
                      </div>
                      <div className="prod-unit-difficulty" style={{ color: difficultyColor(unit.difficulty) }}>
                        {unit.difficulty.toUpperCase()}
                      </div>
                    </div>

                    <div className="prod-unit-stats">
                      <div className="prod-stat-item">
                        <span className="prod-stat-key">镜头</span>
                        <span className="prod-stat-val">{unit.shotIds.length}</span>
                      </div>
                      <div className="prod-stat-item">
                        <span className="prod-stat-key">时长</span>
                        <span className="prod-stat-val">{unit.totalDuration}s</span>
                      </div>
                      <div className="prod-stat-item">
                        <span className="prod-stat-key">角色</span>
                        <span className="prod-stat-val">{Array.from(unit.characters).join(' · ')}</span>
                      </div>
                    </div>

                    <div className="prod-unit-shots">
                      {unit.shotIds.map((id) => {
                        const shot = script.acts
                          .flatMap((a) => a.shots)
                          .find((s) => s.id === id);
                        if (!shot) return null;
                        return (
                          <div
                            key={id}
                            className="prod-shot"
                            style={{ borderLeftColor: moodColors[shot.mood] }}
                            title={shot.content}
                          >
                            <span className="prod-shot-id">#{id.toString().padStart(2, '0')}</span>
                            <span className="prod-shot-scene">{shot.scene}</span>
                            <span className="prod-shot-time">{shot.timestamp}</span>
                            <span className="prod-shot-dur">{shot.duration}s</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 甘特视图 */}
          {view === 'gantt' && (
            <div className="prod-gantt anim-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="gantt-header">
                <div className="gantt-col-name">拍摄单元</div>
                <div className="gantt-col-timeline">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="gantt-tick" style={{ left: `${(i / 12) * 100}%` }}>
                      {i * 10}
                    </div>
                  ))}
                </div>
              </div>

              {groupedData.map((unit, idx) => {
                const start = (unit.actId - 1) * 10;
                return (
                  <div
                    key={unit.id}
                    className="gantt-row"
                    style={{ animationDelay: `${idx * 0.05}s` }}
                  >
                    <div className="gantt-row-name">
                      <span className="gantt-name-text">{unit.location}</span>
                      <span className="gantt-name-meta">{unit.shotIds.length} 镜 · {unit.totalDuration}s</span>
                    </div>
                    <div className="gantt-row-bar-track">
                      <div
                        className="gantt-row-bar"
                        style={{
                          left: `${start}%`,
                          width: `${(unit.shotIds.length / 72) * 100}%`,
                          background: difficultyColor(unit.difficulty),
                        }}
                      >
                        <span className="gantt-bar-label">ACT {unit.actId}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
