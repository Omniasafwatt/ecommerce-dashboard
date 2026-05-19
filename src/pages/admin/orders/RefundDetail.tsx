import { useState } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Wallet, CreditCard } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_REFUND_DETAIL_BASE } from '@/mock/mock.orders'
import { useTranslation } from 'react-i18next'

export default function RefundDetail() {
  const { t } = useTranslation()
  const { id } = useParams()
  const [action, setAction] = useState<'approve' | 'reject' | null>(null)
  const [refundMethod, setRefundMethod] = useState<'wallet' | 'original'>('original')
  const [partialAmount, setPartialAmount] = useState('')
  const [reason, setReason] = useState('')
  const [done, setDone] = useState(false)

  const refund = { id, ...MOCK_REFUND_DETAIL_BASE }

  const handleSubmit = () => {
    setDone(true)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/orders/refunds" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">{t('common.refundDetail', 'Refund Request')}</h1>
          <p className="text-sm text-gray-500">{refund.orderNumber}</p>
        </div>
        <span className="ml-2 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">{refund.status}</span>
      </div>

      {done && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-5">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm text-green-800 font-medium">Refund {action === 'approve' ? 'approved' : 'rejected'} successfully.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Refund Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Items subtotal</span><span>KWD {refund.itemsAmount.toFixed(3)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery fee</span><span>KWD {refund.deliveryFee.toFixed(3)}</span></div>
              <div className="flex justify-between text-sm text-sky-600"><span>Wallet credit used</span><span>-KWD {refund.walletPortion.toFixed(3)}</span></div>
              <div className="flex justify-between font-semibold text-gray-900 border-t pt-3 mt-1"><span>Total Refund Amount</span><span>KWD {refund.originalAmount.toFixed(3)}</span></div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Admin Decision</h3>

            {!action ? (
              <div className="flex gap-3">
                <button onClick={() => setAction('approve')} className="flex items-center gap-2 px-5 py-2.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                  <CheckCircle size={16} />Approve Refund
                </button>
                <button onClick={() => setAction('reject')} className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                  <XCircle size={16} />Reject Refund
                </button>
              </div>
            ) : action === 'approve' ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Refund Method</p>
                  <div className="flex gap-3">
                    <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer ${refundMethod === 'original' ? 'border-sky-500 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" value="original" checked={refundMethod === 'original'} onChange={() => setRefundMethod('original')} className="sr-only" />
                      <CreditCard size={16} className="text-sky-600" />
                      <span className="text-sm font-medium">Original Payment</span>
                    </label>
                    <label className={`flex items-center gap-2 px-4 py-3 rounded-lg border-2 cursor-pointer ${refundMethod === 'wallet' ? 'border-sky-500 bg-blue-50' : 'border-gray-200'}`}>
                      <input type="radio" value="wallet" checked={refundMethod === 'wallet'} onChange={() => setRefundMethod('wallet')} className="sr-only" />
                      <Wallet size={16} className="text-sky-600" />
                      <span className="text-sm font-medium">Wallet Credit</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Refund Amount (KWD) — leave empty for full amount</label>
                  <input type="number" step="0.001" value={partialAmount} onChange={e => setPartialAmount(e.target.value)} placeholder={refund.originalAmount.toFixed(3)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 max-w-xs" />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setAction(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
                  <button onClick={handleSubmit} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Confirm Approval</button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason *</label>
                  <textarea value={reason} onChange={e => setReason(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Explain why the refund is rejected..." />
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setAction(null)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Back</button>
                  <button onClick={handleSubmit} disabled={!reason} className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50">Confirm Rejection</button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Customer</h4>
            <p className="text-sm font-medium text-gray-900">{refund.customer}</p>
            <p className="text-sm text-gray-500">{refund.customerEmail}</p>
            <p className="text-sm text-gray-500">{refund.phone}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Refund Reason</h4>
            <p className="text-sm text-gray-700">{refund.reason}</p>
            <p className="text-xs text-gray-400 mt-2">Requested: {refund.requestedAt}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">Order</h4>
            <Link to={`/admin/orders/${refund.id}`} className="text-sm text-sky-600 font-medium hover:underline">{refund.orderNumber}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
