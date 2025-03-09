import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createUser } from '@/lib/actions/user'

export async function GET(request: Request) {
  // The `/auth/callback` route is required for the server-side auth flow
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    
    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)
    
    // Get the user
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if the user exists in the users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      // If the user doesn't exist in our users table, create them
      if (!existingUser) {
        // Derive username from metadata or email
        const username = user.user_metadata?.username || 
                         user.email?.split('@')[0] || 
                         `user_${Math.random().toString(36).substring(2, 10)}`
        
        const result = await createUser({
          id: user.id,
          email: user.email || '',
          username
        })
        
        if (!result.success) {
          console.error('Failed to create user record:', result.error)
          return NextResponse.redirect(
            `${requestUrl.origin}/login?error=Failed to create user record: ${result.error}`
          )
        }
      }
    }
  }

  return NextResponse.redirect(requestUrl.origin)
} 