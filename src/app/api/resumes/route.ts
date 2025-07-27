import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'
import { n8nClient } from '@/lib/n8n'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    
    // Get the user from the request (you'll need to implement auth middleware)
    // For now, we'll get all resumes (in production, filter by user_id)
    const { data: resumes, error } = await supabase
      .from('resumes')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching resumes:', error)
      return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 })
    }

    // If we have resumes, fetch their content from MongoDB
    if (resumes && resumes.length > 0) {
      try {
        const client = await clientPromise
        const db = client.db('grandproject')
        const collection = db.collection('resumes')

        const resumesWithContent = await Promise.all(
          resumes.map(async (resume) => {
            try {
              const mongoDoc = await collection.findOne({ resumeId: resume.id })
              return {
                ...resume,
                content: mongoDoc?.content || null,
                analysis: mongoDoc?.analysis || null,
              }
            } catch (error) {
              console.error(`Error fetching content for resume ${resume.id}:`, error)
              return {
                ...resume,
                content: null,
                analysis: null,
              }
            }
          })
        )

        return NextResponse.json(resumesWithContent)
      } catch (mongoError) {
        console.error('MongoDB error:', mongoError)
        // Return resumes without content if MongoDB fails
        return NextResponse.json(resumes.map(resume => ({
          ...resume,
          content: null,
          analysis: null,
        })))
      }
    }

    return NextResponse.json(resumes || [])
  } catch (error) {
    console.error('Error in GET /api/resumes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabaseClient()
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const content = formData.get('content') as string
    const userId = formData.get('userId') as string

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing required field: userId' },
        { status: 400 }
      )
    }

    if (!file && !content) {
      return NextResponse.json(
        { error: 'Missing required field: file or content' },
        { status: 400 }
      )
    }

    let fileContent = content || ''
    let fileName = 'manual-input.txt'
    let fileType = 'text/plain'

    // If file is provided, read its content
    if (file) {
      const fileBuffer = await file.arrayBuffer()
      fileContent = new TextDecoder().decode(fileBuffer)
      fileName = file.name
      fileType = file.type
    }

    // Generate a title from the first few words of content
    const title = fileContent.split('\n')[0].substring(0, 50) + '...'

    // Store in Supabase (metadata)
    const { data: resume, error: supabaseError } = await supabase
      .from('resumes')
      .insert({
        title,
        file_name: fileName,
        file_type: fileType,
        file_size: file ? file.size : Buffer.from(fileContent).length,
        user_id: userId,
        status: 'uploaded'
      })
      .select()
      .single()

    if (supabaseError) {
      console.error('Error storing resume metadata:', supabaseError)
      return NextResponse.json({ error: 'Failed to store resume' }, { status: 500 })
    }

    // Store content in MongoDB
    try {
      const client = await clientPromise
      const db = client.db('grandproject')
      const collection = db.collection('resumes')

      await collection.insertOne({
        resumeId: resume.id,
        content: fileContent,
        fileName: fileName,
        fileType: fileType,
        userId: userId,
        uploadedAt: new Date(),
        analysis: null
      })
    } catch (mongoError) {
      console.error('Error storing resume content in MongoDB:', mongoError)
      // Continue even if MongoDB fails - we can retry later
    }

    // Trigger n8n analysis - send only the resume content as expected by the workflow
    try {
      const analysisResult = await n8nClient.analyzeResume({
        resume: fileContent // n8n workflow expects just the resume text
      })

      if (analysisResult.success) {
        // Update resume status to analyzing
        await supabase
          .from('resumes')
          .update({ 
            status: 'analyzing'
          })
          .eq('id', resume.id)

        // Store analysis result in MongoDB
        try {
          const client = await clientPromise
          const db = client.db('grandproject')
          const collection = db.collection('resumes')

          await collection.updateOne(
            { resumeId: resume.id },
            { 
              $set: { 
                analysis: analysisResult,
                analyzedAt: new Date()
              }
            }
          )
        } catch (mongoError) {
          console.error('Error storing analysis result in MongoDB:', mongoError)
        }

        // Update resume status to completed
        await supabase
          .from('resumes')
          .update({ 
            status: 'completed'
          })
          .eq('id', resume.id)

        return NextResponse.json({ 
          success: true, 
          resumeId: resume.id,
          analysis: analysisResult
        })
      } else {
        console.error('n8n analysis failed:', analysisResult.error)
        await supabase
          .from('resumes')
          .update({ 
            status: 'failed'
          })
          .eq('id', resume.id)

        // Even if n8n analysis fails, the resume was uploaded successfully
        return NextResponse.json({ 
          success: true, 
          resumeId: resume.id,
          message: 'Resume uploaded successfully, but analysis failed. You can retry analysis later.',
          analysisError: analysisResult.error
        })
      }
    } catch (n8nError) {
      console.error('Error calling n8n:', n8nError)
      await supabase
        .from('resumes')
        .update({ 
          status: 'failed'
        })
        .eq('id', resume.id)

      // Even if n8n analysis fails, the resume was uploaded successfully
      return NextResponse.json({ 
        success: true, 
        resumeId: resume.id,
        message: 'Resume uploaded successfully, but analysis failed. You can retry analysis later.',
        analysisError: 'Failed to analyze resume'
      })
    }

  } catch (error) {
    console.error('Error in POST /api/resumes:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 