import { create } from 'zustand';
import type { Project, File, Tool } from '@/types';

interface ProjectStore {
  projects: Project[];
  files: File[];
  tools: Tool[];
  currentProjectId: string | null;
  
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setCurrentProjectId: (id: string | null) => void;
  
  addFile: (file: Omit<File, 'id' | 'updatedAt'>) => void;
  updateFile: (projectId: string, path: string, content: string) => void;
  getFilesByProject: (projectId: string) => File[];
  
  installTool: (toolId: string) => void;
  uninstallTool: (toolId: string) => void;
  
  getProjectById: (id: string) => Project | undefined;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialProjects: Project[] = [
  {
    id: 'proj-1',
    name: '电商管理后台',
    description: '基于React的电商平台管理系统',
    template: 'react',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    buildStatus: 'success',
  },
  {
    id: 'proj-2',
    name: '数据可视化仪表盘',
    description: '实时数据监控与分析平台',
    template: 'react',
    status: 'active',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    buildStatus: 'success',
  },
  {
    id: 'proj-3',
    name: '移动端H5商城',
    description: '响应式移动端购物应用',
    template: 'vue',
    status: 'active',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-15'),
    buildStatus: 'building',
  },
  {
    id: 'proj-4',
    name: '企业官网重构',
    description: '现代化企业官网设计',
    template: 'vanilla',
    status: 'archived',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date('2023-12-20'),
    buildStatus: 'success',
  },
];

const initialTools: Tool[] = [
  { id: 'tool-1', name: 'ESLint', description: '代码质量检查工具', icon: 'code', installed: true, version: '8.56.0' },
  { id: 'tool-2', name: 'Prettier', description: '代码格式化工具', icon: 'format', installed: true, version: '3.2.5' },
  { id: 'tool-3', name: 'Jest', description: 'JavaScript测试框架', icon: 'test', installed: false, version: '29.7.0' },
  { id: 'tool-4', name: 'Vitest', description: '下一代前端测试工具', icon: 'zap', installed: true, version: '1.2.0' },
  { id: 'tool-5', name: 'TailwindCSS', description: '实用优先的CSS框架', icon: 'palette', installed: true, version: '3.4.1' },
  { id: 'tool-6', name: 'Storybook', description: 'UI组件开发环境', icon: 'book', installed: false, version: '7.6.10' },
];

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: initialProjects,
  files: [],
  tools: initialTools,
  currentProjectId: null,
  
  addProject: (project) => {
    const newProject: Project = {
      ...project,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({ projects: [...state.projects, newProject] }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
    }));
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
      files: state.files.filter((f) => f.projectId !== id),
    }));
  },
  
  setCurrentProjectId: (id) => {
    set({ currentProjectId: id });
  },
  
  addFile: (file) => {
    const newFile: File = {
      ...file,
      id: generateId(),
      updatedAt: new Date(),
    };
    set((state) => ({ files: [...state.files, newFile] }));
  },
  
  updateFile: (projectId, path, content) => {
    set((state) => ({
      files: state.files.map((f) =>
        f.projectId === projectId && f.path === path
          ? { ...f, content, updatedAt: new Date() }
          : f
      ),
    }));
  },
  
  getFilesByProject: (projectId) => {
    return get().files.filter((f) => f.projectId === projectId);
  },
  
  installTool: (toolId) => {
    set((state) => ({
      tools: state.tools.map((t) =>
        t.id === toolId ? { ...t, installed: true } : t
      ),
    }));
  },
  
  uninstallTool: (toolId) => {
    set((state) => ({
      tools: state.tools.map((t) =>
        t.id === toolId ? { ...t, installed: false } : t
      ),
    }));
  },
  
  getProjectById: (id) => {
    return get().projects.find((p) => p.id === id);
  },
}));
