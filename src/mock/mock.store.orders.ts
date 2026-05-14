type StoreOrderStatus = 'new' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected'
type PaymentMethod = 'cash' | 'card' | 'wallet'

// Store dashboard orders (store/Dashboard.tsx)
export const MOCK_STORE_DASHBOARD_ORDERS = [
  { id: 1, storeId: '1', orderNumber: 'ORD-2025-0011', customer: 'Sara Al-Hajj', items: 4, total: 12.500, status: 'new' as StoreOrderStatus, time: '10:32', paymentMethod: 'card' as PaymentMethod },
  { id: 2, storeId: '1', orderNumber: 'ORD-2025-0010', customer: 'Ali Al-Kandari', items: 2, total: 7.250, status: 'new' as StoreOrderStatus, time: '10:28', paymentMethod: 'cash' as PaymentMethod },
  { id: 3, storeId: '1', orderNumber: 'ORD-2025-0009', customer: 'Nora Al-Sabah', items: 6, total: 22.000, status: 'accepted' as StoreOrderStatus, time: '10:10', paymentMethod: 'card' as PaymentMethod },
  { id: 4, storeId: '2', orderNumber: 'ORD-2025-0008', customer: 'Ahmed Al-Rashid', items: 3, total: 9.750, status: 'preparing' as StoreOrderStatus, time: '09:55', paymentMethod: 'wallet' as PaymentMethod },
  { id: 5, storeId: '2', orderNumber: 'ORD-2025-0007', customer: 'Fatima Hassan', items: 5, total: 18.500, status: 'out_for_delivery' as StoreOrderStatus, time: '09:30', paymentMethod: 'card' as PaymentMethod },
  { id: 6, storeId: '3', orderNumber: 'ORD-2025-0006', customer: 'Dana Al-Rashid', items: 2, total: 5.500, status: 'delivered' as StoreOrderStatus, time: '09:00', paymentMethod: 'cash' as PaymentMethod },
]

// Store orders list (store/Orders.tsx)
export const MOCK_STORE_ORDERS = [
  { id: 1, storeId: '1', orderNumber: 'ORD-2025-0011', customer: 'Sara Al-Hajj', phone: '+965 1234 5678', items: 4, total: 12.500, status: 'new' as StoreOrderStatus, paymentMethod: 'card' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-10', time: '10:32' },
  { id: 2, storeId: '1', orderNumber: 'ORD-2025-0010', customer: 'Ali Al-Kandari', phone: '+965 4567 8901', items: 2, total: 7.250, status: 'new' as StoreOrderStatus, paymentMethod: 'cash' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-10', time: '10:28' },
  { id: 3, storeId: '1', orderNumber: 'ORD-2025-0009', customer: 'Nora Al-Sabah', phone: '+965 9012 3456', items: 6, total: 22.000, status: 'accepted' as StoreOrderStatus, paymentMethod: 'card' as PaymentMethod, deliveryType: 'scheduled' as const, date: '2025-05-10', time: '10:10' },
  { id: 4, storeId: '2', orderNumber: 'ORD-2025-0008', customer: 'Ahmed Al-Rashid', phone: '+965 2345 6789', items: 3, total: 9.750, status: 'preparing' as StoreOrderStatus, paymentMethod: 'wallet' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-10', time: '09:55' },
  { id: 5, storeId: '2', orderNumber: 'ORD-2025-0007', customer: 'Fatima Hassan', phone: '+965 5678 9012', items: 5, total: 18.500, status: 'out_for_delivery' as StoreOrderStatus, paymentMethod: 'card' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-10', time: '09:30' },
  { id: 6, storeId: '3', orderNumber: 'ORD-2025-0006', customer: 'Dana Al-Rashid', phone: '+965 6789 0123', items: 2, total: 5.500, status: 'delivered' as StoreOrderStatus, paymentMethod: 'cash' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-10', time: '09:00' },
  { id: 7, storeId: '4', orderNumber: 'ORD-2025-0004', customer: 'Omar Al-Failakawi', phone: '+965 3456 7890', items: 1, total: 3.250, status: 'rejected' as StoreOrderStatus, paymentMethod: 'card' as PaymentMethod, deliveryType: 'instant' as const, date: '2025-05-09', time: '18:00' },
]

// Store order detail (store/OrderDetail.tsx)
export const MOCK_STORE_ORDER_DETAIL = {
  id: 1,
  orderNumber: 'ORD-2025-0011',
  status: 'accepted' as StoreOrderStatus,
  customer: { name: 'Sara Al-Hajj', phone: '+965 1234 5678' },
  address: { line1: 'Block 5, Street 12, House 34', area: 'Salmiya', governorate: 'Hawalli' },
  coordinates: { lat: 29.3327, lng: 48.0739 },
  paymentMethod: 'card' as PaymentMethod,
  deliveryType: 'instant',
  notes: 'Please leave at the door.',
  items: [
    { id: 1, name: 'Organic Whole Milk 1L', variant: '1 Litre', qty: 2, price: 1.500 },
    { id: 2, name: 'Greek Yogurt 500g', variant: 'Full Fat', qty: 1, price: 2.250 },
    { id: 3, name: 'Cheddar Cheese Slices', variant: '200g Pack', qty: 1, price: 4.000 },
  ],
  deliveryFee: 1.500,
  discount: 0,
  walletUsed: 0,
  total: 10.750,
  statusHistory: [
    { status: 'new', time: '2025-05-10 10:32', by: 'Customer App' },
    { status: 'accepted', time: '2025-05-10 10:35', by: 'Store Manager' },
  ],
  drivers: [
    { id: 1, name: 'Mohammed Al-Azmi', phone: '+965 5555 0001', available: true },
    { id: 2, name: 'Khalid Mansour', phone: '+965 5555 0002', available: false },
  ],
}
