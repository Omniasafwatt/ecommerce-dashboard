import { useState } from 'react'
import { ArrowLeft, Upload, Plus, Trash2, Save } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

interface Variant { id: number; nameEn: string; nameAr: string; sku: string; price: string; odooId: string; status: 'active' | 'inactive' }

export default function ProductCreate() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nameEn: '', nameAr: '', descEn: '', descAr: '', price: '', odooId: '',
    category: '', brand: '', status: 'active' as 'active' | 'inactive',
  })
  const [variants, setVariants] = useState<Variant[]>([])
  const [showVariantForm, setShowVariantForm] = useState(false)
  const [newVariant, setNewVariant] = useState<Omit<Variant, 'id'>>({ nameEn: '', nameAr: '', sku: '', price: '', odooId: '', status: 'active' })

  const addVariant = () => {
    if (!newVariant.nameEn || !newVariant.sku) return
    setVariants(prev => [...prev, { ...newVariant, id: Date.now() }])
    setNewVariant({ nameEn: '', nameAr: '', sku: '', price: '', odooId: '', status: 'active' })
    setShowVariantForm(false)
  }

  const removeVariant = (id: number) => setVariants(prev => prev.filter(v => v.id !== id))

  const handleSave = () => {
    console.log('Saving product:', form, variants)
    navigate('/admin/catalog/products')
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/catalog/products" className="p-2 rounded-lg hover:bg-gray-100"><ArrowLeft size={18} /></Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('common.createProduct', 'Add Product')}</h1>
          <p className="text-sm text-gray-500">Catalog &rsaquo; Products &rsaquo; New</p>
        </div>
        <div className="ml-auto flex gap-2">
          <Link to="/admin/catalog/products" className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</Link>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600"><Save size={16} />Save Product</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Product Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
                <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="Product name in English" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic) *</label>
                <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} dir="rtl" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="اسم المنتج بالعربية" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
                <textarea rows={3} value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Product description in English" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Arabic)</label>
                <textarea rows={3} dir="rtl" value={form.descAr} onChange={e => setForm(f => ({ ...f, descAr: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" placeholder="وصف المنتج بالعربية" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (KWD)</label>
                <input type="number" step="0.001" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="0.000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Odoo Product ID</label>
                <input value={form.odooId} onChange={e => setForm(f => ({ ...f, odooId: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="ERP product ID" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select category</option>
                  {['Dairy','Grains','Oils','Snacks','Vegetables','Meat','Fruits','Beverages'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                <select value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="">Select brand</option>
                  {['Al Marai','Safi','Rahma','Jadwa','Local','Al Watania'].map(b => <option key={b}>{b}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Variants ({variants.length})</h3>
              <button onClick={() => setShowVariantForm(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-sky-600 hover:bg-blue-50 rounded-lg">
                <Plus size={14} />Add Variant
              </button>
            </div>

            {showVariantForm && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-medium text-blue-800 mb-3">New Variant</h4>
                <div className="grid grid-cols-2 gap-3">
                  <input value={newVariant.nameEn} onChange={e => setNewVariant(v => ({ ...v, nameEn: e.target.value }))} placeholder="Name (EN) *" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  <input value={newVariant.nameAr} onChange={e => setNewVariant(v => ({ ...v, nameAr: e.target.value }))} placeholder="Name (AR)" dir="rtl" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  <input value={newVariant.sku} onChange={e => setNewVariant(v => ({ ...v, sku: e.target.value }))} placeholder="SKU *" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  <input value={newVariant.price} onChange={e => setNewVariant(v => ({ ...v, price: e.target.value }))} type="number" step="0.001" placeholder="Price (KWD)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                  <input value={newVariant.odooId} onChange={e => setNewVariant(v => ({ ...v, odooId: e.target.value }))} placeholder="Odoo Variant ID" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setShowVariantForm(false)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm">Cancel</button>
                  <button onClick={addVariant} className="px-3 py-1.5 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600">Add</button>
                </div>
              </div>
            )}

            {variants.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No variants yet. Click "Add Variant" to create one.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      {['Name (EN)', 'Name (AR)', 'SKU', 'Price', 'Odoo ID', 'Actions'].map(h => (
                        <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {variants.map(v => (
                      <tr key={v.id} className="hover:bg-gray-50">
                        <td className="px-3 py-2">{v.nameEn}</td>
                        <td className="px-3 py-2" dir="rtl">{v.nameAr}</td>
                        <td className="px-3 py-2 font-mono text-xs">{v.sku}</td>
                        <td className="px-3 py-2">{v.price ? `KWD ${parseFloat(v.price).toFixed(3)}` : '—'}</td>
                        <td className="px-3 py-2 font-mono text-xs text-gray-500">{v.odooId || '—'}</td>
                        <td className="px-3 py-2">
                          <button onClick={() => removeVariant(v.id)} className="p-1 text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Status</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Active</span>
              <button onClick={() => setForm(f => ({ ...f, status: f.status === 'active' ? 'inactive' : 'active' }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.status === 'active' ? 'bg-sky-500' : 'bg-gray-200'}`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${form.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="font-semibold text-gray-900 mb-4">Product Images</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 cursor-pointer transition-colors">
              <Upload size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Drop images here or click to upload</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
