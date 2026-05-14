// Admin chat conversations (admin/communication/Chat.tsx)
export const MOCK_ADMIN_CONVOS = [
  {
    id: 1, orderId: 'ORD-2025-0004', customer: 'Sara Al-Hajj', subject: 'Expired product complaint',
    lastMessage: 'I received expired milk, please help!', lastTime: '16:30', unread: 2, status: 'open',
    messages: [
      { id: 1, sender: 'customer', text: 'Hello, I received expired milk in my order.', time: '16:00' },
      { id: 2, sender: 'customer', text: 'I received expired milk, please help!', time: '16:30' },
    ],
  },
  {
    id: 2, orderId: 'ORD-2025-0006', customer: 'Nora Al-Sabah', subject: 'Wrong item delivered',
    lastMessage: 'Thank you for resolving this.', lastTime: '14:00', unread: 0, status: 'resolved',
    messages: [
      { id: 1, sender: 'customer', text: 'I got the wrong rice brand.', time: '13:00' },
      { id: 2, sender: 'admin', text: 'We apologize for the inconvenience. We will process a replacement.', time: '13:20' },
      { id: 3, sender: 'customer', text: 'Thank you for resolving this.', time: '14:00' },
    ],
  },
  {
    id: 3, orderId: 'ORD-2025-0005', customer: 'Ali Al-Kandari', subject: 'Order cancellation',
    lastMessage: 'When will I get my refund?', lastTime: '11:30', unread: 1, status: 'open',
    messages: [
      { id: 1, sender: 'customer', text: 'I need to cancel my order.', time: '11:00' },
      { id: 2, sender: 'admin', text: 'Done. Refund will be processed in 3-5 days.', time: '11:15' },
      { id: 3, sender: 'customer', text: 'When will I get my refund?', time: '11:30' },
    ],
  },
]

// Store chat threads (store/Chat.tsx) — storeId matches store/Chat.tsx filter logic
export const MOCK_STORE_THREADS = [
  {
    id: 1, storeId: '1', orderId: 'ORD-2025-0011', customer: 'Sara Al-Hajj',
    lastMessage: 'Is my order ready yet?', lastTime: '10:38', unread: 1,
    messages: [
      { id: 1, sender: 'customer', text: 'Hi, is my order ready yet?', time: '10:38' },
    ],
  },
  {
    id: 2, storeId: '1', orderId: 'ORD-2025-0009', customer: 'Nora Al-Sabah',
    lastMessage: 'Can you replace the 1L milk with 2L?', lastTime: '10:15', unread: 0,
    messages: [
      { id: 1, sender: 'customer', text: 'Can you replace the 1L milk with 2L?', time: '10:15' },
      { id: 2, sender: 'store', text: 'Sure, no problem! We will update your order.', time: '10:17' },
    ],
  },
  {
    id: 3, storeId: '2', orderId: 'ORD-2025-0007', customer: 'Fatima Hassan',
    lastMessage: 'Thank you!', lastTime: '09:40', unread: 0,
    messages: [
      { id: 1, sender: 'customer', text: 'Where is my order? It has been 30 minutes.', time: '09:32' },
      { id: 2, sender: 'store', text: 'The driver is on the way, should arrive in 10 minutes.', time: '09:35' },
      { id: 3, sender: 'customer', text: 'Thank you!', time: '09:40' },
    ],
  },
]

// Driver chat contacts (driver/Chat.tsx)
export const MOCK_DRIVER_CHATS = [
  {
    id: 1, name: 'Sara Al-Hajj', role: 'customer', orderId: 'ORD-2025-0011',
    lastMessage: 'I am outside, can you call me?', lastTime: '10:40', unread: 1,
    messages: [
      { id: 1, sender: 'other', text: 'Hi, is the driver nearby?', time: '10:38' },
      { id: 2, sender: 'driver', text: 'Yes, I will arrive in 5 minutes.', time: '10:39' },
      { id: 3, sender: 'other', text: 'I am outside, can you call me?', time: '10:40' },
    ],
  },
  {
    id: 2, name: 'Support Team', role: 'support',
    lastMessage: 'Please confirm the customer received the order.', lastTime: '10:20', unread: 0,
    messages: [
      { id: 1, sender: 'other', text: 'Please confirm the customer received the order.', time: '10:20' },
      { id: 2, sender: 'driver', text: 'Delivered successfully.', time: '10:21' },
    ],
  },
]
