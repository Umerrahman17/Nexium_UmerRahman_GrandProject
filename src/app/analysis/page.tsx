'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { TrendingUp, FileText, Target, CheckCircle, AlertCircle, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

interface Resume {
  id: string
  title: string
  created_at: string
  status: string
  file_name?: string
}

export default function AnalysisPage() {
  const { user } = useAuth()
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [selectedResume, setSelectedResume] = useState('')
  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch resumes from API
  useEffect(() => {
    if (user) {
      fetchResumes()
    }
  }, [user])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Fetching resumes...')
      
      const response = await fetch('/api/resumes')
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Fetched resumes:', data)
      
      // Ensure data is an array
      if (Array.isArray(data)) {
      setResumes(data)
      } else if (data && Array.isArray(data.data)) {
        setResumes(data.data)
      } else {
        console.error('Unexpected data format:', data)
        setResumes([])
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
      setError(error instanceof Error ? error.message : 'Failed to load resumes')
      toast.error('Failed to load resumes')
      setResumes([])
      
      // Add fallback for development/testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Adding fallback resumes for development')
        setResumes([
          {
            id: 'fallback-test-1',
            title: 'Sample Resume 1',
            created_at: new Date().toISOString(),
            status: 'completed',
            file_name: 'sample-resume-1.txt'
          },
          {
            id: 'fallback-test-2', 
            title: 'Sample Resume 2',
            created_at: new Date().toISOString(),
            status: 'completed',
            file_name: 'sample-resume-2.txt'
          }
        ])
        setError('Using fallback data for development. Check console for API errors.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAnalysis = async () => {
    if (!selectedResume) {
      toast.error('Please select a resume')
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult(null)

    try {
      console.log('Getting resume content for ID:', selectedResume)
      
      // Get the selected resume content from MongoDB
      const response = await fetch(`/api/resumes/${selectedResume}/content`)
      console.log('Content response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch resume content: ${response.status}`)
      }
      
      const resumeData = await response.json()
      console.log('Resume data:', resumeData)

      if (!resumeData.content) {
        toast.error('Resume content not found')
        return
      }

      console.log('Calling analysis API...')

      // Call n8n analysis
      const analysisResponse = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: selectedResume,
          resumeContent: resumeData.content
        })
      })

      console.log('Analysis response status:', analysisResponse.status)
      
      if (!analysisResponse.ok) {
        const errorData = await analysisResponse.json()
        throw new Error(errorData.error || `Analysis failed: ${analysisResponse.status}`)
      }

      const analysisData = await analysisResponse.json()
      console.log('Analysis result:', analysisData)

      if (analysisData.success) {
        setAnalysisResult(analysisData.analysis)
        toast.success('Analysis completed successfully!')
      } else {
        // Try fallback analysis if n8n fails
        console.log('n8n analysis failed, trying fallback...')
        const fallbackResult = performFallbackAnalysis(resumeData.content)
        setAnalysisResult(fallbackResult)
        toast.success('Analysis completed (using fallback)!')
      }
    } catch (error) {
      console.error('Analysis error:', error)
      
      // If all else fails, try fallback analysis
      try {
        const resumeResponse = await fetch(`/api/resumes/${selectedResume}/content`)
        const resumeData = await resumeResponse.json()
        
        if (resumeData.content) {
          console.log('Using fallback analysis due to error')
          const fallbackResult = performFallbackAnalysis(resumeData.content)
          setAnalysisResult(fallbackResult)
          toast.success('Analysis completed (using fallback)!')
        } else {
          toast.error(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
        }
      } catch (fallbackError) {
        console.error('Fallback analysis also failed:', fallbackError)
        toast.error(error instanceof Error ? error.message : 'Analysis failed. Please try again.')
      }
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Fallback analysis function
  const performFallbackAnalysis = (content: string) => {
    const words = content.split(/\s+/).length
    const sentences = content.split(/[.!?]/).length
    const hasSkills = /skills|technologies|tools/i.test(content)
    const hasExperience = /experience|work|job/i.test(content)
    const hasEducation = /education|degree|university/i.test(content)
    
    const aspectScores = {
      dateFormatting: 8,
      education: hasEducation ? 10 : 5,
      skills: hasSkills ? 10 : 5,
      buzzwords: 7,
      quantifyImpact: 6,
      length: words > 100 && words < 1000 ? 10 : 5,
      bulletLength: 8,
      weakVerbs: 7,
      fillerWords: 8,
      leadership: 6,
      communication: 7,
      analytical: 6,
      teamwork: 6,
      drive: 6,
      responsibilities: 7,
      personalPronouns: 8,
      spellingConsistency: 9,
      unnecessarySections: 9,
      repetition: 8,
      readability: 7,
      summary: 6,
      contactDetails: 8,
      activeVoice: 7,
      consistency: 8,
      pageDensity: 7,
      verbTenses: 8,
      useOfBullets: 7,
      growthSignals: 6
    }
    
    const avgScore = Math.round(Object.values(aspectScores).reduce((a, b) => a + b, 0) / Object.values(aspectScores).length)
    
    return {
      success: true,
      score: avgScore,
      aspectScores,
      recommendations: [
        'Consider adding more quantifiable achievements',
        'Include specific metrics and results',
        'Use more action verbs to describe your experience',
        'Ensure your resume is tailored to the job description'
      ],
      flags: [
        'Could use more specific achievements',
        'Consider adding more keywords from job descriptions'
      ]
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Button asChild>
            <Link href="/auth">Sign In</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Resume Analysis</h1>
          <p className="text-muted-foreground">
            Get comprehensive analysis of your resume with detailed insights and improvement suggestions
          </p>
        </div>

        {/* Selection Form */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Select Resume</CardTitle>
                <CardDescription>
                  Choose a resume to analyze
                </CardDescription>
              </div>
              <div className="flex space-x-2">
              <Button 
                onClick={fetchResumes} 
                variant="outline" 
                size="sm"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Refresh'}
              </Button>
                <Button asChild size="sm">
                  <Link href="/resumes/new">
                    <Plus className="mr-2 h-4 w-4" />
                    Upload New
                  </Link>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Debug Info */}
            {error && (
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="text-red-800 font-semibold mb-2">Error</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Resume Count */}
            <div className="text-sm text-muted-foreground">
              Found {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
            </div>

              {/* Resume Selection */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Resume</label>
                <Select value={selectedResume} onValueChange={setSelectedResume}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {loading ? (
                    <SelectItem value="loading" disabled>Loading resumes...</SelectItem>
                    ) : resumes.length === 0 ? (
                    <SelectItem value="no-resumes" disabled>
                      <div className="p-4 text-center">
                        <p className="text-sm text-muted-foreground mb-2">No resumes found</p>
                        <Button asChild size="sm">
                          <Link href="/resumes/new">
                            <Plus className="mr-2 h-4 w-4" />
                            Upload Your First Resume
                          </Link>
                        </Button>
                      </div>
                    </SelectItem>
                    ) : (
                      resumes.map((resume) => (
                        <SelectItem key={resume.id} value={resume.id}>
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4" />
                          <div className="flex flex-col">
                            <span className="font-medium">{resume.title}</span>
                            <span className="text-xs text-muted-foreground">
                              {resume.file_name && `${resume.file_name} • `}
                              {new Date(resume.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          </div>
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
            </div>

            <Button
              onClick={handleAnalysis}
              disabled={isAnalyzing || !selectedResume || loading}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="space-y-6">
            {/* Overall Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Overall Match Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-primary">
                    {analysisResult.score}%
                  </div>
                  <Progress value={analysisResult.score} className="w-full" />
                  <p className="text-sm text-muted-foreground">
                    Your resume scored {analysisResult.score}% overall based on comprehensive analysis
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Scores */}
            {analysisResult.aspectScores && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(analysisResult.aspectScores).map(([aspect, score]) => (
                  <Card key={aspect}>
                <CardHeader>
                      <CardTitle className="text-lg capitalize">
                        {aspect.replace(/([A-Z])/g, ' $1').trim()}
                      </CardTitle>
                </CardHeader>
                <CardContent>
                      <div className="text-2xl font-bold text-primary">
                        {score as number}%
                  </div>
                </CardContent>
              </Card>
                ))}
                  </div>
            )}

            {/* Recommendations */}
            {analysisResult.recommendations && analysisResult.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Optimization Suggestions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {analysisResult.recommendations.map((suggestion: string, index: number) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            )}

            {/* Flags */}
            {analysisResult.flags && analysisResult.flags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {analysisResult.flags.map((flag: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                    >
                      {flag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button className="flex-1">
                <TrendingUp className="mr-2 h-4 w-4" />
                Optimize Resume
              </Button>
              <Button variant="outline" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                View Detailed Report
              </Button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
} 