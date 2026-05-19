import { useState, useRef, useEffect } from 'react'
import { Send, Package, Image as ImageIcon, ArrowLeft } from 'lucide-react'
import { useAppSelector } from '@/store'
import { selectUser } from '@/store/slices/authSlice'
import { MOCK_STORE_THREADS } from '@/mock/mock.chat'
import { useTranslation } from 'react-i18next'

interface Message {
  id: number
  sender: 'store' | 'customer'
  text: string
  time: string
  image?: string
}

interface ChatThread {
  id: number
  storeId: string
  orderId: string
  customer: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}


export default function StoreChat() {
  const { t } = useTranslation()
  const user = useAppSelector(selectUser)
  const storeId = user?.storeId || '1'

  const [threads, setThreads] = useState<ChatThread[]>(MOCK_STORE_THREADS)
  const storeThreads = threads.filter(t => t.storeId === storeId)
  const [selected, setSelected] = useState<ChatThread | null>(storeThreads[0] || null)
  const [input, setInput] = useState('')
  const [mobileView, setMobileView] = useState<'threads' | 'chat'>('threads')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages.length])

  const handleSend = () => {
    if (!input.trim() || !selected) return
    const msg: Message = {
      id: Date.now(), sender: 'store', text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
    const updated = threads.map(t => t.id === selected.id ? { ...t, messages: [...t.messages, msg], lastMessage: input.trim(), lastTime: msg.time } : t)
    setThreads(updated)
    setSelected(updated.find(t => t.id === selected.id) || null)
    setInput('')
  }

  const handleSelect = (t: ChatThread) => {
    setThreads(prev => prev.map(thread => thread.id === t.id ? { ...thread, unread: 0 } : thread))
    setSelected({ ...t, unread: 0 })
    setMobileView('chat')
  }

  const totalUnread = storeThreads.reduce((sum, t) => sum + t.unread, 0)

  return (
    <div>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">{t('nav.chat', 'Order Chats')}</h1>
        <p className="text-sm text-gray-500 mt-1">{totalUnread > 0 ? `${totalUnread} unread message${totalUnread > 1 ? 's' : ''}` : 'All caught up'}</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)', minHeight: 480 }}>
        <div className="flex h-full">

          {/* Thread list — full screen on mobile, fixed 288px on desktop */}
          <div className={`border-r border-gray-200 flex flex-col flex-shrink-0 w-full md:w-72 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
            <div className="overflow-y-auto flex-1">
              {storeThreads.map(t => (
                <button
                  key={t.id}
                  onClick={() => handleSelect(t)}
                  className={`w-full text-left p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selected?.id === t.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="text-sm font-medium text-gray-900 truncate">{t.customer}</p>
                        {t.unread > 0 && (
                          <span className="w-4 h-4 bg-sky-500 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{t.unread}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 mb-0.5">
                        <Package size={11} className="text-blue-400 flex-shrink-0" />
                        <span className="text-xs text-blue-500">{t.orderId}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{t.lastMessage}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex-shrink-0">{t.lastTime}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat panel — full screen on mobile when active */}
          {selected ? (
            <div className={`flex-1 flex flex-col min-w-0 w-full ${mobileView === 'threads' ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-3 md:p-4 border-b border-gray-100 flex items-center gap-2">
                {/* Back to threads — mobile only */}
                <button
                  onClick={() => setMobileView('threads')}
                  className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 flex-shrink-0"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{selected.customer}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Package size={12} className="text-blue-400 flex-shrink-0" />
                    <p className="text-xs text-sky-600">{selected.orderId}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {selected.messages.map(msg => (
                  <div key={msg.id} className={`flex flex-col ${msg.sender === 'store' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm ${msg.sender === 'store' ? 'bg-sky-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                      {msg.text}
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 mx-1">{msg.sender === 'store' ? 'You' : selected.customer} · {msg.time}</p>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <div className="p-3 border-t border-gray-100 flex gap-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex-shrink-0">
                  <ImageIcon size={16} />
                </button>
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 min-w-0 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 flex-shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          ) : (
            <div className={`flex-1 flex items-center justify-center text-gray-400 text-sm ${mobileView === 'threads' ? 'hidden md:flex' : 'flex'}`}>
              Select a conversation
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
