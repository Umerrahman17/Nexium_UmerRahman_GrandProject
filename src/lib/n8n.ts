// n8n Webhook Client Configuration
export interface N8nWebhookPayload {
  resume: string; // n8n workflow expects just the resume text content
}

export interface N8nAnalysisResult {
  success: boolean;
  score?: number;
  aspectScores?: Record<string, number>;
  recommendations?: string[];
  flags?: string[];
  insights?: any;
  error?: string;
}

class N8nClient {
  private baseUrl: string;
  private apiKey?: string;
  private timeout: number;

  constructor() {
    // Allow environment variable override for n8n URL
    // The base URL should be the n8n instance URL, not the full webhook URL
    this.baseUrl = process.env.N8N_WEBHOOK_URL || 'https://umerrahman.app.n8n.cloud';
    this.apiKey = process.env.N8N_API_KEY;
    this.timeout = 30000; // 30 seconds timeout
  }

  async analyzeResume(payload: N8nWebhookPayload): Promise<N8nAnalysisResult> {
    try {
      console.log('=== n8n analyzeResume called ===');
      console.log('n8n configuration:', {
        baseUrl: this.baseUrl,
        hasApiKey: !!this.apiKey,
        payloadSize: JSON.stringify(payload).length
      });
      
      console.log('Sending payload to n8n:', JSON.stringify(payload, null, 2));
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      // Based on the test results, the correct webhook URL is:
      // https://umerrahman.app.n8n.cloud/webhook/resume-analysis/
      let webhookUrl;
      if (this.baseUrl.includes('/webhook/resume-analysis')) {
        // If the base URL already contains the full webhook path, use it as is
        webhookUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
      } else if (this.baseUrl.includes('/webhook/')) {
        // If it's a webhook URL but not the specific one, use it as is
        webhookUrl = this.baseUrl;
      } else {
        // Otherwise, construct the webhook URL
        webhookUrl = `${this.baseUrl}/webhook/resume-analysis/`;
      }
      
      console.log('Using webhook URL:', webhookUrl);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Resume-Tailor-App/1.0',
          ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('n8n response status:', response.status);
      console.log('n8n response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('n8n error response:', errorText);
        
        // Provide more specific error messages
        let errorMessage = `n8n webhook failed: ${response.status} ${response.statusText}`;
        if (response.status === 404) {
          errorMessage = 'n8n workflow not found. Please check if the workflow is active.';
        } else if (response.status === 500) {
          errorMessage = 'n8n workflow execution failed. Please check the workflow configuration.';
        } else if (response.status === 403) {
          errorMessage = 'n8n access denied. Please check API key configuration.';
        }
        
        console.log('=== n8n analyzeResume returning error ===');
        return {
          success: false,
          error: `${errorMessage} - ${errorText}`
        };
      }

      const responseText = await response.text();
      console.log('n8n raw response:', responseText);

      if (!responseText) {
        console.log('=== n8n analyzeResume returning empty response error ===');
        return {
          success: false,
          error: 'Empty response from n8n'
        };
      }

      let result;
      try {
        result = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse n8n response:', parseError);
        console.log('=== n8n analyzeResume returning parse error ===');
        return {
          success: false,
          error: `Invalid JSON response from n8n: ${responseText.substring(0, 200)}`
        };
      }
      
      console.log('n8n parsed result:', result);
      
      // Validate the result structure
      if (!result || typeof result !== 'object') {
        console.log('=== n8n analyzeResume returning invalid format error ===');
        return {
          success: false,
          error: 'Invalid response format from n8n'
        };
      }
      
      // Handle asynchronous workflow response
      if (result.message === 'Workflow was started') {
        console.log('=== n8n analyzeResume returning local analysis ===');
        // The workflow started successfully but is running asynchronously
        // Perform local analysis instead of returning generic fallback
        return this.analyzeResumeLocally(payload.resume);
      }
      
      // Check if the result has the expected structure
      if (result.success === true && typeof result.score === 'number') {
        console.log('=== n8n analyzeResume returning success ===');
        return result;
      }
      
      // If we get here, the result doesn't have the expected structure
      console.log('=== n8n analyzeResume returning unexpected format ===');
      return {
        success: false,
        error: `Unexpected response format from n8n: ${JSON.stringify(result).substring(0, 200)}`
      };
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = 'n8n request timed out. Please check if the workflow is responding.';
        } else if (error.message.includes('fetch')) {
          errorMessage = 'Cannot connect to n8n. Please check the webhook URL and network connection.';
        } else {
          errorMessage = error.message;
        }
      }
      
      console.log('=== n8n analyzeResume returning catch error ===');
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async getAnalysisStatus(analysisId: string): Promise<N8nAnalysisResult> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(`${this.baseUrl}/webhook/analysis-status/${analysisId}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'Resume-Tailor-App/1.0',
          ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`n8n status check failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking n8n analysis status:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  // Test connection method
  async testConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('Testing n8n connection to:', this.baseUrl);
      
      // Test the webhook URL construction
      let webhookUrl;
      if (this.baseUrl.includes('/webhook/resume-analysis')) {
        webhookUrl = this.baseUrl.endsWith('/') ? this.baseUrl : `${this.baseUrl}/`;
      } else if (this.baseUrl.includes('/webhook/')) {
        webhookUrl = this.baseUrl;
      } else {
        webhookUrl = `${this.baseUrl}/webhook/resume-analysis/`;
      }
      
      console.log('Test connection using webhook URL:', webhookUrl);
      
      const testPayload = { resume: 'Test resume content for connection testing.' };
      
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Resume-Tailor-App/1.0',
          ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        },
        body: JSON.stringify(testPayload),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      console.log('Test connection response status:', response.status);
      console.log('Test connection response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Test connection error response:', errorText);
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          details: {
            baseUrl: this.baseUrl,
            webhookUrl,
            hasApiKey: !!this.apiKey,
            status: response.status,
            statusText: response.statusText
          }
        };
      }
      
      const responseText = await response.text();
      console.log('Test connection success response:', responseText);
      
      return {
        success: true,
        details: {
          baseUrl: this.baseUrl,
          webhookUrl,
          hasApiKey: !!this.apiKey,
          responseLength: responseText.length
        }
      };
    } catch (error) {
      console.error('Test connection error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        details: {
          baseUrl: this.baseUrl,
          hasApiKey: !!this.apiKey
        }
      };
    }
  }

  // Local resume analysis function
  private analyzeResumeLocally(resumeContent: string): N8nAnalysisResult {
    console.log('=== Performing local resume analysis ===');
    
    const resume = resumeContent.toLowerCase();
    const wordCount = resume.split(/\s+/).length;
    
    // Initialize aspect scores
    const aspectScores: Record<string, number> = {};
    const flags: string[] = [];
    const recommendations: string[] = [];
    
    // 1. Content Length (0-100)
    let lengthScore = 0;
    if (wordCount > 100 && wordCount < 800) {
      lengthScore = 100;
    } else if (wordCount > 50 && wordCount < 1000) {
      lengthScore = 70;
    } else if (wordCount <= 50) {
      lengthScore = 30;
      flags.push('Resume too short');
      recommendations.push('Add more content to your resume');
    } else {
      lengthScore = 50;
      flags.push('Resume too long');
      recommendations.push('Condense your resume to 1-2 pages');
    }
    aspectScores['Length'] = lengthScore;
    
    // 2. Skills Section (0-100)
    const skillsKeywords = ['skills', 'technologies', 'tools', 'programming', 'languages'];
    const hasSkills = skillsKeywords.some(keyword => resume.includes(keyword));
    const skillsScore = hasSkills ? 100 : 0;
    aspectScores['Skills'] = skillsScore;
    if (!hasSkills) {
      flags.push('No skills section');
      recommendations.push('Add a dedicated skills section');
    }
    
    // 3. Education Section (0-100)
    const educationKeywords = ['education', 'degree', 'bachelor', 'master', 'phd', 'university', 'college'];
    const hasEducation = educationKeywords.some(keyword => resume.includes(keyword));
    const educationScore = hasEducation ? 100 : 0;
    aspectScores['Education'] = educationScore;
    if (!hasEducation) {
      flags.push('No education section');
      recommendations.push('Include your educational background');
    }
    
    // 4. Experience Section (0-100)
    const experienceKeywords = ['experience', 'work', 'job', 'employment', 'position'];
    const hasExperience = experienceKeywords.some(keyword => resume.includes(keyword));
    const experienceScore = hasExperience ? 100 : 0;
    aspectScores['Experience'] = experienceScore;
    if (!hasExperience) {
      flags.push('No experience section');
      recommendations.push('Add your work experience');
    }
    
    // 5. Quantifiable Achievements (0-100)
    const quantifyRegex = /\b(\d+%?|\$\d+|[0-9]+ projects?|[0-9]+ people|[0-9]+ clients?)\b/gi;
    const quantifyMatches = resume.match(quantifyRegex) || [];
    const quantifyScore = Math.min(100, quantifyMatches.length * 20);
    aspectScores['Quantified Achievements'] = quantifyScore;
    if (quantifyScore < 50) {
      flags.push('Few quantifiable achievements');
      recommendations.push('Add specific numbers and metrics to your achievements');
    }
    
    // 6. Action Verbs (0-100)
    const actionVerbs = ['developed', 'implemented', 'created', 'managed', 'led', 'designed', 'built', 'improved', 'increased', 'reduced'];
    const actionVerbCount = actionVerbs.filter(verb => resume.includes(verb)).length;
    const actionVerbScore = Math.min(100, actionVerbCount * 20);
    aspectScores['Action Verbs'] = actionVerbScore;
    if (actionVerbScore < 50) {
      flags.push('Weak action verbs');
      recommendations.push('Use strong action verbs to describe your achievements');
    }
    
    // 7. Contact Information (0-100)
    const contactRegex = /(email|phone|@|\.com|linkedin)/i;
    const hasContact = contactRegex.test(resume);
    const contactScore = hasContact ? 100 : 0;
    aspectScores['Contact Info'] = contactScore;
    if (!hasContact) {
      flags.push('Missing contact information');
      recommendations.push('Add your email and phone number');
    }
    
    // 8. Professional Summary (0-100)
    const summaryKeywords = ['summary', 'objective', 'profile', 'overview'];
    const hasSummary = summaryKeywords.some(keyword => resume.includes(keyword));
    const summaryScore = hasSummary ? 100 : 0;
    aspectScores['Professional Summary'] = summaryScore;
    if (!hasSummary) {
      flags.push('No professional summary');
      recommendations.push('Add a brief professional summary at the top');
    }
    
    // 9. Bullet Points (0-100)
    const bulletRegex = /\n[-*] (.+)/g;
    const bullets = [...resume.matchAll(bulletRegex)].map(m => m[1]);
    const bulletScore = bullets.length > 0 ? Math.min(100, bullets.length * 10) : 0;
    aspectScores['Bullet Points'] = bulletScore;
    if (bulletScore < 50) {
      flags.push('Few bullet points');
      recommendations.push('Use bullet points to highlight key achievements');
    }
    
    // 10. Buzzwords Check (0-100)
    const buzzwords = ['synergy', 'hardworking', 'dynamic', 'go-getter', 'results-driven', 'detail-oriented', 'team player', 'innovative', 'passionate', 'motivated'];
    const foundBuzzwords = buzzwords.filter(bw => resume.includes(bw));
    const buzzwordScore = foundBuzzwords.length === 0 ? 100 : Math.max(0, 100 - (foundBuzzwords.length * 10));
    aspectScores['Buzzword Usage'] = buzzwordScore;
    if (foundBuzzwords.length > 2) {
      flags.push('Overuse of buzzwords');
      recommendations.push('Replace generic buzzwords with specific achievements');
    }
    
    // Calculate overall score
    const scores = Object.values(aspectScores);
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    
    // Add general recommendations based on score
    if (overallScore < 60) {
      recommendations.push('Consider a complete resume rewrite');
    } else if (overallScore < 80) {
      recommendations.push('Focus on the flagged areas for improvement');
    } else {
      recommendations.push('Your resume is well-structured. Consider minor refinements.');
    }
    
    return {
      success: true,
      score: overallScore,
      aspectScores,
      recommendations,
      flags,
      insights: {
        wordCount,
        foundBuzzwords,
        quantifyMatches: quantifyMatches.length,
        actionVerbCount,
        bulletCount: bullets.length
      }
    };
  }
}

export const n8nClient = new N8nClient(); 