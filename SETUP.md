# Setup Guide - Resume Tailor

This guide will help you set up the Resume Tailor application with all necessary external services.

## 🚀 Quick Start (Development Mode)

The application is now configured to run in **development mode** without external services. You can:

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Access the application:**
   - Open http://localhost:3000
   - Use mock authentication (any email will work)
   - Test all features with mock data

## 🔧 Full Setup (Production Ready)

To use real external services, follow these steps:

### 1. Supabase Setup

1. **Create a Supabase project:**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and API keys

2. **Configure environment variables:**
   Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

### 2. MongoDB Setup

1. **Create a MongoDB database:**
   - Use [MongoDB Atlas](https://mongodb.com/atlas) (free tier available)
   - Create a new cluster
   - Get your connection string

2. **Add MongoDB connection:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-tailor
   ```

### 3. OpenAI Setup

1. **Get OpenAI API key:**
   - Go to [platform.openai.com](https://platform.openai.com)
   - Create an account and get API key

2. **Add OpenAI key:**
   ```env
   OPENAI_API_KEY=sk-your_openai_api_key_here
   ```

### 4. n8n Setup (Optional for AI features)

1. **Set up n8n:**
   - Use [n8n.cloud](https://n8n.cloud) or self-host
   - Create webhook endpoints

2. **Add n8n configuration:**
   ```env
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
   ```

## 📁 Complete Environment File

Your `.env.local` should look like this:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/resume-tailor

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key_here

# n8n Configuration
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

## 🧪 Testing the Setup

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Test authentication:**
   - Go to http://localhost:3000/auth
   - Enter any email address
   - Check if authentication works

3. **Test API endpoints:**
   - Visit http://localhost:3000/api/health
   - Should return health status

4. **Test features:**
   - Upload a resume
   - Add a job description
   - Run analysis

## 🔍 Troubleshooting

### Common Issues:

1. **"supabaseUrl is required" error:**
   - Make sure `.env.local` exists
   - Check that environment variables are set correctly
   - Restart the development server

2. **Authentication not working:**
   - Verify Supabase credentials
   - Check browser console for errors
   - Ensure Supabase project is active

3. **API errors:**
   - Check server logs
   - Verify environment variables
   - Test API endpoints directly

### Development Mode:

If you want to continue development without external services:
- The app will use mock data
- Authentication will work with any email
- All features will function with simulated data

## 🚀 Deployment

### Vercel Deployment:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Connect your GitHub repository
   - Add environment variables in Vercel dashboard
   - Deploy automatically

### Environment Variables for Production:

Make sure to add all environment variables in your deployment platform's dashboard.

## 📞 Support

If you encounter issues:
1. Check the browser console for errors
2. Review the server logs
3. Verify all environment variables are set
4. Test with development mode first

---

**Happy coding! 🎉** 