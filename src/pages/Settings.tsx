// 设置页

import { Link } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { ArrowLeft, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { audioEngine } from '../audio/audioEngine';

export default function Settings() {
  const reset = useGameStore((s) => s.resetGame);
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.15);

  const toggleAudio = () => {
    const v = !enabled;
    setEnabled(v);
    audioEngine.setEnabled(v);
  };
  const changeVolume = (v: number) => {
    setVolume(v);
    audioEngine.setVolume(v);
  };
  const testBeep = () => audioEngine.beep(800, 0.1);
  const testAlarm = () => audioEngine.alarm();

  return (
    <div className="h-screen w-screen flex flex-col bg-void crt-scanlines overflow-auto">
      <div className="px-4 py-3 bg-obsidian border-b border-panel-light flex items-center gap-3">
        <Link to="/" className="btn-pixel text-[10px] gap-1.5">
          <ArrowLeft className="w-3 h-3" /> 返回监控
        </Link>
        <h1 className="font-display text-amber text-xl tracking-widest font-bold">系统设置</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto w-full space-y-6 font-mono text-sm">
        <div className="bg-panel/40 border border-panel-light p-4">
          <h2 className="font-display text-amber text-base mb-3 tracking-wider">音频</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <button onClick={toggleAudio} className="btn-pixel text-[10px]">
                {enabled ? <Volume2 className="w-3 h-3 mr-1" /> : <VolumeX className="w-3 h-3 mr-1" />}
                {enabled ? '已启用' : '已静音'}
              </button>
              <span className="text-text-dim text-[10px]">首次点击屏幕后自动启动</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-mute w-20">音量</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => changeVolume(parseFloat(e.target.value))}
                className="flex-1 accent-amber"
              />
              <span className="metric-number text-amber w-12 text-right">{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex gap-2">
              <button onClick={testBeep} className="btn-pixel text-[10px]">测试哔声</button>
              <button onClick={testAlarm} className="btn-pixel text-[10px]">测试警报</button>
            </div>
          </div>
        </div>

        <div className="bg-panel/40 border border-panel-light p-4">
          <h2 className="font-display text-amber text-base mb-3 tracking-wider">数据</h2>
          <div className="space-y-3">
            <button
              onClick={() => {
                if (confirm('确定重新开始游戏？当前进度将丢失。')) {
                  reset();
                }
              }}
              className="btn-pixel text-[10px] border-alert text-alert hover:bg-alert/10"
            >
              <RotateCcw className="w-3 h-3 mr-1" /> 重新开始游戏
            </button>
            <p className="text-text-dim text-[10px]">游戏进度自动保存在浏览器 localStorage 中。</p>
          </div>
        </div>

        <div className="bg-panel/40 border border-panel-light p-4">
          <h2 className="font-display text-amber text-base mb-3 tracking-wider">关于</h2>
          <p className="text-bone/80 text-[11px] leading-relaxed">
            脑叶公司（Web 版）—— 一款以 Project Moon《Lobotomy Corporation》游戏机制为蓝本的管理模拟游戏。
            <br /><br />
            玩家扮演"主管"，在监控屏幕视角下运营一家收容超自然生物（异想体）的能源公司，在 50 个游戏日内达成能量收集目标。
            <br /><br />
            <span className="text-text-dim">本作仅为非商业学习作品，与原版游戏无任何关联。</span>
          </p>
        </div>
      </div>
    </div>
  );
}
