import FileExplorer from "@/components/workspace/FileExplorer";
import EditorTabs from "@/components/workspace/EditorTabs";
import CodeEditor from "@/components/workspace/CodeEditor";
import AIChatPanel from "@/components/workspace/AIChatPanel";
import TerminalPanel from "@/components/workspace/TerminalPanel";
import StatusBar from "@/components/workspace/StatusBar";

export default function Workspace() {
  return (
    <div className="h-screen flex flex-col bg-deep-black">
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorTabs />
          <div className="flex-1 overflow-hidden">
            <CodeEditor />
          </div>
          <TerminalPanel />
        </div>
        <AIChatPanel />
      </div>
      <StatusBar />
    </div>
  );
}
