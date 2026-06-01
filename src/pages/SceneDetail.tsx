import React from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Code, Clock, Film, Sparkles } from 'lucide-react';
import { useStoryboardStore } from '@/store/useStoryboardStore';

const SceneDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { scenes, currentFrame, getCurrentScene } = useStoryboardStore();
  
  const scene = scenes.find(s => s.id === id);

  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">场景未找到</h2>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const handleDownload = (type: 'script' | 'storyboard') => {
    if (type === 'script') {
      const link = document.createElement('a');
      link.href = '/project_creation_script.jsx';
      link.download = 'project_creation_script.jsx';
      link.click();
    } else {
      const link = document.createElement('a');
      link.href = '/storyboard_script.md';
      link.download = 'storyboard_script.md';
      link.click();
    }
  };

  const getActiveFrame = () => {
    let activeFrame = scene.frames[0];
    for (let i = scene.frames.length - 1; i >= 0; i--) {
      if (currentFrame >= scene.frames[i].frame) {
        activeFrame = scene.frames[i];
        break;
      }
    }
    return activeFrame;
  };

  const activeFrame = getActiveFrame();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>返回首页</span>
            </button>
            <h1 className="text-xl font-bold" style={{ color: scene.color }}>
              {scene.name}
            </h1>
            <div className="flex gap-2">
              <button
                onClick={() => handleDownload('script')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <Code size={16} />
                <span>下载脚本</span>
              </button>
              <button
                onClick={() => handleDownload('storyboard')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors text-sm"
              >
                <FileText size={16} />
                <span>下载分镜</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 场景信息 */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧 - 场景详情 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 场景标题 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: scene.color + '30', border: `2px solid ${scene.color}` }}
                    >
                      <Film size={24} style={{ color: scene.color }} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold" style={{ color: scene.color }}>
                        {scene.name}
                      </h2>
                      <p className="text-gray-400">{scene.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Clock size={16} />
                  <span>{scene.duration}秒 / {scene.endTime - scene.startTime}帧</span>
                </div>
              </div>

              {/* 当前帧预览 */}
              <div 
                className="rounded-xl p-6 border-2"
                style={{ borderColor: scene.color + '40', backgroundColor: scene.color + '10' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={20} style={{ color: scene.color }} />
                  <span className="text-sm font-medium text-gray-400">当前帧预览</span>
                  <span className="ml-auto px-3 py-1 bg-gray-800 rounded-full text-xs font-mono" style={{ color: scene.color }}>
                    帧 {currentFrame}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{activeFrame?.description}</h3>
                <p className="text-gray-400 mb-4">{activeFrame?.content}</p>
                <div className="flex flex-wrap gap-2">
                  <span 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: scene.color + '30', color: scene.color }}
                  >
                    {activeFrame?.effect}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* 分镜表格 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gray-900/50 rounded-2xl border border-gray-800 overflow-hidden"
            >
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-bold text-white">分镜表格</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-800/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        帧号
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        镜头描述
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        画面内容
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">
                        特效
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {scene.frames.map((frame, index) => {
                      const isActive = currentFrame >= frame.frame && 
                        (index === scene.frames.length - 1 || currentFrame < scene.frames[index + 1].frame);
                      
                      return (
                        <motion.tr
                          key={frame.frame}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + index * 0.05 }}
                          className={`
                            hover:bg-gray-800/30 transition-colors cursor-pointer
                            ${isActive ? 'bg-gray-800/50' : ''}
                          `}
                          style={{ 
                            borderLeft: isActive ? `3px solid ${scene.color}` : '3px solid transparent',
                            boxShadow: isActive ? `inset 0 0 20px ${scene.color}10` : 'none',
                          }}
                          onClick={() => {
                            const { setCurrentFrame, setIsPlaying } = useStoryboardStore.getState();
                            setCurrentFrame(frame.frame);
                            setIsPlaying(false);
                          }}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-mono text-sm" style={{ color: isActive ? scene.color : '#9CA3AF' }}>
                              {frame.frame}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-medium text-white">
                              {frame.description}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-400">
                              {frame.content}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ backgroundColor: scene.color + '20', color: scene.color }}
                            >
                              {frame.effect}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* 右侧 - 信息面板 */}
          <div className="space-y-6">
            {/* 场景统计 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4">场景统计</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">关键帧数</span>
                  <span className="text-xl font-bold" style={{ color: scene.color }}>
                    {scene.frames.length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">时长</span>
                  <span className="text-xl font-bold text-white">{scene.duration}s</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-400">总帧数</span>
                  <span className="text-xl font-bold text-white">
                    {scene.endTime - scene.startTime}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mt-4">
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${((currentFrame - scene.startTime) / (scene.endTime - scene.startTime)) * 100}%`,
                      backgroundColor: scene.color,
                    }}
                  />
                </div>
                <div className="text-center text-sm text-gray-500">
                  进度: {Math.round(((currentFrame - scene.startTime) / (scene.endTime - scene.startTime)) * 100)}%
                </div>
              </div>
            </motion.div>

            {/* 资源下载 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4">资源下载</h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleDownload('script')}
                  className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                    <Code size={20} className="text-cyan-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">AE创建脚本</div>
                    <div className="text-xs text-gray-500">project_creation_script.jsx</div>
                  </div>
                  <Download size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </button>
                <button
                  onClick={() => handleDownload('storyboard')}
                  className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center">
                    <FileText size={20} className="text-pink-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">分镜脚本文档</div>
                    <div className="text-xs text-gray-500">storyboard_script.md</div>
                  </div>
                  <Download size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                </button>
              </div>
            </motion.div>

            {/* 其他场景 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800"
            >
              <h3 className="text-lg font-bold text-white mb-4">其他场景</h3>
              <div className="space-y-3">
                {scenes.filter(s => s.id !== scene.id).map(otherScene => (
                  <button
                    key={otherScene.id}
                    onClick={() => navigate(`/scene/${otherScene.id}`)}
                    className="w-full flex items-center gap-3 p-4 bg-gray-800 hover:bg-gray-700 rounded-xl transition-colors group text-left"
                  >
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: otherScene.color + '20' }}
                    >
                      <Film size={18} style={{ color: otherScene.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-white">{otherScene.name}</div>
                      <div className="text-xs text-gray-500">{otherScene.duration}秒</div>
                    </div>
                    <div className="text-gray-500 group-hover:text-white transition-colors">→</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SceneDetail;
