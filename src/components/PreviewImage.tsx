import { PromptScheme } from '@/data/schemes';

interface PreviewImageProps {
  scheme: PromptScheme;
}

export default function PreviewImage({ scheme }: PreviewImageProps) {
  return (
    <div className="paper-card corner-bracket p-0 overflow-hidden">
      <div className="border-b border-[#1a1a1a] px-4 py-2 flex items-center justify-between">
        <span className="font-mono-cn text-xs tracking-wider text-[#606060]">
          预览 / PREVIEW — {scheme.tag}
        </span>
        <span className="font-mono-cn text-[10px] text-[#909090]">landscape_16_9</span>
      </div>
      <div className="relative bg-[#e8e8e8]">
        <img
          src={scheme.previewImageUrl}
          alt={`Preview for ${scheme.name}`}
          className="w-full h-auto block"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 tag-label">PREVIEW</div>
        <div className="absolute bottom-2 right-2 tag-label" style={{ transform: 'rotate(1deg)' }}>
          {scheme.tag}
        </div>
      </div>
    </div>
  );
}
