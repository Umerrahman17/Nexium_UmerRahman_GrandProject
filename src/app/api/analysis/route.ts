import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/analysis - Starting analysis request')
    
    const body = await request.json()
    console.log('Request body:', { resumeId: body.resumeId, contentLength: body.resumeContent?.length })
    
    const { resumeId, resumeContent } = body

    if (!resumeId || !resumeContent) {
      console.error('Missing required fields:', { resumeId: !!resumeId, resumeContent: !!resumeContent })
      return NextResponse.json(
        { error: 'Missing required fields: resumeId and resumeContent' },
        { status: 400 }
      )
    }

    console.log('Calling n8n analysis...')
    
    // Call n8n analysis
    const analysisResult = await n8nClient.analyzeResume({
      resume: resumeContent
    })

    console.log('n8n analysis result:', { 
      success: analysisResult.success, 
      error: analysisResult.error,
      score: analysisResult.score 
    })

    if (analysisResult.success) {
      console.log('Analysis successful, updating database...')
      
      // Update resume status in Supabase
      try {
        const supabase = createServerSupabaseClient()
        const { error: supabaseError } = await supabase
          .from('resumes')
          .update({ 
            status: 'completed'
          })
          .eq('id', resumeId)

        if (supabaseError) {
          console.error('Error updating Supabase:', supabaseError)
        }
      } catch (supabaseError) {
        console.error('Supabase update failed:', supabaseError)
      }

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
        console.log('Analysis result stored in MongoDB')
      } catch (mongoError) {
        console.error('Error storing analysis result in MongoDB:', mongoError)
        // Continue even if MongoDB fails
      }

      return NextResponse.json({
        success: true,
        analysis: analysisResult
      })
    } else {
      console.error('Analysis failed:', analysisResult.error)
      
      // Update resume status to failed
      try {
        const supabase = createServerSupabaseClient()
        await supabase
          .from('resumes')
          .update({ 
            status: 'failed'
          })
          .eq('id', resumeId)
      } catch (supabaseError) {
        console.error('Error updating Supabase status:', supabaseError)
      }

      return NextResponse.json({
        success: false,
        error: analysisResult.error || 'Analysis failed'
      })
    }

  } catch (error) {
    console.error('Error in analysis API:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 