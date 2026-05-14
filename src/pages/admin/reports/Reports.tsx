import { useState } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Download, TrendingUp, ShoppingBag, Users, DollarSign } from 'lucide-react'
import { MOCK_SALES_DATA as SALES_DATA, MOCK_CATEGORY_DATA as CATEGORY_DATA, MOCK_STORE_PERF_DATA as STORE_DATA, MOCK_DELIVERY_SLA_DATA as DELIVERY_DATA } from '@/mock/mock.reports'


const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

type ReportView = 'sales' | 'orders' | 'stores' | 'delivery'

const REPORT_TABS: { id: ReportView; label: string; icon: React.ReactNode }[] = [
  { id: 'sales', label: 'Sales Revenue', icon: <DollarSign size={15} /> },
  { id: 'orders', label: 'Order Volume', icon: <ShoppingBag size={15} /> },
  { id: 'stores', label: 'Store Performance', icon: <TrendingUp size={15} /> },
  { id: 'delivery', label: 'Delivery SLA', icon: <Users size={15} /> },
]

export default function Reports() {
  const [view, setView] = useState<ReportView>('sales')
  const [period, setPeriod] = useState('month')

  const summaryCards = [
    { label: 'Total Revenue', value: 'KWD 82,800', change: '+18%', up: true },
    { label: 'Total Orders', value: '1,395', change: '+12%', up: true },
    { label: 'Avg. Order Value', value: 'KWD 59.4', change: '+5%', up: true },
    { label: 'Refund Rate', value: '2.4%', change: '-0.3%', up: false },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">Business performance insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={period} onChange={e => setPeriod(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
            <Download size={15} />Export
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map(card => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
            <p className="text-xs text-gray-500 mb-1">{card.label}</p>
            <p className="text-xl font-bold text-gray-900">{card.value}</p>
            <p className={`text-xs font-medium mt-1 ${card.up ? 'text-green-600' : 'text-red-500'}`}>{card.change} vs last period</p>
          </div>
        ))}
      </div>

      {/* Report tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 w-fit overflow-x-auto">
        {REPORT_TABS.map(t => (
          <button key={t.id} onClick={() => setView(t.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${view === t.id ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        {view === 'sales' && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Revenue Trend (KWD)</h3>
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={SALES_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => [`KWD ${Number(v).toLocaleString()}`, 'Revenue']} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}

        {view === 'orders' && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Order Volume by Category</h3>
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={CATEGORY_DATA} cx="50%" cy="50%" outerRadius={110} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false}>
                    {CATEGORY_DATA.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip formatter={(v) => [`${Number(v)}%`, 'Share']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 min-w-32">
                {CATEGORY_DATA.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: COLORS[i] }} />
                    <span className="text-sm text-gray-700">{d.name}</span>
                    <span className="text-sm font-medium text-gray-900 ml-auto">{d.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {view === 'stores' && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Store Performance</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={STORE_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis type="category" dataKey="store" width={90} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#3b82f6" name="Orders" radius={[0, 4, 4, 0]} />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue (KWD)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}

        {view === 'delivery' && (
          <>
            <h3 className="font-semibold text-gray-900 mb-4">Delivery SLA (% On-Time)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={DELIVERY_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v) => [`${Number(v)}%`]} />
                <Legend />
                <Bar dataKey="onTime" fill="#10b981" name="On Time" stackId="a" radius={[4, 4, 0, 0]} />
                <Bar dataKey="late" fill="#ef4444" name="Late" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </div>
  )
}
