'use client'

import { useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Briefcase, TrendingUp, Plus } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Resume {
  id: string
  title: string
  created_at: string
}



interface Analysis {
  id: string
  analysis_type: string
  score: number
  created_at: string
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      setDataLoading(true)
      
      // Fetch resumes
      const resumesResponse = await fetch('/api/resumes')
      const resumesData = await resumesResponse.json()
      
      if (resumesData.success) {
        setResumes(resumesData.resumes || [])
      } else {
        console.error('Failed to fetch resumes:', resumesData.error)
        setResumes([])
      }

      // Fetch analyses
      const analysesResponse = await fetch('/api/analyses')
      const analysesData = await analysesResponse.json()
      
      if (analysesData.success) {
        setAnalyses(analysesData.analyses || [])
      } else {
        console.error('Failed to fetch analyses:', analysesData.error)
        setAnalyses([])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setResumes([])
      setAnalyses([])
    } finally {
      setDataLoading(false)
    }
  }

  // Calculate stats
  const stats = {
    resumes: resumes.length,
    analyses: analyses.length
  }

  // Format recent items
  const recentResumes = resumes.slice(0, 3).map(resume => ({
    id: resume.id,
    title: resume.title,
    updated: formatDate(resume.created_at)
  }))



  function formatDate(dateString: string) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  // Show loading while authentication is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <p className="text-muted-foreground mb-4">
            You need to be authenticated to access the dashboard.
          </p>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.email?.split('@')[0]}!</h1>
          <p className="text-muted-foreground">
            Ready to analyze your resume and get detailed insights?
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Resumes</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.resumes}</div>
              <p className="text-xs text-muted-foreground">
                {dataLoading ? 'Loading...' : 'Your uploaded resumes'}
              </p>
            </CardContent>
          </Card>



          

        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with resume analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/resumes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload New Resume
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/analysis">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Resume
                </Link>
              </Button>

              <Button asChild variant="outline" className="w-full">
                <Link href="/resumes">
                  <FileText className="mr-2 h-4 w-4" />
                  View All Resumes
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest resume activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recent Resumes</h4>
                  <div className="space-y-2">
                    {dataLoading ? (
                      <div className="text-sm text-muted-foreground">Loading...</div>
                    ) : recentResumes.length > 0 ? (
                      recentResumes.map((resume) => (
                        <div key={resume.id} className="flex justify-between items-center text-sm">
                          <span>{resume.title}</span>
                          <span className="text-muted-foreground">{resume.updated}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-muted-foreground">No resumes yet</div>
                    )}
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
} 