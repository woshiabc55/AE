// 主监控室页 - 核心游戏页面

import HUD from '../components/hud/HUD';
import DepartmentNav from '../components/hud/DepartmentNav';
import EventLog from '../components/hud/EventLog';
import OrdealPanel from '../components/hud/OrdealPanel';
import ContainmentUnitView from '../components/ContainmentUnitView';
import WorkPanel from '../components/WorkPanel';
import EmployeeSelector from '../components/EmployeeSelector';
import { useGameStore } from '../store/gameStore';
import { useGameLoop } from '../hooks/useGameLoop';
import { useEffect } from 'react';
import { audioEngine } from '../audio/audioEngine';
import { Link } from 'react-router-dom';
import { Cog, BookOpen, Hammer, Users, Activity } from 'lucide-react';

export default function Home() {
  // 启动游戏循环
  useGameLoop();

  const departments = useGameStore((s) => s.departments);
  const employees = useGameStore((s) => s.employees);
  const selUnit = useGameStore((s) => s.selectedUnitId);
  const selectUnit = useGameStore((s) => s.selectUnit);
  const isGameOver = useGameStore((s) => s.isGameOver);
  const isVictory = useGameStore((s) => s.isVictory);
  const gameOverReason = useGameStore((s) => s.gameOverReason);
  const resetGame = useGameStore((s) => s.resetGame);

  // 启动音频（用户首次点击后）
  useEffect(() => {
    const handler = () => {
      audioEngine.init();
      audioEngine.start();
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
    window.addEventListener('click', handler);
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('click', handler);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // 关闭页面
  useEffect(() => {
    return () => audioEngine.stop();
  }, []);

  // 主部门
  const dept = departments[0];
  const deptEmployees = dept.employees
    .map((id) => (id ? employees[id] : null))
    .filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines">
      <HUD />
      <div className="flex-1 flex overflow-hidden">
        <DepartmentNav />
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* 监视器画布 */}
          <div className="flex-1 p-4 overflow-auto crt-vignette bg-[radial-gradient(circle_at_center,#0e0e14,#060608)]">
            <div className="flex items-start gap-3 mb-3">
              <h1 className="font-display text-bone text-2xl tracking-[0.3em] glow-amber">CONTROL ROOM</h1>
              <div className="flex-1" />
              <div className="flex gap-1">
                <NavLinkBtn to="/" icon={Activity} label="监控" />
                <NavLinkBtn to="/employees" icon={Users} label="员工" />
                <NavLinkBtn to="/workshop" icon={Hammer} label="E.G.O" />
                <NavLinkBtn to="/codex" icon={BookOpen} label="图鉴" />
                <NavLinkBtn to="/settings" icon={Cog} label="设置" />
              </div>
            </div>

            {/* 收容单元 + 走廊 */}
            <div className="grid grid-cols-2 gap-6 mb-4">
              {dept.units.slice(0, 2).map((u) => (
                <div key={u.id} className="flex flex-col items-center">
                  <ContainmentUnitView
                    unit={u}
                    deptEmployees={deptEmployees}
                    isSelected={u.id === selUnit}
                    onClick={() => selectUnit(u.id)}
                  />
                </div>
              ))}
            </div>

            {/* 走廊 */}
            <div className="bg-panel/40 border border-panel-light/40 h-12 mb-4 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-around text-text-dim font-mono text-[9px]">
                <span>走廊通道 · 监控范围：U1 ~ U4</span>
                <span className="text-text-dim">·</span>
                <span>能源网络：<span className="text-enkephalin">●</span> 正常</span>
                <span className="text-text-dim">·</span>
                <span>通风：<span className="text-crt">●</span> 正常</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {dept.units.slice(2, 4).map((u) => (
                <div key={u.id} className="flex flex-col items-center">
                  <ContainmentUnitView
                    unit={u}
                    deptEmployees={deptEmployees}
                    isSelected={u.id === selUnit}
                    onClick={() => selectUnit(u.id)}
                  />
                </div>
              ))}
            </div>

            {/* 考验面板 */}
            <div className="mt-4">
              <OrdealPanel />
            </div>
          </div>

          {/* 员工选择器 */}
          <EmployeeSelector />

          {/* 工作面板 */}
          <div className="p-3 border-t border-panel-light/60 bg-obsidian">
            <WorkPanel />
          </div>
        </main>
        <EventLog />
      </div>

      {/* 游戏结束遮罩 */}
      {isGameOver && (
        <div className="absolute inset-0 bg-void/90 flex items-center justify-center z-50">
          <div className="text-center">
            <h1 className={`font-display text-6xl font-black tracking-[0.4em] ${isVictory ? 'text-enkephalin glow-enkephalin' : 'text-alert glow-alert animate-glitch'}`}
                data-text={isVictory ? 'VICTORY' : 'GAME OVER'}>
              {isVictory ? 'VICTORY' : 'GAME OVER'}
            </h1>
            <p className="mt-4 font-serif text-bone/80 text-lg">{gameOverReason}</p>
            <button onClick={resetGame} className="btn-pixel mt-6">↻ 重新开始</button>
          </div>
        </div>
      )}
    </div>
  );
}

function NavLinkBtn({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <Link
      to={to}
      className="btn-pixel text-[10px] gap-1.5 px-2.5 py-1"
    >
      <Icon className="w-3 h-3" />
      {label}
    </Link>
  );
}
