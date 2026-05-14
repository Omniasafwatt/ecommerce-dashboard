// Returns list (admin/crm/Returns.tsx)
export const MOCK_RETURNS = [
  { id: 1, requestNumber: 'RET-2025-001', orderNumber: 'ORD-2025-0004', customer: 'Sara Al-Hajj', product: 'Organic Whole Milk 1L', type: 'return', reason: 'Product was expired', images: 2, status: 'pending', date: '2025-05-09 16:00' },
  { id: 2, requestNumber: 'REP-2025-001', orderNumber: 'ORD-2025-0006', customer: 'Nora Al-Sabah', product: 'Basmati Rice 5kg', type: 'replacement', reason: 'Package damaged', images: 3, status: 'pending', date: '2025-05-10 07:30' },
  { id: 3, requestNumber: 'RET-2025-002', orderNumber: 'ORD-2025-0002', customer: 'Fatima Hassan', product: 'Olive Oil 750ml', type: 'return', reason: 'Wrong item delivered', images: 1, status: 'approved', date: '2025-05-08 12:00' },
]

// Return detail (admin/crm/ReturnDetail.tsx)
export const MOCK_RETURN_DETAIL = {
  requestNumber: 'RET-2025-001', orderNumber: 'ORD-2025-0004', type: 'return',
  customer: { name: 'Sara Al-Hajj', email: 'sara@example.com', phone: '+965 1234 5678' },
  product: 'Organic Whole Milk 1L', quantity: 2, reason: 'Product was expired upon delivery',
  images: ['img1.jpg', 'img2.jpg'], validationResult: 'Auto-validation passed within 24h window',
  status: 'pending', date: '2025-05-09 16:00',
  statusHistory: [{ status: 'pending', time: '2025-05-09 16:00', by: 'Customer (App)' }],
}
