'use client'

import { useEffect, useState } from 'react'
import { Calendar } from '@/components/molecules/calendar'
import { UserProfile } from '@/components/molecules/user-profile'
import { LearningLogDialog } from '@/components/molecules/learning-log-dialog'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/domains'
import { getLearningLogs } from '@/lib/actions'

interface FormattedLearningLog {
  id: string
  date: Date
  title: string
  details: string
  colorHex: string
  tags: string[]
}

export default function Home() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [learningLogs, setLearningLogs] = useState<FormattedLearningLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  const fetchData = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }
      
      // Get the user profile from our users table
      const { data: userProfileData } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      // Get learning logs using the server action
      const learningLogsData = await getLearningLogs()
      
      // Transform the user data to match the User interface
      const transformedUserProfile = userProfileData ? {
        id: userProfileData.id,
        username: userProfileData.username,
        email: userProfileData.email,
        streak: userProfileData.streak,
        createdAt: new Date(userProfileData.created_at),
        updatedAt: new Date(userProfileData.updated_at)
      } : null
      
      setUserProfile(transformedUserProfile)
      setLearningLogs(learningLogsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchData()
  }, [router])
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedDate(null)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">What Have I Learned Today</h1>
        {userProfile && <UserProfile user={userProfile} />}
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main calendar section - takes up more space */}
        <div className="lg:w-4/5 bg-card shadow-md p-8 rounded-lg">
          <Calendar 
            onSelectDate={handleSelectDate}
            learningLogs={learningLogs}
          />
        </div>
        
        {/* Sidebar with streak and tags */}
        <div className="lg:w-1/5 space-y-8">
          <div className="bg-card shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Your Streak</h2>
            <div className="flex items-center justify-center h-24">
              <span className="text-5xl font-bold">{userProfile?.streak || 0}</span>
              <span className="ml-2 text-muted-foreground">days</span>
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Keep learning every day to build your streak!
            </p>
          </div>
          
          <div className="bg-card shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Recent Tags</h2>
            <div className="flex flex-wrap gap-2">
              {learningLogs.flatMap(log => log.tags).length > 0 ? (
                [...new Set(learningLogs.flatMap(log => log.tags))].slice(0, 10).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-muted rounded-md text-sm">
                    {tag}
                  </span>
                ))
              ) : (
                <span className="px-2 py-1 bg-muted rounded-md text-sm">No tags yet</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Learning Log Dialog */}
      {selectedDate && (
        <LearningLogDialog
          isOpen={isModalOpen}
          onClose={handleModalClose}
          date={selectedDate}
        />
      )}
    </div>
  )
}
