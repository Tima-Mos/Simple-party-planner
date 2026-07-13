import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { api, type CalendarResponse } from '@/lib/api'
import { getNickname as getNicknameStorage, setNickname as setNicknameStorage } from '@/lib/storage'

interface RoomContextValue {
  roomId: string | null
  calendar: CalendarResponse | null
  nickname: string
  setNickname: (n: string) => void
  createRoom: (nickname: string) => Promise<string>
  joinRoom: (roomId: string, nickname: string) => Promise<boolean>
  loadCalendar: (roomId: string) => Promise<void>
  toggleDate: (date: string) => Promise<void>
  loading: boolean
  error: string | null
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [roomId, setRoomId] = useState<string | null>(null)
  const [calendar, setCalendar] = useState<CalendarResponse | null>(null)
  const [nickname, setNicknameState] = useState<string>(getNicknameStorage() ?? '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const setNickname = useCallback((n: string) => {
    setNicknameStorage(n)
    setNicknameState(n)
  }, [])

  const createRoom = useCallback(async (nick: string) => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.createRoom(nick)
      setRoomId(res.roomId)
      setNicknameStorage(nick)
      setNicknameState(nick)
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

  const joinRoom = useCallback(async (id: string, nick: string) => {
    setLoading(true)
    setError(null)
    try {
      await api.joinRoom(id, nick)
      setRoomId(id)
      setNicknameStorage(nick)
      setNicknameState(nick)
      const cal = await api.getCalendar(id)
      setCalendar(cal)
      return true
    } catch {
      setError('Комната не найдена')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCalendar = useCallback(async (id: string) => {
    try {
      const cal = await api.getCalendar(id)
      setCalendar(cal)
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
          return { dates: newDates, totalUsers: [...allUsers] }
        })
      } catch (e: any) {
        setError(e.message)
      }
    },
    [roomId, nickname]
  )

  return (
    <RoomContext.Provider
      value={{ roomId, calendar, nickname, setNickname, createRoom, joinRoom, loadCalendar, toggleDate, loading, error }}
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
