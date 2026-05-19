import { useState } from 'react'
import { ArrowLeft, ArrowRightLeft, Store, Package, AlertTriangle, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_REASSIGNMENT as MOCK } from '@/mock/mock.orders'
import { useTranslation } from 'react-i18next'

interface ReassignItem {
  id: number
  orderNumber: string
  customer: string
  item: string
  currentStore: string
  currentStoreStock: number
  availableStores: { name: string; stock: number; distance: string }[]
  reason: string
  comment: string
  confirmed: boolean
}


const REASONS = ['Out of stock', 'Store closed', 'Item damaged', 'Store capacity issue', 'Customer request', 'Other']

export default function OrderReassignment() {
  const { t } = useTranslation()
  const [items, setItems] = useState<ReassignItem[]>(MOCK)
  const [selectedStore, setSelectedStore] = useState<Record<number, string>>({})

  const update = (id: number, field: keyof ReassignItem, value: string | boolean) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const confirm = (id: number) => {
    if (!selectedStore[id] || !items.find(i => i.id === id)?.reason) return
    setItems(prev => prev.map(i => i.id === id ? { ...i, confirmed: true } : i))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.reassignment', 'Store Reassignment')}</h1>
          <p className="text-sm text-gray-500 mt-1">Reassign items to alternative stores</p>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl mb-5">
        <AlertTriangle size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-amber-800"><strong>Admin Only:</strong> Only admins can reassign orders. A reason is required for all reassignments.</p>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className={`bg-white rounded-xl border shadow-sm ${item.confirmed ? 'border-green-200' : 'border-gray-200'}`}>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <Link to={`/admin/orders/${item.id}`} className="text-sm font-bold text-sky-600">{item.orderNumber}</Link>
                <span className="text-sm text-gray-500 ml-2">· {item.customer}</span>
              </div>
              {item.confirmed && (
                <div className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <CheckCircle size={14} />Reassigned
                </div>
              )}
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Item</p>
                <div className="flex items-center gap-2">
                  <Package size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-800">{item.item}</span>
                </div>

                <p className="text-xs font-semibold text-gray-500 uppercase mt-3 mb-2">Current Store</p>
                <div className="flex items-center gap-2">
                  <Store size={14} className="text-red-400" />
                  <span className="text-sm text-gray-800">{item.currentStore}</span>
                  <span className="text-xs text-red-600 font-medium bg-red-50 px-2 py-0.5 rounded">Stock: {item.currentStoreStock}</span>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Available Stores</p>
                <div className="space-y-2">
                  {item.availableStores.map(store => (
                    <label key={store.name} className={`flex items-center justify-between p-2.5 rounded-lg border-2 cursor-pointer transition-colors ${selectedStore[item.id] === store.name ? 'border-sky-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <div className="flex items-center gap-2">
                        <input type="radio" name={`store-${item.id}`} value={store.name} checked={selectedStore[item.id] === store.name} onChange={() => setSelectedStore(prev => ({ ...prev, [item.id]: store.name }))} className="sr-only" />
                        <div className={`w-3 h-3 rounded-full ${selectedStore[item.id] === store.name ? 'bg-sky-500' : 'bg-gray-300'}`} />
                        <span className="text-sm font-medium text-gray-800">{store.name}</span>
                      </div>
                      <div className="text-right text-xs">
                        <p className="text-green-700 font-semibold">Stock: {store.stock}</p>
                        <p className="text-gray-400">{store.distance}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {!item.confirmed && (
              <div className="p-4 border-t border-gray-100 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Reason *</label>
                    <select value={item.reason} onChange={e => update(item.id, 'reason', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                      <option value="">Select reason</option>
                      {REASONS.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Comment</label>
                    <input value={item.comment} onChange={e => update(item.id, 'comment', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Optional notes" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={() => confirm(item.id)} disabled={!selectedStore[item.id] || !item.reason}
                    className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ArrowRightLeft size={14} />Confirm Reassignment
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {items.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <CheckCircle size={40} className="text-green-400 mx-auto mb-3" />
            <p className="text-gray-500">No orders require reassignment</p>
          </div>
        )}
      </div>
    </div>
  )
}
