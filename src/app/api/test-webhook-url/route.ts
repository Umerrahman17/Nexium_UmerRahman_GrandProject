import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const baseUrl = process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud'
    const testUrls = [
      `${baseUrl}/resume-analysis`,
      `${baseUrl}/resume-analysis/`,
      `${baseUrl}/webhook/resume-analysis`,
      `${baseUrl}/webhook/resume-analysis/`,
      `${baseUrl}/webhook`,
      `${baseUrl}/`
    ]

    const results = []

    for (const url of testUrls) {
      try {
        console.log(`Testing URL: ${url}`)
        
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000)
        
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Resume-Tailor-App/1.0',
          },
          body: JSON.stringify({ resume: 'Test resume content' }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)
        
        results.push({
          url,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        })
      } catch (error) {
        results.push({
          url,
          error: error instanceof Error ? error.message : 'Unknown error',
          status: 'ERROR'
        })
      }
    }

    return NextResponse.json({
      success: true,
      baseUrl,
      environment: {
        n8nUrl: process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud',
        hasApiKey: !!process.env.N8N_API_KEY,
        nodeEnv: process.env.NODE_ENV
      },
      testResults: results,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Webhook URL test failed:', error)
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