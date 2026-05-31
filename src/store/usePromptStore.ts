import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CanvasBlock, PromptHistory, ModuleCategory } from '@/types';
import { presetModules, presetTemplates } from '@/data/presets';

interface PromptStore {
  canvasBlocks: CanvasBlock[];
  selectedBlockId: string | null;
  promptHistory: PromptHistory[];
  moduleFilter: ModuleCategory | 'all';

  addBlock: (moduleId: string, x?: number, y?: number) => void;
  removeBlock: (blockId: string) => void;
  updateBlock: (blockId: string, updates: Partial<CanvasBlock>) => void;
  moveBlock: (blockId: string, x: number, y: number) => void;
  selectBlock: (blockId: string | null) => void;
  reorderBlock: (blockId: string, direction: 'up' | 'down') => void;
  clearCanvas: () => void;
  loadTemplate: (templateId: string) => void;
  addToHistory: (text: string, templateId?: string) => void;
  clearHistory: () => void;
  setModuleFilter: (filter: ModuleCategory | 'all') => void;
  getGeneratedPrompt: () => string;
}

let blockCounter = 0;

export const usePromptStore = create<PromptStore>()(
  persist(
    (set, get) => ({
      canvasBlocks: [],
      selectedBlockId: null,
      promptHistory: [],
      moduleFilter: 'all',

      addBlock: (moduleId, x = 0, y?: number) => {
        const module = presetModules.find((m) => m.id === moduleId);
        if (!module) return;
        const currentBlocks = get().canvasBlocks;
        const newY = y ?? currentBlocks.length;
        const newBlock: CanvasBlock = {
          id: `block-${Date.now()}-${blockCounter++}`,
          moduleId,
          x,
          y: newY,
          weight: 1.0,
          customText: '',
          selectedVariant: module.variants[0] || '',
        };
        set({ canvasBlocks: [...currentBlocks, newBlock], selectedBlockId: newBlock.id });
      },

      removeBlock: (blockId) => {
        set((state) => ({
          canvasBlocks: state.canvasBlocks.filter((b) => b.id !== blockId),
          selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        }));
      },

      updateBlock: (blockId, updates) => {
        set((state) => ({
          canvasBlocks: state.canvasBlocks.map((b) =>
            b.id === blockId ? { ...b, ...updates } : b
          ),
        }));
      },

      moveBlock: (blockId, x, y) => {
        set((state) => ({
          canvasBlocks: state.canvasBlocks.map((b) =>
            b.id === blockId ? { ...b, x, y } : b
          ),
        }));
      },

      selectBlock: (blockId) => {
        set({ selectedBlockId: blockId });
      },

      reorderBlock: (blockId, direction) => {
        set((state) => {
          const blocks = [...state.canvasBlocks].sort((a, b) => a.y - b.y);
          const idx = blocks.findIndex((b) => b.id === blockId);
          if (idx === -1) return state;
          if (direction === 'up' && idx === 0) return state;
          if (direction === 'down' && idx === blocks.length - 1) return state;

          const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
          const tempY = blocks[idx].y;
          blocks[idx] = { ...blocks[idx], y: blocks[swapIdx].y };
          blocks[swapIdx] = { ...blocks[swapIdx], y: tempY };

          return { canvasBlocks: blocks };
        });
      },

      clearCanvas: () => {
        set({ canvasBlocks: [], selectedBlockId: null });
      },

      loadTemplate: (templateId) => {
        const template = presetTemplates.find((t) => t.id === templateId);
        if (!template) return;
        const blocks: CanvasBlock[] = template.blocks.map((b, i) => ({
          ...b,
          id: `block-${Date.now()}-${blockCounter++}`,
          y: i,
        }));
        set({ canvasBlocks: blocks, selectedBlockId: null });
      },

      addToHistory: (text, templateId) => {
        const entry: PromptHistory = {
          id: `hist-${Date.now()}`,
          text,
          timestamp: Date.now(),
          templateId,
        };
        set((state) => ({
          promptHistory: [entry, ...state.promptHistory].slice(0, 50),
        }));
      },

      clearHistory: () => {
        set({ promptHistory: [] });
      },

      setModuleFilter: (filter) => {
        set({ moduleFilter: filter });
      },

      getGeneratedPrompt: () => {
        const { canvasBlocks } = get();
        const sorted = [...canvasBlocks].sort((a, b) => a.y - b.y);
        const parts: string[] = [];
        for (const block of sorted) {
          const module = presetModules.find((m) => m.id === block.moduleId);
          if (!module) continue;
          let text = block.customText || block.selectedVariant || module.name;
          if (block.weight !== 1.0) {
            text = `(${text}:${block.weight.toFixed(1)})`;
          }
          parts.push(text);
        }
        return parts.join(', ');
      },
    }),
    {
      name: 'ai-prompter-store',
      partialize: (state) => ({
        canvasBlocks: state.canvasBlocks,
        promptHistory: state.promptHistory,
      }),
    }
  )
);
