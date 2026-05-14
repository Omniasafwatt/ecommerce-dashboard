import { io, type Socket } from 'socket.io-client'
import { config } from '../config/env'
import { getAccessToken } from '../api/client'

// ─── Event type definitions ───────────────────────────────────────────────────

export interface NewOrderEvent {
  orderId: string
  orderNumber: string
  storeId: string
  storeName: string
  total: number
  createdAt: string
}

export interface OrderStatusChangedEvent {
  orderId: string
  orderNumber: string
  previousStatus: string
  newStatus: string
  updatedBy: string
  timestamp: string
}

export interface ChatMessageEvent {
  threadId: string
  orderId: string
  messageId: string
  senderId: string
  senderName: string
  senderType: 'customer' | 'store' | 'driver' | 'admin'
  message: string
  createdAt: string
}

export interface DriverLocationEvent {
  driverId: string
  driverName: string
  lat: number
  lng: number
  heading?: number
  speed?: number
  timestamp: string
}

export interface NotificationEvent {
  id: string
  type: string
  title: string
  message: string
  link?: string
  createdAt: string
}

export interface RefundQueueUpdateEvent {
  refundId: string
  orderId: string
  status: 'pending' | 'approved' | 'rejected'
  updatedAt: string
}

export type WSEventMap = {
  new_order: (event: NewOrderEvent) => void
  order_status_changed: (event: OrderStatusChangedEvent) => void
  chat_message: (event: ChatMessageEvent) => void
  driver_location: (event: DriverLocationEvent) => void
  notification: (event: NotificationEvent) => void
  refund_queue_update: (event: RefundQueueUpdateEvent) => void
  connect: () => void
  disconnect: (reason: string) => void
  connect_error: (error: Error) => void
}

// ─── WebSocket client class ───────────────────────────────────────────────────

class WSClient {
  private socket: Socket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private listeners = new Map<string, Set<(...args: unknown[]) => void>>()

  /** Connect to the WebSocket server with auth token */
  connect(): void {
    if (this.socket?.connected) return

    const token = getAccessToken()

    this.socket = io(config.wsUrl, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay,
      reconnectionDelayMax: 10_000,
      timeout: 20_000,
    })

    this.socket.on('connect', () => {
      this.reconnectAttempts = 0
      if (config.isDev) {
        console.log('[WS] Connected:', this.socket?.id)
      }
      this.reattachListeners()
    })

    this.socket.on('disconnect', (reason) => {
      if (config.isDev) {
        console.log('[WS] Disconnected:', reason)
      }
    })

    this.socket.on('connect_error', (error) => {
      this.reconnectAttempts++
      if (config.isDev) {
        console.error('[WS] Connection error:', error.message)
      }
    })
  }

  /** Disconnect the socket */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  /** Check if currently connected */
  get isConnected(): boolean {
    return this.socket?.connected ?? false
  }

  /** Get socket ID */
  get socketId(): string | undefined {
    return this.socket?.id
  }

  // ─── Typed event listening ──────────────────────────────────────────────────

  on<K extends keyof WSEventMap>(event: K, handler: WSEventMap[K]): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set())
    }
    this.listeners.get(event)!.add(handler as (...args: unknown[]) => void)

    if (this.socket) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.socket.on(event as string, handler as (...args: any[]) => void)
    }
  }

  off<K extends keyof WSEventMap>(event: K, handler: WSEventMap[K]): void {
    const handlers = this.listeners.get(event)
    if (handlers) {
      handlers.delete(handler as (...args: unknown[]) => void)
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.socket?.off(event as string, handler as (...args: any[]) => void)
  }

  /** Re-attach all stored listeners (used after reconnect) */
  private reattachListeners(): void {
    if (!this.socket) return
    this.listeners.forEach((handlers, event) => {
      handlers.forEach((handler) => {
        this.socket!.on(event, handler)
      })
    })
  }

  // ─── Typed event emitting ───────────────────────────────────────────────────

  /** Join a specific room (e.g. store-specific order feeds) */
  joinRoom(room: string): void {
    this.socket?.emit('join_room', { room })
  }

  /** Leave a room */
  leaveRoom(room: string): void {
    this.socket?.emit('leave_room', { room })
  }

  /** Emit driver location update */
  emitDriverLocation(payload: {
    lat: number
    lng: number
    heading?: number
    speed?: number
  }): void {
    this.socket?.emit('driver_location_update', payload)
  }

  /** Emit chat message */
  emitChatMessage(payload: { threadId: string; message: string }): void {
    this.socket?.emit('send_chat_message', payload)
  }

  /** Mark notification as read via WS */
  emitMarkNotificationRead(notificationId: string): void {
    this.socket?.emit('mark_notification_read', { id: notificationId })
  }

  // ─── Update auth token (e.g. after token refresh) ──────────────────────────

  updateToken(newToken: string): void {
    if (this.socket) {
      this.socket.auth = { token: newToken }
      // Reconnect to apply new token
      this.socket.disconnect().connect()
    }
  }
}

// ─── Singleton export ─────────────────────────────────────────────────────────

export const wsClient = new WSClient()
export default wsClient
