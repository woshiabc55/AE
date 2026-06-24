import { useState, useCallback } from 'react';
import Header from './components/common/Header';
import MemeGrid from './components/Gallery/MemeGrid';
import UploadPanel from './components/Upload/UploadPanel';
import AnalyzeDashboard from './components/Analyze/AnalyzeDashboard';
import { useMemes } from './hooks/useMemes';

export default function App() {
  const [activeTab, setActiveTab] = useState('gallery');
  const { memes, loading, error, fetchMemes, searchMemes, uploadMeme, deleteMeme } = useMemes();

  const handleSearch = useCallback((query: string) => {
    if (query.trim()) {
      searchMemes(query);
    } else {
      fetchMemes();
    }
  }, [searchMemes, fetchMemes]);

  return (
    <div className="min-h-screen pb-8">
      <Header activeTab={activeTab} onTabChange={setActiveTab} onSearch={handleSearch} />

      <main className="max-w-7xl mx-auto px-4 mt-6">
        {activeTab === 'gallery' && (
          <MemeGrid
            memes={memes}
            loading={loading}
            error={error}
            onDelete={deleteMeme}
            onRefresh={fetchMemes}
          />
        )}
        {activeTab === 'upload' && (
          <UploadPanel onUpload={uploadMeme} />
        )}
        {activeTab === 'analyze' && (
          <AnalyzeDashboard />
        )}
      </main>

      {/* 底部状态栏 */}
      <footer className="fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl border-t border-white/5 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-text-dim">
          <div className="flex items-center gap-4">
            <span>梗图总数: <strong className="text-accent">{memes.length}</strong></span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">MCP 端点: /mcp</span>
          </div>
          <div className="flex items-center gap-4">
            <span>API: /api/memes</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">梗图AI工坊 v1.0</span>
          </div>
        </div>
      </footer>
    </div>
  );
}