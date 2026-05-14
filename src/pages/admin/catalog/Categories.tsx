import { useState } from 'react'
import { Grid, Plus, Pencil, Trash2, X, Search, ChevronRight } from 'lucide-react'
import type { Category } from '@/types/product'
import { MOCK_CATEGORIES as MOCK } from '@/mock/mock.catalog'


interface FormData { nameEn: string; nameAr: string; parentId: string; status: 'active' | 'inactive' }

export default function Categories() {
  const [items, setItems] = useState<Category[]>(MOCK)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | number | null>(null)
  const [form, setForm] = useState<FormData>({ nameEn: '', nameAr: '', parentId: '', status: 'active' })

  const filtered = items.filter(i => !search || i.nameEn.toLowerCase().includes(search.toLowerCase()))
  const parentCategories = items.filter(i => !i.parentId)

  const openCreate = () => { setEditing(null); setForm({ nameEn: '', nameAr: '', parentId: '', status: 'active' }); setModalOpen(true) }
  const openEdit = (item: Category) => { setEditing(item); setForm({ nameEn: item.nameEn, nameAr: item.nameAr, parentId: item.parentId || '', status: item.status }); setModalOpen(true) }

  const handleSave = () => {
    if (!form.nameEn.trim()) return
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, nameEn: form.nameEn, nameAr: form.nameAr, parentId: form.parentId || undefined, status: form.status } : i))
    } else {
      setItems(prev => [...prev, { id: Date.now(), nameEn: form.nameEn, nameAr: form.nameAr, parentId: form.parentId || undefined, productCount: 0, status: form.status, createdAt: '', updatedAt: '' }])
    }
    setModalOpen(false)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Manage product categories</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} />Add Category
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search categories..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Category', 'Name (AR)', 'Parent', 'Products', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {item.parentId && <ChevronRight size={14} className="text-gray-400" />}
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <Grid size={14} className="text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.nameEn}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600" dir="rtl">{item.nameAr}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{item.parentId ? items.find(i => i.id === item.parentId)?.nameEn : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.productCount}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>{item.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></button>
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
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Category' : 'Add Category'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
                <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} dir="rtl" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Category</label>
                <select value={form.parentId} onChange={e => setForm(f => ({ ...f, parentId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">None (Top Level)</option>
                  {parentCategories.map(c => <option key={c.id} value={String(c.id)}>{c.nameEn}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 'active' ? 'bg-blue-600' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600" /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete Category?</h3>
            <p className="text-sm text-gray-500 mb-5">All products in this category will become uncategorized.</p>
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
