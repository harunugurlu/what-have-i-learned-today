import { getCurrentUser } from '@/lib/actions'
import { UserProvider } from '@/components/molecules'
import { redirect } from 'next/navigation'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getCurrentUser()

  if (!user) {
    // Redirect to login if not authenticated
    redirect('/login')
  }

  return (
    <UserProvider initialUser={user}>
      <div className="flex min-h-screen flex-col">
        {children}
      </div>
    </UserProvider>
  )
} 