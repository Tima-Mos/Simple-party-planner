import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api, type CalendarResponse } from '@/lib/api'
import { getNickname as getNicknameStorage, setNickname as setNicknameStorage, getLastNickname } from '@/lib/storage'

interface RoomContextValue {
  roomId: string | null
  roomName: string
  calendar: CalendarResponse | null
  nickname: string
  createRoom: (name: string) => Promise<string>
  joinRoom: (roomId: string, nickname: string, rejoin?: boolean) => Promise<{ ok: boolean; error?: string }>
  loadCalendar: (roomId: string) => Promise<void>
  toggleDate: (date: string) => Promise<void>
  loading: boolean
  error: string | null
  clearError: () => void
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [roomName, setRoomName] = useState<string>('')
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null)
  const [nickname, setNicknameState] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => setError(null), [])

  const createRoom = useCallback(async (name: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createRoom(name)
      setRoomId(res.roomId)
      setRoomName(res.name)
      const cal = await api.getCalendar(res.roomId)
      setCalendar(cal)
      return res.roomId
    } catch (e: any) {
      setError(e.message)
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  const joinRoom = useCallback(async (id: string, nick: string, rejoin = false) => {
    setLoading(true)
    setError(null)
    try {
      await api.joinRoom(id, nick, rejoin)
      setRoomId(id)
      setNicknameStorage(id, nick)
      setNicknameState(nick)
      const cal = await api.getCalendar(id)
      setCalendar(cal)
      setRoomName(cal.name)
      return { ok: true }
    } catch (e: any) {
      const msg = e.message || 'Комната не найдена'
      setError(msg)
      return { ok: false, error: msg }
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCalendar = useCallback(async (id: string) => {
    try {
      const cal = await api.getCalendar(id)
      setCalendar(cal)
      setRoomName(cal.name)
    } catch {
      setError('Не удалось загрузить календарь')
    }
  }, [])

  const toggleDate = useCallback(
    async (date: string) => {
      if (!roomId || !nickname) return
      try {
        const res = await api.toggleAvailability(roomId, nickname, date)
        setCalendar((prev) => {
          if (!prev) return prev
          const newDates = { ...prev.dates }
          if (res.users.length > 0) {
            newDates[res.date] = res.users
          } else {
            delete newDates[res.date]
          }
          const allUsers = new Set(prev.totalUsers)
          for (const users of Object.values(newDates)) {
            for (const u of users) allUsers.add(u)
          }
          return { ...prev, dates: newDates, totalUsers: [...allUsers] }
        })
      } catch (e: any) {
        setError(e.message)
      }
    },
    [roomId, nickname]
  )

  return (
    <RoomContext.Provider
      value={{ roomId, roomName, calendar, nickname, createRoom, joinRoom, loadCalendar, toggleDate, loading, error, clearError }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used inside RoomProvider')
  return ctx
}
