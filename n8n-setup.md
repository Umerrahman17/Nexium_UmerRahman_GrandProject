# n8n Setup Guide for GrandProject

## 🚀 **Overview**
This guide will help you set up n8n for AI-powered resume analysis in the GrandProject application.

## 📋 **Prerequisites**
- Node.js installed
- OpenAI API key
- n8n account (free tier available)

## 🔧 **Step 1: Install n8n**

### Option A: Local Installation
```bash
npm install -g n8n
```

### Option B: Docker Installation
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

## 🔑 **Step 2: Configure Environment Variables**

Add these to your `.env.local` file:
```bash
# n8n Configuration
N8N_WEBHOOK_URL=http://localhost:5678
N8N_API_KEY=your_n8n_api_key_here

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here
```

## 🏗️ **Step 3: Import the Workflow**

1. **Start n8n:**
   ```bash
   n8n
   ```

2. **Access n8n UI:**
   - Open http://localhost:5678
   - Create an account or sign in

3. **Import the workflow:**
   - Go to Workflows
   - Click "Import from file"
   - Select `n8n-workflows/resume-analysis.json`

## ⚙️ **Step 4: Configure OpenAI Credentials**

1. **In n8n UI:**
   - Go to Settings → Credentials
   - Click "Add Credential"
   - Select "OpenAI API"
   - Enter your OpenAI API key
   - Save as "OpenAI API"

2. **Update the workflow:**
   - Open the imported workflow
   - Click on "OpenAI Analysis" node
   - Select your OpenAI credential
   - Save the workflow

## 🔗 **Step 5: Activate the Workflow**

1. **Activate the workflow:**
   - Click the "Active" toggle in the workflow
   - The webhook will be available at: `http://localhost:5678/webhook/resume-analysis`

2. **Test the webhook:**
   ```bash
   curl -X POST http://localhost:5678/webhook/resume-analysis \
     -H "Content-Type: application/json" \
     -d '{
       "resumeId": "test-123",
       "resumeContent": "John Doe\nSoftware Engineer\nSkills: JavaScript, React, Node.js",
       "userId": "user-123",
       "fileName": "test-resume.txt",
       "fileType": "text/plain"
     }'
   ```

## 🎯 **Step 6: Update Application Configuration**

The application is already configured to:
- Send resume data to n8n webhook
- Handle analysis callbacks
- Store results in Supabase and MongoDB

## 🔍 **Step 7: Test the Integration**

1. **Upload a resume** through the application
2. **Check n8n execution logs** to see the workflow running
3. **Verify results** are stored in the database

## 📊 **Workflow Details**

### **Input (Webhook Trigger)**
- `resumeId`: Unique identifier for the resume
- `resumeContent`: Text content of the resume
- `userId`: User who uploaded the resume
- `fileName`: Original filename
- `fileType`: File type (e.g., "text/plain", "application/pdf")

### **Processing (OpenAI Analysis)**
- Analyzes resume content using GPT-4
- Extracts skills, experience, education
- Provides recommendations and scoring

### **Output (Callback)**
- `analysisId`: Unique analysis identifier
- `insights`: Structured analysis results
- `success`: Boolean indicating success/failure

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **Webhook not accessible:**
   - Ensure n8n is running on port 5678
   - Check firewall settings
   - Verify webhook URL in application

2. **OpenAI API errors:**
   - Verify API key is correct
   - Check API quota and billing
   - Ensure proper credential configuration

3. **Callback failures:**
   - Check if Next.js app is running
   - Verify callback URL is correct
   - Check network connectivity

### **Debug Steps:**
1. Check n8n execution logs
2. Monitor application console logs
3. Verify database connections
4. Test webhook endpoints manually

## 🔄 **Production Deployment**

For production, consider:
- Using n8n cloud or self-hosted instance
- Setting up proper authentication
- Using environment-specific webhook URLs
- Implementing retry mechanisms
- Adding monitoring and logging

## 📈 **Next Steps**

After n8n is set up:
1. Test resume upload and analysis
2. Implement job matching algorithms
3. Add more AI analysis features
4. Set up monitoring and alerts
5. Deploy to production environment 