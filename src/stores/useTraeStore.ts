import { create } from "zustand";
import type { TraeMessage, TraeConnection, AIMessage } from "@/types";

interface TraeStore {
  connection: TraeConnection;
  messages: TraeMessage[];
  isMenuOpen: boolean;
  connect: () => void;
  disconnect: () => void;
  toggleMenu: () => void;
  sendToTrae: (content: string) => void;
  receiveFromTrae: (content: string) => void;
  syncMessages: (chatMessages: AIMessage[]) => void;
}

export const useTraeStore = create<TraeStore>((set, get) => ({
  connection: {
    isConnected: false,
    sessionId: null,
    lastSync: null,
  },
  messages: [],
  isMenuOpen: false,
  connect: () => {
    set({
      connection: {
        isConnected: true,
        sessionId: `trae-session-${Date.now()}`,
        lastSync: Date.now(),
      },
    });
  },
  disconnect: () => {
    set({
      connection: {
        isConnected: false,
        sessionId: null,
        lastSync: null,
      },
    });
  },
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  sendToTrae: (content) => {
    const msg: TraeMessage = {
      id: `trae-out-${Date.now()}`,
      direction: "outbound",
      content,
      timestamp: Date.now(),
      status: "delivered",
    };
    set((state) => ({ messages: [...state.messages, msg] }));
  },
  receiveFromTrae: (content) => {
    const msg: TraeMessage = {
      id: `trae-in-${Date.now()}`,
      direction: "inbound",
      content,
      timestamp: Date.now(),
      status: "delivered",
    };
    set((state) => ({ messages: [...state.messages, msg] }));
  },
  syncMessages: (chatMessages) => {
    const lastSync = get().connection.lastSync || 0;
    const newMessages = chatMessages.filter((m) => m.timestamp > lastSync);
    if (newMessages.length > 0) {
      const traeMsgs: TraeMessage[] = newMessages.map((m) => ({
        id: `trae-sync-${m.id}`,
        direction: m.role === "user" ? "outbound" as const : "inbound" as const,
        content: m.content,
        timestamp: m.timestamp,
        status: "delivered" as const,
      }));
      set((state) => ({
        messages: [...state.messages, ...traeMsgs],
        connection: { ...state.connection, lastSync: Date.now() },
      }));
    }
  },
}));
