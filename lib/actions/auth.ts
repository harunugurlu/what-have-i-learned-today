import { createClient } from '@/utils/supabase/server'
import { User } from '@/lib/domains'
import { redirect } from 'next/navigation'

/**
 * Get the current authenticated user
 * @returns The authenticated user or null if not authenticated
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient()
  
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      return null
    }
    
    // Get the user's profile from our database
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      return null
    }
    
    return {
      id: profile.id,
      username: profile.username,
      email: profile.email,
      streak: profile.streak,
      createdAt: new Date(profile.created_at),
      updatedAt: new Date(profile.updated_at)
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}

/**
 * Update the user's profile
 * @param userId The user's ID
 * @param data The data to update
 */
export async function updateUserProfile(
  userId: string,
  data: Partial<Pick<User, 'username' | 'streak'>>
) {
  const supabase = await createClient()
  
  try {
    const { error } = await supabase
      .from('users')
      .update({
        ...data,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
    
    if (error) {
      console.error('Error updating user profile:', error)
      return { success: false, error: error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
} 