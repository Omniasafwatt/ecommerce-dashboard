import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  ShoppingBag,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Globe,
  CheckCircle,
} from 'lucide-react'

import { login as loginApi } from '@/api/auth'
import { setCredentials } from '@/store/slices/authSlice'
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store'

// ---------------------------------------------------------------------------
// Validation schema
// ---------------------------------------------------------------------------
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Minimum 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ---------------------------------------------------------------------------
// Role hint data
// ---------------------------------------------------------------------------
const roleHints = [
  { role: 'super_admin', label: 'Super Admin', color: 'bg-violet-500', icon: '👑' },
  { role: 'operations_admin', label: 'Operations Admin', color: 'bg-blue-500', icon: '⚙️' },
  { role: 'catalog_manager', label: 'Catalog Manager', color: 'bg-emerald-500', icon: '📦' },
  { role: 'finance', label: 'Finance', color: 'bg-amber-500', icon: '💰' },
  { role: 'support', label: 'Support', color: 'bg-cyan-500', icon: '🎧' },
  { role: 'marketing', label: 'Marketing', color: 'bg-pink-500', icon: '📣' },
  { role: 'store_manager', label: 'Store Manager', color: 'bg-orange-500', icon: '🏪' },
  { role: 'driver', label: 'Driver', color: 'bg-lime-500', icon: '🚚' },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------
export default function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const currentUser = useAppSelector(selectUser)

  const [showPassword, setShowPassword] = React.useState(false)
  const isRtl = i18n.language === 'ar'

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      const role = currentUser.role
      if (role === 'driver') navigate('/driver/home', { replace: true })
      else if (role === 'store_manager') navigate('/store/dashboard', { replace: true })
      else navigate('/admin/dashboard', { replace: true })
    }
  }, [isAuthenticated, currentUser, navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const { mutate: loginMutate, isPending, error: mutationError } = useMutation({
    mutationFn: (data: { email: string; password: string }) => loginApi(data),
    onSuccess: (response) => {
      const data = response.data
      dispatch(setCredentials({ user: data.user, tokens: data.tokens }))
      localStorage.setItem('accessToken', data.tokens.accessToken)
      localStorage.setItem('refreshToken', data.tokens.refreshToken)

      const role = data.user.role
      if (role === 'driver') navigate('/driver/home')
      else if (role === 'store_manager') navigate('/store/dashboard')
      else navigate('/admin/dashboard')
    },
  })

  const onSubmit = (values: LoginFormValues) => {
    loginMutate({ email: values.email, password: values.password })
  }

  const toggleLanguage = () => {
    const next = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(next)
  }

  const errorMessage = mutationError
    ? (mutationError as Error)?.message ?? t('auth.invalidCredentials')
    : null

  return (
    <div
      className="min-h-screen flex"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ fontFamily: isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif" }}
    >
      {/* ------------------------------------------------------------------ */}
      {/* LEFT PANEL — brand / gradient                                       */}
      {/* ------------------------------------------------------------------ */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col items-center justify-center p-12"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 30%, #7c3aed 60%, #a855f7 100%)',
        }}
      >
        {/* Background decorative circles */}
        <div className="absolute top-[-80px] left-[-80px] w-[350px] h-[350px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-60px] right-[-60px] w-[280px] h-[280px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #fff 0%, transparent 70%)' }} />
        <div className="absolute top-1/2 left-[-120px] w-[240px] h-[240px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #c4b5fd 0%, transparent 70%)' }} />

        <div className="relative z-10 flex flex-col items-center text-center max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl mb-8 shadow-2xl"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <ShoppingBag className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Mobile2000
          </h1>
          <p className="text-lg text-purple-100 mb-2 font-medium">
            {isRtl ? 'لوحة تحكم المتجر الإلكتروني' : 'Mobile2000 Portal'}
          </p>
          <p className="text-sm text-purple-200 mb-12 leading-relaxed">
            {isRtl
              ? 'إدارة متكاملة لمتجرك الإلكتروني — الطلبات والمخزون والمناطق والتقارير في مكان واحد'
              : 'Complete management for your online store — orders, inventory, regions, and reports all in one place'}
          </p>

          {/* Feature pills */}
          <div className="grid grid-cols-2 gap-3 w-full">
            {[
              { icon: '📦', text: isRtl ? 'إدارة المنتجات' : 'Product Management' },
              { icon: '🚚', text: isRtl ? 'تتبع التوصيل' : 'Delivery Tracking' },
              { icon: '📊', text: isRtl ? 'تقارير المبيعات' : 'Sales Reports' },
              { icon: '🏪', text: isRtl ? 'إدارة المتاجر' : 'Store Management' },
              { icon: '💳', text: isRtl ? 'إدارة المدفوعات' : 'Payment Control' },
              { icon: '👥', text: isRtl ? 'إدارة المستخدمين' : 'User Management' },
            ].map((feat) => (
              <div
                key={feat.text}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-white font-medium"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)' }}
              >
                <span className="text-base">{feat.icon}</span>
                <span>{feat.text}</span>
              </div>
            ))}
          </div>

          {/* Roles hint */}
          <div className="mt-10 w-full">
            <p className="text-xs text-purple-300 mb-3 uppercase tracking-wider font-semibold">
              {isRtl ? 'الأدوار المدعومة' : 'Supported Roles'}
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {roleHints.map((r) => (
                <span
                  key={r.role}
                  className={`${r.color} text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm`}
                >
                  {r.icon} {r.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* RIGHT PANEL — login form                                            */}
      {/* ------------------------------------------------------------------ */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)' }}>
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900">Mobile2000</span>
          </div>
          <div className="hidden lg:block" />

          {/* Language toggle */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Form container */}
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {t('auth.loginTitle')}
              </h2>
              <p className="text-gray-500 text-base">
                {t('auth.loginSubtitle')}
              </p>
            </div>

            {/* Error banner */}
            {errorMessage && (
              <div className="mb-6 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700">
                <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  {t('auth.email')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="admin@mobile2000.com"
                    {...register('email')}
                    className={`w-full ps-10 pe-4 py-3 rounded-xl border text-sm transition-all duration-200 outline-none
                      ${errors.email
                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                      }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700"
                  >
                    {t('auth.password')}
                  </label>
                  <button
                    type="button"
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full ps-10 pe-12 py-3 rounded-xl border text-sm transition-all duration-200 outline-none
                      ${errors.password
                        ? 'border-red-300 bg-red-50 text-red-900 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                        : 'border-gray-200 bg-gray-50 text-gray-900 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100'
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center gap-3">
                <div className="relative flex items-center">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-gray-600 cursor-pointer select-none"
                >
                  {t('auth.rememberMe')}
                </label>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl text-white font-semibold text-sm transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                style={{
                  background: isPending
                    ? '#a5b4fc'
                    : 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
                }}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>{t('auth.loginButton')}</span>
                  </>
                )}
              </button>
            </form>

            {/* Role-based access info */}
            <div className="mt-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {isRtl ? 'الأدوار وصلاحيات الوصول' : 'Roles & Access Levels'}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-violet-500" />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">
                      {isRtl ? 'المشرفون' : 'Admin roles'}
                    </span>
                    {isRtl ? ' — يتم التوجيه إلى لوحة تحكم الإدارة' : ' → Admin Dashboard'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500" />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">
                      {isRtl ? 'مدير المتجر' : 'Store Manager'}
                    </span>
                    {isRtl ? ' — يتم التوجيه إلى لوحة تحكم المتجر' : ' → Store Dashboard'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-lime-500" />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium text-gray-800">
                      {isRtl ? 'السائق' : 'Driver'}
                    </span>
                    {isRtl ? ' — يتم التوجيه إلى تطبيق السائق' : ' → Driver App'}
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="mt-6 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} Mobile2000.{' '}
              {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
