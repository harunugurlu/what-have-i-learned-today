'use client'

import { Button } from '@/components/ui/button'
import { User } from '@/lib/domains'
import { LogOut, User as UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

interface UserProfileProps {
  user: User | null
}

export function UserProfile({ user }: UserProfileProps) {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const response = await fetch('/auth/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error signing out:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 bg-card shadow-sm rounded-full px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 rounded-full p-1">
            <UserIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-sm font-medium">{user.username}</span>
        </div>
        
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
        
        <div className="flex items-center gap-1">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {user.streak} day streak
          </span>
        </div>
      </div>
      
      <Button
        variant="outline"
        size="icon"
        onClick={handleSignOut}
        disabled={isSigningOut}
        className="hover:cursor-pointer rounded-full shadow-sm hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <LogOut className="h-5 w-5" />
        <span className="sr-only">Sign out</span>
      </Button>
    </div>
  )
} 