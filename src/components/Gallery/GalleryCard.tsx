import { cn } from "@/lib/utils";

interface Props {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}

export default function GalleryCard({ title, description, className, children }: Props) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-2xl bg-white/90 p-5 shadow-card transition-transform hover:-translate-y-1",
        className
      )}
    >
      <div className="mb-3 flex h-40 w-full items-center justify-center rounded-xl bg-gradient-to-b from-sky-100 to-lawn-100">
        {children}
      </div>
      <h3 className="mb-1 text-lg font-bold text-lawn-800">{title}</h3>
      <p className="text-center text-sm text-gray-600">{description}</p>
    </div>
  );
}
