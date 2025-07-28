'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function TestAnalysisPage() {
  const [testResume, setTestResume] = useState(`John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications using modern technologies including React, Node.js, and TypeScript.

SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, Python Flask, Java Spring
• Databases: MongoDB, PostgreSQL, MySQL
• Tools: Git, Docker, AWS, Jenkins

EXPERIENCE
Senior Software Engineer | TechCorp | 2022-Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2020-2022
• Built responsive web applications using React and Node.js
• Integrated third-party APIs and payment systems
• Collaborated with design team to implement UI/UX improvements

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2020

CERTIFICATIONS
• AWS Certified Developer Associate
• MongoDB Certified Developer`)

  const [analysisResult, setAnalysisResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testN8nConnection = async () => {
    setLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      console.log('Testing n8n connection...')
      const response = await fetch('/api/test-n8n', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resume: testResume })
      })

      const data = await response.json()
      console.log('n8n test result:', data)

      if (data.success) {
        setAnalysisResult(data.n8nResult)
      } else {
        setError(data.error || 'n8n test failed')
      }
    } catch (error) {
      console.error('n8n test error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testAnalysisAPI = async () => {
    setLoading(true)
    setError(null)
    setAnalysisResult(null)

    try {
      console.log('Testing analysis API...')
      const response = await fetch('/api/analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeId: 'test-resume-id',
          resumeContent: testResume
        })
      })

      const data = await response.json()
      console.log('Analysis API result:', data)

      if (data.success) {
        setAnalysisResult(data.analysis)
      } else {
        setError(data.error || 'Analysis API failed')
      }
    } catch (error) {
      console.error('Analysis API error:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Analysis Test</h1>
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button onClick={testN8nConnection} disabled={loading}>
            {loading ? 'Testing...' : 'Test n8n Connection'}
          </Button>
          <Button onClick={testAnalysisAPI} disabled={loading} variant="outline">
            {loading ? 'Testing...' : 'Test Analysis API'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Resume</CardTitle>
              <CardDescription>
                Edit the resume content to test different scenarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="test-resume">Resume Content</Label>
                <Textarea
                  id="test-resume"
                  value={testResume}
                  onChange={(e) => setTestResume(e.target.value)}
                  rows={15}
                  placeholder="Enter resume content to test..."
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {error && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-red-700">{error}</p>
                </CardContent>
              </Card>
            )}

            {analysisResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-green-600">Analysis Result</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Success:</strong> {analysisResult.success ? 'Yes' : 'No'}</p>
                    <p><strong>Score:</strong> {analysisResult.score}%</p>
                    {analysisResult.error && (
                      <p><strong>Error:</strong> {analysisResult.error}</p>
                    )}
                    {analysisResult.aspectScores && (
                      <div>
                        <strong>Aspect Scores:</strong>
                        <ul className="list-disc list-inside text-sm mt-1">
                                                     {Object.entries(analysisResult.aspectScores).slice(0, 5).map(([aspect, score]) => (
                             <li key={aspect}>{aspect}: {score as number}%</li>
                           ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Edit the resume content above to test different scenarios</li>
              <li>Click "Test n8n Connection" to check if n8n is working</li>
              <li>Click "Test Analysis API" to test the full analysis flow</li>
              <li>Check the browser console for detailed logs</li>
              <li>If n8n fails, the analysis page will use fallback analysis</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 