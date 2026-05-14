import { useState } from 'react'
import { Layers, Plus, Pencil, Trash2, Search, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Bundle } from '@/types/product'
import { MOCK_BUNDLES as MOCK } from '@/mock/mock.catalog'


export default function Bundles() {
  const [items, setItems] = useState<Bundle[]>(MOCK)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const filtered = items.filter(i => !search || i.nameEn.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bundles</h1>
          <p className="text-sm text-gray-500 mt-1">{items.length} bundles configured</p>
        </div>
        <Link to="/admin/catalog/bundles/new" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
          <Plus size={16} />Add Bundle
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search bundles..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map(item => (
            <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Layers size={18} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.nameEn}</p>
                    <p className="text-xs text-gray-500" dir="rtl">{item.nameAr}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-900">KWD {item.price.toFixed(3)}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {item.status}
                  </span>
                  <Link to={`/admin/catalog/bundles/${item.id}`} className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"><Pencil size={14} /></Link>
                  <button onClick={() => setDeleteId(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 pl-13">
                {item.components.map((c, i) => (
                  <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 rounded-lg text-xs text-gray-700">
                    <Package size={11} className="text-gray-400" />
                    {c.quantity}x {c.productName}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="px-4 py-8 text-center text-sm text-gray-500">No bundles found</div>}
        </div>
      </div>

      {deleteId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4"><Trash2 size={20} className="text-red-600" /></div>
            <h3 className="font-semibold text-gray-900 mb-2">Delete Bundle?</h3>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone.</p>
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
