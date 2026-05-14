import apiClient from '../client'
import type { ApiResponse, PaginatedResponse, ID } from '../../types/common'
import type { Order } from '../../types/order'

// ─── Driver Deliveries ────────────────────────────────────────────────────────

export interface DriverDelivery {
  id: ID
  orderId: ID
  orderNumber: string
  customerName: string
  customerPhone: string
  deliveryAddress: {
    street: string
    area: string
    governorate: string
    lat?: number
    lng?: number
    notes?: string
  }
  storeName: string
  storeLat: number
  storeLng: number
  status: 'assigned' | 'started' | 'arrived' | 'delivered' | 'failed'
  assignedAt: string
  estimatedArrival?: string
  deliveredAt?: string
  failureReason?: string
  items: Array<{
    productName: string
    quantity: number
  }>
}

export const getDriverDeliveries = async (params?: {
  page?: number
  limit?: number
  status?: string
  from?: string
  to?: string
}): Promise<ApiResponse<PaginatedResponse<DriverDelivery>>> => {
  const { data } = await apiClient.get('/driver/deliveries', { params })
  return data
}

export const getDeliveryDetail = async (
  id: ID
): Promise<ApiResponse<DriverDelivery>> => {
  const { data } = await apiClient.get(`/driver/deliveries/${id}`)
  return data
}

export const startDelivery = async (
  id: ID
): Promise<ApiResponse<DriverDelivery>> => {
  const { data } = await apiClient.patch(`/driver/deliveries/${id}/start`)
  return data
}

export const markArrived = async (
  id: ID
): Promise<ApiResponse<DriverDelivery>> => {
  const { data } = await apiClient.patch(`/driver/deliveries/${id}/arrived`)
  return data
}

export const markDelivered = async (
  id: ID,
  payload?: { proofImage?: string; customerSignature?: string }
): Promise<ApiResponse<DriverDelivery>> => {
  const { data } = await apiClient.patch(
    `/driver/deliveries/${id}/delivered`,
    payload
  )
  return data
}

export const markFailedDelivery = async (
  id: ID,
  reason: string
): Promise<ApiResponse<DriverDelivery>> => {
  const { data } = await apiClient.patch(
    `/driver/deliveries/${id}/failed`,
    { reason }
  )
  return data
}

// ─── Driver Location ──────────────────────────────────────────────────────────

export const updateDriverLocation = async (payload: {
  lat: number
  lng: number
  heading?: number
  speed?: number
}): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.post('/driver/location', payload)
  return data
}

// ─── Driver Chats ─────────────────────────────────────────────────────────────

export interface DriverChatThread {
  id: ID
  orderId: ID
  orderNumber: string
  customerName: string
  storeName: string
  lastMessage?: {
    message: string
    createdAt: string
  }
  unreadCount: number
  updatedAt: string
}

export interface DriverChatMessage {
  id: ID
  threadId: ID
  senderId: ID
  senderName: string
  senderType: 'customer' | 'store' | 'driver' | 'admin'
  message: string
  createdAt: string
}

export const getDriverChats = async (params?: {
  page?: number
  limit?: number
}): Promise<ApiResponse<PaginatedResponse<DriverChatThread>>> => {
  const { data } = await apiClient.get('/driver/chats', { params })
  return data
}

export const getDriverChatMessages = async (
  threadId: ID
): Promise<ApiResponse<DriverChatMessage[]>> => {
  const { data } = await apiClient.get(`/driver/chats/${threadId}/messages`)
  return data
}

export const sendDriverChatMessage = async (
  threadId: ID,
  message: string
): Promise<ApiResponse<DriverChatMessage>> => {
  const { data } = await apiClient.post(
    `/driver/chats/${threadId}/messages`,
    { message }
  )
  return data
}

// ─── Driver Profile ───────────────────────────────────────────────────────────

export interface DriverProfile {
  id: ID
  name: string
  phone: string
  email: string
  storeName: string
  isAvailable: boolean
  vehicleType?: string
  vehiclePlate?: string
  activeDeliveries: number
  completedToday: number
  completedTotal: number
}

export const getDriverProfile = async (): Promise<
  ApiResponse<DriverProfile>
> => {
  const { data } = await apiClient.get('/driver/profile')
  return data
}

export const updateDriverAvailability = async (
  isAvailable: boolean
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.patch('/driver/availability', {
    isAvailable,
  })
  return data
}

// ─── Active Delivery (shortcut) ───────────────────────────────────────────────

export const getActiveDelivery = async (): Promise<
  ApiResponse<DriverDelivery | null>
> => {
  const { data } = await apiClient.get('/driver/deliveries/active')
  return data
}

export const getOrderForDriver = async (
  orderId: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.get(`/driver/orders/${orderId}`)
  return data
}
