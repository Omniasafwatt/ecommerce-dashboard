export const MOCK_NOTIFICATIONS: any[] = [
  { id: 1, title: 'Order Dispatched', body: 'Your order {{order_id}} is on its way!', audience: 'customers' as const, type: 'push' as const, sentAt: '2025-05-10 09:00', sentCount: 142 },
  { id: 2, title: 'New Order Alert', body: 'You have a new order to prepare: {{order_id}}', audience: 'store_managers' as const, type: 'in_app' as const, sentAt: '2025-05-10 08:00', sentCount: 3 },
  { id: 3, title: 'Delivery Assignment', body: 'New delivery assigned: {{order_id}} in {{area}}', audience: 'drivers' as const, type: 'push' as const, sentAt: '2025-05-09 16:00', sentCount: 5 },
  { id: 4, title: 'Promotional Offer', body: 'Use code FRESH10 for 10% off your next order!', audience: 'all' as const, type: 'push' as const, sentAt: '2025-05-08 12:00', sentCount: 1240 },
]
