'use server'

import { createClient } from '@/utils/supabase/server'
import { LearningLog } from '@/lib/domains'
import { createTag } from './tag'
import { revalidatePath } from 'next/cache'

/**
 * Interface for creating a new learning log
 */
export interface CreateLearningLogInput {
  title: string
  details: string
  colorId: string
  date: Date
  tags: string[]
}

/**
 * Creates a new learning log
 * @param input The learning log data to create
 * @returns The created learning log
 */
export async function createLearningLog(input: CreateLearningLogInput): Promise<LearningLog> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Create learning log
  const now = new Date().toISOString()
  const { data: learningLog, error } = await supabase
    .from('learning_logs')
    .insert({
      title: input.title,
      details: input.details,
      color_id: input.colorId,
      user_id: user.id,
      created_at: input.date.toISOString(),
      updated_at: now
    })
    .select('id, title, details, color_id, user_id, created_at, updated_at')
    .single()
  
  if (error) {
    console.error('Error creating learning log:', error)
    throw new Error('Failed to create learning log')
  }
  
  // Handle tags
  if (input.tags.length > 0) {
    for (const tagName of input.tags) {
      try {
        // Create or get existing tag
        const tag = await createTag(tagName)
        
        // Create learning log tag relationship
        await supabase
          .from('learning_log_tags')
          .insert({
            learning_log_id: learningLog.id,
            tag_id: tag.id
          })
      } catch (error) {
        console.error(`Error processing tag "${tagName}":`, error)
        // Continue with other tags even if one fails
      }
    }
  }
  
  // Revalidate the home page to show the new learning log
  revalidatePath('/')
  
  return {
    id: learningLog.id,
    userId: learningLog.user_id,
    title: learningLog.title,
    details: learningLog.details,
    colorId: learningLog.color_id,
    createdAt: new Date(learningLog.created_at),
    updatedAt: new Date(learningLog.updated_at)
  }
}

/**
 * Fetches learning logs for the current user
 * @returns An array of learning logs with color and tag information
 */
export async function getLearningLogs() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Get learning logs for the current user
  const { data, error } = await supabase
    .from('learning_logs')
    .select(`
      id,
      title,
      details,
      created_at,
      updated_at,
      color_id,
      colors (
        id,
        name,
        hex_code
      ),
      learning_log_tags (
        tags (
          id,
          name
        )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching learning logs:', error)
    throw new Error('Failed to fetch learning logs')
  }
  
  // Transform the data for the frontend
  return (data || []).map((log: any) => ({
    id: log.id,
    date: new Date(log.created_at),
    title: log.title,
    details: log.details,
    colorHex: log.colors?.hex_code || '#3B82F6',
    colorName: log.colors?.name || 'Blue',
    tags: log.learning_log_tags?.map((tag: any) => tag.tags?.name).filter(Boolean) || []
  }))
} 