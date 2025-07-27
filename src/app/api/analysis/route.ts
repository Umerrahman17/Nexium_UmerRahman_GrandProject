import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const { resumeId, resumeContent } = await request.json()

    if (!resumeId || !resumeContent) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeId and resumeContent' },
        { status: 400 }
      )
    }

    // Call n8n analysis
    const analysisResult = await n8nClient.analyzeResume({
      resume: resumeContent
    })

    if (analysisResult.success) {
      // Update resume status in Supabase
      const supabase = createServerSupabaseClient()
      await supabase
        .from('resumes')
        .update({ 
          status: 'completed'
        })
        .eq('id', resumeId)

      // Store analysis result in MongoDB
      try {
        const client = await clientPromise
        const db = client.db('grandproject')
        const collection = db.collection('resumes')

        await collection.updateOne(
          { resumeId },
          { 
            $set: { 
              analysis: analysisResult,
              analyzedAt: new Date()
            }
          }
        )
      } catch (mongoError) {
        console.error('Error storing analysis result in MongoDB:', mongoError)
        // Continue even if MongoDB fails
      }

      return NextResponse.json({
        success: true,
        analysis: analysisResult
      })
    } else {
      // Update resume status to failed
      const supabase = createServerSupabaseClient()
      await supabase
        .from('resumes')
        .update({ 
          status: 'failed'
        })
        .eq('id', resumeId)

      return NextResponse.json({
        success: false,
        error: analysisResult.error || 'Analysis failed'
      })
    }

  } catch (error) {
    console.error('Error in analysis API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 