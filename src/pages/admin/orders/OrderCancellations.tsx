import { useState } from 'react'
import { Search, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_CANCELLATIONS as MOCK } from '@/mock/mock.orders'
import { useTranslation } from 'react-i18next'

export default function OrderCancellations() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'pending' | 'all'>('pending')
  const [search, setSearch] = useState('')

  const filtered = MOCK.filter(o =>
    (tab === 'all' || o.status === 'pending') &&
    (!search || o.orderNumber.toLowerCase().includes(search.toLowerCase()) || o.customer.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.cancellations', 'Cancellations')}</h1>
          <p className="text-sm text-gray-500 mt-1">{MOCK.filter(o => o.status === 'pending').length} pending</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {[{ id: 'pending', label: 'Pending' }, { id: 'all', label: 'All' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as 'pending' | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Items', 'Reason', 'Requested By', 'Date', 'Refund', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><Link to={`/admin/orders/${order.id}`} className="text-sm font-bold text-sky-600">{order.orderNumber}</Link></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{order.customer}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.items}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{order.requestedBy}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{order.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${order.refundStatus === 'processed' ? 'bg-green-100 text-green-800' : order.refundStatus === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-600'}`}>
                      {order.refundStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link to={`/admin/orders/${order.id}`} className="flex items-center gap-1 px-2 py-1 text-xs text-sky-600 hover:bg-blue-50 rounded"><Eye size={12} />View</Link>
                      {order.refundStatus === 'pending' && (
                        <Link to={`/admin/orders/refunds/${order.id}`} className="px-2 py-1 text-xs text-amber-700 bg-amber-50 hover:bg-amber-100 rounded">Process Refund</Link>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">No cancellations</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
