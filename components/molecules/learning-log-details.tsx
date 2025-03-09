'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import ReactMarkdown from 'react-markdown'
import { X, Calendar as CalendarIcon, Clock, Tag as TagIcon, Edit } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import { LearningLogWithDetails } from '@/lib/actions/learning-log'
import { LearningLogEdit } from './learning-log-edit'

interface LearningLogDetailsProps {
  isOpen: boolean
  onClose: () => void
  learningLog: LearningLogWithDetails | null
  isLoading: boolean
  onDelete?: (id: string) => void
}

export function LearningLogDetails({ 
  isOpen, 
  onClose, 
  learningLog, 
  isLoading,
  onDelete
}: LearningLogDetailsProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  
  if (!isOpen || (!learningLog && !isLoading)) return null

  const handleEditClick = () => {
    setIsEditDialogOpen(true)
  }

  const handleEditClose = () => {
    setIsEditDialogOpen(false)
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : learningLog ? (
            <>
              <DialogHeader>
                <div 
                  className="w-full h-2 rounded-full mb-4" 
                  style={{ backgroundColor: learningLog.colorHex }}
                />
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-2xl font-bold">{learningLog.title}</DialogTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-muted-foreground hover:text-foreground"
                    onClick={handleEditClick}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Metadata */}
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4" />
                    <span>{format(learningLog.createdAt, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{format(learningLog.createdAt, 'h:mm a')}</span>
                  </div>
                  {learningLog.colorName && (
                    <div className="flex items-center gap-1">
                      <div 
                        className="h-4 w-4 rounded-full" 
                        style={{ backgroundColor: learningLog.colorHex }}
                      />
                      <span>{learningLog.colorName}</span>
                    </div>
                  )}
                </div>
                
                {/* Tags */}
                {learningLog.tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TagIcon className="h-4 w-4" />
                      <span>Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {learningLog.tags.map(tag => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>{learningLog.details}</ReactMarkdown>
                </div>
              </div>
              
              <DialogClose className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-lg font-medium">Learning log not found</p>
              <p className="text-sm text-muted-foreground mt-2">
                The learning log you're looking for doesn't exist or you don't have permission to view it.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {learningLog && (
        <LearningLogEdit 
          isOpen={isEditDialogOpen}
          onClose={handleEditClose}
          learningLog={learningLog}
          onDelete={onDelete}
        />
      )}
    </>
  )
} 