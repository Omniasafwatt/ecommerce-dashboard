import React, { useState, useEffect } from 'react'
import {
  Clock, CheckCircle, XCircle, Truck, Package,
  ShoppingBag, DollarSign, TrendingUp, TrendingDown,
  Activity, ArrowUpRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { MOCK_STORE_DASHBOARD_ORDERS as MOCK_ORDERS } from '@/mock/mock.store.orders'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'

interface StoreOrder {
  id: number
  storeId: string
  orderNumber: string
  customer: string
  items: number
  total: number
  status: 'new' | 'accepted' | 'preparing' | 'out_for_delivery' | 'delivered' | 'rejected'
  time: string
  paymentMethod: 'cash' | 'card' | 'wallet'
}

// ─── Count-up hook ─────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, startDelay = 0) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target === 0) return
    let raf: number
    const timeout = setTimeout(() => {
      const startTime = performance.now()
      const step = (now: number) => {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setValue(Math.round(eased * target))
        if (progress < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, startDelay)
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
  }, [target, duration, startDelay])
  return value
}

// ─── Animated Stat Card ────────────────────────────────────────────────────────
interface StatCardProps {
  title: string
  value: number
  prefix?: string
  icon: React.ElementType
  topColor: string
  iconBg: string
  iconColor: string
  change?: number
  animDelay?: number
}

function AnimatedStatCard({ title, value, prefix = '', icon: Icon, topColor, iconBg, iconColor, change, animDelay = 0 }: StatCardProps) {
  const count = useCountUp(value, 1200, animDelay)
  const isPositive = (change ?? 0) >= 0
  return (
    <div
      className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="h-[3px]" style={{ background: topColor }} />
      <div className="p-4 md:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={`w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-sm ${iconBg}`}>
            <Icon size={16} className={`md:hidden ${iconColor}`} />
            <Icon size={18} className={`hidden md:block ${iconColor}`} />
          </div>
          {change !== undefined && (
            <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
          {prefix}{count.toLocaleString()}
        </p>
        <p className="text-[10px] md:text-[11px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{title}</p>
      </div>
    </div>
  )
}

// ─── Chart Card ───────────────────────────────────────────────────────────────
function ChartCard({ title, subtitle, action, children, animDelay = 0 }: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  animDelay?: number
}) {
  return (
    <div className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animationDelay: `${animDelay}ms` }}>
      <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500" />
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4 md:mb-5">
          <div>
            <h2 className="text-sm font-bold text-slate-800">{title}</h2>
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Static mock data ─────────────────────────────────────────────────────────
const HOURLY_DATA = [
  { hour: '8AM',  orders: 2,  revenue: 8.5   },
  { hour: '9AM',  orders: 5,  revenue: 21.0  },
  { hour: '10AM', orders: 8,  revenue: 34.75 },
  { hour: '11AM', orders: 6,  revenue: 27.0  },
  { hour: '12PM', orders: 11, revenue: 48.25 },
  { hour: '1PM',  orders: 9,  revenue: 39.0  },
  { hour: '2PM',  orders: 4,  revenue: 16.5  },
  { hour: '3PM',  orders: 3,  revenue: 11.0  },
]

const STATUS_PIPELINE = [
  { key: 'new',              label: 'New',        color: '#0ea5e9', bg: 'bg-sky-50',     text: 'text-sky-700'     },
  { key: 'accepted',         label: 'Accepted',   color: '#f59e0b', bg: 'bg-amber-50',   text: 'text-amber-700'   },
  { key: 'preparing',        label: 'Preparing',  color: '#f97316', bg: 'bg-orange-50',  text: 'text-orange-700'  },
  { key: 'out_for_delivery', label: 'On the Way', color: '#06b6d4', bg: 'bg-cyan-50',    text: 'text-cyan-700'    },
  { key: 'delivered',        label: 'Delivered',  color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
]

const STATUS_STYLES: Record<string, { badge: string; icon: React.ReactNode }> = {
  new:              { badge: 'bg-sky-50 text-sky-700 border-sky-100',             icon: <Package size={11} />     },
  accepted:         { badge: 'bg-amber-50 text-amber-700 border-amber-100',       icon: <CheckCircle size={11} /> },
  preparing:        { badge: 'bg-orange-50 text-orange-700 border-orange-100',    icon: <Clock size={11} />       },
  out_for_delivery: { badge: 'bg-cyan-50 text-cyan-700 border-cyan-100',          icon: <Truck size={11} />       },
  delivered:        { badge: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: <CheckCircle size={11} /> },
  rejected:         { badge: 'bg-red-50 text-red-700 border-red-100',             icon: <XCircle size={11} />     },
}

const PAYMENT_BADGE: Record<string, string> = {
  cash:   'bg-emerald-50 text-emerald-700',
  card:   'bg-sky-50 text-sky-700',
  wallet: 'bg-purple-50 text-purple-700',
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function StoreDashboard() {
  const { t, i18n } = useTranslation()
  const user    = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'

  const [orders, setOrders]       = useState<StoreOrder[]>(MOCK_ORDERS)
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const update = () => setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }))
    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [])

  const storeOrders = orders.filter(o => o.storeId === storeId)

  const counts = {
    new:              storeOrders.filter(o => o.status === 'new').length,
    accepted:         storeOrders.filter(o => o.status === 'accepted').length,
    preparing:        storeOrders.filter(o => o.status === 'preparing').length,
    out_for_delivery: storeOrders.filter(o => o.status === 'out_for_delivery').length,
    delivered:        storeOrders.filter(o => o.status === 'delivered').length,
    rejected:         storeOrders.filter(o => o.status === 'rejected').length,
  }

  const todayRevenue = storeOrders.reduce((s, o) => s + o.total, 0)
  const newOrders    = storeOrders.filter(o => o.status === 'new')
  const activeOrders = storeOrders.filter(o => !['delivered', 'rejected', 'new'].includes(o.status))

  const handleAction = (id: number, status: StoreOrder['status']) =>
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))

  const dateFormat = new Intl.DateTimeFormat(i18n.language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  }).format(new Date())

  const statCards: StatCardProps[] = [
    { title: t('store.dashboard.cards.newOrders', 'New Orders'),      value: counts.new,              icon: Package,     topColor: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', iconBg: 'bg-sky-50',     iconColor: 'text-sky-600',     change:  5,  animDelay: 0   },
    { title: t('store.dashboard.cards.accepted', 'Accepted'),         value: counts.accepted,         icon: CheckCircle, topColor: 'linear-gradient(90deg,#f59e0b,#fbbf24)', iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',   change:  2,  animDelay: 60  },
    { title: t('store.dashboard.cards.preparing', 'Preparing'),       value: counts.preparing,        icon: Clock,       topColor: 'linear-gradient(90deg,#f97316,#fb923c)', iconBg: 'bg-orange-50',  iconColor: 'text-orange-500',              animDelay: 120 },
    { title: t('store.dashboard.cards.outForDelivery', 'On the Way'), value: counts.out_for_delivery, icon: Truck,       topColor: 'linear-gradient(90deg,#06b6d4,#22d3ee)', iconBg: 'bg-cyan-50',    iconColor: 'text-cyan-600',    change:  8,  animDelay: 180 },
    { title: t('store.dashboard.cards.deliveredToday', 'Delivered'),  value: counts.delivered,        icon: CheckCircle, topColor: 'linear-gradient(90deg,#10b981,#34d399)', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 12,  animDelay: 240 },
    { title: t('store.dashboard.cards.rejected', 'Rejected'),         value: counts.rejected,         icon: XCircle,     topColor: 'linear-gradient(90deg,#ef4444,#f87171)', iconBg: 'bg-red-50',     iconColor: 'text-red-500',     change: -3,  animDelay: 300 },
  ]

  return (
    <>
      <style>{`
        @keyframes dash-in {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes header-in {
          from { opacity: 0; transform: translateY(-16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-blob {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(30px,-20px) scale(1.1); }
        }
        @keyframes hero-blob-2 {
          0%, 100% { transform: translate(0,0) scale(1); }
          50%       { transform: translate(-25px,25px) scale(0.9); }
        }
        @keyframes live-ping {
          0%        { transform: scale(1);   opacity: 1; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes urgent-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(14,165,233,0.35); }
          50%       { box-shadow: 0 0 0 8px rgba(14,165,233,0); }
        }
        @keyframes row-in {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .dash-card      { animation: dash-in 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-enter     { animation: header-in 0.6s cubic-bezier(0.22,1,0.36,1) both; }
        .hero-blob-1    { animation: hero-blob   14s ease-in-out infinite; }
        .hero-blob-2    { animation: hero-blob-2 10s ease-in-out infinite; }
        .live-ring      { animation: live-ping 1.8s cubic-bezier(0,0,0.2,1) infinite; }
        .urgent-card    { animation: urgent-pulse 2.2s ease-in-out infinite; }
        .order-row      { animation: row-in 0.4s cubic-bezier(0.22,1,0.36,1) both; }
        .pipe-scroll    { -ms-overflow-style:none; scrollbar-width:none; }
        .pipe-scroll::-webkit-scrollbar { display:none; }
      `}</style>

      {/*
        Outer wrapper: negative margin cancels the layout's p-4 md:p-6,
        then re-applies the same padding so inner content aligns correctly.
        This lets the gradient background fill edge-to-edge.
      */}
      <div className="space-y-4 md:space-y-6">

        {/* ── Hero Header ────────────────────────────────────────────────────── */}
        <div
          className="hero-enter relative overflow-hidden rounded-2xl p-4 md:p-6 shadow-lg"
          style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #0ea5e9 75%, #38bdf8 100%)' }}
        >
          <div className="hero-blob-1 absolute top-[-30px] right-[-30px] w-40 md:w-44 h-40 md:h-44 rounded-full bg-white/10 pointer-events-none" />
          <div className="hero-blob-2 absolute bottom-[-20px] right-[28%] w-24 md:w-28 h-24 md:h-28 rounded-full bg-white/[0.08] pointer-events-none" />
          <div className="hero-blob-1 absolute top-1/2 right-[12%] w-14 md:w-16 h-14 md:h-16 rounded-full bg-cyan-300/20 pointer-events-none" style={{ animationDelay: '3s' }} />
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
            {/* Title block */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-sky-100 text-[10px] font-semibold uppercase tracking-widest">Live</span>
              </div>
              <h1 className="text-xl md:text-2xl font-black text-white tracking-tight">
                {t('store.dashboard.title', 'Store Dashboard')}
              </h1>
              <p className="text-sky-100/80 text-xs md:text-sm mt-0.5 truncate">
                {user?.storeName || t('store.storeName', 'My Store')} · {dateFormat}
              </p>
            </div>

            {/* Quick-stat pills — row on mobile, same row on md+ */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 min-w-0">
                <ShoppingBag size={13} className="text-white flex-shrink-0" />
                <p className="text-white font-black text-sm leading-none">{storeOrders.length} <span className="font-semibold text-sky-100/70 text-[10px]">orders</span></p>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20 min-w-0">
                <DollarSign size={13} className="text-white flex-shrink-0" />
                <p className="text-white font-black text-sm leading-none truncate">KWD {todayRevenue.toFixed(3)}</p>
              </div>
              <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
                <Activity size={13} className="text-white flex-shrink-0" />
                <span className="text-white text-sm font-bold">{currentTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 6 Animated Stat Cards ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-3">
          {statCards.map(card => (
            <div key={card.title} className="w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)] xl:flex-1 xl:w-0 min-w-0">
              <AnimatedStatCard {...card} />
            </div>
          ))}
        </div>

        {/* ── Order Status Pipeline ──────────────────────────────────────────── */}
        <div className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animationDelay: '350ms' }}>
          <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500" />
          <div className="p-4 md:p-5">
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h2 className="text-sm font-bold text-slate-800">Order Pipeline</h2>
              <Link to="/store/orders" className="flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-700 group transition-colors">
                View All <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile: 3-column grid, no scroll */}
            <div className="grid grid-cols-3 gap-2 md:hidden">
              {STATUS_PIPELINE.map((stage) => {
                const count = counts[stage.key as keyof typeof counts] ?? 0
                const isActive = count > 0
                return (
                  <div key={stage.key} className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 ${isActive ? stage.bg + ' border border-slate-200 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                    <span className={`text-2xl font-black leading-none ${isActive ? stage.text : 'text-slate-200'}`}>{count}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-wider mt-1.5 text-center leading-tight ${isActive ? stage.text : 'text-slate-300'}`}>{stage.label}</span>
                    {isActive && <div className="w-4 h-1 rounded-full mt-1.5" style={{ background: stage.color }} />}
                  </div>
                )
              })}
            </div>

            {/* Desktop: horizontal flow with connecting arrows */}
            <div className="hidden md:flex items-center gap-2">
              {STATUS_PIPELINE.map((stage, i) => {
                const count = counts[stage.key as keyof typeof counts] ?? 0
                const isActive = count > 0
                return (
                  <React.Fragment key={stage.key}>
                    <div className={`flex flex-col items-center min-w-[88px] p-3.5 rounded-2xl flex-shrink-0 transition-all duration-300 ${isActive ? stage.bg + ' border border-slate-200 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                      <span className={`text-3xl font-black leading-none ${isActive ? stage.text : 'text-slate-200'}`}>{count}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 text-center ${isActive ? stage.text : 'text-slate-300'}`}>{stage.label}</span>
                      {isActive && <div className="w-5 h-1 rounded-full mt-1.5" style={{ background: stage.color }} />}
                    </div>
                    {i < STATUS_PIPELINE.length - 1 && (
                      <div className="flex items-center gap-0.5 flex-shrink-0">
                        <div className="w-4 h-px bg-slate-200" />
                        <div className="w-1 h-1 rounded-full bg-slate-300" />
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                      </div>
                    )}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Urgent New Orders ──────────────────────────────────────────────── */}
        {newOrders.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3 md:mb-4 flex-wrap">
              <span className="relative flex h-3 w-3 flex-shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-sky-500" />
              </span>
              <h2 className="text-sm font-bold text-slate-800">
                {newOrders.length} {t('store.dashboard.newOrdersRequired', 'New Orders Require Action')}
              </h2>
              <span className="px-2 py-0.5 bg-sky-500 text-white text-[10px] font-bold rounded-full animate-pulse uppercase tracking-wide">
                Urgent
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {newOrders.map((order, i) => (
                <div
                  key={order.id}
                  className="urgent-card bg-white rounded-2xl border-2 border-sky-200 shadow-sm overflow-hidden"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="h-[3px] bg-gradient-to-r from-sky-400 to-cyan-400" />
                  <div className="p-4 md:p-5">
                    <div className="flex items-start gap-3 mb-3 md:mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <p className="font-black text-slate-900 text-sm md:text-base">{order.orderNumber}</p>
                          <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold uppercase flex-shrink-0 ${PAYMENT_BADGE[order.paymentMethod]}`}>
                            {order.paymentMethod}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 truncate">{order.customer} · {order.items} items · {order.time}</p>
                      </div>
                      <p className="font-black text-slate-900 flex-shrink-0 whitespace-nowrap text-base md:text-xl">
                        KWD {order.total.toFixed(3)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAction(order.id, 'accepted')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 bg-emerald-500 text-white rounded-xl text-xs md:text-sm font-bold hover:bg-emerald-600 active:scale-95 transition-all shadow-sm shadow-emerald-200"
                      >
                        <CheckCircle size={13} />
                        {t('store.dashboard.accept', 'Accept')}
                      </button>
                      <button
                        onClick={() => handleAction(order.id, 'rejected')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 md:py-2.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs md:text-sm font-bold hover:bg-red-100 active:scale-95 transition-all"
                      >
                        <XCircle size={13} />
                        {t('store.dashboard.reject', 'Reject')}
                      </button>
                      <Link
                        to={`/store/orders/${order.id}`}
                        className="px-3 flex items-center justify-center border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-colors"
                      >
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Charts Row ─────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <ChartCard title="Today's Order Flow" subtitle="Hourly order count" animDelay={400}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOURLY_DATA} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="storeOrderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0ea5e9" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
                  formatter={(v) => [v, 'Orders']}
                />
                <Bar dataKey="orders" fill="url(#storeOrderGrad)" radius={[5, 5, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Revenue by Hour" subtitle="KWD earned per hour" animDelay={450}>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={HOURLY_DATA} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                <defs>
                  <linearGradient id="storeRevGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#10b981" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="#34d399" stopOpacity={0.4} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
                  formatter={(v) => [`KWD ${Number(v).toFixed(2)}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="url(#storeRevGrad)" radius={[5, 5, 0, 0]} maxBarSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* ── Active Orders List ─────────────────────────────────────────────── */}
        <div className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" style={{ animationDelay: '500ms' }}>
          <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500" />
          <div className="px-4 md:px-6 py-4 md:py-5 border-b border-slate-50 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-800">{t('store.dashboard.activeOrders', 'Active Orders')}</h2>
              <p className="text-xs text-slate-400 mt-0.5">{activeOrders.length} orders in progress</p>
            </div>
            <Link
              to="/store/orders"
              className="flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors group flex-shrink-0 ml-2"
            >
              {t('store.dashboard.viewAll', 'View All')}
              <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {storeOrders.filter(o => o.status !== 'new').map((order, i) => {
              const cfg = STATUS_STYLES[order.status]
              return (
                <Link
                  key={order.id}
                  to={`/store/orders/${order.id}`}
                  className="order-row flex items-center gap-3 px-4 md:px-6 py-3 md:py-4 hover:bg-sky-50/40 transition-colors group"
                  style={{ animationDelay: `${500 + i * 55}ms` }}
                >
                  {/* Icon */}
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-sky-50 group-hover:border-sky-100 group-hover:text-sky-500 transition-colors flex-shrink-0">
                    <ShoppingBag size={13} />
                  </div>

                  {/* Order info — takes remaining space */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs md:text-sm font-bold text-sky-500 group-hover:text-sky-600 transition-colors truncate">{order.orderNumber}</p>
                    <p className="text-[10px] md:text-xs text-slate-400 truncate">{order.customer} · {order.items} items</p>
                  </div>

                  {/* Status badge — hidden on small, visible on md+ */}
                  <span className={`hidden md:flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border flex-shrink-0 ${cfg.badge}`}>
                    {cfg.icon}
                    {order.status.replace(/_/g, ' ')}
                  </span>

                  {/* Price — always visible */}
                  <p className="text-xs md:text-sm font-black text-slate-800 flex-shrink-0 whitespace-nowrap">
                    KWD {order.total.toFixed(3)}
                  </p>
                </Link>
              )
            })}
            {storeOrders.filter(o => o.status !== 'new').length === 0 && (
              <p className="px-4 md:px-6 py-8 text-center text-sm text-slate-400">No active orders</p>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
