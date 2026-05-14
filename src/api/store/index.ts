import apiClient from '../client'
import type { ApiResponse, PaginatedResponse, ID } from '../../types/common'
import type { Order } from '../../types/order'
import type { InventoryItem } from '../../types/product'
import type { Driver } from '../../types/store'

// ─── Store Orders ─────────────────────────────────────────────────────────────

export const getStoreOrders = async (params?: {
  page?: number
  limit?: number
  status?: string
  from?: string
  to?: string
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  const { data } = await apiClient.get('/store/orders', { params })
  return data
}

export const getStoreOrderDetail = async (
  id: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.get(`/store/orders/${id}`)
  return data
}

export const acceptOrder = async (id: ID): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/store/orders/${id}/accept`)
  return data
}

export const rejectOrder = async (
  id: ID,
  reason: string
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/store/orders/${id}/reject`, {
    reason,
  })
  return data
}

export const setPreparingOrder = async (
  id: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/store/orders/${id}/preparing`)
  return data
}

export const assignDriver = async (
  orderId: ID,
  driverId: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(
    `/store/orders/${orderId}/assign-driver`,
    { driverId }
  )
  return data
}

export const setOutForDelivery = async (
  id: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/store/orders/${id}/out-for-delivery`)
  return data
}

export const deliverOrder = async (id: ID): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/store/orders/${id}/deliver`)
  return data
}

// ─── Store Inventory ──────────────────────────────────────────────────────────

export const getStoreInventory = async (params?: {
  page?: number
  limit?: number
  outOfStock?: boolean
  lowStock?: boolean
}): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
  const { data } = await apiClient.get('/store/inventory', { params })
  return data
}

// ─── Store Drivers ────────────────────────────────────────────────────────────

export const getStoreDrivers = async (params?: {
  isAvailable?: boolean
}): Promise<ApiResponse<Driver[]>> => {
  const { data } = await apiClient.get('/store/drivers', { params })
  return data
}

// ─── Store Chats ──────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: ID
  orderId: ID
  senderId: ID
  senderName: string
  senderType: 'customer' | 'store' | 'driver' | 'admin'
  message: string
  createdAt: string
}

export interface ChatThread {
  id: ID
  orderId: ID
  orderNumber: string
  customerName: string
  lastMessage?: ChatMessage
  unreadCount: number
  updatedAt: string
}

export const getStoreChats = async (params?: {
  page?: number
  limit?: number
}): Promise<ApiResponse<PaginatedResponse<ChatThread>>> => {
  const { data } = await apiClient.get('/store/chats', { params })
  return data
}

export const getChatMessages = async (
  threadId: ID
): Promise<ApiResponse<ChatMessage[]>> => {
  const { data } = await apiClient.get(`/store/chats/${threadId}/messages`)
  return data
}

export const sendChatMessage = async (
  threadId: ID,
  message: string
): Promise<ApiResponse<ChatMessage>> => {
  const { data } = await apiClient.post(
    `/store/chats/${threadId}/messages`,
    { message }
  )
  return data
}

// ─── Store Stats ──────────────────────────────────────────────────────────────

export interface StoreStats {
  todayOrders: number
  pendingOrders: number
  preparingOrders: number
  completedOrders: number
  todayRevenue: number
  activeDrivers: number
}

export const getStoreStats = async (): Promise<ApiResponse<StoreStats>> => {
  const { data } = await apiClient.get('/store/stats')
  return data
}
