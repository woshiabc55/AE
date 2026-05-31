export default function StatusBar() {
  return (
    <div className="h-[24px] bg-panel-gray border-t border-border-gray flex items-center justify-between px-3 shrink-0">
      <div className="flex items-center gap-4">
        <span className="text-xs font-mono text-foreground">JavaScript</span>
        <span className="text-xs font-mono text-muted">UTF-8</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" />
        <span className="text-xs font-mono text-neon-cyan">AI 就绪</span>
      </div>
    </div>
  );
}
