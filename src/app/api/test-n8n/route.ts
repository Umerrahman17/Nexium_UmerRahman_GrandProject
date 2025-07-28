import { NextRequest, NextResponse } from 'next/server'
import { n8nClient } from '@/lib/n8n'

export async function POST(request: NextRequest) {
  try {
    console.log('Testing n8n connection...')
    
    // Test the connection first
    const connectionTest = await n8nClient.testConnection()
    console.log('Connection test result:', connectionTest)
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: connectionTest.error,
        details: connectionTest.details,
        message: 'n8n connection failed. Check the webhook URL and workflow status.'
      })
    }
    
    const testResume = `John Doe
Software Engineer
Email: john.doe@email.com
Phone: (555) 123-4567

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years developing web applications using modern technologies including React, Node.js, and TypeScript.

SKILLS
• Programming Languages: JavaScript, TypeScript, Python, Java
• Frontend: React, Vue.js, HTML5, CSS3, Bootstrap
• Backend: Node.js, Express.js, Python Flask, Java Spring
• Databases: MongoDB, PostgreSQL, MySQL
• Tools: Git, Docker, AWS, Jenkins

EXPERIENCE
Senior Software Engineer | TechCorp | 2022-Present
• Led development of microservices architecture serving 1M+ users
• Implemented CI/CD pipelines reducing deployment time by 60%
• Mentored junior developers and conducted code reviews

Software Engineer | StartupXYZ | 2020-2022
• Built responsive web applications using React and Node.js
• Integrated third-party APIs and payment systems
• Collaborated with design team to implement UI/UX improvements

EDUCATION
Bachelor of Science in Computer Science
University of Technology | 2020

CERTIFICATIONS
• AWS Certified Developer Associate
• MongoDB Certified Developer`

    console.log('Sending test resume to n8n...')
    
    const result = await n8nClient.analyzeResume({
      resume: testResume
    })

    console.log('n8n test result:', result)

    return NextResponse.json({
      success: true,
      connectionTest,
      n8nResult: result,
      testResumeLength: testResume.length,
      environment: {
        n8nUrl: process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud',
        hasApiKey: !!process.env.N8N_API_KEY
      }
    })
  } catch (error) {
    console.error('n8n test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: {
        n8nUrl: process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud',
        hasApiKey: !!process.env.N8N_API_KEY
      }
    }, { status: 500 })
  }
} 