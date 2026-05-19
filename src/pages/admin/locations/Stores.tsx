import { useState } from 'react'
import { Plus, Pencil, Trash2, Search, MapPin, Phone, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MOCK_STORES as MOCK } from '@/mock/mock.stores'

interface StoreItem {
  id: number
  nameEn: string
  nameAr: string
  governorate: string
  area: string
  manager: string
  phone: string
  status: 'active' | 'inactive'
  lat: number
  lng: number
}


export default function Stores() {
  const { t } = useTranslation()
  const [items, setItems] = useState<StoreItem[]>(MOCK)
  const [search, setSearch] = useState('')
  const [filterGov, setFilterGov] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = items.filter(i =>
    (!search || i.nameEn.toLowerCase().includes(search.toLowerCase()) || i.nameAr.includes(search)) &&
    (!filterGov || i.governorate === filterGov) &&
    (!filterStatus || i.status === filterStatus)
  )

  const toggleStatus = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i))
  }

  const handleDelete = () => {
    if (deleteId) setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.stores', 'Stores')}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage store locations</p>
        </div>
        <Link to="/admin/locations/stores/new" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">
          <Plus size={16} /><span>Add Store</span>
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search stores..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterGov} onChange={e => setFilterGov(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none">
            <option value="">All Governorates</option>
            {['Kuwait City','Hawalli','Farwaniya','Ahmadi','Jahra'].map(g => <option key={g}>{g}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Store', 'Location', 'Manager', 'Phone', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.nameEn}</p>
                      <p className="text-xs text-gray-500" dir="rtl">{item.nameAr}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin size={12} className="text-gray-400" />
                      <span>{item.area}, {item.governorate}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <User size={12} className="text-gray-400" />
                      {item.manager}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Phone size={12} className="text-gray-400" />
                      {item.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/locations/stores/${item.id}`} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></Link>
                      <button onClick={() => toggleStatus(item.id)} className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${item.status === 'active' ? 'text-amber-700 bg-amber-50 hover:bg-amber-100' : 'text-green-700 bg-green-50 hover:bg-green-100'}`}>
                        {item.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No stores found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600" /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete Store?</h3>
            <p className="text-sm text-gray-500 mb-5">This will permanently remove the store and all associated data.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
