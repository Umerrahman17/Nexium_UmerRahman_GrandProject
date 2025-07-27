import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resumeId = params.id

    if (!resumeId) {
      return NextResponse.json({ error: 'Resume ID is required' }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db('grandproject')
    const collection = db.collection('resumes')

    const resumeDoc = await collection.findOne({ resumeId })

    if (!resumeDoc) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 })
    }

    return NextResponse.json({
      content: resumeDoc.content,
      fileName: resumeDoc.fileName,
      fileType: resumeDoc.fileType,
      uploadedAt: resumeDoc.uploadedAt
    })

  } catch (error) {
    console.error('Error fetching resume content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 