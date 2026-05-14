import { useState } from 'react'
import { Search, Eye, CheckCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { MOCK_REFUNDS as MOCK } from '@/mock/mock.orders'

interface RefundRequest {
  id: number
  orderNumber: string
  customer: string
  amount: number
  reason: string
  status: 'pending' | 'approved' | 'rejected'
  date: string
}


const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

export default function Refunds() {
  const [items, setItems] = useState<RefundRequest[]>(MOCK)
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: 'approve' | 'reject' } | null>(null)

  const filtered = items.filter(i =>
    (!filterStatus || i.status === filterStatus) &&
    (!search || i.orderNumber.toLowerCase().includes(search.toLowerCase()) || i.customer.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAction = (id: number, action: 'approve' | 'reject') => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: action === 'approve' ? 'approved' : 'rejected' } : i))
    setConfirmAction(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Refund Requests</h1>
          <p className="text-sm text-gray-500 mt-1">{items.filter(i => i.status === 'pending').length} pending reviews</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search refunds..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Order #', 'Customer', 'Amount', 'Reason', 'Date', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3"><Link to={`/admin/orders/${item.id}`} className="text-sm font-bold text-blue-600">{item.orderNumber}</Link></td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.customer}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">KWD {item.amount.toFixed(3)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.reason}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.date}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status]}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Link to={`/admin/orders/refunds/${item.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Eye size={14} /></Link>
                      {item.status === 'pending' && (
                        <>
                          <button onClick={() => setConfirmAction({ id: item.id, action: 'approve' })} className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg"><CheckCircle size={14} /></button>
                          <button onClick={() => setConfirmAction({ id: item.id, action: 'reject' })} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><XCircle size={14} /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-gray-500">No refund requests</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${confirmAction.action === 'approve' ? 'bg-green-100' : 'bg-red-100'}`}>
              {confirmAction.action === 'approve' ? <CheckCircle size={20} className="text-green-600" /> : <XCircle size={20} className="text-red-600" />}
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{confirmAction.action === 'approve' ? 'Approve Refund?' : 'Reject Refund?'}</h3>
            <p className="text-sm text-gray-500 mb-5">{confirmAction.action === 'approve' ? 'The customer will receive their refund.' : 'The refund request will be denied.'}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmAction(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => handleAction(confirmAction.id, confirmAction.action)}
                className={`flex-1 px-4 py-2 text-white rounded-lg text-sm ${confirmAction.action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                {confirmAction.action === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
