import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Lock, ArrowLeft, Home } from 'lucide-react'

export default function Unauthorized() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const isRtl = i18n.language === 'ar'

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 px-4"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="flex items-center justify-center mx-auto mb-6 w-24 h-24 rounded-full bg-red-100 shadow-inner">
          <Lock className="w-12 h-12 text-red-500" />
        </div>

        {/* Code */}
        <p className="text-6xl font-extrabold text-red-500 mb-2 tracking-tight">401</p>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {isRtl ? 'غير مصرح بالوصول' : 'Unauthorized'}
        </h1>

        {/* Description */}
        <p className="text-gray-500 text-base mb-8 leading-relaxed">
          {t('auth.unauthorized')}
          <br />
          {isRtl
            ? 'يرجى تسجيل الدخول للوصول إلى هذه الصفحة.'
            : 'Please log in to access this page.'}
        </p>

        {/* Divider */}
        <div className="h-px bg-gray-200 mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
            }}
          >
            <Lock className="w-4 h-4" />
            {isRtl ? 'تسجيل الدخول' : 'Go to Login'}
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

        {/* Back to home link */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 text-sm text-indigo-600 hover:text-indigo-700 hover:underline font-medium transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            {isRtl ? 'العودة إلى الرئيسية' : 'Back to Home'}
          </button>
        </div>
      </div>
    </div>
  )
}
