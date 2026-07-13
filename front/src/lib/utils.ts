import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'

export function getRarity(userCount: number): Rarity {
  if (userCount === 0) return 'common'
  if (userCount === 1) return 'uncommon'
  if (userCount <= 3) return 'rare'
  if (userCount <= 5) return 'epic'
  return 'legendary'
}

export const RARITY_COLORS: Record<Rarity, string> = {
  common: '#9d9d9d',
  uncommon: '#1eff00',
  rare: '#0070dd',
  epic: '#a335ee',
  legendary: '#ff8000',
}

export const RARITY_BG: Record<Rarity, string> = {
  common: 'rgba(157,157,157,0.08)',
  uncommon: 'rgba(30,255,0,0.12)',
  rare: 'rgba(0,112,221,0.14)',
  epic: 'rgba(163,53,238,0.16)',
  legendary: 'rgba(255,128,0,0.18)',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: 'Обычный',
  uncommon: 'Необычный',
  rare: 'Редкий',
  epic: 'Эпический',
  legendary: 'Легендарный',
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
