import type { LucideIcon } from "lucide-react";

export default function GalleryHeader({
  eyebrow,
  icon: Icon,
  title,
  highlight,
  subtitle,
  count,
}: {
  eyebrow: string;
  icon: LucideIcon;
  title: string;
  highlight: string;
  subtitle: string;
  count: number;
}) {
  return (
    <div className="mb-8">
      <div className="section-eyebrow">
        <Icon size={13} className="text-magenta" /> {eyebrow}
      </div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl font-black tracking-tight text-white sm:text-5xl">
          {title}
          <span className="text-gradient">{highlight}</span>
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-white/50">
          {subtitle}
        </p>
      </div>
      <div className="mt-4 flex items-center gap-3 font-mono text-xs text-white/35">
        <span className="h-px w-12 bg-gradient-to-r from-magenta to-transparent" />
        共收录 {count} 件作品
      </div>
    </div>
  );
}
