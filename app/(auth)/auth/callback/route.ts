import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const supabase = await createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      console.error('Error exchanging code for session:', error)
      return NextResponse.redirect(`${requestUrl.origin}/login?error=Authentication failed`)
    }

    // Check if the user exists in our database
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      // Check if user exists in our users table
      const { data: existingUser, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (userError && userError.code !== 'PGRST116') {
        console.error('Error checking user:', userError)
      }
      
      // If user doesn't exist, create a new user record
      if (!existingUser) {
        // Get username from user metadata if available (for email/password signup)
        // or from email if not (for OAuth)
        const username = user.user_metadata?.username || user.email?.split('@')[0] || `user_${Math.floor(Math.random() * 10000)}`
        
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            username,
            streak: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (insertError) {
          console.error('Error creating user:', insertError)
        }
      }
    }

    return NextResponse.redirect(requestUrl.origin)
  }

  // If no code is present, redirect to login
  return NextResponse.redirect(`${requestUrl.origin}/login?error=No code provided`)
} 