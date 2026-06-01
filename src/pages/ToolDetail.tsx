
import { useParams, useNavigate } from 'react-router-dom';
import { tools, categories } from '@/data/mockData';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import * as Icons from 'lucide-react';

export default function ToolDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tool = tools.find((t) => t.id === id);

  if (!tool) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">工具未找到</h2>
          <p className="text-slate-400 mb-6">该工具可能已被移除或不存在</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    );
  }

  const getCategoryName = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    return cat ? cat.name : categoryId;
  };

  const getCategoryIcon = (categoryId: string) => {
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return null;
    const Icon = (Icons as any)[cat.icon.charAt(0).toUpperCase() + cat.icon.slice(1)];
    return Icon ? <Icon size={16} /> : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>返回</span>
        </button>

        {/* Tool Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-48 h-48 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl p-4 flex-shrink-0">
              <img
                src={tool.icon}
                alt={tool.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                {tool.name}
              </h1>
              <p className="text-lg text-slate-300 mb-6">
                {tool.description}
              </p>
              <div className="flex flex-wrap gap-3">
                {tool.categories.map((categoryId) => (
                  <span
                    key={categoryId}
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-full text-sm"
                  >
                    {getCategoryIcon(categoryId)}
                    {getCategoryName(categoryId)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tool Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="text-cyan-400" size={24} />
              <h3 className="text-lg font-semibold text-white">添加日期</h3>
            </div>
            <p className="text-slate-300">
              {new Date(tool.addedAt).toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <Tag className="text-cyan-400" size={24} />
              <h3 className="text-lg font-semibold text-white">标签</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {tool.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-slate-700/50 text-slate-300 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            访问工具
            <ExternalLink size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}
