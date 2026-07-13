import { useMemo } from 'react'
import type { RoomData } from '@/lib/storage'
import { Users, Crown } from 'lucide-react'

interface UserListProps {
  room: RoomData
}

export default function UserList({ room }: UserListProps) {
  const stats = useMemo(() => {
    const map: Record<string, number> = {}
    for (const users of Object.values(room.entries)) {
      for (const u of users) {
        map[u] = (map[u] ?? 0) + 1
      }
    }
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [room.entries])

  if (stats.length === 0) {
    return (
      <div className="parchment-card p-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-gold-500" />
          <h3 className="font-[Cinzel] text-base font-bold text-wood-700 uppercase tracking-wider">
            Участники
          </h3>
        </div>
        <p className="text-sm text-wood-600/60 italic font-[Lora]">
          Пока никто не отметился. Будьте первым!
        </p>
      </div>
    )
  }

  return (
    <div className="parchment-card p-4 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-2 mb-3">
        <Users className="w-5 h-5 text-gold-500" />
        <h3 className="font-[Cinzel] text-base font-bold text-wood-700 uppercase tracking-wider">
          Участники
        </h3>
        <span className="ml-auto text-sm text-wood-600/60 font-[Lora]">
          {stats.length} {stats.length === 1 ? 'участник' : 'участников'}
        </span>
      </div>

      <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-fantasy">
        {stats.map((s, i) => (
          <div
            key={s.name}
            className="flex items-center gap-2 py-1.5 px-2 rounded-md bg-parchment-50/50 hover:bg-parchment-100/80 transition-colors"
          >
            {i === 0 && <Crown className="w-4 h-4 text-gold-500 flex-shrink-0" />}
            <span className="font-[Lora] text-sm md:text-base text-wood-800 truncate flex-1">{s.name}</span>
            <span className="font-[Cinzel] text-xs md:text-sm font-bold text-gold-600 bg-gold-500/10 px-2 py-0.5 rounded">
              {s.count} {s.count === 1 ? 'день' : 'дней'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
