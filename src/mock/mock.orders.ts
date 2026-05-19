type AdminOrderStatus = 'pending' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected'
type PaymentMethod = 'tap' | 'cod'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
type OrderListStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'refund_requested'

// Admin orders list (Orders.tsx)
export const MOCK_ADMIN_ORDERS = [
  { id: 1, orderNumber: 'ORD-2025-0001', customer: 'Ahmed Al-Rashid', phone: '+965 1234 5678', store: 'Mobile2000 - Salmiya', status: 'out_for_delivery' as AdminOrderStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, items: 5, total: 12.500, date: '2025-05-10 09:00' },
  { id: 2, orderNumber: 'ORD-2025-0002', customer: 'Fatima Hassan', phone: '+965 2345 6789', store: 'Mobile2000 - Sharq', status: 'preparing' as AdminOrderStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'pending' as PaymentStatus, items: 3, total: 7.250, date: '2025-05-10 09:15' },
  { id: 3, orderNumber: 'ORD-2025-0003', customer: 'Mohammed Al-Mutairi', phone: '+965 3456 7890', store: 'Mobile2000 - Fahaheel', status: 'pending' as AdminOrderStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, items: 8, total: 22.000, date: '2025-05-10 09:30' },
  { id: 4, orderNumber: 'ORD-2025-0004', customer: 'Sara Al-Hajj', phone: '+965 4567 8901', store: 'Mobile2000 - Salmiya', status: 'delivered' as AdminOrderStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, items: 2, total: 4.500, date: '2025-05-09 14:00' },
  { id: 5, orderNumber: 'ORD-2025-0005', customer: 'Ali Al-Kandari', phone: '+965 5678 9012', store: 'Mobile2000 - Farwaniya', status: 'cancelled' as AdminOrderStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'refunded' as PaymentStatus, items: 6, total: 18.750, date: '2025-05-09 11:00' },
  { id: 6, orderNumber: 'ORD-2025-0006', customer: 'Nora Al-Sabah', phone: '+965 6789 0123', store: 'Mobile2000 - Sharq', status: 'accepted' as AdminOrderStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, items: 4, total: 9.000, date: '2025-05-10 08:45' },
  { id: 7, orderNumber: 'ORD-2025-0007', customer: 'Khaled Mansour', phone: '+965 7890 1234', store: 'Mobile2000 - Salmiya', status: 'preparing' as AdminOrderStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'pending' as PaymentStatus, items: 7, total: 15.500, date: '2025-05-10 08:00' },
]

// Admin order detail (OrderDetail.tsx)
export const MOCK_ADMIN_ORDER_DETAIL = {
  id: 1, orderNumber: 'ORD-2025-0001', status: 'out_for_delivery' as AdminOrderStatus,
  createdAt: '2025-05-10 09:00',
  customer: { name: 'Ahmed Al-Rashid', phone: '+965 1234 5678', email: 'ahmed@example.com' },
  address: { street: 'Block 5, Street 12, House 7', area: 'Salmiya', governorate: 'Hawalli', lat: 29.332, lng: 48.079 },
  paymentMethod: 'tap', paymentStatus: 'paid', subtotal: 11.500, deliveryFee: 1.000, discount: 0, walletUsed: 0, total: 12.500,
  driver: { name: 'Driver Ali', phone: '+965 9876 5432' },
  storeOrders: [{
    storeName: 'Mobile2000 - Salmiya', status: 'out_for_delivery' as AdminOrderStatus,
    items: [
      { id: 1, nameEn: 'Organic Whole Milk 1L', nameAr: 'حليب كامل 1 لتر', quantity: 2, price: 1.500, total: 3.000, status: 'out_for_delivery' as AdminOrderStatus },
      { id: 2, nameEn: 'Basmati Rice 5kg', nameAr: 'أرز بسمتي 5 كيلو', quantity: 1, price: 4.250, total: 4.250, status: 'out_for_delivery' as AdminOrderStatus },
      { id: 3, nameEn: 'Olive Oil 750ml', nameAr: 'زيت زيتون 750 مل', quantity: 1, price: 4.250, total: 4.250, status: 'out_for_delivery' as AdminOrderStatus },
    ],
  }],
  statusHistory: [
    { status: 'pending' as AdminOrderStatus, time: '2025-05-10 09:00', by: 'Customer' },
    { status: 'accepted' as AdminOrderStatus, time: '2025-05-10 09:05', by: 'Mobile2000 - Salmiya' },
    { status: 'preparing' as AdminOrderStatus, time: '2025-05-10 09:10', by: 'Mobile2000 - Salmiya' },
    { status: 'out_for_delivery' as AdminOrderStatus, time: '2025-05-10 09:30', by: 'Mobile2000 - Salmiya' },
  ],
  auditTrail: [
    { time: '2025-05-10 09:05', user: 'Ahmed Manager (Store Manager)', action: 'Order accepted' },
    { time: '2025-05-10 09:10', user: 'Ahmed Manager (Store Manager)', action: 'Status set to Preparing' },
    { time: '2025-05-10 09:25', user: 'Ahmed Manager (Store Manager)', action: 'Driver assigned: Ali Hassan' },
    { time: '2025-05-10 09:30', user: 'Driver Ali', action: 'Order picked up from store' },
  ],
}

// Order cancellations (OrderCancellations.tsx)
export const MOCK_CANCELLATIONS = [
  { id: 1, orderNumber: 'ORD-2025-0005', customer: 'Ali Al-Kandari', items: 6, reason: 'Changed my mind', requestedBy: 'Customer', date: '2025-05-09 11:00', status: 'processed', refundStatus: 'processed' },
  { id: 2, orderNumber: 'ORD-2025-0008', customer: 'Hassan Al-Badr', items: 2, reason: 'Wrong address entered', requestedBy: 'Customer', date: '2025-05-10 07:30', status: 'pending', refundStatus: 'pending' },
  { id: 3, orderNumber: 'ORD-2025-0009', customer: 'Mariam Al-Sabah', items: 4, reason: 'Item unavailable', requestedBy: 'Store Manager', date: '2025-05-10 08:00', status: 'pending', refundStatus: 'pending' },
]

// Refund requests (Refunds.tsx)
export const MOCK_REFUNDS: any[] = [
  { id: 1, orderNumber: 'ORD-2025-0005', customer: 'Ali Al-Kandari', amount: 18.750, reason: 'Order cancelled', status: 'pending' as const, date: '2025-05-09 11:30' },
  { id: 2, orderNumber: 'ORD-2025-0010', customer: 'Dana Al-Rashid', amount: 5.500, reason: 'Wrong item delivered', status: 'pending' as const, date: '2025-05-10 08:00' },
  { id: 3, orderNumber: 'ORD-2025-0002', customer: 'Fatima Hassan', amount: 3.250, reason: 'Item damaged', status: 'approved' as const, date: '2025-05-09 14:00' },
  { id: 4, orderNumber: 'ORD-2025-0001', customer: 'Ahmed Al-Rashid', amount: 1.500, reason: 'Partial cancellation', status: 'rejected' as const, date: '2025-05-08 10:00' },
]

// Refund detail base (RefundDetail.tsx — id is injected from useParams in the component)
export const MOCK_REFUND_DETAIL_BASE = {
  orderNumber: 'ORD-2025-0005', customer: 'Ali Al-Kandari', customerEmail: 'ali@example.com',
  phone: '+965 4567 8901', originalAmount: 18.750, deliveryFee: 1.000, walletPortion: 2.000,
  itemsAmount: 15.750, reason: 'Order cancelled by customer',
  status: 'pending', requestedAt: '2025-05-09 11:30',
}

// Store reassignment (OrderReassignment.tsx)
export const MOCK_REASSIGNMENT = [
  {
    id: 1, orderNumber: 'ORD-2025-0003', customer: 'Mohammed Al-Mutairi',
    item: 'Organic Whole Milk 1L (×2)', currentStore: 'Mobile2000 - Fahaheel', currentStoreStock: 0,
    availableStores: [{ name: 'Mobile2000 - Salmiya', stock: 45, distance: '12 km' }, { name: 'Mobile2000 - Sharq', stock: 8, distance: '20 km' }],
    reason: '', comment: '', confirmed: false,
  },
  {
    id: 2, orderNumber: 'ORD-2025-0007', customer: 'Khaled Mansour',
    item: 'Basmati Rice 5kg (×1)', currentStore: 'Mobile2000 - Salmiya', currentStoreStock: 0,
    availableStores: [{ name: 'Mobile2000 - Farwaniya', stock: 12, distance: '8 km' }, { name: 'Mobile2000 - Fahaheel', stock: 5, distance: '15 km' }],
    reason: '', comment: '', confirmed: false,
  },
]

// Order list page (OrderList.tsx)
export const MOCK_ORDER_LIST = [
  { id: '1', orderNumber: 'ORD-12345', customerName: 'Ahmed Al-Rashidi', customerPhone: '+965 9876 5432', store: 'Mobile2000 - Salmiya', status: 'pending' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 4, total: 12.500, date: '2026-05-10T09:23:00Z', governorate: 'Capital' },
  { id: '2', orderNumber: 'ORD-12344', customerName: 'Sara Al-Mutairi', customerPhone: '+965 9988 7766', store: 'Mobile2000 - Hawalli', status: 'confirmed' as OrderListStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'pending' as PaymentStatus, itemsCount: 2, total: 7.250, date: '2026-05-10T08:55:00Z', governorate: 'Hawalli' },
  { id: '3', orderNumber: 'ORD-12343', customerName: 'Mohammed Al-Hajri', customerPhone: '+965 5544 3322', store: 'Mobile2000 - Farwaniya', status: 'out_for_delivery' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 6, total: 22.750, date: '2026-05-10T07:10:00Z', governorate: 'Farwaniya' },
  { id: '4', orderNumber: 'ORD-12342', customerName: 'Fatima Al-Enezi', customerPhone: '+965 6677 8899', store: 'Mobile2000 - Ahmadi', status: 'delivered' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 3, total: 9.900, date: '2026-05-09T18:30:00Z', governorate: 'Ahmadi' },
  { id: '5', orderNumber: 'ORD-12341', customerName: 'Khalid Al-Shammari', customerPhone: '+965 5566 4433', store: 'Mobile2000 - Jahra', status: 'cancelled' as OrderListStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'pending' as PaymentStatus, itemsCount: 1, total: 3.500, date: '2026-05-09T15:45:00Z', governorate: 'Jahra' },
  { id: '6', orderNumber: 'ORD-12340', customerName: 'Nora Al-Sabah', customerPhone: '+965 9900 1122', store: 'Mobile2000 - Salmiya', status: 'refund_requested' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'refunded' as PaymentStatus, itemsCount: 5, total: 18.250, date: '2026-05-09T12:00:00Z', governorate: 'Capital' },
  { id: '7', orderNumber: 'ORD-12339', customerName: 'Jaber Al-Ahmad', customerPhone: '+965 6655 4411', store: 'Mobile2000 - Hawalli', status: 'preparing' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 7, total: 31.000, date: '2026-05-10T09:05:00Z', governorate: 'Mubarak Al-Kabeer' },
  { id: '8', orderNumber: 'ORD-12338', customerName: 'Mariam Al-Bloushi', customerPhone: '+965 5533 2244', store: 'Mobile2000 - Farwaniya', status: 'ready' as OrderListStatus, paymentMethod: 'cod' as PaymentMethod, paymentStatus: 'pending' as PaymentStatus, itemsCount: 2, total: 5.750, date: '2026-05-10T08:40:00Z', governorate: 'Hawalli' },
  { id: '9', orderNumber: 'ORD-12337', customerName: 'Abdullah Al-Rasheed', customerPhone: '+965 7788 9900', store: 'Mobile2000 - Farwaniya', status: 'confirmed' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 4, total: 14.500, date: '2026-05-10T08:15:00Z', governorate: 'Farwaniya' },
  { id: '10', orderNumber: 'ORD-12336', customerName: 'Hessa Al-Otaibi', customerPhone: '+965 4422 6688', store: 'Mobile2000 - Ahmadi', status: 'delivered' as OrderListStatus, paymentMethod: 'tap' as PaymentMethod, paymentStatus: 'paid' as PaymentStatus, itemsCount: 8, total: 27.300, date: '2026-05-09T20:00:00Z', governorate: 'Ahmadi' },
]

export const ORDER_LIST_STORES = ['All Stores', 'Mobile2000 - Salmiya', 'Mobile2000 - Hawalli', 'Mobile2000 - Farwaniya', 'Mobile2000 - Ahmadi', 'Mobile2000 - Jahra']
export const ORDER_LIST_GOVERNORATES = ['All Governorates', 'Capital', 'Hawalli', 'Farwaniya', 'Ahmadi', 'Jahra', 'Mubarak Al-Kabeer']
