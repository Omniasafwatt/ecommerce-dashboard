import type { ID, Status, Timestamps } from './common'
import type { UserRole } from './auth'

export interface User extends Timestamps {
  id: ID
  name: string
  email: string
  phone: string
  role: UserRole
  status: Status
  avatar?: string
  storeId?: ID
  storeName?: string
  driverId?: ID
  lastLoginAt?: string
}

export interface Customer extends Timestamps {
  id: ID
  name: string
  email: string
  phone: string
  status: Status
  walletBalance: number
  totalOrders: number
  isFirstTimeBuyer: boolean
}

export interface Role {
  id: ID
  name: string
  displayName: string
  permissions: string[]
  userCount: number
}

export interface Permission {
  id: string
  module: string
  action: string
  displayName: string
}
