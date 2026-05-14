import { useEffect, useRef, useState, useCallback } from 'react'
import { wsClient, type WSEventMap } from '../ws/client'

type WSEventKey = keyof WSEventMap
type WSEventData<K extends WSEventKey> = Parameters<WSEventMap[K]>[0]

interface UseWebSocketOptions<K extends WSEventKey> {
  /** Events to subscribe to */
  events?: K[]
  /** Automatically connect on mount (default: true) */
  autoConnect?: boolean
  /** Room to join after connecting */
  room?: string
}

interface UseWebSocketReturn<K extends WSEventKey> {
  isConnected: boolean
  lastMessage: { event: K; data: WSEventData<K> } | null
  emit: <E extends WSEventKey>(
    event: E,
    handler: WSEventMap[E]
  ) => void
  joinRoom: (room: string) => void
  leaveRoom: (room: string) => void
}

/**
 * Hook that manages a WebSocket connection and event subscriptions.
 *
 * @param options.events - List of WS event names to listen to
 * @param options.autoConnect - Whether to connect on mount (default: true)
 * @param options.room - Optional room to join after connecting
 */
export const useWebSocket = <K extends WSEventKey = WSEventKey>(
  options: UseWebSocketOptions<K> = {}
): UseWebSocketReturn<K> => {
  const { events = [], autoConnect = true, room } = options

  const [isConnected, setIsConnected] = useState(wsClient.isConnected)
  const [lastMessage, setLastMessage] = useState<{
    event: K
    data: WSEventData<K>
  } | null>(null)

  // Keep a stable ref to the events list to avoid re-registering
  const eventsRef = useRef(events)
  eventsRef.current = events

  useEffect(() => {
    if (autoConnect && !wsClient.isConnected) {
      wsClient.connect()
    }

    // ── Connection state handlers ──
    const handleConnect = () => {
      setIsConnected(true)
      if (room) wsClient.joinRoom(room)
    }
    const handleDisconnect = () => setIsConnected(false)

    wsClient.on('connect', handleConnect)
    wsClient.on('disconnect', handleDisconnect)

    // ── Register all requested event listeners ──
    const handlers = eventsRef.current.map((event) => {
      const handler = (data: WSEventData<K>) => {
        setLastMessage({ event, data })
      }
      wsClient.on(event, handler as unknown as WSEventMap[typeof event])
      return { event, handler }
    })

    // If already connected and a room was specified, join immediately
    if (wsClient.isConnected && room) {
      wsClient.joinRoom(room)
    }

    return () => {
      wsClient.off('connect', handleConnect)
      wsClient.off('disconnect', handleDisconnect)

      handlers.forEach(({ event, handler }) => {
        wsClient.off(event, handler as unknown as WSEventMap[typeof event])
      })

      if (room) wsClient.leaveRoom(room)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect, room])

  const emit = useCallback(
    <E extends WSEventKey>(event: E, handler: WSEventMap[E]) => {
      wsClient.on(event, handler)
    },
    []
  )

  const joinRoom = useCallback((r: string) => {
    wsClient.joinRoom(r)
  }, [])

  const leaveRoom = useCallback((r: string) => {
    wsClient.leaveRoom(r)
  }, [])

  return { isConnected, lastMessage, emit, joinRoom, leaveRoom }
}

export default useWebSocket
