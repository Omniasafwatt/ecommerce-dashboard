import { useState } from 'react'
import { Wallet as WalletIcon, Search, Plus, Minus, ArrowUpRight, ArrowDownLeft, Download } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface Transaction {
  id: number
  type: 'credit' | 'debit' | 'refund' | 'usage'
  amount: number
  balanceAfter: number
  reference?: string
  note: string
  date: string
}

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  balance: number
  transactions: Transaction[]
}

const MOCK_CUSTOMER: Customer = {
  id: 1, name: 'Ahmed Al-Rashid', email: 'ahmed@example.com', phone: '+965 1234 5678', balance: 8.750,
  transactions: [
    { id: 1, type: 'credit', amount: 5.000, balanceAfter: 8.750, note: 'Manual credit by admin', date: '2025-05-10 09:00' },
    { id: 2, type: 'refund', amount: 3.750, balanceAfter: 3.750, reference: 'ORD-2025-0005', note: 'Refund for cancelled order', date: '2025-05-09 11:30' },
    { id: 3, type: 'usage', amount: -2.000, balanceAfter: 0, reference: 'ORD-2025-0003', note: 'Used on order', date: '2025-05-08 10:00' },
    { id: 4, type: 'credit', amount: 2.000, balanceAfter: 2.000, note: 'Welcome bonus', date: '2025-04-01 00:00' },
  ],
}

const TYPE_STYLES: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  credit: { color: 'text-green-600', icon: <ArrowUpRight size={14} />, label: 'Credit' },
  debit: { color: 'text-red-600', icon: <ArrowDownLeft size={14} />, label: 'Debit' },
  refund: { color: 'text-sky-600', icon: <ArrowUpRight size={14} />, label: 'Refund' },
  usage: { color: 'text-gray-600', icon: <ArrowDownLeft size={14} />, label: 'Usage' },
}

export default function WalletManagement() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [searched, setSearched] = useState(false)
  const [modalAction, setModalAction] = useState<'credit' | 'debit' | null>(null)
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setCustomer(MOCK_CUSTOMER)
      setSearched(true)
    }
  }

  const handleTransaction = () => {
    if (!customer || !amount || !note) return
    const value = parseFloat(amount)
    const isCredit = modalAction === 'credit'
    const newBalance = isCredit ? customer.balance + value : customer.balance - value
    const newTx: Transaction = {
      id: Date.now(), type: modalAction!, amount: isCredit ? value : value,
      balanceAfter: newBalance, note, date: new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    setCustomer(prev => prev ? { ...prev, balance: newBalance, transactions: [newTx, ...prev.transactions] } : prev)
    setModalAction(null)
    setAmount('')
    setNote('')
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('nav.wallet', 'Wallet Management')}</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage customer wallets</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Find Customer</p>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder="Search by name, email, or phone..." className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <button onClick={handleSearch} className="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm font-medium hover:bg-sky-600">Search</button>
        </div>
      </div>

      {searched && customer && (
        <>
          {/* Customer info + balance */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
                <p className="text-sm text-gray-500">{customer.email}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-1">Current Balance</p>
                <p className="text-3xl font-bold text-gray-900">KWD {customer.balance.toFixed(3)}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              <button onClick={() => setModalAction('credit')} className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">
                <Plus size={14} />Credit Wallet
              </button>
              <button onClick={() => setModalAction('debit')} className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700">
                <Minus size={14} />Debit Wallet
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 ml-auto">
                <Download size={14} />Export Ledger
              </button>
            </div>
          </div>

          {/* Transactions ledger */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Full Transaction Ledger</h3>
              <p className="text-xs text-gray-500 mt-0.5">{customer.transactions.length} transactions</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {['Date', 'Type', 'Amount', 'Balance After', 'Reference', 'Note'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customer.transactions.map(tx => {
                    const style = TYPE_STYLES[tx.type]
                    return (
                      <tr key={tx.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{tx.date}</td>
                        <td className="px-4 py-3">
                          <div className={`flex items-center gap-1.5 text-sm font-medium ${style.color}`}>
                            {style.icon}{style.label}
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-sm font-semibold ${tx.type === 'debit' || tx.type === 'usage' ? 'text-red-600' : 'text-green-600'}`}>
                          {tx.type === 'debit' || tx.type === 'usage' ? '-' : '+'}KWD {tx.amount.toFixed(3)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">KWD {tx.balanceAfter.toFixed(3)}</td>
                        <td className="px-4 py-3 text-sm text-sky-600">{tx.reference || '—'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{tx.note}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {searched && !customer && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <WalletIcon size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No customer found. Try a different search.</p>
        </div>
      )}

      {/* Credit/Debit Modal */}
      {modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4">
            <div className="p-5 border-b">
              <h3 className="font-semibold text-gray-900">{modalAction === 'credit' ? 'Credit Wallet' : 'Debit Wallet'}</h3>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KWD) *</label>
                <input type="number" step="0.001" value={amount} onChange={e => setAmount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" placeholder="0.000" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" placeholder="Reason for this transaction..." />
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button onClick={() => setModalAction(null)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm">Cancel</button>
              <button onClick={handleTransaction} disabled={!amount || !note}
                className={`flex-1 px-4 py-2 text-white rounded-lg text-sm font-medium disabled:opacity-50 ${modalAction === 'credit' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}>
                Confirm {modalAction === 'credit' ? 'Credit' : 'Debit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
