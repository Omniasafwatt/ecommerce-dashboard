import type { ID, Address, Timestamps } from './common'

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'rejected'

export type PaymentMethod = 'tap' | 'cod'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DeliveryType = 'instant' | 'scheduled'

export interface OrderItem {
  id: ID
  productId: ID
  productNameEn: string
  productNameAr: string
  variantId?: ID
  variantNameEn?: string
  variantNameAr?: string
  sku?: string
  quantity: number
  price: number
  totalPrice: number
  status: OrderStatus
  storeId: ID
  storeName: string
  cancellationReason?: string
}

export interface Order extends Timestamps {
  id: ID
  orderNumber: string
  customerId: ID
  customerName: string
  customerPhone: string
  address: Address
  items: OrderItem[]
  storeOrders: StoreOrder[]
  status: OrderStatus
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus
  deliveryType: DeliveryType
  scheduledAt?: string
  subtotal: number
  deliveryFee: number
  discount: number
  walletUsed: number
  total: number
  couponCode?: string
  notes?: string
  statusHistory: OrderStatusHistory[]
  driverId?: ID
  driverName?: string
  estimatedDelivery?: string
}

export interface StoreOrder {
  id: ID
  orderId: ID
  storeId: ID
  storeName: string
  items: OrderItem[]
  status: OrderStatus
  driverId?: ID
  driverName?: string
  subtotal: number
  deliveryFee: number
  statusHistory: OrderStatusHistory[]
}

export interface OrderStatusHistory {
  status: OrderStatus
  timestamp: string
  note?: string
  updatedBy: string
}

export interface RefundRequest extends Timestamps {
  id: ID
  orderId: ID
  orderNumber: string
  customerId: ID
  customerName: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  refundMethod?: 'wallet' | 'original_payment'
  processedBy?: string
  processedAt?: string
  notes?: string
}

export interface ReturnRequest extends Timestamps {
  id: ID
  orderId: ID
  orderNumber: string
  itemId: ID
  customerId: ID
  customerName: string
  reason: string
  images: string[]
  type: 'return' | 'replacement'
  status: 'pending' | 'approved' | 'rejected'
  validationResult?: string
  processedBy?: string
  processedAt?: string
}
