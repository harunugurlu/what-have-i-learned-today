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
 * Interface for learning log with additional details
 */
export interface LearningLogWithDetails extends Omit<LearningLog, 'colorId'> {
  colorHex: string
  colorName: string
  tags: string[]
}

/**
 * Interface for updating an existing learning log
 */
export interface UpdateLearningLogInput {
  id: string
  title: string
  details: string
  colorId: string
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
    colorHex: log.colors?.[0]?.hex_code || '#3B82F6',
    colorName: log.colors?.[0]?.name || 'Blue',
    tags: log.learning_log_tags?.map((tag: any) => tag.tags?.name).filter(Boolean) || []
  }))
}

/**
 * Fetches a single learning log by ID
 * @param id The ID of the learning log to fetch
 * @returns The learning log with color and tag information
 */
export async function getLearningLogById(id: string): Promise<LearningLogWithDetails> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Get the learning log
  const { data, error } = await supabase
    .from('learning_logs')
    .select(`
      id,
      title,
      details,
      created_at,
      updated_at,
      user_id,
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
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('Error fetching learning log:', error)
    throw new Error('Failed to fetch learning log')
  }
  
  if (!data) {
    throw new Error('Learning log not found')
  }
  
  // Check if the learning log belongs to the current user
  if (data.user_id !== user.id) {
    throw new Error('You do not have permission to view this learning log')
  }
  
  // Transform the data for the frontend
  return {
    id: data.id,
    userId: data.user_id,
    title: data.title,
    details: data.details,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
    colorHex: data.colors?.[0]?.hex_code || '#3B82F6',
    colorName: data.colors?.[0]?.name || 'Blue',
    tags: data.learning_log_tags?.map((tag: any) => tag.tags?.name).filter(Boolean) || []
  }
}

/**
 * Updates an existing learning log
 * @param input The learning log data to update
 * @returns The updated learning log
 */
export async function updateLearningLog(input: UpdateLearningLogInput): Promise<LearningLogWithDetails> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Check if the learning log exists and belongs to the user
  const { data: existingLog, error: fetchError } = await supabase
    .from('learning_logs')
    .select('id, user_id')
    .eq('id', input.id)
    .single()
  
  if (fetchError || !existingLog) {
    throw new Error('Learning log not found')
  }
  
  if (existingLog.user_id !== user.id) {
    throw new Error('You do not have permission to update this learning log')
  }
  
  // Update the learning log
  const now = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('learning_logs')
    .update({
      title: input.title,
      details: input.details,
      color_id: input.colorId,
      updated_at: now
    })
    .eq('id', input.id)
  
  if (updateError) {
    console.error('Error updating learning log:', updateError)
    throw new Error('Failed to update learning log')
  }
  
  // Delete existing tag relationships
  const { error: deleteTagsError } = await supabase
    .from('learning_log_tags')
    .delete()
    .eq('learning_log_id', input.id)
  
  if (deleteTagsError) {
    console.error('Error deleting existing tags:', deleteTagsError)
    // Continue anyway, as this is not critical
  }
  
  // Add new tag relationships
  if (input.tags.length > 0) {
    for (const tagName of input.tags) {
      try {
        // Create or get existing tag
        const tag = await createTag(tagName)
        
        // Create learning log tag relationship
        await supabase
          .from('learning_log_tags')
          .insert({
            learning_log_id: input.id,
            tag_id: tag.id
          })
      } catch (error) {
        console.error(`Error processing tag "${tagName}":`, error)
        // Continue with other tags even if one fails
      }
    }
  }
  
  // Revalidate the home page to show the updated learning log
  revalidatePath('/')
  
  // Fetch the updated learning log with all details
  return getLearningLogById(input.id)
}

/**
 * Deletes a learning log
 * @param id The ID of the learning log to delete
 * @returns A boolean indicating whether the deletion was successful
 */
export async function deleteLearningLog(id: string): Promise<boolean> {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }
  
  // Check if the learning log exists and belongs to the user
  const { data: existingLog, error: fetchError } = await supabase
    .from('learning_logs')
    .select('id, user_id')
    .eq('id', id)
    .single()
  
  if (fetchError || !existingLog) {
    throw new Error('Learning log not found')
  }
  
  if (existingLog.user_id !== user.id) {
    throw new Error('You do not have permission to delete this learning log')
  }
  
  // Delete tag relationships first
  const { error: deleteTagsError } = await supabase
    .from('learning_log_tags')
    .delete()
    .eq('learning_log_id', id)
  
  if (deleteTagsError) {
    console.error('Error deleting tag relationships:', deleteTagsError)
    // Continue anyway, as we want to delete the learning log
  }
  
  // Delete the learning log
  const { error: deleteLogError } = await supabase
    .from('learning_logs')
    .delete()
    .eq('id', id)
  
  if (deleteLogError) {
    console.error('Error deleting learning log:', deleteLogError)
    throw new Error('Failed to delete learning log')
  }
  
  // Revalidate the home page to reflect the deletion
  revalidatePath('/')
  
  return true
} 