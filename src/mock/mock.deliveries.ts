type DeliveryStatus = 'assigned' | 'picked_up' | 'arrived' | 'delivered' | 'failed'

// Driver home deliveries (driver/Home.tsx)
export const MOCK_DRIVER_HOME_DELIVERIES = [
  { id: 1, orderNumber: 'ORD-2025-0011', customer: 'Sara Al-Hajj', phone: '+965 1234 5678', address: 'Block 5, St 12, H 34', area: 'Salmiya', items: 4, paymentMethod: 'cash', codAmount: 12.500, status: 'assigned' as DeliveryStatus, storeName: 'Mobile2000 - Salmiya' },
  { id: 2, orderNumber: 'ORD-2025-0010', customer: 'Ali Al-Kandari', phone: '+965 4567 8901', address: 'Block 2, St 7, H 8', area: 'Rumaithiya', items: 2, paymentMethod: 'card', status: 'picked_up' as DeliveryStatus, storeName: 'Mobile2000 - Salmiya' },
  { id: 3, orderNumber: 'ORD-2025-0009', customer: 'Nora Al-Sabah', phone: '+965 9012 3456', address: 'Block 8, St 3, H 15', area: 'Salmiya', items: 6, paymentMethod: 'card', status: 'delivered' as DeliveryStatus, storeName: 'Mobile2000 - Salmiya' },
]

// Driver deliveries list (driver/Deliveries.tsx)
export const MOCK_DRIVER_DELIVERIES = [
  { id: 1, orderNumber: 'ORD-2025-0011', customer: 'Sara Al-Hajj', address: 'Block 5, St 12, H 34', area: 'Salmiya', items: 4, paymentMethod: 'cash', codAmount: 12.500, status: 'assigned' as DeliveryStatus, date: '2025-05-10', time: '10:32' },
  { id: 2, orderNumber: 'ORD-2025-0010', customer: 'Ali Al-Kandari', address: 'Block 2, St 7, H 8', area: 'Rumaithiya', items: 2, paymentMethod: 'card', status: 'picked_up' as DeliveryStatus, date: '2025-05-10', time: '10:28' },
  { id: 3, orderNumber: 'ORD-2025-0009', customer: 'Nora Al-Sabah', address: 'Block 8, St 3, H 15', area: 'Salmiya', items: 6, paymentMethod: 'card', status: 'delivered' as DeliveryStatus, date: '2025-05-10', time: '10:10' },
  { id: 4, orderNumber: 'ORD-2025-0005', customer: 'Fatima Hassan', address: 'Block 1, St 5, H 20', area: 'Jabriya', items: 3, paymentMethod: 'cash', codAmount: 9.750, status: 'delivered' as DeliveryStatus, date: '2025-05-09', time: '14:00' },
  { id: 5, orderNumber: 'ORD-2025-0003', customer: 'Ahmed Al-Rashid', address: 'Block 11, St 2, H 7', area: 'Fahaheel', items: 5, paymentMethod: 'wallet', status: 'failed' as DeliveryStatus, date: '2025-05-09', time: '12:30' },
]

// Driver delivery detail (driver/DeliveryDetail.tsx)
export const MOCK_DELIVERY_DETAIL = {
  id: 1,
  orderNumber: 'ORD-2025-0011',
  status: 'picked_up' as DeliveryStatus,
  customer: { name: 'Sara Al-Hajj', phone: '+965 1234 5678' },
  address: { line1: 'Block 5, Street 12, House 34', area: 'Salmiya', governorate: 'Hawalli', coordinates: { lat: 29.3327, lng: 48.0739 } },
  store: { name: 'Mobile2000 - Salmiya', address: 'Block 1, Salem Al-Mubarak St', phone: '+965 2222 1111' },
  items: [
    { name: 'Organic Whole Milk 1L', variant: '1 Litre', qty: 2 },
    { name: 'Greek Yogurt 500g', variant: 'Full Fat', qty: 1 },
    { name: 'Cheddar Cheese Slices', variant: '200g', qty: 1 },
  ],
  paymentMethod: 'cash' as 'cash' | 'card' | 'wallet',
  codAmount: 12.500,
  notes: 'Leave at the door please.',
}
