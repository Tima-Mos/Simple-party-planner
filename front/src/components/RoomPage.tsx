import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useRoom } from '@/store/RoomContext'
import { getNickname as getNicknameStorage } from '@/lib/storage'
import { getRarity, RARITY_COLORS, formatDateKey } from '@/lib/utils'
import CalendarGrid from './CalendarGrid'
import UserList from './UserList'
import RarityBadge from './RarityBadge'
import { ArrowLeft, Copy, ScrollText } from 'lucide-react'

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>()
  const navigate = useNavigate()
  const { calendar, roomName, nickname, joinRoom, loadCalendar, loading, error, clearError } = useRoom()
  const [showNickInput, setShowNickInput] = useState(true)
  const [inputNick, setInputNick] = useState('')
  const [copied, setCopied] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!roomId) {
      navigate('/')
      return
    }
    const saved = getNicknameStorage(roomId)
    if (saved) setInputNick(saved)
  }, [roomId])

  useEffect(() => {
    if (roomName) {
      document.title = `${roomName} | Guild Planner`
    } else {
      document.title = 'Guild Planner'
    }
    return () => { document.title = 'Guild Planner' }
  }, [roomName])

  useEffect(() => {
    if (!loaded || !roomId) return
    const interval = setInterval(() => loadCalendar(roomId), 5000)
    return () => clearInterval(interval)
  }, [loaded, roomId, loadCalendar])

  const handleJoinWithNick = async () => {
    if (!roomId || inputNick.trim().length < 2) return
    clearError()
    const result = await joinRoom(roomId, inputNick.trim())
    if (result.ok) {
      setShowNickInput(false)
      setLoaded(true)
    }
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (showNickInput) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="parchment-card p-8 w-full max-w-md animate-fade-in-up">
          <div className="text-center mb-6">
            <div className="flex justify-center mb-3">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wood-700 to-wood-900 flex items-center justify-center border-2 border-gold-500">
                <ScrollText className="w-7 h-7 text-gold-400" />
              </div>
            </div>
            <h2 className="font-[Cinzel] text-xl font-bold text-wood-800">Представьтесь</h2>
            <p className="font-[Lora] text-sm text-wood-600 mt-1 italic">
              Введите никнейм, чтобы присоединиться к комнате
            </p>
          </div>
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-900/20 border border-red-800/40 text-red-300 text-sm">
                {error}
              </div>
            )}
            <input
              type="text"
              className="fantasy-input"
              placeholder="Ваш никнейм (мин. 2 символа)"
              value={inputNick}
              onChange={(e) => setInputNick(e.target.value)}
              autoFocus
              minLength={2}
              onKeyDown={(e) => e.key === 'Enter' && handleJoinWithNick()}
            />
            <button
              onClick={handleJoinWithNick}
              className="fantasy-btn w-full"
              disabled={inputNick.trim().length < 2 || loading}
            >
              {loading ? 'Подключение...' : 'Продолжить'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!calendar || !loaded) return null

  const todayKey = formatDateKey(new Date())
  const todayUsers = calendar.dates[todayKey] ?? []
  const todayRarity = getRarity(todayUsers.length)

  return (
    <div className="min-h-screen py-6 px-4">
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
                  {roomName || 'Комната'}
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
          <p className="font-[Lora] text-base text-wood-700 mt-3 text-center">
            Нажмите на дни, в которые вы готовы встретиться — они сразу загорятся цветом, и другие участники это увидят.
            Чем больше людей проголосует за одну дату, тем более редкий будет цвет у ячейки.
          </p>
        </div>

        {/* Rarity legend */}
        <div className="parchment-card p-3 animate-fade-in-up" style={{ animationDelay: '0.05s' }}>
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <span className="font-[Cinzel] text-xs md:text-sm text-wood-600 uppercase tracking-wider mr-1">
              Цвет ячейки:
            </span>
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as const).map((r) => (
              <RarityBadge key={r} rarity={r} />
            ))}
          </div>
        </div>

        {/* Calendar */}
        <CalendarGrid dates={calendar.dates} />

        {/* User list */}
        <UserList totalUsers={calendar.totalUsers} dates={calendar.dates} />
      </div>
    </div>
  )
}
