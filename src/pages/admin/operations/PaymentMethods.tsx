import { useState } from 'react'
import { CreditCard, Banknote, Plus, Pencil, Trash2, X, CheckCircle, XCircle } from 'lucide-react'
import { MOCK_PAYMENT_RULES as MOCK_RULES } from '@/mock/mock.operations'
import { useTranslation } from 'react-i18next'

type PaymentMethod = 'tap' | 'cod'
type RuleType = 'global' | 'governorate' | 'area' | 'store' | 'order_value'

interface PaymentRule {
  id: number
  method: PaymentMethod
  type: RuleType
  target?: string
  isEnabled: boolean
  minOrderValue?: number
  maxOrderValue?: number
  status: 'active' | 'inactive'
}


interface FormData { method: PaymentMethod; type: RuleType; target: string; isEnabled: boolean; minOrderValue: string; maxOrderValue: string; status: 'active' | 'inactive' }

export default function PaymentMethods() {
  const { t } = useTranslation()
  const [rules, setRules] = useState<PaymentRule[]>(MOCK_RULES)
  const [tapEnabled, setTapEnabled] = useState(true)
  const [codEnabled, setCodEnabled] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PaymentRule | null>(null)
  const [form, setForm] = useState<FormData>({ method: 'tap', type: 'global', target: '', isEnabled: true, minOrderValue: '', maxOrderValue: '', status: 'active' })

  const openCreate = () => {
    setEditing(null)
    setForm({ method: 'tap', type: 'global', target: '', isEnabled: true, minOrderValue: '', maxOrderValue: '', status: 'active' })
    setModalOpen(true)
  }

  const handleSave = () => {
    const newRule: PaymentRule = {
      id: editing?.id || Date.now(),
      method: form.method, type: form.type, target: form.target || undefined,
      isEnabled: form.isEnabled,
      minOrderValue: form.minOrderValue ? parseFloat(form.minOrderValue) : undefined,
      maxOrderValue: form.maxOrderValue ? parseFloat(form.maxOrderValue) : undefined,
      status: form.status,
    }
    if (editing) setRules(prev => prev.map(r => r.id === editing.id ? newRule : r))
    else setRules(prev => [...prev, newRule])
    setModalOpen(false)
  }

  const tapRules = rules.filter(r => r.method === 'tap')
  const codRules = rules.filter(r => r.method === 'cod')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.paymentMethods', 'Payment Methods')}</h1>
          <p className="text-sm text-gray-500 mt-1">Control payment availability</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Plus size={16} />Add Rule
        </button>
      </div>

      {/* Method cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {[
          { method: 'tap' as PaymentMethod, label: 'Tap Payments', desc: 'Online card payments via Tap gateway', icon: CreditCard, color: 'bg-sky-500', enabled: tapEnabled, setEnabled: setTapEnabled, rules: tapRules },
          { method: 'cod' as PaymentMethod, label: 'Cash on Delivery', desc: 'Pay with cash upon delivery', icon: Banknote, color: 'bg-emerald-500', enabled: codEnabled, setEnabled: setCodEnabled, rules: codRules },
        ].map(({ method, label, desc, icon: Icon, color, enabled, setEnabled, rules: methodRules }) => (
          <div key={method} className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {enabled ? <CheckCircle size={16} className="text-green-500" /> : <XCircle size={16} className="text-red-400" />}
                <button onClick={() => setEnabled(!enabled)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              <span className="font-medium">{methodRules.filter(r => r.status === 'active').length}</span> active restriction rules
            </div>
          </div>
        ))}
      </div>

      {/* Rules table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Restriction Rules</h3>
          <p className="text-xs text-gray-500 mt-0.5">Define where/when payment methods are available</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Method', 'Rule Type', 'Target', 'Order Value', 'Allow?', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rules.map(rule => (
                <tr key={rule.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${rule.method === 'tap' ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {rule.method === 'tap' ? <CreditCard size={10} /> : <Banknote size={10} />}
                      {rule.method === 'tap' ? 'Tap' : 'COD'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{rule.type.replace('_', ' ')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{rule.target || '—'}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {rule.minOrderValue && <span>Min: KWD {rule.minOrderValue.toFixed(3)}</span>}
                    {rule.maxOrderValue && <span className="ml-1">Max: KWD {rule.maxOrderValue.toFixed(3)}</span>}
                    {!rule.minOrderValue && !rule.maxOrderValue && '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold ${rule.isEnabled ? 'text-green-700' : 'text-red-600'}`}>
                      {rule.isEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setRules(prev => prev.map(r => r.id === rule.id ? { ...r, status: r.status === 'active' ? 'inactive' : 'active' } : r))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${rule.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${rule.status === 'active' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(rule); setForm({ method: rule.method, type: rule.type, target: rule.target || '', isEnabled: rule.isEnabled, minOrderValue: String(rule.minOrderValue || ''), maxOrderValue: String(rule.maxOrderValue || ''), status: rule.status }); setModalOpen(true) }} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setRules(prev => prev.filter(r => r.id !== rule.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Payment Rule' : 'Add Payment Rule'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value as PaymentMethod }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    <option value="tap">Tap Payments</option>
                    <option value="cod">Cash on Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as RuleType, target: '' }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    <option value="global">Global</option>
                    <option value="governorate">Governorate</option>
                    <option value="area">Area</option>
                    <option value="store">Store</option>
                    <option value="order_value">Order Value</option>
                  </select>
                </div>
              </div>
              {form.type !== 'global' && form.type !== 'order_value' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                </div>
              )}
              {form.type === 'order_value' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Order (KWD)</label>
                    <input type="number" step="0.001" value={form.minOrderValue} onChange={e => setForm(f => ({ ...f, minOrderValue: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Order (KWD)</label>
                    <input type="number" step="0.001" value={form.maxOrderValue} onChange={e => setForm(f => ({ ...f, maxOrderValue: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Enable this method</span>
                <button onClick={() => setForm(f => ({ ...f, isEnabled: !f.isEnabled }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isEnabled ? 'bg-green-500' : 'bg-red-400'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
