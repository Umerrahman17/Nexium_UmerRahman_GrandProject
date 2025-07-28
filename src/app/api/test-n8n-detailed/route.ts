import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Detailed n8n test starting ===')
    
    const body = await request.json()
    const { resumeContent } = body
    
    console.log('Test payload:', { contentLength: resumeContent?.length })
    
    // Call n8n analysis with the same payload as the analysis API
    const result = await n8nClient.analyzeResume({
      resume: resumeContent
    })
    
    console.log('=== Detailed n8n test result ===')
    console.log('Result:', JSON.stringify(result, null, 2))
    
    return NextResponse.json({
      success: true,
      n8nResult: result,
      resultType: typeof result,
      hasSuccess: 'success' in result,
      hasError: 'error' in result,
      successValue: result.success,
      errorValue: result.error,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Detailed n8n test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 