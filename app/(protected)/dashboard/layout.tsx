'use client'

import { UserProfile } from '@/components/molecules'
import { useUser } from '@/components/molecules/user-provider'
import Image from 'next/image'
import Link from 'next/link'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user } = useUser()

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
            <UserProfile user={user} />
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
} 