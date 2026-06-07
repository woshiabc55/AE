// 部长剧情页

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { departments } from '../data/departments';
import { ArrowLeft, X } from 'lucide-react';

const dialogues: Record<string, { speaker: string; lines: string[] }> = {
  control: {
    speaker: 'Malkuth · 控制部长',
    lines: [
      '欢迎来到脑叶公司，主管。',
      '这里收容的……是那些被世界遗弃的存在。',
      '他们有自己的规则。学会这些规则——',
      '——否则，你将失去一切。',
      '（你将作为这个"电池"系统的主管，照看他们。）',
    ],
  },
  info: {
    speaker: 'Yesod · 情报部长',
    lines: [
      '信息是这间设施里最稀缺的资源。',
      '我已记录了这里发生的一切。',
      '这些记录……你是否也有权利知道？',
      '……但愿如此。',
    ],
  },
  safety: {
    speaker: 'Hod · 安保部长',
    lines: [
      '安保的本质不是镇压——',
      '是让员工在崩溃前，找到回家的路。',
      '你问我如何看待那些失联的名字？',
      '……我不敢回答。',
    ],
  },
  training: {
    speaker: 'Netzach · 培训部长',
    lines: [
      '喝酒吗？……开玩笑的。',
      '你看到那些家伙的眼神了吗？',
      '每一个走进收容单元的人……',
      '都已经准备好了一切——除了活着走出来。',
    ],
  },
  central: {
    speaker: 'Tiphareth · 中央本部长',
    lines: [
      '我代表七位部长的意志。',
      '你做出的每一个决定……',
      '都将通过我们的审核。',
      '这是保护，也是审判。',
    ],
  },
};

export default function Story() {
  const deptId = useGameStore((s) => s.currentStoryDept);
  const close = useGameStore((s) => s.closeStory);
  const progress = useGameStore((s) => s.storyProgress);

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
  const story = dialogues[deptId] || { speaker: dept?.director || '???', lines: ['……（沉默）'] };
  const cur = progress[deptId] || 0;
  const line = story.lines[Math.min(cur, story.lines.length - 1)];

  return (
    <div className="h-screen w-screen flex flex-col bg-void noise-bg crt-scanlines overflow-hidden">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回
        </Link>
        <h1 className="font-display text-amber text-lg tracking-widest font-bold">{dept?.name || deptId} · 核心抑制</h1>
        <button onClick={close} className="ml-auto btn-pixel text-[10px]">
          <X className="w-3 h-3" /> 关闭
        </button>
      </div>

      <div className="flex-1 flex">
        {/* 部长立绘占位 */}
        <div className="w-1/3 bg-gradient-to-r from-obsidian to-panel-light/20 flex items-end justify-center pb-12">
          <div className="text-center">
            <div className="w-48 h-64 bg-panel border-2 border-panel-light flex items-center justify-center mx-auto mb-2"
                 style={{ borderColor: dept?.color || '#5a5a6a' }}>
              <div className="font-display text-[8px] text-text-dim">[立绘占位]</div>
            </div>
            <div className="font-display text-amber tracking-widest text-sm">{dept?.director || '???'}</div>
          </div>
        </div>

        {/* 对白框 */}
        <div className="flex-1 p-8 flex flex-col justify-end">
          <div className="font-display text-text-mute text-xs tracking-widest mb-2">
            {story.speaker}
          </div>
          <div className="font-serif text-bone text-xl leading-loose border-l-2 border-amber pl-6">
            {line}
          </div>
          <div className="mt-8 flex gap-2">
            <button onClick={close} className="btn-pixel text-[10px]">继续 →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
