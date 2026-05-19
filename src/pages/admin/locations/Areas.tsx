import { useState } from 'react'
import { MapPin, Plus, Pencil, Trash2, X, Search } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Area {
  id: number
  nameEn: string
  nameAr: string
  governorate: string
  status: 'active' | 'inactive'
}

const GOVERNORATES = ['Kuwait City', 'Hawalli', 'Farwaniya', 'Ahmadi', 'Jahra', 'Mubarak Al-Kabeer']

const MOCK: Area[] = [
  { id: 1, nameEn: 'Salmiya', nameAr: 'السالمية', governorate: 'Hawalli', status: 'active' },
  { id: 2, nameEn: 'Rumaithiya', nameAr: 'الرميثية', governorate: 'Hawalli', status: 'active' },
  { id: 3, nameEn: 'Sharq', nameAr: 'شرق', governorate: 'Kuwait City', status: 'active' },
  { id: 4, nameEn: 'Dasman', nameAr: 'دسمان', governorate: 'Kuwait City', status: 'inactive' },
  { id: 5, nameEn: 'Fahaheel', nameAr: 'الفحاحيل', governorate: 'Ahmadi', status: 'active' },
]

interface FormData { nameEn: string; nameAr: string; governorate: string; status: 'active' | 'inactive' }

export default function Areas() {
  const { t } = useTranslation()
  const [items, setItems] = useState<Area[]>(MOCK)
  const [search, setSearch] = useState('')
  const [filterGov, setFilterGov] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Area | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState<FormData>({ nameEn: '', nameAr: '', governorate: GOVERNORATES[0], status: 'active' })

  const filtered = items.filter(i =>
    (!search || i.nameEn.toLowerCase().includes(search.toLowerCase()) || i.nameAr.includes(search)) &&
    (!filterGov || i.governorate === filterGov)
  )

  const openCreate = () => {
    setEditing(null)
    setForm({ nameEn: '', nameAr: '', governorate: GOVERNORATES[0], status: 'active' })
    setModalOpen(true)
  }

  const openEdit = (item: Area) => {
    setEditing(item)
    setForm({ nameEn: item.nameEn, nameAr: item.nameAr, governorate: item.governorate, status: item.status })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.nameEn.trim() || !form.nameAr.trim()) return
    if (editing) {
      setItems(prev => prev.map(i => i.id === editing.id ? { ...i, ...form } : i))
    } else {
      setItems(prev => [...prev, { id: Date.now(), ...form }])
    }
    setModalOpen(false)
  }

  const handleDelete = () => {
    if (deleteId) setItems(prev => prev.filter(i => i.id !== deleteId))
    setDeleteId(null)
  }

  const toggleStatus = (id: number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: i.status === 'active' ? 'inactive' : 'active' } : i))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.areas', 'Areas')}</h1>
          <p className="text-sm text-gray-500 mt-1">Manage delivery areas</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600 transition-colors">
          <Plus size={16} /><span>Add Area</span>
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search areas..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterGov} onChange={e => setFilterGov(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500">
            <option value="">All Governorates</option>
            {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Name (EN)', 'Name (AR)', 'Governorate', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nameEn}</td>
                  <td className="px-4 py-3 text-sm text-gray-700" dir="rtl">{item.nameAr}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.governorate}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => toggleStatus(item.id)} className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
                        <MapPin size={14} />
                      </button>
                      <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">No areas found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-5 border-b">
              <h3 className="font-semibold text-gray-900">{editing ? 'Edit Area' : 'Add Area'}</h3>
              <button onClick={() => setModalOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Area name in English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic) *</label>
                <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} dir="rtl" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="اسم المنطقة بالعربية" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Governorate</label>
                <select value={form.governorate} onChange={e => setForm(f => ({ ...f, governorate: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  {GOVERNORATES.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Active</label>
                <button onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 'active' ? 'bg-sky-500' : 'bg-gray-200'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={handleSave} className="flex-1 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600" /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete Area?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium">Cancel</button>
              <button onClick={handleDelete} className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
