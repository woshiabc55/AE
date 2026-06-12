import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { script as defaultScript, dialogueScript, type Script } from '../data/scriptData';
import { ChevronLeft, FileText, Filter, User } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

export default function ScriptPage() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [activeCharacter, setActiveCharacter] = useState<string>('all');
  const [activeAct, setActiveAct] = useState<number>(0); // 0 = 全部

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

  const characterColor: Record<string, string> = {
    '陈守田': '#d4af37',
    '守田翁': '#d4af37',
    '燕无忧': '#ff6b35',
    '李清禾': '#a29bfe',
    '魏镇': '#74b9ff',
  };

  const filteredDialogue = useMemo(() => {
    return dialogueScript.filter((d) => {
      if (activeAct !== 0 && d.actId !== activeAct) return false;
      if (activeCharacter !== 'all' && d.character !== activeCharacter) return false;
      return true;
    });
  }, [activeAct, activeCharacter]);

  // 按场景归组对话
  const groupedDialogue = useMemo(() => {
    const groups: { actId: number; actTitle: string; lines: typeof filteredDialogue }[] = [];
    filteredDialogue.forEach((line) => {
      let group = groups.find((g) => g.actId === line.actId);
      if (!group) {
        const act = script.acts.find((a) => a.id === line.actId);
        group = { actId: line.actId, actTitle: act?.title ?? '', lines: [] };
        groups.push(group);
      }
      group.lines.push(line);
    });
    return groups;
  }, [filteredDialogue, script.acts]);

  const characters = Array.from(new Set(dialogueScript.map((d) => d.character)));

  return (
    <>
      <ParticleBackground />
      <div className="script-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · SCRIPT PAGES</div>
        <div className="imax-label imax-label-bottom">{dialogueScript.length} LINES · FORMATTED</div>

        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <FileText size={12} />
              <span>FORMATTED SCRIPT</span>
            </div>
            <h1 className="timeline-title">剧本页 · SCRIPT PAGES</h1>
            <p className="timeline-desc">
              演员的圣经。场号、人物、动作、台词、表演提示——一切按工业标准排列。
            </p>
          </header>

          {/* 筛选器 */}
          <div className="script-filters anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="filter-group">
              <span className="filter-label">
                <Filter size={11} /> 幕
              </span>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${activeAct === 0 ? 'active' : ''}`}
                  onClick={() => setActiveAct(0)}
                  type="button"
                >
                  全部
                </button>
                {script.acts.map((act) => (
                  <button
                    key={act.id}
                    className={`filter-btn ${activeAct === act.id ? 'active' : ''}`}
                    onClick={() => setActiveAct(act.id)}
                    type="button"
                    style={activeAct === act.id ? { borderColor: act.accentColor, color: act.accentColor } : {}}
                  >
                    {act.glyph} ACT {act.id}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <span className="filter-label">
                <User size={11} /> 角色
              </span>
              <div className="filter-buttons">
                <button
                  className={`filter-btn ${activeCharacter === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveCharacter('all')}
                  type="button"
                >
                  全部
                </button>
                {characters.map((char) => (
                  <button
                    key={char}
                    className={`filter-btn ${activeCharacter === char ? 'active' : ''}`}
                    onClick={() => setActiveCharacter(char)}
                    type="button"
                    style={
                      activeCharacter === char
                        ? { borderColor: characterColor[char] ?? '#d4af37', color: characterColor[char] ?? '#d4af37' }
                        : {}
                    }
                  >
                    {char}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 剧本页面 */}
          <div className="script-pages">
            {groupedDialogue.length === 0 ? (
              <div className="empty-state">
                <FileText size={48} style={{ color: 'var(--color-ash)', marginBottom: 'var(--space-3)' }} />
                <p>没有匹配的对白</p>
              </div>
            ) : (
              groupedDialogue.map((group) => {
                const act = script.acts.find((a) => a.id === group.actId);
                return (
                  <div key={group.actId} className="script-page-block anim-fade-in-up">
                    <div className="script-page-header" style={{ borderColor: act?.accentColor }}>
                      <div className="page-header-content">
                        <span className="page-act-num">ACT {group.actId.toString().padStart(2, '0')}</span>
                        <span className="page-act-title" style={{ color: act?.accentColor }}>
                          {group.actTitle}
                        </span>
                      </div>
                      <span className="page-line-count">{group.lines.length} LINES</span>
                    </div>

                    <div className="script-paper">
                      {group.lines.map((line, idx) => {
                        const charColor = characterColor[line.character] ?? '#d4af37';
                        const shot = script.acts
                          .find((a) => a.id === line.actId)
                          ?.shots.find((s) => s.id === line.shotId);
                        return (
                          <div key={idx} className="dialogue-line">
                            <div className="dialogue-shot-ref">
                              <span className="shot-ref-num">#{line.shotId.toString().padStart(2, '0')}</span>
                              {shot && <span className="shot-ref-scene">{shot.scene}</span>}
                            </div>
                            <div className="dialogue-content">
                              <div className="character-name" style={{ color: charColor, borderLeftColor: charColor }}>
                                {line.character.toUpperCase()}
                                {line.tone && <span className="dialogue-tone">({line.tone})</span>}
                              </div>
                              {line.parenthetical && (
                                <div className="dialogue-parenthetical">（{line.parenthetical}）</div>
                              )}
                              <div className="dialogue-text">{line.line}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}
