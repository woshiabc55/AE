import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { script as defaultScript, characters, relationships, type Script } from '../data/scriptData';
import { ChevronLeft, Sword, HandHeart, Eye, GraduationCap, Swords, Sparkles } from 'lucide-react';
import ParticleBackground from '../components/ParticleBackground';

const relationshipTypeMap: Record<string, { label: string; color: string; icon: React.ReactNode; dashArray: string }> = {
  ally: { label: '盟友', color: '#74b9ff', icon: <HandHeart size={12} />, dashArray: '0' },
  enemy: { label: '敌对', color: '#ff6b35', icon: <Swords size={12} />, dashArray: '0' },
  mentor: { label: '师徒', color: '#d4af37', icon: <GraduationCap size={12} />, dashArray: '4 4' },
  family: { label: '家族', color: '#fd79a8', icon: <Sparkles size={12} />, dashArray: '0' },
  rival: { label: '对手', color: '#a29bfe', icon: <Sword size={12} />, dashArray: '6 3' },
  witness: { label: '见证', color: '#b2bec3', icon: <Eye size={12} />, dashArray: '2 4' },
};

const roleColors: Record<string, string> = {
  protagonist: '#d4af37',
  antagonist: '#ff6b35',
  mentor: '#74b9ff',
  support: '#a29bfe',
  witness: '#b2bec3',
};

export default function RelationshipMap() {
  const [script, setScript] = useState<Script>(defaultScript);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<number | null>(null);

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

  // 4个角色分布在圆周
  const centerX = 400;
  const centerY = 400;
  const radius = 240;
  const positions: Record<string, { x: number; y: number }> = {};
  script.characters.forEach((c, i) => {
    const angle = (i / script.characters.length) * Math.PI * 2 - Math.PI / 2;
    positions[c.id] = {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  });

  // 计算每个角色的关系数量
  const relationshipCount: Record<string, number> = {};
  relationships.forEach((r) => {
    relationshipCount[r.from] = (relationshipCount[r.from] ?? 0) + 1;
    relationshipCount[r.to] = (relationshipCount[r.to] ?? 0) + 1;
  });

  return (
    <>
      <ParticleBackground />
      <div className="relationship-page">
        <div className="imax-corner imax-corner-tl" />
        <div className="imax-corner imax-corner-tr" />
        <div className="imax-corner imax-corner-bl" />
        <div className="imax-corner imax-corner-br" />
        <div className="imax-label imax-label-top anim-flicker">IMAX · CHARACTER WEB</div>
        <div className="imax-label imax-label-bottom">4 CHARACTERS · 8 EDGES</div>

        <div style={{ maxWidth: '1600px', margin: '0 auto', padding: 'var(--space-8)' }}>
          <Link to="/script/detail" className="back-button">
            <ChevronLeft size={14} />
            <span>SCRIPT</span>
          </Link>

          <header className="rel-header anim-fade-in-up">
            <div className="timeline-badge">
              <Sparkles size={12} />
              <span>CHARACTER RELATIONSHIPS</span>
            </div>
            <h1 className="timeline-title">人物关系网 · CHARACTER WEB</h1>
            <p className="timeline-desc">
              一个种地的、一柄断潮的刀、一枚快门、一声钟响——四颗星，纠缠如星图。
            </p>
          </header>

          {/* 图例 */}
          <div className="rel-legend anim-fade-in-up" style={{ animationDelay: '0.1s' }}>
            {Object.entries(relationshipTypeMap).map(([key, info]) => (
              <div key={key} className="legend-item">
                <span className="legend-line" style={{ background: info.color, borderTop: `2px ${info.dashArray === '0' ? 'solid' : 'dashed'} ${info.color}` }} />
                <span className="legend-label">{info.label}</span>
              </div>
            ))}
          </div>

          {/* 关系图 */}
          <div className="rel-canvas-wrap anim-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <svg viewBox="0 0 800 800" className="rel-svg">
              {/* 同心圆装饰 */}
              <circle cx={centerX} cy={centerY} r={radius * 0.5} fill="none" stroke="#1a1a24" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx={centerX} cy={centerY} r={radius} fill="none" stroke="#1a1a24" strokeWidth="1" strokeDasharray="2 4" />
              <circle cx={centerX} cy={centerY} r={radius * 1.4} fill="none" stroke="#1a1a24" strokeWidth="1" strokeDasharray="2 4" />

              {/* 中心装饰 */}
              <circle cx={centerX} cy={centerY} r="20" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.4" />
              <text x={centerX} y={centerY + 5} textAnchor="middle" fill="#d4af37" fontSize="10" fontFamily="serif" letterSpacing="2">守田</text>

              {/* 关系连线 */}
              {relationships.map((rel, idx) => {
                const from = positions[rel.from];
                const to = positions[rel.to];
                if (!from || !to) return null;
                const typeInfo = relationshipTypeMap[rel.type];
                const isHovered = hoveredEdge === idx;
                const strokeWidth = 1 + (rel.intensity / 10) * 3;
                const opacity = hoveredEdge === null || isHovered ? 0.8 : 0.3;

                return (
                  <g key={idx}>
                    <line
                      x1={from.x}
                      y1={from.y}
                      x2={to.x}
                      y2={to.y}
                      stroke={typeInfo.color}
                      strokeWidth={isHovered ? strokeWidth + 1 : strokeWidth}
                      strokeDasharray={typeInfo.dashArray}
                      opacity={opacity}
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredEdge(idx)}
                      onMouseLeave={() => setHoveredEdge(null)}
                    />
                    {/* 关系类型标签 */}
                    <text
                      x={(from.x + to.x) / 2}
                      y={(from.y + to.y) / 2 - 8}
                      textAnchor="middle"
                      fill={typeInfo.color}
                      fontSize="10"
                      opacity={isHovered ? 1 : 0.5}
                      fontFamily="monospace"
                      letterSpacing="1"
                    >
                      {rel.description}
                    </text>
                  </g>
                );
              })}

              {/* 角色节点 */}
              {script.characters.map((char) => {
                const pos = positions[char.id];
                if (!pos) return null;
                const isHovered = hoveredNode === char.id;
                const isRelated = hoveredNode && hoveredNode !== char.id &&
                  relationships.some((r) => (r.from === hoveredNode && r.to === char.id) || (r.to === hoveredNode && r.from === char.id));
                const opacity = !hoveredNode || isHovered || isRelated ? 1 : 0.4;
                const count = relationshipCount[char.id] ?? 0;
                const size = 30 + count * 4;

                return (
                  <g
                    key={char.id}
                    onMouseEnter={() => setHoveredNode(char.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* 光晕 */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size + 8}
                      fill={roleColors[char.role]}
                      opacity={isHovered ? 0.2 : 0.1}
                    />
                    {/* 主圆 */}
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={size}
                      fill="rgba(10, 10, 20, 0.95)"
                      stroke={roleColors[char.role]}
                      strokeWidth={isHovered ? 3 : 2}
                      opacity={opacity}
                    />
                    {/* 角色首字 */}
                    <text
                      x={pos.x}
                      y={pos.y - 4}
                      textAnchor="middle"
                      fill={roleColors[char.role]}
                      fontSize="22"
                      fontFamily="serif"
                      opacity={opacity}
                    >
                      {char.name.charAt(0)}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + 14}
                      textAnchor="middle"
                      fill="#7a7a85"
                      fontSize="8"
                      letterSpacing="2"
                      fontFamily="monospace"
                      opacity={opacity}
                    >
                      {char.role.toUpperCase()}
                    </text>
                    {/* 外环标签 */}
                    <text
                      x={pos.x}
                      y={pos.y - size - 12}
                      textAnchor="middle"
                      fill="#e8e8f0"
                      fontSize="14"
                      fontFamily="serif"
                      opacity={opacity}
                    >
                      {char.name}
                    </text>
                    <text
                      x={pos.x}
                      y={pos.y + size + 18}
                      textAnchor="middle"
                      fill="#7a7a85"
                      fontSize="9"
                      fontFamily="serif"
                      fontStyle="italic"
                      opacity={opacity}
                    >
                      {char.alias}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* 角色卡片 */}
          <div className="rel-cards">
            {script.characters.map((char, idx) => (
              <div
                key={char.id}
                className="rel-card anim-fade-in-up"
                style={{
                  borderColor: roleColors[char.role],
                  animationDelay: `${0.3 + idx * 0.1}s`,
                }}
                onMouseEnter={() => setHoveredNode(char.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <div className="rel-card-header" style={{ color: roleColors[char.role] }}>
                  {char.role === 'protagonist' && '主角'}
                  {char.role === 'antagonist' && '反派'}
                  {char.role === 'mentor' && '引路'}
                  {char.role === 'witness' && '见证'}
                </div>
                <h3 className="rel-card-name">{char.name}</h3>
                <div className="rel-card-alias">{char.alias}</div>
                <p className="rel-card-arc">{char.arc}</p>

                <div className="rel-card-connections">
                  <div className="rel-connections-label">关系网络</div>
                  <div className="rel-connections-list">
                    {relationships
                      .filter((r) => r.from === char.id || r.to === char.id)
                      .map((r, i) => {
                        const otherId = r.from === char.id ? r.to : r.from;
                        const other = characters.find((c) => c.id === otherId);
                        const typeInfo = relationshipTypeMap[r.type];
                        return (
                          <div key={i} className="rel-connection-item" style={{ borderLeftColor: typeInfo.color }}>
                            <div className="rel-connection-type">
                              {typeInfo.icon}
                              <span>{typeInfo.label}</span>
                            </div>
                            <div className="rel-connection-target">{other?.name}</div>
                            <div className="rel-connection-desc">{r.description}</div>
                            <div className="rel-connection-intensity">
                              强度 {r.intensity}/10
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
