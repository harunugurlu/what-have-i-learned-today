import { createClient } from '@/utils/supabase/server'

export default async function DashboardPage() {
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
    <div className="container py-8">
      <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
      <div className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">Welcome, {profile?.username || 'User'}!</h2>
        <p className="text-muted-foreground">
          Your current streak: <span className="font-medium text-primary">{profile?.streak || 0} days</span>
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