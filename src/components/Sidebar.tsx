import { Link, useLocation } from 'react-router-dom';
import { documents } from '../data/documents';

export default function Sidebar() {
  const location = useLocation();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scenes': return '🎬';
      case 'characters': return '🎭';
      case 'effects': return '✨';
      case 'camera': return '🎥';
      default: return '📄';
    }
  };

  const categoryNames = {
    scenes: '场景脚本',
    characters: '角色设定',
    effects: '特效设计',
    camera: '运镜设计'
  };

  const groupedDocs = documents.reduce((acc, doc) => {
    if (!acc[doc.category]) {
      acc[doc.category] = [];
    }
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, typeof documents>);

  return (
    <aside className="w-72 bg-gray-900/80 backdrop-blur-xl border-r border-gray-800 flex flex-col h-full">
      <div className="p-6 border-b border-gray-800">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-xl">
            📖
          </div>
          <div>
            <h1 className="font-bold text-white text-lg">分镜阅读器</h1>
            <p className="text-xs text-gray-500">Storyboard Reader</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <Link
            to="/"
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all mb-1 ${
              location.pathname === '/' ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400' : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
            }`}
          >
            <span className="text-lg">🏠</span>
            <span className="font-medium">项目概览</span>
          </Link>
        </div>

        {Object.entries(groupedDocs).map(([category, docs]) => (
          <div key={category} className="mb-6">
            <div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              {getCategoryIcon(category)} {categoryNames[category as keyof typeof categoryNames]}
            </div>
            <div className="space-y-1">
              {docs.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/document/${doc.id}`}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all ${
                    location.pathname === `/document/${doc.id}`
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                  }`}
                >
                  <span className="text-amber-500">▸</span>
                  <span className="font-medium">{doc.name}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <div className="bg-gradient-to-r from-gray-900/80 to-gray-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-amber-500">💡</span>
            <span className="text-sm font-medium text-white">提示</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            点击左侧导航或场景卡片，查看详细的分镜文档
          </p>
        </div>
      </div>
    </aside>
  );
}
