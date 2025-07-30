# AI-Powered Resume Tailor

This is a modern, full-stack web application that uses magic link email authentication for seamless and secure login. Users can upload their resumes, view uploaded resumes, and analyze them using AI workflows. They receive a score and personalized suggestions to improve their resumes.

Live Deployment: [https://nexium-umer-rahman-grand-project.vercel.app](https://nexium-umer-rahman-grand-project.vercel.app)

---

## Features

- Upload and manage resumes via Dashboard.
- AI-powered resume analysis (score + improvement suggestions).
- Re-analyze resumes anytime for updated feedback.
- Magic link email login (no password required).
- Clean and responsive UI with status indicators.
- CI/CD deployment with automatic updates on push.

---

## Tech Stack

- **Frontend:** Next.js (App Router), Tailwind CSS, ShadCN UI.
- **Backend:** Next.js API Routes, n8n Workflows.
- **Authentication:** Supabase Magic Link Auth.
- **Databases:** Supabase PostgreSQL (metadata), MongoDB Atlas (resume content & analysis).
- **Hosting:** Vercel (CI/CD with GitHub integration).

---

## Usage

1. Log in using the magic link sent to your email.
2. Upload your resume on the Dashboard.
3. View and manage uploaded resumes.
4. Analyze resumes to receive AI-driven feedback.
5. View score and improvement suggestions.
6. Re-analyze any resume anytime.

---

## Setup Instructions

1. Clone the repository & install dependencies:
   ```bash
   git clone https://github.com/Umerrahman17/Nexium_UmerRahman_GrandProject.git
   cd Nexium_UmerRahman_GrandProject
   npm install
   ```

2. Configure environment variables in a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   MONGODB_URI=your-mongodb-connection-string
   N8N_WEBHOOK_URL=your-n8n-webhook-url
   ```

3. Run locally:
   ```bash
   npm run dev
   # Open http://localhost:3000 in your browser.
   ```

4. GitHub Repository:
   [https://github.com/Umerrahman17/Nexium_UmerRahman_GrandProject](https://github.com/Umerrahman17/Nexium_UmerRahman_GrandProject)