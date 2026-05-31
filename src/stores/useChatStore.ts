import { create } from "zustand";
import type { AIMessage } from "@/types";

interface ChatStore {
  messages: AIMessage[];
  isTyping: boolean;
  addMessage: (message: AIMessage) => void;
  setTyping: (typing: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是 NexusCode AI 助手。我可以帮你生成代码、解释错误、重构代码，或者回答任何编程问题。试试输入你的需求吧！",
      timestamp: Date.now(),
    },
  ],
  isTyping: false,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setTyping: (typing) => set({ isTyping: typing }),
  clearMessages: () => set({ messages: [] }),
}));
