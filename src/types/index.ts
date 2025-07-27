// User types
export interface User {
  id: string
  email: string
  name?: string
  created_at: string
  updated_at: string
}

// Resume types
export interface Resume {
  id: string
  user_id: string
  title: string
  content: string
  file_url?: string
  file_name?: string
  file_size?: number
  created_at: string
  updated_at: string
  is_optimized: boolean
  original_resume_id?: string
}

// Job Description types
export interface JobDescription {
  id: string
  user_id: string
  title: string
  company: string
  description: string
  requirements: string[]
  skills: string[]
  experience_level: 'entry' | 'mid' | 'senior' | 'lead'
  created_at: string
  updated_at: string
}

// Analysis types
export interface ResumeAnalysis {
  id: string
  resume_id: string
  job_id: string
  user_id: string
  overall_score: number
  skills_match: number
  experience_match: number
  keyword_match: number
  missing_skills: string[]
  suggestions: string[]
  created_at: string
}

// Optimization types
export interface ResumeOptimization {
  id: string
  original_resume_id: string
  user_id: string
  optimized_content: string
  improvements: string[]
  score_improvement: number
  created_at: string
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// File Upload types
export interface FileUpload {
  file: File
  progress: number
  status: 'idle' | 'uploading' | 'success' | 'error'
  error?: string
}

// n8n Webhook types
export interface N8nWebhookPayload {
  type: 'resume_analysis' | 'job_analysis' | 'optimization'
  data: any
  user_id: string
}

// Form types
export interface ResumeFormData {
  title: string
  content: string
  file?: File
}

export interface JobFormData {
  title: string
  company: string
  description: string
  requirements: string
} 