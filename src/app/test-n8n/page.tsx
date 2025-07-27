'use client'

import { useState } from 'react'
import { n8nClient } from '@/lib/n8n'

export default function TestN8nPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const testResumeAnalysis = async () => {
    setLoading(true)
    setError(null)
    setTestResult(null)

    try {
      const testPayload = {
        resume: `John Doe
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
• MongoDB Certified Developer`
      }

      const result = await n8nClient.analyzeResume(testPayload)
      setTestResult(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  const checkN8nStatus = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/n8n/status')
      const status = await response.json()
      setTestResult(status)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">n8n Integration Test</h1>
      
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">n8n Configuration</h2>
          <div className="space-y-2 text-sm">
            <p><strong>Webhook URL:</strong> https://umerrahman.app.n8n.cloud</p>
            <p><strong>API Key:</strong> {process.env.NEXT_PUBLIC_N8N_API_KEY ? 'Set (hidden)' : 'Not set'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Test Actions</h2>
          
          <div className="flex space-x-4">
            <button
              onClick={checkN8nStatus}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Checking...' : 'Check n8n Status'}
            </button>

            <button
              onClick={testResumeAnalysis}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Resume Analysis'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {testResult && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <h3 className="text-green-800 font-semibold mb-2">Test Result</h3>
            <pre className="text-sm text-green-700 overflow-auto">
              {JSON.stringify(testResult, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Ensure n8n cloud workflow is activated</li>
            <li>Import the resume analysis workflow</li>
            <li>Activate the workflow</li>
            <li>Test the integration using the buttons above</li>
          </ol>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Expected Results</h2>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>Check Status:</strong> Should show n8n connection status</li>
            <li><strong>Test Analysis:</strong> Should trigger resume analysis workflow</li>
            <li><strong>Analysis Result:</strong> Should return structured insights from aspect-based analysis</li>
            <li><strong>Database Update:</strong> Results should be stored in Supabase and MongoDB</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 