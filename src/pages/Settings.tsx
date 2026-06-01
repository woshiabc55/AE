import { Header } from '@/components/Layout/Header';
import { 
  User, 
  Bell, 
  Shield, 
  Palette,
  Database,
  Globe,
  Save,
  CheckCircle2,
  Moon,
  Sun
} from 'lucide-react';
import { useState } from 'react';

interface SettingSection {
  id: string;
  title: string;
  icon: typeof User;
  description: string;
}

const sections: SettingSection[] = [
  { id: 'profile', title: '个人资料', icon: User, description: '管理您的个人信息' },
  { id: 'notifications', title: '通知设置', icon: Bell, description: '配置通知偏好' },
  { id: 'security', title: '安全设置', icon: Shield, description: '管理密码和认证' },
  { id: 'appearance', title: '外观主题', icon: Palette, description: '自定义界面风格' },
  { id: 'data', title: '数据管理', icon: Database, description: '管理数据和存储' },
  { id: 'language', title: '语言设置', icon: Globe, description: '选择界面语言' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile');
  const [saved, setSaved] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  
  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <button className="btn-secondary">更换头像</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">用户名</label>
                <input
                  type="text"
                  defaultValue="用户名"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
                <input
                  type="email"
                  defaultValue="developer@example.com"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
                <input
                  type="text"
                  defaultValue="开发者"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">公司</label>
                <input
                  type="text"
                  defaultValue="技术有限公司"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        );
        
      case 'notifications':
        return (
          <div className="space-y-4">
            {[
              { title: '构建通知', description: '当项目构建完成时发送通知' },
              { title: '协作通知', description: '当团队成员修改项目时发送通知' },
              { title: '系统更新', description: '当有系统更新时发送通知' },
              { title: '营销邮件', description: '接收产品更新和最佳实践' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-gray-900">{item.title}</h4>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>
                <button className="w-12 h-6 bg-primary-600 rounded-full relative">
                  <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                </button>
              </div>
            ))}
          </div>
        );
        
      case 'security':
        return (
          <div className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <p className="text-sm text-yellow-800">建议定期更新密码以保障账户安全</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">当前密码</label>
                <input
                  type="password"
                  placeholder="输入当前密码"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">新密码</label>
                <input
                  type="password"
                  placeholder="输入新密码"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
                <input
                  type="password"
                  placeholder="再次输入新密码"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
          </div>
        );
        
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {darkMode ? (
                  <Moon className="w-6 h-6 text-gray-600" />
                ) : (
                  <Sun className="w-6 h-6 text-yellow-500" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">深色模式</h4>
                  <p className="text-sm text-gray-500">切换深色/浅色主题</p>
                </div>
              </div>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-6 rounded-full relative transition-colors ${
                  darkMode ? 'bg-primary-600' : 'bg-gray-300'
                }`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  darkMode ? 'right-1' : 'left-1'
                }`}></span>
              </button>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">主题色</label>
              <div className="flex gap-3">
                {['#3b82f6', '#00d4aa', '#8b5cf6', '#ef4444', '#f59e0b'].map((color) => (
                  <button
                    key={color}
                    className="w-10 h-10 rounded-lg border-2 border-gray-200 hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'data':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="card text-center">
                <p className="text-sm text-gray-500 mb-1">项目存储</p>
                <p className="text-2xl font-bold text-gray-900">2.4 GB</p>
                <p className="text-xs text-gray-400">共 10 GB</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-gray-500 mb-1">构建次数</p>
                <p className="text-2xl font-bold text-gray-900">128</p>
                <p className="text-xs text-gray-400">本月</p>
              </div>
              <div className="card text-center">
                <p className="text-sm text-gray-500 mb-1">数据使用</p>
                <p className="text-2xl font-bold text-gray-900">45%</p>
                <p className="text-xs text-gray-400">已使用</p>
              </div>
            </div>
            
            <button className="w-full p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 hover:bg-red-100 transition-colors">
              导出所有数据
            </button>
          </div>
        );
        
      case 'language':
        return (
          <div className="space-y-4">
            {[
              { code: 'zh-CN', name: '简体中文', native: '简体中文' },
              { code: 'en-US', name: 'English', native: 'English' },
              { code: 'ja-JP', name: 'Japanese', native: '日本語' },
              { code: 'ko-KR', name: 'Korean', native: '한국어' },
            ].map((lang) => (
              <button
                key={lang.code}
                className={`w-full flex items-center justify-between p-4 rounded-xl transition-colors ${
                  lang.code === 'zh-CN'
                    ? 'bg-primary-50 border border-primary-200'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div>
                  <p className="font-medium text-gray-900">{lang.name}</p>
                  <p className="text-sm text-gray-500">{lang.native}</p>
                </div>
                {lang.code === 'zh-CN' && (
                  <CheckCircle2 className="w-5 h-5 text-primary-600" />
                )}
              </button>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <Header title="系统设置" subtitle="配置您的账户和偏好" />
      
      <main className="flex-1 p-6 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-100 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">设置菜单</h3>
              <div className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-primary-50 text-primary-600'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs text-gray-400">{section.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {sections.find((s) => s.id === activeSection)?.title}
                </h3>
                <button 
                  onClick={handleSave}
                  className="btn-primary flex items-center gap-2"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      已保存
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      保存更改
                    </>
                  )}
                </button>
              </div>
              
              {renderContent()}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
