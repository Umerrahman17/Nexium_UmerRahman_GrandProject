'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Layout } from '@/components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Upload, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function NewResumePage() {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    content: '',
    file: null as File | null
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('File size must be less than 5MB')
        return
      }
      setFormData(prev => ({ ...prev, file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formDataToSend = new FormData()
      
      if (formData.file) {
        formDataToSend.append('file', formData.file)
      }
      
      if (formData.content) {
        formDataToSend.append('content', formData.content)
      }
      
      formDataToSend.append('userId', user?.id || '')

      const response = await fetch('/api/resumes', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        if (result.analysisError) {
          toast.success('Resume uploaded successfully!')
          toast.warning('Analysis failed. You can retry analysis later.')
        } else {
          toast.success('Resume uploaded and analyzed successfully!')
        }
        // Redirect to dashboard or resume list
        window.location.href = '/dashboard'
      } else {
        toast.error(result.error || 'Failed to upload resume. Please try again.')
      }
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Failed to upload resume. Please try again.')
    } finally {
      setIsLoading(false)
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
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Upload New Resume</h1>
            <p className="text-muted-foreground">
              Upload your resume to start optimizing it for job applications
            </p>
          </div>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Resume Details</CardTitle>
            <CardDescription>
              Upload your resume file or paste the content manually
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* File Upload */}
              <div className="space-y-2">
                <Label htmlFor="file">Resume File (PDF, DOCX)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    Drag and drop your resume here, or click to browse
                  </p>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf,.docx,.doc"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file')?.click()}
                  >
                    Choose File
                  </Button>
                  {formData.file && (
                    <div className="mt-2 flex items-center justify-center space-x-2">
                      <FileText className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{formData.file.name}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Resume Content (Optional)</Label>
                <Textarea
                  id="content"
                  placeholder="Paste your resume content here if you prefer manual input..."
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  rows={10}
                />
                <p className="text-xs text-muted-foreground">
                  If you upload a file, the content will be extracted automatically. 
                  You can also paste the content manually for editing.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || (!formData.file && !formData.content)}
              >
                {isLoading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resume
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Tips for Better Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Use clear, professional formatting</li>
              <li>• Include relevant keywords from job descriptions</li>
              <li>• Keep your resume up to date with recent experience</li>
              <li>• Use action verbs to describe your achievements</li>
              <li>• Ensure your contact information is current</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 