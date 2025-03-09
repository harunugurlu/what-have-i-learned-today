'use client'

import { User } from '@/lib/domains'
import { createContext, useContext, useEffect, useState } from 'react'

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
})

export function useUser() {
  return useContext(UserContext)
}

interface UserProviderProps {
  initialUser: User | null
  children: React.ReactNode
}

export function UserProvider({ initialUser, children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(initialUser)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Update the user state when initialUser changes
    setUser(initialUser)
  }, [initialUser])

  return (
    <UserContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </UserContext.Provider>
  )
} 