import { useState, type FormEvent } from 'react'
import { useRoom } from '@/store/RoomContext'
import { ScrollText } from 'lucide-react'

interface NicknameModalProps {
  onDone: () => void
}

export default function NicknameModal({ onDone }: NicknameModalProps) {
  const { setNickname } = useRoom()
  const [nick, setNick] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (nick.trim().length >= 2) {
      setNickname(nick.trim())
      onDone()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="parchment-card p-8 w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-wood-700 to-wood-900 flex items-center justify-center border-2 border-gold-500">
              <ScrollText className="w-7 h-7 text-gold-400" />
            </div>
          </div>
          <h2 className="font-[Cinzel] text-xl font-bold text-wood-800">Представьтесь</h2>
          <p className="font-[Lora] text-sm text-wood-600 mt-1 italic">
            Введите никнейм, чтобы отметиться в календаре
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            className="fantasy-input"
            placeholder="Ваш никнейм (мин. 2 символа)"
            value={nick}
            onChange={(e) => setNick(e.target.value)}
            autoFocus
            minLength={2}
            required
          />
          <button
            type="submit"
            className="fantasy-btn w-full"
            disabled={nick.trim().length < 2}
          >
            Продолжить
          </button>
        </form>
      </div>
    </div>
  )
}
