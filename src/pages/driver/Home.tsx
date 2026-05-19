import { MapPin, Package, ChevronRight, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_DRIVER_HOME_DELIVERIES as MOCK_DELIVERIES } from '@/mock/mock.deliveries'

type DeliveryStatus = 'assigned' | 'picked_up' | 'arrived' | 'delivered' | 'failed'


const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-100' },
  picked_up: { label: 'Picked Up', color: 'text-orange-700', bg: 'bg-orange-100' },
  arrived: { label: 'Arrived', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function DriverHome() {
  const deliveries = MOCK_DELIVERIES
  const active = deliveries.find(d => d.status === 'assigned' || d.status === 'picked_up' || d.status === 'arrived')
  const completed = deliveries.filter(d => d.status === 'delivered' || d.status === 'failed')
  const today = deliveries.length

  return (
    <div className="max-w-md mx-auto px-4 py-5 pb-24">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{today}</p>
          <p className="text-xs text-gray-500 mt-0.5">Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-green-600">{completed.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Delivered</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-2xl font-bold text-sky-600">{deliveries.filter(d => d.status === 'assigned').length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Pending</p>
        </div>
      </div>

      {/* Active delivery */}
      {active && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Active Delivery</p>
          <Link to={`/driver/deliveries/${active.id}`}>
            <div className="bg-sky-500 rounded-2xl p-5 text-white shadow-lg">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${STATUS_CONFIG[active.status].bg} ${STATUS_CONFIG[active.status].color}`}>
                    {STATUS_CONFIG[active.status].label}
                  </span>
                  <p className="font-bold text-lg">{active.customer}</p>
                  <p className="text-blue-100 text-sm">{active.orderNumber}</p>
                </div>
                <ChevronRight size={20} className="text-blue-200 mt-1" />
              </div>
              <div className="flex items-center gap-1.5 text-blue-100 text-sm mb-2">
                <MapPin size={14} className="flex-shrink-0" />
                <span>{active.address}, {active.area}</span>
              </div>
              {active.paymentMethod === 'cash' && active.codAmount && (
                <div className="mt-3 p-3 bg-white/10 rounded-xl">
                  <p className="text-blue-100 text-xs mb-0.5">COD Amount to Collect</p>
                  <p className="text-2xl font-bold">KWD {active.codAmount.toFixed(3)}</p>
                </div>
              )}
            </div>
          </Link>
        </div>
      )}

      {/* Today's list */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Today's Deliveries</p>
        <div className="space-y-3">
          {deliveries.map(delivery => {
            const cfg = STATUS_CONFIG[delivery.status]
            const isDone = delivery.status === 'delivered' || delivery.status === 'failed'
            return (
              <Link key={delivery.id} to={`/driver/deliveries/${delivery.id}`}>
                <div className={`bg-white rounded-xl border p-4 flex items-center gap-4 ${isDone ? 'border-gray-100 opacity-70' : 'border-gray-200 shadow-sm'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? 'bg-green-100' : 'bg-blue-100'}`}>
                    {isDone ? <CheckCircle size={20} className="text-green-600" /> : <Package size={20} className="text-sky-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{delivery.customer}</p>
                    <p className="text-xs text-gray-500 truncate">{delivery.address}, {delivery.area}</p>
                    <p className="text-xs text-gray-400">{delivery.orderNumber} · {delivery.items} items</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                    {delivery.paymentMethod === 'cash' && <span className="text-xs font-bold text-green-700">COD</span>}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
