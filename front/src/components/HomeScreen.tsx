import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRoom } from '@/store/RoomContext'
import { Copy, Plus, DoorOpen, ScrollText } from 'lucide-react'

export default function HomeScreen() {
  const { createRoom, loading, error } = useRoom()
  const [inputName, setInputName] = useState('')
  const [createdLink, setCreatedLink] = useState('')
  const [copied, setCopied] = useState(false)
  const navigate = useNavigate()

  const handleCreateRoom = async (e: FormEvent) => {
    e.preventDefault()
    const name = inputName.trim()
    if (!name) return

    try {
      const id = await createRoom(name)
      const link = `${window.location.origin}/room/${id}`
      setCreatedLink(link)
    } catch {}
  }

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(createdLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleGoToRoom = () => {
    const id = createdLink.split('/room/')[1]
    if (id) navigate(`/room/${id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-lg animate-fade-in-up">
        <div className="parchment-card p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-wood-700 to-wood-900 flex items-center justify-center border-2 border-gold-500 shadow-lg">
                <ScrollText className="w-8 h-8 text-gold-400" />
              </div>
            </div>
            <h1 className="font-[Cinzel] text-3xl md:text-4xl font-bold text-wood-800 tracking-wide">
              Guild Planner
            </h1>
            <p className="font-[Lora] text-wood-600 mt-2 italic text-sm">
              Планировщик встреч для вашей гильдии
            </p>
          </div>

          {createdLink ? (
            /* Link created */
            <div className="animate-fade-in text-center">
              <div className="mb-4 p-4 rounded-lg bg-forest-700/10 border border-forest-600/30">
                <p className="text-sm text-forest-700 font-semibold mb-2">Комната создана!</p>
                <p className="text-xs text-wood-600 break-all font-mono bg-parchment-50/60 p-2 rounded">
                  {createdLink}
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button onClick={handleCopyLink} className="fantasy-btn flex items-center gap-2">
                  <Copy className="w-4 h-4" />
                  {copied ? 'Скопировано!' : 'Копировать ссылку'}
                </button>
                <button
                  onClick={handleGoToRoom}
                  className="fantasy-btn flex items-center gap-2 !bg-gradient-to-b !from-forest-700 !to-forest-800 !border-forest-600"
                >
                  <DoorOpen className="w-4 h-4" />
                  Войти
                </button>
              </div>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleCreateRoom} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-red-900/40 border border-red-700/60 text-red-100 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div>
                <label className="block font-[Cinzel] text-sm font-semibold text-wood-700 mb-1.5 uppercase tracking-wider">
                  Название комнаты
                </label>
                <input
                  type="text"
                  className="fantasy-input"
                  placeholder="Например: Субботний рейд"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  maxLength={50}
                  required
                />
              </div>

              <button
                type="submit"
                className="fantasy-btn w-full flex items-center justify-center gap-2"
                disabled={!inputName.trim() || loading}
              >
                <Plus className="w-5 h-5" />
                {loading ? 'Создание...' : 'Создать комнату'}
              </button>
            </form>
          )}

          {/* Divider */}
          {!createdLink && (
            <>
              <div className="flex items-center gap-3 my-6">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
                <span className="text-gold-600 font-[Cinzel] text-xs uppercase tracking-widest">
                  или
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold-500/40 to-transparent" />
              </div>

              <div className="text-center">
                <p className="text-sm text-wood-600 mb-2">
                  Уже есть ссылка на комнату?
                </p>
                <p className="text-xs text-wood-500 italic">
                  Вставьте её в адресную строку браузера
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
