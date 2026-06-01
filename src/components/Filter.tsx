
import { categories } from '@/data/mockData';
import { useToolStore } from '@/store/useToolStore';
import * as Icons from 'lucide-react';

export function Filter() {
  const { selectedCategory, setSelectedCategory } = useToolStore();

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)];
    return Icon ? <Icon size={18} /> : null;
  };

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => setSelectedCategory(category.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            selectedCategory === category.id
              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }`}
        >
          {getIcon(category.icon)}
          {category.name}
        </button>
      ))}
    </div>
  );
}
