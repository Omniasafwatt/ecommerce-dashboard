import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { mockDashboardData } from '@/mock/mock.dashboard'
import {
  ShoppingCart,
  DollarSign,
  Store,
  Clock,
  XCircle,
  RotateCcw,
  RefreshCw,
  Truck,
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
} from 'recharts'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  totalOrders: number
  totalSales: number
  activeStores: number
  pendingOrders: number
  cancelledOrders: number
  refundRequests: number
  returnRequests: number
  activeDrivers: number
  ordersByStatus: { name: string; value: number }[]
  salesByStore: { store: string; sales: number; orders: number }[]
  deliveryPerformance: { day: string; onTime: number; late: number; failed: number }[]
  recentOrders: {
    id: string
    orderNumber: string
    customer: string
    store: string
    status: string
    amount: number
    date: string
  }[]
  ordersTrend: {
    today: TrendPoint[]
    yesterday: TrendPoint[]
    last7Days: TrendPoint[]
    last30Days: TrendPoint[]
  }
}

interface TrendPoint { label: string; orders: number; revenue: number }
type OrdersPeriod = 'today' | 'yesterday' | '7days' | '30days'

// ─── Count-up hook ────────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1400, startDelay = 0) {
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

// ─── Animated Stat Card ───────────────────────────────────────────────────────

interface StatCardProps {
  title: string
  numericValue: number
  prefix?: string
  icon: React.ElementType
  topColor: string
  iconBg: string
  iconColor: string
  change?: number
  animDelay?: number
}

function AnimatedStatCard({ title, numericValue, prefix = '', icon: Icon, topColor, iconBg, iconColor, change, animDelay = 0 }: StatCardProps) {
  const count = useCountUp(numericValue, 1400, animDelay)
  const isPositive = (change ?? 0) >= 0

  return (
    <div
      className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-default group"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="h-[3px]" style={{ background: topColor }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${iconBg}`}>
            <Icon size={20} className={iconColor} />
          </div>
          {change !== undefined && (
            <span className={`flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'
            }`}>
              {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
        <p className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1.5">
          {prefix}{count.toLocaleString()}
        </p>
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      </div>
    </div>
  )
}

// ─── Chart Card ───────────────────────────────────────────────────────────────

function ChartCard({
  title,
  subtitle,
  action,
  children,
  className = '',
  animDelay = 0,
}: {
  title: string
  subtitle?: string
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  animDelay?: number
}) {
  return (
    <div
      className={`dash-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden ${className}`}
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-5">
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

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  delivered: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  pending: 'bg-amber-50 text-amber-700 border-amber-100',
  in_transit: 'bg-sky-50 text-sky-700 border-sky-100',
  cancelled: 'bg-red-50 text-red-700 border-red-100',
  returned: 'bg-slate-100 text-slate-600 border-slate-200',
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize border ${STATUS_STYLES[status] ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
    {status.replace('_', ' ')}
  </span>
)

// ─── Chart colors ─────────────────────────────────────────────────────────────

const PIE_COLORS = ['#10b981', '#f59e0b', '#0ea5e9', '#ef4444', '#06b6d4']

const PERIOD_LABELS: Record<OrdersPeriod, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7days': '7 Days',
  '30days': '30 Days',
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { t } = useTranslation()
  const [currentDate, setCurrentDate] = useState('')
  const [ordersPeriod, setOrdersPeriod] = useState<OrdersPeriod>('7days')

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    )
  }, [])

  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async (): Promise<DashboardData> => {
      await new Promise((r) => setTimeout(r, 600))
      return mockDashboardData
    },
    staleTime: 60_000,
  })

  // ── Loading skeleton ───────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="p-6 space-y-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 60%, #f8fafc 100%)', minHeight: '100vh' }}>
        <style>{`
          @keyframes skel-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
          .skel { animation: skel-pulse 1.6s ease-in-out infinite; background: linear-gradient(90deg, #e2e8f0 0%, #f0f9ff 50%, #e2e8f0 100%); background-size: 200% 100%; border-radius: 12px; }
        `}</style>
        <div className="skel h-28 rounded-2xl" />
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="skel h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skel h-28 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => <div key={i} className="skel h-72 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  // ── Error state ────────────────────────────────────────────────────────────
  if (isError || !data) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <XCircle className="h-8 w-8 text-red-400" />
          </div>
          <p className="text-slate-700 font-semibold">{t('dashboard.failedLoad', 'Failed to load dashboard data')}</p>
          <p className="text-slate-400 text-sm mt-1">{t('dashboard.failedLoadDesc', 'Please refresh the page and try again')}</p>
        </div>
      </div>
    )
  }

  const statCards: StatCardProps[] = [
    { title: t('dashboard.totalOrders', 'Total Orders'), numericValue: data.totalOrders, icon: ShoppingCart, topColor: 'linear-gradient(90deg,#0ea5e9,#38bdf8)', iconBg: 'bg-sky-50', iconColor: 'text-sky-600', change: 12.4, animDelay: 0 },
    { title: t('dashboard.totalSales', 'Total Sales'), numericValue: data.totalSales, prefix: 'KWD ', icon: DollarSign, topColor: 'linear-gradient(90deg,#10b981,#34d399)', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', change: 8.1, animDelay: 60 },
    { title: 'Active Stores', numericValue: data.activeStores, icon: Store, topColor: 'linear-gradient(90deg,#06b6d4,#22d3ee)', iconBg: 'bg-cyan-50', iconColor: 'text-cyan-600', change: 2.3, animDelay: 120 },
    { title: 'Pending Orders', numericValue: data.pendingOrders, icon: Clock, topColor: 'linear-gradient(90deg,#f59e0b,#fbbf24)', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', change: -5.2, animDelay: 180 },
    { title: 'Cancelled Orders', numericValue: data.cancelledOrders, icon: XCircle, topColor: 'linear-gradient(90deg,#ef4444,#f87171)', iconBg: 'bg-red-50', iconColor: 'text-red-500', change: -3.1, animDelay: 240 },
    { title: t('dashboard.refundRequests', 'Refund Requests'), numericValue: data.refundRequests, icon: RotateCcw, topColor: 'linear-gradient(90deg,#f97316,#fb923c)', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', change: 1.8, animDelay: 300 },
  ]

  const secondRowCards: StatCardProps[] = [
    { title: t('dashboard.returnRequests', 'Return Requests'), numericValue: data.returnRequests, icon: RefreshCw, topColor: 'linear-gradient(90deg,#0ea5e9,#7dd3fc)', iconBg: 'bg-sky-50', iconColor: 'text-sky-500', change: -2.5, animDelay: 360 },
    { title: 'Active Drivers', numericValue: data.activeDrivers, icon: Truck, topColor: 'linear-gradient(90deg,#14b8a6,#2dd4bf)', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', change: 6.7, animDelay: 420 },
  ]

  const trendData = {
    today: data.ordersTrend.today,
    yesterday: data.ordersTrend.yesterday,
    '7days': data.ordersTrend.last7Days,
    '30days': data.ordersTrend.last30Days,
  }[ordersPeriod]

  const trendTotals = trendData.reduce(
    (acc, d) => ({ orders: acc.orders + d.orders, revenue: acc.revenue + d.revenue }),
    { orders: 0, revenue: 0 }
  )
  const avgOrderValue = trendTotals.orders > 0 ? trendTotals.revenue / trendTotals.orders : 0
  const isHourly = ordersPeriod === 'today' || ordersPeriod === 'yesterday'

  return (
    <div
      className="p-6 space-y-6 min-h-screen"
      style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #f0f9ff 50%, #f8fafc 100%)' }}
    >
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
          0%   { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        .dash-card {
          animation: dash-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hero-enter {
          animation: header-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .hero-blob-1 { animation: hero-blob 14s ease-in-out infinite; }
        .hero-blob-2 { animation: hero-blob-2 10s ease-in-out infinite; }
        .live-ring {
          animation: live-ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>

      {/* ── Hero Header ───────────────────────────────────────────────────── */}
      <div
        className="hero-enter relative overflow-hidden rounded-2xl p-6 shadow-lg"
        style={{ background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #0ea5e9 75%, #38bdf8 100%)' }}
      >
        {/* Background blobs */}
        <div className="hero-blob-1 absolute top-[-30px] right-[-30px] w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="hero-blob-2 absolute bottom-[-20px] right-[30%] w-24 h-24 rounded-full bg-white/8 pointer-events-none" />
        <div className="hero-blob-1 absolute top-1/2 right-[10%] w-16 h-16 rounded-full bg-cyan-300/20 pointer-events-none" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="live-ring absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-sky-100 text-xs font-semibold uppercase tracking-widest">
                {t('dashboard.liveData', 'Live Data')}
              </span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {t('nav.dashboard', 'Dashboard')}
            </h1>
            <p className="text-sky-100/80 text-sm mt-0.5">{currentDate}</p>
          </div>

          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-white/20 self-start sm:self-center">
            <Activity size={15} className="text-white" />
            <span className="text-white text-sm font-semibold">
              {t('dashboard.liveData', 'Live Data')}
            </span>
            <div className="w-px h-4 bg-white/30" />
            <span className="text-sky-100 text-xs">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* ── 6 Stat Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <AnimatedStatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── 2 Secondary Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-sm">
        {secondRowCards.map((card) => (
          <AnimatedStatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Orders Summary ────────────────────────────────────────────────── */}
      <ChartCard
        title={t('dashboard.ordersSummary', 'Orders Summary')}
        animDelay={100}
        action={
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            {(Object.keys(PERIOD_LABELS) as OrdersPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setOrdersPeriod(p)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 ${
                  ordersPeriod === p
                    ? 'bg-sky-500 text-white shadow-sm shadow-sky-200'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-white/70'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        }
      >
        {/* Mini stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="relative overflow-hidden bg-gradient-to-br from-sky-50 to-sky-100/60 rounded-2xl p-4 border border-sky-100">
            <div className="absolute top-0 right-0 w-12 h-12 bg-sky-200/40 rounded-full -translate-y-4 translate-x-4" />
            <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wider mb-1">
              {t('dashboard.ordersLabel', 'Orders')}
            </p>
            <p className="text-2xl font-black text-sky-900">{trendTotals.orders.toLocaleString()}</p>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100/60 rounded-2xl p-4 border border-emerald-100">
            <div className="absolute top-0 right-0 w-12 h-12 bg-emerald-200/40 rounded-full -translate-y-4 translate-x-4" />
            <p className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider mb-1">
              {t('dashboard.revenue', 'Revenue')}
            </p>
            <p className="text-2xl font-black text-emerald-900">KWD {trendTotals.revenue.toLocaleString()}</p>
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-cyan-50 to-cyan-100/60 rounded-2xl p-4 border border-cyan-100">
            <div className="absolute top-0 right-0 w-12 h-12 bg-cyan-200/40 rounded-full -translate-y-4 translate-x-4" />
            <p className="text-[11px] font-bold text-cyan-600 uppercase tracking-wider mb-1">Avg. Order</p>
            <p className="text-2xl font-black text-cyan-900">KWD {avgOrderValue.toFixed(2)}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                <stop offset="100%" stopColor="#38bdf8" stopOpacity={0.7} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              axisLine={false}
              tickLine={false}
              interval={ordersPeriod === '30days' ? 4 : 0}
              angle={ordersPeriod === '30days' ? -35 : 0}
              textAnchor={ordersPeriod === '30days' ? 'end' : 'middle'}
              height={ordersPeriod === '30days' ? 45 : 30}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} width={40} axisLine={false} tickLine={false} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11, fill: '#94a3b8' }}
              width={48}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
              formatter={(value, name) =>
                name === 'Orders'
                  ? [Number(value).toLocaleString(), 'Orders']
                  : [`KWD ${Number(value).toLocaleString()}`, 'Revenue']
              }
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="Orders"
              fill="url(#barGrad)"
              radius={[5, 5, 0, 0]}
              maxBarSize={isHourly ? 14 : 28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 5, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Two side-by-side charts ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie chart */}
        <ChartCard title="Orders by Status" animDelay={150}>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <defs>
                {PIE_COLORS.map((color, i) => (
                  <radialGradient key={i} id={`pieGrad${i}`} cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </radialGradient>
                ))}
              </defs>
              <Pie
                data={data.ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={62}
                outerRadius={102}
                paddingAngle={3}
                dataKey="value"
              >
                {data.ordersByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={`url(#pieGrad${index % PIE_COLORS.length})`} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
                formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Bar chart */}
        <ChartCard title={t('dashboard.salesByStore', 'Sales by Store')} animDelay={200}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.salesByStore} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="store" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
                formatter={(value) => [`KWD ${Number(value).toLocaleString()}`, 'Sales']}
              />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Bar dataKey="sales" name="Sales (KWD)" fill="url(#salesGrad)" radius={[5, 5, 0, 0]} />
              <Bar dataKey="orders" name="Orders" fill="url(#ordersGrad)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Delivery Performance ───────────────────────────────────────────── */}
      <ChartCard
        title={t('dashboard.deliveryPerformance', 'Delivery Performance')}
        subtitle="Last 7 days"
        animDelay={250}
        action={
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-sky-600">Live</span>
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.deliveryPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.12)', fontSize: 12 }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
            <Line type="monotone" dataKey="onTime" name={t('dashboard.onTime', 'On Time')} stroke="#10b981" strokeWidth={2.5} dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="late" name={t('dashboard.late', 'Late')} stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="failed" name={t('dashboard.failed', 'Failed')} stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4, fill: '#ef4444', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* ── Recent Orders Table ────────────────────────────────────────────── */}
      <div
        className="dash-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        style={{ animationDelay: '300ms' }}
      >
        <div className="h-[3px] bg-gradient-to-r from-sky-400 via-cyan-300 to-sky-500" />
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Recent Orders</h2>
          <button className="flex items-center gap-1 text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors group">
            {t('dashboard.viewAllOrders', 'View all orders')}
            <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                {['Order #', 'Customer', 'Store', 'Status', 'Amount', 'Date'].map((col) => (
                  <th key={col} className={`px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider ${col === 'Amount' ? 'text-right' : 'text-left'}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className="border-b border-slate-50 hover:bg-sky-50/40 transition-colors group"
                  style={{ animationDelay: `${300 + i * 40}ms` }}
                >
                  <td className="px-6 py-4 font-bold text-sky-500 group-hover:text-sky-600 transition-colors">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{order.store}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-800">
                    KWD {order.amount.toFixed(3)}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
