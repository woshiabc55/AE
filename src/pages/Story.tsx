// 部长剧情页 - 5 天核心抑制剧情

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { departments } from '../data/departments';
import { qliphahBySephirah } from '../data/qliphoth';
import { directors } from '../data/characters';
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function Story() {
  const deptId = useGameStore((s) => s.currentStoryDept);
  const close = useGameStore((s) => s.closeStory);

  const [phaseIdx, setPhaseIdx] = useState(0);

  if (!deptId) {
    return (
      <div className="h-screen w-screen flex flex-col bg-void items-center justify-center font-serif text-bone">
        <div className="text-center">
          <h1 className="font-display text-2xl text-amber mb-3">部长对白</h1>
          <p className="text-text-mute">未触发剧情。请继续推进游戏。</p>
          <Link to="/" className="btn-pixel mt-4 inline-flex">返回监控</Link>
        </div>
      </div>
    );
  }

  const dept = departments.find(d => d.id === deptId);
  const qli = qliphahBySephirah(deptId);
  const dir = directors.find(d => d.sephirahId === deptId);
  if (!qli || !dir) return null;

  const allPhases = qli.suppressionPhases;
  const currentPhase = allPhases[phaseIdx];

  const handleNext = () => {
    if (phaseIdx < allPhases.length - 1) {
      setPhaseIdx(phaseIdx + 1);
    } else {
      close();
    }
  };
  const handlePrev = () => {
    if (phaseIdx > 0) setPhaseIdx(phaseIdx - 1);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-void noise-bg crt-scanlines overflow-hidden">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回
        </Link>
        <h1 className="font-display text-amber text-lg tracking-widest font-bold">{dept?.name || deptId} · 核心抑制</h1>
        <span className="text-text-dim font-mono text-[10px]">{qli.english} · 5 天剧情</span>
        <button onClick={close} className="ml-auto btn-pixel text-[10px]">
          <X className="w-3 h-3" /> 关闭
        </button>
      </div>

      <div className="flex-1 flex">
        {/* 左侧：部长档案 + 进度 */}
        <div className="w-72 bg-obsidian border-r border-panel-light p-4 overflow-y-auto font-mono text-[10px] space-y-3">
          {/* 立绘占位 */}
          <div
            className="w-full h-48 border-2 flex items-center justify-center"
            style={{ borderColor: '#ffe600', background: '#0a0a0a' }}
          >
            <div className="text-center">
              <div className="text-5xl font-serif text-amber">♛</div>
              <div className="text-[9px] text-text-mute mt-2">[部长立绘占位]</div>
            </div>
          </div>

          <div>
            <div className="text-amber font-display text-sm font-bold">{dir.nickname}</div>
            <div className="text-text-mute text-[10px]">性格：{dir.personality.mbti} · {dir.personality.enneagram}</div>
            <div className="text-text-mute text-[10px]">年龄：{dir.age === -1 ? '永恒' : String(dir.age)}</div>
          </div>

          <div className="text-bone/80 text-[11px] italic font-serif border-l-2 border-amber pl-2">
            "{dir.voice.catchphrase}"
          </div>

          {/* 5 天进度 */}
          <div className="pt-2 border-t border-panel-light/40">
            <div className="text-amber text-[10px] tracking-widest mb-2">5 天节拍</div>
            <div className="space-y-1">
              {allPhases.map((p, i) => (
                <div
                  key={i}
                  className={`p-2 border-l-2 cursor-pointer transition-all ${
                    i === phaseIdx
                      ? 'border-amber bg-amber/10'
                      : i < phaseIdx
                      ? 'border-enkephalin/40 bg-panel/40'
                      : 'border-text-dim/40'
                  }`}
                  onClick={() => setPhaseIdx(i)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-display text-amber text-[10px]">D{p.day}</span>
                    <span className="text-bone text-[11px]">「{p.title}」</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 中央：对白 */}
        <div className="flex-1 flex flex-col p-8">
          <div className="font-display text-text-mute text-xs tracking-widest mb-2 flex items-center gap-2">
            <span className="text-amber">{qli.name} · {qli.english}</span>
            <span>· D{currentPhase.day}</span>
            <span>· {currentPhase.title}</span>
          </div>

          {/* 阴影实体描述 */}
          <div className="mb-4 text-[10px] text-text-dim font-mono">
            阴影实体：<span className="text-alert">{qli.demon}</span> · 代表之罪：<span className="text-alert">{qli.sin}</span>
          </div>

          {/* 对白框 */}
          <div className="flex-1 flex flex-col justify-end max-w-3xl">
            <div className="font-serif text-bone text-xl leading-loose border-l-4 border-amber pl-6 mb-6">
              {currentPhase.narrative}
            </div>

            {/* 选择 */}
            <div className="border-l-4 border-enkephalin pl-6 py-2 bg-enkephalin/5">
              <div className="text-text-mute text-[10px] mb-1 font-mono">▸ 你的回应</div>
              <div className="text-enkephalin font-serif text-lg italic">
                {currentPhase.choice}
              </div>
            </div>

            {/* 控制器 */}
            <div className="mt-8 flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={phaseIdx === 0}
                className="btn-pixel text-[10px] disabled:opacity-30"
              >
                <ChevronLeft className="w-3 h-3" /> 上一天
              </button>
              <span className="text-text-dim font-mono text-[10px]">
                {phaseIdx + 1} / {allPhases.length}
              </span>
              {phaseIdx < allPhases.length - 1 ? (
                <button onClick={handleNext} className="btn-pixel text-[10px]">
                  下一天 <ChevronRight className="w-3 h-3" />
                </button>
              ) : (
                <button onClick={() => { close(); }} className="btn-pixel text-[10px] border-enkephalin text-enkephalin">
                  完成核心抑制
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
