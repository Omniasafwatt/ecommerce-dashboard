import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MOCK_PRICING_RULES as MOCK } from '@/mock/mock.operations'

type RuleType = 'global' | 'store' | 'governorate' | 'area' | 'product' | 'variant'

interface PricingRule {
  id: number
  name: string
  type: RuleType
  target?: string
  discountType: 'percentage' | 'fixed' | 'override'
  discountValue: number
  priority: number
  validFrom?: string
  validTo?: string
  status: 'active' | 'inactive'
}

const TYPE_LABELS: Record<RuleType, string> = {
  global: 'Global', store: 'Store', governorate: 'Governorate', area: 'Area', product: 'Product', variant: 'Variant',
}

const TYPE_COLORS: Record<RuleType, string> = {
  global: 'bg-purple-100 text-purple-800', store: 'bg-orange-100 text-orange-800',
  governorate: 'bg-blue-100 text-blue-800', area: 'bg-cyan-100 text-cyan-800',
  product: 'bg-emerald-100 text-emerald-800', variant: 'bg-teal-100 text-teal-800',
}


interface FormData { name: string; type: RuleType; target: string; discountType: 'percentage' | 'fixed' | 'override'; discountValue: string; priority: string; validFrom: string; validTo: string; status: 'active' | 'inactive' }

export default function Pricing() {
  const { t } = useTranslation()
  const [items, setItems] = useState<PricingRule[]>(MOCK)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PricingRule | null>(null)
  const [form, setForm] = useState<FormData>({ name: '', type: 'global', target: '', discountType: 'percentage', discountValue: '', priority: '10', validFrom: '', validTo: '', status: 'active' })

  const filtered = items.filter(i => !search || i.name.toLowerCase().includes(search.toLowerCase()))

  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', type: 'global', target: '', discountType: 'percentage', discountValue: '', priority: '10', validFrom: '', validTo: '', status: 'active' })
    setModalOpen(true)
  }

  const openEdit = (item: PricingRule) => {
    setEditing(item)
    setForm({ name: item.name, type: item.type, target: item.target || '', discountType: item.discountType, discountValue: String(item.discountValue), priority: String(item.priority), validFrom: item.validFrom || '', validTo: item.validTo || '', status: item.status })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.discountValue) return
    const newRule: PricingRule = {
      id: editing?.id || Date.now(),
      name: form.name, type: form.type, target: form.target || undefined,
      discountType: form.discountType, discountValue: parseFloat(form.discountValue),
      priority: parseInt(form.priority), validFrom: form.validFrom || undefined, validTo: form.validTo || undefined,
      status: form.status,
    }
    if (editing) setItems(prev => prev.map(i => i.id === editing.id ? newRule : i))
    else setItems(prev => [...prev, newRule])
    setModalOpen(false)
  }

  const formatDiscount = (rule: PricingRule) => {
    if (rule.discountType === 'percentage') return `${rule.discountValue}% off`
    if (rule.discountType === 'fixed') return `KWD ${rule.discountValue.toFixed(3)} off`
    return `KWD ${rule.discountValue.toFixed(3)} (override)`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('store.pricing.title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('operations.pricing.higherPriorityNote')}</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">
          <Plus size={16} />{t('store.pricing.addRule')}
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('operations.pricing.searchRules')} className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {[t('products.productName'), t('store.pricing.ruleType'), t('store.pricing.targetId'), t('store.pricing.discount'), t('store.pricing.priority'), t('operations.pricing.validUntil'), t('orders.status'), t('common.actions')].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.sort((a, b) => b.priority - a.priority).map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3"><span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${TYPE_COLORS[item.type]}`}>{TYPE_LABELS[item.type]}</span></td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.target || '—'}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{formatDiscount(item)}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 font-mono">{item.priority}</td>
                  <td className="px-4 py-3 text-xs text-gray-500">{item.validTo || 'No expiry'}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i))}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${item.status === 'active' ? 'translate-x-4.5' : 'translate-x-0.5'}`} />
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">No pricing rules</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Pricing Rule' : 'Add Pricing Rule'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rule Name *</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rule Type</label>
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as RuleType, target: '' }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    {(Object.entries(TYPE_LABELS) as [RuleType, string][]).map(([t, l]) => <option key={t} value={t}>{l}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input type="number" value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              {form.type !== 'global' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
                  <input value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder={`Enter ${TYPE_LABELS[form.type]} name`} />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as 'percentage' | 'fixed' | 'override' }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed Amount</option>
                    <option value="override">Price Override</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Value *</label>
                  <input type="number" step="0.001" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid From</label>
                  <input type="date" value={form.validFrom} onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Valid To</label>
                  <input type="date" value={form.validTo} onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                </div>
              </div>
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
