const NICKNAME_KEY = 'guild_planner_nickname'

export function getNickname(): string | null {
  return localStorage.getItem(NICKNAME_KEY)
}

export function setNickname(nick: string): void {
  localStorage.setItem(NICKNAME_KEY, nick)
}
