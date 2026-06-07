// 角色图鉴页 - 部长档案 + 员工原型 + 主管背景

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { directors, employeeArchetypes, playerProfile } from '../data/characters';
import { sephirot, sephirahById } from '../data/qliphoth';
import { ArrowLeft, User, Users, Crown, Sword } from 'lucide-react';
import { cn } from '../lib/utils';

type Tab = 'director' | 'employee' | 'player';

export default function Characters() {
  const [tab, setTab] = useState<Tab>('director');
  const [selectedDirector, setSelectedDirector] = useState<string>('control');
  const [selectedArchetype, setSelectedArchetype] = useState<string>('guardian');

  const dir = directors.find(d => d.sephirahId === selectedDirector);
  const sep = sephirahById(selectedDirector);
  const arc = employeeArchetypes.find(a => a.id === selectedArchetype);

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-hidden">
      {/* 顶部 */}
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">角色图鉴</h1>
        <span className="text-text-dim font-mono text-[10px]">部长 · 员工 · 主管</span>

        <div className="ml-auto flex gap-1">
          <TabBtn cur={tab} val="director" icon={Crown} label="部长" onClick={() => setTab('director')} />
          <TabBtn cur={tab} val="employee" icon={Users} label="员工原型" onClick={() => setTab('employee')} />
          <TabBtn cur={tab} val="player" icon={User} label="主管" onClick={() => setTab('player')} />
        </div>
      </div>

      {tab === 'director' && (
        <div className="flex-1 flex overflow-hidden">
          {/* 部长列表 */}
          <div className="w-64 bg-obsidian border-r border-panel-light overflow-y-auto p-2 font-mono text-[10px]">
            <div className="text-amber font-display text-xs tracking-widest mb-2 px-2">部长名册</div>
            {sephirot.map(s => {
              const d = directors.find(x => x.sephirahId === s.id);
              if (!d) return null;
              return (
                <button
                  key={s.id}
                  onClick={() => setSelectedDirector(s.id)}
                  className={cn(
                    'w-full text-left p-2 mb-1 border-l-2 transition-all',
                    selectedDirector === s.id
                      ? 'border-amber bg-amber/10'
                      : 'border-transparent hover:border-amber/40 hover:bg-panel/40'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 shrink-0 flex items-center justify-center text-[14px] font-serif"
                      style={{ background: s.color, color: '#0a0a0a' }}
                    >
                      {s.glyph}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-bone font-bold">{d.nickname}</div>
                      <div className="text-text-dim text-[9px]">D{String(s.order).padStart(2, '0')} · {s.name}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* 部长详情 */}
          {dir && sep && (
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
              {/* 头部 */}
              <div className="flex items-start gap-4 mb-6 border-b border-panel-light/40 pb-4">
                <div
                  className="w-24 h-32 border-2 flex items-center justify-center shrink-0"
                  style={{ borderColor: sep.color, background: '#0a0a0a' }}
                >
                  <div className="text-center">
                    <div className="text-[40px] font-serif" style={{ color: sep.color }}>{sep.glyph}</div>
                    <div className="text-[9px] text-text-mute mt-1">{sep.english}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-text-mute text-[10px]">部长档案 · {sep.english}</div>
                  <h2 className="font-display text-3xl font-bold" style={{ color: sep.color }}>
                    {dir.nickname}
                  </h2>
                  <div className="font-serif text-base text-text-mute mt-1" dir="rtl">{dir.hebrewName}</div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-[10px]">
                    <Field label="年龄" value={String(dir.age)} />
                    <Field label="身高" value={dir.appearance.height} />
                    <Field label="性格" value={dir.personality.mbti} valueColor="#c08aff" />
                  </div>
                </div>
              </div>

              {/* 外貌 */}
              <Section title="外貌" icon={User}>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <Field label="发色" value={dir.appearance.hairColor} />
                  <Field label="瞳色" value={dir.appearance.eyeColor} />
                </div>
                <div className="text-bone/80 text-[11px] mt-2">{dir.appearance.outfit}</div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {dir.appearance.visualTags.map(t => (
                    <span key={t} className="text-[9px] px-1.5 py-0.5 border border-panel-light text-text-mute">#{t}</span>
                  ))}
                </div>
              </Section>

              {/* 人格 */}
              <Section title="人格">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <Field label="MBTI" value={dir.personality.mbti} valueColor="#c08aff" />
                  <Field label="九型" value={dir.personality.enneagram} valueColor="#c08aff" />
                  <Field label="核心特质" value={dir.personality.coreTrait} valueColor="#ffe600" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                  <div className="border-l-2 border-enkephalin pl-2">
                    <div className="text-text-mute text-[9px]">美德</div>
                    <div className="text-enkephalin">{dir.personality.virtue}</div>
                  </div>
                  <div className="border-l-2 border-alert pl-2">
                    <div className="text-text-mute text-[9px]">缺陷</div>
                    <div className="text-alert">{dir.personality.flaw}</div>
                  </div>
                </div>
              </Section>

              {/* 语音 */}
              <Section title="语音" icon={Sword}>
                <div className="space-y-1 text-[11px]">
                  <Field label="语气" value={dir.voice.tone} valueColor="#d9c14a" />
                  <Field label="说话方式" value={dir.voice.speechStyle} />
                  <div className="border-l-2 border-amber pl-2 mt-2 italic font-serif text-amber text-base">
                    "{dir.voice.catchphrase}"
                  </div>
                </div>
              </Section>

              {/* 背景 */}
              <Section title="背景故事">
                <p className="text-bone/90 text-[11px] leading-relaxed">{dir.background}</p>
                <div className="mt-2 space-y-1 text-[10px]">
                  <Field label="行动动机" value={dir.motivation} valueColor="#ffe600" />
                  <Field label="心理创伤" value={dir.trauma} valueColor="#ff0033" />
                  <Field label="机械化背景" value={dir.death} valueColor="#c08aff" />
                </div>
              </Section>

              {/* 关系网 */}
              <Section title="关系网">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <RelationList label="盟友" ids={dir.relationship.ally} color="#4dff88" />
                  <RelationList label="对手" ids={dir.relationship.rival} color="#ff0033" />
                  <RelationList label="复杂" ids={dir.relationship.complex} color="#c08aff" />
                </div>
              </Section>

              {/* 5 天剧情节拍 */}
              <Section title="核心抑制 · 5 天节拍">
                <div className="space-y-1.5">
                  {dir.storyBeats.map(b => (
                    <div key={b.day} className="flex items-center gap-2 bg-panel/40 border-l-2 border-amber/40 p-2">
                      <span className="font-display text-amber text-[10px]">D{b.day}</span>
                      <span className="text-bone text-[11px] flex-1">{b.beat}</span>
                      <EmotionChip emotion={b.emotion} />
                    </div>
                  ))}
                </div>
              </Section>

              {/* 核心抑制战斗 */}
              <Section title="核心抑制（Boss 战）">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <Field label="阶段数" value={String(dir.battle.phases)} valueColor="#ff0033" />
                  <Field label="弱点" value={dir.battle.weakness} valueColor="#4dff88" />
                </div>
                <div className="mt-2 text-bone/80 text-[11px] italic border-l-2 border-alert pl-3">
                  模式：{dir.battle.pattern}
                </div>
              </Section>
            </div>
          )}
        </div>
      )}

      {tab === 'employee' && (
        <div className="flex-1 flex overflow-hidden">
          {/* 原型列表 */}
          <div className="w-64 bg-obsidian border-r border-panel-light overflow-y-auto p-2 font-mono text-[10px]">
            <div className="text-amber font-display text-xs tracking-widest mb-2 px-2">员工原型（6 大类）</div>
            {employeeArchetypes.map(a => (
              <button
                key={a.id}
                onClick={() => setSelectedArchetype(a.id)}
                className={cn(
                  'w-full text-left p-2 mb-1 border-l-2 transition-all',
                  selectedArchetype === a.id ? 'border-amber bg-amber/10' : 'border-transparent hover:border-amber/40 hover:bg-panel/40'
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 shrink-0"
                    style={{ background: a.spriteColor }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-bone font-bold">{a.name}</div>
                    <div className="text-text-dim text-[9px]">{a.temperament}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* 原型详情 */}
          {arc && (
            <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="w-24 h-24 border-2 flex items-center justify-center"
                  style={{ borderColor: arc.spriteColor, background: arc.portraitBg }}
                >
                  <div className="text-3xl font-serif" style={{ color: arc.spriteColor }}>♟</div>
                </div>
                <div className="flex-1">
                  <div className="text-text-mute text-[10px]">员工原型</div>
                  <h2 className="font-display text-3xl font-bold" style={{ color: arc.spriteColor }}>
                    {arc.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-[10px]">
                    <Field label="气质" value={arc.temperament} valueColor="#c08aff" />
                    <Field label="四体液" value={arc.fourHumor} valueColor="#c08aff" />
                  </div>
                </div>
              </div>

              <div className="text-bone/90 text-[12px] italic font-serif border-l-2 border-amber pl-3 mb-4">
                {arc.description}
              </div>

              <Section title="属性加成">
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <Field label="偏好工作加成" value={`+${(arc.successBonus * 100).toFixed(0)}%`} valueColor="#4dff88" />
                  <Field label="厌恶工作惩罚" value={`+${(arc.failPenalty * 100).toFixed(0)}%`} valueColor="#ff0033" />
                  <Field label="恐慌抗性" value={`${(arc.panicResistance * 100).toFixed(0)}%`} valueColor="#ffe600" />
                </div>
              </Section>

              <Section title="工作偏好">
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                  <div className="border-l-2 border-enkephalin pl-2">
                    <div className="text-text-mute text-[9px]">偏好</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {arc.preferredWork.map(w => (
                        <span key={w} className="px-1.5 py-0.5 border border-enkephalin text-enkephalin text-[9px]">{w}</span>
                      ))}
                    </div>
                  </div>
                  <div className="border-l-2 border-alert pl-2">
                    <div className="text-text-mute text-[9px]">厌恶</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {arc.dislikedWork.map(w => (
                        <span key={w} className="px-1.5 py-0.5 border border-alert text-alert text-[9px]">{w}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              <Section title="语音">
                <div className="space-y-1 text-[10px]">
                  <Field label="声线" value={arc.voice} valueColor="#d9c14a" />
                  <div className="border-l-2 border-amber pl-2 mt-2 italic font-serif text-amber text-base">
                    "{arc.catchphrase}"
                  </div>
                </div>
              </Section>

              <Section title="背景故事">
                <p className="text-bone/90 text-[11px] leading-relaxed">{arc.backstory}</p>
              </Section>
            </div>
          )}
        </div>
      )}

      {tab === 'player' && (
        <div className="flex-1 overflow-y-auto p-6 font-mono text-xs">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-start gap-4 mb-6">
              <div
                className="w-32 h-40 border-2 flex items-center justify-center"
                style={{ borderColor: '#ffe600', background: '#0a0a0a' }}
              >
                <div className="text-6xl font-serif text-amber animate-flicker">?</div>
              </div>
              <div className="flex-1">
                <div className="text-text-mute text-[10px]">玩家角色</div>
                <h2 className="font-display text-3xl font-bold text-amber">{playerProfile.name}</h2>
                <div className="text-text-dim font-serif text-base mt-1">真名：{playerProfile.trueName}</div>
                <div className="text-bone/80 text-[11px] leading-relaxed mt-3 italic border-l-2 border-amber pl-3">
                  {playerProfile.background}
                </div>
              </div>
            </div>

            <Section title="设定">
              <div className="space-y-2 text-[11px]">
                <Field label="出身" value={playerProfile.origin} valueColor="#c08aff" />
                <Field label="特殊能力" value={playerProfile.power} valueColor="#4dff88" />
                <Field label="能力代价" value={playerProfile.weakness} valueColor="#ff0033" />
                <Field label="终极目标" value={playerProfile.endGoal} valueColor="#ffe600" />
              </div>
            </Section>

            <Section title="轮回设定（TT2 协议）">
              <div className="bg-panel/40 border-l-2 border-amber pl-3 py-2 text-[11px] text-bone/90 leading-relaxed">
                <p>50 个游戏日 ≈ 现实世界 10 年。</p>
                <p className="mt-2">每一次"回溯"将保留研究进度，但失去一段记忆——也可能是某段你不想失去的羁绊。</p>
                <p className="mt-2 text-alert">前 11 位主管都已死亡。第 12 位的成功率统计为 0%。</p>
              </div>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
}

function TabBtn({ cur, val, icon: Icon, label, onClick }: { cur: Tab; val: Tab; icon: any; label: string; onClick: () => void }) {
  const active = cur === val;
  return (
    <button
      onClick={onClick}
      className={cn(
        'btn-pixel text-[10px] gap-1.5',
        active && 'border-amber text-amber shadow-[0_0_8px_rgba(255,230,0,0.4)]'
      )}
    >
      <Icon className="w-3 h-3" /> {label}
    </button>
  );
}

function Section({ title, icon: Icon, children }: { title: string; icon?: any; children: React.ReactNode }) {
  return (
    <div className="mb-4 border-t border-panel-light/40 pt-3">
      <div className="flex items-center gap-1.5 mb-2">
        {Icon && <Icon className="w-3 h-3 text-amber" />}
        <span className="font-display text-amber text-xs tracking-widest">{title}</span>
      </div>
      {children}
    </div>
  );
}

function Field({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-text-mute text-[9px] uppercase tracking-wider">{label}</span>
      <span className="text-bone" style={valueColor ? { color: valueColor } : undefined}>{value}</span>
    </div>
  );
}

function RelationList({ label, ids, color }: { label: string; ids: string[]; color: string }) {
  return (
    <div className="border-l-2 pl-2" style={{ borderColor: color }}>
      <div className="text-text-mute text-[9px]">{label}</div>
      <div className="space-y-0.5 mt-1">
        {ids.map(id => {
          const s = sephirahById(id);
          return (
            <div key={id} className="text-bone text-[10px]" style={{ color }}>
              {s?.name} · {s?.english}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EmotionChip({ emotion }: { emotion: string }) {
  const map: Record<string, { c: string; l: string }> = {
    neutral: { c: '#5a5a5a', l: '—' },
    anxious: { c: '#c19a4a', l: '焦虑' },
    angry: { c: '#ff0033', l: '愤怒' },
    sad: { c: '#4a8ac1', l: '悲伤' },
    hopeful: { c: '#4dff88', l: '希望' },
    broken: { c: '#c08aff', l: '崩溃' },
  };
  const m = map[emotion] || map.neutral;
  return (
    <span
      className="text-[9px] px-1.5 py-0.5"
      style={{ background: m.c + '30', color: m.c, border: `1px solid ${m.c}60` }}
    >
      {m.l}
    </span>
  );
}
