import { useParams, Link, useNavigate } from 'react-router-dom';
import { documents } from '../data/documents';
import MarkdownRenderer from '../components/MarkdownRenderer';

export default function Document() {
  const { id } = useParams();
  const navigate = useNavigate();
  const document = documents.find(d => d.id === id);

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h2 className="text-2xl font-bold text-white mb-2">文档未找到</h2>
          <p className="text-gray-400 mb-6">该文档不存在或已被删除</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-amber-500/25 transition-all"
          >
            返回首页
          </Link>
        </div>
      </div>
    );
  }

  const currentIndex = documents.findIndex(d => d.id === id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < documents.length - 1;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'scenes': return '🎬';
      case 'characters': return '🎭';
      case 'effects': return '✨';
      case 'camera': return '🎥';
      default: return '📄';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
              >
                <span>←</span>
                <span>返回</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              {hasPrev && (
                <button
                  onClick={() => navigate(`/document/${documents[currentIndex - 1].id}`)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  ← 上一篇
                </button>
              )}
              {hasNext && (
                <button
                  onClick={() => navigate(`/document/${documents[currentIndex + 1].id}`)}
                  className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-xl text-gray-400 hover:text-white transition-all"
                >
                  下一篇 →
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl">
              {getCategoryIcon(document.category)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{document.name}</h1>
              <p className="text-gray-400">
                {document.category === 'scenes' && '场景脚本'}
                {document.category === 'characters' && '角色设定'}
                {document.category === 'effects' && '特效设计'}
                {document.category === 'camera' && '运镜设计'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8">
          <style>{`
            .markdown-body {
              color: #e5e7eb;
              line-height: 1.8;
            }
            .markdown-body h1 {
              font-size: 2rem;
              font-weight: 700;
              color: #fbbf24;
              margin-bottom: 1.5rem;
              padding-bottom: 0.5rem;
              border-bottom: 1px solid #374151;
            }
            .markdown-body h2 {
              font-size: 1.5rem;
              font-weight: 600;
              color: #f59e0b;
              margin-top: 2rem;
              margin-bottom: 1rem;
            }
            .markdown-body h3 {
              font-size: 1.25rem;
              font-weight: 600;
              color: #fcd34d;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            .markdown-body p {
              margin-bottom: 1rem;
              color: #d1d5db;
            }
            .markdown-body ul, .markdown-body ol {
              margin-bottom: 1rem;
              padding-left: 1.5rem;
            }
            .markdown-body li {
              margin-bottom: 0.5rem;
              color: #d1d5db;
            }
            .markdown-body code {
              background: #1f2937;
              padding: 0.125rem 0.375rem;
              border-radius: 0.25rem;
              font-family: monospace;
              font-size: 0.875rem;
              color: #fbbf24;
            }
            .markdown-body pre {
              background: #111827;
              padding: 1rem;
              border-radius: 0.5rem;
              overflow-x: auto;
              margin-bottom: 1rem;
            }
            .markdown-body pre code {
              background: transparent;
              padding: 0;
            }
            .markdown-body hr {
              border-color: #374151;
              margin: 2rem 0;
            }
            .markdown-body table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
            }
            .markdown-body th, .markdown-body td {
              border: 1px solid #374151;
              padding: 0.75rem;
              text-align: left;
            }
            .markdown-body th {
              background: #1f2937;
            }
          `}</style>
          <MarkdownRenderer content={document.content} />
        </div>
      </div>
    </div>
  );
}
