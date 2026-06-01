import { useState } from 'react';
import { Header } from '@/components/Layout/Header';
import { useProjectStore } from '@/store/projectStore';
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function ProjectList() {
  const navigate = useNavigate();
  const projects = useProjectStore((state) => state.projects);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTemplate, setFilterTemplate] = useState<string>('all');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    const matchesTemplate = filterTemplate === 'all' || project.template === filterTemplate;
    return matchesSearch && matchesStatus && matchesTemplate;
  });
  
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
  
  const getTemplateColor = (template: string) => {
    const map: Record<string, string> = {
      react: 'bg-blue-100 text-blue-600',
      vue: 'bg-green-100 text-green-600',
      vanilla: 'bg-gray-100 text-gray-600',
      svelte: 'bg-orange-100 text-orange-600',
    };
    return map[template] || 'bg-gray-100 text-gray-600';
  };
  
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  
  const handleDelete = (projectId: string) => {
    deleteProject(projectId);
    setShowDeleteModal(null);
  };
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    template: 'react' | 'vue' | 'vanilla' | 'svelte';
    status: 'active' | 'archived';
  }>({
    name: '',
    description: '',
    template: 'react',
    status: 'active',
  });
  
  const addProject = useProjectStore((state) => state.addProject);
  
  const handleCreate = () => {
    if (newProject.name.trim()) {
      addProject(newProject);
      setNewProject({ name: '', description: '', template: 'react', status: 'active' });
      setShowCreateModal(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header title="项目管理" subtitle="管理您的所有项目" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索项目..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部状态</option>
                <option value="active">活跃</option>
                <option value="archived">已归档</option>
              </select>
              <select
                value={filterTemplate}
                onChange={(e) => setFilterTemplate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">全部模板</option>
                <option value="react">React</option>
                <option value="vue">Vue</option>
                <option value="vanilla">Vanilla</option>
                <option value="svelte">Svelte</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            创建项目
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div 
              key={project.id}
              className="card animate-fadeIn"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center">
                    <FolderKanban className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{project.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getTemplateColor(project.template)}`}>
                      {getTemplateText(project.template)}
                    </span>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={() => setOpenMenu(openMenu === project.id ? null : project.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  
                  {openMenu === project.id && (
                    <div className="absolute right-0 top-full mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        onClick={() => {
                          setOpenMenu(null);
                          navigate(`/projects/${project.id}`);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                        编辑
                      </button>
                      <button 
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        onClick={() => {
                          setOpenMenu(null);
                          setShowDeleteModal(project.id);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                        删除
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-400">
                  更新于 {project.updatedAt.toLocaleDateString('zh-CN')}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${getBuildStatusColor(project.buildStatus)}`}>
                  {project.buildStatus === 'success' && <CheckCircle2 className="w-3 h-3" />}
                  {project.buildStatus === 'failed' && <AlertCircle className="w-3 h-3" />}
                  {project.buildStatus === 'building' && <TrendingUp className="w-3 h-3 animate-pulse" />}
                  {getBuildStatusText(project.buildStatus)}
                </span>
              </div>
              
              <button 
                onClick={() => navigate(`/projects/${project.id}`)}
                className="mt-4 w-full py-2 text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors text-sm font-medium"
              >
                打开项目
              </button>
            </div>
          ))}
        </div>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <FolderKanban className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无项目</h3>
            <p className="text-gray-500 mb-4">点击上方按钮创建您的第一个项目</p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              创建项目
            </button>
          </div>
        )}
      </main>
      
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 animate-fadeIn">
            <h3 className="text-xl font-bold text-gray-900 mb-2">创建新项目</h3>
            <p className="text-sm text-gray-500 mb-6">设置您的新项目信息</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  placeholder="输入项目名称"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目描述</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  placeholder="输入项目描述"
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">选择模板</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['react', 'vue', 'vanilla', 'svelte'] as const).map((template) => (
                    <button
                      key={template}
                      onClick={() => setNewProject({ ...newProject, template })}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        newProject.template === template
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {getTemplateText(template)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 btn-secondary"
              >
                取消
              </button>
              <button 
                onClick={handleCreate}
                className="flex-1 btn-primary"
              >
                创建
              </button>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 animate-fadeIn">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">确认删除</h3>
              <p className="text-gray-500 mb-6">删除后无法恢复此项目，确定要继续吗？</p>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 btn-secondary"
                >
                  取消
                </button>
                <button 
                  onClick={() => handleDelete(showDeleteModal)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
