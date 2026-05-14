import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../index'

export interface Notification {
  id: string
  type:
    | 'new_order'
    | 'order_status'
    | 'refund_request'
    | 'return_request'
    | 'low_stock'
    | 'driver_update'
    | 'system'
    | 'chat'
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
  meta?: Record<string, unknown>
}

export interface NotificationsState {
  items: Notification[]
  unreadCount: number
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
}

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (
      state,
      action: PayloadAction<Omit<Notification, 'id' | 'isRead' | 'createdAt'>>
    ) => {
      const notification: Notification = {
        ...action.payload,
        id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        isRead: false,
        createdAt: new Date().toISOString(),
      }
      state.items.unshift(notification)
      state.unreadCount += 1
    },
    addNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.items = action.payload
      state.unreadCount = action.payload.filter((n) => !n.isRead).length
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((n) => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.items.forEach((n) => {
        n.isRead = true
      })
      state.unreadCount = 0
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.items.findIndex((n) => n.id === action.payload)
      if (index !== -1) {
        if (!state.items[index].isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.items.splice(index, 1)
      }
    },
    clearAll: (state) => {
      state.items = []
      state.unreadCount = 0
    },
  },
})

export const {
  addNotification,
  addNotifications,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAll,
} = notificationsSlice.actions

// Selectors
export const selectNotifications = (state: RootState) =>
  state.notifications.items
export const selectUnreadCount = (state: RootState) =>
  state.notifications.unreadCount
export const selectUnreadNotifications = (state: RootState) =>
  state.notifications.items.filter((n) => !n.isRead)

export default notificationsSlice.reducer
