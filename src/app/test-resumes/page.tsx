'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestResumesPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debugInfo, setDebugInfo] = useState<any>(null)

  const testResumesAPI = async () => {
    setLoading(true)
    setError(null)
    setResumes([])

    try {
      console.log('Testing resumes API...')
      const response = await fetch('/api/resumes')
      console.log('Response status:', response.status)
      
      const data = await response.json()
      console.log('Resumes data:', data)
      
      setResumes(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error testing resumes API:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const testDebugAPI = async () => {
    try {
      const response = await fetch('/api/debug')
      const data = await response.json()
      setDebugInfo(data)
    } catch (error) {
      console.error('Error testing debug API:', error)
      setError(error instanceof Error ? error.message : 'Unknown error')
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Resume API Test</h1>
      
      <div className="space-y-6">
        <div className="flex space-x-4">
          <Button onClick={testResumesAPI} disabled={loading}>
            {loading ? 'Testing...' : 'Test Resumes API'}
          </Button>
          <Button onClick={testDebugAPI} variant="outline">
            Test Debug API
          </Button>
        </div>

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

        {resumes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Resumes Found ({resumes.length})</CardTitle>
              <CardDescription>
                Resumes returned from the API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {resumes.map((resume, index) => (
                  <div key={index} className="p-3 border rounded">
                    <p><strong>ID:</strong> {resume.id}</p>
                    <p><strong>Title:</strong> {resume.title}</p>
                    <p><strong>Status:</strong> {resume.status}</p>
                    <p><strong>Created:</strong> {resume.created_at}</p>
                    <p><strong>Has Content:</strong> {resume.content ? 'Yes' : 'No'}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {debugInfo && (
          <Card>
            <CardHeader>
              <CardTitle>Debug Information</CardTitle>
              <CardDescription>
                System status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="text-sm bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Test Resumes API" to check if resumes are being fetched</li>
              <li>Click "Test Debug API" to check system configuration</li>
              <li>Check the browser console for detailed logs</li>
              <li>If no resumes are found, try uploading a resume first</li>
              <li>Check the debug information for connection issues</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 