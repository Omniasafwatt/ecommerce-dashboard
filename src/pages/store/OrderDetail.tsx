import { useState } from 'react'
import { ArrowLeft, MapPin, Phone, Package, User, CheckCircle, XCircle, Truck } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_STORE_ORDER_DETAIL as MOCK_ORDER } from '@/mock/mock.store.orders'

type OrderStatus = 'new' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected'


const STATUS_LABELS: Record<OrderStatus, string> = {
  new: 'New', accepted: 'Accepted', preparing: 'Preparing',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', rejected: 'Rejected',
}
const STATUS_COLORS: Record<OrderStatus, string> = {
  new: 'bg-blue-100 text-blue-800', accepted: 'bg-yellow-100 text-yellow-800',
  preparing: 'bg-orange-100 text-orange-800', out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800',
}

const NEXT_STATUS: Partial<Record<OrderStatus, { status: OrderStatus; label: string; color: string }>> = {
  new: { status: 'accepted', label: 'Accept Order', color: 'bg-green-600 hover:bg-green-700' },
  accepted: { status: 'preparing', label: 'Start Preparing', color: 'bg-orange-500 hover:bg-orange-600' },
  preparing: { status: 'out_for_delivery', label: 'Dispatch for Delivery', color: 'bg-purple-600 hover:bg-purple-700' },
  out_for_delivery: { status: 'delivered', label: 'Mark Delivered', color: 'bg-green-600 hover:bg-green-700' },
}

export default function StoreOrderDetail() {
  useParams()
  const [order, setOrder] = useState(MOCK_ORDER)
  const [selectedDriver, setSelectedDriver] = useState('')
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [rejectNote, setRejectNote] = useState('')

  const advance = () => {
    const next = NEXT_STATUS[order.status]
    if (next) setOrder(prev => ({ ...prev, status: next.status }))
  }

  const handleReject = () => {
    setOrder(prev => ({ ...prev, status: 'rejected' }))
    setShowRejectModal(false)
  }

  const nextAction = NEXT_STATUS[order.status]

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/store/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{order.deliveryType} · {order.paymentMethod}</p>
        </div>
        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Package size={16} />Items to Prepare</h3>
            <div className="space-y-3">
              {order.items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.variant}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">× {item.qty}</p>
                    <p className="text-xs text-gray-500">KWD {(item.price * item.qty).toFixed(3)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500"><span>Delivery fee</span><span>KWD {order.deliveryFee.toFixed(3)}</span></div>
              {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-KWD {order.discount.toFixed(3)}</span></div>}
              {order.walletUsed > 0 && <div className="flex justify-between text-purple-600"><span>Wallet</span><span>-KWD {order.walletUsed.toFixed(3)}</span></div>}
              <div className="flex justify-between font-bold text-gray-900 pt-1 border-t border-gray-100"><span>Total</span><span>KWD {order.total.toFixed(3)}</span></div>
            </div>
          </div>

          {/* Driver assignment */}
          {(order.status === 'preparing' || order.status === 'accepted') && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2"><Truck size={16} />Assign Driver</h3>
              <div className="space-y-2">
                {order.drivers.map(driver => (
                  <label key={driver.id} className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer ${selectedDriver === String(driver.id) ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} ${!driver.available ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" value={String(driver.id)} checked={selectedDriver === String(driver.id)} onChange={() => driver.available && setSelectedDriver(String(driver.id))} disabled={!driver.available} className="sr-only" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{driver.name}</p>
                        <p className="text-xs text-gray-500">{driver.phone}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${driver.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{driver.available ? 'Available' : 'Busy'}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Actions</h3>
            <div className="flex gap-3 flex-wrap">
              {nextAction && (
                <button onClick={advance} className={`flex items-center gap-2 px-5 py-2.5 text-white rounded-lg text-sm font-medium ${nextAction.color}`}>
                  <CheckCircle size={15} />{nextAction.label}
                </button>
              )}
              {order.status === 'new' && (
                <button onClick={() => setShowRejectModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  <XCircle size={15} />Reject Order
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><User size={14} />Customer</h4>
            <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
            <a href={`tel:${order.customer.phone}`} className="flex items-center gap-1.5 text-sm text-blue-600 mt-1 hover:underline">
              <Phone size={13} />{order.customer.phone}
            </a>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><MapPin size={14} />Delivery Address</h4>
            <p className="text-sm text-gray-800">{order.address.line1}</p>
            <p className="text-sm text-gray-500">{order.address.area}, {order.address.governorate}</p>
            {order.notes && <p className="text-xs text-gray-400 mt-2 italic">Note: {order.notes}</p>}
            <a href={`https://maps.google.com/?q=${order.coordinates.lat},${order.coordinates.lng}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline">
              <MapPin size={12} />Open in Maps
            </a>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Status Timeline</h4>
            <div className="space-y-3">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="capitalize font-medium text-gray-700">{STATUS_LABELS[h.status as OrderStatus]}</p>
                    <p className="text-xs text-gray-400">{h.time} · {h.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reject modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
            <div className="p-5 border-b"><h3 className="font-semibold text-gray-900">Reject Order</h3></div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
                <div className="space-y-2">
                  {['Damaged item', 'Item unavailable', 'Store issue', 'Other'].map(r => (
                    <label key={r} className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer ${rejectReason === r ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                      <input type="radio" value={r} checked={rejectReason === r} onChange={() => setRejectReason(r)} className="sr-only" />
                      <span className="text-sm text-gray-700">{r}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes</label>
                <textarea value={rejectNote} onChange={e => setRejectNote(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setShowRejectModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={handleReject} disabled={!rejectReason} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
