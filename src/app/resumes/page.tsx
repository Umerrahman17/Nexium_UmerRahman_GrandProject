'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, FileText, Calendar, Trash2, Eye, Edit } from 'lucide-react'
import Link from 'next/link'

interface Resume {
  id: string
  title: string
  status: string
  created_at: string
  updated_at: string
  file_name?: string
  user_id?: string
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchResumes()
  }, [])

  const fetchResumes = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/resumes')
      const data = await response.json()

      if (data.success) {
        setResumes(data.resumes || [])
      } else {
        setError(data.error || 'Failed to fetch resumes')
      }
    } catch (error) {
      setError('Failed to fetch resumes')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setResumes(resumes.filter(resume => resume.id !== resumeId))
      } else {
        setError('Failed to delete resume')
      }
    } catch (error) {
      setError('Failed to delete resume')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Loading resumes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Resumes</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your uploaded resumes
          </p>
        </div>
        <Button asChild>
          <Link href="/resumes/new">
            <Plus className="mr-2 h-4 w-4" />
            Upload Resume
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      )}

      {resumes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No resumes yet</h3>
              <p className="text-muted-foreground mb-4">
                Upload your first resume to get started with analysis
              </p>
              <Button asChild>
                <Link href="/resumes/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Upload Resume
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {resumes.map((resume) => (
            <Card key={resume.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{resume.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {new Date(resume.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(resume.status)}>
                    {resume.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/analysis?resumeId=${resume.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Analyze
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDelete(resume.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 