import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Info } from 'lucide-react'
import { MOCK_DELIVERY_RULES as MOCK } from '@/mock/mock.operations'
import { useTranslation } from 'react-i18next'

type RuleType = 'global' | 'governorate' | 'area' | 'store'

interface DeliveryRule {
  id: number
  name: string
  type: RuleType
  target?: string
  fee: number
  isFree: boolean
  freeThreshold?: number
  status: 'active' | 'inactive'
}

const TYPE_COLORS: Record<RuleType, string> = {
  global: 'bg-purple-100 text-purple-800', governorate: 'bg-blue-100 text-blue-800',
  area: 'bg-cyan-100 text-cyan-800', store: 'bg-orange-100 text-orange-800',
}


interface FormData { name: string; type: RuleType; target: string; fee: string; isFree: boolean; freeThreshold: string; status: 'active' | 'inactive' }

export default function DeliveryRules() {
  const { t } = useTranslation()
  const [items, setItems] = useState<DeliveryRule[]>(MOCK)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<DeliveryRule | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>({ name: '', type: 'global', target: '', fee: '', isFree: false, freeThreshold: '', status: 'active' })

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', type: 'global', target: '', fee: '1.000', isFree: false, freeThreshold: '', status: 'active' })
    setModalOpen(true)
  }

  const openEdit = (item: DeliveryRule) => {
    setEditing(item)
    setForm({ name: item.name, type: item.type, target: item.target || '', fee: String(item.fee), isFree: item.isFree, freeThreshold: String(item.freeThreshold || ''), status: item.status })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name) return
    const newRule: DeliveryRule = {
      id: editing?.id || Date.now(),
      name: form.name, type: form.type, target: form.target || undefined,
      fee: form.isFree ? 0 : parseFloat(form.fee) || 0,
      isFree: form.isFree,
      freeThreshold: form.isFree && form.freeThreshold ? parseFloat(form.freeThreshold) : undefined,
      status: form.status,
    }
    if (editing) setItems(prev => prev.map(i => i.id === editing.id ? newRule : i))
    else setItems(prev => [...prev, newRule])
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.deliveryRules', 'Delivery Fee Rules')}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage delivery fee tiers</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Plus size={16} />Add Rule
        </button>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl mb-5">
        <Info size={16} className="text-sky-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-blue-800"><strong>Important:</strong> The system automatically applies the <strong>lowest matching fee</strong> for each order. More specific rules (store, area) take precedence over general rules (governorate, global).</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Rule Name', 'Type', 'Target', 'Fee', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type]}`}>{item.type}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.target || '—'}</td>
                  <td className="px-4 py-3">
                    {item.isFree ? (
                      <div>
                        <span className="text-green-700 font-semibold text-sm">FREE</span>
                        {item.freeThreshold && <span className="text-xs text-gray-500 ml-1">(orders &gt; KWD {item.freeThreshold.toFixed(3)})</span>}
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-gray-900">KWD {item.fee.toFixed(3)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${item.status === 'active' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Delivery Rule' : 'Add Delivery Rule'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as RuleType, target: '' }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    <option value="global">Global</option>
                    <option value="governorate">Governorate</option>
                    <option value="area">Area</option>
                    <option value="store">Store</option>
                  </select>
                </div>
                {form.type !== 'global' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                    <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder={`${form.type} name`} />
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Free Delivery</p>
                  <p className="text-xs text-gray-500">No charge for delivery</p>
                </div>
                <button onClick={() => setForm(f => ({ ...f, isFree: !f.isFree }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isFree ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.isFree ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {!form.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Fee (KWD)</label>
                  <input type="number" step="0.001" value={form.fee} onChange={e => setForm(f => ({ ...f, fee: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="0.000" />
                </div>
              )}
              {form.isFree && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min Order for Free Delivery (KWD, optional)</label>
                  <input type="number" step="0.001" value={form.freeThreshold} onChange={e => setForm(f => ({ ...f, freeThreshold: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="Leave empty for always free" />
                </div>
              )}
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">Save Rule</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Delete Delivery Rule?</h3>
            <p className="text-sm text-gray-500 mb-5">Orders may fall back to the global rule.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={() => { setItems(prev => prev.filter(i => i.id !== deleteId)); setDeleteId(null) }} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
