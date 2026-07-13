import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '@/store/RoomContext'
import { getRarity, RARITY_COLORS, formatDateKey } from '@/lib/utils'
import CalendarGrid from './CalendarGrid'
import UserList from './UserList'
import NicknameModal from './NicknameModal'
import RarityBadge from './RarityBadge'
import { ArrowLeft, Share2, Copy, ScrollText } from 'lucide-react'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { room, nickname, joinRoom, reloadRoom } = useRoom()
  const [showNickModal, setShowNickModal] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!roomId) {
      navigate('/')
      return
    }
    const found = joinRoom(roomId)
    if (!found) {
      navigate('/')
      return
    }
    setLoaded(true)
  }, [roomId])

  useEffect(() => {
    if (loaded && !nickname) {
      setShowNickModal(true)
    }
  }, [loaded, nickname])

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handler = () => reloadRoom()
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [reloadRoom])

  if (!room || !loaded) return null

  // Calculate today's rarity for display
  const todayKey = formatDateKey(new Date())
  const todayUsers = room.entries[todayKey] ?? []
  const todayRarity = getRarity(todayUsers.length)

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen py-6 px-4">
      {/* {showNickModal && <NicknameModal onDone={() => setShowNickModal(false)} />} */}

      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="parchment-card p-4 md:p-5 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="p-2 rounded-lg hover:bg-wood-700/10 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-wood-700" />
            </button>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <ScrollText className="w-5 h-5 text-gold-500 flex-shrink-0" />
                <h1 className="font-[Cinzel] text-lg md:text-xl font-bold text-wood-800 truncate">
                  {room.name}
                </h1>
              </div>
              <p className="font-[Lora] text-sm text-wood-600/60 mt-0.5">
                {nickname ? `Вы: ${nickname}` : 'Нажмите на день, чтобы отметиться'}
              </p>
            </div>
            <button
              onClick={handleCopyLink}
              className="fantasy-btn !py-2 !px-3 flex items-center gap-1.5 flex-shrink-0"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{copied ? 'Скопировано!' : 'Поделиться'}</span>
            </button>
          </div>
        </div>

        {/* Rarity legend */}
        <div className="parchment-card p-3 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="font-[Cinzel] text-xs md:text-sm text-wood-600 uppercase tracking-wider mr-1">
              Редкость:
            </span>
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((r) => (
              <RarityBadge key={r} rarity={r} />
            ))}
          </div>
        </div>

        {/* Calendar */}
        <CalendarGrid room={room} />

        {/* User list */}
        <UserList room={room} />
      </div>
    </div>
  )
}
