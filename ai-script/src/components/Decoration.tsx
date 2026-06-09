import { Clapperboard } from 'lucide-react';

// 装饰：右下角的场记板浮标
export function SlateFloat() {
  return (
    <div className="hidden lg:flex fixed right-6 bottom-6 z-30 items-center gap-2 px-3 py-2 border border-gilt-600/40 bg-carbon-800/80 backdrop-blur-sm pointer-events-none">
      <Clapperboard size={14} className="text-clapper-500" />
      <div className="flex flex-col">
        <div className="slate text-[9px] text-gilt-300">PRODUCTION NOTE</div>
        <div className="slate text-[9px] text-parchment-100/70">read · bookmark · reuse</div>
      </div>
    </div>
  );
}

// 装饰：右上角的"放映灯"小指示
export function RunningLight() {
  return (
    <div className="hidden md:flex fixed right-6 top-16 z-30 items-center gap-2 pointer-events-none">
      <div className="w-1.5 h-1.5 rounded-full bg-clapper-500 animate-pulse" />
      <div className="slate text-[9px] text-gilt-300">ON AIR</div>
    </div>
  );
}
