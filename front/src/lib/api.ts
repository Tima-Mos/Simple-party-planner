const BASE = import.meta.env.VITE_API_URL ?? ''

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error ?? `Request failed: ${res.status}`)
  return body as T
}

export interface CreateRoomResponse {
  roomId: string
  name: string
  shareUrl: string
}

export interface CalendarResponse {
  name: string
  dates: Record<string, string[]>
  totalUsers: string[]
}

export interface AvailabilityResponse {
  date: string
  users: string[]
}

export const api = {
  createRoom: (name: string) =>
    request<CreateRoomResponse>('/api/rooms', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),

  joinRoom: (roomId: string, nickname: string) =>
    request<{ success: boolean; nickname: string }>(`/api/rooms/${roomId}/join`, {
      method: 'POST',
      body: JSON.stringify({ nickname }),
    }),

  getCalendar: (roomId: string) =>
    request<CalendarResponse>(`/api/rooms/${roomId}/calendar`),

  toggleAvailability: (roomId: string, nickname: string, date: string) =>
    request<AvailabilityResponse>(`/api/rooms/${roomId}/availability`, {
      method: 'POST',
      body: JSON.stringify({ nickname, date }),
    }),

  deleteAvailability: (roomId: string, nickname: string) =>
    request<{ success: boolean }>(`/api/rooms/${roomId}/availability`, {
      method: 'DELETE',
      body: JSON.stringify({ nickname }),
    }),

  getUsers: (roomId: string) =>
    request<{ users: string[] }>(`/api/rooms/${roomId}/users`),
}
