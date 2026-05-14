import type { Product, Brand, Category } from '@/types/product'

// Categories (admin/catalog/Categories.tsx, admin/catalog/products/ProductList.tsx)
export const MOCK_CATEGORIES: Category[] = [
  { id: '1', nameEn: 'Electronics', nameAr: 'إلكترونيات', productCount: 45, status: 'active', createdAt: '', updatedAt: '' },
  { id: '2', nameEn: 'Clothing', nameAr: 'ملابس', productCount: 120, status: 'active', createdAt: '', updatedAt: '' },
  { id: '3', nameEn: 'Home & Kitchen', nameAr: 'المنزل والمطبخ', productCount: 80, status: 'active', createdAt: '', updatedAt: '' },
  { id: '4', nameEn: 'Sports', nameAr: 'رياضة', productCount: 35, status: 'active', createdAt: '', updatedAt: '' },
]

// Brands (admin/catalog/Brands.tsx, admin/catalog/products/ProductList.tsx)
export const MOCK_BRANDS: Brand[] = [
  { id: '1', nameEn: 'Apple', nameAr: 'آبل', productCount: 20, status: 'active', createdAt: '', updatedAt: '' },
  { id: '2', nameEn: 'Samsung', nameAr: 'سامسونج', productCount: 35, status: 'active', createdAt: '', updatedAt: '' },
  { id: '3', nameEn: 'Nike', nameAr: 'نايك', productCount: 50, status: 'active', createdAt: '', updatedAt: '' },
  { id: '4', nameEn: 'Sony', nameAr: 'سوني', productCount: 28, status: 'active', createdAt: '', updatedAt: '' },
]

// Products (admin/catalog/products/ProductList.tsx)
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1', nameEn: 'iPhone 15 Pro Max', nameAr: 'آيفون 15 برو ماكس',
    descriptionEn: 'Latest Apple flagship smartphone', price: 1299,
    categoryId: '1', category: MOCK_CATEGORIES[0],
    brandId: '1', brand: MOCK_BRANDS[0],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v1', productId: '1', nameEn: '256GB Black', nameAr: '256 جيجا أسود', sku: 'IPH-15PM-256-BLK', price: 1299, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v2', productId: '1', nameEn: '512GB Silver', nameAr: '512 جيجا فضي', sku: 'IPH-15PM-512-SLV', price: 1499, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-001', createdAt: '2024-01-10', updatedAt: '2024-03-15',
  },
  {
    id: '2', nameEn: 'Samsung Galaxy S24 Ultra', nameAr: 'سامسونج جلاكسي S24 الترا',
    descriptionEn: 'Premium Samsung Android flagship', price: 1199,
    categoryId: '1', category: MOCK_CATEGORIES[0],
    brandId: '2', brand: MOCK_BRANDS[1],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v3', productId: '2', nameEn: '256GB Titanium', nameAr: '256 جيجا تيتانيوم', sku: 'SAM-S24U-256-TIT', price: 1199, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-002', createdAt: '2024-01-12', updatedAt: '2024-03-10',
  },
  {
    id: '3', nameEn: 'Nike Air Max 270', nameAr: 'نايك إير ماكس 270',
    descriptionEn: 'Iconic Nike running shoes with Air unit', price: 149,
    categoryId: '4', category: MOCK_CATEGORIES[3],
    brandId: '3', brand: MOCK_BRANDS[2],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v4', productId: '3', nameEn: 'Size 40 Black', nameAr: 'مقاس 40 أسود', sku: 'NK-AM270-40-BLK', price: 149, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v5', productId: '3', nameEn: 'Size 42 White', nameAr: 'مقاس 42 أبيض', sku: 'NK-AM270-42-WHT', price: 149, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v6', productId: '3', nameEn: 'Size 44 Red', nameAr: 'مقاس 44 أحمر', sku: 'NK-AM270-44-RED', price: 149, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-003', createdAt: '2024-02-01', updatedAt: '2024-03-05',
  },
  {
    id: '4', nameEn: 'Sony WH-1000XM5', nameAr: 'سوني WH-1000XM5',
    descriptionEn: 'Industry-leading noise canceling wireless headphones', price: 349,
    categoryId: '1', category: MOCK_CATEGORIES[0],
    brandId: '4', brand: MOCK_BRANDS[3],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v7', productId: '4', nameEn: 'Black', nameAr: 'أسود', sku: 'SNY-WH1000XM5-BLK', price: 349, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-004', createdAt: '2024-02-10', updatedAt: '2024-02-28',
  },
  {
    id: '5', nameEn: 'Samsung 65" QLED TV', nameAr: 'تلفزيون سامسونج QLED 65 بوصة',
    descriptionEn: '4K QLED Smart TV with Quantum Processor', price: 1599,
    categoryId: '1', category: MOCK_CATEGORIES[0],
    brandId: '2', brand: MOCK_BRANDS[1],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v8', productId: '5', nameEn: '65 inch', nameAr: '65 بوصة', sku: 'SAM-TV-QLED-65', price: 1599, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-005', createdAt: '2024-02-15', updatedAt: '2024-03-01',
  },
  {
    id: '6', nameEn: 'Kitchen Blender Pro', nameAr: 'خلاط المطبخ برو',
    descriptionEn: 'Professional-grade countertop blender', price: 89,
    categoryId: '3', category: MOCK_CATEGORIES[2],
    brandId: '1', brand: MOCK_BRANDS[0],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v9', productId: '6', nameEn: 'White 1.5L', nameAr: 'أبيض 1.5 لتر', sku: 'KIT-BLD-WHT-1.5', price: 89, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v10', productId: '6', nameEn: 'Black 2L', nameAr: 'أسود 2 لتر', sku: 'KIT-BLD-BLK-2', price: 109, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'inactive', odooProductId: 'OD-006', createdAt: '2024-01-20', updatedAt: '2024-02-10',
  },
  {
    id: '7', nameEn: 'Nike Dri-FIT Training Tee', nameAr: 'تيشيرت نايك دراي فيت للتدريب',
    descriptionEn: 'Sweat-wicking performance t-shirt', price: 39,
    categoryId: '2', category: MOCK_CATEGORIES[1],
    brandId: '3', brand: MOCK_BRANDS[2],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v11', productId: '7', nameEn: 'Small Black', nameAr: 'صغير أسود', sku: 'NK-DRY-TEE-S-BLK', price: 39, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v12', productId: '7', nameEn: 'Medium Navy', nameAr: 'وسط كحلي', sku: 'NK-DRY-TEE-M-NVY', price: 39, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v13', productId: '7', nameEn: 'Large White', nameAr: 'كبير أبيض', sku: 'NK-DRY-TEE-L-WHT', price: 39, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v14', productId: '7', nameEn: 'XL Red', nameAr: 'كبير جداً أحمر', sku: 'NK-DRY-TEE-XL-RED', price: 39, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-007', createdAt: '2024-03-01', updatedAt: '2024-03-20',
  },
  {
    id: '8', nameEn: 'Apple AirPods Pro (3rd Gen)', nameAr: 'آبل إيربودز برو (الجيل الثالث)',
    descriptionEn: 'Active Noise Cancellation for immersive sound', price: 249,
    categoryId: '1', category: MOCK_CATEGORIES[0],
    brandId: '1', brand: MOCK_BRANDS[0],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v15', productId: '8', nameEn: 'White', nameAr: 'أبيض', sku: 'APL-APP3-WHT', price: 249, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-008', createdAt: '2024-03-05', updatedAt: '2024-03-22',
  },
  {
    id: '9', nameEn: 'Non-Stick Cookware Set', nameAr: 'طقم أواني الطبخ غير اللاصقة',
    descriptionEn: '12-piece premium non-stick cookware set', price: 199,
    categoryId: '3', category: MOCK_CATEGORIES[2],
    brandId: '4', brand: MOCK_BRANDS[3],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v16', productId: '9', nameEn: '12-Piece Set', nameAr: 'طقم 12 قطعة', sku: 'HK-CKW-NS-12PC', price: 199, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'active', odooProductId: 'OD-009', createdAt: '2024-01-25', updatedAt: '2024-03-08',
  },
  {
    id: '10', nameEn: 'Yoga Mat Premium', nameAr: 'حصيرة يوغا بريميوم',
    descriptionEn: 'Eco-friendly non-slip yoga mat with alignment lines', price: 59,
    categoryId: '4', category: MOCK_CATEGORIES[3],
    brandId: '3', brand: MOCK_BRANDS[2],
    images: ['https://placehold.co/60x60/e2e8f0/64748b?text=IMG'],
    variants: [
      { id: 'v17', productId: '10', nameEn: 'Purple 6mm', nameAr: 'بنفسجي 6مم', sku: 'SPT-YOGA-PRP-6', price: 59, status: 'active', createdAt: '', updatedAt: '' },
      { id: 'v18', productId: '10', nameEn: 'Blue 8mm', nameAr: 'أزرق 8مم', sku: 'SPT-YOGA-BLU-8', price: 69, status: 'active', createdAt: '', updatedAt: '' },
    ],
    status: 'inactive', odooProductId: 'OD-010', createdAt: '2024-02-20', updatedAt: '2024-03-12',
  },
]

// Bundles (admin/catalog/Bundles.tsx)
export const MOCK_BUNDLES = [
  { id: 1, nameEn: 'Starter Bundle', nameAr: 'باقة البداية', price: 1540.000, components: [{ productName: 'iPhone 15 Pro Max', quantity: 1 }, { productName: 'Apple AirPods Pro (3rd Gen)', quantity: 1 }], status: 'active' },
  { id: 2, nameEn: 'Gaming Setup', nameAr: 'مجموعة الألعاب', price: 1940.000, components: [{ productName: 'Samsung 65" QLED TV', quantity: 1 }, { productName: 'Sony WH-1000XM5', quantity: 1 }], status: 'active' },
  { id: 3, nameEn: 'Sports Pack', nameAr: 'باقة الرياضة', price: 188.000, components: [{ productName: 'Nike Air Max 270', quantity: 1 }, { productName: 'Nike Dri-FIT Training Tee', quantity: 2 }], status: 'inactive' },
]
