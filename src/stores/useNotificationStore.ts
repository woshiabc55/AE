import { create } from 'zustand'
import type { AppNotification } from '@/types'
import { INITIAL_NOTIFICATIONS } from '@/utils/mockData'

interface NotificationStore {
  notifications: AppNotification[]
  isOpen: boolean
  addNotification: (notification: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  markAsRead: (id: string) => void
  toggleOpen: () => void
  setOpen: (open: boolean) => void
}

let notifCounter = 100

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: INITIAL_NOTIFICATIONS,
  isOpen: false,

  addNotification: (notification) => {
    notifCounter++
    const newNotif: AppNotification = {
      ...notification,
      id: `n-${notifCounter}`,
      timestamp: Date.now(),
      read: false,
    }
    set((state) => ({
      notifications: [newNotif, ...state.notifications],
    }))
  },

  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },

  clearAll: () => {
    set({ notifications: [] })
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }))
  },

  toggleOpen: () => {
    set((state) => ({ isOpen: !state.isOpen }))
  },

  setOpen: (open) => {
    set({ isOpen: open })
  },
}))
