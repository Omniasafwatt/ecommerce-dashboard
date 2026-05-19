import { useState, useRef, useEffect } from 'react'
import { Search, Send, User, Package } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { MOCK_ADMIN_CONVOS as MOCK_CONVOS } from '@/mock/mock.chat'

interface Message {
  id: number
  sender: 'admin' | 'customer' | 'store' | 'driver'
  text: string
  time: string
}

interface Conversation {
  id: number
  orderId: string
  customer: string
  subject: string
  lastMessage: string
  lastTime: string
  unread: number
  status: 'open' | 'resolved'
  messages: Message[]
}


const SENDER_STYLES: Record<string, { bg: string; align: string }> = {
  admin: { bg: 'bg-sky-500 text-white', align: 'items-end' },
  customer: { bg: 'bg-gray-100 text-gray-900', align: 'items-start' },
  store: { bg: 'bg-purple-100 text-purple-900', align: 'items-start' },
  driver: { bg: 'bg-orange-100 text-orange-900', align: 'items-start' },
}

export default function AdminChat() {
  const { t } = useTranslation()
  const [convos, setConvos] = useState<Conversation[]>(MOCK_CONVOS)
  const [selected, setSelected] = useState<Conversation | null>(MOCK_CONVOS[0])
  const [input, setInput] = useState('')
  const [search, setSearch] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages.length])

  const handleSend = () => {
    if (!input.trim() || !selected) return
    const msg: Message = { id: Date.now(), sender: 'admin', text: input.trim(), time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) }
    const updated = convos.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, msg], lastMessage: input.trim(), lastTime: msg.time } : c)
    setConvos(updated)
    setSelected(updated.find(c => c.id === selected.id) || null)
    setInput('')
  }

  const handleSelect = (c: Conversation) => {
    setConvos(prev => prev.map(conv => conv.id === c.id ? { ...conv, unread: 0 } : conv))
    setSelected({ ...c, unread: 0 })
  }

  const filteredConvos = convos.filter(c =>
    !search || c.customer.toLowerCase().includes(search.toLowerCase()) || c.orderId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{t('chat.chatDashboard', 'Chat Dashboard')}</h1>
        <p className="text-sm text-gray-500 mt-1">{convos.filter(c => c.unread > 0).length} {t('chat.unreadConversations', 'unread conversations')}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: 500 }}>
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r border-gray-200 flex flex-col flex-shrink-0">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="overflow-y-auto flex-1">
              {filteredConvos.map(c => (
                <button key={c.id} onClick={() => handleSelect(c)} className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected?.id === c.id ? 'bg-blue-50' : ''}`}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">{c.customer}</p>
                        {c.unread > 0 && <span className="w-4 h-4 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{c.unread}</span>}
                      </div>
                      <p className="text-xs text-blue-500 mb-0.5">{c.orderId}</p>
                      <p className="text-xs text-gray-500 truncate">{c.lastMessage}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <p className="text-xs text-gray-400">{c.lastTime}</p>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${c.status === 'open' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat area */}
          {selected ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-400" />
                    <p className="font-semibold text-gray-900">{selected.customer}</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Package size={12} className="text-blue-500" />
                    <p className="text-xs text-sky-600">{selected.orderId}</p>
                    <span className="text-gray-300">·</span>
                    <p className="text-xs text-gray-500">{selected.subject}</p>
                  </div>
                </div>
                <button onClick={() => setConvos(prev => prev.map(c => c.id === selected.id ? { ...c, status: 'resolved' } : c))}
                  className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600">
                  {t('chat.markResolved', 'Mark Resolved')}
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.messages.map(msg => {
                  const style = SENDER_STYLES[msg.sender]
                  return (
                    <div key={msg.id} className={`flex flex-col ${style.align}`}>
                      <div className={`max-w-xs lg:max-w-md px-3 py-2 rounded-xl text-sm ${style.bg}`}>
                        {msg.text}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 mx-1">{msg.sender} · {msg.time}</p>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-gray-100 flex gap-2">
                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500" />
                <button onClick={handleSend} disabled={!input.trim()} className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              {t('chat.selectConversation', 'Select a conversation')}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
