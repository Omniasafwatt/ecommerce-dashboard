import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { MOCK_STORE_ORDERS as MOCK } from '@/mock/mock.store.orders'

type OrderStatus = 'new' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected'

interface StoreOrder {
  id: number
  storeId: string
  orderNumber: string
  customer: string
  phone: string
  items: number
  total: number
  status: OrderStatus
  paymentMethod: 'cash' | 'card' | 'wallet'
  deliveryType: 'instant' | 'scheduled'
  date: string
  time: string
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  accepted: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-orange-100 text-orange-800',
  out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function StoreOrders() {
  const { t } = useTranslation()
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'
  
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK)
  const [filterDelivery, setFilterDelivery] = useState('')
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<OrderStatus | 'all'>('all')

  // Filter by storeId
  const storeOrders = orders.filter(o => o.storeId === storeId)

  const filtered = storeOrders.filter(o =>
    (activeTab === 'all' || o.status === activeTab) &&
    (!filterDelivery || o.deliveryType === filterDelivery) &&
    (!search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  )

  const getStatusLabel = (status: OrderStatus): string => {
    const labels: Record<OrderStatus, string> = {
      new: t('store.dashboard.statuses.new'),
      accepted: t('store.dashboard.statuses.accepted'),
      preparing: t('store.dashboard.statuses.preparing'),
      out_for_delivery: t('store.dashboard.statuses.out_for_delivery'),
      delivered: t('store.dashboard.statuses.delivered'),
      rejected: t('store.dashboard.statuses.rejected'),
    }
    return labels[status]
  }

  const tabs: { id: OrderStatus | 'all'; label: string }[] = [
    { id: 'all', label: `${t('common.actions')} (${storeOrders.length})` },
    { id: 'new', label: `${t('store.dashboard.statuses.new')} (${storeOrders.filter(o => o.status === 'new').length})` },
    { id: 'accepted', label: t('store.dashboard.statuses.accepted') },
    { id: 'preparing', label: t('store.dashboard.statuses.preparing') },
    { id: 'out_for_delivery', label: t('store.dashboard.statuses.out_for_delivery') },
    { id: 'delivered', label: t('store.dashboard.statuses.delivered') },
    { id: 'rejected', label: t('store.dashboard.statuses.rejected') },
  ]

  const handleQuickStatus = (id: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const getPaymentMethodLabel = (method: string): string => {
    switch (method) {
      case 'cash':
        return t('orders.paymentMethods.cod')
      case 'card':
        return t('orders.paymentMethods.tap')
      case 'wallet':
        return 'Wallet'
      default:
        return method
    }
  }

  const getDeliveryTypeLabel = (type: string): string => {
    return type === 'instant' ? t('orders.deliveryTypes.instant') : t('orders.deliveryTypes.scheduled')
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('orders.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.storeName || t('store.storeName')}</p>
      </div>

      <div className="overflow-x-auto -mx-1 px-1 mb-4">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-max">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeTab === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('orders.searchOrders')} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterDelivery} onChange={e => setFilterDelivery(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">{t('common.actions')}</option>
            <option value="instant">{t('orders.deliveryTypes.instant')}</option>
            <option value="scheduled">{t('orders.deliveryTypes.scheduled')}</option>
          </select>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map(order => (
            <div key={order.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[order.status]}`}>{getStatusLabel(order.status)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${order.deliveryType === 'instant' ? 'bg-blue-50 text-blue-600' : 'bg-indigo-50 text-indigo-600'}`}>{getDeliveryTypeLabel(order.deliveryType)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${order.paymentMethod === 'cash' ? 'bg-green-50 text-green-700' : order.paymentMethod === 'wallet' ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>{getPaymentMethodLabel(order.paymentMethod)}</span>
                  </div>
                  <p className="text-sm text-gray-700">{order.customer} · {order.phone}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.items} {t('store.dashboard.items')} · {order.date} {order.time}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-base font-bold text-gray-900 mb-2">{t('common.currency')} {order.total.toFixed(3)}</p>
                  <div className="flex gap-1.5 justify-end">
                    {order.status === 'new' && (
                      <>
                        <button onClick={() => handleQuickStatus(order.id, 'accepted')} className="px-2.5 py-1 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700">{t('store.dashboard.accept')}</button>
                        <button onClick={() => handleQuickStatus(order.id, 'rejected')} className="px-2.5 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700">{t('store.dashboard.reject')}</button>
                      </>
                    )}
                    {order.status === 'accepted' && (
                      <button onClick={() => handleQuickStatus(order.id, 'preparing')} className="px-2.5 py-1 bg-orange-500 text-white rounded text-xs font-medium hover:bg-orange-600">{t('store.dashboard.statuses.preparing')}</button>
                    )}
                    {order.status === 'preparing' && (
                      <button onClick={() => handleQuickStatus(order.id, 'out_for_delivery')} className="px-2.5 py-1 bg-purple-600 text-white rounded text-xs font-medium hover:bg-purple-700">{t('store.dashboard.statuses.out_for_delivery')}</button>
                    )}
                    <Link to={`/store/orders/${order.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 border border-gray-200 rounded hover:border-blue-300">
                      <Eye size={14} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="p-8 text-center text-sm text-gray-500">{t('orders.noOrders')}</div>
          )}
        </div>
      </div>
    </div>
  )
}
