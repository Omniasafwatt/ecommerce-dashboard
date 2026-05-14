import type { ID, Status, Timestamps } from './common'

export interface Category extends Timestamps {
  id: ID
  nameEn: string
  nameAr: string
  image?: string
  parentId?: ID
  parent?: Category
  children?: Category[]
  productCount: number
  status: Status
}

export interface Brand extends Timestamps {
  id: ID
  nameEn: string
  nameAr: string
  logo?: string
  status: Status
  productCount: number
}

export interface ProductVariant extends Timestamps {
  id: ID
  productId: ID
  nameEn: string
  nameAr: string
  sku: string
  price: number
  odooProductId?: string
  odooVariantId?: string
  image?: string
  status: Status
  stock?: number
}

export interface Product extends Timestamps {
  id: ID
  nameEn: string
  nameAr: string
  descriptionEn?: string
  descriptionAr?: string
  images: string[]
  price: number
  brandId?: ID
  brand?: Brand
  categoryId: ID
  category?: Category
  variants: ProductVariant[]
  status: Status
  odooProductId?: string
}

export interface Bundle extends Timestamps {
  id: ID
  nameEn: string
  nameAr: string
  price: number
  image?: string
  status: Status
  components: BundleComponent[]
}

export interface BundleComponent {
  productId?: ID
  productName?: string
  product?: Product
  variantId?: ID
  variant?: ProductVariant
  quantity: number
}

export interface InventoryItem {
  productId: ID
  productNameEn: string
  productNameAr: string
  variantId?: ID
  variantNameEn?: string
  variantSku?: string
  storeId: ID
  storeName: string
  governorateId: ID
  governorateName: string
  areaId: ID
  areaName: string
  stock: number
  lastSyncAt: string
  isOutOfStock: boolean
  isLowStock: boolean
}
