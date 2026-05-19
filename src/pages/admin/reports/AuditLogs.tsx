import { useState } from 'react'
import { Search, Download, Shield } from 'lucide-react'
import { MOCK_AUDIT_LOGS as MOCK_LOGS } from '@/mock/mock.audit'
import { useTranslation } from 'react-i18next'

const SEVERITY_STYLES: Record<string, string> = {
  info: 'bg-blue-100 text-blue-700',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-700',
}

export default function AuditLogs() {
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [filterModule, setFilterModule] = useState('')
  const [filterSeverity, setFilterSeverity] = useState('')

  const modules = [...new Set(MOCK_LOGS.map(l => l.module))]

  const filtered = MOCK_LOGS.filter(log =>
    (!filterModule || log.module === filterModule) &&
    (!filterSeverity || log.severity === filterSeverity) &&
    (!search || log.actor.toLowerCase().includes(search.toLowerCase()) || log.action.toLowerCase().includes(search.toLowerCase()) || log.target.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.auditLogs', 'Audit Logs')}</h1>
          <p className="text-sm text-gray-500 mt-1">All admin actions are logged for compliance</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
          <Download size={15} />Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search logs..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <select value={filterModule} onChange={e => setFilterModule(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Modules</option>
            {modules.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg">
            <option value="">All Severity</option>
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Timestamp', 'Actor', 'Role', 'Action', 'Module', 'Target', 'IP', 'Severity'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-800 font-medium">{log.actor}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">{log.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Shield size={12} className="text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-mono text-gray-700">{log.action}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.module}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 max-w-xs truncate">{log.target}</td>
                  <td className="px-4 py-3 text-xs font-mono text-gray-500">{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLES[log.severity]}`}>{log.severity}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-8 text-center text-sm text-gray-500">No audit logs found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400">
          Showing {filtered.length} of {MOCK_LOGS.length} entries
        </div>
      </div>
    </div>
  )
}
