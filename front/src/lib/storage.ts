export interface RoomData {
  id: string
  name: string
  createdAt: string
  entries: Record<string, string[]>
}

const STORAGE_KEY = 'guild_planner_rooms'
const NICKNAME_KEY = 'guild_planner_nickname'

export function loadRooms(): Record<string, RoomData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

export function saveRooms(rooms: Record<string, RoomData>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms))
}

export function getRoom(id: string): RoomData | null {
  const rooms = loadRooms()
  return rooms[id] ?? null
}

export function createRoom(id: string, name: string): RoomData {
  const rooms = loadRooms()
  const room: RoomData = {
    id,
    name,
    createdAt: new Date().toISOString(),
    entries: {},
  }
  rooms[id] = room
  saveRooms(rooms)
  return room
}

export function toggleUserInRoom(
  roomId: string,
  dateKey: string,
  nickname: string
): RoomData | null {
  const rooms = loadRooms()
  const room = rooms[roomId]
  if (!room) return null

  if (!room.entries[dateKey]) {
    room.entries[dateKey] = []
  }

  const idx = room.entries[dateKey].indexOf(nickname)
  if (idx >= 0) {
    room.entries[dateKey].splice(idx, 1)
  } else {
    room.entries[dateKey].push(nickname)
  }

  saveRooms(rooms)
  return room
}

export function getNickname(): string | null {
  return localStorage.getItem(NICKNAME_KEY)
}

export function setNickname(nick: string): void {
  localStorage.setItem(NICKNAME_KEY, nick)
}
