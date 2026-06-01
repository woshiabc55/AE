import React from 'react';
import { motion } from 'framer-motion';
import { Clapperboard, Zap, Sparkles, Download } from 'lucide-react';
import SceneCard from '@/components/SceneCard';
import { useStoryboardStore } from '@/store/useStoryboardStore';

const Home: React.FC = () => {
  const { scenes } = useStoryboardStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/30 to-gray-950">
      {/* 顶部Hero区域 */}
      <section className="relative overflow-hidden pt-16 pb-20">
        {/* 背景效果 */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-yellow-500/20 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* 标志 */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800/50 rounded-full border border-gray-700 mb-8">
              <Clapperboard className="text-cyan-400" size={18} />
              <span className="text-sm text-gray-400">视频分镜演示</span>
              <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full">V1.0</span>
            </div>

            {/* 标题 */}
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              <span className="block bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 bg-clip-text text-transparent">
                创意分镜展示
              </span>
              <span className="block text-white mt-2">视觉故事板</span>
            </h1>

            {/* 副标题 */}
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              探索三个精心设计的场景，从混沌空间的激烈战斗到戏剧舞台的精彩入场，
              体验震撼的巨兽反击之战
            </p>

            {/* 统计信息 */}
            <div className="flex items-center justify-center gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-cyan-400">3</div>
                <div className="text-sm text-gray-500">场景</div>
              </div>
              <div className="w-px h-10 bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-400">6</div>
                <div className="text-sm text-gray-500">秒时长</div>
              </div>
              <div className="w-px h-10 bg-gray-700" />
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">16</div>
                <div className="text-sm text-gray-500">关键帧</div>
              </div>
            </div>

            {/* 特色标签 */}
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
              {[
                { icon: Zap, text: '赛博朋克风格', color: 'text-cyan-400' },
                { icon: Sparkles, text: '动态时间线', color: 'text-pink-400' },
                { icon: Download, text: '可下载资源', color: 'text-yellow-400' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`flex items-center gap-2 px-4 py-2 bg-gray-800/60 rounded-full border border-gray-700/50`}
                >
                  <item.icon size={16} className={item.color} />
                  <span className="text-sm text-gray-300">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* 场景卡片区域 */}
      <section className="container mx-auto px-4 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">场景预览</h2>
          <p className="text-gray-400">点击卡片查看详细分镜和特效信息</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenes.map((scene, index) => (
            <SceneCard key={scene.id} scene={scene} index={index} />
          ))}
        </div>
      </section>

      {/* 底部提示 */}
      <section className="container mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-gray-800/50 to-purple-900/30 rounded-2xl p-8 border border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">准备好开始创作了吗？</h3>
              <p className="text-gray-400">使用我们的分镜工具，将您的创意变成精彩的视觉故事</p>
            </div>
            <div className="flex gap-3">
              <button className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-medium transition-colors shadow-[0_0_20px_#00d4ff/30]">
                立即体验
              </button>
              <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-medium transition-colors border border-gray-700">
                了解更多
              </button>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default Home;
