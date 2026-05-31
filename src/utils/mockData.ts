import type { AppNotification } from '@/types'

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1',
    title: '系统更新',
    content: 'ConceptOS 1.0.1 版本已就绪，建议尽快更新以获取最新功能与安全修复。',
    timestamp: Date.now() - 3600000,
    read: false,
  },
  {
    id: 'n-2',
    title: '存储空间',
    content: '系统存储空间已使用 78%，建议清理不需要的文件以释放空间。',
    timestamp: Date.now() - 7200000,
    read: false,
  },
  {
    id: 'n-3',
    title: '欢迎使用 ConceptOS',
    content: '感谢体验 ConceptOS 概念操作系统！双击桌面图标或点击底部开始按钮启动应用。',
    timestamp: Date.now() - 86400000,
    read: true,
  },
]
