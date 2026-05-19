import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Globe,
  ArrowRight,
  Zap,
  Shield,
  BarChart3,
  Truck,
} from 'lucide-react'

import { login as loginApi } from '@/api/auth'
import { setCredentials } from '@/store/slices/authSlice'
import { selectIsAuthenticated, selectUser } from '@/store/slices/authSlice'
import { useAppDispatch, useAppSelector } from '@/store'

// ─── Validation schema ────────────────────────────────────────────────────────
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Minimum 6 characters'),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

// ─── Feature cards data ───────────────────────────────────────────────────────
const features = [
  { icon: BarChart3, titleEn: 'Live Analytics', titleAr: 'تحليلات مباشرة', descEn: 'Real-time sales & KPIs', descAr: 'مبيعات ومؤشرات أداء لحظية' },
  { icon: Truck, titleEn: 'Delivery Hub', titleAr: 'مركز التوصيل', descEn: 'Track every driver & order', descAr: 'تتبع كل سائق وطلب' },
  { icon: Shield, titleEn: 'Role-Based Access', titleAr: 'صلاحيات متدرجة', descEn: 'Admin, Store, Driver roles', descAr: 'أدوار للمشرف والمتجر والسائق' },
  { icon: Zap, titleEn: 'Instant Alerts', titleAr: 'تنبيهات فورية', descEn: 'Push & in-app notifications', descAr: 'إشعارات فورية وداخلية' },
]

// ─── Component ────────────────────────────────────────────────────────────────
export default function Login() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const currentUser = useAppSelector(selectUser)

  const [showPassword, setShowPassword] = React.useState(false)
  const isRtl = i18n.language === 'ar'

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
    defaultValues: { email: '', password: '', rememberMe: false },
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
    <>
      <style>{`
        @keyframes blob-drift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(40px, -30px) scale(1.08); }
          50% { transform: translate(-20px, 40px) scale(0.95); }
          75% { transform: translate(30px, 20px) scale(1.04); }
        }
        @keyframes blob-drift-2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-50px, 30px) scale(1.1); }
          66% { transform: translate(35px, -40px) scale(0.92); }
        }
        @keyframes blob-drift-3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(25px, 50px) scale(1.06); }
          70% { transform: translate(-40px, -20px) scale(0.97); }
        }
        @keyframes fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes logo-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.5); }
          50% { box-shadow: 0 0 0 18px rgba(14,165,233,0); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes float-dot {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.6; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
        }
        @keyframes ring-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes counter-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-blob { animation: blob-drift 18s ease-in-out infinite; }
        .animate-blob-2 { animation: blob-drift-2 22s ease-in-out infinite; }
        .animate-blob-3 { animation: blob-drift-3 16s ease-in-out infinite; }
        .animate-fade-up { animation: fade-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-fade-in { animation: fade-in 0.5s ease both; }
        .animate-slide-left { animation: slide-left 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-slide-right { animation: slide-right 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .animate-logo-pulse { animation: logo-pulse 2.5s ease-in-out infinite; }
        .animate-shimmer {
          background: linear-gradient(90deg, #0284c7 0%, #38bdf8 40%, #7dd3fc 60%, #0284c7 100%);
          background-size: 200% auto;
          animation: shimmer 2.2s linear infinite;
        }
        .dot-1 { animation: float-dot 3.2s ease-in-out infinite; }
        .dot-2 { animation: float-dot 4.1s ease-in-out infinite 0.8s; }
        .dot-3 { animation: float-dot 3.7s ease-in-out infinite 1.5s; }
        .dot-4 { animation: float-dot 5s ease-in-out infinite 0.4s; }
        .dot-5 { animation: float-dot 3.5s ease-in-out infinite 2s; }
        .ring-outer { animation: ring-spin 12s linear infinite; }
        .ring-inner { animation: counter-spin 8s linear infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-600 { animation-delay: 0.6s; }
      `}</style>

      <div
        className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
        dir={isRtl ? 'rtl' : 'ltr'}
        style={{
          fontFamily: isRtl ? "'Cairo', sans-serif" : "'Inter', sans-serif",
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 35%, #0284c7 65%, #0ea5e9 100%)',
        }}
      >
        {/* ── Animated background blobs ─────────────────────────────── */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="animate-blob absolute top-[-120px] left-[-100px] w-[500px] h-[500px] rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #7dd3fc 0%, #0ea5e9 40%, transparent 70%)' }} />
          <div className="animate-blob-2 absolute bottom-[-80px] right-[-120px] w-[450px] h-[450px] rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #38bdf8 0%, #0284c7 50%, transparent 70%)' }} />
          <div className="animate-blob-3 absolute top-1/2 left-1/3 w-[350px] h-[350px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #bae6fd 0%, #0ea5e9 60%, transparent 70%)' }} />
          <div className="animate-blob absolute bottom-1/4 left-[-60px] w-[300px] h-[300px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #e0f2fe 0%, #38bdf8 70%, transparent 100%)', animationDelay: '4s' }} />
          <div className="animate-blob-2 absolute top-1/4 right-[-80px] w-[280px] h-[280px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #7dd3fc 0%, #0369a1 70%, transparent 100%)', animationDelay: '7s' }} />
        </div>

        {/* ── Floating dots ─────────────────────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { cls: 'dot-1', top: '15%', left: '8%', size: 8 },
            { cls: 'dot-2', top: '70%', left: '5%', size: 6 },
            { cls: 'dot-3', top: '40%', left: '92%', size: 10 },
            { cls: 'dot-4', top: '80%', left: '88%', size: 7 },
            { cls: 'dot-5', top: '25%', left: '78%', size: 5 },
            { cls: 'dot-1', top: '60%', left: '15%', size: 6 },
            { cls: 'dot-3', top: '10%', left: '55%', size: 9 },
            { cls: 'dot-2', top: '85%', left: '45%', size: 5 },
          ].map((d, i) => (
            <div
              key={i}
              className={`${d.cls} absolute rounded-full bg-white/30`}
              style={{ top: d.top, left: d.left, width: d.size, height: d.size }}
            />
          ))}
        </div>

        {/* ── Language toggle ───────────────────────────────────────── */}
        <div className="absolute top-5 right-5 z-20 animate-fade-in">
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/15 backdrop-blur-md border border-white/20 text-sm font-medium text-white hover:bg-white/25 transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            <span>{i18n.language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* ── Main card ─────────────────────────────────────────────── */}
        <div className="animate-fade-up relative z-10 w-full max-w-5xl mx-4 lg:mx-8">
          <div
            className="rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row"
            style={{ backdropFilter: 'blur(2px)', minHeight: 580 }}
          >
            {/* ── Left brand panel ───────────────────────────────── */}
            <div
              className="animate-slide-left relative lg:w-[46%] flex flex-col p-8 lg:p-10 overflow-hidden"
              style={{
                background: 'linear-gradient(160deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.06) 100%)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              {/* Inner glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

              {/* Logo area */}
              <div className="mb-10">
                <div className="animate-logo-pulse inline-flex items-center gap-2 mb-2">
                  <div className="bg-white text-sky-500 font-black text-base px-3 py-1.5 rounded-lg leading-tight tracking-widest shadow-lg">
                    MOBILE
                  </div>
                  <span className="font-black text-white text-2xl tracking-widest leading-none drop-shadow-lg">
                    2000
                  </span>
                </div>
                <p className="text-sky-200/80 text-xs font-medium tracking-wider uppercase">
                  {isRtl ? 'بوابة الإدارة' : 'Management Portal'}
                </p>
              </div>

              {/* Headline */}
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white leading-snug mb-3">
                  {isRtl ? (
                    <>كل شيء في<br /><span className="text-sky-200">مكان واحد</span></>
                  ) : (
                    <>Everything in<br /><span className="text-sky-200">one place</span></>
                  )}
                </h2>
                <p className="text-sm text-white/70 leading-relaxed">
                  {isRtl
                    ? 'إدارة طلباتك ومخزونك وفريقك بكفاءة عالية من لوحة تحكم موحدة.'
                    : 'Manage your orders, inventory, and team efficiently from one unified dashboard.'}
                </p>
              </div>

              {/* Feature cards */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                {features.map((f, i) => {
                  const Icon = f.icon
                  return (
                    <div
                      key={i}
                      className={`animate-fade-up delay-${(i + 2) * 100} group flex flex-col gap-2 p-3.5 rounded-2xl transition-all duration-300 hover:scale-105 cursor-default`}
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    >
                      <div className="w-8 h-8 rounded-xl bg-sky-400/30 flex items-center justify-center">
                        <Icon size={16} className="text-sky-100" />
                      </div>
                      <p className="text-xs font-bold text-white leading-tight">
                        {isRtl ? f.titleAr : f.titleEn}
                      </p>
                      <p className="text-[11px] text-white/60 leading-tight">
                        {isRtl ? f.descAr : f.descEn}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Bottom badge */}
              <div className="mt-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs text-white/60 font-medium">
                  {isRtl ? 'النظام يعمل بشكل طبيعي' : 'All systems operational'}
                </p>
              </div>
            </div>

            {/* ── Right form panel ────────────────────────────────── */}
            <div
              className="animate-slide-right delay-200 flex-1 flex flex-col bg-white lg:rounded-none rounded-b-3xl"
            >
              {/* Top accent bar */}
              <div className="h-1.5 w-full bg-gradient-to-r from-sky-400 via-sky-500 to-cyan-400" />

              <div className="flex-1 flex flex-col justify-center px-8 lg:px-12 py-10">
                {/* Header */}
                <div className="mb-8 animate-fade-up delay-300">
                  <h3 className="text-2xl font-bold text-slate-900 mb-1.5">
                    {t('auth.loginTitle')}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {t('auth.loginSubtitle')}
                  </p>
                </div>

                {/* Error banner */}
                {errorMessage && (
                  <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 animate-fade-up">
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0 text-red-500" />
                    <p className="text-sm font-medium">{errorMessage}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                  {/* Email */}
                  <div className="animate-fade-up delay-400">
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      {t('auth.email')}
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none transition-colors">
                        <Mail className="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
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
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100'
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

                  {/* Password */}
                  <div className="animate-fade-up delay-500">
                    <div className="flex items-center justify-between mb-2">
                      <label htmlFor="password" className="block text-sm font-semibold text-slate-700">
                        {t('auth.password')}
                      </label>
                      <button
                        type="button"
                        className="text-xs text-sky-500 hover:text-sky-700 font-medium hover:underline transition-colors"
                      >
                        {t('auth.forgotPassword')}
                      </button>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
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
                            : 'border-slate-200 bg-slate-50 text-slate-900 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100'
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="absolute inset-y-0 end-0 pe-3.5 flex items-center text-slate-400 hover:text-sky-500 transition-colors"
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
                  <div className="flex items-center gap-3 animate-fade-up delay-600">
                    <input
                      id="rememberMe"
                      type="checkbox"
                      {...register('rememberMe')}
                      className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-400 cursor-pointer accent-sky-500"
                    />
                    <label htmlFor="rememberMe" className="text-sm text-slate-600 cursor-pointer select-none">
                      {t('auth.rememberMe')}
                    </label>
                  </div>

                  {/* Submit */}
                  <div className="animate-fade-up delay-600 pt-1">
                    <button
                      type="submit"
                      disabled={isPending}
                      className={`
                        w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl
                        text-white font-semibold text-sm transition-all duration-300
                        shadow-lg hover:shadow-sky-400/40 hover:scale-[1.02]
                        active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100
                        ${isPending ? 'bg-sky-400' : 'animate-shimmer'}
                      `}
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>{t('common.loading')}</span>
                        </>
                      ) : (
                        <>
                          <span>{t('auth.loginButton')}</span>
                          <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRtl ? 'rotate-180' : ''}`} />
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Access level hint */}
                <div className="mt-8 p-4 rounded-2xl bg-sky-50/60 border border-sky-100 animate-fade-up delay-600">
                  <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-2.5">
                    {isRtl ? 'مستويات الوصول' : 'Access Levels'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { dot: 'bg-sky-500', label: isRtl ? 'مشرفو النظام' : 'Admin roles' },
                      { dot: 'bg-orange-400', label: isRtl ? 'مدير المتجر' : 'Store Manager' },
                      { dot: 'bg-emerald-400', label: isRtl ? 'السائق' : 'Driver' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-sky-100 shadow-sm">
                        <div className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                        <span className="text-[11px] font-medium text-slate-600">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <p className="mt-6 text-center text-xs text-slate-400">
                  © {new Date().getFullYear()} Mobile2000 —{' '}
                  {isRtl ? 'جميع الحقوق محفوظة' : 'All rights reserved'}
                </p>
              </div>
            </div>
          </div>

          {/* Glow effect under card */}
          <div
            className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-12 blur-2xl opacity-30 pointer-events-none"
            style={{ background: 'linear-gradient(90deg, #0ea5e9, #38bdf8, #0ea5e9)' }}
          />
        </div>
      </div>
    </>
  )
}
