import { Header } from '@/components/Layout/Header';
import { useProjectStore } from '@/store/projectStore';
import { 
  FolderKanban, 
  TrendingUp, 
  CheckCircle2, 
  AlertCircle,
  Activity,
  ArrowRight,
  Clock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    recentBuilds: 12,
    successfulBuilds: 10,
  };
  
  const recentProjects = projects.slice(0, 3);
  
  const statCards = [
    { 
      title: '总项目数', 
      value: stats.totalProjects, 
      icon: FolderKanban, 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    { 
      title: '活跃项目', 
      value: stats.activeProjects, 
      icon: Activity, 
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600'
    },
    { 
      title: '最近构建', 
      value: stats.recentBuilds, 
      icon: Clock, 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    },
    { 
      title: '构建成功', 
      value: stats.successfulBuilds, 
      icon: CheckCircle2, 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
  ];
  
  const getBuildStatusColor = (status?: string) => {
    switch (status) {
      case 'success': return 'text-green-500 bg-green-50';
      case 'failed': return 'text-red-500 bg-red-50';
      case 'building': return 'text-yellow-500 bg-yellow-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };
  
  const getBuildStatusText = (status?: string) => {
    switch (status) {
      case 'success': return '构建成功';
      case 'failed': return '构建失败';
      case 'building': return '构建中';
      default: return '未构建';
    }
  };
  
  const getTemplateText = (template: string) => {
    const map: Record<string, string> = {
      react: 'React',
      vue: 'Vue',
      vanilla: 'Vanilla',
      svelte: 'Svelte',
    };
    return map[template] || template;
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header title="仪表板" subtitle="欢迎回来，查看您的项目概览" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div 
                key={index}
                className="card animate-fadeIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${card.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-900">最近项目</h3>
              <button 
                onClick={() => navigate('/projects')}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="space-y-4">
              {recentProjects.map((project) => (
                <div 
                  key={project.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                      {project.name}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">{project.description}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                      {getTemplateText(project.template)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getBuildStatusColor(project.buildStatus)}`}>
                      {project.buildStatus === 'success' && <CheckCircle2 className="w-3 h-3" />}
                      {project.buildStatus === 'failed' && <AlertCircle className="w-3 h-3" />}
                      {project.buildStatus === 'building' && <TrendingUp className="w-3 h-3 animate-pulse" />}
                      {getBuildStatusText(project.buildStatus)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-6">快速操作</h3>
            <div className="space-y-3">
              <button 
                onClick={() => navigate('/projects')}
                className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                <FolderKanban className="w-5 h-5" />
                <span className="font-medium">创建新项目</span>
              </button>
              <button 
                onClick={() => navigate('/tools')}
                className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="font-medium">安装工具</span>
              </button>
              <button className="w-full flex items-center gap-3 p-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">运行测试</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
