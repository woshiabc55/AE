import { HudBar } from '@/components/HudBar';
import { GroupRoster } from '@/components/GroupRoster';
import { SkillMatrix } from '@/components/SkillMatrix';
import { ActionConsole } from '@/components/ActionConsole';
import { Timeline } from '@/components/Timeline';
import { ToastHost } from '@/components/Toast';

export default function App() {
  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <HudBar />
      <div className="flex-1 flex min-h-0">
        <GroupRoster />
        <SkillMatrix />
        <ActionConsole />
      </div>
      <Timeline />
      <ToastHost />
    </div>
  );
}
