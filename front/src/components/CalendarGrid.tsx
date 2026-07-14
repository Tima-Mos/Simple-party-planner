import { useState, useMemo } from 'react'
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isToday,
  isBefore,
  startOfDay,
  format,
} from 'date-fns'
import { ru } from 'date-fns/locale'
import DayCell from './DayCell'
import { formatDateKey } from '@/lib/utils'
import { ChevronLeft, ChevronRight, CalendarDays } from 'lucide-react'

interface CalendarGridProps {
  dates: Record<string, string[]>
}

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

export default function CalendarGrid({ dates }: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(currentMonth)
    const calStart = startOfWeek(monthStart, { weekStartsOn: 1 })
    const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const result: Date[] = []
    let day = calStart
    while (day <= calEnd) {
      result.push(day)
      day = addDays(day, 1)
    }
    return result
  }, [currentMonth])

  return (
    <div className="animate-fade-in-up w-full" style={{ animationDelay: '0.1s' }}>
      <div className="parchment-card p-4 sm:p-6 md:p-8">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2.5 rounded-lg hover:bg-wood-700/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-wood-700" />
          </button>
          <div className="flex items-center gap-2.5">
            <CalendarDays className="w-6 h-6 text-gold-500" />
            <h2 className="font-[Cinzel] text-xl md:text-2xl font-bold text-wood-800 uppercase tracking-wider">
              {format(currentMonth, 'LLLL yyyy', { locale: ru })}
            </h2>
          </div>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2.5 rounded-lg hover:bg-wood-700/10 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-wood-700" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2 mb-2">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="text-center font-[Cinzel] text-sm md:text-base font-semibold text-wood-600 uppercase tracking-wider py-1.5"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1.5 md:gap-2">
          {days.map((day) => {
            const key = formatDateKey(day)
            const users = dates[key] ?? []
            const today = startOfDay(new Date())
            const isPast = isBefore(day, today) && !isToday(day)
            return (
              <DayCell
                key={key}
                date={day}
                dateKey={key}
                users={users}
                isCurrentMonth={isSameMonth(day, currentMonth)}
                isToday={isToday(day)}
                isPast={isPast}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
