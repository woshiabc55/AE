import { useState } from "react";
import { Link2, Link2Off, Send, ArrowDownToLine, ArrowUpFromLine, ChevronDown, RefreshCw, MessageSquare } from "lucide-react";
import { useTraeStore } from "@/stores/useTraeStore";
import { useChatStore } from "@/stores/useChatStore";

function TraeMessageItem({ msg }: { msg: TraeMessage }) {
  const isOut = msg.direction === "outbound";

  return (
    <div className={`flex items-start gap-2 py-1.5 ${isOut ? "flex-row-reverse" : ""}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
        isOut ? "bg-neon-cyan/20" : "bg-amber-orange/20"
      }`}>
        {isOut ? <ArrowUpFromLine className="w-3 h-3 text-neon-cyan" /> : <ArrowDownToLine className="w-3 h-3 text-amber-orange" />}
      </div>
      <div className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-xs font-body ${
        isOut
          ? "bg-neon-cyan/10 border border-neon-cyan/20 text-foreground"
          : "bg-amber-orange/10 border border-amber-orange/20 text-foreground"
      }`}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        <div className="flex items-center gap-1 mt-1">
          <span className={`text-[10px] ${msg.status === "delivered" ? "text-neon-cyan" : msg.status === "failed" ? "text-amber-orange" : "text-muted"}`}>
            {msg.status === "delivered" ? "已送达" : msg.status === "failed" ? "失败" : "发送中"}
          </span>
          <span className="text-[10px] text-muted">
            {isOut ? "→ Trae" : "← Trae"}
          </span>
        </div>
      </div>
    </div>
  );
}

import type { TraeMessage } from "@/types";

export default function TraeConnector() {
  const { connection, messages, isMenuOpen, connect, disconnect, toggleMenu, sendToTrae, receiveFromTrae } = useTraeStore();
  const { messages: chatMessages, addMessage } = useChatStore();
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || !connection.isConnected) return;
    sendToTrae(input.trim());
    setInput("");
  };

  const handleSync = () => {
    const traeStore = useTraeStore.getState();
    traeStore.syncMessages(chatMessages);
  };

  const handleReceiveTest = () => {
    const responses = [
      "我已经分析了你的代码结构，建议在 App.jsx 中添加错误边界组件。",
      "检测到 index.js 中的 greet 函数可以优化为支持多语言版本。",
      "根据当前项目配置，推荐添加 ESLint 和 Prettier 来规范代码风格。",
    ];
    const content = responses[Math.floor(Math.random() * responses.length)];
    receiveFromTrae(content);
    addMessage({
      id: `trae-in-${Date.now()}`,
      role: "assistant",
      content: `[来自 Trae] ${content}`,
      timestamp: Date.now(),
      source: "trae",
    });
  };

  return (
    <div className="border-t border-border-gray">
      <button
        onClick={toggleMenu}
        className="flex items-center gap-1.5 px-3 py-1.5 w-full text-left hover:bg-panel-gray/30 transition-colors"
      >
        <MessageSquare className="w-3.5 h-3.5 text-amber-orange" />
        <span className="text-xs font-mono text-foreground flex-1">Trae 对接</span>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${connection.isConnected ? "bg-neon-cyan animate-pulse-glow" : "bg-muted"}`} />
          <ChevronDown className={`w-3 h-3 text-muted transition-transform ${isMenuOpen ? "rotate-180" : ""}`} />
        </div>
      </button>

      {isMenuOpen && (
        <div className="px-3 pb-3 space-y-2">
          <div className="flex items-center gap-2">
            {connection.isConnected ? (
              <>
                <button
                  onClick={disconnect}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-amber-orange/10 text-amber-orange border border-amber-orange/20 hover:bg-amber-orange/20 transition-colors"
                >
                  <Link2Off className="w-3 h-3" />
                  断开
                </button>
                <span className="text-[10px] text-muted font-mono">
                  会话: {connection.sessionId?.slice(-8)}
                </span>
              </>
            ) : (
              <button
                onClick={connect}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 hover:bg-neon-cyan/20 transition-colors"
              >
                <Link2 className="w-3 h-3" />
                连接 Trae
              </button>
            )}
          </div>

          {connection.isConnected && (
            <>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleSync}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-panel-gray text-foreground border border-border-gray hover:border-neon-cyan/30 transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  同步消息
                </button>
                <button
                  onClick={handleReceiveTest}
                  className="flex items-center gap-1 px-2 py-1 rounded text-xs bg-panel-gray text-foreground border border-border-gray hover:border-amber-orange/30 transition-colors"
                >
                  <ArrowDownToLine className="w-3 h-3" />
                  模拟接收
                </button>
              </div>

              <div className="max-h-[160px] overflow-y-auto space-y-1 bg-deep-black rounded-lg p-2 border border-border-gray">
                {messages.length === 0 ? (
                  <p className="text-xs text-muted text-center py-2">暂无消息记录</p>
                ) : (
                  messages.slice(-10).map((msg) => <TraeMessageItem key={msg.id} msg={msg} />)
                )}
              </div>

              <div className="flex gap-1.5">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="发送到 Trae..."
                  className="flex-1 bg-deep-black border border-border-gray rounded px-2 py-1 text-xs font-mono text-foreground outline-none focus:border-neon-cyan transition-colors"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-1 rounded bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted">
                <span>正向: NexusCode → Trae</span>
                <ArrowUpFromLine className="w-2.5 h-2.5 text-neon-cyan" />
                <span>|</span>
                <span>反向: Trae → NexusCode</span>
                <ArrowDownToLine className="w-2.5 h-2.5 text-amber-orange" />
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
