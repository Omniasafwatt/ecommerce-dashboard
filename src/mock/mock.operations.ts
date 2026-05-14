// Pricing rules (admin/operations/Pricing.tsx)
export const MOCK_PRICING_RULES = [
  { id: 1, name: 'Global 5% Off', type: 'global' as const, discountType: 'percentage' as const, discountValue: 5, priority: 10, validFrom: '2025-05-01', validTo: '2025-05-31', status: 'active' as const },
  { id: 2, name: 'Salmiya Special', type: 'store' as const, target: 'Mobile2000 - Salmiya', discountType: 'percentage' as const, discountValue: 10, priority: 20, status: 'active' as const },
  { id: 3, name: 'Hawalli Area Discount', type: 'governorate' as const, target: 'Hawalli', discountType: 'fixed' as const, discountValue: 0.500, priority: 15, status: 'active' as const },
  { id: 4, name: 'Milk Price Override', type: 'product' as const, target: 'Organic Whole Milk', discountType: 'override' as const, discountValue: 1.200, priority: 30, status: 'inactive' as const },
] as const

// Promo codes (admin/operations/Promotions.tsx)
export const MOCK_PROMOTIONS = [
  { id: 1, code: 'WELCOME10', name: 'Welcome Discount', discountType: 'percentage' as const, discountValue: 10, usageLimit: 100, usedCount: 45, validFrom: '2025-05-01', validTo: '2025-05-31', status: 'active' as const },
  { id: 2, code: 'FREESHIP', name: 'Free Shipping All', discountType: 'free_delivery' as const, discountValue: 0, usedCount: 120, validFrom: '2025-05-10', validTo: '2025-05-15', status: 'active' as const },
  { id: 3, code: 'SAVE500', name: '500 Fils Off', discountType: 'fixed' as const, discountValue: 0.500, usageLimit: 50, usedCount: 50, validFrom: '2025-04-01', validTo: '2025-04-30', status: 'inactive' as const },
  { id: 4, code: 'RAMADAN20', name: 'Ramadan Special', discountType: 'percentage' as const, discountValue: 20, usedCount: 0, validFrom: '2025-03-01', validTo: '2025-03-30', status: 'inactive' as const },
] as const

// Delivery rules (admin/operations/DeliveryRules.tsx)
export const MOCK_DELIVERY_RULES = [
  { id: 1, name: 'Global Standard', type: 'global' as const, fee: 1.000, isFree: false, status: 'active' as const },
  { id: 2, name: 'Global Free (orders > KWD 10)', type: 'global' as const, fee: 0, isFree: true, freeThreshold: 10, status: 'active' as const },
  { id: 3, name: 'Hawalli Premium', type: 'governorate' as const, target: 'Hawalli', fee: 0.750, isFree: false, status: 'active' as const },
  { id: 4, name: 'Mobile2000 - Salmiya Free', type: 'store' as const, target: 'Mobile2000 - Salmiya', fee: 0, isFree: true, status: 'active' as const },
] as const

// Payment method rules (admin/operations/PaymentMethods.tsx)
export const MOCK_PAYMENT_RULES = [
  { id: 1, method: 'tap' as const, type: 'global' as const, isEnabled: true, status: 'active' as const },
  { id: 2, method: 'cod' as const, type: 'global' as const, isEnabled: true, status: 'active' as const },
  { id: 3, method: 'cod' as const, type: 'order_value' as const, minOrderValue: 20, isEnabled: false, status: 'active' as const },
  { id: 4, method: 'tap' as const, type: 'governorate' as const, target: 'Jahra', isEnabled: false, status: 'active' as const },
] as const

// Availability rules (admin/operations/Availability.tsx)
export const MOCK_AVAILABILITY_RULES = [
  { id: 1, product: 'Organic Whole Milk', variant: '1L', store: 'Mobile2000 - Salmiya', type: 'normal' as const, status: 'active' as const },
  { id: 2, product: 'Basmati Rice 5kg', store: 'Mobile2000 - Sharq', type: 'preorder' as const, status: 'active' as const },
  { id: 3, product: 'Olive Oil Extra Virgin', variant: '750ml', store: 'Mobile2000 - Fahaheel', type: 'delayed' as const, delayHours: 6, status: 'active' as const },
  { id: 4, product: 'Mixed Nuts 500g', store: 'All Stores', type: 'blocked' as const, status: 'active' as const },
] as const
