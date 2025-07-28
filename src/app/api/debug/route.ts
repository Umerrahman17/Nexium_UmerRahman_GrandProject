import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set',
        supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set',
        supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set',
        mongodbUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      },
      supabase: null as any,
      mongodb: null as any,
      error: null as string | null
    }

    // Test Supabase connection
    try {
      const supabase = createServerSupabaseClient()
      const { data: resumes, error } = await supabase
        .from('resumes')
        .select('count')
        .limit(1)
      
      debugInfo.supabase = {
        connected: !error,
        error: error?.message || null,
        resumesCount: resumes?.length || 0
      }
    } catch (error) {
      debugInfo.supabase = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        resumesCount: 0
      }
    }

    // Test MongoDB connection
    try {
      const client = await clientPromise
      const db = client.db('grandproject')
      const collection = db.collection('resumes')
      const count = await collection.countDocuments()
      
      debugInfo.mongodb = {
        connected: true,
        error: null,
        documentsCount: count
      }
    } catch (error) {
      debugInfo.mongodb = {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        documentsCount: 0
      }
    }

    return NextResponse.json(debugInfo)
  } catch (error) {
    return NextResponse.json({
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 