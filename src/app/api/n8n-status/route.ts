import { NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function GET() {
  try {
    console.log('Checking n8n status...')
    
    const connectionTest = await n8nClient.testConnection()
    
    return NextResponse.json({
      success: true,
      n8nStatus: connectionTest,
      environment: {
        n8nUrl: process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud',
        hasApiKey: !!process.env.N8N_API_KEY,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('n8n status check failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        n8nUrl: process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud',
        hasApiKey: !!process.env.N8N_API_KEY,
        nodeEnv: process.env.NODE_ENV
      },
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
} 