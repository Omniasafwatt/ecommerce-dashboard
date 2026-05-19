import { useState } from 'react'
import { Search, AlertTriangle, Info } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { MOCK_STORE_INVENTORY as MOCK } from '@/mock/mock.inventory'
import { useTranslation } from 'react-i18next'


function getStockStatus(stock: number): { label: string; color: string; bg: string } {
  if (stock === 0) return { label: 'Out of Stock', color: 'text-red-700', bg: 'bg-red-100' }
  if (stock <= 5) return { label: 'Low Stock', color: 'text-yellow-700', bg: 'bg-yellow-100' }
  return { label: 'In Stock', color: 'text-green-700', bg: 'bg-green-100' }
}

export default function StoreInventory() {
  const { t } = useTranslation()
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'
  
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterStatus, setFilterStatus] = useState('')

  // Filter by storeId
  const storeItems = MOCK.filter(i => i.storeId === storeId)
  const categories = [...new Set(storeItems.map(i => i.category))]

  const filtered = storeItems.filter(item => {
    return (
      (!filterCategory || item.category === filterCategory) &&
      (!filterStatus || (filterStatus === 'out' && item.stock === 0) || (filterStatus === 'low' && item.stock > 0 && item.stock <= 5)) &&
      (!search || item.name.toLowerCase().includes(search.toLowerCase()) || item.sku.toLowerCase().includes(search.toLowerCase()))
    )
  })

  const outCount = storeItems.filter(i => i.stock === 0).length
  const lowCount = storeItems.filter(i => i.stock > 0 && i.stock <= 5).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('nav.inventory', 'Inventory')}</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.storeName || 'Store'} · Read-only stock view from Odoo</p>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-5 text-sm text-blue-800">
        <Info size={16} className="mt-0.5 flex-shrink-0" />
        <p>Stock levels are synced from Odoo and are read-only. Contact admin for stock adjustments.</p>
      </div>

      {(outCount > 0 || lowCount > 0) && (
        <div className="flex flex-wrap gap-3 mb-5">
          {outCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-200 rounded-lg">
              <AlertTriangle size={15} className="text-red-600" />
              <span className="text-sm font-medium text-red-700">{outCount} out of stock</span>
            </div>
          )}
          {lowCount > 0 && (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle size={15} className="text-yellow-600" />
              <span className="text-sm font-medium text-yellow-700">{lowCount} low stock</span>
            </div>
          )}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-col gap-3 sm:flex-row sm:gap-3">
          <div className="relative flex-1 min-w-0">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products or SKU..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full sm:w-auto px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Stock</option>
            <option value="out">Out of Stock</option>
            <option value="low">Low Stock</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Variant</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">SKU</th>
                <th className="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Stock</th>
                <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">Last Sync</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => {
                const st = getStockStatus(item.stock)
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-4 py-3 text-sm font-medium text-gray-900 max-w-[140px] truncate">{item.name}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-600">{item.variant}</td>
                    <td className="hidden md:table-cell px-4 py-3 text-xs font-mono text-gray-500">{item.sku}</td>
                    <td className="hidden sm:table-cell px-4 py-3 text-sm text-gray-600">{item.category}</td>
                    <td className="px-3 sm:px-4 py-3 text-sm font-bold text-gray-900">{item.stock} <span className="font-normal text-gray-400">{item.unit}</span></td>
                    <td className="px-3 sm:px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${st.bg} ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-xs text-gray-400">Today {item.lastSync}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 sm:px-4 py-8 text-center text-sm text-gray-500">No items found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
