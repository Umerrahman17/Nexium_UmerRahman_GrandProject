import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get all analyses (in production, filter by user_id)
    const { data: analyses, error } = await supabase
      .from('analyses')
      .select(`
        *,
        resumes(title),
        jobs(title, company)
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching analyses:', error)
      return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 })
    }

    return NextResponse.json(analyses || [])
  } catch (error) {
    console.error('Error in analyses API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const body = await request.json()
    
    const { resume_id, job_id, analysis_type, content, score } = body

    // In production, get user_id from authenticated session
    const user_id = 'mock-user-id' // This should come from auth middleware

    const { data: analysis, error } = await supabase
      .from('analyses')
      .insert({
        user_id,
        resume_id,
        job_id,
        analysis_type,
        content,
        score
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating analysis:', error)
      return NextResponse.json({ error: 'Failed to create analysis' }, { status: 500 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error('Error in analyses POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 