import { cn } from "@/lib/utils";

type Props = {
  zh: string;
  en?: string;
  align?: "left" | "center";
  className?: string;
  seal?: string;
};

// 标题：粗黑体中文字 + 细英文小字，可附朱印
export function BrushTitle({ zh, en, align = "left", className, seal }: Props) {
  return (
    <div
      className={cn(
        "flex items-end gap-3",
        align === "center" && "justify-center",
        className,
      )}
    >
      <div className="flex flex-col">
        <h2 className="font-xiao text-3xl md:text-4xl tracking-[0.18em] text-mo-900 leading-none">
          {zh}
        </h2>
        {en && (
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-mo-600 mt-2">
            {en}
          </span>
        )}
      </div>
      {seal && (
        <span className="seal ml-2 text-[10px] -translate-y-2">{seal}</span>
      )}
    </div>
  );
}
