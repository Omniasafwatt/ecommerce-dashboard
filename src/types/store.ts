import type { ID, Status, Timestamps, Address } from './common'

export interface Store extends Timestamps {
  id: ID
  nameEn: string
  nameAr: string
  address: Address
  lat: number
  lng: number
  governorateId: ID
  governorateName: string
  areaId: ID
  areaName: string
  managerId?: ID
  managerName?: string
  status: Status
  phone: string
  serviceAreaIds: ID[]
  logoUrl?: string
}

export interface Driver extends Timestamps {
  id: ID
  name: string
  phone: string
  email: string
  storeId: ID
  storeName: string
  status: Status
  isAvailable: boolean
  currentLat?: number
  currentLng?: number
  lastLocationAt?: string
  activeDeliveries: number
  completedToday: number
  vehicleType?: string
  vehiclePlate?: string
}

export interface AvailabilityRule extends Timestamps {
  id: ID
  productId?: ID
  variantId?: ID
  storeId: ID
  type: 'normal' | 'preorder' | 'delayed' | 'blocked'
  delayHours?: number
  status: Status
}

export interface PricingRule extends Timestamps {
  id: ID
  name: string
  type: 'global' | 'store' | 'governorate' | 'area' | 'product' | 'variant'
  targetId?: ID
  price?: number
  discount?: number
  discountType?: 'percentage' | 'fixed'
  priority: number
  status: Status
  validFrom?: string
  validTo?: string
}

export interface DeliveryRule extends Timestamps {
  id: ID
  name: string
  type: 'global' | 'governorate' | 'area' | 'store'
  targetId?: ID
  fee: number
  isFree: boolean
  freeThreshold?: number
  status: Status
}

export interface PaymentRule extends Timestamps {
  id: ID
  method: 'tap' | 'cod'
  type: 'global' | 'governorate' | 'area' | 'store' | 'order_value' | 'customer'
  targetId?: ID
  isEnabled: boolean
  minOrderValue?: number
  maxOrderValue?: number
  status: Status
}

export interface PromoCode extends Timestamps {
  id: ID
  code: string
  name: string
  discountType: 'percentage' | 'fixed' | 'free_delivery' | 'item'
  discountValue: number
  conditions: PromoCondition[]
  usageLimit?: number
  usedCount: number
  validFrom: string
  validTo: string
  status: Status
}

export interface PromoCondition {
  type:
    | 'global'
    | 'store'
    | 'governorate'
    | 'area'
    | 'product'
    | 'category'
    | 'user'
    | 'min_order'
    | 'first_time'
    | 'datetime'
    | 'usage_limit'
  value?: string | number
}
