import { Laugh, Upload, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
}

export default function Header({ activeTab, onTabChange, onSearch }: HeaderProps) {
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'gallery', label: '梗图库', icon: Laugh },
    { id: 'upload', label: '上传', icon: Upload },
    { id: 'analyze', label: 'AI分析', icon: TrendingUp },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search);
  };

  return (
    <header className="glass sticky top-0 z-50 mx-4 mt-4 px-6 py-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🎨</span>
          <h1 className="text-xl font-bold bg-gradient-to-r from-accent to-purple-400 bg-clip-text text-transparent">
            梗图AI工坊
          </h1>
          <span className="text-xs text-text-dim font-mono bg-surface px-2 py-1 rounded-lg">
            MCP v1.0
          </span>
        </div>

        <nav className="flex items-center gap-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-accent text-white'
                  : 'text-text-dim hover:text-text hover:bg-surface'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        <form onSubmit={handleSearch} className="flex items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="搜索梗图..."
              className="input-field pl-9 py-2 text-sm w-48"
            />
          </div>
        </form>
      </div>
    </header>
  );
}