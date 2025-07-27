# Resume Tailor - AI-Powered Resume Optimization

An intelligent web application that uses AI to optimize resumes for specific job descriptions, providing match scores and improvement suggestions.

## 🚀 Features

### Core Functionality
- **Magic Link Authentication** - Secure, passwordless login via email
- **Resume Upload & Analysis** - Upload PDF/DOCX resumes for AI processing
- **Job Description Matching** - Compare resumes against job requirements
- **AI-Powered Optimization** - Get tailored resume improvements
- **ATS Compatibility** - Ensure resumes pass Applicant Tracking Systems
- **Real-time Analysis** - Instant feedback and scoring

### Technical Features
- **Next.js 14** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Beautiful, accessible components
- **Supabase** - Authentication and database
- **MongoDB** - Document storage for resumes and analysis
- **n8n Workflows** - AI orchestration and processing
- **Vercel Deployment** - CI/CD and hosting

## 🏗️ Architecture

```
Frontend (Next.js)
├── Authentication (Supabase Magic Links)
├── Dashboard & Analytics
├── Resume Management
├── Job Description Analysis
└── Real-time Optimization

Backend (n8n + APIs)
├── Resume Processing Workflows
├── AI Analysis (OpenAI)
├── Job Description Parsing
├── Matching Algorithms
└── Optimization Engine

Database
├── Supabase (Auth, Metadata)
└── MongoDB (Resumes, Analysis, Jobs)
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: n8n Workflows, OpenAI API
- **Database**: Supabase, MongoDB
- **Authentication**: Supabase Auth (Magic Links)
- **Deployment**: Vercel
- **File Storage**: Supabase Storage
- **Real-time**: Supabase Realtime

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- MongoDB database
- OpenAI API key
- n8n instance

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd grandproject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # MongoDB Configuration
   MONGODB_URI=your_mongodb_connection_string

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # n8n Configuration
   N8N_WEBHOOK_URL=your_n8n_webhook_url
   ```

4. **Database Setup**
   - Create Supabase project
   - Set up MongoDB database
   - Configure collections and indexes

5. **n8n Workflows**
   - Import workflow files from `/workflows/`
   - Configure webhook endpoints
   - Set up OpenAI API integration

6. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
MONGODB_URI=your_mongodb_uri
OPENAI_API_KEY=your_openai_key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

## 📁 Project Structure

```
grandproject/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── auth/              # Authentication pages
│   │   ├── dashboard/         # Dashboard
│   │   ├── resumes/          # Resume management
│   │   ├── jobs/             # Job descriptions
│   │   ├── analysis/         # Analysis results
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   └── forms/           # Form components
│   ├── lib/                 # Utilities and configs
│   │   ├── supabase.ts      # Supabase client
│   │   ├── mongodb.ts       # MongoDB connection
│   │   └── utils.ts         # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript definitions
│   └── utils/               # Utility functions
├── workflows/               # n8n workflow files
├── docs/                    # Documentation
└── public/                  # Static assets
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signin` - Magic link sign in
- `POST /api/auth/signout` - Sign out

### Resumes
- `GET /api/resumes` - Get user resumes
- `POST /api/resumes` - Upload new resume
- `GET /api/resumes/[id]` - Get specific resume
- `PUT /api/resumes/[id]` - Update resume
- `DELETE /api/resumes/[id]` - Delete resume

### Job Descriptions
- `GET /api/jobs` - Get user job descriptions
- `POST /api/jobs` - Create new job description
- `GET /api/jobs/[id]` - Get specific job
- `PUT /api/jobs/[id]` - Update job description
- `DELETE /api/jobs/[id]` - Delete job description

### Analysis
- `POST /api/analysis` - Analyze resume against job
- `GET /api/analysis/[id]` - Get analysis results
- `POST /api/optimization` - Optimize resume

### n8n Webhooks
- `POST /api/webhooks/resume-analysis` - Resume analysis webhook
- `POST /api/webhooks/job-analysis` - Job analysis webhook
- `POST /api/webhooks/optimization` - Optimization webhook

## 🤖 n8n Workflows

### 1. Resume Analysis Workflow
- **Trigger**: Webhook from Next.js
- **Process**: Extract text, parse sections, identify skills
- **Output**: Structured resume data

### 2. Job Description Analysis Workflow
- **Trigger**: Webhook with job description
- **Process**: Extract requirements, skills, experience level
- **Output**: Structured job requirements

### 3. Matching & Scoring Workflow
- **Trigger**: Both resume and job data ready
- **Process**: AI comparison, scoring, gap analysis
- **Output**: Match score and suggestions

### 4. Optimization Workflow
- **Trigger**: User requests optimization
- **Process**: AI content generation, restructuring
- **Output**: Optimized resume content

## 🔒 Security

- **Authentication**: Supabase magic links (passwordless)
- **Authorization**: User-based access control
- **Data Protection**: Encrypted data transmission
- **File Upload**: Secure file validation and storage
- **API Security**: Rate limiting and validation

## 📊 Performance

- **Frontend**: Next.js optimization, code splitting
- **Backend**: Efficient n8n workflows, caching
- **Database**: Optimized queries, indexing
- **CDN**: Vercel edge network
- **Monitoring**: Real-time performance tracking

## 🧪 Testing

```bash
# Run tests
npm run test

# Run e2e tests
npm run test:e2e

# Run type checking
npm run type-check

# Run linting
npm run lint
```

## 📈 Analytics

- User engagement metrics
- Resume optimization success rates
- Job application outcomes
- Performance monitoring
- Error tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🗺️ Roadmap

### Phase 1 (Current)
- ✅ Basic authentication
- ✅ Resume upload and storage
- ✅ Job description analysis
- ✅ Basic matching algorithm

### Phase 2 (Next)
- 🔄 Advanced AI optimization
- 🔄 Real-time collaboration
- 🔄 Mobile app
- 🔄 Advanced analytics

### Phase 3 (Future)
- 📋 Multi-language support
- 📋 Enterprise features
- 📋 API marketplace
- 📋 Advanced integrations

---

**Built with ❤️ using Next.js, Supabase, and AI**
