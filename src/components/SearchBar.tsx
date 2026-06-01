
import { Search } from 'lucide-react';
import { useToolStore } from '@/store/useToolStore';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useToolStore();

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-slate-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="搜索 AI 工具..."
        className="block w-full pl-12 pr-4 py-4 bg-white border-0 rounded-xl shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
      />
    </div>
  );
}
