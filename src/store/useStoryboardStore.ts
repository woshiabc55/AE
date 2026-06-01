import { create } from 'zustand';
import { Scene, scenesData } from '@/types/storyboard';

interface StoryboardState {
  currentFrame: number;
  currentSceneId: string | null;
  isPlaying: boolean;
  scenes: Scene[];
  setCurrentFrame: (frame: number) => void;
  setCurrentSceneId: (sceneId: string | null) => void;
  setIsPlaying: (playing: boolean) => void;
  getCurrentScene: () => Scene | undefined;
}

export const useStoryboardStore = create<StoryboardState>((set, get) => ({
  currentFrame: 0,
  currentSceneId: null,
  isPlaying: false,
  scenes: scenesData,
  setCurrentFrame: (frame) => set({ currentFrame: frame }),
  setCurrentSceneId: (sceneId) => set({ currentSceneId: sceneId }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  getCurrentScene: () => {
    const { currentSceneId, scenes } = get();
    return scenes.find(s => s.id === currentSceneId);
  },
}));
