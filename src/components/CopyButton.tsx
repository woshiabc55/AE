import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

interface CopyButtonProps {
  text: string;
  label?: string;
}

export default function CopyButton({ text, label = '复制' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className={`
        inline-flex items-center gap-2 px-4 py-2 text-sm font-mono-cn
        border transition-all duration-200 cursor-pointer
        ${
          copied
            ? 'bg-[#1a3a6b] text-white border-[#1a3a6b]'
            : 'bg-white text-[#1a1a1a] border-[#1a1a1a] hover:bg-[#1a3a6b] hover:text-white hover:border-[#1a3a6b]'
        }
      `}
    >
      {copied ? <Check size={14} /> : <Copy size={14} />}
      {copied ? '已复制' : label}
    </button>
  );
}
