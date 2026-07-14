const LAST_NICK_KEY = 'guild_planner_last_nick'

export function getNickname(roomId: string): string | null {
  return localStorage.getItem(`guild_planner_nick_${roomId}`)
}

export function setNickname(roomId: string, nick: string): void {
  localStorage.setItem(`guild_planner_nick_${roomId}`, nick)
  localStorage.setItem(LAST_NICK_KEY, nick)
}

export function clearNickname(roomId: string): void {
  localStorage.removeItem(`guild_planner_nick_${roomId}`)
}

export function getLastNickname(): string | null {
  return localStorage.getItem(LAST_NICK_KEY)
}
