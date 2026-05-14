import { useState } from 'react'
import { Clock, CheckCircle, XCircle, Truck, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { MOCK_STORE_DASHBOARD_ORDERS as MOCK_ORDERS } from '@/mock/mock.store.orders'

interface StoreOrder {
  id: number
  storeId: string
  orderNumber: string
  customer: string
  items: number
  total: number
  status: 'new' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected'
  time: string
  paymentMethod: 'cash' | 'card' | 'wallet'
}

export default function StoreDashboard() {
  const { t, i18n } = useTranslation()
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'
  
  const [orders, setOrders] = useState<StoreOrder[]>(MOCK_ORDERS)

  // Filter by storeId
  const storeOrders = orders.filter(o => o.storeId === storeId)

  const counts = {
    new: storeOrders.filter(o => o.status === 'new').length,
    accepted: storeOrders.filter(o => o.status === 'accepted').length,
    preparing: storeOrders.filter(o => o.status === 'preparing').length,
    out_for_delivery: storeOrders.filter(o => o.status === 'out_for_delivery').length,
    delivered: storeOrders.filter(o => o.status === 'delivered').length,
    rejected: storeOrders.filter(o => o.status === 'rejected').length,
  }

  const handleQuickAction = (id: number, newStatus: StoreOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: newStatus } : o))
  }

  // Dynamic status configuration based on language
  const getStatusConfig = (status: StoreOrder['status']) => {
    const statusLabels = {
      new: { label: t('store.dashboard.statuses.new'), color: 'bg-blue-100 text-blue-800', icon: <Package size={14} /> },
      accepted: { label: t('store.dashboard.statuses.accepted'), color: 'bg-yellow-100 text-yellow-800', icon: <CheckCircle size={14} /> },
      preparing: { label: t('store.dashboard.statuses.preparing'), color: 'bg-orange-100 text-orange-800', icon: <Clock size={14} /> },
      out_for_delivery: { label: t('store.dashboard.statuses.out_for_delivery'), color: 'bg-purple-100 text-purple-800', icon: <Truck size={14} /> },
      delivered: { label: t('store.dashboard.statuses.delivered'), color: 'bg-green-100 text-green-800', icon: <CheckCircle size={14} /> },
      rejected: { label: t('store.dashboard.statuses.rejected'), color: 'bg-red-100 text-red-800', icon: <XCircle size={14} /> },
    }
    return statusLabels[status]
  }

  const statCards = [
    { label: t('store.dashboard.cards.newOrders'), value: counts.new, color: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: t('store.dashboard.cards.accepted'), value: counts.accepted, color: 'border-l-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700' },
    { label: t('store.dashboard.cards.preparing'), value: counts.preparing, color: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' },
    { label: t('store.dashboard.cards.outForDelivery'), value: counts.out_for_delivery, color: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
    { label: t('store.dashboard.cards.deliveredToday'), value: counts.delivered, color: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700' },
    { label: t('store.dashboard.cards.rejected'), value: counts.rejected, color: 'border-l-red-500', bg: 'bg-red-50', text: 'text-red-700' },
  ]

  const dateFormat = new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('store.dashboard.title')}</h1>
        <p className="text-sm text-gray-500 mt-1">{user?.storeName || t('store.storeName')} · {t('common.language') === 'English' ? 'Today' : 'اليوم'}, {dateFormat}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {statCards.map(card => (
          <div key={card.label} className={`bg-white rounded-xl border border-gray-200 shadow-sm p-4 border-l-4 ${card.color}`}>
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className={`text-3xl font-bold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* New orders — require immediate action */}
      {counts.new > 0 && (
        <div className="mb-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            {t('store.dashboard.newOrdersRequired')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storeOrders.filter(o => o.status === 'new').map(order => (
              <div key={order.id} className="bg-white rounded-xl border-2 border-blue-200 shadow-sm p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-gray-900">{order.orderNumber}</p>
                    <p className="text-sm text-gray-500">{order.customer} · {order.items} {t('store.dashboard.items')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">{t('common.currency')} {order.total.toFixed(3)}</p>
                    <p className="text-xs text-gray-400">{order.time}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleQuickAction(order.id, 'accepted')} className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">{t('store.dashboard.accept')}</button>
                  <button onClick={() => handleQuickAction(order.id, 'rejected')} className="flex-1 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">{t('store.dashboard.reject')}</button>
                  <Link to={`/store/orders/${order.id}`} className="px-3 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm hover:bg-gray-50">{t('store.dashboard.view')}</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All active orders */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">{t('store.dashboard.activeOrders')}</h3>
          <Link to="/store/orders" className="text-sm text-blue-600 hover:underline">{t('store.dashboard.viewAll')}</Link>
        </div>
        <div className="divide-y divide-gray-100">
          {storeOrders.filter(o => o.status !== 'new').map(order => {
            const cfg = getStatusConfig(order.status)
            return (
              <Link key={order.id} to={`/store/orders/${order.id}`} className="flex items-center justify-between px-4 py-3 hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{order.orderNumber}</p>
                    <p className="text-xs text-gray-500">{order.customer} · {order.items} {t('store.dashboard.items')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${cfg.color}`}>
                    {cfg.icon}{cfg.label}
                  </span>
                  <span className="text-sm font-semibold text-gray-900">{t('common.currency')} {order.total.toFixed(3)}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
