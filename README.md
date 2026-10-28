# CodeCoach AI

CodeCoach AI is a full-stack Python interview practice platform for developers. It includes a question bank, browser-based Python editor, deterministic test evaluation, AI feedback fallback logic, mock interview prompts, and progress tracking.

## Features

- 25+ seeded interview questions across Python, data structures, SQL, and AI/data-engineering topics
- Dashboard, practice workspace, mock interview, progress, and settings views
- Monaco-based editor with starter code, hint views, and reset actions
- Local development execution adapter with a clearly labeled development stub
- Deterministic AI feedback fallback for offline or missing API key scenarios
- Recharts-powered progress analytics and local persistence with browser storage

## Local development

1. Install dependencies
   ```bash
   npm install
   ```
2. Start the frontend
   ```bash
   npm run dev
   ```
3. Visit http://localhost:3000

## Environment variables

Copy `.env.example` to `.env.local` and update values as needed.

```bash
cp .env.example .env.local
```

The project is configured to run without an OpenAI key; fallback feedback is generated locally.

## Python execution adapter

This repository includes a FastAPI execution service under `backend/` for local development and deployment planning.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

The local execution mode is intentionally a development stub. It does not claim to execute untrusted Python in a secure sandbox. A production pipeline should use Docker with resource limits, dropped privileges, network denial, and restricted filesystem access.

## Deployment notes

- Frontend: Vercel / Next.js App Router
- Live API: FastAPI service on Render, Railway, Azure App Service, or similar
- Database: Supabase PostgreSQL with Row-Level Security and migrations
- Execution: Docker-based sandbox runner with resource limits and no host credentials
