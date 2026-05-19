import { useState } from 'react'
import { Shield, Users, Check, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'

type Role = 'super_admin' | 'operations_admin' | 'catalog_manager' | 'store_manager' | 'driver' | 'finance' | 'support' | 'marketing'

const ROLES: { id: Role; name: string; color: string; users: number }[] = [
  { id: 'super_admin', name: 'Super Admin', color: 'bg-violet-100 text-violet-800 border-violet-200', users: 1 },
  { id: 'operations_admin', name: 'Operations Admin', color: 'bg-blue-100 text-blue-800 border-blue-200', users: 3 },
  { id: 'catalog_manager', name: 'Catalog Manager', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', users: 2 },
  { id: 'store_manager', name: 'Store Manager', color: 'bg-orange-100 text-orange-800 border-orange-200', users: 12 },
  { id: 'driver', name: 'Driver', color: 'bg-lime-100 text-lime-800 border-lime-200', users: 45 },
  { id: 'finance', name: 'Finance', color: 'bg-amber-100 text-amber-800 border-amber-200', users: 2 },
  { id: 'support', name: 'Support', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', users: 8 },
  { id: 'marketing', name: 'Marketing', color: 'bg-pink-100 text-pink-800 border-pink-200', users: 3 },
]

const PERMISSION_MODULES = [
  {
    module: 'Dashboard', permissions: [
      { id: 'dashboard.view', label: 'View Dashboard' },
    ]
  },
  {
    module: 'Orders', permissions: [
      { id: 'orders.view', label: 'View Orders' },
      { id: 'orders.cancel', label: 'Cancel Orders' },
      { id: 'orders.approve_refund', label: 'Approve Refunds' },
      { id: 'orders.reassign', label: 'Reassign Stores' },
    ]
  },
  {
    module: 'Catalog', permissions: [
      { id: 'catalog.view', label: 'View Catalog' },
      { id: 'catalog.create', label: 'Create Products' },
      { id: 'catalog.edit', label: 'Edit Products' },
      { id: 'catalog.delete', label: 'Delete Products' },
    ]
  },
  {
    module: 'Users', permissions: [
      { id: 'users.view', label: 'View Users' },
      { id: 'users.create', label: 'Create Users' },
      { id: 'users.edit', label: 'Edit Users' },
      { id: 'users.delete', label: 'Delete Users' },
    ]
  },
  {
    module: 'Finance', permissions: [
      { id: 'finance.view_wallet', label: 'View Wallet' },
      { id: 'finance.credit_wallet', label: 'Credit Wallet' },
      { id: 'finance.debit_wallet', label: 'Debit Wallet' },
    ]
  },
  {
    module: 'Reports', permissions: [
      { id: 'reports.view', label: 'View Reports' },
      { id: 'reports.export', label: 'Export Reports' },
    ]
  },
  {
    module: 'Settings', permissions: [
      { id: 'settings.pricing', label: 'Manage Pricing' },
      { id: 'settings.delivery', label: 'Manage Delivery Rules' },
      { id: 'settings.payments', label: 'Manage Payment Methods' },
    ]
  },
]

const DEFAULT_PERMISSIONS: Record<Role, string[]> = {
  super_admin: PERMISSION_MODULES.flatMap(m => m.permissions.map(p => p.id)),
  operations_admin: ['dashboard.view', 'orders.view', 'orders.cancel', 'orders.reassign', 'catalog.view', 'users.view', 'reports.view', 'reports.export'],
  catalog_manager: ['dashboard.view', 'catalog.view', 'catalog.create', 'catalog.edit'],
  store_manager: ['dashboard.view', 'orders.view'],
  driver: [],
  finance: ['dashboard.view', 'finance.view_wallet', 'finance.credit_wallet', 'finance.debit_wallet', 'orders.view', 'reports.view'],
  support: ['dashboard.view', 'orders.view', 'orders.approve_refund'],
  marketing: ['dashboard.view', 'reports.view', 'catalog.view'],
}

export default function Roles() {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<Role>('operations_admin')
  const [permissions, setPermissions] = useState<Record<Role, string[]>>(DEFAULT_PERMISSIONS)
  const [saved, setSaved] = useState(false)

  const toggle = (permId: string) => {
    setPermissions(prev => {
      const current = prev[selected]
      return {
        ...prev,
        [selected]: current.includes(permId) ? current.filter(p => p !== permId) : [...current, permId],
      }
    })
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const currentRole = ROLES.find(r => r.id === selected)!

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.roles', 'Roles & Permissions')}</h1>
          <p className="text-sm text-gray-500 mt-1">Configure role-based access control</p>
        </div>
        <button onClick={handleSave} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${saved ? 'bg-green-600 text-white' : 'bg-sky-500 text-white hover:bg-sky-600'}`}>
          {saved ? <><Check size={16} />Saved!</> : <><Save size={16} />Save Changes</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Role list */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Roles</p>
            </div>
            <div className="divide-y divide-gray-100">
              {ROLES.map(role => (
                <button key={role.id} onClick={() => setSelected(role.id)}
                  className={`w-full p-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors ${selected === role.id ? 'bg-blue-50 border-l-2 border-blue-600' : ''}`}>
                  <div>
                    <p className={`text-sm font-medium ${selected === role.id ? 'text-blue-700' : 'text-gray-900'}`}>{role.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Users size={11} className="text-gray-400" />
                      <span className="text-xs text-gray-500">{role.users} users</span>
                    </div>
                  </div>
                  {selected === role.id && <Shield size={14} className="text-sky-600" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Permissions matrix */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${currentRole.color}`}>{currentRole.name}</span>
              <span className="text-sm text-gray-500">{permissions[selected].length} permissions granted</span>
              {selected === 'super_admin' && (
                <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">All permissions (locked)</span>
              )}
            </div>
            <div className="p-4 space-y-5">
              {PERMISSION_MODULES.map(module => (
                <div key={module.module}>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">{module.module}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {module.permissions.map(perm => {
                      const isChecked = permissions[selected].includes(perm.id)
                      const isLocked = selected === 'super_admin'
                      return (
                        <label key={perm.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${isChecked ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'} ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}>
                          <div onClick={() => !isLocked && toggle(perm.id)}
                            className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${isChecked ? 'bg-sky-500 border-blue-600' : 'bg-white border-gray-300'}`}>
                            {isChecked && <Check size={12} className="text-white" />}
                          </div>
                          <span className="text-sm text-gray-700">{perm.label}</span>
                          <span className="text-xs text-gray-400 ml-auto font-mono">{perm.id}</span>
                        </label>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
