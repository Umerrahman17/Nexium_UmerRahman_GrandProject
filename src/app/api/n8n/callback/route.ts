import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      resumeId, 
      analysisId, 
      success, 
      score, 
      aspectScores, 
      recommendations, 
      flags, 
      insights 
    } = body

    if (!resumeId || !analysisId) {
      return NextResponse.json(
        { error: 'Missing required fields: resumeId or analysisId' },
        { status: 400 }
      )
    }

    const supabase = createServerSupabaseClient()

    if (success) {
      // Store all of these in MongoDB (insights collection)
      try {
        const client = await clientPromise
        const db = client.db('grandproject')
        const collection = db.collection('resumes')

        await collection.updateOne(
          { resumeId: resumeId },
          { 
            $set: { 
              analysis: {
                analysisId: analysisId,
                score: score,
                aspectScores: aspectScores,
                recommendations: recommendations,
                flags: flags,
                insights: insights,
                completedAt: new Date(),
                status: 'completed'
              },
              analysisStatus: 'completed'
            }
          }
        )

        console.log(`Analysis completed for resume ${resumeId}`)
      } catch (mongoError) {
        console.error('Error storing analysis results in MongoDB:', mongoError)
      }

      // Store score, recommendations, and summary in Supabase (analyses table)
      try {
        await supabase
          .from('analyses')
          .insert({
            resume_id: resumeId,
            analysis_id: analysisId,
            analysis_type: 'resume_analysis',
            status: 'completed',
            score: score,
            recommendations: recommendations,
            summary: insights.summary,
            created_at: new Date().toISOString()
          })
      } catch (analysisError) {
        console.error('Error creating analysis record:', analysisError)
      }

    } else {
      // Analysis failed
      const { error: supabaseError } = await supabase
        .from('resumes')
        .update({ 
          status: 'analysis_failed',
          analysis_error: 'Unknown error'
        })
        .eq('id', resumeId)

      if (supabaseError) {
        console.error('Error updating resume status in Supabase:', supabaseError)
      }

      // Update MongoDB with error status
      try {
        const client = await clientPromise
        const db = client.db('grandproject')
        const collection = db.collection('resumes')

        await collection.updateOne(
          { resumeId: resumeId },
          { 
            $set: { 
              analysis: {
                analysisId: analysisId,
                error: 'Unknown error',
                completedAt: new Date(),
                status: 'failed'
              },
              analysisStatus: 'failed'
            }
          }
        )
      } catch (mongoError) {
        console.error('Error updating analysis error in MongoDB:', mongoError)
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Analysis callback processed successfully' 
    })

  } catch (e) {
    console.error('Error processing n8n callback:', e)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 