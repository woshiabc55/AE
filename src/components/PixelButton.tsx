import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "echo" | "rift" | "warn";

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-resonance-500/15 border-resonance-500 text-resonance-400 hover:bg-resonance-500/30 hover:text-resonance-400 hover:shadow-glowReso",
  ghost:
    "bg-void-700/60 border-void-600 text-resonance-400/80 hover:bg-void-600 hover:text-resonance-400",
  echo:
    "bg-echo-500/15 border-echo-500 text-echo-400 hover:bg-echo-500/30 hover:shadow-glowEcho",
  rift:
    "bg-rift-500/15 border-rift-500 text-rift-500 hover:bg-rift-500/30 hover:shadow-glowRift",
  warn:
    "bg-warn-500/15 border-warn-500 text-warn-500 hover:bg-warn-500/30",
};

export function PixelButton({
  variant = "primary",
  className,
  children,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      {...rest}
      className={cn(
        "font-pixel text-[11px] leading-none tracking-wider uppercase",
        "px-5 py-3 border-2 select-none transition-all duration-150",
        "shadow-pixel active:translate-y-[2px] active:shadow-none",
        "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}
