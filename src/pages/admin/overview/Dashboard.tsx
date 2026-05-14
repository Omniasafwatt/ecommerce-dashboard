import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
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

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  color: string
  change?: number
}

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

// ─── Stat Card ────────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, color, change }: StatCardProps) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {change !== undefined && (
        <p className={`text-xs ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
        </p>
      )}
    </div>
  </div>
)

// ─── Status Badge ─────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  delivered: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  in_transit: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
  returned: 'bg-gray-100 text-gray-700',
}

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[status] ?? 'bg-gray-100 text-gray-600'}`}>
    {status.replace('_', ' ')}
  </span>
)

// ─── Chart Colors ─────────────────────────────────────────────────────────────

const PIE_COLORS = ['#22c55e', '#eab308', '#3b82f6', '#ef4444', '#8b5cf6']

// ─── Dashboard Component ──────────────────────────────────────────────────────

const PERIOD_LABELS: Record<OrdersPeriod, string> = {
  today: 'Today',
  yesterday: 'Yesterday',
  '7days': '7 Days',
  '30days': '30 Days',
}

export default function Dashboard() {
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
      // In production, replace with: return (await adminApi.getDashboardStats()).data
      await new Promise((r) => setTimeout(r, 600))
      return mockDashboardData
    },
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        {/* Header skeleton */}
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
        {/* Stat cards skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-24 animate-pulse bg-gray-100" />
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 h-72 animate-pulse bg-gray-100" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">Failed to load dashboard data</p>
          <p className="text-gray-400 text-sm">Please refresh the page and try again</p>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: 'Total Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingCart, color: 'bg-blue-500', change: 12.4 },
    { title: 'Total Sales', value: `KWD ${data.totalSales.toLocaleString()}`, icon: DollarSign, color: 'bg-green-500', change: 8.1 },
    { title: 'Active Stores', value: data.activeStores, icon: Store, color: 'bg-purple-500', change: 2.3 },
    { title: 'Pending Orders', value: data.pendingOrders.toLocaleString(), icon: Clock, color: 'bg-yellow-500', change: -5.2 },
    { title: 'Cancelled Orders', value: data.cancelledOrders.toLocaleString(), icon: XCircle, color: 'bg-red-500', change: -3.1 },
    { title: 'Refund Requests', value: data.refundRequests.toLocaleString(), icon: RotateCcw, color: 'bg-orange-500', change: 1.8 },
  ]

  const secondRowCards = [
    { title: 'Return Requests', value: data.returnRequests.toLocaleString(), icon: RefreshCw, color: 'bg-indigo-500', change: -2.5 },
    { title: 'Active Drivers', value: data.activeDrivers.toLocaleString(), icon: Truck, color: 'bg-teal-500', change: 6.7 },
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">{currentDate}</p>
        </div>
        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm text-gray-600 shadow-sm">
          <RefreshCw className="h-4 w-4" />
          <span>Live data</span>
        </div>
      </div>

      {/* ── First Stats Row (6 cards) ── */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Second Stats Row (2 cards) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        {secondRowCards.map((card) => (
          <StatCard key={card.title} {...card} />
        ))}
      </div>

      {/* ── Orders Summary Chart ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-gray-800">Orders Summary</h2>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(Object.keys(PERIOD_LABELS) as OrdersPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setOrdersPeriod(p)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  ordersPeriod === p
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-blue-50 rounded-xl p-4">
            <p className="text-xs font-medium text-blue-600 mb-1">Total Orders</p>
            <p className="text-2xl font-bold text-blue-900">{trendTotals.orders.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <p className="text-xs font-medium text-green-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-900">KWD {trendTotals.revenue.toLocaleString()}</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-xs font-medium text-purple-600 mb-1">Avg Order Value</p>
            <p className="text-2xl font-bold text-purple-900">KWD {avgOrderValue.toFixed(3)}</p>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={trendData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              interval={ordersPeriod === '30days' ? 4 : 0}
              angle={ordersPeriod === '30days' ? -35 : 0}
              textAnchor={ordersPeriod === '30days' ? 'end' : 'middle'}
              height={ordersPeriod === '30days' ? 45 : 30}
            />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} width={40} />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 11 }}
              width={48}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              formatter={(value, name) =>
                name === 'Orders'
                  ? [Number(value).toLocaleString(), 'Orders']
                  : [`KWD ${Number(value).toLocaleString()}`, 'Revenue']
              }
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="orders"
              name="Orders"
              fill="#3b82f6"
              radius={[3, 3, 0, 0]}
              maxBarSize={isHourly ? 14 : 28}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#10b981"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* ── Charts Row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Orders by Status – Pie Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Orders by Status</h2>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.ordersByStatus}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {data.ordersByStatus.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [Number(value).toLocaleString(), 'Orders']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Store – Bar Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Sales by Store</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.salesByStore} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="store" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => [`KWD ${Number(value).toLocaleString()}`, 'Sales']} />
              <Legend />
              <Bar dataKey="sales" name="Sales (KWD)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="orders" name="Orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Delivery Performance – Line Chart ── */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Delivery Performance</h2>
          <span className="text-xs text-gray-400">Last 7 days</span>
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.deliveryPerformance} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="onTime" name="On Time" stroke="#22c55e" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="late" name="Late" stroke="#eab308" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="failed" name="Failed" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-800">Recent Orders</h2>
          <span className="text-xs text-blue-600 hover:underline cursor-pointer">View all orders →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order #</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Store</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-blue-600">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-gray-700">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-600">{order.store}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">KWD {order.amount.toFixed(3)}</td>
                  <td className="px-6 py-4 text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
