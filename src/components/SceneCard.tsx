import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Film, Sparkles } from 'lucide-react';
import { Scene } from '@/types/storyboard';
import { useStoryboardStore } from '@/store/useStoryboardStore';
import { useNavigate } from 'react-router-dom';

interface SceneCardProps {
  scene: Scene;
  index: number;
}

const SceneCard: React.FC<SceneCardProps> = ({ scene, index }) => {
  const navigate = useNavigate();
  const { setCurrentSceneId, setCurrentFrame, setIsPlaying } = useStoryboardStore();

  const handleClick = () => {
    setCurrentSceneId(scene.id);
    setCurrentFrame(scene.startTime);
    setIsPlaying(false);
    navigate(`/scene/${scene.id}`);
  };

  const gradientColors = {
    scene1: 'from-cyan-500/20 to-blue-900/20',
    scene2: 'from-pink-500/20 to-purple-900/20',
    scene3: 'from-yellow-500/20 to-orange-900/20',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl bg-gradient-to-br border 
        ${gradientColors[scene.id as keyof typeof gradientColors] || 'from-gray-700/20 to-gray-900/20'}
        cursor-pointer group
      `}
      style={{
        borderColor: scene.color + '40',
        borderWidth: '2px',
      }}
      onClick={handleClick}
    >
      {/* 霓虹光效 */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${scene.color}30 0%, transparent 70%)`,
        }}
      />

      <div className="p-6 relative z-10">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div 
            className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: scene.color + '30', border: `2px solid ${scene.color}` }}
            >
              <Film size={20} style={{ color: scene.color }} />
            </div>
            <span className="text-xs font-bold text-white">场景 {index + 1}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-400 text-sm">
            <Clock size={14} />
            <span>{scene.duration}s</span>
          </div>
        </div>

        {/* 标题 */}
        <h3 
          className="text-xl font-bold mb-2 group-hover:scale-[1.02] transition-transform"
          style={{ color: scene.color, textShadow: `0 0 20px ${scene.color}40` }}
        >
          {scene.name}
        </h3>

        {/* 描述 */}
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {scene.description}
        </p>

        {/* 关键帧预览 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {scene.frames.slice(0, 3).map((frame, i) => (
            <span 
              key={i}
              className="
                px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-300
                border border-gray-700
              "
            >
              {frame.description}
            </span>
          ))}
          {scene.frames.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-gray-800 text-gray-500">
              +{scene.frames.length - 3}
            </span>
          )}
        </div>

        {/* 底部信息 */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-gray-500 text-xs">
            <Sparkles size={12} />
            <span>{scene.frames.length} 个关键帧</span>
          </div>
          <div 
            className="flex items-center gap-1 text-sm font-medium group-hover:translate-x-1 transition-transform"
            style={{ color: scene.color }}
          >
            查看详情 →
          </div>
        </div>
      </div>

      {/* 悬停光效 */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 group-hover:h-2 transition-all duration-300"
        style={{ backgroundColor: scene.color }}
      />
    </motion.div>
  );
};

export default SceneCard;
