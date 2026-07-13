import { useState } from 'react'
import { useRoom } from '@/store/RoomContext'
import { type Rarity, RARITY_COLORS, RARITY_BG, cn } from '@/lib/utils'
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
  const bg = RARITY_BG[rarity]
  const isMarked = users.includes(nickname)
  const hasRarity = users.length > 0

  const handleClick = () => {
    if (!isCurrentMonth) return
    toggleDate(dateKey)
  }

  return (
    <div className="tooltip-container relative">
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className={cn(
          'relative w-full min-h-[48px] aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-200 cursor-pointer',
          'hover:scale-105 hover:z-10',
          !isCurrentMonth && 'opacity-30 pointer-events-none',
          hasRarity && 'animate-glow',
        )}
        style={{
          background: hasRarity ? bg : 'rgba(253,248,240,0.4)',
          border: isMarked
            ? `2px solid ${color}`
            : hasRarity
              ? `2px solid ${color}50`
              : '2px solid transparent',
          boxShadow: hasRarity
            ? `0 0 8px ${color}30, inset 0 0 12px ${color}10`
            : '0 1px 3px rgba(90,60,30,0.1)',
          '--glow-color': hasRarity ? `${color}50` : 'transparent',
        } as React.CSSProperties}
      >
        {isToday && (
          <Moon className="absolute top-1 right-1 w-4 h-4 text-gold-500" />
        )}
        <span
          className={cn(
            'font-[Cinzel] text-base md:text-lg font-bold',
            isCurrentMonth ? 'text-wood-800' : 'text-wood-600/40'
          )}
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
