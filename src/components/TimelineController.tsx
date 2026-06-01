import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Rewind, FastForward } from 'lucide-react';
import { useStoryboardStore } from '@/store/useStoryboardStore';
import { motion } from 'framer-motion';

interface TimelineControllerProps {
  totalFrames?: number;
}

const TimelineController: React.FC<TimelineControllerProps> = ({ totalFrames = 180 }) => {
  const { 
    currentFrame, 
    isPlaying, 
    setCurrentFrame, 
    setIsPlaying, 
    scenes,
    currentSceneId 
  } = useStoryboardStore();
  
  const animationRef = useRef<number>();

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentFrame(prev => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
        animationRef.current = requestAnimationFrame(animate);
      };
      
      const interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= totalFrames - 1) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, 33);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, totalFrames, setCurrentFrame, setIsPlaying]);

  const formatTime = (frame: number): string => {
    const seconds = Math.floor(frame / 30);
    const frames = frame % 30;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentFrame(parseInt(e.target.value));
    setIsPlaying(false);
  };

  const getActiveScene = () => {
    return scenes.find(scene => currentFrame >= scene.startTime && currentFrame < scene.endTime);
  };

  const activeScene = getActiveScene();

  return (
    <div className="w-full bg-gray-900/90 backdrop-blur-sm border-t border-gray-700 p-4">
      {/* 时间线轨道 */}
      <div className="mb-4">
        <div className="relative h-8 bg-gray-800 rounded-full overflow-hidden">
          {/* 场景轨道 */}
          {scenes.map(scene => {
            const startPercent = (scene.startTime / totalFrames) * 100;
            const widthPercent = ((scene.endTime - scene.startTime) / totalFrames) * 100;
            return (
              <div
                key={scene.id}
                className={`absolute top-0 h-full cursor-pointer transition-opacity ${
                  currentSceneId === scene.id ? 'opacity-100' : 'opacity-60'
                }`}
                style={{
                  left: `${startPercent}%`,
                  width: `${widthPercent}%`,
                  backgroundColor: scene.color + '40',
                  borderLeft: `3px solid ${scene.color}`,
                }}
                onClick={() => {
                  setCurrentFrame(scene.startTime);
                  setCurrentSceneId(scene.id);
                }}
              >
                <div className="px-2 py-1 text-xs text-white truncate" style={{ color: scene.color }}>
                  {scene.name}
                </div>
              </div>
            );
          })}
          
          {/* 当前帧指示器 */}
          <motion.div
            className="absolute top-0 h-full w-1 bg-cyan-400 shadow-[0_0_10px_#00d4ff]"
            style={{ left: `${(currentFrame / totalFrames) * 100}%` }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>

      {/* 控制滑块 */}
      <div className="mb-4">
        <input
          type="range"
          min={0}
          max={totalFrames - 1}
          value={currentFrame}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
        />
      </div>

      {/* 控制按钮和信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentFrame(0)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <SkipBack size={20} />
          </button>
          
          <button
            onClick={() => setCurrentFrame(Math.max(0, currentFrame - 5))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Rewind size={20} />
          </button>
          
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-3 rounded-full transition-all ${
              isPlaying 
                ? 'bg-pink-600 text-white shadow-[0_0_20px_#ff0080]' 
                : 'bg-cyan-600 text-white hover:bg-cyan-500 shadow-[0_0_20px_#00d4ff]'
            }`}
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
          </button>
          
          <button
            onClick={() => setCurrentFrame(Math.min(totalFrames - 1, currentFrame + 5))}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <FastForward size={20} />
          </button>
          
          <button
            onClick={() => setCurrentFrame(totalFrames - 1)}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <SkipForward size={20} />
          </button>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider">当前帧</div>
            <div className="font-mono text-lg text-cyan-400">{currentFrame}</div>
          </div>
          
          <div className="text-center">
            <div className="text-xs text-gray-500 uppercase tracking-wider">时间码</div>
            <div className="font-mono text-lg text-pink-400">{formatTime(currentFrame)}</div>
          </div>
          
          {activeScene && (
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase tracking-wider">当前场景</div>
              <div className="font-bold text-lg" style={{ color: activeScene.color }}>
                {activeScene.name}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimelineController;
