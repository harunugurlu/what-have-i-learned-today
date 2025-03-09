'use server'

import { createClient } from '@/utils/supabase/server'

/**
 * Create a new user in the database
 * This is used during the signup process
 */
export async function createUser(userData: {
  id: string
  email: string
  username: string
}) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('users')
      .insert({
        id: userData.id,
        email: userData.email,
        username: userData.username,
        streak: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    
    if (error) {
      console.error('Error creating user:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 