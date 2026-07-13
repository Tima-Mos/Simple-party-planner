import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { RoomData } from '@/lib/storage'
import {
  getRoom,
  createRoom as createRoomStorage,
  toggleUserInRoom as toggleUserInRoomStorage,
  getNickname as getNicknameStorage,
  setNickname as setNicknameStorage,
} from '@/lib/storage'
import { generateId } from '@/lib/utils'

interface RoomContextValue {
  room: RoomData | null
  nickname: string
  setNickname: (n: string) => void
  createRoom: (name: string) => string
  joinRoom: (id: string) => boolean
  toggleUserInRoom: (dateKey: string) => void
  reloadRoom: () => void
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [room, setRoom] = useState<RoomData | null>(null)
  const [nickname, setNicknameState] = useState<string>(getNicknameStorage() ?? '')

  const setNickname = useCallback((n: string) => {
    setNicknameStorage(n)
    setNicknameState(n)
  }, [])

  const createRoom = useCallback((name: string) => {
    const id = generateId()
    const r = createRoomStorage(id, name)
    setRoom(r)
    return id
  }, [])

  const joinRoom = useCallback((id: string) => {
    const r = getRoom(id)
    if (r) {
      setRoom(r)
      return true
    }
    return false
  }, [])

  const toggleUserInRoom = useCallback(
    (dateKey: string) => {
      if (!room || !nickname) return
      const updated = toggleUserInRoomStorage(room.id, dateKey, nickname)
      if (updated) setRoom({ ...updated })
    },
    [room, nickname]
  )

  const reloadRoom = useCallback(() => {
    if (room) {
      const fresh = getRoom(room.id)
      if (fresh) setRoom({ ...fresh })
    }
  }, [room])

  return (
    <RoomContext.Provider
      value={{ room, nickname, setNickname, createRoom, joinRoom, toggleUserInRoom, reloadRoom }}
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
