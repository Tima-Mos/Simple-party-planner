import { cn, type Rarity, RARITY_COLORS, RARITY_BG, RARITY_LABELS } from '@/lib/utils'

interface RarityBadgeProps {
  rarity: Rarity
  size?: 'sm' | 'md'
}

const rarityIcon: Record<Rarity, string> = {
  common: '◆',
  uncommon: '◆',
  rare: '◆',
  epic: '◆',
  legendary: '★',
}

export default function RarityBadge({ rarity, size = 'sm' }: RarityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-[Cinzel] font-bold rounded-sm',
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      )}
      style={{
        color: RARITY_COLORS[rarity],
        background: RARITY_BG[rarity],
        border: `1px solid ${RARITY_COLORS[rarity]}40`,
        textShadow: rarity !== 'common' ? `0 0 6px ${RARITY_COLORS[rarity]}60` : undefined,
      }}
    >
      <span>{rarityIcon[rarity]}</span>
      {RARITY_LABELS[rarity]}
    </span>
  )
}
