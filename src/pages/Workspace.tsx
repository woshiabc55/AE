import ModulePanel from '@/components/ModulePanel';
import ConceptCanvas from '@/components/ConceptCanvas';
import PropertyEditor from '@/components/PropertyEditor';
import PromptPreview from '@/components/PromptPreview';

export default function Workspace() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-1 overflow-hidden">
        <ModulePanel />
        <ConceptCanvas />
        <PropertyEditor />
      </div>
      <PromptPreview />
    </div>
  );
}
