import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('DELETE /api/resumes/[id] - Deleting resume:', params.id)
    
    const resumeId = params.id

    // Delete from Supabase
    try {
      const supabase = createServerSupabaseClient()
      const { error: supabaseError } = await supabase
        .from('resumes')
        .delete()
        .eq('id', resumeId)

      if (supabaseError) {
        console.error('Error deleting from Supabase:', supabaseError)
        return NextResponse.json(
          { error: 'Failed to delete resume from database' },
          { status: 500 }
        )
      }
    } catch (supabaseError) {
      console.error('Supabase delete failed:', supabaseError)
      return NextResponse.json(
        { error: 'Failed to delete resume from database' },
        { status: 500 }
      )
    }

    // Delete from MongoDB
    try {
      const client = await clientPromise
      const db = client.db('grandproject')
      const collection = db.collection('resumes')

      await collection.deleteOne({ resumeId })
      console.log('Resume content deleted from MongoDB')
    } catch (mongoError) {
      console.error('Error deleting from MongoDB:', mongoError)
      // Continue even if MongoDB fails
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/resumes/[id]:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 