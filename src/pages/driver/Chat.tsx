import { useState, useRef, useEffect } from 'react'
import { Send, Image as ImageIcon, ChevronLeft } from 'lucide-react'
import { MOCK_DRIVER_CHATS } from '@/mock/mock.chat'

interface Message {
  id: number
  sender: 'driver' | 'other'
  text: string
  time: string
}

interface ChatContact {
  id: number
  name: string
  role: 'customer' | 'support'
  orderId?: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}


export default function DriverChat() {
  const [chats, setChats] = useState<ChatContact[]>(MOCK_DRIVER_CHATS)
  const [selected, setSelected] = useState<ChatContact | null>(null)
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected?.messages.length])

  const handleSend = () => {
    if (!input.trim() || !selected) return
    const msg: Message = {
      id: Date.now(), sender: 'driver', text: input.trim(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    }
    const updated = chats.map(c => c.id === selected.id ? { ...c, messages: [...c.messages, msg], lastMessage: input.trim(), lastTime: msg.time } : c)
    setChats(updated)
    setSelected(updated.find(c => c.id === selected.id) || null)
    setInput('')
  }

  const handleSelect = (c: ChatContact) => {
    setChats(prev => prev.map(chat => chat.id === c.id ? { ...chat, unread: 0 } : chat))
    setSelected({ ...c, unread: 0 })
  }

  const totalUnread = chats.reduce((sum, c) => sum + c.unread, 0)

  if (selected) {
    return (
      <div className="max-w-md mx-auto flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelected(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900">{selected.name}</p>
            <p className="text-xs text-gray-500 capitalize">{selected.role}{selected.orderId ? ` · ${selected.orderId}` : ''}</p>
          </div>
          {selected.role === 'customer' && (
            <a href="tel:+96512345678" className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium">Call</a>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {selected.messages.map(msg => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === 'driver' ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${msg.sender === 'driver' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white text-gray-900 shadow-sm rounded-bl-sm'}`}>
                {msg.text}
              </div>
              <p className="text-xs text-gray-400 mt-0.5 mx-1">{msg.time}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="bg-white border-t border-gray-200 p-3 flex gap-2 items-center">
          <button className="p-2.5 text-gray-400 hover:text-gray-600">
            <ImageIcon size={20} />
          </button>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Message..." className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <button onClick={handleSend} disabled={!input.trim()} className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full disabled:opacity-50">
            <Send size={16} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-5 pb-24">
      <div className="mb-5">
        <h1 className="text-xl font-bold text-gray-900">Messages</h1>
        {totalUnread > 0 && <p className="text-sm text-blue-600 mt-0.5">{totalUnread} unread</p>}
      </div>

      <div className="space-y-3">
        {chats.map(chat => (
          <button key={chat.id} onClick={() => handleSelect(chat)} className="w-full bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3 text-left shadow-sm active:bg-gray-50">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${chat.role === 'customer' ? 'bg-blue-500' : 'bg-purple-500'}`}>
              {chat.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-sm font-semibold text-gray-900">{chat.name}</p>
                <p className="text-xs text-gray-400">{chat.lastTime}</p>
              </div>
              {chat.orderId && <p className="text-xs text-blue-500 mb-0.5">{chat.orderId}</p>}
              <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
            </div>
            {chat.unread > 0 && (
              <span className="w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center flex-shrink-0">{chat.unread}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
