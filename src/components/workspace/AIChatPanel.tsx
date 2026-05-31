import { useState, useRef, useEffect } from "react";
import { Sparkles, Send } from "lucide-react";
import { useChatStore } from "@/stores/useChatStore";
import { useTerminalStore } from "@/stores/useTerminalStore";
import { generateAIResponse } from "@/services/mockAI";
import type { CodeBlock } from "@/types";

function CodeBlockView({ block }: { block: CodeBlock }) {
  const [copied, setCopied] = useState(false);

  const handleInsert = () => {
    navigator.clipboard.writeText(block.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-2 rounded overflow-hidden border border-border-gray">
      <div className="flex items-center justify-between px-2 py-1 bg-border-gray/30">
        <span className="text-xs text-muted font-mono">{block.fileName || block.language}</span>
        <button
          onClick={handleInsert}
          className="text-xs px-2 py-0.5 rounded bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors"
        >
          {copied ? "已复制" : "插入"}
        </button>
      </div>
      <pre className="bg-deep-black p-2 overflow-x-auto">
        <code className="text-xs font-mono text-foreground">{block.code}</code>
      </pre>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-3 py-2">
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "0ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "150ms" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: "300ms" }} />
    </div>
  );
}

export default function AIChatPanel() {
  const { messages, isTyping, addMessage, setTyping } = useChatStore();
  const { addLine } = useTerminalStore();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSubmit = () => {
    if (!input.trim() || isTyping) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user" as const,
      content: input.trim(),
      timestamp: Date.now(),
    };

    addMessage(userMessage);
    setInput("");
    setTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(userMessage.content);
      addMessage(response.message);
      response.terminalLines.forEach((line) => addLine(line));
      setTyping(false);
    }, 1500);
  };

  return (
    <div className="w-[360px] h-full bg-panel-gray border-l border-border-gray flex flex-col shrink-0">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border-gray">
        <Sparkles className="w-4 h-4 text-neon-cyan" />
        <span className="font-display text-sm font-semibold text-foreground">
          AI <span className="text-neon-cyan">助手</span>
        </span>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[90%] rounded-lg px-3 py-2 text-sm font-body ${
                msg.role === "user"
                  ? "bg-border-gray/40 text-foreground"
                  : "glass border-l-2 border-neon-cyan text-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
              {msg.codeBlocks?.map((block, i) => (
                <CodeBlockView key={i} block={block} />
              ))}
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <div className="p-2 border-t border-border-gray">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="描述你的需求..."
            className="flex-1 bg-deep-black border border-border-gray rounded px-3 py-1.5 text-sm text-foreground font-body outline-none focus:border-neon-cyan transition-colors"
          />
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || isTyping}
            className="p-1.5 rounded bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
