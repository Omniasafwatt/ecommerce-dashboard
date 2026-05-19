import { useState } from 'react'
import { ArrowLeft, MapPin, Phone, Package, Navigation, CheckCircle, Truck, AlertCircle } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { MOCK_DELIVERY_DETAIL as MOCK } from '@/mock/mock.deliveries'

type DeliveryStatus = 'assigned' | 'picked_up' | 'arrived' | 'delivered' | 'failed'


const STATUS_STEPS: { status: DeliveryStatus; label: string; icon: React.ReactNode }[] = [
  { status: 'assigned', label: 'Assigned', icon: <Package size={16} /> },
  { status: 'picked_up', label: 'Picked Up', icon: <Truck size={16} /> },
  { status: 'arrived', label: 'Arrived', icon: <MapPin size={16} /> },
  { status: 'delivered', label: 'Delivered', icon: <CheckCircle size={16} /> },
]

const STATUS_ORDER: DeliveryStatus[] = ['assigned', 'picked_up', 'arrived', 'delivered']

const NEXT_ACTION: Partial<Record<DeliveryStatus, { label: string; nextStatus: DeliveryStatus; color: string }>> = {
  assigned: { label: 'Mark Picked Up', nextStatus: 'picked_up', color: 'bg-orange-500' },
  picked_up: { label: 'Mark Arrived', nextStatus: 'arrived', color: 'bg-purple-600' },
  arrived: { label: 'Mark Delivered', nextStatus: 'delivered', color: 'bg-green-600' },
}

export default function DriverDeliveryDetail() {
  useParams()
  const [delivery, setDelivery] = useState(MOCK)
  const [showFail, setShowFail] = useState(false)
  const [failReason, setFailReason] = useState('')
  const [trackingActive, setTrackingActive] = useState(false)

  const advance = () => {
    const next = NEXT_ACTION[delivery.status]
    if (next) {
      setDelivery(prev => ({ ...prev, status: next.nextStatus }))
      if (next.nextStatus === 'delivered') setTrackingActive(false)
    }
  }

  const handleFail = () => {
    setDelivery(prev => ({ ...prev, status: 'failed' }))
    setShowFail(false)
    setTrackingActive(false)
  }

  const currentStep = STATUS_ORDER.indexOf(delivery.status)
  const nextAction = NEXT_ACTION[delivery.status]
  const isDone = delivery.status === 'delivered' || delivery.status === 'failed'

  const mapsUrl = `https://maps.google.com/?q=${delivery.address.coordinates.lat},${delivery.address.coordinates.lng}`
  const appleMapsUrl = `https://maps.apple.com/?daddr=${delivery.address.coordinates.lat},${delivery.address.coordinates.lng}`

  return (
    <div className="max-w-md mx-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 z-10">
        <Link to="/driver/deliveries" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{delivery.orderNumber}</p>
          <p className="text-xs text-gray-500 capitalize">{delivery.status.replace('_', ' ')}</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* COD Banner */}
        {delivery.paymentMethod === 'cash' && !isDone && (
          <div className="bg-green-600 rounded-2xl p-5 text-white text-center shadow-lg">
            <p className="text-sm text-green-100 mb-1">Collect Cash on Delivery</p>
            <p className="text-4xl font-bold tracking-tight">KWD {delivery.codAmount.toFixed(3)}</p>
          </div>
        )}

        {/* Status stepper */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            {STATUS_STEPS.map((step, i) => {
              const done = i < currentStep || delivery.status === 'delivered'
              const active = i === currentStep && !isDone
              return (
                <div key={step.status} className="flex-1 flex flex-col items-center gap-1">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 ${done ? 'bg-green-500 border-green-500 text-white' : active ? 'bg-sky-500 border-blue-600 text-white' : 'bg-gray-100 border-gray-200 text-gray-400'}`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs text-center ${active ? 'font-semibold text-sky-600' : done ? 'text-green-600' : 'text-gray-400'}`}>{step.label}</p>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={`absolute top-4 left-1/2 w-full h-0.5 ${done ? 'bg-green-400' : 'bg-gray-200'}`} style={{ display: 'none' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Customer */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Customer</p>
          <p className="text-base font-semibold text-gray-900 mb-1">{delivery.customer.name}</p>
          <a href={`tel:${delivery.customer.phone}`} className="flex items-center gap-2 p-3 bg-green-50 rounded-xl text-green-700 font-medium">
            <Phone size={18} className="flex-shrink-0" />
            <span>{delivery.customer.phone}</span>
          </a>
        </div>

        {/* Address + maps */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Delivery Address</p>
          <div className="flex items-start gap-2 mb-3">
            <MapPin size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-gray-900">{delivery.address.line1}</p>
              <p className="text-sm text-gray-500">{delivery.address.area}, {delivery.address.governorate}</p>
            </div>
          </div>
          {delivery.notes && <p className="text-xs text-gray-500 italic mb-3">Note: {delivery.notes}</p>}
          <div className="grid grid-cols-2 gap-2">
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-sky-500 text-white rounded-xl text-sm font-medium">
              <Navigation size={15} />Google Maps
            </a>
            <a href={appleMapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 bg-gray-900 text-white rounded-xl text-sm font-medium">
              <Navigation size={15} />Apple Maps
            </a>
          </div>
        </div>

        {/* Items */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Items</p>
          <div className="space-y-2">
            {delivery.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.variant}</p>
                </div>
                <span className="text-sm font-bold text-gray-700">× {item.qty}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Store info */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pickup Store</p>
          <p className="text-sm font-medium text-gray-900">{delivery.store.name}</p>
          <p className="text-sm text-gray-500 mb-2">{delivery.store.address}</p>
          <a href={`tel:${delivery.store.phone}`} className="flex items-center gap-1.5 text-sm text-sky-600">
            <Phone size={13} />{delivery.store.phone}
          </a>
        </div>

        {/* GPS tracking */}
        {!isDone && (
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">GPS Tracking</p>
                <p className="text-xs text-gray-500">{trackingActive ? 'Live location sharing active' : 'Location sharing off'}</p>
              </div>
              <button onClick={() => setTrackingActive(!trackingActive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${trackingActive ? 'bg-red-100 text-red-700' : 'bg-sky-500 text-white'}`}>
                {trackingActive ? 'Stop' : 'Start Tracking'}
              </button>
            </div>
            {trackingActive && (
              <div className="mt-2 flex items-center gap-1.5 text-xs text-green-600">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Sharing location with customer and store
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {!isDone && (
          <div className="space-y-3">
            {nextAction && (
              <button onClick={advance} className={`w-full py-4 rounded-2xl text-white text-base font-bold shadow-lg ${nextAction.color}`}>
                {nextAction.label}
              </button>
            )}
            {delivery.status !== 'delivered' && (
              <button onClick={() => setShowFail(true)} className="w-full py-3 rounded-2xl border-2 border-red-200 text-red-600 text-sm font-semibold">
                Report Failed Delivery
              </button>
            )}
          </div>
        )}

        {delivery.status === 'delivered' && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
            <p className="text-sm font-medium text-green-800">Delivery completed successfully!</p>
          </div>
        )}
        {delivery.status === 'failed' && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <p className="text-sm font-medium text-red-800">Delivery marked as failed.</p>
          </div>
        )}
      </div>

      {/* Fail modal */}
      {showFail && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Report Failed Delivery</h3>
            <div className="space-y-2 mb-4">
              {['Customer not reachable', 'Wrong address', 'Customer refused', 'Access denied', 'Other'].map(r => (
                <label key={r} className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer ${failReason === r ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}>
                  <input type="radio" value={r} checked={failReason === r} onChange={() => setFailReason(r)} className="sr-only" />
                  <span className="text-sm text-gray-700">{r}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowFail(false)} className="flex-1 py-3 border border-gray-300 rounded-xl text-sm">Cancel</button>
              <button onClick={handleFail} disabled={!failReason} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold disabled:opacity-50">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
