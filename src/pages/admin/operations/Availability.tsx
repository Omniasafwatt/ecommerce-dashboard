import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { MOCK_AVAILABILITY_RULES as MOCK } from '@/mock/mock.operations'
import { useTranslation } from 'react-i18next'

type AvailType = 'normal' | 'preorder' | 'delayed' | 'blocked'

interface Rule {
  id: number
  product: string
  variant?: string
  store: string
  type: AvailType
  delayHours?: number
  status: 'active' | 'inactive'
}

const TYPE_LABELS: Record<AvailType, string> = {
  normal: 'Normal Sale',
  preorder: 'Pre-order',
  delayed: 'Delayed (5-8h)',
  blocked: 'Blocked',
}

const TYPE_COLORS: Record<AvailType, string> = {
  normal: 'bg-green-100 text-green-800',
  preorder: 'bg-blue-100 text-blue-800',
  delayed: 'bg-amber-100 text-amber-800',
  blocked: 'bg-red-100 text-red-800',
}


interface FormData { product: string; variant: string; store: string; type: AvailType; delayHours: string; status: 'active' | 'inactive' }

export default function Availability() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Rule[]>(MOCK)
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Rule | null>(null)
  const [form, setForm] = useState<FormData>({ product: '', variant: '', store: '', type: 'normal', delayHours: '6', status: 'active' })

  const filtered = items.filter(i =>
    (!search || i.product.toLowerCase().includes(search.toLowerCase())) &&
    (!filterType || i.type === filterType)
  )

  const openCreate = () => { setEditing(null); setForm({ product: '', variant: '', store: '', type: 'normal', delayHours: '6', status: 'active' }); setModalOpen(true) }
  const openEdit = (item: Rule) => {
    setEditing(item)
    setForm({ product: item.product, variant: item.variant || '', store: item.store, type: item.type, delayHours: String(item.delayHours || 6), status: item.status })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.product || !form.store) return
    const newRule: Rule = {
      id: editing?.id || Date.now(),
      product: form.product,
      variant: form.variant || undefined,
      store: form.store,
      type: form.type,
      delayHours: form.type === 'delayed' ? parseInt(form.delayHours) : undefined,
      status: form.status,
    }
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? newRule : i))
    } else {
      setItems(prev => [...prev, newRule])
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.availability', 'Availability Control')}</h1>
          <p className="text-sm text-gray-500 mt-1">Set product availability rules per store</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Plus size={16} />Add Rule
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterType} onChange={e => setFilterType(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Types</option>
            {(Object.keys(TYPE_LABELS) as AvailType[]).map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Product', 'Variant', 'Store', 'Availability Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.product}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.variant || '—'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.store}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type]}`}>
                      {TYPE_LABELS[item.type]}{item.delayHours ? ` (${item.delayHours}h)` : ''}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500">No rules found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Availability Rule' : 'Add Availability Rule'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
                <input value={form.product} onChange={e => setForm(f => ({ ...f, product: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Product name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Variant (optional)</label>
                <input value={form.variant} onChange={e => setForm(f => ({ ...f, variant: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Variant name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Store *</label>
                <select value={form.store} onChange={e => setForm(f => ({ ...f, store: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select store</option>
                  {['All Stores', 'Mobile2000 - Salmiya', 'Mobile2000 - Sharq', 'Mobile2000 - Fahaheel'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.entries(TYPE_LABELS) as [AvailType, string][]).map(([type, label]) => (
                    <label key={type} className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${form.type === type ? 'border-sky-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" name="type" value={type} checked={form.type === type} onChange={() => setForm(f => ({ ...f, type }))} className="sr-only" />
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${form.type === type ? 'bg-sky-500' : 'bg-gray-300'}`} />
                      <span className="text-sm font-medium">{label}</span>
                    </label>
                  ))}
                </div>
              </div>
              {form.type === 'delayed' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delay Hours</label>
                  <input type="number" min="1" max="24" value={form.delayHours} onChange={e => setForm(f => ({ ...f, delayHours: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
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
    </div>
  )
}
