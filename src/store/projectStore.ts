// Zustand 状态：项目 + 8 表格 + 聊天 + 文本
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Tick {
  index: number; // 1-16
  sec: number;
  image: string;
  action: string;
  sound: string;
  note: string;
}

export interface StoryboardTable {
  id: string;
  index: number;
  title: string;
  startSec: number;
  endSec: number;
  ticks: Tick[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  ts: number;
}

export type TemplateKey = 'cameraman' | 'director' | 'editor' | 'vfx';

export interface ProjectState {
  title: string;
  totalDuration: number; // 默认 25
  rawText: string;
  tables: StoryboardTable[];
  chat: ChatMessage[];
  activeTemplate: TemplateKey;
  apiKey: string;
  model: string;
  selectedTableId: string | null;
  // setters
  setTitle: (t: string) => void;
  setTotalDuration: (d: number) => void;
  setRawText: (t: string) => void;
  setActiveTemplate: (k: TemplateKey) => void;
  setApiKey: (k: string) => void;
  setModel: (m: string) => void;
  setSelectedTable: (id: string | null) => void;
  updateTick: (tableId: string, tickIndex: number, patch: Partial<Tick>) => void;
  updateTableTitle: (tableId: string, title: string) => void;
  replaceTables: (tables: StoryboardTable[]) => void;
  pushChat: (msg: Omit<ChatMessage, 'id' | 'ts'>) => void;
  resetAll: () => void;
  loadExample: () => void;
}

const TABLE_COUNT = 8;
const TICK_COUNT = 16;

export function buildEmptyTables(totalDuration: number): StoryboardTable[] {
  const slice = totalDuration / TABLE_COUNT;
  return Array.from({ length: TABLE_COUNT }).map((_, i) => ({
    id: `t${i + 1}`,
    index: i + 1,
    title: `镜头 ${i + 1}`,
    startSec: +(i * slice).toFixed(3),
    endSec: +((i + 1) * slice).toFixed(3),
    ticks: Array.from({ length: TICK_COUNT }).map((__, j) => ({
      index: j + 1,
      sec: +((i * slice) + j * (slice / TICK_COUNT)).toFixed(3),
      image: '',
      action: '',
      sound: '',
      note: '',
    })),
  }));
}

// 来自用户提供的 8 表格 × 16 竖线高潮段落（安史之乱）
const EXAMPLE_TITLES = [
  '烛火熄灭',
  '圣旨展开',
  '铁靴踩踏',
  '安禄山面部特写',
  '嘶吼：奉天命清君侧',
  '碎切三帧',
  '白字：天宝十四载',
  'Logo 碎裂与黑幕',
];

export const exampleRawText = `🎨 概念设计补充说明
1. 镜头节奏与情绪曲线
镜1-2：慢（烛火摇曳、圣旨展开）——积累悬疑
镜3-4：中速（踩踏、上摇）——力量爆发
镜5：极快+震颤——情绪顶点
镜6-7：碎切+黑幕——心理撕裂
镜8-9：由动转静→完全死寂——余震

总时长 25 秒，8 镜头 × 16 刻度。`;

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      title: '未命名项目 · 高潮 25s',
      totalDuration: 25,
      rawText: '',
      tables: buildEmptyTables(25),
      chat: [
        {
          id: 'sys0',
          role: 'system',
          content: '欢迎使用 Storyboard Forge。请粘贴脚本/创意文本，启用 AI 自动生成 8 表格。',
          ts: Date.now(),
        },
      ],
      activeTemplate: 'cameraman',
      apiKey: '',
      model: 'gpt-4o-mini',
      selectedTableId: null,

      setTitle: (t) => set({ title: t }),
      setTotalDuration: (d) => {
        const dur = Math.max(1, Math.min(600, d));
        set({ totalDuration: dur, tables: buildEmptyTables(dur) });
      },
      setRawText: (t) => set({ rawText: t }),
      setActiveTemplate: (k) => set({ activeTemplate: k }),
      setApiKey: (k) => set({ apiKey: k }),
      setModel: (m) => set({ model: m }),
      setSelectedTable: (id) => set({ selectedTableId: id }),

      updateTick: (tableId, tickIndex, patch) =>
        set((s) => ({
          tables: s.tables.map((tb) =>
            tb.id !== tableId
              ? tb
              : {
                  ...tb,
                  ticks: tb.ticks.map((tk) =>
                    tk.index === tickIndex ? { ...tk, ...patch } : tk,
                  ),
                },
          ),
        })),

      updateTableTitle: (tableId, title) =>
        set((s) => ({
          tables: s.tables.map((tb) => (tb.id === tableId ? { ...tb, title } : tb)),
        })),

      replaceTables: (tables) => set({ tables }),

      pushChat: (msg) =>
        set((s) => ({
          chat: [
            ...s.chat,
            { id: `m${s.chat.length}-${Date.now()}`, ts: Date.now(), ...msg },
          ],
        })),

      resetAll: () =>
        set({
          title: '未命名项目 · 高潮 25s',
          totalDuration: 25,
          rawText: '',
          tables: buildEmptyTables(25),
          selectedTableId: null,
        }),

      loadExample: () => {
        const tables = buildEmptyTables(25).map((tb, i) => ({
          ...tb,
          title: EXAMPLE_TITLES[i] || tb.title,
        }));
        set({ rawText: exampleRawText, tables, title: '示例 · 安史之乱 25s' });
      },
    }),
    {
      name: 'sf:project:v1',
      partialize: (s) => ({
        title: s.title,
        totalDuration: s.totalDuration,
        rawText: s.rawText,
        tables: s.tables,
        chat: s.chat,
        activeTemplate: s.activeTemplate,
        apiKey: s.apiKey,
        model: s.model,
        selectedTableId: s.selectedTableId,
      }),
    },
  ),
);

// 选择器辅助
export function computeCoverage(tables: StoryboardTable[]): { filled: number; total: number } {
  let filled = 0;
  let total = 0;
  for (const t of tables) {
    for (const tk of t.ticks) {
      total += 1;
      if (tk.image.trim() || tk.action.trim() || tk.sound.trim() || tk.note.trim()) {
        filled += 1;
      }
    }
  }
  return { filled, total };
}
