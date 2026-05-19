import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, LayoutDashboard, SearchX } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectUser, selectIsAuthenticated } from '@/store/slices/authSlice'

export default function NotFound() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = i18n.language === 'ar'
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const user = useAppSelector(selectUser)

  const getDashboardPath = () => {
    if (!user || !isAuthenticated) return '/login'
    if (user.role === 'driver') return '/driver/home'
    if (user.role === 'store_manager') return '/store/dashboard'
    return '/admin/dashboard'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-sky-50 px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-lg text-center">
        {/* Decorative icon */}
        <div className="flex items-center justify-center mx-auto mb-4 w-24 h-24 rounded-full bg-sky-100 shadow-inner">
          <SearchX className="w-12 h-12 text-sky-500" />
        </div>

        {/* Big 404 */}
        <h1
          className="font-extrabold tracking-tight mb-0 leading-none select-none"
          style={{
            fontSize: 'clamp(6rem, 20vw, 10rem)',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-3">
          {t('common.notFound')}
        </h2>

        {/* Description */}
        <p className="text-gray-500 text-base mb-8 leading-relaxed max-w-sm mx-auto">
          {isRtl
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة. ربما تم نقلها أو حذفها أو أن الرابط غير صحيح.'
            : "Sorry, the page you're looking for doesn't exist. It may have been moved, deleted, or the URL is incorrect."}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-8 max-w-xs mx-auto" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            }}
          >
            <LayoutDashboard className="w-4 h-4" />
            {isRtl ? 'لوحة التحكم' : 'Go to Dashboard'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
          >
            <ArrowLeft className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            {t('common.back')}
          </button>
        </div>

        {/* Help text */}
        <p className="mt-8 text-xs text-gray-400">
          {isRtl ? 'هل تعتقد أن هذا خطأ؟ ' : 'Think this is a mistake? '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-sky-500 hover:underline font-medium"
          >
            {isRtl ? 'تسجيل الدخول مجدداً' : 'Try logging in again'}
          </button>
        </p>
      </div>
    </div>
  )
}
