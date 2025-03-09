import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'
import { LogOut } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get the user's profile from our database
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user?.id)
    .single()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Image src="/logo.svg" alt="Logo" width={32} height={32} />
              <span className="text-lg font-bold">What Have I Learned Today</span>
            </Link>
          </div>
          <nav className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {profile?.username || 'User'}
              </span>
              <span className="rounded-full bg-primary px-2 py-1 text-xs font-medium text-primary-foreground">
                {profile?.streak || 0} day streak
              </span>
            </div>
            <form action="/auth/signout" method="post">
              <Button variant="ghost" size="icon" type="submit">
                <LogOut className="h-5 w-5" />
                <span className="sr-only">Sign out</span>
              </Button>
            </form>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 