'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { X, Loader2, Save, Trash2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Color, Tag } from '@/lib/domains'
import { getColors, getTags } from '@/lib/actions'
import { LearningLogWithDetails, updateLearningLog } from '@/lib/actions/learning-log'

// Define the form schema with zod
const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  details: z.string().optional(),
  colorId: z.string().min(1, 'Please select a color'),
  tags: z.array(z.string()).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface LearningLogEditProps {
  isOpen: boolean
  onClose: () => void
  learningLog: LearningLogWithDetails | null
  onDelete?: (id: string) => void
}

export function LearningLogEdit({ 
  isOpen, 
  onClose, 
  learningLog,
  onDelete
}: LearningLogEditProps) {
  const router = useRouter()
  const [colors, setColors] = useState<Color[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [newTag, setNewTag] = useState('')
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      details: '',
      colorId: '',
      tags: [],
    },
  })

  // Update form values when learning log changes
  useEffect(() => {
    if (learningLog) {
      form.reset({
        title: learningLog.title,
        details: learningLog.details,
        colorId: learningLog.colorId || '',
        tags: learningLog.tags || [],
      })
    }
  }, [learningLog, form])

  // Fetch colors and tags when the dialog opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setIsLoadingData(true)
        setError(null)
        
        try {
          // Fetch colors and tags in parallel
          const [colorsData, tagsData] = await Promise.all([
            getColors(),
            getTags(),
          ])
          
          setColors(colorsData)
          setTags(tagsData)
        } catch (error) {
          console.error('Error fetching data:', error)
          setError('Failed to load data. Please try again.')
        } finally {
          setIsLoadingData(false)
        }
      }
      
      fetchData()
    }
  }, [isOpen])

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setNewTag('')
      setError(null)
      setIsDeleteDialogOpen(false)
    }
  }, [isOpen])

  // Handle form submission
  const onSubmit = async (values: FormValues) => {
    if (!learningLog) return
    
    setIsSubmitting(true)
    setError(null)
    
    try {
      await updateLearningLog({
        id: learningLog.id,
        title: values.title,
        details: values.details || '',
        colorId: values.colorId,
        tags: values.tags || [],
      })
      
      // Close the dialog and refresh the page
      onClose()
      router.refresh()
    } catch (error: any) {
      console.error('Error updating learning log:', error)
      setError(error.message || 'Failed to update learning log')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle adding a new tag
  const handleAddTag = () => {
    if (newTag.trim()) {
      const currentTags = form.getValues('tags') || []
      if (!currentTags.includes(newTag.trim())) {
        form.setValue('tags', [...currentTags, newTag.trim()])
        setNewTag('')
      }
    }
  }

  // Handle removing a tag
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues('tags') || []
    form.setValue('tags', currentTags.filter(t => t !== tag))
  }

  // Handle adding a suggested tag
  const handleAddSuggestedTag = (tagName: string) => {
    const currentTags = form.getValues('tags') || []
    if (!currentTags.includes(tagName)) {
      form.setValue('tags', [...currentTags, tagName])
    }
  }

  // Handle delete button click
  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (learningLog && onDelete) {
      onDelete(learningLog.id)
      setIsDeleteDialogOpen(false)
    }
  }

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false)
  }

  if (!learningLog) return null

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Learning Log</DialogTitle>
            <DialogDescription>
              Update your learning log entry. Make changes to the title, details, color, or tags.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {isLoadingData ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="What did you learn?" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Details</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what you learned in detail..." 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        You can use markdown to format your text.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="colorId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {colors.map((color) => (
                          <button
                            key={color.id}
                            type="button"
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              field.value === color.id 
                                ? 'border-primary scale-110' 
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.hexCode }}
                            onClick={() => form.setValue('colorId', color.id)}
                            title={color.name}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag"
                      className="flex-1"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddTag}
                      disabled={!newTag.trim()}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Selected tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch('tags')?.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="flex items-center gap-1 px-2 py-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove {tag}</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Suggested tags */}
                  {tags.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground mb-1">Suggested tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {tags
                          .filter(tag => !form.watch('tags')?.includes(tag.name))
                          .slice(0, 10)
                          .map((tag) => (
                            <button
                              key={tag.id}
                              type="button"
                              className="bg-muted hover:bg-muted/80 px-2 py-1 rounded-md text-sm"
                              onClick={() => handleAddSuggestedTag(tag.name)}
                            >
                              {tag.name}
                            </button>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  {onDelete && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      onClick={handleDeleteClick}
                      disabled={isSubmitting}
                      className="mr-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  )}
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this learning log?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your learning log
              and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
} 