import type { Meme, MemeStore, AIAnalysis } from '../types.js';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_FILE = join(__dirname, 'data', 'store.json');
const UPLOADS_DIR = join(__dirname, 'data', 'uploads');

function loadStore(): MemeStore {
  if (!existsSync(DATA_FILE)) {
    return { memes: [], analyses: [] };
  }
  const raw = readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function saveStore(store: MemeStore): void {
  writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
}

export function getAllMemes(): Meme[] {
  const store = loadStore();
  return store.memes.sort((a, b) => b.hotScore - a.hotScore);
}

export function getMemeById(id: string): Meme | undefined {
  const store = loadStore();
  return store.memes.find(m => m.id === id);
}

export function searchMemes(query: string): Meme[] {
  const store = loadStore();
  const q = query.toLowerCase();
  return store.memes.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.tags.some(t => t.toLowerCase().includes(q))
  );
}

export function addMeme(meme: Meme): Meme {
  const store = loadStore();
  store.memes.push(meme);
  saveStore(store);
  return meme;
}

export function updateMeme(id: string, updates: Partial<Meme>): Meme | null {
  const store = loadStore();
  const idx = store.memes.findIndex(m => m.id === id);
  if (idx === -1) return null;
  store.memes[idx] = { ...store.memes[idx], ...updates, updatedAt: new Date().toISOString() };
  saveStore(store);
  return store.memes[idx];
}

export function deleteMeme(id: string): boolean {
  const store = loadStore();
  const idx = store.memes.findIndex(m => m.id === id);
  if (idx === -1) return false;
  store.memes.splice(idx, 1);
  saveStore(store);
  return true;
}

export function addAnalysis(analysis: AIAnalysis): AIAnalysis {
  const store = loadStore();
  store.analyses.push(analysis);
  saveStore(store);
  return analysis;
}

export function getAnalyses(): AIAnalysis[] {
  const store = loadStore();
  return store.analyses.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getUploadsDir(): string {
  return UPLOADS_DIR;
}