import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const baseUrl = process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud';
    
    const urlVariations = [
      baseUrl,
      `${baseUrl}/resume-analysis`,
      `${baseUrl}/webhook/resume-analysis`,
      `${baseUrl}/webhook`,
      `${baseUrl}/`
    ];

    return NextResponse.json({
      success: true,
      environment: {
        N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
        N8N_API_KEY: process.env.N8N_API_KEY ? 'Set' : 'Not set',
        NODE_ENV: process.env.NODE_ENV
      },
      baseUrl,
      urlVariations,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 