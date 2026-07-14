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
  uncommon: '#17cc00',
  rare: '#0070dd',
  epic: '#a335ee',
  legendary: '#ff8c00',
}

export const RARITY_INLINE: Record<Rarity, React.CSSProperties> = {
  common: {
    background: 'rgba(253,248,240,0.4)',
    border: '2px solid transparent',
    boxShadow: '0 1px 3px rgba(90,60,30,0.1)',
  },
  uncommon: {
    background: 'rgba(23,204,0,0.08)',
    border: '2px solid rgba(23,204,0,0.3)',
    boxShadow: '0 0 8px rgba(23,204,0,0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  rare: {
    background: 'rgba(0,112,221,0.1)',
    border: '2px solid rgba(0,112,221,0.4)',
    animation: 'rare-breathe 3s ease-in-out infinite',
  },
  epic: {
    background: 'radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.8) 0%, transparent 100%), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 60% 20%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 80% 50%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 15% 80%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 70% 85%, rgba(255,255,255,0.7) 0%, transparent 100%), radial-gradient(1px 1px at 90% 15%, rgba(255,255,255,0.5) 0%, transparent 100%), radial-gradient(1px 1px at 35% 45%, rgba(255,255,255,0.4) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 55% 55%, rgba(255,255,255,0.6) 0%, transparent 100%), radial-gradient(1px 1px at 10% 55%, rgba(255,255,255,0.3) 0%, transparent 100%), linear-gradient(135deg, #2a1450, #8b3ff5, #c98aff, #3a1a70, #7b2ff2, #2a1450)',
    backgroundSize: '100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 100% 100%, 300% 300%',
    border: '2px solid rgba(163,53,238,0.5)',
    boxShadow: '0 0 18px rgba(163,53,238,0.5), 0 0 40px rgba(123,47,242,0.2), inset 0 0 20px rgba(163,53,238,0.2)',
    animation: 'epic-gradient 6s ease infinite, epic-border 3s ease-in-out infinite, epic-stars-twinkle 4s ease-in-out infinite',
    position: 'relative',
    overflow: 'hidden',
  },
  legendary: {
    background: 'linear-gradient(135deg, #2a1800, #ff8c00, #ff5500, #3a2200)',
    backgroundSize: '300% 300%',
    border: '2px solid #ff8c00',
    boxShadow: '0 0 12px rgba(255,140,0,0.25), inset 0 0 10px rgba(255,140,0,0.06)',
    animation: 'legendary-gradient 6s ease infinite, legendary-pulse 2.5s ease-in-out infinite',
    position: 'relative',
    overflow: 'visible',
  },
}

export const RARITY_BG: Record<Rarity, string> = {
  common: 'rgba(157,157,157,0.08)',
  uncommon: 'rgba(23,204,0,0.08)',
  rare: 'rgba(0,112,221,0.14)',
  epic: 'rgba(163,53,238,0.16)',
  legendary: 'rgba(255,140,0,0.18)',
}

export const RARITY_LABELS: Record<Rarity, string> = {
  common: '0',
  uncommon: '1',
  rare: '2-3',
  epic: '4-5',
  legendary: '6+',
}

export function formatDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}
