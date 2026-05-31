import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { LANGUAGE_CONFIG } from '@/types';
import { useStore } from '@/store/useStore';
import VocabularyModule from './VocabularyModule';
import GrammarModule from './GrammarModule';
import SpeakingModule from './SpeakingModule';
import ListeningModule from './ListeningModule';

const MODULE_INFO: Record<string, { title: string; icon: string }> = {
  vocabulary: { title: '词汇学习', icon: '📖' },
  grammar: { title: '语法练习', icon: '✏️' },
  speaking: { title: '口语练习', icon: '🎤' },
  listening: { title: '听力训练', icon: '🎧' },
};

export default function Learn() {
  const { moduleId } = useParams<{ moduleId: string }>();
  const navigate = useNavigate();
  const { currentLanguage } = useStore();
  const langConfig = LANGUAGE_CONFIG[currentLanguage];
  const info = MODULE_INFO[moduleId || ''];

  if (!moduleId || !info) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-400 text-lg mb-4">未找到该学习模块</p>
          <button onClick={() => navigate(-1)} className="btn-primary">返回</button>
        </div>
      </div>
    );
  }

  const renderModule = () => {
    switch (moduleId) {
      case 'vocabulary': return <VocabularyModule />;
      case 'grammar': return <GrammarModule />;
      case 'speaking': return <SpeakingModule />;
      case 'listening': return <ListeningModule />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass"
      >
        <div className="flex items-center justify-between px-4 py-3 max-w-2xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm">返回</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-lg">{info.icon}</span>
            <span className="font-display font-bold text-white">{info.title}</span>
            <span
              className="badge ml-1"
              style={{ backgroundColor: langConfig.bgColor, color: langConfig.color }}
            >
              {langConfig.nativeName}
            </span>
          </div>
          <div className="w-16" />
        </div>
      </motion.div>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {renderModule()}
      </div>
    </div>
  );
}
