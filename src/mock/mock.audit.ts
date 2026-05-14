export const MOCK_AUDIT_LOGS = [
  { id: 1, actor: 'admin@example.com', role: 'super_admin', action: 'APPROVE_REFUND', module: 'Refunds', target: 'Refund #RF-001', ip: '192.168.1.10', timestamp: '2025-05-10 09:45', severity: 'info' },
  { id: 2, actor: 'ops@example.com', role: 'operations_admin', action: 'UPDATE_PRICING_RULE', module: 'Pricing', target: 'Rule #PR-007', ip: '192.168.1.14', timestamp: '2025-05-10 09:30', severity: 'warning' },
  { id: 3, actor: 'admin@example.com', role: 'super_admin', action: 'DELETE_USER', module: 'Users', target: 'user_id:45', ip: '192.168.1.10', timestamp: '2025-05-10 09:00', severity: 'critical' },
  { id: 4, actor: 'finance@example.com', role: 'finance', action: 'CREDIT_WALLET', module: 'Wallet', target: 'Customer: Ahmed Al-Rashid', ip: '192.168.1.22', timestamp: '2025-05-10 08:55', severity: 'warning' },
  { id: 5, actor: 'catalog@example.com', role: 'catalog_manager', action: 'CREATE_PRODUCT', module: 'Products', target: 'Product: Fresh Cream 200ml', ip: '192.168.1.18', timestamp: '2025-05-10 08:30', severity: 'info' },
  { id: 6, actor: 'ops@example.com', role: 'operations_admin', action: 'TOGGLE_STORE_STATUS', module: 'Stores', target: 'Store: Mobile2000 - Fahaheel', ip: '192.168.1.14', timestamp: '2025-05-10 08:00', severity: 'warning' },
  { id: 7, actor: 'admin@example.com', role: 'super_admin', action: 'UPDATE_ROLE_PERMISSIONS', module: 'Roles', target: 'Role: catalog_manager', ip: '192.168.1.10', timestamp: '2025-05-09 17:45', severity: 'critical' },
  { id: 8, actor: 'support@example.com', role: 'support', action: 'VIEW_ORDER', module: 'Orders', target: 'ORD-2025-0005', ip: '192.168.1.30', timestamp: '2025-05-09 16:00', severity: 'info' },
  { id: 9, actor: 'catalog@example.com', role: 'catalog_manager', action: 'UPDATE_PRODUCT', module: 'Products', target: 'Product: Olive Oil 750ml', ip: '192.168.1.18', timestamp: '2025-05-09 15:30', severity: 'info' },
  { id: 10, actor: 'admin@example.com', role: 'super_admin', action: 'REJECT_RETURN', module: 'Returns', target: 'RET-2025-001', ip: '192.168.1.10', timestamp: '2025-05-09 14:00', severity: 'info' },
]
