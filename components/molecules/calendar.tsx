'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addWeeks,
  subWeeks,
  isAfter,
  startOfDay,
  isSameWeek,
  parseISO,
} from 'date-fns'

interface CalendarProps {
  onSelectDate: (date: Date) => void
  learningLogs?: {
    id: string
    date: Date
    title: string
    colorHex: string
    tags?: string[]
  }[]
}

export function Calendar({ onSelectDate, learningLogs = [] }: CalendarProps) {
  const today = new Date()
  const [currentWeek, setCurrentWeek] = useState(today)

  // Get days in the current week (Sunday to Saturday)
  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek),
  })

  // Handle week navigation
  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))

  // Get learning logs for a specific date
  const getLearningLogsForDate = (date: Date) => {
    return learningLogs.filter(log => 
      isSameDay(new Date(log.date), date)
    )
  }

  // Format the week range for display (e.g., "March 10–17, 2025")
  const weekStart = daysInWeek[0]
  const weekEnd = daysInWeek[6]
  const weekRangeDisplay = `${format(weekStart, 'MMMM d')}–${format(weekEnd, 'd, yyyy')}`

  return (
    <div className="w-full h-full">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-semibold">{weekRangeDisplay}</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={goToPreviousWeek}
            className="hover:cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goToNextWeek}
            className="hover:cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7">
        {/* Day headers */}
        {daysInWeek.map((date, index) => (
          <div
            key={`header-${date.toISOString()}`}
            className={`
              text-center py-4 font-medium
              ${index !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}
            `}
          >
            <div className="text-sm text-muted-foreground">
              {format(date, 'EEE')}
            </div>
            <div className="mt-1">
              {isSameDay(date, today) ? (
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-700 text-white font-bold">
                  {format(date, 'd')}
                </div>
              ) : (
                <div className="text-lg">
                  {format(date, 'd')}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Day columns */}
        {daysInWeek.map((date, index) => {
          const isFutureDay = isAfter(startOfDay(date), startOfDay(today))
          const logsForDay = getLearningLogsForDate(date)
          
          return (
            <div
              key={`day-${date.toISOString()}`}
              className={`
                min-h-[500px] p-4 relative
                ${index !== 0 ? 'border-l border-gray-200 dark:border-gray-700' : ''}
                ${!isFutureDay ? 'hover:bg-muted/50 transition-colors' : 'opacity-50'}
              `}
              onClick={() => !isFutureDay && onSelectDate(date)}
              style={{ cursor: isFutureDay ? 'not-allowed' : 'pointer' }}
            >
              {/* Learning logs for this day */}
              <div className="space-y-4 mt-2">
                {logsForDay.map(log => (
                  <div
                    key={log.id}
                    className="p-4 rounded-md text-sm shadow-sm"
                    style={{ backgroundColor: log.colorHex + '33' }}
                    onClick={(e) => {
                      e.stopPropagation() // Prevent triggering the parent onClick
                      // This will be handled in a future step for viewing log details
                      console.log('View log details:', log)
                    }}
                  >
                    <div className="font-medium">{log.title}</div>
                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {log.tags.map(tag => (
                          <span 
                            key={tag} 
                            className="text-xs px-1.5 py-0.5 bg-background rounded-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Add button for non-future days */}
              {!isFutureDay && logsForDay.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <div className="bg-primary/10 rounded-full p-3">
                    <Plus className="h-8 w-8 text-primary" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
} 