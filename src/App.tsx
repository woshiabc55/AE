import { Routes, Route } from 'react-router-dom';
import { Sidebar } from '@/components/Layout/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { ProjectList } from '@/pages/ProjectList';
import { ProjectEditor } from '@/pages/ProjectEditor';
import { ToolCenter } from '@/pages/ToolCenter';
import { Settings } from '@/pages/Settings';

function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/projects" element={<ProjectList />} />
          <Route path="/projects/:id" element={<ProjectEditor />} />
          <Route path="/tools" element={<ToolCenter />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
