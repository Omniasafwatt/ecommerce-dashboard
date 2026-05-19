import { useState } from 'react'
import { Users as UsersIcon, Plus, Pencil, Search, Shield, Store, Truck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { UserRole } from '@/types/auth'
import { MOCK_USERS as MOCK } from '@/mock/mock.users'

interface UserItem {
  id: number
  name: string
  email: string
  phone: string
  role: UserRole
  store?: string
  status: 'active' | 'inactive'
  lastLogin: string
}

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin', operations_admin: 'Operations Admin', catalog_manager: 'Catalog Manager',
  store_manager: 'Store Manager', driver: 'Driver', finance: 'Finance', support: 'Support', marketing: 'Marketing',
}

const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: 'bg-violet-100 text-violet-800', operations_admin: 'bg-blue-100 text-blue-800',
  catalog_manager: 'bg-emerald-100 text-emerald-800', store_manager: 'bg-orange-100 text-orange-800',
  driver: 'bg-lime-100 text-lime-800', finance: 'bg-amber-100 text-amber-800',
  support: 'bg-cyan-100 text-cyan-800', marketing: 'bg-pink-100 text-pink-800',
}


const TABS = [
  { id: 'all', label: 'All Users', icon: UsersIcon },
  { id: 'admin', label: 'Admins', icon: Shield },
  { id: 'store_manager', label: 'Store Managers', icon: Store },
  { id: 'driver', label: 'Drivers', icon: Truck },
]

const ADMIN_ROLES: UserRole[] = ['super_admin', 'operations_admin', 'catalog_manager', 'finance', 'support', 'marketing']

export default function Users() {
  const { t } = useTranslation()
  const [items, setItems] = useState<UserItem[]>(MOCK)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('all')

  const filtered = items.filter(i => {
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase())
    const matchTab = tab === 'all' || (tab === 'admin' && ADMIN_ROLES.includes(i.role)) || i.role === tab
    return matchSearch && matchTab
  })

  const toggleStatus = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('users.userManagement', 'User Management')}</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} total users</p>
        </div>
        <Link to="/admin/users/new" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Plus size={16} /><span>Add User</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}>
            <t.icon size={15} />{t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['User', 'Role', 'Store', 'Status', 'Last Login', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-sm font-bold flex-shrink-0">
                        {item.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[item.role]}`}>
                      {ROLE_LABELS[item.role]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.store || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.lastLogin}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/users/${item.id}`} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></Link>
                      <button onClick={() => toggleStatus(item.id)} className={`px-2.5 py-1 rounded text-xs font-medium ${item.status === 'active' ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-green-700 bg-green-50 hover:bg-green-100'}`}>
                        {item.status === 'active' ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No users found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
