import { ElementType, ReactNode } from "react";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  as?: ElementType;
};

// 进场动效包装
export function Reveal({
  children,
  className,
  delayMs = 0,
  as: Tag = "div",
}: Props) {
  const { ref, inView } = useReveal<HTMLDivElement>();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", inView && "in", className)}
      style={{ transitionDelay: `${delayMs}ms` }}
    >
      {children}
    </Tag>
  );
}
