import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Mail, Phone, Shield, Store, Calendar, Activity } from 'lucide-react'

export default function UserDetail() {
  const { id } = useParams()
  const [editing, setEditing] = useState(false)

  const user = {
    id, name: 'Ahmed Manager', email: 'ahmed@store.com', phone: '+965 2345 6789',
    role: 'store_manager', store: 'Mobile2000 - Salmiya', status: 'active',
    createdAt: '2024-01-15', lastLogin: '2025-05-10 08:30',
    permissions: ['view_orders', 'accept_orders', 'reject_orders', 'assign_driver'],
  }

  if (editing) {
    return (
      <div className="p-4 bg-blue-50 rounded-xl text-sm text-blue-800">
        Edit mode (form placeholder) — <button onClick={() => setEditing(false)} className="underline">Cancel</button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/users" className="p-2 rounded-lg hover:bg-gray-100 transition-colors"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
          <p className="text-sm text-gray-500">User Profile</p>
        </div>
        <button onClick={() => setEditing(true)} className="ml-auto flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Pencil size={14} /> Edit User
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 text-3xl font-bold mx-auto mb-4">
            {user.name[0]}
          </div>
          <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-2">
            Store Manager
          </span>
          <div className="mt-4 space-y-2 text-left">
            <div className="flex items-center gap-2 text-sm text-gray-600"><Mail size={14} className="text-gray-400" />{user.email}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Phone size={14} className="text-gray-400" />{user.phone}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Store size={14} className="text-gray-400" />{user.store}</div>
            <div className="flex items-center gap-2 text-sm text-gray-600"><Calendar size={14} className="text-gray-400" />Joined {user.createdAt}</div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              <span className={`w-2 h-2 rounded-full mr-1.5 ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-400'}`} />
              {user.status}
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Activity size={16} />Account Activity</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Last Login</p>
                <p className="text-sm font-semibold text-gray-900">{user.lastLogin}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Account Created</p>
                <p className="text-sm font-semibold text-gray-900">{user.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield size={16} />Permissions</h3>
            <div className="flex flex-wrap gap-2">
              {user.permissions.map(p => (
                <span key={p} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">{p.replace(/_/g, ' ')}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
