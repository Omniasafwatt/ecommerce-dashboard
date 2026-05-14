import apiClient from '../client'
import type { ApiResponse, PaginatedResponse, ID } from '../../types/common'
import type { Governorate, Area } from '../../types/common'
import type { User, Customer, Role, Permission } from '../../types/user'
import type { Store, Driver, AvailabilityRule, PricingRule, DeliveryRule, PaymentRule, PromoCode } from '../../types/store'
import type { Product, ProductVariant, Category, Brand, Bundle, InventoryItem } from '../../types/product'
import type { Order, OrderStatus, RefundRequest, ReturnRequest } from '../../types/order'

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  activeStores: number
  activeDrivers: number
  pendingOrders: number
  deliveredOrders: number
  cancelledOrders: number
  averageOrderValue: number
  newCustomers: number
  totalCustomers: number
}

export const getDashboardStats = async (params?: {
  from?: string
  to?: string
}): Promise<ApiResponse<DashboardStats>> => {
  const { data } = await apiClient.get('/admin/dashboard/stats', { params })
  return data
}

export const getDashboardOrdersChart = async (params?: {
  period?: 'day' | 'week' | 'month'
  from?: string
  to?: string
}): Promise<ApiResponse<{ labels: string[]; values: number[] }>> => {
  const { data } = await apiClient.get('/admin/dashboard/orders-chart', { params })
  return data
}

export const getDashboardRevenueChart = async (params?: {
  period?: 'day' | 'week' | 'month'
  from?: string
  to?: string
}): Promise<ApiResponse<{ labels: string[]; values: number[] }>> => {
  const { data } = await apiClient.get('/admin/dashboard/revenue-chart', { params })
  return data
}

// ─── Governorates ─────────────────────────────────────────────────────────────

export const getGovernorates = async (): Promise<ApiResponse<Governorate[]>> => {
  const { data } = await apiClient.get('/admin/governorates')
  return data
}

export const createGovernorate = async (
  payload: Omit<Governorate, 'id'>
): Promise<ApiResponse<Governorate>> => {
  const { data } = await apiClient.post('/admin/governorates', payload)
  return data
}

export const updateGovernorate = async (
  id: ID,
  payload: Partial<Omit<Governorate, 'id'>>
): Promise<ApiResponse<Governorate>> => {
  const { data } = await apiClient.put(`/admin/governorates/${id}`, payload)
  return data
}

export const deleteGovernorate = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/governorates/${id}`)
  return data
}

// ─── Areas ────────────────────────────────────────────────────────────────────

export const getAreas = async (
  governorateId?: ID
): Promise<ApiResponse<Area[]>> => {
  const { data } = await apiClient.get('/admin/areas', {
    params: governorateId ? { governorateId } : undefined,
  })
  return data
}

export const createArea = async (
  payload: Omit<Area, 'id' | 'governorate'>
): Promise<ApiResponse<Area>> => {
  const { data } = await apiClient.post('/admin/areas', payload)
  return data
}

export const updateArea = async (
  id: ID,
  payload: Partial<Omit<Area, 'id' | 'governorate'>>
): Promise<ApiResponse<Area>> => {
  const { data } = await apiClient.put(`/admin/areas/${id}`, payload)
  return data
}

export const deleteArea = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/areas/${id}`)
  return data
}

// ─── Stores ───────────────────────────────────────────────────────────────────

export const getStores = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
  governorateId?: ID
}): Promise<ApiResponse<PaginatedResponse<Store>>> => {
  const { data } = await apiClient.get('/admin/stores', { params })
  return data
}

export const getStore = async (id: ID): Promise<ApiResponse<Store>> => {
  const { data } = await apiClient.get(`/admin/stores/${id}`)
  return data
}

export const createStore = async (
  payload: FormData | Omit<Store, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Store>> => {
  const { data } = await apiClient.post('/admin/stores', payload)
  return data
}

export const updateStore = async (
  id: ID,
  payload: FormData | Partial<Omit<Store, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Store>> => {
  const { data } = await apiClient.put(`/admin/stores/${id}`, payload)
  return data
}

export const deleteStore = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/stores/${id}`)
  return data
}

// ─── Admin Users ──────────────────────────────────────────────────────────────

export const getUsers = async (params?: {
  page?: number
  limit?: number
  search?: string
  role?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<User>>> => {
  const { data } = await apiClient.get('/admin/users', { params })
  return data
}

export const getUser = async (id: ID): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.get(`/admin/users/${id}`)
  return data
}

export const createUser = async (
  payload: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'lastLoginAt'>
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.post('/admin/users', payload)
  return data
}

export const updateUser = async (
  id: ID,
  payload: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<User>> => {
  const { data } = await apiClient.put(`/admin/users/${id}`, payload)
  return data
}

export const deleteUser = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/users/${id}`)
  return data
}

// ─── Customers ────────────────────────────────────────────────────────────────

export const getCustomers = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Customer>>> => {
  const { data } = await apiClient.get('/admin/customers', { params })
  return data
}

export const getCustomer = async (id: ID): Promise<ApiResponse<Customer>> => {
  const { data } = await apiClient.get(`/admin/customers/${id}`)
  return data
}

export const updateCustomerStatus = async (
  id: ID,
  status: string
): Promise<ApiResponse<Customer>> => {
  const { data } = await apiClient.patch(`/admin/customers/${id}/status`, { status })
  return data
}

// ─── Roles ────────────────────────────────────────────────────────────────────

export const getRoles = async (): Promise<ApiResponse<Role[]>> => {
  const { data } = await apiClient.get('/admin/roles')
  return data
}

export const createRole = async (
  payload: Omit<Role, 'id' | 'userCount'>
): Promise<ApiResponse<Role>> => {
  const { data } = await apiClient.post('/admin/roles', payload)
  return data
}

export const updateRole = async (
  id: ID,
  payload: Partial<Omit<Role, 'id' | 'userCount'>>
): Promise<ApiResponse<Role>> => {
  const { data } = await apiClient.put(`/admin/roles/${id}`, payload)
  return data
}

export const deleteRole = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/roles/${id}`)
  return data
}

export const getPermissions = async (): Promise<ApiResponse<Permission[]>> => {
  const { data } = await apiClient.get('/admin/permissions')
  return data
}

// ─── Products ─────────────────────────────────────────────────────────────────

export const getProducts = async (params?: {
  page?: number
  limit?: number
  search?: string
  categoryId?: ID
  brandId?: ID
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Product>>> => {
  const { data } = await apiClient.get('/admin/products', { params })
  return data
}

export const getProduct = async (id: ID): Promise<ApiResponse<Product>> => {
  const { data } = await apiClient.get(`/admin/products/${id}`)
  return data
}

export const createProduct = async (
  payload: FormData | Omit<Product, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Product>> => {
  const { data } = await apiClient.post('/admin/products', payload)
  return data
}

export const updateProduct = async (
  id: ID,
  payload: FormData | Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Product>> => {
  const { data } = await apiClient.put(`/admin/products/${id}`, payload)
  return data
}

export const deleteProduct = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/products/${id}`)
  return data
}

// ─── Product Variants ─────────────────────────────────────────────────────────

export const getVariants = async (
  productId: ID
): Promise<ApiResponse<ProductVariant[]>> => {
  const { data } = await apiClient.get(`/admin/products/${productId}/variants`)
  return data
}

export const createVariant = async (
  productId: ID,
  payload: Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<ProductVariant>> => {
  const { data } = await apiClient.post(
    `/admin/products/${productId}/variants`,
    payload
  )
  return data
}

export const updateVariant = async (
  productId: ID,
  variantId: ID,
  payload: Partial<Omit<ProductVariant, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<ProductVariant>> => {
  const { data } = await apiClient.put(
    `/admin/products/${productId}/variants/${variantId}`,
    payload
  )
  return data
}

export const deleteVariant = async (
  productId: ID,
  variantId: ID
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(
    `/admin/products/${productId}/variants/${variantId}`
  )
  return data
}

// ─── Categories ───────────────────────────────────────────────────────────────

export const getCategories = async (params?: {
  parentId?: ID | null
  status?: string
}): Promise<ApiResponse<Category[]>> => {
  const { data } = await apiClient.get('/admin/categories', { params })
  return data
}

export const createCategory = async (
  payload: FormData | Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'children' | 'parent'>
): Promise<ApiResponse<Category>> => {
  const { data } = await apiClient.post('/admin/categories', payload)
  return data
}

export const updateCategory = async (
  id: ID,
  payload: FormData | Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Category>> => {
  const { data } = await apiClient.put(`/admin/categories/${id}`, payload)
  return data
}

export const deleteCategory = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/categories/${id}`)
  return data
}

// ─── Brands ───────────────────────────────────────────────────────────────────

export const getBrands = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Brand>>> => {
  const { data } = await apiClient.get('/admin/brands', { params })
  return data
}

export const createBrand = async (
  payload: FormData | Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Brand>> => {
  const { data } = await apiClient.post('/admin/brands', payload)
  return data
}

export const updateBrand = async (
  id: ID,
  payload: FormData | Partial<Omit<Brand, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Brand>> => {
  const { data } = await apiClient.put(`/admin/brands/${id}`, payload)
  return data
}

export const deleteBrand = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/brands/${id}`)
  return data
}

// ─── Bundles ──────────────────────────────────────────────────────────────────

export const getBundles = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Bundle>>> => {
  const { data } = await apiClient.get('/admin/bundles', { params })
  return data
}

export const createBundle = async (
  payload: Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<Bundle>> => {
  const { data } = await apiClient.post('/admin/bundles', payload)
  return data
}

export const updateBundle = async (
  id: ID,
  payload: Partial<Omit<Bundle, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Bundle>> => {
  const { data } = await apiClient.put(`/admin/bundles/${id}`, payload)
  return data
}

export const deleteBundle = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/bundles/${id}`)
  return data
}

// ─── Inventory ────────────────────────────────────────────────────────────────

export const getInventory = async (params?: {
  page?: number
  limit?: number
  storeId?: ID
  governorateId?: ID
  areaId?: ID
  outOfStock?: boolean
  lowStock?: boolean
}): Promise<ApiResponse<PaginatedResponse<InventoryItem>>> => {
  const { data } = await apiClient.get('/admin/inventory', { params })
  return data
}

export const syncInventory = async (): Promise<ApiResponse<{ synced: number }>> => {
  const { data } = await apiClient.post('/admin/inventory/sync')
  return data
}

// ─── Availability Rules ───────────────────────────────────────────────────────

export const getAvailabilityRules = async (params?: {
  storeId?: ID
  productId?: ID
}): Promise<ApiResponse<AvailabilityRule[]>> => {
  const { data } = await apiClient.get('/admin/availability-rules', { params })
  return data
}

export const createAvailabilityRule = async (
  payload: Omit<AvailabilityRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<AvailabilityRule>> => {
  const { data } = await apiClient.post('/admin/availability-rules', payload)
  return data
}

export const updateAvailabilityRule = async (
  id: ID,
  payload: Partial<Omit<AvailabilityRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<AvailabilityRule>> => {
  const { data } = await apiClient.put(`/admin/availability-rules/${id}`, payload)
  return data
}

export const deleteAvailabilityRule = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/availability-rules/${id}`)
  return data
}

// ─── Pricing Rules ────────────────────────────────────────────────────────────

export const getPricingRules = async (): Promise<ApiResponse<PricingRule[]>> => {
  const { data } = await apiClient.get('/admin/pricing-rules')
  return data
}

export const createPricingRule = async (
  payload: Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<PricingRule>> => {
  const { data } = await apiClient.post('/admin/pricing-rules', payload)
  return data
}

export const updatePricingRule = async (
  id: ID,
  payload: Partial<Omit<PricingRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<PricingRule>> => {
  const { data } = await apiClient.put(`/admin/pricing-rules/${id}`, payload)
  return data
}

export const deletePricingRule = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/pricing-rules/${id}`)
  return data
}

// ─── Delivery Rules ───────────────────────────────────────────────────────────

export const getDeliveryRules = async (): Promise<ApiResponse<DeliveryRule[]>> => {
  const { data } = await apiClient.get('/admin/delivery-rules')
  return data
}

export const createDeliveryRule = async (
  payload: Omit<DeliveryRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<DeliveryRule>> => {
  const { data } = await apiClient.post('/admin/delivery-rules', payload)
  return data
}

export const updateDeliveryRule = async (
  id: ID,
  payload: Partial<Omit<DeliveryRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<DeliveryRule>> => {
  const { data } = await apiClient.put(`/admin/delivery-rules/${id}`, payload)
  return data
}

export const deleteDeliveryRule = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/delivery-rules/${id}`)
  return data
}

// ─── Payment Rules ────────────────────────────────────────────────────────────

export const getPaymentRules = async (): Promise<ApiResponse<PaymentRule[]>> => {
  const { data } = await apiClient.get('/admin/payment-rules')
  return data
}

export const createPaymentRule = async (
  payload: Omit<PaymentRule, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ApiResponse<PaymentRule>> => {
  const { data } = await apiClient.post('/admin/payment-rules', payload)
  return data
}

export const updatePaymentRule = async (
  id: ID,
  payload: Partial<Omit<PaymentRule, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<PaymentRule>> => {
  const { data } = await apiClient.put(`/admin/payment-rules/${id}`, payload)
  return data
}

export const deletePaymentRule = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/payment-rules/${id}`)
  return data
}

// ─── Promo Codes ──────────────────────────────────────────────────────────────

export const getPromoCodes = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: string
}): Promise<ApiResponse<PaginatedResponse<PromoCode>>> => {
  const { data } = await apiClient.get('/admin/promo-codes', { params })
  return data
}

export const createPromoCode = async (
  payload: Omit<PromoCode, 'id' | 'createdAt' | 'updatedAt' | 'usedCount'>
): Promise<ApiResponse<PromoCode>> => {
  const { data } = await apiClient.post('/admin/promo-codes', payload)
  return data
}

export const updatePromoCode = async (
  id: ID,
  payload: Partial<Omit<PromoCode, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<PromoCode>> => {
  const { data } = await apiClient.put(`/admin/promo-codes/${id}`, payload)
  return data
}

export const deletePromoCode = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/promo-codes/${id}`)
  return data
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export const getOrders = async (params?: {
  page?: number
  limit?: number
  search?: string
  status?: OrderStatus
  paymentMethod?: string
  paymentStatus?: string
  storeId?: ID
  driverId?: ID
  from?: string
  to?: string
}): Promise<ApiResponse<PaginatedResponse<Order>>> => {
  const { data } = await apiClient.get('/admin/orders', { params })
  return data
}

export const getOrder = async (id: ID): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.get(`/admin/orders/${id}`)
  return data
}

export const cancelOrder = async (
  id: ID,
  reason: string
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/admin/orders/${id}/cancel`, { reason })
  return data
}

export const reassignDriver = async (
  orderId: ID,
  driverId: ID
): Promise<ApiResponse<Order>> => {
  const { data } = await apiClient.patch(`/admin/orders/${orderId}/reassign-driver`, {
    driverId,
  })
  return data
}

// ─── Refund Requests ──────────────────────────────────────────────────────────

export const getRefundRequests = async (params?: {
  page?: number
  limit?: number
  status?: string
}): Promise<ApiResponse<PaginatedResponse<RefundRequest>>> => {
  const { data } = await apiClient.get('/admin/refunds', { params })
  return data
}

export const getRefundRequest = async (
  id: ID
): Promise<ApiResponse<RefundRequest>> => {
  const { data } = await apiClient.get(`/admin/refunds/${id}`)
  return data
}

export const approveRefund = async (
  id: ID,
  payload: { refundMethod: 'wallet' | 'original_payment'; notes?: string }
): Promise<ApiResponse<RefundRequest>> => {
  const { data } = await apiClient.patch(`/admin/refunds/${id}/approve`, payload)
  return data
}

export const rejectRefund = async (
  id: ID,
  notes?: string
): Promise<ApiResponse<RefundRequest>> => {
  const { data } = await apiClient.patch(`/admin/refunds/${id}/reject`, { notes })
  return data
}

// ─── Wallet Management ────────────────────────────────────────────────────────

export interface WalletTransaction {
  id: ID
  customerId: ID
  customerName: string
  type: 'credit' | 'debit'
  amount: number
  reason: string
  createdAt: string
}

export const getWalletTransactions = async (params?: {
  page?: number
  limit?: number
  customerId?: ID
}): Promise<ApiResponse<PaginatedResponse<WalletTransaction>>> => {
  const { data } = await apiClient.get('/admin/wallet/transactions', { params })
  return data
}

export const adjustWallet = async (
  customerId: ID,
  payload: { type: 'credit' | 'debit'; amount: number; reason: string }
): Promise<ApiResponse<{ newBalance: number }>> => {
  const { data } = await apiClient.post(
    `/admin/wallet/customers/${customerId}/adjust`,
    payload
  )
  return data
}

// ─── Return Requests ──────────────────────────────────────────────────────────

export const getReturnRequests = async (params?: {
  page?: number
  limit?: number
  status?: string
  type?: 'return' | 'replacement'
}): Promise<ApiResponse<PaginatedResponse<ReturnRequest>>> => {
  const { data } = await apiClient.get('/admin/returns', { params })
  return data
}

export const getReturnRequest = async (
  id: ID
): Promise<ApiResponse<ReturnRequest>> => {
  const { data } = await apiClient.get(`/admin/returns/${id}`)
  return data
}

export const approveReturn = async (
  id: ID,
  notes?: string
): Promise<ApiResponse<ReturnRequest>> => {
  const { data } = await apiClient.patch(`/admin/returns/${id}/approve`, { notes })
  return data
}

export const rejectReturn = async (
  id: ID,
  notes?: string
): Promise<ApiResponse<ReturnRequest>> => {
  const { data } = await apiClient.patch(`/admin/returns/${id}/reject`, { notes })
  return data
}

// ─── Reviews ──────────────────────────────────────────────────────────────────

export interface Review {
  id: ID
  productId: ID
  productName: string
  customerId: ID
  customerName: string
  rating: number
  comment?: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

export const getReviews = async (params?: {
  page?: number
  limit?: number
  productId?: ID
  status?: string
}): Promise<ApiResponse<PaginatedResponse<Review>>> => {
  const { data } = await apiClient.get('/admin/reviews', { params })
  return data
}

export const approveReview = async (id: ID): Promise<ApiResponse<Review>> => {
  const { data } = await apiClient.patch(`/admin/reviews/${id}/approve`)
  return data
}

export const rejectReview = async (id: ID): Promise<ApiResponse<Review>> => {
  const { data } = await apiClient.patch(`/admin/reviews/${id}/reject`)
  return data
}

export const deleteReview = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/reviews/${id}`)
  return data
}

// ─── Notifications ────────────────────────────────────────────────────────────

export interface AdminNotification {
  id: ID
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
  link?: string
}

export const getNotifications = async (params?: {
  page?: number
  limit?: number
  unreadOnly?: boolean
}): Promise<ApiResponse<PaginatedResponse<AdminNotification>>> => {
  const { data } = await apiClient.get('/admin/notifications', { params })
  return data
}

export const markNotificationRead = async (
  id: ID
): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.patch(`/admin/notifications/${id}/read`)
  return data
}

export const markAllNotificationsRead = async (): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.patch('/admin/notifications/read-all')
  return data
}

// ─── Reports ──────────────────────────────────────────────────────────────────

export const getSalesReport = async (params: {
  from: string
  to: string
  groupBy?: 'day' | 'week' | 'month'
}): Promise<ApiResponse<Record<string, unknown>>> => {
  const { data } = await apiClient.get('/admin/reports/sales', { params })
  return data
}

export const getOrdersReport = async (params: {
  from: string
  to: string
  groupBy?: 'day' | 'week' | 'month'
}): Promise<ApiResponse<Record<string, unknown>>> => {
  const { data } = await apiClient.get('/admin/reports/orders', { params })
  return data
}

export const getInventoryReport = async (params?: {
  storeId?: ID
  governorateId?: ID
}): Promise<ApiResponse<Record<string, unknown>>> => {
  const { data } = await apiClient.get('/admin/reports/inventory', { params })
  return data
}

export const getDriversReport = async (params: {
  from: string
  to: string
  storeId?: ID
}): Promise<ApiResponse<Record<string, unknown>>> => {
  const { data } = await apiClient.get('/admin/reports/drivers', { params })
  return data
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export interface AuditLog {
  id: ID
  userId: ID
  userName: string
  action: string
  module: string
  targetId?: ID
  targetType?: string
  changes?: Record<string, unknown>
  ipAddress?: string
  createdAt: string
}

export const getAuditLogs = async (params?: {
  page?: number
  limit?: number
  userId?: ID
  module?: string
  from?: string
  to?: string
}): Promise<ApiResponse<PaginatedResponse<AuditLog>>> => {
  const { data } = await apiClient.get('/admin/audit-logs', { params })
  return data
}

// ─── Drivers (admin-level) ────────────────────────────────────────────────────

export const getDrivers = async (params?: {
  page?: number
  limit?: number
  storeId?: ID
  status?: string
  isAvailable?: boolean
}): Promise<ApiResponse<PaginatedResponse<Driver>>> => {
  const { data } = await apiClient.get('/admin/drivers', { params })
  return data
}

export const getDriver = async (id: ID): Promise<ApiResponse<Driver>> => {
  const { data } = await apiClient.get(`/admin/drivers/${id}`)
  return data
}

export const createDriver = async (
  payload: Omit<Driver, 'id' | 'createdAt' | 'updatedAt' | 'activeDeliveries' | 'completedToday'>
): Promise<ApiResponse<Driver>> => {
  const { data } = await apiClient.post('/admin/drivers', payload)
  return data
}

export const updateDriver = async (
  id: ID,
  payload: Partial<Omit<Driver, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<ApiResponse<Driver>> => {
  const { data } = await apiClient.put(`/admin/drivers/${id}`, payload)
  return data
}

export const deleteDriver = async (id: ID): Promise<ApiResponse<null>> => {
  const { data } = await apiClient.delete(`/admin/drivers/${id}`)
  return data
}
