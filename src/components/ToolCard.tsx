
import { Tool } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="group relative bg-white rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl"
      onClick={() => navigate(`/tool/${tool.id}`)}
    >
      <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 p-4">
        <img
          src={tool.icon}
          alt={tool.name}
          className="w-full h-full object-cover rounded-md"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors">
          {tool.name}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-2 mb-3">
          {tool.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-3">
          {tool.tags.slice(0, 3).map((tag, idx) => (
            <span
              key={idx}
              className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded-md"
            >
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {new Date(tool.addedAt).toLocaleDateString('zh-CN')}
          </span>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
          >
            访问
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
