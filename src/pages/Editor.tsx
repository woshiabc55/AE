import Toolbar from '@/components/Toolbar';
import Viewport from '@/components/Viewport';
import SceneHierarchy from '@/components/SceneHierarchy';
import TransformPanel from '@/components/TransformPanel';
import MaterialPanel from '@/components/MaterialPanel';
import LightingPanel from '@/components/LightingPanel';

export default function Editor() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#1a1a2e]">
      <Toolbar />
      <div className="flex flex-1 overflow-hidden">
        <SceneHierarchy />
        <Viewport />
        <div className="flex w-[300px] flex-shrink-0 flex-col overflow-y-auto border-l border-[#0f3460]/60 bg-[#16213e]/60 backdrop-blur-sm">
          <TransformPanel />
          <MaterialPanel />
          <LightingPanel />
        </div>
      </div>
    </div>
  );
}
