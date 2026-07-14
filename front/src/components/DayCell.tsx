import { useState } from 'react'
import { useRoom } from '@/store/RoomContext'
import { type Rarity, RARITY_COLORS, RARITY_INLINE, cn } from '@/lib/utils'
import { getRarity } from '@/lib/utils'
import { Moon } from 'lucide-react'

interface DayCellProps {
  date: Date
  dateKey: string
  users: string[]
  isCurrentMonth: boolean
  isToday: boolean
}

export default function DayCell({ date, dateKey, users, isCurrentMonth, isToday }: DayCellProps) {
  const { nickname, toggleDate } = useRoom()
  const [showTooltip, setShowTooltip] = useState(false)

  const rarity: Rarity = getRarity(users.length)
  const color = RARITY_COLORS[rarity]
  const isMarked = users.includes(nickname)
  const hasRarity = users.length > 0

  const handleClick = () => {
    if (!isCurrentMonth) return
    toggleDate(dateKey)
  }

  const rarityStyle = hasRarity ? RARITY_INLINE[rarity] : {}

  return (
    <div className="tooltip-container relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'day-cell relative w-full min-h-[48px] aspect-square rounded-lg flex flex-col items-center justify-center cursor-pointer',
          'hover:scale-105 hover:z-10',
          !hasRarity && 'transition-transform duration-200',
          !isCurrentMonth && 'opacity-30 pointer-events-none',
          hasRarity ? `rarity-${rarity}` : '',
        )}
        style={{
          ...rarityStyle,
          zIndex: rarity === 'legendary' ? 1 : undefined,
        }}
      >
        {isToday && (
          <Moon className="absolute top-1 right-1 w-4 h-4 text-gold-500 z-10" />
        )}
        <span
          className={cn(
            'day-number font-[Cinzel] text-base md:text-lg font-bold',
            !hasRarity && (isCurrentMonth ? 'text-wood-800' : 'text-wood-600/40'),
          )}
          style={
            rarity === 'legendary'
              ? { color: '#fff', textShadow: '0 0 10px rgba(255,140,0,0.9), 0 0 20px rgba(255,100,0,0.5)', animation: 'legendary-text-pulse 2.5s ease-in-out infinite', position: 'relative', zIndex: 2 }
              : rarity === 'epic'
                ? { color: '#d4a0ff', textShadow: '0 0 8px rgba(163,53,238,0.6), 0 0 20px rgba(139,63,245,0.4)', animation: 'epic-text-glow 3s ease-in-out infinite', position: 'relative', zIndex: 1 }
                : rarity === 'rare'
                  ? { color, animation: 'rare-text-glow 3s ease-in-out infinite' }
                  : hasRarity
                    ? { color }
                    : undefined
          }
        >
          {date.getDate()}
        </span>
        {isMarked && (
          <span
            className="absolute bottom-1.5 w-2 h-2 rounded-full"
            style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          />
        )}
        {users.length > 0 && !isMarked && (
          <span className="absolute bottom-1 text-[10px] md:text-xs font-[Cinzel] font-bold" style={{ color }}>
            {users.length}
          </span>
        )}
        {rarity === 'legendary' && (
          <>
            <span className="legendary-rays" />
            <span className="sparkle sparkle-1" />
            <span className="sparkle sparkle-2" />
            <span className="sparkle sparkle-3" />
            <span className="sparkle sparkle-4" />
          </>
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && users.length > 0 && (
        <div className="tooltip-content !opacity-100">
          <div className="font-[Cinzel] text-xs uppercase tracking-wider mb-1" style={{ color }}>
            {rarity === 'legendary' ? '★ Легендарный день ★' : `${users.length} участников`}
          </div>
          <div className="space-y-0.5">
            {users.map((u) => (
              <div key={u} className={cn('text-sm', u === nickname && 'font-bold text-gold-400')}>
                {u === nickname ? `${u} (вы)` : u}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
