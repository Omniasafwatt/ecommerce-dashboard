import { useState } from 'react'
import { Search, RefreshCw, Download, Info } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MOCK_ADMIN_INVENTORY as MOCK } from '@/mock/mock.inventory'

function StockBadge({ stock }: { stock: number }) {
  const { t } = useTranslation()
  if (stock === 0) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">{t('operations.inventory.outOfStockLabel')}</span>
  if (stock <= 10) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">{t('operations.inventory.lowLabel', { count: stock })}</span>
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">{t('operations.inventory.units', { count: stock })}</span>
}

export default function Inventory() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterStore, setFilterStore] = useState('')
  const [filterGov, setFilterGov] = useState('')
  const [showOutOfStock, setShowOutOfStock] = useState(false)
  const [showLowStock, setShowLowStock] = useState(false)

  const lastSyncTime = '2025-05-10 09:00 AM'
  const stores = [...new Set(MOCK.map(i => i.store))]
  const govs = [...new Set(MOCK.map(i => i.governorate))]

  const filtered = MOCK.filter(i =>
    (!search || i.productName.toLowerCase().includes(search.toLowerCase()) || i.sku.toLowerCase().includes(search.toLowerCase())) &&
    (!filterStore || i.store === filterStore) &&
    (!filterGov || i.governorate === filterGov) &&
    (!showOutOfStock || i.stock === 0) &&
    (!showLowStock || (i.stock > 0 && i.stock <= 10))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('products.inventory.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('operations.inventory.readOnlySynced')}</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          <Download size={16} />{t('common.exportData')}
        </button>
      </div>

      {/* Read-only notice */}
      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
        <Info size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">{t('operations.inventory.readOnlyView')}</p>
          <p className="text-xs text-amber-700 mt-0.5">{t('operations.inventory.odooManaged')} {t('products.inventory.lastSync')}: {lastSyncTime}</p>
        </div>
        <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-amber-700 hover:bg-amber-100 rounded-lg">
          <RefreshCw size={12} />{t('common.refresh')}
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{t('operations.inventory.totalSKUs')}</p>
          <p className="text-2xl font-bold text-gray-900">{MOCK.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{t('products.inventory.outOfStock')}</p>
          <p className="text-2xl font-bold text-red-600">{MOCK.filter(i => i.stock === 0).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{t('operations.inventory.lowStockLabel')}</p>
          <p className="text-2xl font-bold text-amber-600">{MOCK.filter(i => i.stock > 0 && i.stock <= 10).length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs text-gray-500 mb-1">{t('products.inventory.inStock')}</p>
          <p className="text-2xl font-bold text-green-600">{MOCK.filter(i => i.stock > 10).length}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap items-center">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('operations.inventory.searchPlaceholder')} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterStore} onChange={e => setFilterStore(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">{t('operations.inventory.allStores')}</option>
            {stores.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={filterGov} onChange={e => setFilterGov(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">{t('operations.inventory.allGovernorates')}</option>
            {govs.map(g => <option key={g}>{g}</option>)}
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={showOutOfStock} onChange={e => setShowOutOfStock(e.target.checked)} className="rounded" />
            {t('operations.inventory.outOfStockOnly')}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
            <input type="checkbox" checked={showLowStock} onChange={e => setShowLowStock(e.target.checked)} className="rounded" />
            {t('operations.inventory.lowStockOnly')}
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[t('products.productName'), t('operations.inventory.variantSku'), t('store.title'), t('operations.inventory.governorateArea'), t('products.inventory.quantity'), t('operations.inventory.lastSync')].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className={`hover:bg-gray-50 ${item.stock === 0 ? 'bg-red-50/30' : item.stock <= 10 ? 'bg-amber-50/30' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-500" dir="rtl">{item.productNameAr}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm text-gray-700">{item.variantName || '—'}</p>
                    <p className="text-xs font-mono text-gray-400">{item.sku}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.store}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.area}, {item.governorate}</td>
                  <td className="px-4 py-3"><StockBadge stock={item.stock} /></td>
                  <td className="px-4 py-3 text-xs text-gray-400">{item.lastSync}</td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">{t('operations.inventory.noItems')}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
