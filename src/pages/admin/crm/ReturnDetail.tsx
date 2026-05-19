import { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Package, User, Image as ImageIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_RETURN_DETAIL as request } from '@/mock/mock.returns'

export default function ReturnDetail() {
  useParams()
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [notes, setNotes] = useState('')
  const [done, setDone] = useState(false)


  const handleSubmit = () => { setDone(true) }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/returns" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{request.requestNumber}</h1>
          <p className="text-sm text-gray-500">{request.type === 'return' ? 'Return Request' : 'Replacement Request'}</p>
        </div>
        <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">{request.status}</span>
      </div>

      {done && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-800 font-medium">Request {action === 'approve' ? 'approved' : 'rejected'} successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package size={16} />Item Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500 mb-0.5">Product</p><p className="font-medium text-gray-900">{request.product}</p></div>
              <div><p className="text-gray-500 mb-0.5">Quantity</p><p className="font-medium text-gray-900">{request.quantity}</p></div>
              <div className="col-span-2"><p className="text-gray-500 mb-0.5">Reason</p><p className="text-gray-900">{request.reason}</p></div>
              <div className="col-span-2">
                <p className="text-gray-500 mb-0.5">24h Validation</p>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-green-700 text-xs rounded-lg border border-green-200">
                  <CheckCircle size={12} />{request.validationResult}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><ImageIcon size={16} />Customer Photos ({request.images.length})</h3>
            <div className="grid grid-cols-3 gap-3">
              {request.images.map((_, i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                  <ImageIcon size={24} className="text-gray-400" />
                  <span className="text-xs text-gray-400 ml-1">Photo {i + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Admin Action</h3>
            {!action ? (
              <div className="flex gap-3">
                <button onClick={() => setAction('approve')} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <CheckCircle size={16} />Approve {request.type === 'return' ? 'Return' : 'Replacement'}
                </button>
                <button onClick={() => setAction('reject')} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  <XCircle size={16} />Reject
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {action === 'approve' && request.type === 'return' && (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-medium mb-1">After approval:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>A return task will be assigned to the store</li>
                      <li>Driver will be dispatched to collect the item</li>
                      <li>Refund will be initiated automatically</li>
                    </ul>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{action === 'reject' ? 'Rejection Reason *' : 'Notes'}</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setAction(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
                  <button onClick={handleSubmit} disabled={action === 'reject' && !notes}
                    className={`px-4 py-2 text-white rounded-lg text-sm font-medium ${action === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700 disabled:opacity-50'}`}>
                    Confirm {action === 'approve' ? 'Approval' : 'Rejection'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><User size={14} />Customer</h4>
            <p className="text-sm font-medium text-gray-900">{request.customer.name}</p>
            <p className="text-sm text-gray-500">{request.customer.email}</p>
            <p className="text-sm text-gray-500">{request.customer.phone}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Order Reference</h4>
            <Link to={`/admin/orders/1`} className="text-sm text-sky-600 font-medium hover:underline">{request.orderNumber}</Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Status History</h4>
            {request.statusHistory.map((h, i) => (
              <div key={i} className="flex gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-yellow-400 mt-1.5 flex-shrink-0" />
                <div>
                  <p className="capitalize text-gray-700 font-medium">{h.status}</p>
                  <p className="text-xs text-gray-400">{h.time} · {h.by}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
