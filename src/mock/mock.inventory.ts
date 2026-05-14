// Store inventory (store/Inventory.tsx)
export const MOCK_STORE_INVENTORY = [
  { id: 1, storeId: '1', name: 'Organic Whole Milk', category: 'Dairy', variant: '1 Litre', sku: 'MLK-ORG-1L', stock: 48, unit: 'pcs', lastSync: '10:00' },
  { id: 2, storeId: '1', name: 'Organic Whole Milk', category: 'Dairy', variant: '2 Litre', sku: 'MLK-ORG-2L', stock: 12, unit: 'pcs', lastSync: '10:00' },
  { id: 3, storeId: '1', name: 'Greek Yogurt', category: 'Dairy', variant: '500g Full Fat', sku: 'YGT-GRK-500', stock: 3, unit: 'pcs', lastSync: '10:00' },
  { id: 4, storeId: '1', name: 'Cheddar Cheese Slices', category: 'Dairy', variant: '200g', sku: 'CHS-CHD-200', stock: 0, unit: 'pcs', lastSync: '10:00' },
  { id: 5, storeId: '1', name: 'Basmati Rice', category: 'Grains', variant: '5kg Bag', sku: 'RCE-BSM-5K', stock: 25, unit: 'pcs', lastSync: '09:45' },
  { id: 6, storeId: '2', name: 'Basmati Rice', category: 'Grains', variant: '1kg Bag', sku: 'RCE-BSM-1K', stock: 7, unit: 'pcs', lastSync: '09:45' },
  { id: 7, storeId: '2', name: 'Olive Oil', category: 'Oils', variant: '750ml', sku: 'OIL-OLV-750', stock: 0, unit: 'pcs', lastSync: '09:45' },
  { id: 8, storeId: '2', name: 'Sunflower Oil', category: 'Oils', variant: '1.5L', sku: 'OIL-SFL-1L5', stock: 18, unit: 'pcs', lastSync: '09:45' },
  { id: 9, storeId: '3', name: 'White Bread Loaf', category: 'Bakery', variant: 'Large', sku: 'BRD-WHT-LG', stock: 5, unit: 'pcs', lastSync: '10:15' },
  { id: 10, storeId: '4', name: 'Butter Croissant', category: 'Bakery', variant: 'Pack of 4', sku: 'CRS-BTR-P4', stock: 14, unit: 'pcs', lastSync: '10:15' },
]

// Admin inventory (admin/operations/Inventory.tsx)
export const MOCK_ADMIN_INVENTORY = [
  { id: 1, productName: 'Organic Whole Milk', productNameAr: 'حليب كامل الدسم عضوي', variantName: '1L', sku: 'MILK-1L-001', store: 'Mobile2000 - Salmiya', governorate: 'Hawalli', area: 'Salmiya', stock: 45, lastSync: '2025-05-10 09:00' },
  { id: 2, productName: 'Organic Whole Milk', productNameAr: 'حليب كامل الدسم عضوي', variantName: '2L', sku: 'MILK-2L-001', store: 'Mobile2000 - Salmiya', governorate: 'Hawalli', area: 'Salmiya', stock: 0, lastSync: '2025-05-10 09:00' },
  { id: 3, productName: 'Basmati Rice 5kg', productNameAr: 'أرز بسمتي 5 كيلو', sku: 'RICE-5KG-001', store: 'Mobile2000 - Sharq', governorate: 'Kuwait City', area: 'Sharq', stock: 8, lastSync: '2025-05-10 08:30' },
  { id: 4, productName: 'Olive Oil Extra Virgin', productNameAr: 'زيت زيتون بكر ممتاز', variantName: '750ml', sku: 'OIL-750ML-001', store: 'Mobile2000 - Fahaheel', governorate: 'Ahmadi', area: 'Fahaheel', stock: 23, lastSync: '2025-05-09 17:00' },
  { id: 5, productName: 'Chicken Breast 1kg', productNameAr: 'صدر دجاج 1 كيلو', sku: 'CHKN-1KG-001', store: 'Mobile2000 - Salmiya', governorate: 'Hawalli', area: 'Salmiya', stock: 5, lastSync: '2025-05-10 09:00' },
  { id: 6, productName: 'Mixed Nuts 500g', productNameAr: 'مكسرات مشكلة 500 غرام', sku: 'NUTS-500G-001', store: 'Mobile2000 - Farwaniya', governorate: 'Farwaniya', area: 'Farwaniya', stock: 0, lastSync: '2025-05-10 07:00' },
  { id: 7, productName: 'Tomatoes 1kg', productNameAr: 'طماطم 1 كيلو', sku: 'TOM-1KG-001', store: 'Mobile2000 - Sharq', governorate: 'Kuwait City', area: 'Sharq', stock: 34, lastSync: '2025-05-10 08:30' },
]
