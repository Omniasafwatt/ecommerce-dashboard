import { useState } from 'react'
import { Package, ChevronRight, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_DRIVER_DELIVERIES as MOCK } from '@/mock/mock.deliveries'

type DeliveryStatus = 'assigned' | 'picked_up' | 'arrived' | 'delivered' | 'failed'


const STATUS_CONFIG: Record<DeliveryStatus, { label: string; color: string; bg: string }> = {
  assigned: { label: 'Assigned', color: 'text-blue-700', bg: 'bg-blue-100' },
  picked_up: { label: 'Picked Up', color: 'text-orange-700', bg: 'bg-orange-100' },
  arrived: { label: 'Arrived', color: 'text-purple-700', bg: 'bg-purple-100' },
  delivered: { label: 'Delivered', color: 'text-green-700', bg: 'bg-green-100' },
  failed: { label: 'Failed', color: 'text-red-700', bg: 'bg-red-100' },
}

export default function DriverDeliveries() {
  const [filterStatus, setFilterStatus] = useState<DeliveryStatus | 'all'>('all')
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter(d =>
    (filterStatus === 'all' || d.status === filterStatus) &&
    (!search || d.customer.toLowerCase().includes(search.toLowerCase()) || d.orderNumber.toLowerCase().includes(search.toLowerCase()))
  )

  const tabs: { id: DeliveryStatus | 'all'; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'assigned', label: 'Assigned' },
    { id: 'picked_up', label: 'Picked Up' },
    { id: 'delivered', label: 'Delivered' },
    { id: 'failed', label: 'Failed' },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-5 pb-24">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">All t('nav.deliveries', 'Deliveries')</h1>
        <p className="text-sm text-gray-500">{MOCK.length} total deliveries</p>
      </div>

      <div className="overflow-x-auto -mx-4 px-4 mb-4">
        <div className="flex gap-2 w-max">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setFilterStatus(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${filterStatus === t.id ? 'bg-sky-500 text-white' : 'bg-white text-gray-600 border border-gray-200'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500" />
      </div>

      <div className="space-y-3">
        {filtered.map(delivery => {
          const cfg = STATUS_CONFIG[delivery.status]
          return (
            <Link key={delivery.id} to={`/driver/deliveries/${delivery.id}`}>
              <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 shadow-sm active:bg-gray-50">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Package size={18} className="text-sky-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{delivery.customer}</p>
                    {delivery.paymentMethod === 'cash' && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">COD</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 truncate">{delivery.address}, {delivery.area}</p>
                  <p className="text-xs text-gray-400">{delivery.orderNumber} · {delivery.date} {delivery.time}</p>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                  {delivery.paymentMethod === 'cash' && delivery.codAmount && (
                    <span className="text-xs font-bold text-gray-700">KWD {delivery.codAmount.toFixed(3)}</span>
                  )}
                  <ChevronRight size={14} className="text-gray-300" />
                </div>
              </div>
            </Link>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No deliveries found</div>
        )}
      </div>
    </div>
  )
}
