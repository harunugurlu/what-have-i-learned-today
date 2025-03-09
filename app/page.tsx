'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/domains'
import { getLearningLogs, getLearningLogById, LearningLogWithDetails, deleteLearningLog } from '@/lib/actions/learning-log'
import { getCurrentUser } from '@/lib/actions/auth'
import { UserProfile, Calendar, LearningLogDialog, LearningLogDetails } from '@/components/molecules'

interface FormattedLearningLog {
  id: string
  date: Date
  title: string
  colorHex: string
  tags: string[]
}

export default function Home() {
  const router = useRouter()
  const [userProfile, setUserProfile] = useState<User | null>(null)
  const [learningLogs, setLearningLogs] = useState<FormattedLearningLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // State for the add learning log dialog
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  
  // State for the learning log details dialog
  const [selectedLearningLogId, setSelectedLearningLogId] = useState<string | null>(null)
  const [selectedLearningLog, setSelectedLearningLog] = useState<LearningLogWithDetails | null>(null)
  const [isLoadingLearningLog, setIsLoadingLearningLog] = useState(false)
  const [learningLogError, setLearningLogError] = useState<string | null>(null)
  
  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Get user profile
      const user = await getCurrentUser()
      setUserProfile(user)
      
      // Get learning logs
      const logs = await getLearningLogs()
      setLearningLogs(logs)
    } catch (error: any) {
      console.error('Error fetching data:', error)
      setError(error.message || 'Failed to load data')
      
      // If unauthorized, redirect to login
      if (error.message?.includes('not authenticated')) {
        router.push('/login')
      }
    } finally {
      setIsLoading(false)
    }
  }
  
  // Fetch data on component mount
  useEffect(() => {
    fetchData()
  }, [])
  
  // Fetch learning log details when a log is selected
  useEffect(() => {
    if (selectedLearningLogId) {
      const fetchLogDetails = async () => {
        setIsLoadingLearningLog(true)
        try {
          const logDetails = await getLearningLogById(selectedLearningLogId)
          setSelectedLearningLog(logDetails)
        } catch (error) {
          console.error('Error fetching learning log details:', error)
          setSelectedLearningLog(null)
        } finally {
          setIsLoadingLearningLog(false)
        }
      }
      
      fetchLogDetails()
    }
  }, [selectedLearningLogId])
  
  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    setIsAddModalOpen(true)
  }
  
  const handleCloseAddModal = () => {
    setIsAddModalOpen(false)
    setSelectedDate(null)
  }
  
  const handleSelectLearningLog = (id: string) => {
    setSelectedLearningLogId(id)
  }
  
  const handleCloseDetailsModal = () => {
    setSelectedLearningLogId(null)
    setSelectedLearningLog(null)
  }
  
  // Handle deleting a learning log
  const handleDeleteLearningLog = async (id: string) => {
    try {
      await deleteLearningLog(id)
      // Close the details dialog
      setSelectedLearningLogId(null)
      setSelectedLearningLog(null)
      // Refresh the data
      fetchData()
    } catch (error: any) {
      console.error('Error deleting learning log:', error)
      setLearningLogError(error.message || 'Failed to delete learning log')
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header with user profile */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">What Have I Learned Today?</h1>
          {userProfile && <UserProfile user={userProfile} />}
        </div>
        
        {/* Main content */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar (80% width on desktop) */}
          <div className="lg:w-4/5">
            {isLoading ? (
              <div className="flex justify-center items-center h-96 bg-muted/30 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col justify-center items-center h-96 bg-muted/30 rounded-lg">
                <p className="text-destructive font-medium">{error}</p>
                <button 
                  onClick={fetchData}
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <Calendar 
                learningLogs={learningLogs}
                onSelectDate={handleSelectDate}
                onSelectLearningLog={handleSelectLearningLog}
              />
            )}
          </div>
          
          {/* Sidebar (20% width on desktop) */}
          <div className="lg:w-1/5 space-y-6">
            {/* Streak */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Current Streak</h2>
              <p className="text-3xl font-bold">{userProfile?.streak || 0} days</p>
            </div>
            
            {/* Recent Tags */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h2 className="text-lg font-medium mb-2">Recent Tags</h2>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(learningLogs.flatMap(log => log.tags)))
                  .slice(0, 10)
                  .map(tag => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                {learningLogs.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Add Learning Log Dialog */}
        {selectedDate && (
          <LearningLogDialog
            isOpen={isAddModalOpen}
            onClose={handleCloseAddModal}
            date={selectedDate}
          />
        )}
        
        {/* Learning Log Details Dialog */}
        <LearningLogDetails
          isOpen={!!selectedLearningLogId}
          onClose={handleCloseDetailsModal}
          learningLog={selectedLearningLog}
          isLoading={isLoadingLearningLog}
          onDelete={handleDeleteLearningLog}
        />
      </div>
    </div>
  )
}
