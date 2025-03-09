'use server'

import { createClient } from '@/utils/supabase/server'
import { Tag } from '@/lib/domains'

/**
 * Fetches all available tags from the database
 * @returns An array of Tag objects
 */
export async function getTags(): Promise<Tag[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('tags')
    .select('id, name, created_at, updated_at')
    .order('name')
  
  if (error) {
    console.error('Error fetching tags:', error)
    throw new Error('Failed to fetch tags')
  }
  
  // Transform the data to match the Tag domain model
  return (data || []).map(tag => ({
    id: tag.id,
    name: tag.name,
    createdAt: new Date(tag.created_at),
    updatedAt: new Date(tag.updated_at)
  }))
}

/**
 * Creates a new tag if it doesn't already exist
 * @param name The name of the tag to create
 * @returns The created or existing tag
 */
export async function createTag(name: string): Promise<Tag> {
  if (!name.trim()) {
    throw new Error('Tag name cannot be empty')
  }
  
  const supabase = await createClient()
  
  // Check if tag already exists
  const { data: existingTag } = await supabase
    .from('tags')
    .select('id, name, created_at, updated_at')
    .eq('name', name.trim())
    .maybeSingle()
  
  if (existingTag) {
    return {
      id: existingTag.id,
      name: existingTag.name,
      createdAt: new Date(existingTag.created_at),
      updatedAt: new Date(existingTag.updated_at)
    }
  }
  
  // Create new tag
  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('tags')
    .insert({
      name: name.trim(),
      created_at: now,
      updated_at: now
    })
    .select('id, name, created_at, updated_at')
    .single()
  
  if (error) {
    console.error('Error creating tag:', error)
    throw new Error('Failed to create tag')
  }
  
  return {
    id: data.id,
    name: data.name,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  }
} 