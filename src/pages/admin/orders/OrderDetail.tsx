import { useState } from 'react'
import { ArrowLeft, Package, Clock, User, MapPin, CreditCard, Truck, AlertTriangle, CheckCircle, XCircle, MessageSquare } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_ADMIN_ORDER_DETAIL as mockOrder } from '@/mock/mock.orders'

type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'rejected'

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800', accepted: 'bg-blue-100 text-blue-800',
  preparing: 'bg-indigo-100 text-indigo-800', out_for_delivery: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800', cancelled: 'bg-gray-100 text-gray-600',
  rejected: 'bg-red-100 text-red-800',
}


interface ConfirmModalProps { open: boolean; title: string; desc: string; onConfirm: () => void; onClose: () => void; danger?: boolean }

function ConfirmModal({ open, title, desc, onConfirm, onClose, danger }: ConfirmModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${danger ? 'bg-red-100' : 'bg-blue-100'}`}>
          <AlertTriangle size={20} className={danger ? 'text-red-600' : 'text-blue-600'} />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-5">{desc}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
          <button onClick={() => { onConfirm(); onClose() }} className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium ${danger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>Confirm</button>
        </div>
      </div>
    </div>
  )
}

export default function OrderDetail() {
  useParams()
  const [confirm, setConfirm] = useState<{ open: boolean; action: string }>({ open: false, action: '' })
  const order = mockOrder

  const handleAction = (action: string) => { setConfirm({ open: true, action }) }

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <Link to="/admin/orders" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500">{order.createdAt}</p>
        </div>
        <span className={`ml-2 inline-flex px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLORS[order.status]}`}>
          {order.status.replace(/_/g, ' ').toUpperCase()}
        </span>
        <div className="ml-auto flex gap-2">
          <button onClick={() => handleAction('cancel')} className="px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50">Cancel Order</button>
          <button onClick={() => handleAction('refund')} className="px-3 py-2 text-sm font-medium text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50">Approve Refund</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* LEFT — Items + Timeline */}
        <div className="lg:col-span-2 space-y-4">
          {order.storeOrders.map((so, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-gray-500" />
                  <span className="font-semibold text-sm text-gray-800">{so.storeName}</span>
                </div>
                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[so.status]}`}>{so.status.replace(/_/g, ' ')}</span>
              </div>
              <div className="divide-y divide-gray-100">
                {so.items.map(item => (
                  <div key={item.id} className="p-4 flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Package size={16} className="text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.nameEn}</p>
                        <p className="text-xs text-gray-500" dir="rtl">{item.nameAr}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × KWD {item.price.toFixed(3)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">KWD {item.total.toFixed(3)}</p>
                      <span className={`inline-flex mt-1 px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[item.status]}`}>{item.status.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Status Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Clock size={16} />Status Timeline</h3>
            <div className="relative">
              {order.statusHistory.map((h, i) => (
                <div key={i} className="flex gap-3 pb-4 last:pb-0">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-0.5 flex-shrink-0 ${i === order.statusHistory.length - 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
                    {i < order.statusHistory.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1" />}
                  </div>
                  <div className="pb-0">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${STATUS_COLORS[h.status]}`}>{h.status.replace(/_/g, ' ')}</span>
                    <p className="text-xs text-gray-500 mt-0.5">{h.time} · by {h.by}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Audit Trail</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Time', 'User', 'Action'].map(h => <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {order.auditTrail.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-3 py-2 text-xs text-gray-500 whitespace-nowrap">{a.time}</td>
                      <td className="px-3 py-2 text-xs text-gray-700">{a.user}</td>
                      <td className="px-3 py-2 text-xs text-gray-900">{a.action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT — Info cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><User size={14} />Customer</h4>
            <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
            <p className="text-sm text-gray-600">{order.customer.phone}</p>
            <p className="text-sm text-gray-500">{order.customer.email}</p>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><MapPin size={14} />Delivery Address</h4>
            <p className="text-sm text-gray-900">{order.address.street}</p>
            <p className="text-sm text-gray-600">{order.address.area}, {order.address.governorate}</p>
            <div className="mt-2 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
              <MapPin size={20} className="text-gray-400" />
              <span className="text-xs text-gray-400 ml-1">Map view</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><CreditCard size={14} />Payment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-500">Method</span><span className="font-medium uppercase">{order.paymentMethod}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="text-green-600 font-medium capitalize">{order.paymentStatus}</span></div>
              <div className="border-t pt-2 mt-2 space-y-1">
                <div className="flex justify-between text-gray-600"><span>Subtotal</span><span>KWD {order.subtotal.toFixed(3)}</span></div>
                <div className="flex justify-between text-gray-600"><span>Delivery</span><span>KWD {order.deliveryFee.toFixed(3)}</span></div>
                {order.discount > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-KWD {order.discount.toFixed(3)}</span></div>}
                {order.walletUsed > 0 && <div className="flex justify-between text-blue-600"><span>Wallet</span><span>-KWD {order.walletUsed.toFixed(3)}</span></div>}
                <div className="flex justify-between font-bold text-gray-900 border-t pt-1 mt-1"><span>Total</span><span>KWD {order.total.toFixed(3)}</span></div>
              </div>
            </div>
          </div>

          {order.driver && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h4 className="font-semibold text-sm text-gray-700 mb-3 flex items-center gap-2"><Truck size={14} />Driver</h4>
              <p className="text-sm font-medium text-gray-900">{order.driver.name}</p>
              <p className="text-sm text-gray-600">{order.driver.phone}</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Admin Actions</h4>
            <div className="space-y-2">
              <button onClick={() => handleAction('cancel')} className="w-full flex items-center gap-2 px-3 py-2 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50">
                <XCircle size={14} />Cancel Order
              </button>
              <button onClick={() => handleAction('refund')} className="w-full flex items-center gap-2 px-3 py-2 border border-amber-300 text-amber-700 rounded-lg text-sm hover:bg-amber-50">
                <CheckCircle size={14} />Approve Refund
              </button>
              <Link to="/admin/orders/reassignment" className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                <Package size={14} />Reassign Store
              </Link>
              <Link to="/admin/chat" className="w-full flex items-center gap-2 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50">
                <MessageSquare size={14} />View Chat
              </Link>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={confirm.open}
        title={confirm.action === 'cancel' ? 'Cancel Order?' : 'Approve Refund?'}
        desc={confirm.action === 'cancel' ? 'This will cancel all pending items in this order. A refund will be initiated if payment was made.' : 'This will process a full refund to the customer.'}
        danger={confirm.action === 'cancel'}
        onConfirm={() => console.log('Action confirmed:', confirm.action)}
        onClose={() => setConfirm({ open: false, action: '' })}
      />
    </div>
  )
}
