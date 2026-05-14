export type ID = string | number

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface SelectOption {
  value: string | number
  label: string
}

export type Status = 'active' | 'inactive'
export type Language = 'en' | 'ar'

export interface Timestamps {
  createdAt: string
  updatedAt: string
}

export interface Address {
  street: string
  area: string
  governorate: string
  lat?: number
  lng?: number
  notes?: string
}

export interface Governorate {
  id: ID
  nameEn: string
  nameAr: string
  status: Status
}

export interface Area {
  id: ID
  nameEn: string
  nameAr: string
  governorateId: ID
  governorate?: Governorate
  status: Status
}
