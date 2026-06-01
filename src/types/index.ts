export interface Project {
  id: string;
  name: string;
  description: string;
  template: 'react' | 'vue' | 'vanilla' | 'svelte';
  status: 'active' | 'archived';
  createdAt: Date;
  updatedAt: Date;
  buildStatus?: 'success' | 'failed' | 'building';
}

export interface File {
  id: string;
  projectId: string;
  path: string;
  content: string;
  updatedAt: Date;
}

export interface Build {
  id: string;
  projectId: string;
  status: 'building' | 'success' | 'failed';
  logs: string[];
  createdAt: Date;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  installed: boolean;
  version: string;
}

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  recentBuilds: number;
  successfulBuilds: number;
}
