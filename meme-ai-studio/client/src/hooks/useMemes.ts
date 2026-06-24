import { useState, useCallback, useEffect } from 'react';
import type { Meme, AIAnalysis } from '../types';

const API = '/api/memes';

export function useMemes() {
  const [memes, setMemes] = useState<Meme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMemes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      const data = await res.json();
      setMemes(data);
    } catch {
      setError('加载梗图失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const searchMemes = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setMemes(data);
    } catch {
      setError('搜索失败');
    } finally {
      setLoading(false);
    }
  }, []);

  const uploadMeme = useCallback(async (formData: FormData) => {
    setError(null);
    try {
      const res = await fetch(API, { method: 'POST', body: formData });
      if (!res.ok) throw new Error('上传失败');
      const meme = await res.json();
      setMemes(prev => [meme, ...prev]);
      return meme;
    } catch {
      setError('上传失败');
      return null;
    }
  }, []);

  const deleteMeme = useCallback(async (id: string) => {
    setError(null);
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      setMemes(prev => prev.filter(m => m.id !== id));
    } catch {
      setError('删除失败');
    }
  }, []);

  useEffect(() => { fetchMemes(); }, [fetchMemes]);

  return { memes, loading, error, fetchMemes, searchMemes, uploadMeme, deleteMeme };
}

export function useAnalysis() {
  const [analyses, setAnalyses] = useState<AIAnalysis[]>([]);
  const [analyzing, setAnalyzing] = useState(false);

  const fetchHistory = useCallback(async () => {
    try {
      const res = await fetch(`${API}/analyze/history`);
      const data = await res.json();
      setAnalyses(data);
    } catch { /* ignore */ }
  }, []);

  const runAnalysis = useCallback(async (type: string, body?: Record<string, unknown>) => {
    setAnalyzing(true);
    try {
      const res = await fetch(`${API}/analyze/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body || {}),
      });
      const analysis = await res.json();
      setAnalyses(prev => [analysis, ...prev]);
      return analysis;
    } catch {
      return null;
    } finally {
      setAnalyzing(false);
    }
  }, []);

  useEffect(() => { fetchHistory(); }, [fetchHistory]);

  return { analyses, analyzing, runAnalysis, fetchHistory };
}