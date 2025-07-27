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

  constructor() {
    this.baseUrl = 'https://umerrahman.app.n8n.cloud';
    this.apiKey = process.env.N8N_API_KEY;
  }

  async analyzeResume(payload: N8nWebhookPayload): Promise<N8nAnalysisResult> {
    try {
      console.log('Sending payload to n8n:', JSON.stringify(payload, null, 2));
      
      const response = await fetch(`${this.baseUrl}/webhook/resume-analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        },
        body: JSON.stringify(payload),
      });

      console.log('n8n response status:', response.status);
      console.log('n8n response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('n8n error response:', errorText);
        throw new Error(`n8n webhook failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('n8n raw response:', responseText);

      if (!responseText) {
        throw new Error('Empty response from n8n');
      }

      const result = JSON.parse(responseText);
      console.log('n8n parsed result:', result);
      
      return result;
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async getAnalysisStatus(analysisId: string): Promise<N8nAnalysisResult> {
    try {
      const response = await fetch(`${this.baseUrl}/webhook/analysis-status/${analysisId}`, {
        method: 'GET',
        headers: {
          ...(this.apiKey && { 'X-N8N-API-KEY': this.apiKey }),
        },
      });

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
}

export const n8nClient = new N8nClient(); 