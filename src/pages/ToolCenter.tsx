import { Header } from '@/components/Layout/Header';
import { useProjectStore } from '@/store/projectStore';
import { 
  Wrench, 
  Download, 
  Check,
  Code,
  AlignLeft,
  TestTube,
  Zap,
  Palette,
  BookOpen,
  Search
} from 'lucide-react';
import { useState } from 'react';

const iconMap: Record<string, typeof Code> = {
  code: Code,
  format: AlignLeft,
  test: TestTube,
  zap: Zap,
  palette: Palette,
  book: BookOpen,
};

export function ToolCenter() {
  const tools = useProjectStore((state) => state.tools);
  const installTool = useProjectStore((state) => state.installTool);
  const uninstallTool = useProjectStore((state) => state.uninstallTool);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredTools = tools.filter((tool) => 
    tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const installedCount = tools.filter((t) => t.installed).length;
  
  return (
    <div className="flex flex-col h-full">
      <Header title="工具中心" subtitle="管理和安装开发工具" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">已安装工具</p>
                <p className="text-2xl font-bold text-gray-900">{installedCount}/{tools.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                <Wrench className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">代码质量</p>
                <p className="text-2xl font-bold text-gray-900">ESLint</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Check className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">代码格式化</p>
                <p className="text-2xl font-bold text-gray-900">Prettier</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <AlignLeft className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">测试框架</p>
                <p className="text-2xl font-bold text-gray-900">Vitest</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <TestTube className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">工具列表</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索工具..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTools.map((tool) => {
              const Icon = iconMap[tool.icon] || Wrench;
              return (
                <div 
                  key={tool.id}
                  className="p-4 border border-gray-100 rounded-xl hover:border-primary-200 hover:bg-primary-50/30 transition-all duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tool.installed ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          tool.installed ? 'text-green-600' : 'text-gray-500'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{tool.name}</h4>
                        <p className="text-xs text-gray-500">v{tool.version}</p>
                      </div>
                    </div>
                    
                    {tool.installed && (
                      <span className="px-2 py-1 bg-green-100 text-green-600 text-xs rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        已安装
                      </span>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-3 mb-4">{tool.description}</p>
                  
                  <button
                    onClick={() => {
                      if (tool.installed) {
                        uninstallTool(tool.id);
                      } else {
                        installTool(tool.id);
                      }
                    }}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                      tool.installed
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {tool.installed ? (
                      <>
                        <Download className="w-4 h-4" />
                        卸载
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        安装
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
          
          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">未找到匹配的工具</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
