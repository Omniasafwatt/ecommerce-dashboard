export const MOCK_USERS = [
  { id: 1, name: 'Admin User', email: 'admin@store.com', phone: '+965 1234 5678', role: 'super_admin' as const, status: 'active' as const, lastLogin: '2025-05-10 09:00' },
  { id: 2, name: 'Ahmed Manager', email: 'ahmed@store.com', phone: '+965 2345 6789', role: 'store_manager' as const, store: 'Mobile2000 - Salmiya', status: 'active' as const, lastLogin: '2025-05-10 08:30' },
  { id: 3, name: 'Sara Support', email: 'sara@store.com', phone: '+965 3456 7890', role: 'support' as const, status: 'active' as const, lastLogin: '2025-05-09 17:00' },
  { id: 4, name: 'Driver Ali', email: 'ali@store.com', phone: '+965 4567 8901', role: 'driver' as const, store: 'Mobile2000 - Salmiya', status: 'active' as const, lastLogin: '2025-05-10 07:00' },
  { id: 5, name: 'Finance Team', email: 'finance@store.com', phone: '+965 5678 9012', role: 'finance' as const, status: 'active' as const, lastLogin: '2025-05-08 12:00' },
  { id: 6, name: 'Catalog Admin', email: 'catalog@store.com', phone: '+965 6789 0123', role: 'catalog_manager' as const, status: 'inactive' as const, lastLogin: '2025-05-01 10:00' },
] as const
