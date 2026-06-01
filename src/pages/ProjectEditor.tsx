import { useParams, useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { 
  ArrowLeft, 
  Play, 
  Save, 
  FolderOpen,
  FileText,
  Terminal,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  TrendingUp
} from 'lucide-react';
import { useState } from 'react';

export function ProjectEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const project = useProjectStore((state) => state.getProjectById(id || ''));
  const updateProject = useProjectStore((state) => state.updateProject);
  
  const [activeTab, setActiveTab] = useState('editor');
  const [buildStatus, setBuildStatus] = useState<'idle' | 'building' | 'success' | 'failed'>('idle');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [codeContent] = useState(`function App() {
  return (
    <div className="app">
      <h1>Hello, Skill Toolchain!</h1>
      <p>Welcome to your new project.</p>
    </div>
  );
}

export default App;`);
  
  if (!project) {
    return (
      <div className="flex flex-col h-full">
        <div className="h-16 bg-white border-b border-gray-100 px-6 flex items-center">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">项目不存在</h3>
            <p className="text-gray-500 mb-4">无法找到指定的项目</p>
            <button 
              onClick={() => navigate('/projects')}
              className="btn-primary"
            >
              返回项目列表
            </button>
          </div>
        </main>
      </div>
    );
  }
  
  const handleBuild = async () => {
    setBuildStatus('building');
    setBuildLogs([]);
    
    const logs = [
      '[INFO] 开始构建项目...',
      '[INFO] 安装依赖中...',
      '[INFO] 依赖安装完成',
      '[INFO] 执行构建命令...',
      '[SUCCESS] 构建成功完成!'
    ];
    
    for (let i = 0; i < logs.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setBuildLogs((prev) => [...prev, logs[i]]);
    }
    
    await new Promise((resolve) => setTimeout(resolve, 300));
    setBuildStatus('success');
    updateProject(project.id, { buildStatus: 'success' });
  };
  
  const getBuildStatusColor = () => {
    switch (buildStatus) {
      case 'success': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'building': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/projects')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{project.name}</h2>
            <p className="text-sm text-gray-500">{project.template}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Save className="w-4 h-4" />
            保存
          </button>
          <button 
            onClick={handleBuild}
            disabled={buildStatus === 'building'}
            className="btn-primary flex items-center gap-2 disabled:opacity-50"
          >
            {buildStatus === 'building' ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {buildStatus === 'building' ? '构建中...' : '构建'}
          </button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-gray-50 border-r border-gray-100 p-4 overflow-auto">
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">文件结构</h3>
          <div className="space-y-1">
            <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600">
              <FolderOpen className="w-4 h-4" />
              <span>src</span>
            </div>
            <div className="ml-4 space-y-1">
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                <FileText className="w-4 h-4" />
                <span>App.tsx</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                <FileText className="w-4 h-4" />
                <span>main.tsx</span>
              </button>
              <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
                <FileText className="w-4 h-4" />
                <span>index.css</span>
              </button>
            </div>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
              <FileText className="w-4 h-4" />
              <span>index.html</span>
            </button>
            <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg">
              <FileText className="w-4 h-4" />
              <span>package.json</span>
            </button>
          </div>
        </aside>
        
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'editor'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-4 h-4 inline-block mr-2" />
              编辑器
            </button>
            <button
              onClick={() => setActiveTab('terminal')}
              className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'terminal'
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Terminal className="w-4 h-4 inline-block mr-2" />
              终端
            </button>
          </div>
          
          <div className="flex-1 overflow-auto">
            {activeTab === 'editor' && (
              <div className="p-6">
                <div className="bg-gray-900 rounded-xl p-4 font-mono text-sm">
                  <pre className="text-gray-300 whitespace-pre-wrap">{codeContent}</pre>
                </div>
              </div>
            )}
            
            {activeTab === 'terminal' && (
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${buildStatus === 'success' ? 'bg-green-500' : buildStatus === 'failed' ? 'bg-red-500' : buildStatus === 'building' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                    <span className="text-sm font-medium text-gray-700">构建输出</span>
                  </div>
                  <div className={`flex items-center gap-2 text-sm font-medium ${getBuildStatusColor()}`}>
                    {buildStatus === 'success' && <CheckCircle2 className="w-4 h-4" />}
                    {buildStatus === 'failed' && <AlertCircle className="w-4 h-4" />}
                    {buildStatus === 'building' && <TrendingUp className="w-4 h-4 animate-pulse" />}
                    {buildStatus === 'idle' && '就绪'}
                    {buildStatus === 'building' && '构建中'}
                    {buildStatus === 'success' && '构建成功'}
                    {buildStatus === 'failed' && '构建失败'}
                  </div>
                </div>
                
                <div className="flex-1 p-4 font-mono text-sm overflow-auto bg-gray-900 text-gray-300">
                  {buildLogs.length === 0 ? (
                    <p className="text-gray-500">点击上方"构建"按钮开始构建项目</p>
                  ) : (
                    buildLogs.map((log, index) => (
                      <div key={index} className={`${
                        log.includes('SUCCESS') ? 'text-green-400' :
                        log.includes('INFO') ? 'text-blue-400' :
                        log.includes('ERROR') ? 'text-red-400' : ''
                      }`}>
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
