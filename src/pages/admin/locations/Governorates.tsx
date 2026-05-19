import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
  X,
  AlertTriangle,
} from 'lucide-react'
import type { Governorate } from '@/types/common'
import { useTranslation } from 'react-i18next'

// ─── Schema ───────────────────────────────────────────────────────────────────

const governorateSchema = z.object({
  nameEn: z.string().min(2, 'Name (English) is required'),
  nameAr: z.string().min(2, 'Name (Arabic) is required'),
  status: z.enum(['active', 'inactive']),
})

type GovernorateFormData = z.infer<typeof governorateSchema>

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_GOVERNORATES: (Governorate & { areasCount: number })[] = [
  { id: '1', nameEn: 'Capital', nameAr: 'العاصمة', status: 'active', areasCount: 12 },
  { id: '2', nameEn: 'Hawalli', nameAr: 'حولي', status: 'active', areasCount: 9 },
  { id: '3', nameEn: 'Farwaniya', nameAr: 'الفروانية', status: 'active', areasCount: 11 },
  { id: '4', nameEn: 'Ahmadi', nameAr: 'الأحمدي', status: 'active', areasCount: 14 },
  { id: '5', nameEn: 'Jahra', nameAr: 'الجهراء', status: 'inactive', areasCount: 7 },
  { id: '6', nameEn: 'Mubarak Al-Kabeer', nameAr: 'مبارك الكبير', status: 'active', areasCount: 6 },
  { id: '7', nameEn: 'Sabah Al-Ahmad', nameAr: 'صباح الأحمد', status: 'active', areasCount: 5 },
  { id: '8', nameEn: 'Al Mutlaa', nameAr: 'المطلاع', status: 'inactive', areasCount: 3 },
]

const PAGE_SIZE = 5

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatusBadge = ({ status }: { status: 'active' | 'inactive' }) => (
  <span
    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
      status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
    }`}
  >
    {status === 'active' ? 'Active' : 'Inactive'}
  </span>
)

// ─── Governorates Page ────────────────────────────────────────────────────────

export default function Governorates() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<(Governorate & { areasCount: number }) | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<(Governorate & { areasCount: number }) | null>(null)

  // ── Data fetching ──
  const { data: govData, isLoading, isError } = useQuery({
    queryKey: ['governorates'],
    queryFn: async () => {
      // In production: return (await api.getGovernorates()).data
      await new Promise((r) => setTimeout(r, 400))
      return MOCK_GOVERNORATES
    },
  })

  // ── Mutations (mock) ──
  const saveMutation = useMutation({
    mutationFn: async (payload: { id?: string; data: GovernorateFormData }) => {
      await new Promise((r) => setTimeout(r, 500))
      return payload
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governorates'] })
      closeModal()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string | number) => {
      await new Promise((r) => setTimeout(r, 400))
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['governorates'] })
      setDeleteTarget(null)
    },
  })

  // ── Form ──
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<GovernorateFormData>({
    resolver: zodResolver(governorateSchema),
    defaultValues: { status: 'active' },
  })

  const statusValue = watch('status')

  const openCreate = () => {
    setEditTarget(null)
    reset({ nameEn: '', nameAr: '', status: 'active' })
    setIsModalOpen(true)
  }

  const openEdit = (gov: Governorate & { areasCount: number }) => {
    setEditTarget(gov)
    reset({ nameEn: gov.nameEn, nameAr: gov.nameAr, status: gov.status })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditTarget(null)
    reset()
  }

  const onSubmit = (formData: GovernorateFormData) => {
    saveMutation.mutate({ id: editTarget?.id as string | undefined, data: formData })
  }

  // ── Filtered + paginated ──
  const filtered = (govData ?? []).filter(
    (g) =>
      g.nameEn.toLowerCase().includes(search.toLowerCase()) ||
      g.nameAr.includes(search)
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <MapPin className="h-5 w-5 text-sky-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{t('nav.governorates', 'Governorates')}</h1>
            <p className="text-sm text-gray-500">Manage governorates and their areas</p>
          </div>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Governorate
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search governorates..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="p-12 text-center text-gray-500">
            <AlertTriangle className="h-8 w-8 text-red-400 mx-auto mb-2" />
            Failed to load governorates.
          </div>
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">#</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (EN)</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name (AR)</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Areas</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">No governorates found.</td>
                  </tr>
                ) : (
                  paginated.map((gov, idx) => (
                    <tr key={gov.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-gray-400 text-xs">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="px-6 py-4 font-medium text-gray-900">{gov.nameEn}</td>
                      <td className="px-6 py-4 text-gray-700 font-arabic" dir="rtl">{gov.nameAr}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-gray-600">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          {gov.areasCount}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={gov.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEdit(gov)}
                            className="p-1.5 text-gray-400 hover:text-sky-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title={gov.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {gov.status === 'active' ? (
                              <ToggleRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ToggleLeft className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setDeleteTarget(gov)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-sky-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Add/Edit Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {editTarget ? 'Edit Governorate' : 'Add Governorate'}
              </h2>
              <button
                onClick={closeModal}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              {/* Name EN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (English) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('nameEn')}
                  placeholder="e.g. Capital"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
                {errors.nameEn && (
                  <p className="text-xs text-red-500 mt-1">{errors.nameEn.message}</p>
                )}
              </div>

              {/* Name AR */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name (Arabic) <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('nameAr')}
                  placeholder="مثال: العاصمة"
                  dir="rtl"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-right"
                />
                {errors.nameAr && (
                  <p className="text-xs text-red-500 mt-1">{errors.nameAr.message}</p>
                )}
              </div>

              {/* Status toggle */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Status</p>
                  <p className="text-xs text-gray-400">Enable or disable this governorate</p>
                </div>
                <button
                  type="button"
                  onClick={() => setValue('status', statusValue === 'active' ? 'inactive' : 'active')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${
                    statusValue === 'active' ? 'bg-sky-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                      statusValue === 'active' ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saveMutation.isPending ? 'Saving...' : editTarget ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">Delete Governorate</h2>
            </div>
            <p className="text-sm text-gray-600 mb-1">
              Are you sure you want to delete <strong>{deleteTarget.nameEn}</strong>?
            </p>
            <p className="text-xs text-red-500 mb-6">
              This will also affect {deleteTarget.areasCount} associated areas.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
              >
                {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
