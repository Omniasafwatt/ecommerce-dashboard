import { useState } from 'react'
import { Plus, Pencil, Trash2, X, Search, Copy } from 'lucide-react'
import { MOCK_PROMOTIONS as MOCK } from '@/mock/mock.operations'

type DiscountType = 'percentage' | 'fixed' | 'free_delivery' | 'item'

interface PromoCode {
  id: number
  code: string
  name: string
  discountType: DiscountType
  discountValue: number
  usageLimit?: number
  usedCount: number
  validFrom: string
  validTo: string
  status: 'active' | 'inactive'
}


const DISCOUNT_LABELS: Record<DiscountType, string> = {
  percentage: 'Percentage', fixed: 'Fixed Amount', free_delivery: 'Free Delivery', item: 'Item Level',
}

const DISCOUNT_COLORS: Record<DiscountType, string> = {
  percentage: 'bg-blue-100 text-blue-800', fixed: 'bg-emerald-100 text-emerald-800',
  free_delivery: 'bg-purple-100 text-purple-800', item: 'bg-orange-100 text-orange-800',
}

export default function Promotions() {
  const [items, setItems] = useState<PromoCode[]>(MOCK)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<PromoCode | null>(null)
  const [form, setForm] = useState({ code: '', name: '', discountType: 'percentage' as DiscountType, discountValue: '', usageLimit: '', validFrom: '', validTo: '', status: 'active' as 'active' | 'inactive' })
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filtered = items.filter(i => !search || i.code.toLowerCase().includes(search.toLowerCase()) || i.name.toLowerCase().includes(search.toLowerCase()))

  const copyCode = (code: string, id: number) => {
    navigator.clipboard.writeText(code)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1500)
  }

  const openCreate = () => {
    setEditing(null)
    setForm({ code: '', name: '', discountType: 'percentage', discountValue: '', usageLimit: '', validFrom: '', validTo: '', status: 'active' })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.code || !form.name) return
    const newPromo: PromoCode = {
      id: editing?.id || Date.now(),
      code: form.code.toUpperCase(),
      name: form.name,
      discountType: form.discountType,
      discountValue: parseFloat(form.discountValue) || 0,
      usageLimit: form.usageLimit ? parseInt(form.usageLimit) : undefined,
      usedCount: editing?.usedCount || 0,
      validFrom: form.validFrom,
      validTo: form.validTo,
      status: form.status,
    }
    if (editing) setItems(prev => prev.map(i => i.id === editing.id ? newPromo : i))
    else setItems(prev => [...prev, newPromo])
    setModalOpen(false)
  }

  const formatDiscount = (promo: PromoCode) => {
    if (promo.discountType === 'percentage') return `${promo.discountValue}%`
    if (promo.discountType === 'fixed') return `KWD ${promo.discountValue.toFixed(3)}`
    if (promo.discountType === 'free_delivery') return 'Free Delivery'
    return 'Item Level'
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Promotions & Coupons</h1>
          <p className="text-sm text-gray-500 mt-1">{items.filter(i => i.status === 'active').length} active promotions</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} />Add Promo Code
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search promo codes..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Code', 'Name', 'Discount', 'Usage', 'Valid Period', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono font-bold text-gray-800">{item.code}</code>
                      <button onClick={() => copyCode(item.code, item.id)} className="p-1 text-gray-400 hover:text-gray-600">
                        <Copy size={12} className={copiedId === item.id ? 'text-green-500' : ''} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{item.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${DISCOUNT_COLORS[item.discountType]}`}>{DISCOUNT_LABELS[item.discountType]}</span>
                      <span className="text-sm font-medium text-gray-900">{formatDiscount(item)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>{item.usedCount} used</span>
                        <span>{item.usageLimit ? `${item.usageLimit} limit` : '∞'}</span>
                      </div>
                      {item.usageLimit && (
                        <div className="w-24 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${Math.min(100, (item.usedCount / item.usageLimit) * 100)}%` }} />
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-500">{item.validFrom}</p>
                    <p className="text-xs text-gray-500">→ {item.validTo}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => { setEditing(item); setForm({ code: item.code, name: item.name, discountType: item.discountType, discountValue: String(item.discountValue), usageLimit: String(item.usageLimit || ''), validFrom: item.validFrom, validTo: item.validTo, status: item.status }); setModalOpen(true) }} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
                      <button onClick={() => setItems(prev => prev.filter(i => i.id !== item.id))} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
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
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Promo Code' : 'Add Promo Code'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="PROMO10" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value as DiscountType }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none">
                    {(Object.entries(DISCOUNT_LABELS) as [DiscountType, string][]).map(([t, l]) => <option key={t} value={t}>{l}</option>)}
                  </select>
                </div>
                {form.discountType !== 'free_delivery' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Value</label>
                    <input type="number" step="0.001" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Usage Limit (leave empty for unlimited)</label>
                <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none" placeholder="e.g. 100" />
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
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
