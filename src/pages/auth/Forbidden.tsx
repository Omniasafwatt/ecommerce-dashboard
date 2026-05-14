import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShieldOff, ArrowLeft, LayoutDashboard, Mail } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'

export default function Forbidden() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = i18n.language === 'ar'
  const user = useAppSelector(selectUser)

  const getDashboardPath = () => {
    if (!user) return '/login'
    if (user.role === 'driver') return '/driver/home'
    if (user.role === 'store_manager') return '/store/dashboard'
    return '/admin/dashboard'
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-amber-50 px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto mb-6 w-24 h-24 rounded-full bg-amber-100 shadow-inner">
          <ShieldOff className="w-12 h-12 text-amber-500" />
        </div>

        {/* Code */}
        <p className="text-6xl font-extrabold text-amber-500 mb-2 tracking-tight">403</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isRtl ? 'الوصول محظور' : 'Access Forbidden'}
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-base mb-4 leading-relaxed">
          {t('common.forbidden')}
          <br />
          {isRtl
            ? "ليس لديك صلاحية للوصول إلى هذه الصفحة."
            : "You don't have permission to access this page."}
        </p>

        {/* User role badge */}
        {user && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-amber-200 text-sm text-amber-700 font-medium mb-6 shadow-sm">
            <ShieldOff className="w-4 h-4" />
            {isRtl ? 'دورك الحالي:' : 'Your current role:'}{' '}
            <span className="font-bold capitalize">{user.role.replace('_', ' ')}</span>
          </div>
        )}

        {/* Contact admin note */}
        <div className="mb-8 p-4 rounded-xl bg-white border border-amber-100 shadow-sm text-start">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0 mt-0.5">
              <Mail className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                {isRtl ? 'تواصل مع المشرف' : 'Contact Administrator'}
              </p>
              <p className="text-xs text-gray-500 leading-relaxed">
                {isRtl
                  ? 'إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع مشرف النظام لمنحك الصلاحيات المناسبة.'
                  : 'If you believe this is an error, please contact your system administrator to grant you the appropriate permissions.'}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate(getDashboardPath())}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
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
      </div>
    </div>
  )
}
