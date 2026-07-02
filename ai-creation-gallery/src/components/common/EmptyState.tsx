import { SearchX } from "lucide-react";

export default function EmptyState({
  message = "没有匹配的作品",
  hint = "试试调整筛选条件或清空筛选",
}: {
  message?: string;
  hint?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24 text-center">
      <div className="grid h-16 w-16 place-items-center rounded-full border border-white/10 bg-white/5 text-white/30">
        <SearchX size={28} />
      </div>
      <p className="mt-5 font-display text-lg font-bold text-white/70">{message}</p>
      <p className="mt-1 text-sm text-white/35">{hint}</p>
    </div>
  );
}
