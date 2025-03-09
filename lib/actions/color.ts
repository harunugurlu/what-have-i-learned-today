'use server'

import { createClient } from '@/utils/supabase/server'
import { Color } from '@/lib/domains'

/**
 * Fetches all available colors from the database
 * @returns An array of Color objects
 */
export async function getColors(): Promise<Color[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('colors')
    .select('id, name, hex_code, created_at, updated_at')
    .order('name')
  
  if (error) {
    console.error('Error fetching colors:', error)
    throw new Error('Failed to fetch colors')
  }
  
  // Transform the data to match the Color domain model
  return (data || []).map(color => ({
    id: color.id,
    name: color.name,
    hexCode: color.hex_code,
    createdAt: new Date(color.created_at),
    updatedAt: new Date(color.updated_at)
  }))
} 