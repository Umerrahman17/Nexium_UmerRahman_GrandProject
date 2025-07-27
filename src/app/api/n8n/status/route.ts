import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const n8nUrl = 'https://umerrahman.app.n8n.cloud'
    const n8nApiKey = process.env.N8N_API_KEY

    // Check if n8n is accessible
    let n8nStatus = 'unknown'
    let n8nError = null

    try {
      const response = await fetch(`${n8nUrl}/healthz`, {
        method: 'GET',
        headers: {
          ...(n8nApiKey && { 'X-N8N-API-KEY': n8nApiKey }),
        },
      })

      if (response.ok) {
        n8nStatus = 'connected'
      } else {
        n8nStatus = 'error'
        n8nError = `HTTP ${response.status}: ${response.statusText}`
      }
    } catch (error) {
      n8nStatus = 'unreachable'
      n8nError = error instanceof Error ? error.message : 'Unknown error'
    }

    // Check webhook endpoint
    let webhookStatus = 'unknown'
    let webhookError = null

    try {
      const webhookResponse = await fetch(`${n8nUrl}/webhook/resume-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(n8nApiKey && { 'X-N8N-API-KEY': n8nApiKey }),
        },
        body: JSON.stringify({ resume: 'test' })
      })

      if (webhookResponse.status === 200) {
        webhookStatus = 'available'
      } else if (webhookResponse.status === 204) {
        webhookStatus = 'available'
      } else {
        webhookStatus = 'error'
        webhookError = `HTTP ${webhookResponse.status}: ${webhookResponse.statusText}`
      }
    } catch (error) {
      webhookStatus = 'unreachable'
      webhookError = error instanceof Error ? error.message : 'Unknown error'
    }

    return NextResponse.json({
      n8n: {
        url: n8nUrl,
        status: n8nStatus,
        error: n8nError,
        apiKeyConfigured: !!n8nApiKey
      },
      webhook: {
        url: `${n8nUrl}/webhook/resume-analysis`,
        status: webhookStatus,
        error: webhookError
      },
      environment: {
        n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || 'Not set',
        n8nApiKey: n8nApiKey ? 'Set (hidden)' : 'Not set',
        openaiApiKey: process.env.OPENAI_API_KEY ? 'Set (hidden)' : 'Not set'
      },
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error checking n8n status:', error)
    return NextResponse.json({ 
      error: 'Failed to check n8n status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 