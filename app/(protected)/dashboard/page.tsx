import { getCurrentUser } from '@/lib/actions'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {user?.username || 'User'}!</h2>
        <p className="text-muted-foreground">
          Your current streak: <span className="font-medium text-primary">{user?.streak || 0} days</span>
        </p>
      </div>
      
      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Calendar View Coming Soon</h2>
        <p className="text-muted-foreground">
          This is where your learning calendar will be displayed.
        </p>
      </div>
    </div>
  )
} 