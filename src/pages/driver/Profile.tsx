import { useState } from 'react'
import { CheckCircle, Truck, Star, Phone, Mail, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MOCK_DRIVER } from '@/mock/mock.driver'


export default function DriverProfile() {
  const navigate = useNavigate()
  const [showLogout, setShowLogout] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')
  }

  const driver = MOCK_DRIVER

  const statCards = [
    { label: 'Total Deliveries', value: driver.stats.totalDeliveries, icon: <Truck size={18} className="text-sky-600" />, bg: 'bg-blue-50' },
    { label: 'Today', value: driver.stats.todayDeliveries, icon: <CheckCircle size={18} className="text-green-600" />, bg: 'bg-green-50' },
    { label: 'On-Time Rate', value: `${driver.stats.onTimeRate}%`, icon: <CheckCircle size={18} className="text-orange-600" />, bg: 'bg-orange-50' },
    { label: 'Avg Rating', value: driver.stats.avgRating, icon: <Star size={18} className="text-yellow-500" />, bg: 'bg-yellow-50' },
    { label: 'Completion', value: `${driver.stats.completionRate}%`, icon: <CheckCircle size={18} className="text-purple-600" />, bg: 'bg-purple-50' },
    { label: 'Failed', value: driver.stats.failedDeliveries, icon: <Truck size={18} className="text-red-500" />, bg: 'bg-red-50' },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-5 pb-24">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 mb-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold">
            {driver.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="text-lg font-bold">{driver.name}</h2>
            <p className="text-blue-100 text-sm">{driver.store}</p>
            <p className="text-blue-200 text-xs mt-0.5">Member since {driver.joinDate}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
            <Star size={13} className="text-yellow-300 fill-yellow-300" />
            <span className="text-sm font-semibold">{driver.stats.avgRating}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-lg">
            <CheckCircle size={13} className="text-green-300" />
            <span className="text-sm font-semibold">{driver.stats.completionRate}% completion</span>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {statCards.map(card => (
          <div key={card.label} className={`${card.bg} rounded-xl p-4 flex items-center gap-3`}>
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
              {card.icon}
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-500">{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact info */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Contact</p>
        <div className="flex items-center gap-3">
          <Phone size={16} className="text-gray-400" />
          <a href={`tel:${driver.phone}`} className="text-sm text-sky-600">{driver.phone}</a>
        </div>
        <div className="flex items-center gap-3">
          <Mail size={16} className="text-gray-400" />
          <p className="text-sm text-gray-700">{driver.email}</p>
        </div>
      </div>

      {/* Logout */}
      <button onClick={() => setShowLogout(true)} className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold">
        <LogOut size={16} />Sign Out
      </button>

      {showLogout && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 px-4 pb-6">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <LogOut size={20} className="text-red-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sign Out?</h3>
            <p className="text-sm text-gray-500 mb-5">You will need to log in again to access your deliveries.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogout(false)} className="flex-1 py-3 border border-gray-300 rounded-xl text-sm">Cancel</button>
              <button onClick={handleLogout} className="flex-1 py-3 bg-red-600 text-white rounded-xl text-sm font-semibold">Sign Out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
