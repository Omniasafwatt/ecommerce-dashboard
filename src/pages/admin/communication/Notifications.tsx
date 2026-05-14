import { useState } from 'react'
import { Bell, Plus, Send, Trash2, Users, User, Store, Truck } from 'lucide-react'
import { MOCK_NOTIFICATIONS as MOCK_TEMPLATES } from '@/mock/mock.notifications'

type TargetAudience = 'all' | 'customers' | 'store_managers' | 'drivers'
type NotifType = 'push' | 'sms' | 'in_app'

interface NotifTemplate {
  id: number
  title: string
  body: string
  audience: TargetAudience
  type: NotifType
  sentAt?: string
  sentCount?: number
}


const AUDIENCE_ICONS: Record<TargetAudience, React.ReactNode> = {
  all: <Users size={14} />,
  customers: <User size={14} />,
  store_managers: <Store size={14} />,
  drivers: <Truck size={14} />,
}

const AUDIENCE_LABELS: Record<TargetAudience, string> = {
  all: 'All Users',
  customers: 'Customers',
  store_managers: 'Store Managers',
  drivers: 'Drivers',
}

const TYPE_STYLES: Record<NotifType, string> = {
  push: 'bg-blue-100 text-blue-700',
  sms: 'bg-green-100 text-green-700',
  in_app: 'bg-purple-100 text-purple-700',
}

export default function Notifications() {
  const [templates, setTemplates] = useState<NotifTemplate[]>(MOCK_TEMPLATES)
  const [showComposer, setShowComposer] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [audience, setAudience] = useState<TargetAudience>('all')
  const [notifType, setNotifType] = useState<NotifType>('push')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!title || !body) return
    setSending(true)
    setTimeout(() => {
      const newNotif: NotifTemplate = {
        id: Date.now(), title, body, audience, type: notifType,
        sentAt: new Date().toISOString().slice(0, 16).replace('T', ' '), sentCount: Math.floor(Math.random() * 500) + 10,
      }
      setTemplates(prev => [newNotif, ...prev])
      setSending(false)
      setSent(true)
      setTitle('')
      setBody('')
      setTimeout(() => { setSent(false); setShowComposer(false) }, 2000)
    }, 1000)
  }

  const handleDelete = (id: number) => {
    setTemplates(prev => prev.filter(t => t.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-sm text-gray-500 mt-1">Manage push notifications and announcements</p>
        </div>
        <button onClick={() => setShowComposer(!showComposer)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} />Send Notification
        </button>
      </div>

      {showComposer && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><Bell size={16} />Compose Notification</h3>
          {sent && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800 mb-4">
              Notification sent successfully!
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Notification title..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={notifType} onChange={e => setNotifType(e.target.value as NotifType)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="push">Push Notification</option>
                <option value="in_app">In-App Notification</option>
                <option value="sms">SMS</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Message Body *</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={3} placeholder="Message body... Use {{order_id}}, {{area}} for variables." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Target Audience</label>
            <div className="flex gap-3 flex-wrap">
              {(Object.entries(AUDIENCE_LABELS) as [TargetAudience, string][]).map(([val, label]) => (
                <label key={val} className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 cursor-pointer text-sm font-medium transition-all ${audience === val ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <input type="radio" value={val} checked={audience === val} onChange={() => setAudience(val)} className="sr-only" />
                  {AUDIENCE_ICONS[val]}{label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowComposer(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
            <button onClick={handleSend} disabled={!title || !body || sending} className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">
              <Send size={14} />{sending ? 'Sending...' : 'Send Now'}
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Notification History</h3>
          <p className="text-xs text-gray-500 mt-0.5">{templates.length} notifications sent</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Title', 'Audience', 'Type', 'Body', 'Sent Count', 'Sent At', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {templates.map(t => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{t.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      {AUDIENCE_ICONS[t.audience]}{AUDIENCE_LABELS[t.audience]}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[t.type]}`}>{t.type.replace('_', ' ')}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{t.body}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{t.sentCount?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{t.sentAt}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => handleDelete(t.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
