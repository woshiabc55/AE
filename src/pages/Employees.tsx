// 员工管理页

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { statusColor, statusLabel } from '../logic/employeeLogic';
import { ArrowLeft, Plus } from 'lucide-react';
import { egoEquipment } from '../data/ego';

export default function Employees() {
  const employees = useGameStore((s) => s.employees);
  const departments = useGameStore((s) => s.departments);
  const hire = useGameStore((s) => s.hireEmployee);

  // 所有员工列表
  const all = Object.values(employees);

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-auto">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">人事档案</h1>
        <span className="text-text-dim font-mono text-[10px]">总员工：{all.length} · 在职：{all.filter(e => e.status === 'NORMAL').length} · 死亡：{all.filter(e => e.status === 'DEAD').length}</span>
      </div>

      <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 font-mono text-xs">
        {all.map((e) => {
          const weapon = e.equippedWeapon ? egoEquipment.find(x => x.id === e.equippedWeapon) : null;
          const armor = e.equippedArmor ? egoEquipment.find(x => x.id === e.equippedArmor) : null;
          return (
            <div key={e.id} className="bg-panel border border-panel-light p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6" style={{ background: e.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-bone font-bold text-sm truncate">{e.name}</div>
                  <div className="text-[10px] text-text-mute">ID: {e.id.slice(-6)}</div>
                </div>
                <div className="text-[10px]" style={{ color: statusColor(e.status) }}>
                  ● {statusLabel(e.status)}
                </div>
              </div>

              {/* 雷达图 */}
              <svg viewBox="0 0 200 200" className="w-full h-40">
                <g transform="translate(100,100)">
                  {/* 网格 */}
                  {[1, 0.75, 0.5, 0.25].map((r) => (
                    <polygon
                      key={r}
                      points="0,-80 69.3,-40 69.3,40 0,80 -69.3,40 -69.3,-40"
                      className="radar-grid"
                      transform={`scale(${r})`}
                    />
                  ))}
                  {/* 轴 */}
                  {[0, 1, 2, 3, 4, 5].map((i) => {
                    const ang = (i / 6) * Math.PI * 2 - Math.PI / 2;
                    return (
                      <line
                        key={i}
                        x1={0} y1={0}
                        x2={Math.cos(ang) * 80}
                        y2={Math.sin(ang) * 80}
                        className="radar-axis"
                      />
                    );
                  })}
                  {/* 数据 */}
                  {(() => {
                    const f = e.fortitude / 120, p = e.prudence / 120, t = e.temperance / 120, j = e.justice / 120;
                    const points = [
                      [0, -f * 80],
                      [p * 69.3, -p * 40],
                      [p * 69.3, p * 40],
                      [0, j * 80],
                      [-t * 69.3, t * 40],
                      [-t * 69.3, -t * 40],
                    ];
                    return (
                      <polygon
                        points={points.map(p => p.join(',')).join(' ')}
                        className="radar-data"
                      />
                    );
                  })()}
                  {/* 标签 */}
                  {[
                    { l: '勇', x: 0, y: -88 },
                    { l: '慎', x: 78, y: -45 },
                    { l: '律', x: 78, y: 45 },
                    { l: '义', x: 0, y: 92 },
                    { l: '律', x: -78, y: 45 },
                    { l: '慎', x: -78, y: -45 },
                  ].map((l, i) => (
                    <text key={i} x={l.x} y={l.y} textAnchor="middle" className="fill-text-mute text-[9px] font-mono">{l.l}{i === 0 || i === 3 ? (i === 0 ? '气' : '') : ''}{i === 1 || i === 2 || i === 4 || i === 5 ? (i === 1 || i === 5 ? '慎' : '律') : ''}{i === 3 ? '义' : ''}</text>
                  ))}
                </g>
              </svg>

              {/* 属性数字 */}
              <div className="grid grid-cols-4 gap-1 mt-2 text-[9px]">
                <AttrCell label="勇气" v={e.fortitude} color="#c14a4a" />
                <AttrCell label="谨慎" v={e.prudence} color="#4a8ac1" />
                <AttrCell label="自律" v={e.temperance} color="#7ac14a" />
                <AttrCell label="正义" v={e.justice} color="#c19a4a" />
              </div>

              {/* 装备 */}
              <div className="mt-2 pt-2 border-t border-panel-light/40 text-[9px] text-text-mute">
                <div>⚔ {weapon ? weapon.name : '无武器'}</div>
                <div>🛡 {armor ? armor.name : '无护甲'}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-panel-light/60 flex gap-2">
        <button
          onClick={() => hire('control')}
          className="btn-pixel"
        >
          <Plus className="w-3 h-3 mr-1" /> 招募新员工
        </button>
        <span className="text-text-dim font-mono text-[10px] self-center">
          · 新员工将自动分配到第一个有空位的部门
        </span>
      </div>
    </div>
  );
}

function AttrCell({ label, v, color }: { label: string; v: number; color: string }) {
  return (
    <div>
      <div className="text-text-mute">{label}</div>
      <div className="metric-number text-sm" style={{ color }}>{v}</div>
    </div>
  );
}
