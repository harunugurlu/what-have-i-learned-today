import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  // Check if the user is authenticated
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    // Redirect to login if not authenticated
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen flex-col">
      {children}
    </div>
  )
} 