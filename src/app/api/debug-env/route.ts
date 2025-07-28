import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    success: true,
    environment: {
      N8N_WEBHOOK_URL: process.env.N8N_WEBHOOK_URL,
      N8N_API_KEY: process.env.N8N_API_KEY ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV,
      // Show the raw value to check for any hidden characters
      N8N_WEBHOOK_URL_LENGTH: process.env.N8N_WEBHOOK_URL?.length,
      N8N_WEBHOOK_URL_CHARS: process.env.N8N_WEBHOOK_URL?.split('').map(c => c.charCodeAt(0))
    },
    timestamp: new Date().toISOString()
  })
} 