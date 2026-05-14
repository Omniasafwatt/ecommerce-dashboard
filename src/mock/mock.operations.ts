// Pricing rules (admin/operations/Pricing.tsx)
export const MOCK_PRICING_RULES = [
  { id: 1, name: 'Global 5% Off', type: 'global', discountType: 'percentage', discountValue: 5, priority: 10, validFrom: '2025-05-01', validTo: '2025-05-31', status: 'active' },
  { id: 2, name: 'Salmiya Special', type: 'store', target: 'Mobile2000 - Salmiya', discountType: 'percentage', discountValue: 10, priority: 20, status: 'active' },
  { id: 3, name: 'Hawalli Area Discount', type: 'governorate', target: 'Hawalli', discountType: 'fixed', discountValue: 0.500, priority: 15, status: 'active' },
  { id: 4, name: 'Milk Price Override', type: 'product', target: 'Organic Whole Milk', discountType: 'override', discountValue: 1.200, priority: 30, status: 'inactive' },
]

// Promo codes (admin/operations/Promotions.tsx)
export const MOCK_PROMOTIONS = [
  { id: 1, code: 'WELCOME10', name: 'Welcome Discount', discountType: 'percentage', discountValue: 10, usageLimit: 100, usedCount: 45, validFrom: '2025-05-01', validTo: '2025-05-31', status: 'active' },
  { id: 2, code: 'FREESHIP', name: 'Free Shipping All', discountType: 'free_delivery', discountValue: 0, usedCount: 120, validFrom: '2025-05-10', validTo: '2025-05-15', status: 'active' },
  { id: 3, code: 'SAVE500', name: '500 Fils Off', discountType: 'fixed', discountValue: 0.500, usageLimit: 50, usedCount: 50, validFrom: '2025-04-01', validTo: '2025-04-30', status: 'inactive' },
  { id: 4, code: 'RAMADAN20', name: 'Ramadan Special', discountType: 'percentage', discountValue: 20, usedCount: 0, validFrom: '2025-03-01', validTo: '2025-03-30', status: 'inactive' },
]

// Delivery rules (admin/operations/DeliveryRules.tsx)
export const MOCK_DELIVERY_RULES = [
  { id: 1, name: 'Global Standard', type: 'global', fee: 1.000, isFree: false, status: 'active' },
  { id: 2, name: 'Global Free (orders > KWD 10)', type: 'global', fee: 0, isFree: true, freeThreshold: 10, status: 'active' },
  { id: 3, name: 'Hawalli Premium', type: 'governorate', target: 'Hawalli', fee: 0.750, isFree: false, status: 'active' },
  { id: 4, name: 'Mobile2000 - Salmiya Free', type: 'store', target: 'Mobile2000 - Salmiya', fee: 0, isFree: true, status: 'active' },
]

// Payment method rules (admin/operations/PaymentMethods.tsx)
export const MOCK_PAYMENT_RULES = [
  { id: 1, method: 'tap', type: 'global', isEnabled: true, status: 'active' },
  { id: 2, method: 'cod', type: 'global', isEnabled: true, status: 'active' },
  { id: 3, method: 'cod', type: 'order_value', minOrderValue: 20, isEnabled: false, status: 'active' },
  { id: 4, method: 'tap', type: 'governorate', target: 'Jahra', isEnabled: false, status: 'active' },
]

// Availability rules (admin/operations/Availability.tsx)
export const MOCK_AVAILABILITY_RULES = [
  { id: 1, product: 'Organic Whole Milk', variant: '1L', store: 'Mobile2000 - Salmiya', type: 'normal', status: 'active' },
  { id: 2, product: 'Basmati Rice 5kg', store: 'Mobile2000 - Sharq', type: 'preorder', status: 'active' },
  { id: 3, product: 'Olive Oil Extra Virgin', variant: '750ml', store: 'Mobile2000 - Fahaheel', type: 'delayed', delayHours: 6, status: 'active' },
  { id: 4, product: 'Mixed Nuts 500g', store: 'All Stores', type: 'blocked', status: 'active' },
]
