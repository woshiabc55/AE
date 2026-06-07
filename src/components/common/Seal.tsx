import { cn } from "@/lib/utils";

type Props = {
  text: string;
  className?: string;
  size?: "sm" | "md" | "lg";
};

export function Seal({ text, className, size = "md" }: Props) {
  return (
    <span
      className={cn(
        "seal animate-stamp",
        size === "sm" && "text-[10px] px-2 py-[1px]",
        size === "md" && "text-xs px-3 py-[3px]",
        size === "lg" && "text-base px-4 py-2",
        className,
      )}
    >
      {text}
    </span>
  );
}
