import { PromptScheme } from '@/data/schemes';
import CopyButton from './CopyButton';
import { FileText, AlertOctagon } from 'lucide-react';

interface PromptDisplayProps {
  scheme: PromptScheme;
  showNegative?: boolean;
}

export default function PromptDisplay({ scheme, showNegative = true }: PromptDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="paper-card corner-bracket p-0 overflow-hidden">
        <div className="border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText size={14} className="text-[#1a3a6b]" />
            <span className="font-mono-cn text-xs tracking-wider">
              完整提示词 / FULL PROMPT
            </span>
            <span className="param-highlight ml-2">{scheme.tag}</span>
          </div>
          <CopyButton text={scheme.fullPrompt} label="复制提示词" />
        </div>
        <div className="p-5 max-h-[480px] overflow-y-auto scrollbar-thin">
          <div className="prompt-text">{scheme.fullPrompt}</div>
        </div>
        <div className="border-t border-dashed border-[#d0d0d0] px-4 py-2 flex items-center gap-3 text-[10px] font-mono-cn text-[#909090]">
          <span>CHARS: {scheme.fullPrompt.length}</span>
          <span>·</span>
          <span>WORDS: ~{scheme.fullPrompt.split(/\s+/).length}</span>
          <span>·</span>
          <span>FORMAT: Plain Text</span>
        </div>
      </div>

      {showNegative && (
        <div className="paper-card p-0 overflow-hidden">
          <div className="border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertOctagon size={14} className="text-[#909060]" />
              <span className="font-mono-cn text-xs tracking-wider">
                反向提示词 / NEGATIVE PROMPT
              </span>
            </div>
            <CopyButton text={scheme.negativePrompt} label="复制" />
          </div>
          <div className="p-5 max-h-[200px] overflow-y-auto scrollbar-thin">
            <div className="prompt-text text-[#606060]">{scheme.negativePrompt}</div>
          </div>
        </div>
      )}
    </div>
  );
}
