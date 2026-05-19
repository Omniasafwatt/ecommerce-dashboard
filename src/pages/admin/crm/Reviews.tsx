import { useState } from 'react'
import { Star, Search, CheckCircle, EyeOff, MessageSquare } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MOCK_REVIEWS as MOCK } from '@/mock/mock.reviews'

type ReviewType = 'product' | 'store' | 'driver'
type ReviewStatus = 'pending' | 'approved' | 'hidden'

interface Review {
  id: number
  type: ReviewType
  author: string
  target: string
  rating: number
  comment: string
  status: ReviewStatus
  date: string
  orderId?: string
}


const STATUS_STYLES: Record<ReviewStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  hidden: 'bg-gray-100 text-gray-600',
}

const TYPE_STYLES: Record<ReviewType, string> = {
  product: 'bg-blue-100 text-blue-700',
  store: 'bg-purple-100 text-purple-700',
  driver: 'bg-orange-100 text-orange-700',
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(n => (
        <Star key={n} size={14} className={n <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

export default function Reviews() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<Review[]>(MOCK)
  const [tab, setTab] = useState<ReviewType | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const filtered = reviews.filter(r =>
    (tab === 'all' || r.type === tab) &&
    (!filterStatus || r.status === filterStatus) &&
    (!search || r.author.toLowerCase().includes(search.toLowerCase()) || r.target.toLowerCase().includes(search.toLowerCase()))
  )

  const handleAction = (id: number, action: 'approved' | 'hidden') => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: action } : r))
  }

  const pendingCount = reviews.filter(r => r.status === 'pending').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('reviews.reviewModeration', 'Review Moderation')}</h1>
          <p className="text-sm text-gray-500 mt-1">{pendingCount} {t('reviews.pendingCount', 'pending reviews')}</p>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit">
        {[{ id: 'all', label: 'All' }, { id: 'product', label: 'Products' }, { id: 'store', label: 'Stores' }, { id: 'driver', label: 'Drivers' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id as ReviewType | 'all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${tab === t.id ? 'bg-white text-sky-600 shadow-sm' : 'text-gray-600'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reviews..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="divide-y divide-gray-100">
          {filtered.map(review => (
            <div key={review.id} className="p-5 hover:bg-gray-50">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TYPE_STYLES[review.type]}`}>{review.type}</span>
                    <Stars rating={review.rating} />
                    <span className="text-sm font-medium text-gray-700">{review.rating}/5</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[review.status]}`}>{review.status}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mb-0.5">{review.target}</p>
                  <p className="text-sm text-gray-600 mb-2 flex items-start gap-1.5">
                    <MessageSquare size={13} className="text-gray-400 mt-0.5 flex-shrink-0" />
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span>by {review.author}</span>
                    <span>·</span>
                    <span>{review.date}</span>
                    {review.orderId && <><span>·</span><span className="text-blue-500">{review.orderId}</span></>}
                  </div>
                </div>
                {review.status === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleAction(review.id, 'approved')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700">
                      <CheckCircle size={13} />{t('reviews.approved', 'Approve')}
                    </button>
                    <button onClick={() => handleAction(review.id, 'hidden')} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50">
                      <EyeOff size={13} />{t('reviews.hide', 'Hide')}
                    </button>
                  </div>
                )}
                {review.status === 'approved' && (
                  <button onClick={() => handleAction(review.id, 'hidden')} className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-50 flex-shrink-0">
                    <EyeOff size={13} />{t('reviews.hide', 'Hide')}
                  </button>
                )}
                {review.status === 'hidden' && (
                  <button onClick={() => handleAction(review.id, 'approved')} className="flex items-center gap-1.5 px-3 py-1.5 border border-green-300 text-green-700 rounded-lg text-xs font-medium hover:bg-green-50 flex-shrink-0">
                    <CheckCircle size={13} />{t('reviews.restore', 'Restore')}
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-gray-500">No reviews found</div>
          )}
        </div>
      </div>
    </div>
  )
}
