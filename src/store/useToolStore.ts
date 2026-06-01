
import { create } from 'zustand';
import { Tool } from '@/types';
import { tools } from '@/data/mockData';

interface ToolStore {
  tools: Tool[];
  filteredTools: Tool[];
  searchQuery: string;
  selectedCategory: string;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  filterTools: () => void;
}

export const useToolStore = create<ToolStore>((set, get) => ({
  tools,
  filteredTools: tools,
  searchQuery: '',
  selectedCategory: 'all',
  
  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().filterTools();
  },
  
  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
    get().filterTools();
  },
  
  filterTools: () => {
    const { tools, searchQuery, selectedCategory } = get();
    
    let filtered = [...tools];
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(tool => 
        tool.categories.includes(selectedCategory)
      );
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(tool => 
        tool.name.toLowerCase().includes(query) || 
        tool.description.toLowerCase().includes(query) ||
        tool.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    set({ filteredTools: filtered });
  }
}));
