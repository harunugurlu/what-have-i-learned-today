'use client'

import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface LearningLogCardProps {
  id: string
  title: string
  details: string
  date: Date
  colorHex: string
  tags?: string[]
  onClick?: () => void
}

export function LearningLogCard({
  id,
  title,
  details,
  date,
  colorHex,
  tags = [],
  onClick,
}: LearningLogCardProps) {
  return (
    <div
      className="p-4 rounded-lg shadow-sm cursor-pointer transition-all hover:shadow-md"
      style={{ backgroundColor: colorHex + '33' }} // Adding 33 for 20% opacity
      onClick={onClick}
    >
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="font-medium text-base line-clamp-2">{title}</h3>
          <span className="text-xs text-muted-foreground">
            {format(new Date(date), 'MMM d')}
          </span>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="text-xs px-2 py-0"
                style={{ borderColor: colorHex }}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        {details && (
          <p className="text-sm text-muted-foreground line-clamp-2">{details}</p>
        )}
      </div>
    </div>
  )
} 